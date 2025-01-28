import { engine, MeshRenderer, Transform, TransformType } from "@dcl/sdk/ecs"
import { CANNON } from "../helpers/libraries"
import { COMPONENT_TYPES, Triggers } from "../helpers/types"
import { world } from "../physics"
import { getEntity } from "./iwb"
import { Quaternion, Vector3 } from "@dcl/sdk/math"
import { getWorldPosition } from "@dcl-sdk/utils"
import { colyseusRoom, connected } from "./Colyseus"
import { localPlayer } from "./Player"
import { runSingleTrigger } from "./Triggers"
import { getAssetIdByEntity } from "./Parenting"
import { scene } from "../ui/Objects/SceneMainDetailPanel"
import { updateTransform } from "./Transform"

export let pendingBodies:any[] = []
export let cannonMaterials:Map<string,CANNON.Material> = new Map()
export let cannonContactMaterials:Map<string,CANNON.ContactMaterial> = new Map()

// Store pending contact materials to retry when materials are available
const pendingContactMaterials: Array<{ from: string, to: string, contactData: any }> = [];


//    // Ball-Ground contact (bouncy)
//    const playerBallContactMaterial = new CANNON.ContactMaterial(playerMaterial, ballMaterial, {
//     friction: 0.3,    // Friction when ball touches ground
//     restitution: 0.5  // High bounciness for the ball
//   }
// );//

export let testEntities:Map<string, any> = new Map()

export function physicsListener(scene:any){
    scene[COMPONENT_TYPES.PHYSICS_COMPONENT].onRemove((physicsData:any, aid:any)=>{
        //todo
        //check for physics body and remove from world//
        if(physicsData.cannonBody){
            console.log('disabling deleted physics body')
            physicsData.cannonBody.collisionFilterMask = 0
        }
    })

    scene[COMPONENT_TYPES.PHYSICS_COMPONENT].onAdd((physicsData:any, aid:any)=>{
        console.log('physics added', physicsData)
        let entityInfo = getEntity(scene, aid)

        let iwbInfo = scene[COMPONENT_TYPES.IWB_COMPONENT].get(aid)

        if(!entityInfo || !iwbInfo){
            return
        }

        // physicsData.cannonContactMaterials = new Map()

        // switch(physicsData.type){
        //     case 0: //configuration
            // console.log('setting physics configuration')//
                // if(physicsData.materials){
                //     physicsData.materials.forEach((material:string)=>{
                //         cannonMaterials.set(material, new CANNON.Material(material))
                //     })
                // }
                // break;//

            // case 1:
                // pendingBodies.push({sceneId:scene.id, data:physicsData, retries:0, aid:entityInfo.aid, entity:entityInfo.entity})

                physicsData.listen("type", (current:any, previous:any)=>{
                    console.log('physics type changed', previous, current)
                    if(current === 1){
                        checkPhysicsBody(scene.id, aid, entityInfo.entity, physicsData)
                    }
                })

                // Listen for material additions from the schema
                physicsData.materials.onAdd((material: string) => {
                    addCannonMaterial(material)
                });

                 // Listen for material additions from the schema
                 physicsData.contactMaterials.onAdd((contactMaterial:any, name:string) => {
                    // Attempt to create the contact material, or add it to pending if materials are not available
                    createContactMaterial(name, contactMaterial);

                    contactMaterial.listen("friction", (current:any, previous:any)=>{
                        if(previous !== undefined){
                            updateContactMaterial(name, contactMaterial)
                        }
                    })

                    contactMaterial.listen("bounce", (current:any, previous:any)=>{
                        if(previous !== undefined){
                            updateContactMaterial(name, contactMaterial)
                        }
                    })
                });

                physicsData.contactMaterials.onRemove((contactMaterial:any, id:string) => {
                    console.log("removed contact material", id)
                    let cm = cannonContactMaterials.get(id)
                    if(cm){
                        // Nullify the contact material's effect by setting friction and restitution to zero
                        cm.friction = 0;
                        cm.restitution = 0;
                        cannonContactMaterials.delete(id)
                        //remove world contact material
                    }
                });

                physicsData.listen("material", (current:any, previous:any)=>{
                    console.log('physics material changed', previous, current)
                    checkPhysicsBody(scene.id, aid, entityInfo.entity, physicsData)
                })

                physicsData.listen("mass", (current:any, previous:any)=>{
                    console.log('physics mass changed', previous, current)
                    checkPhysicsBody(scene.id, aid, entityInfo.entity, physicsData)
                })
            
                physicsData.listen("linearDamping", (current:any, previous:any)=>{
                    console.log('physics linearDamping changed', previous, current)
                    checkPhysicsBody(scene.id, aid, entityInfo.entity, physicsData)
                })

                physicsData.offset && physicsData.offset.onChange((current:any, previous:any)=>{
                    // console.log('physics fixedRotation changed', previous, current)
                    checkPhysicsBody(scene.id, aid, entityInfo.entity, physicsData)
                })

                physicsData.size && physicsData.size.onChange((current:any, previous:any)=>{
                    // console.log('physics fixedRotation changed', previous, current)
                    checkPhysicsBody(scene.id, aid, entityInfo.entity, physicsData)
                })



                // physicsData.offset && physicsData.offset.listen("x", (current:any, previous:any)=>{
                //     console.log('physics fixedRotation changed', previous, current)
                //     checkPhysicsBody(scene.id, aid, entityInfo.entity, physicsData)
                // })

                physicsData.listen("fixedRotation", (current:any, previous:any)=>{
                    console.log('physics fixedRotation changed', previous, current)
                    checkPhysicsBody(scene.id, aid, entityInfo.entity, physicsData)
                })
                // break;
        // }
    })

    scene[COMPONENT_TYPES.PHYSICS_COMPONENT].onRemove((physicsData:any, aid:any)=>{
        let physicsInfo = scene[COMPONENT_TYPES.PHYSICS_COMPONENT].get(aid)
        if(physicsData.type < 1){
            cannonContactMaterials.clear()
            cannonMaterials.forEach((data:any, material:string)=>{
                if(!["player", "vehicle", "ground"].includes(material)){
                    cannonMaterials.delete(material)
                }
            })
        }
    })
}

