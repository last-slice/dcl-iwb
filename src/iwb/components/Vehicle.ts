import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math"
import { getForwardDirectionFromRotation, getRandomString } from "../helpers/functions"
import {  AvatarShape, CameraMode, CameraModeArea, CameraType, ColliderLayer, EasingFunction, engine, Entity, GltfContainer, InputAction, Material, MeshCollider, MeshRenderer, PBMaterial_PbrMaterial, pointerEventsSystem, Transform, Tween } from "@dcl/sdk/ecs"
import { movePlayerTo } from "~system/RestrictedActions"
import { COMPONENT_TYPES, SERVER_MESSAGE_TYPES, Triggers } from "../helpers/types"
import { getEntity } from "./iwb"
import { createCannonBody } from "../physics"
import { CANNON, utils } from "../helpers/libraries"
import { localPlayer, localUserId } from "./Player"
import { addCannonMaterial, cannonMaterials } from "./Physics"
import { updatePointer } from "./Pointers"
import { getWorldPosition, LAYER_1, NO_LAYERS } from "@dcl-sdk/utils"
import { runGlobalTrigger, runSingleTrigger } from "./Triggers"
import { updateVehicle, vehicleInfo } from "../ui/Objects/Edit/EditVehicle"
import { sendServerMessage } from "./Colyseus"

export let testVehicles:Map<string, any> = new Map()
export let physicsObjects:Map<string,any> = new Map()

export let localVehicleEntities:Map<Entity, Entity> = new Map()

export let localAid:string = getRandomString(5)

export function updateVehiclePointersPlayMode(scene:any, entityInfo:any){
    let vehicleInfo = scene[COMPONENT_TYPES.VEHICLE_COMPONENT].get(entityInfo.aid)
    if(!vehicleInfo){
        return
    }

    updatePointer({entity:vehicleInfo.entityRot}, {events:[
        {
            "eventType": 1,
            "button": 0,
            "hoverText": "Enter Vehicle",
            "maxDistance": 5,
            "showFeedback": true
        },
        {
            "eventType": 1,
            "button": 8,
            "hoverText": "Exit Vehicle",
            "maxDistance": 5,
            "showFeedback": true
        }
    ]})
}

export function attemptVehicleEntry(scene:any, entityInfo:any){
    let vehicleInfo = scene[COMPONENT_TYPES.VEHICLE_COMPONENT].get(entityInfo.aid)
    let transform = scene[COMPONENT_TYPES.TRANSFORM_COMPONENT].get(entityInfo.aid)
    let iwbInfo = scene[COMPONENT_TYPES.IWB_COMPONENT].get(entityInfo.aid)

    if(!vehicleInfo){
        console.log('no vehicle info to attempt entry')
        return
    }

    if(vehicleInfo.active || vehicleInfo.driver !== ""){
        console.log('vehicle already has driver')
        return
    }

    let holderPosition = getWorldPosition(vehicleInfo.holderG)

    // let holder = Transform.get(entityInfo.entity).position
    // let car = transform.p
    // let slot = Vector3.add(car, holder)
    // let playerCarPosition = getWorldPosition(slot)

    MeshCollider.setPlane(vehicleInfo.holderL)
    MeshCollider.setPlane(vehicleInfo.holderF)
    MeshCollider.setPlane(vehicleInfo.holderR)
    MeshCollider.setPlane(vehicleInfo.holderB)
    MeshCollider.setPlane(vehicleInfo.holderG)

    movePlayerTo({newRelativePosition:{x:holderPosition.x, y:holderPosition.y + 1, z:holderPosition.z}})
    vehicleInfo.active = true
    vehicleInfo.driver = localUserId
    vehicleInfo.prevCamMode = CameraMode.get(engine.CameraEntity).mode

    if(vehicleInfo.forceFPV){
        vehicleInfo.forceFPVEntity = engine.addEntity()
        Transform.create(vehicleInfo.forceFPVEntity, {parent: vehicleInfo.holder})

        CameraModeArea.create(vehicleInfo.forceFPVEntity, {
            area: Vector3.create(4, 3, 4),
            mode: CameraType.CT_FIRST_PERSON,
        })
    }

    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
        {
            component:COMPONENT_TYPES.VEHICLE_COMPONENT, 
            aid:entityInfo.aid, 
            sceneId:localPlayer.activeScene.id,
            action:'driver',
            occupied:localUserId,
        }
    )
}

