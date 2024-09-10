import { Quaternion, Vector3 } from "@dcl/sdk/math"
import { getForwardDirectionFromRotation, getRandomString } from "../helpers/functions"
import { localUserId } from "./Player"
import { AvatarAttach, ColliderLayer, EasingFunction, engine, GltfContainer, InputAction, MeshCollider, MeshRenderer, pointerEventsSystem, Transform, Tween } from "@dcl/sdk/ecs"
import CANNON, { Vec3 } from "cannon"
import { world } from "../physics"
import { movePlayerTo } from "~system/RestrictedActions"
import { playerMaterial, wallPhysicsMaterial, vehiclePhysicsMaterial, ballMaterial } from "../physics/world"

export let testVehicles:Map<string, any> = new Map()
export let physicsObjects:Map<string,any> = new Map()

export let playerPhysics:CANNON.Body


export let localAid:string = getRandomString(5)

export function addTestVehicle(){
    console.log('adding test vehicles')

    playerPhysics = createCannonBody({
        mass:60,
        material: playerMaterial,
        shape:new CANNON.Box(new CANNON.Vec3(0.35, 0.95, 0.35)),
        position: new CANNON.Vec3(0,0,0),
        quaternion: new CANNON.Quaternion(),
    }, true, 2)

    let wall = engine.addEntity()
    MeshRenderer.setBox(wall)
    Transform.create(wall, {position: Vector3.create(0,4,20), scale:Vector3.create(3,8,0.5)})

    let newWallAid = getRandomString(5)
    physicsObjects.set(newWallAid,{
        entity:wall,
        cannonBody:createCannonBody({
            mass:300,
            material: wallPhysicsMaterial,
            shape:new CANNON.Box(new CANNON.Vec3(1.5, 4, 0.5)),
            position: new CANNON.Vec3(0,4,20),
            quaternion: new CANNON.Quaternion(),
            linearDamping:0.4,
            angularDamping:0.4
        }, false, 3),
    })

    let ball = engine.addEntity()
    MeshRenderer.setSphere(ball)
    Transform.create(ball, {position: Vector3.create(22,0,18), scale:Vector3.create(1,1,1)})
    let position = Transform.get(ball).position

    let ballAid = getRandomString(5)
    physicsObjects.set(ballAid,{
        entity:ball,
        cannonBody:createCannonBody({
            mass:1,
            material: ballMaterial,
            shape:new CANNON.Sphere(1),
            position: new CANNON.Vec3(position.x, position.y, position.z),
            quaternion: new CANNON.Quaternion(),
            linearDamping:0.4,
            angularDamping:0.4
        }, false, 4),
    })

    ball = engine.addEntity()
    MeshRenderer.setSphere(ball)
    Transform.create(ball, {position: Vector3.create(23,0,20), scale:Vector3.create(1,1,1)})
    position = Transform.get(ball).position

    ballAid = getRandomString(5)
    physicsObjects.set(ballAid,{
        entity:ball,
        cannonBody:createCannonBody({
            mass:1,
            material: ballMaterial,
            shape:new CANNON.Sphere(1),
            position: new CANNON.Vec3(position.x, position.y, position.z),
            quaternion: new CANNON.Quaternion(),
            linearDamping:0.4,
            angularDamping:0.4
        }, false, 4),
    })

    ball = engine.addEntity()
    MeshRenderer.setSphere(ball)
    Transform.create(ball, {position: Vector3.create(25,0,20), scale:Vector3.create(1,1,1)})
    position = Transform.get(ball).position

    ballAid = getRandomString(5)
    physicsObjects.set(ballAid,{
        entity:ball,
        cannonBody:createCannonBody({
            mass:1,
            material: ballMaterial,
            shape:new CANNON.Sphere(1),
            position: new CANNON.Vec3(position.x, position.y, position.z),
            quaternion: new CANNON.Quaternion(),
            linearDamping:0.4,
            angularDamping:0.4
        }, false, 4),
    })

    testVehicles.set(localAid,
        {
            src:"assets/c59efa22-c881-4aeb-9496-b00c6401f67b.glb",
            acceleration:800,
            currentSpeed:0,
            maxSpeed:100,
            maxTurn: 200,
            userId:localUserId,
            name:"",
            position:Vector3.create(0,0.5,4),
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
            entityOffset: Vector3.create(0,-0.5,0),
            holderPos:Vector3.create(0,3,-1),
            holderScl:Vector3.create(2,4,4),
            holder:engine.addEntity(),
            entityPos:engine.addEntity(),
            entityRot:engine.addEntity(),
            cannonBody:createCannonBody({
                mass:500,
                position: new CANNON.Vec3(0,0,4),
                quaternion: new CANNON.Quaternion(),
                // shape: new CANNON.Box(new CANNON.Vec3(1, 0.5, 2.5)),
                shape:new CANNON.Sphere(1),
                material:vehiclePhysicsMaterial,
                linearDamping:0.7,
                angularDamping:0.7
            }, true, 5),
            forward:true,
            accelerating:false,
            active:false//
    })

    let vehicle = testVehicles.get(localAid)
    Transform.createOrReplace(vehicle.entityPos, {
        position: vehicle.position
    })

    let collider = engine.addEntity()
    // MeshRenderer.setBox(collider)
    Transform.create(collider, {parent:vehicle.entityPos,scale:Vector3.create(2,1,5), position:Vector3.create(0,0.5,0)})

    Transform.createOrReplace(vehicle.entityRot, {
        parent:vehicle.entityPos,
        scale: Vector3.create(0.5,0.5,0.5)
    })

    // Add the gltf shape to the child 
    GltfContainer.createOrReplace(vehicle.entityRot, {
        src: vehicle.src,
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
        opts:{button: InputAction.IA_POINTER, hoverText:"enter", showFeedback:true, maxDistance:5}
    },
        ()=>{
            let holder = Transform.get(vehicle.holder).position
            let car = Transform.get(vehicle.entityPos).position
            let slot = Vector3.add(car, holder)

            console.log('slot is', slot)
            movePlayerTo({newRelativePosition:{x:slot.x, y:slot.y + 0.5, z:slot.z}, cameraTarget:{x:car.x, y:1, z:car.z+3}})
            vehicle.active = true
        }
    )

    Transform.create(vehicle.holder, {position: vehicle.holderPos,parent:vehicle.entityRot})
    let left = engine.addEntity()
    // MeshRenderer.setPlane(left)
    MeshCollider.setPlane(left)
    Transform.create(left, {parent:vehicle.holder, 
        position:Vector3.create(-vehicle.holderScl.x/2,0,0), 
        rotation:Quaternion.fromEulerDegrees(0,90,0), 
        scale:Vector3.create(vehicle.holderScl.x,vehicle.holderScl.y, 1)
    })

    let front = engine.addEntity()
    // MeshRenderer.setPlane(front)
    MeshCollider.setPlane(front)
    Transform.create(front, {parent:vehicle.holder, 
        position:Vector3.create(0,0,vehicle.holderScl.z/4), 
        rotation:Quaternion.fromEulerDegrees(0,0,0), 
        scale:Vector3.create(vehicle.holderScl.x,vehicle.holderScl.y, 1)
    })

    let right = engine.addEntity()
    // MeshRenderer.setPlane(right)
    MeshCollider.setPlane(right)
    Transform.create(right, {parent:vehicle.holder, 
        position:Vector3.create(vehicle.holderScl.x/2,0,0), 
        rotation:Quaternion.fromEulerDegrees(0,90,0), 
        scale:Vector3.create(vehicle.holderScl.x,vehicle.holderScl.y, 1)
    })
}