export function updateContactMaterial(name:string, material:any){
    let contactMaterial = cannonContactMaterials.get(name)
    if(!contactMaterial){
        console.log('cnnot find contact material to update')
        return
    }
    contactMaterial.friction = material.friction
    contactMaterial.restitution = material.bounce
    console.log('updated contact material', material)
}

export function checkPhysicsBody(sceneId:string, aid:string, entity:any, physicsData:any){
    let pendingBody = pendingBodies.find(($:any)=> $.aid === aid)
    if(pendingBody){
        console.log('already found pending body, just need to update')
        pendingBody.data = {...physicsData}
    }else{
        console.log('adding cannon body to pending updates')
        pendingBodies.push({data:physicsData, retries:0, aid:aid, entity:entity, sceneId:sceneId})
    }
}

let timer = 0
export function ProcessPendingPhysicsBodies(dt:number){
    if(timer > 0){
        timer -= dt
    }
    else{
        timer = 1
        // console.log('checking pending bodies', cannonMaterials.size, pendingBodies.length)
        pendingBodies.forEach(async (body:any)=>{
            console.log('pending body is', body)
            if(checkPhysicsRequirements(body.data)){
                console.log('passed all physics requirements')
                let index = pendingBodies.findIndex(($:any)=> $.aid === body.aid)
                if(index >= 0){
                    pendingBodies.splice(index,1)
                }

                let scene = colyseusRoom.state.scenes.get(body.sceneId)
                if(scene){
                    let physicsData = scene[COMPONENT_TYPES.PHYSICS_COMPONENT].get(body.aid)
                    let transform = Transform.get(body.entity)
                    let worldPosition = getWorldPosition(body.entity)

                    if(physicsData){
                        console.log('body has all requirements, add to engine')
                        if(world.bodies.includes(physicsData.cannonBody)){
                            console.log('world already has physics body, need to clear collision masks')
                            physicsData.cannonBody.mass = physicsData.mass
                            physicsData.cannonBody.material = cannonMaterials.get(physicsData.material)
                            physicsData.cannonBody.linearDamping = physicsData.linearDamping
                            physicsData.cannonBody.angularDamping = physicsData.angularDamping
                            physicsData.cannonBody.fixedRotation = physicsData.fixedRotation !== undefined ? physicsData.fixedRotation : false

                            while (physicsData.cannonBody.shapes.length > 0) {
                                physicsData.cannonBody.removeShape(physicsData.cannonBody.shapes[0])
                            }

                            let shape = await createCannonShape(transform, physicsData)
                            let position = await getCannonPosition(physicsData, worldPosition)

                            physicsData.cannonBody.addShape(shape)
                            physicsData.cannonBody.position.copy(position)
                            physicsData.cannonBody.quaternion.copy(transform.rotation)

                            if(physicsData.mass > 0){
                                physicsData.cannonBody.type = CANNON.Body.DYNAMIC
                            }else{
                                physicsData.cannonBody.type = CANNON.Body.STATIC
                            }

                            physicsData.cannonBody.updateMassProperties()
                            // physicsData.cannonBody.collisionFilterMask = 0

                            console.log('new physics body position', physicsData.cannonBody.position)
                            console.log('new physics body shape', physicsData.cannonBody.shapes.length)
                            for (const shape of physicsData.cannonBody.shapes) {
                                // Check if the shape is a Box
                                if (shape.type === CANNON.Shape.types.BOX) {
                                  const box = shape as CANNON.Box
                            
                                  // box.halfExtents is a CANNON.Vec3 of half-sizes
                                  const width  = box.halfExtents.x * 2
                                  const height = box.halfExtents.y * 2
                                  const depth  = box.halfExtents.z * 2
                            
                                  console.log(`Box shape size: width=${width}, height=${height}, depth=${depth}`)
                                }
                              }

                        }else{
                            // let worldPosition = getWorldPosition(body.entity)
                            // console.log('creating physics body')
                            // let shape = await createCannonShape(transform, physicsData)
                            // let position = await getCannonPosition(physicsData, worldPosition)

                            // physicsData.cannonBody = createCannonBody({
                            //     mass:physicsData.mass,
                            //     material: cannonMaterials.get(physicsData.material),
                            //     shape: shape,
                            //     position: position,
                            //     quaternion: new CANNON.Quaternion(),
                            // }, physicsData.fixedRotation !== undefined ? physicsData.fixedRotation : false, 4)

                            // console.log('physics body created', physicsData.cannonBody.position, physicsData.cannonBody.shape)

                            // let ent = engine.addEntity()
                            // Transform.create(ent, {position: worldPosition, scale:physicsData.size, parent:transform.parent})
                            // testEntities.set(body.aid, ent)

                            // switch(physicsData.shape){
                            //     case 0:
                            //         MeshRenderer.setBox(ent)
                            //         break;
                            // }

                            console.log('creating new physics body')
                            let shape = await createCannonShape(transform, physicsData)
                            let position = await getCannonPosition(physicsData, worldPosition)

                            physicsData.cannonBody = new CANNON.Body({
                                mass:physicsData.mass,
                                material: cannonMaterials.get(physicsData.material),
                                shape: shape,
                                position: position,
                                quaternion: new CANNON.Quaternion(transform.rotation.x, transform.rotation.y, transform.rotation.z, transform.rotation.w),
                                fixedRotation:physicsData.fixedRotation !== undefined ? physicsData.fixedRotation : false
                            })
                            physicsData.cannonBody.entity = body.entity
                            physicsData.cannonBody.aid = body.aid

                            //   let cannonBody = 
                            //   cannonBody.fixedRotation = rotation
                            //   cannonBody.collisionFilterGroup = 1
                            //   cannonBody.collisionFilterMask = 1//
                            
                              physicsData.cannonBody.addEventListener("collide", (event: any)=>{// CANNON.ICollisionEvent)=>{
                                let scene = colyseusRoom.state.scenes.get(body.sceneId)
                                if(scene){
                                    let entityInfo = getEntity(scene, body.aid)
                                    let collisionBodyInfo = getEntity(scene, event.body.aid)
                                    if(!collisionBodyInfo){
                                        return
                                    }
                                    runSingleTrigger(entityInfo, Triggers.ON_PHYSICS_COLLIDE, {input:0, pointer:0, data:event.body.entity, aid:event.body.aid})
                                }
                              })
                              world.addBody(physicsData.cannonBody)
                              console.log('physics body created', physicsData.cannonBody.position, physicsData.cannonBody.shape)


                        }
                    }
                }
            }
            else{
                console.log('body does not have all requirements yet, dont add')//
            }
        })
    }
}