export function attemptVehicleExit(scene:any, entityInfo:any){
    let vehicleInfo = scene[COMPONENT_TYPES.VEHICLE_COMPONENT].get(entityInfo.aid)

    if(!vehicleInfo){
        console.log('no vehicle info to attempt entry')
        return
    }

    if(vehicleInfo.driver !== localUserId || localPlayer.vehicle !== entityInfo.aid){
        console.log('player is not driving vehicle')
        return
    }

    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
        {
            component:COMPONENT_TYPES.VEHICLE_COMPONENT, 
            aid:entityInfo.aid, 
            sceneId:localPlayer.activeScene.id,
            action:'driver',
            occupied:"",
        }
    )

    MeshCollider.deleteFrom(vehicleInfo.holderL)
    MeshCollider.deleteFrom(vehicleInfo.holderF)
    MeshCollider.deleteFrom(vehicleInfo.holderR)
    MeshCollider.deleteFrom(vehicleInfo.holderB)
    MeshCollider.deleteFrom(vehicleInfo.holderG)
}

export function vehicleListener(scene:any){
    scene[COMPONENT_TYPES.VEHICLE_COMPONENT].onAdd((vehicleData:any, aid:any)=>{
        console.log('vehicle added', vehicleData)
        let entityInfo = getEntity(scene, aid)

        let transform = scene[COMPONENT_TYPES.TRANSFORM_COMPONENT].get(aid)
        let iwbInfo = scene[COMPONENT_TYPES.IWB_COMPONENT].get(aid)

        if(!entityInfo || !transform || !iwbInfo){
            return
        }

        vehicleData.listen("type", (current:any, previous:any)=>{
            console.log('vehicle type changed', previous, current)
            if(current !== -1){
                console.log('need to apply physics to the vehicle')

                vehicleData.cannonBody = createCannonBody({
                    mass:vehicleData.mass,
                    position: new CANNON.Vec3(transform.p.x, transform.p.y, transform.p.z),
                    quaternion: new CANNON.Quaternion(),
                    // shape: new CANNON.Box(new CANNON.Vec3(1, 1, 2.5)),
                    shape:new CANNON.Sphere(1),
                    material:cannonMaterials.get("vehicle") || addCannonMaterial("vehicle"),
                    linearDamping:0.8,
                    angularDamping:0.8
                }, true, 5),

                vehicleData.entityPos = entityInfo.entity
                vehicleData.entityRot = engine.addEntity()
                vehicleData.holder = engine.addEntity()

                console.log('vehicle rot is', vehicleData.entityRot)

                localVehicleEntities.set(vehicleData.entityRot, entityInfo.entity)

                Transform.createOrReplace(vehicleData.entityRot, {
                    parent:entityInfo.entity
                })

                GltfContainer.deleteFrom(entityInfo.entity)

                // Add the gltf shape to the child 
                GltfContainer.createOrReplace(vehicleData.entityRot, {
                    src: "assets/"+iwbInfo.id + ".glb",
                    visibleMeshesCollisionMask  : ColliderLayer.CL_POINTER,
                    invisibleMeshesCollisionMask: ColliderLayer.CL_NONE,
                })

                addVehicleHolder(vehicleData)
            }
            
        })
    })
}

function addVehicleHolder(vehicle:any){
    Transform.create(vehicle.holder, {position: vehicle.holderPos, parent:vehicle.entityRot})
    utils.triggers.addTrigger(vehicle.holder, NO_LAYERS, LAYER_1, [{type:"box", scale:Vector3.create(2,4,2)}],
()=>{

},()=>{
    console.log('left vehicle')
})


    vehicle.holderL = engine.addEntity()
    // MeshRenderer.setPlane(left)
    // MeshCollider.setPlane(vehicle.holderL)
    Transform.create(vehicle.holderL, {parent:vehicle.holder, 
        position:Vector3.create(-1,0,0), 
        rotation:Quaternion.fromEulerDegrees(0,90,0), 
        scale:Vector3.create(7,6,1)
    })

    vehicle.holderF = engine.addEntity()
    // MeshRenderer.setPlane(front)
    // MeshCollider.setPlane(vehicle.holderF)
    Transform.create(vehicle.holderF, {parent:vehicle.holder, 
        position:Vector3.create(0,0,1.1), 
        rotation:Quaternion.fromEulerDegrees(0,0,0), 
        scale:Vector3.create(7,6, 1)
    })

    vehicle.holderB = engine.addEntity()
    // MeshRenderer.setPlane(back)
    // MeshCollider.setPlane(vehicle.holderB)
    Transform.create(vehicle.holderB, {parent:vehicle.holder, 
        position:Vector3.create(0,0,-1.1), 
        rotation:Quaternion.fromEulerDegrees(0,0,0), 
        scale:Vector3.create(7,6, 1)
    })

    vehicle.holderR = engine.addEntity()
    // MeshRenderer.setPlane(right)
    // MeshCollider.setPlane(vehicle.holderR)
    Transform.create(vehicle.holderR, {parent:vehicle.holder, 
        position:Vector3.create(1,0,0), 
        rotation:Quaternion.fromEulerDegrees(0,90,0), 
        scale:Vector3.create(7,6, 1)
    })

    vehicle.holderG = engine.addEntity()
    // MeshRenderer.setPlane(floor)
    // MeshCollider.setPlane(vehicle.holderG)
    Transform.create(vehicle.holderG, {parent:vehicle.holder, 
        position:Vector3.create(0, -2,0), 
        rotation:Quaternion.fromEulerDegrees(90,0,0), 
        scale:Vector3.create(7,4, 1)
    })
}

