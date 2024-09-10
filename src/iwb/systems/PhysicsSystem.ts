
import { Entity, Transform, engine } from '@dcl/sdk/ecs';
import { Vector3 } from '@dcl/sdk/math';
import { world } from '../physics';
import { playerMode } from '../components/Config';
import { SCENE_MODES } from '../helpers/types';
import { physicsObjects, playerPhysics, testVehicles } from '../components/Vehicle';

const fixedTimeStep: number = 1.0 / 60.0 // seconds
const maxSubSteps: number = 10

export let forwardVector:any

export function setForwardVector(){
    forwardVector = Vector3.rotate(Vector3.Forward(), Transform.get(engine.CameraEntity).rotation) // Camera's forward vector
}

export function PhysicsUpdateSystem(dt: number): void {
    if(playerMode !== SCENE_MODES.PLAYMODE){
        return
    }
    world.step(fixedTimeStep, dt, maxSubSteps)

    let playerTransform = Transform.get(engine.PlayerEntity).position
    playerPhysics.position.set(playerTransform.x, playerTransform.y + 0.5, playerTransform.z);

    physicsObjects.forEach((object:any, aid:string)=>{
        let objectTransform = Transform.getMutableOrNull(object.entity)
        if(objectTransform){
            objectTransform.position = object.cannonBody.position
            objectTransform.rotation = object.cannonBody.quaternion
        }
    })
  }