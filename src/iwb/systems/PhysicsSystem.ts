
import { Entity, Transform, engine } from '@dcl/sdk/ecs';
import { Vector3 } from '@dcl/sdk/math';
import { world } from '../physics';

const fixedTimeStep: number = 1.0 / 60.0 // seconds
const maxSubSteps: number = 3

export let forwardVector:any

export function setForwardVector(){
    forwardVector = Vector3.rotate(Vector3.Forward(), Transform.get(engine.CameraEntity).rotation) // Camera's forward vector
}

export function PhysicsUpdateSystem(dt: number): void {
    world.step(fixedTimeStep, dt, maxSubSteps)

    // for (const [entity] of engine.getEntitiesWith(BallComponent)) {
    //   const ballTransform = Transform.getMutable(entity)
    //   let object = ballBodies.get(entity)
    //   if(object){

    //     gameTargets.forEach((target)=>{
    //       if(checkOverlap(object.pBody, target.pTarget) && object.userId === localPlayer.userId){
    //         sendScore(entity, target.id)
    //       }
    //     })

    //     ballTransform.position = object.pBody.position
    //     // ballTransform.rotation = object.pBody.quaternion

    //     if(ballTransform.position.y < 20 || ballTransform.position.z < 0 || ballTransform.position.z > 64 || ballTransform.position.x < 0 || ballTransform.position.x > 64){
    //         removeBall(entity)
    //     }
    //   }
    // }

    forwardVector = Vector3.rotate(Vector3.Forward(), Transform.get(engine.CameraEntity).rotation)
  }