export function addTestPhysicsObjects(){
// console.log('adding test vehicles')

    // let wall = engine.addEntity()
    // MeshRenderer.setBox(wall)
    // Transform.create(wall, {position: Vector3.create(0,4,20), scale:Vector3.create(3,8,0.5)})

    // let newWallAid = getRandomString(5)
    // physicsObjects.set(newWallAid,{
    //     entity:wall,
    //     cannonBody:createCannonBody({
    //         mass:10000,
    //         material: wallPhysicsMaterial,
    //         shape:new CANNON.Box(new CANNON.Vec3(1.5, 4, 0.5)),
    //         position: new CANNON.Vec3(0,4,20),
    //         quaternion: new CANNON.Quaternion(),
    //         linearDamping:0,
    //         angularDamping:0
    //     }, false, 3),
    // })

    // let ball = engine.addEntity()
    // MeshRenderer.setSphere(ball)
    // Transform.create(ball, {position: Vector3.create(22,1,18), scale:Vector3.create(1,1,1)})
    // let position = Transform.get(ball).position

    // let ballAid = getRandomString(5)
    // physicsObjects.set(ballAid,{
    //     entity:ball,
    //     cannonBody:createCannonBody({
    //         mass:1,
    //         material: ballMaterial,
    //         shape:new CANNON.Sphere(1),
    //         position: new CANNON.Vec3(position.x, position.y, position.z),
    //         quaternion: new CANNON.Quaternion(),
    //         linearDamping:0.4,
    //         angularDamping:0.4
    //     }, false, 4),
    // })

    // ball = engine.addEntity()
    // MeshRenderer.setSphere(ball)
    // Transform.create(ball, {position: Vector3.create(23,0,20), scale:Vector3.create(1,1,1)})
    // position = Transform.get(ball).position

    // ballAid = getRandomString(5)
    // physicsObjects.set(ballAid,{
    //     entity:ball,
    //     cannonBody:createCannonBody({
    //         mass:1,
    //         material: ballMaterial,
    //         shape:new CANNON.Sphere(1),
    //         position: new CANNON.Vec3(position.x, position.y, position.z),
    //         quaternion: new CANNON.Quaternion(),
    //         linearDamping:0.4,
    //         angularDamping:0.4
    //     }, false, 4),
    // })

    // ball = engine.addEntity()
    // MeshRenderer.setSphere(ball)
    // Transform.create(ball, {position: Vector3.create(25,0,20), scale:Vector3.create(1,1,1)})
    // position = Transform.get(ball).position

    // ballAid = getRandomString(5)
    // physicsObjects.set(ballAid,{
    //     entity:ball,
    //     cannonBody:createCannonBody({
    //         mass:1,
    //         material: ballMaterial,
    //         shape:new CANNON.Sphere(1),
    //         position: new CANNON.Vec3(position.x, position.y, position.z),
    //         quaternion: new CANNON.Quaternion(),
    //         linearDamping:0.4,
    //         angularDamping:0.4
    //     }, false, 4),
    // })



}