function createCannonBody(data:any, rotation:boolean, cGroup:number){
    let cannonBody = new CANNON.Body(data)
    cannonBody.fixedRotation = rotation
    cannonBody.collisionFilterGroup = 1
    cannonBody.collisionFilterMask = 1

    const collideEventListener = (event: CANNON.ICollisionEvent) => {
        onCollideWithBody(event)
    };

    cannonBody.addEventListener("collide", collideEventListener)

    // cannonBody.sleep()
    world.addBody(cannonBody)

    return cannonBody
}

function onCollideWithBody(event: CANNON.ICollisionEvent){
    // console.log('event is', event)
    // if(event.body.collisionFilterGroup === 2){
    //     // console.log('bumped a car')
    // }
    console.log('bumped')
}

export function updateVehicleDirection(dt:number){
    let vehicle = testVehicles.get(localAid)
    if(vehicle.turning > 0){
        switch(vehicle.turning){
            case 1:
                setTargetHeading(-2)
                break;

            case 2:
                setTargetHeading(2)
                break;
        }
    }
}

export function updateVehicleSpeed(dt:number, player:any){
    let vehicle = testVehicles.get(localAid)
    if(vehicle.accelerating){
        if(vehicle.currentSpeed < vehicle.maxSpeed){
            vehicle.currentSpeed += (vehicle.acceleration * dt)
            vehicle.currentSpeed = Math.min(vehicle.currentSpeed, vehicle.maxSpeed)
        }
    }else{
        if (vehicle.currentSpeed > 0) {
            vehicle.currentSpeed -= (vehicle.acceleration * dt);
            vehicle.currentSpeed = Math.max(vehicle.currentSpeed, 0)
        }	
    }
}

export function turning(direction:any){
    let vehicle = testVehicles.get(localAid)
    if(vehicle.currentSpeed > 10){
        vehicle.turning = direction
    }else{
        vehicle.turning = 0
    }
}

export function accelerateVehicle(){
    let vehicle = testVehicles.get(localAid)
    if(vehicle.active){
        vehicle.accelerating = true
    }  
}

export function decelerateVehicle(){
    let vehicle = testVehicles.get(localAid)
    if(vehicle.active){
        vehicle.accelerating = false
    } 
}

export function setTargetHeading(heading:number){
    let vehicle = testVehicles.get(localAid)
    if(vehicle.active){
        vehicle.targetHeading += heading
    } 
}

export function applyVehiceForce(dt:number){
    let vehicle = testVehicles.get(localAid)

        //Velocity direction
		//Apply a force to the cannon body in the direction the vehicle is currently facing
		const targetDirection = getForwardDirectionFromRotation(vehicle.heading)
		const targetVelocity  = targetDirection.scale(vehicle.currentSpeed * 1000)
		
		vehicle.cannonBody.applyForce(targetVelocity, vehicle.cannonBody.position)
		
		// Clamp the velocity to the max speed		
		if (Vector3.lengthSquared(vehicle.cannonBody.velocity) > (vehicle.maxSpeed * vehicle.maxSpeed)) {
			const velocityNorm = vehicle.cannonBody.velocity.clone()
				  velocityNorm.normalize()
				  velocityNorm.mult(vehicle.maxSpeed)
                  vehicle.cannonBody.velocity.copy(velocityNorm)
		}

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

    let cannonPosition = vehicle.cannonBody.position
    let dclPosition = Vector3.create(cannonPosition.x, cannonPosition.y, cannonPosition.z)

    vehicle.timeSinceLastTweenPos = 0
    vehicle.timeToNextTweenPos    = vehicle.tweenPosDuration - 50
		
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

export function tweenToHeading(vehicle:any){
    const transformRot = Transform.getMutable(vehicle.entityRot);
		if (transformRot) {
			
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

export function leaveVehicle(){
    let vehicle = testVehicles.get(localAid)
    vehicle.active = false
}