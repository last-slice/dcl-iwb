import { engine, MeshRenderer, Transform, TransformType } from "@dcl/sdk/ecs"
import { CANNON } from "../helpers/libraries"
import { COMPONENT_TYPES } from "../helpers/types"
import { createCannonBody, world } from "../physics"
import { getEntity } from "./IWB"
import { Vector3 } from "@dcl/sdk/math"
import { getWorldPosition } from "@dcl-sdk/utils"
import { colyseusRoom, connected } from "./Colyseus"

export let pendingBodies:any[] = []
export let cannonMaterials:Map<string,CANNON.Material> = new Map()
// export let cannonContactMaterials:Map<string,CANNON.ContactMaterial> = new Map()

// Store pending contact materials to retry when materials are available
const pendingContactMaterials: Array<{ from: string, to: string, contactData: any }> = [];


//    // Ball-Ground contact (bouncy)
//    const playerBallContactMaterial = new CANNON.ContactMaterial(playerMaterial, ballMaterial, {
//     friction: 0.3,    // Friction when ball touches ground
//     restitution: 0.5  // High bounciness for the ball
//   }
// );

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

        physicsData.cannonContactMaterials = new Map()

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
                        checPhysicskBody(scene.id, aid, entityInfo.entity, physicsData)
                    }
                })

                // Listen for material additions from the schema
                physicsData.materials.onAdd((material: string) => {
                    addCannonMaterial(material)
                });

                 // Listen for material additions from the schema
                 physicsData.contactMaterials.onAdd((contactMaterial:any, id:string) => {
                    // Attempt to create the contact material, or add it to pending if materials are not available
                    createContactMaterial(physicsData, id, contactMaterial);
                });

                physicsData.contactMaterials.onRemove((contactMaterial:any, id:string) => {
                    console.log("removed contact material", id)
                    let cm = physicsData.cannonContactMaterials.get(id)
                    if(cm){
                        // Nullify the contact material's effect by setting friction and restitution to zero
                        cm.friction = 0;
                        cm.restitution = 0;
                        physicsData.cannonContactMaterials.delete(id)
                    }
                });

                physicsData.listen("material", (current:any, previous:any)=>{
                    console.log('physics material changed', previous, current)
                    checPhysicskBody(scene.id, aid, entityInfo.entity, physicsData)
                })

                physicsData.listen("mass", (current:any, previous:any)=>{
                    console.log('physics mass changed', previous, current)
                    checPhysicskBody(scene.id, aid, entityInfo.entity, physicsData)
                })
            
                physicsData.listen("linearDamping", (current:any, previous:any)=>{
                    console.log('physics linearDamping changed', previous, current)
                    checPhysicskBody(scene.id, aid, entityInfo.entity, physicsData)
                })

                physicsData.offset && physicsData.offset.onChange((current:any, previous:any)=>{
                    // console.log('physics fixedRotation changed', previous, current)
                    checPhysicskBody(scene.id, aid, entityInfo.entity, physicsData)
                })

                physicsData.size && physicsData.size.onChange((current:any, previous:any)=>{
                    // console.log('physics fixedRotation changed', previous, current)
                    checPhysicskBody(scene.id, aid, entityInfo.entity, physicsData)
                })



                // physicsData.offset && physicsData.offset.listen("x", (current:any, previous:any)=>{
                //     console.log('physics fixedRotation changed', previous, current)
                //     checPhysicskBody(scene.id, aid, entityInfo.entity, physicsData)
                // })

                physicsData.listen("fixedRotation", (current:any, previous:any)=>{
                    console.log('physics fixedRotation changed', previous, current)
                    checPhysicskBody(scene.id, aid, entityInfo.entity, physicsData)
                })
                // break;
        // }
    })
}

// if(world.bodies.includes(physicsData.cannonBody)){
//     console.log('world already has physics body, need to remove')
//     physicsData.cannonBody.material = getCannonMaterial(physicsData.material)
// }
// else if(physicsData.mass){
//     console.log('creating physics body')
//     physicsData.cannonBody = createCannonBody({
//         mass:physicsData.mass,
//         material: getCannonMaterial(physicsData.material),
//         shape:new CANNON.Sphere(1),
//         position: new CANNON.Vec3(worldPosition.x, worldPosition.y, worldPosition.z),
//         quaternion: new CANNON.Quaternion(),
//     }, false, 4)
// }
// else{
//     console.log('not all physics properties set to be added to world')
// }//

export function checPhysicskBody(sceneId:string, aid:string, entity:any, physicsData:any){
    let pendingBody = pendingBodies.find(($:any)=> $.aid === aid)
    if(pendingBody){
        console.log('already found pending body, just need to update')
        pendingBody.data = {...physicsData}
    }else{
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
        console.log('chekcing pending bodies', cannonMaterials.size, pendingBodies.length)
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
                    // let worldPosition = getWorldPosition(body.entity)
                    if(physicsData){
                        console.log('body has all requirements, add to engine')
                        if(world.bodies.includes(physicsData.cannonBody)){
                            console.log('world already has physics body, need to clear collision masks')
                            // physicsData.cannonBody.mass = physicsData.mass
                            // physicsData.cannonBody.material = cannonMaterials.get(physicsData.material)
                            // physicsData.cannonBody.linearDamping = physicsData.linearDamping
                            // physicsData.cannonBody.angularDamping = physicsData.angularDamping
                            // physicsData.cannonBody.shape = createCannonShape(transform, physicsData)
                            // physicsData.cannonBody.position = getCannonPosition(physicsData, worldPosition)

                            // if(physicsData.mass > 0){
                            //     physicsData.cannonBody.type = CANNON.Body.DYNAMIC
                            // }

                            // physicsData.cannonBody.updateMassProperties()
                            // console.log('body mass is', physicsData.cannonBody.mass)
                            physicsData.cannonBody.collisionFilterMask = 0
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

                        }

                        let worldPosition = getWorldPosition(body.entity)
                            console.log('creating physics body')
                            let shape = await createCannonShape(transform, physicsData)
                            let position = await getCannonPosition(physicsData, worldPosition)

                            physicsData.cannonBody = createCannonBody({
                                mass:physicsData.mass,
                                material: cannonMaterials.get(physicsData.material),
                                shape: shape,
                                position: position,
                                quaternion: new CANNON.Quaternion(),
                            }, physicsData.fixedRotation !== undefined ? physicsData.fixedRotation : false, 4)

                            console.log('physics body created', physicsData.cannonBody.position, physicsData.cannonBody.shape)

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
                return new CANNON.Box(new CANNON.Vec3(0.5,0.5,0.5))
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
    if(physicsData.offset === undefined){
        return new CANNON.Vec3(worldPosition.x, worldPosition.y, worldPosition.z)
    }
    console.log('world position', worldPosition)
    console.log('actual position',  Vector3.add(worldPosition, Vector3.create(physicsData.offset.x, physicsData.offset.y, physicsData.offset.z)))
    let position = Vector3.add(worldPosition, Vector3.create(physicsData.offset.x, physicsData.offset.y, physicsData.offset.z))
    return new CANNON.Vec3(position.x, position.y, position.z)
}

function checkPhysicsRequirements(physicsData:any){
    console.log('data is', physicsData)

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
function createContactMaterial(physicsData:any, id:string, contactData: any) {
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
      physicsData.cannonContactMaterials.set(id, contactMaterial)
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
  