export function addTestVehicle(){
    testVehicles.set(localAid,
        {
            model:"c59efa22-c881-4aeb-9496-b00c6401f67b",
            acceleration:500,
            currentSpeed:0,
            maxSpeed:70,
            maxTurn: 200,
            userId:localUserId,
            name:"",
            position:Vector3.create(0,1,4),
            turning:0,
            heading:0,
            targetHeading:0,
            velocity:0,
            maxVelocity:50,
            angularVelocity:0,
            tweenPosDuration:250,
            tweenRotDuration:250,
            timeSinceLastTweenPos:0,
            timeSinceLastTweenRot:0,
            timeToNextTweenPos:0,
            timeToNextTweenRot:0,
            entityOffset: Vector3.create(0,-1,0),
            holderPos:Vector3.create(0,3,-1),
            holder:engine.addEntity(),
            entityPos:engine.addEntity(),
            entityRot:engine.addEntity(),
            // forceFPV:true,
            cannonBody:createCannonBody({
                mass:500,
                position: new CANNON.Vec3(0,0,4),
                quaternion: new CANNON.Quaternion(),
                // shape: new CANNON.Box(new CANNON.Vec3(1, 1, 2.5)),
                shape:new CANNON.Sphere(1),
                material:cannonMaterials.get("vehicle") || addCannonMaterial("vehicle"),
                linearDamping:0.8,
                angularDamping:0.8
            }, true, 5),
            forward:true,
            accelerating:false,
            active:false
    })

    let vehicle = testVehicles.get(localAid)
    Transform.createOrReplace(vehicle.entityPos, {
        position: vehicle.position
    })

    Transform.createOrReplace(vehicle.entityRot, {
        parent:vehicle.entityPos,
        scale: Vector3.create(0.5,0.5,0.5)
    })

    // Add the gltf shape to the child 
    GltfContainer.createOrReplace(vehicle.entityRot, {
        src: "assets/"+vehicle.model + ".glb",
        visibleMeshesCollisionMask  : ColliderLayer.CL_POINTER,
        invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS,
    })

    // utils.triggers.enableDebugDraw(true)
    // utils.triggers.addTrigger(vehicle.entityRot,NO_LAYERS, LAYER_1, [{type:'box', scale:Vector3.create(2,3,2)}],
    //     ()=>{
    //         vehicle.active = true
    //     },
    //     ()=>{
    //         vehicle.active = false
    //     })

    pointerEventsSystem.onPointerDown({entity: vehicle.entityRot,
        opts:{button: InputAction.IA_POINTER, hoverText:"Enter", showFeedback:true, maxDistance:5}
    },
        ()=>{
            let holder = Transform.get(vehicle.holder).position
            let car = Transform.get(vehicle.entityPos).position
            let slot = Vector3.add(car, holder)

            console.log('slot is', slot)
            movePlayerTo({newRelativePosition:{x:slot.x, y:slot.y, z:slot.z}, cameraTarget:{x:car.x, y:1, z:car.z+3}})
            vehicle.active = true
            vehicle.driver = localUserId

            if(vehicle.forceFPV){
                vehicle.forceFPVEntity = engine.addEntity()
                CameraModeArea.create(vehicle.forceFPVEntity, {
                    area: Vector3.create(4, 3, 4),
                    mode: CameraType.CT_FIRST_PERSON,
                })
                Transform.create(vehicle.forceFPVEntity, {parent: vehicle.holder})
                vehicle.prevCamMode = CameraMode.get(engine.CameraEntity).mode

            }
        }
    )

    Transform.create(vehicle.holder, {position: vehicle.holderPos, parent:vehicle.entityRot})

    let transAlbedo:PBMaterial_PbrMaterial = {albedoColor: Color4.create(0,1,0,.2)}

    let left = engine.addEntity()
    // MeshRenderer.setPlane(left)
    MeshCollider.setPlane(left)
    Transform.create(left, {parent:vehicle.holder, 
        position:Vector3.create(-1,0,0), 
        rotation:Quaternion.fromEulerDegrees(0,90,0), 
        scale:Vector3.create(7,6,1)
    })

    let front = engine.addEntity()
    // MeshRenderer.setPlane(front)
    MeshCollider.setPlane(front)
    Transform.create(front, {parent:vehicle.holder, 
        position:Vector3.create(0,0,1.1), 
        rotation:Quaternion.fromEulerDegrees(0,0,0), 
        scale:Vector3.create(7,6, 1)
    })

    let back = engine.addEntity()
    // MeshRenderer.setPlane(back)//
    MeshCollider.setPlane(back)
    Transform.create(back, {parent:vehicle.holder, 
        position:Vector3.create(0,0,-1.1), 
        rotation:Quaternion.fromEulerDegrees(0,0,0), 
        scale:Vector3.create(7,6, 1)
    })

    let right = engine.addEntity()
    // MeshRenderer.setPlane(right)
    MeshCollider.setPlane(right)
    Transform.create(right, {parent:vehicle.holder, 
        position:Vector3.create(1,0,0), 
        rotation:Quaternion.fromEulerDegrees(0,90,0), 
        scale:Vector3.create(7,6, 1)
    })

    // let roof = engine.addEntity()
    // MeshRenderer.setPlane(roof)
    // MeshCollider.setPlane(roof)
    // Transform.create(roof, {parent:vehicle.holder, 
    //     position:Vector3.create(0,2,0), 
    //     rotation:Quaternion.fromEulerDegrees(90,0,0), 
    //     scale:Vector3.create(7,4,1)
    // })

    let floor = engine.addEntity()
    // MeshRenderer.setPlane(floor)
    MeshCollider.setPlane(floor)
    Transform.create(floor, {parent:vehicle.holder, 
        position:Vector3.create(0, -2,0), 
        rotation:Quaternion.fromEulerDegrees(90,0,0), 
        scale:Vector3.create(7,4, 1)
    })

    Material.setPbrMaterial(left, transAlbedo)
    Material.setPbrMaterial(front, transAlbedo)
    Material.setPbrMaterial(right, transAlbedo)
    Material.setPbrMaterial(back, transAlbedo)
    Material.setPbrMaterial(floor, transAlbedo)

//     let fake = engine.addEntity()
//     AvatarShape.create(fake)

//     let holder = Transform.get(vehicle.holder).position
//     let car = Transform.get(vehicle.entityPos).position
//     let slot = Vector3.add(car, holder)

//     Transform.create(fake, {position: slot})
//     let faket = Transform.getMutable(fake)
//     faket.position = Vector3.subtract(faket.position, Vector3.create(0,2.5,-0.3))
}