function createCannonShape(transform:TransformType, physicsData:any){
    switch(physicsData.shape){
        case 0:
            if(physicsData.offset === undefined){
                return new CANNON.Box(new CANNON.Vec3(transform.scale.x/2, transform.scale.y/2, transform.scale.z/2))
            }
            console.log('cannon shape is', new CANNON.Box(new CANNON.Vec3(physicsData.size.x * 2, physicsData.size.y / 2, physicsData.size.z / 2)))
            return new CANNON.Box(new CANNON.Vec3(physicsData.size.x * 2, physicsData.size.y * 2, physicsData.size.z * 2));
        case 1:
            return
        
        case 2:
            return new CANNON.Sphere(transform.scale.y)
    }
}

function getCannonPosition(physicsData:any, worldPosition:any){
    // if(physicsData.offset === undefined){
        return new CANNON.Vec3(worldPosition.x, worldPosition.y, worldPosition.z)
    // }
    // console.log('world position', worldPosition)
    // console.log('actual position',  Vector3.add(worldPosition, Vector3.create(physicsData.offset.x, physicsData.offset.y, physicsData.offset.z)))
    // let position = Vector3.add(worldPosition, Vector3.create(physicsData.offset.x, physicsData.offset.y, physicsData.offset.z))
    // return new CANNON.Vec3(position.x, position.y, position.z)
}

