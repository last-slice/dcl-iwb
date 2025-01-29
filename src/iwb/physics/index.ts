
import { Animator, AudioSource, Entity, GltfContainer, Material, MeshRenderer, Transform, engine } from '@dcl/sdk/ecs';
import { loadPhysicsWorld } from './world';
import { PhysicsUpdateSystem } from '../systems/PhysicsSystem';
import { VehicleInputSystem } from '../systems/VehicleInputSystem';
import { VehicleMovementSystem } from '../systems/VehicleMovementSystem';
import { ProcessPendingPhysicsBodies } from '../components/Physics';
import { CANNON } from '../helpers/libraries';

export let world:CANNON.World 
export const WORLD_UP = new CANNON.Vec3(0, 1, 0);

export async function createPhysics(){
    world = new CANNON.World()
    world.gravity.set(0, -9.82, 0) // m/s²//

    await loadPhysicsWorld(world)

    engine.addSystem(PhysicsUpdateSystem)
    engine.addSystem(VehicleInputSystem)
    engine.addSystem(VehicleMovementSystem)
    engine.addSystem(ProcessPendingPhysicsBodies)
}

export function checkOverlap(bodyA:any, bodyB:any) {
    var aabbA = new CANNON.AABB();
    var aabbB = new CANNON.AABB();
    bodyA.computeAABB();
    bodyB.computeAABB();
    aabbA.copy(bodyA.aabb);
    aabbB.copy(bodyB.aabb);

    return aabbA.overlaps(aabbB);
}

export function createCannonBody(data:any, rotation:boolean, cGroup:number){
  let cannonBody = new CANNON.Body(data)
  cannonBody.fixedRotation = rotation
  cannonBody.collisionFilterGroup = 1
  cannonBody.collisionFilterMask = 1

  const collideEventListener = (event:any) => {
      onCollideWithBody(event)
  };

  cannonBody.addEventListener("collide", collideEventListener)
  world.addBody(cannonBody)

  console.log('creating cannon body for player')

  return cannonBody
}

export function createCannonShape(physicsData:any, transform:any){
  switch(physicsData.shape){
    case 0:
      return new CANNON.Box(new CANNON.Vec3(0.35, 0.95, 0.35))

    case 1:
      return new CANNON.Box(new CANNON.Vec3(0.35, 0.95, 0.05))

    case 2:
      return new CANNON.Sphere(1)

    default:
      return new CANNON.Box(new CANNON.Vec3(0.35, 0.95, 0.35))
  }
}


export function onCollideWithBody(event:any){
  // console.log('event is', event)
  // if(event.body.collisionFilterGroup === 2){
  //     // console.log('bumped a car')
  // }
  // console.log('bumped')
}