export function turning(vehicle:any, direction:any){
    // let vehicle = testVehicles.get(localAid)
    if(vehicle.currentSpeed > 10){
        vehicle.turning = direction
    }else{
        vehicle.turning = 0
    }
}

export function accelerateVehicle(vehicle:any){
    // let vehicle = testVehicles.get(localAid)//
    // if(vehicle.active){
        vehicle.accelerating = true
        runSingleTrigger({entity: vehicle.entityPos}, Triggers.ON_VEHICLE_ACCELERATE, {entity:vehicle.entityPos, input:0, pointer:0})
    // }  
}

export function decelerateVehicle(vehicle:any){
    // let vehicle = testVehicles.get(localAid)
    vehicle.accelerating = false
    runSingleTrigger({entity: vehicle.entityPos}, Triggers.ON_VEHICLE_DECELERATE, {entity:vehicle.entityPos, input:0, pointer:0})
}

export function setTargetHeading(vehicle:any, heading:number){
    // let vehicle = testVehicles.get(localAid)
    if(vehicle.active){
        vehicle.targetHeading += heading
    } 
}

export function updateVehicleDirection(vehicle:any){
    // let vehicle = testVehicles.get(localAid)
    if(vehicle.turning > 0){
        switch(vehicle.turning){
            case 1:
                setTargetHeading(vehicle, -2)
                break;

            case 2:
                setTargetHeading(vehicle, 2)
                break;
        }
    }
}

export function updateVehicleSpeed(vehicle:any, dt:number){
    // let vehicle = testVehicles.get(localAid)



    if(vehicle.accelerating){
        if(vehicle.forward){
            if(vehicle.currentSpeed < vehicle.maxSpeed){
                vehicle.currentSpeed += (vehicle.acceleration * dt)
                vehicle.currentSpeed = Math.min(vehicle.currentSpeed, vehicle.maxSpeed)
                // console.log('speed is ', vehicle.currentSpeed)
            }
        }
        // else{
        //     if(vehicle.currentSpeed < vehicle.maxSpeed){
        //         vehicle.currentSpeed += (vehicle.acceleration * dt)
        //         vehicle.currentSpeed = Math.min(vehicle.currentSpeed, vehicle.maxSpeed)
        //         // console.log('speed is ', vehicle.currentSpeed)
        //     }
        // }
    }else{
        if (vehicle.currentSpeed > 0) {
            vehicle.currentSpeed -= (vehicle.acceleration * dt);
            vehicle.currentSpeed = Math.max(vehicle.currentSpeed, 0)
        }	
    }
}