function checkPhysicsRequirements(physicsData:any){
    // console.log('data is', physicsData)
    return physicsData.material && cannonMaterials.has(physicsData.material) &&
            physicsData.mass !== undefined && 
            physicsData.shape !== undefined
}

export function addCannonMaterial(material:string){
    let cannonMaterial = new CANNON.Material(material)
    cannonMaterials.set(material, cannonMaterial)
    retryPendingContactMaterials();
    return cannonMaterial
}

// Retry pending contact materials whenever a new material is added
function retryPendingContactMaterials() {
    for (let i = pendingContactMaterials.length - 1; i >= 0; i--) {
      const pending = pendingContactMaterials[i];
      const materialA = cannonMaterials.get(pending.from);
      const materialB = cannonMaterials.get(pending.to);
  
      if (materialA && materialB) {
        const contactMaterial = new CANNON.ContactMaterial(materialA, materialB, {
          friction: pending.contactData.friction || 0.3,
          restitution: pending.contactData.bounce || 0.5,//
        });
        world.addContactMaterial(contactMaterial);
        console.log(`Contact material added between ${pending.from} and ${pending.to} from pending list.`);
  
        // Remove this from the pending list once created
        pendingContactMaterials.splice(i, 1);
      }
    }
  }

// Function to create a contact material when both materials are available
function createContactMaterial(id:string, contactData: any) {
    const from = contactData.from
    const to = contactData.to

    const materialA = cannonMaterials.get(contactData.from);
    const materialB = cannonMaterials.get(contactData.to);
  
    if (materialA && materialB) {
      const contactMaterial = new CANNON.ContactMaterial(materialA, materialB, {
        friction: contactData.friction || 0.3,
        restitution: contactData.bounce || 0.5,
      });
      world.addContactMaterial(contactMaterial);
      console.log(`Contact material added between ${from} and ${to}`);
      cannonContactMaterials.set(id, contactMaterial)
    } else {
        const existsInPending = pendingContactMaterials.some(
            (pending) => pending.from === from && pending.to === to
          );
      
          if (!existsInPending) {
            // If not already in the pending list, add it..
            pendingContactMaterials.push({ from, to, contactData });
            console.log(`Contact material between ${from} and ${to} pending. Waiting for materials.`);
          } else {
            console.log(`Contact material between ${from} and ${to} is already pending.`);
          }
    }
  }

