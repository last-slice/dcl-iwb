
import { Animator, AudioSource, Entity, GltfContainer, Material, MeshRenderer, Transform, engine } from '@dcl/sdk/ecs';
import { Color3, Color4, Quaternion, Vector3 } from '@dcl/sdk/math';
import * as CANNON from 'cannon/build/cannon'
import { loadPhysicsWorld } from './world';
import resources, { colors } from '../helpers/resources';
import { PhysicsUpdateSystem } from '../systems/PhysicsSystem';
import { VehicleInputSystem } from '../systems/VehicleInputSystem';
import { VehicleMovementSystem } from '../systems/VehicleMovementSystem';

export let ballBodies:Map<Entity, any> = new Map()
export let world:CANNON.World 
export let velocity:number = 25
export let mass = 5

let size:number = .1
let ballCount = 2

export function createPhysics(){
    world = new CANNON.World()
    world.gravity.set(0, -9.82, 0) // m/s²

    loadPhysicsWorld(world)

    engine.addSystem(PhysicsUpdateSystem)
    engine.addSystem(VehicleInputSystem)
    engine.addSystem(VehicleMovementSystem)
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

export function removeBall(entity:Entity){
    let object = ballBodies.get(entity)
      if(object){
        world.remove(object.pBody)
      }

    ballBodies.delete(entity)    
    engine.removeEntity(entity)
}

export function createBall(info:any){
    // let pos = info.pos
    // let direction = info.direction

    // let entity = engine.addEntity()
    // Transform.createOrReplace(entity, {position: Vector3.create(pos.x, pos.y + 0.7, pos.z), scale: Vector3.create(size, size, size), rotation:Quaternion.fromEulerDegrees(0, info.rot, 0)})
    // // GltfContainer.create(entity, {src: resources.models.directory + resources.models.pigs[info.id]})

    // const ballTransform = Transform.get(entity)

    // const ballBody: CANNON.Body = new CANNON.Body({
    //   mass: mass,
    //   position: new CANNON.Vec3(ballTransform.position.x, ballTransform.position.y, ballTransform.position.z), // m
    //   shape: new CANNON.Sphere(size)
    // })

    // ballBody.material = ballPhysicsMaterial
    // ballBody.linearDamping = 0.4
    // ballBody.angularDamping = 0.4

    // world.addBody(ballBody)
    // ballBodies.set(entity, {pBody:ballBody, userId: info.userId})

    // ballBody.velocity.set(direction.x * velocity, direction.y * velocity, direction.z * velocity)

    // // BallComponent.create(entity)
    // ballCount++

    // AudioSource.createOrReplace(entity, {audioClipUrl:"sounds/8bit_jump.mp3", playing:true, volume:.05})
    // Animator.create(entity, {states: [{clip:"Fly", playing:true, loop:true}]})
}