
import { Entity, Transform, engine } from '@dcl/sdk/ecs';
import { Vector3 } from '@dcl/sdk/math';
import { world, WORLD_UP } from '../physics';
import { playerMode } from '../components/Config';
import { COMPONENT_TYPES, SCENE_MODES } from '../helpers/types';
import { physicsObjects, testVehicles } from '../components/Vehicle';
import { localPlayer } from '../components/Player';
import { colyseusRoom, connected } from '../components/Colyseus';
import { getEntity } from '../components/iwb';
import { testEntities } from '../components/Physics';
import { movePlayerTo } from '~system/RestrictedActions';
import { CANNON } from '../helpers/libraries';

const fixedTimeStep: number = 1.0 / 60.0//
const maxSubSteps: number = 10

export let forwardVector:any

export let serverPhysicsItems:Map<string, any> = new Map()

export function setForwardVector(){
    forwardVector = Vector3.rotate(Vector3.Forward(), Transform.get(engine.CameraEntity).rotation) // Camera's forward vector
}

export function PhysicsUpdateSystem(dt: number): void {
    if(playerMode !== SCENE_MODES.PLAYMODE || !connected || !localPlayer){
        return
    }
    // world.step(fixedTimeStep, dt, maxSubSteps)//

    // colyseusRoom.state.scenes.forEach((scene:any)=>{
    //   scene[COMPONENT_TYPES.PHYSICS_COMPONENT].forEach((physicsItem:any, aid:string)=>{
    //     if(physicsItem.type === 0){
    //         if(localPlayer.activeScene && scene.id === localPlayer.activeScene.id){
    //             // if(physicsItem.playerReactGravity){
    //             //     // console.log('need to float player')
    //             //     // movePlayerTo({newRelativePosition:{x:localPlayer.cannonBody.x, y:localPlayer.cannonBody.y, z:localPlayer.cannonBody.z}})
    //             //     // Transform.getMutable(engine.PlayerEntity).position = localPlayer.cannonBody.position
    //             // }else{
    //                 let playerTransform = Transform.get(engine.PlayerEntity).position
    //                 localPlayer.cannonBody.position.set(playerTransform.x, playerTransform.y + 0.5, playerTransform.z);
    //             // }
    //         }
    //     }

    //     if(physicsItem.cannonBody && aid === "3m5nho"){
    //         console.log('phsycis position', physicsItem.cannonBody.position)
    //         let entityInfo = getEntity(scene, aid)
    //         let objectTransform = Transform.getMutableOrNull(entityInfo.entity)
    //         let sceneTransform = Transform.getMutableOrNull(scene.parentEntity)

    //         // console.log(scene.parentEntity)
    //         // console.log(objectTransform)
    //         // console.log(physicsItem.cannonBody.position)

    //         if(objectTransform && sceneTransform){
    //             // console.log( Vector3.subtract(sceneTransform.position, physicsItem.cannonBody.position))
    //             // let position = Vector3.add(
    //             //                 Vector3.subtract(physicsItem.cannonBody.position, sceneTransform.position), 
    //             //                 Vector3.create(0,-0.5,0)
    //             //             )

    //             let position =  Vector3.subtract(physicsItem.cannonBody.position, sceneTransform.position)
   

    //             // if(physicsItem.offset !== undefined){
    //                 switch(physicsItem.shape){
    //                     case 0:
    //                         // position = Vector3.add(position, Vector3.create(0,physicsItem.offset.y / 2,0))//
    //                         // position = Vector3.add(position, Vector3.create(0,0.5,0))
    //                         // position = Vector3.add(position, Vector3.create(0,-1,0))
    //                         break;
    
    //                     case 2:
    //                         position = Vector3.add(position, Vector3.create(0,-0.5,0))
    //                         break;
    
    //                 }
    //                 // position = Vector3.subtract(
    //                 //     position,
    //                 //     Vector3.create(physicsItem.offset.x, physicsItem.offset.y, physicsItem.offset.z),
    //                 // )
    //                 // position = Vector3.subtract(position, Vector3.create(0,1-physicsItem.offset.y, 0))
    //             // }

    //             // console.log("p",position)
    //             // console.log("o", objectTransform.position)
                

    //             objectTransform.position = position
    //             objectTransform.rotation = physicsItem.cannonBody.quaternion

    //             // let ent = testEntities.get(aid)
    //             // let et = Transform.getMutable(ent)
    //             // let st = Transform.getMutable(ent)

    //             // et.position = position
    //             // st.rotation = physicsItem.cannonBody.quaternion

    //             // console.log('position', position)//
    //         }
    //     }
    //   })  
    // })

    serverPhysicsItems.forEach((aid:string, physicsData:any)=>{
        let entityInfo = getEntity(physicsData.scene, aid)
            let objectTransform = Transform.getMutableOrNull(entityInfo.entity)
            let sceneTransform = Transform.getMutableOrNull(physicsData.sceneParent)

            if(objectTransform && sceneTransform){
                let position =  Vector3.subtract(physicsData.body.position, sceneTransform.position)
                switch(physicsData.shape){
                    case 2:
                        position = Vector3.add(position, Vector3.create(0,-0.5,0))
                        break;

                }
                objectTransform.position = position
                objectTransform.rotation = physicsData.body.quaternion
            }
    })
  }

function hasFallen(body:any){
  // 1. Compute the pin's up vector in world space
  const pinUp = new CANNON.Vec3(0, 1, 0);
  body.quaternion.vmult(pinUp, pinUp);

  // 2. Compare dot product of pinUp with the global world up
  const dot = pinUp.dot(WORLD_UP); 
  // If the pin is perfectly upright, dot ~ 1.0
  // If the pin is lying sideways, dot ~ 0.0 or negative

  // 3. Decide a threshold for "fallen."
  // For instance, if the pin’s angle from upright is more than ~45°, 
  // the dot product will be less than cos(45°) = 0.707.
  const threshold = Math.cos(Math.PI / 4); // ~0.707

    // Check if it's not spinning too much
  const angularSpeed = body.angularVelocity.length();
  const isSettled = angularSpeed < 0.5; // tweak threshold as needed

  return dot < threshold && isSettled;
}