export function resetPhysicsBuildMode(scene:any, entityInfo:any){
    let itemInfo = scene[COMPONENT_TYPES.PHYSICS_COMPONENT].get(entityInfo.aid)
    if(!itemInfo || itemInfo.type === 0){
        return
    }

    localPlayer.cannonBody.mass = 0
    localPlayer.cannonBody.updateMassProperties()

    resetCannonBody(scene, itemInfo, entityInfo.aid)
}

export function setPhysicsPlayMode(scene:any, entityInfo:any){
    let physicsData = scene[COMPONENT_TYPES.PHYSICS_COMPONENT].get(entityInfo.aid)
    if(!physicsData){
        return
    }

    if(physicsData.type === 0){
        world.gravity.set(0, physicsData.gravity, 0)
    }else{
        resetCannonBody(scene, physicsData, entityInfo.aid, true)
    }
}

export function disablePhysicsPlayMode(scene:any, entityInfo:any){
    let physicsData = scene[COMPONENT_TYPES.PHYSICS_COMPONENT].get(entityInfo.aid)
    if(!physicsData){
        return
    }

    if(physicsData.type === 1){
        resetCannonBody(scene, physicsData, entityInfo.aid, true)
    }

    if(physicsData.type === 0){
        physicsData.contactMaterials.forEach((material:any, name:string)=>{
            updateContactMaterial(name, material)
        })
    }
}

export async function resetCannonBody(scene:any, physicsData:any, aid:string, action?:boolean){
    console.log('resetting physics for aid', aid)
    if(!physicsData.cannonBody){
       return
    }
    if(action){
       removePhysicsBody(physicsData)
    
       let transform:any = scene[COMPONENT_TYPES.TRANSFORM_COMPONENT].get(aid)
       console.log('transform is', transform)
       await updateTransform(scene, aid, transform)
    }else{
       let entityInfo = getEntity(scene, aid)
       physicsData.cannonBody.velocity.set(0, 0, 0)
       physicsData.cannonBody.angularVelocity.set(0, 0, 0)

       console.log('resetting physics for entity info', entityInfo)
  
       physicsData.cannonBody.position = await getCannonPosition(physicsData, getWorldPosition(entityInfo.entity))
  
       let transform:any = scene[COMPONENT_TYPES.TRANSFORM_COMPONENT].get(entityInfo.aid)
       let rotationQ = Quaternion.fromEulerDegrees(transform.r.x, transform.r.y, transform.r.z)
        physicsData.cannonBody.rotation =new CANNON.Quaternion(rotationQ.x, rotationQ.y, rotationQ.z, rotationQ.w)
    }
}

export function removePhysicsBody(physicsInfo:any){
    try{    
        world.removeBody(physicsInfo.cannonBody)
        physicsInfo.cannonBody = undefined
        console.log('removed physics body')
    }
    catch(e:any){
        console.log('error removing cannon body from world', e)
    }
}

export function removePendingBody(aid:string){
    pendingBodies = pendingBodies.filter((bodies:any)=> bodies.aid !== aid)
}