export function applyVehiceForce(vehicle:any){
    // let vehicle = testVehicles.get(localAid)


    if(!vehicle.cannonBody){
        return
    }

        //Velocity direction
		//Apply a force to the cannon body in the direction the vehicle is currently facing
		const targetDirection = getForwardDirectionFromRotation(vehicle.heading)
		const targetVelocity  = targetDirection.scale(vehicle.currentSpeed * 1000)
		
		vehicle.cannonBody.applyForce(targetVelocity, vehicle.cannonBody.position)
		
		// Clamp the velocity to the max speed		
		// if (Vector3.lengthSquared(vehicle.cannonBody.velocity) > (vehicle.maxSpeed * vehicle.maxSpeed)) {
		// 	const velocityNorm = vehicle.cannonBody.velocity.clone()
		// 		  velocityNorm.normalize()
		// 		  velocityNorm.mult(vehicle.maxSpeed)
        //           vehicle.cannonBody.velocity.copy(velocityNorm)
		// }

        // console.log('vehicle velocity', targetVelocity)
        // console.log('vehicle osition', vehicle.cannonBody.position)

        // if(vehicle.active){
    
        //     const targetDirection = getForwardDirectionFromRotation(vehicle.heading)
        //     vehicle.velocity = targetDirection.scale(vehicle.currentSpeed * dt)
    
        //     // Cap the velocity to avoid exceeding max speed
        // const currentVelocity = vehicle.cannonBody.velocity.length(); // Get the car's current speed
        // if (currentVelocity < vehicle.maxVelocity) {
    
        
        //     // Apply the gradual force to the car in the forward direction (X-axis in this case)
        //     const forwardForce = new CANNON.Vec3(vehicle.velocity, 0, 0);
        //     vehicle.cannonBody.applyForce(forwardForce, vehicle.cannonBody.position);
        // }
        // }
        // console.log('velocity is', vehicle.velocity)

}

export function tweenToPosition(vehicle:any){
    // Reset timer

    if(!vehicle.cannonBody){
        // console.log('no cannon body for vehicle')
        return
    }

    let cannonPosition = vehicle.cannonBody.position
    if(cannonPosition){
        let dclPosition = Vector3.create(cannonPosition.x, cannonPosition.y, cannonPosition.z)

        vehicle.timeSinceLastTweenPos = 0
        vehicle.timeToNextTweenPos = vehicle.tweenPosDuration - 50
            
            // Define the start and end Positions
            const startPos = Transform.get(vehicle.entityPos).position
            
            const endPos = Vector3.create(
                dclPosition.x + vehicle.entityOffset.x, 
                dclPosition.y + vehicle.entityOffset.y, 
                dclPosition.z + vehicle.entityOffset.z
            )
            
            // Use the built in Tween component
            // Start Tween on the entityPos (parent) to position it
            Tween.createOrReplace(vehicle.entityPos, {
                mode: Tween.Mode.Move({
                    start: startPos,
                    end  : endPos
                }),
                duration: vehicle.tweenPosDuration, // Tween component needs times in ms
                easingFunction: EasingFunction.EF_LINEAR,
            })
    }
}

export function tweenToHeading(vehicle:any){
    const transformRot = Transform.getMutableOrNull(vehicle.entityRot);
		if (transformRot && vehicle.cannonBody) {
			
			// Reset timer 
			vehicle.timeSinceLastTweenRot = 0	
			vehicle.timeToNextTweenRot = vehicle.tweenRotDuration - 50
			
			// Get the start and end rots (limited by turn rate)
			const startRotation  = transformRot.rotation
			const targetRotation = Quaternion.fromEulerDegrees(0, vehicle.targetHeading, 0)
			const maxTurn        = (vehicle.maxTurn * (vehicle.tweenRotDuration / 1000))
			const endRotation    = Quaternion.rotateTowards(startRotation, targetRotation, maxTurn)
			
			// Update the current heading, and the cannon body rotation
			vehicle.heading = Quaternion.toEulerAngles(endRotation).y
			vehicle.cannonBody.quaternion.setFromEuler(0, endRotation.y, 0)//
			
			// Use the built in Tween component 
			Tween.createOrReplace(vehicle.entityRot, {
				mode: Tween.Mode.Rotate({
					start: startRotation,
					end  : endRotation
				}),
				duration      : vehicle.tweenRotDuration,  // Tween component needs times in ms
				easingFunction: EasingFunction.EF_LINEAR,
			})
		} 
}