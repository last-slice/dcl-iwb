import { EasingFunction, engine, Entity, GltfContainer, RaycastQueryType, raycastSystem, Transform, Tween } from "@dcl/sdk/ecs";
import { GunDataComponent } from "../helpers/Components";
import { COMPONENT_TYPES, SERVER_MESSAGE_TYPES, Triggers } from "../helpers/types";
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import { addGunRecoilSystem, isProcessingGunRay, processGunArray, removeGunRecoilSystem } from "../systems/GunSystem";
import { getDistance, turn } from "../helpers/functions";
import { colyseusRoom, sendServerMessage } from "./Colyseus";
import { localPlayer, localUserId } from "./Player";
import { utils } from "../helpers/libraries";
import { runGlobalTrigger } from "./Triggers";

let weapon:Entity
let gunRootCamera: Entity
let gunRootRightHand: Entity

const gunFPSPosition = Vector3.create(0.2, -0.25, 0.2)
const gunFPSScale = Vector3.create(0.8, 0.8, 0.8) 
const gunFPSRotation = Quaternion.fromEulerDegrees(0,0,0)


export function unequipUserWeapon(scene:any){
    removeGunRecoilSystem()
    runGlobalTrigger(scene, Triggers.ON_UNEQUIP_WEAPON, {})

}

export function equipUserWeapon(scene:any, entityInfo:any, actionInfo:any){
    let gameItemInfo = scene[COMPONENT_TYPES.GAME_ITEM_COMPONENT].get(entityInfo.aid)
    if(!gameItemInfo){
        console.log('error getting weapon item info')
        return
    }

    runGlobalTrigger(scene, Triggers.ON_EQUIP_WEAPON, {projectile:gameItemInfo.projectile})

    GunDataComponent.createOrReplace(entityInfo.entity, {
        active: false,
        multiplayer: actionInfo.channel === 0 ? false : true,
        recoilFactor: 0,
        range: gameItemInfo.range,
        ammo: gameItemInfo.ammo,
        magSize: gameItemInfo.magSize,
        maxAmmo: gameItemInfo.maxAmmo,
        recoilSpeed: gameItemInfo.fireRate,
        projectile: gameItemInfo.projectile,
        sceneId: scene.id,
        recoilPosition: Vector3.create(gunFPSPosition.x+0.1, gunFPSPosition.y-0.08, gunFPSPosition.z - 0.05),
        restPosition: Vector3.create(gunFPSPosition.x, gunFPSPosition.y, gunFPSPosition.z),
        restRotation:  Quaternion.create(gunFPSRotation.x, gunFPSRotation.y, gunFPSRotation.z, gunFPSRotation.w),
        recoilRotation: Quaternion.multiply(Quaternion.create(gunFPSRotation.x, gunFPSRotation.y, gunFPSRotation.z, gunFPSRotation.w), Quaternion.fromEulerDegrees(-30,-10,20))
    })
    weapon = entityInfo.entity

    addGunRecoilSystem()
}

export function attemptFireWeapon(dt:number){
    let speed:any
    let hitpoint:any

    let distance = GunDataComponent.getMutable(weapon).range
  
    if(isProcessingGunRay || !weapon || !GunDataComponent.has(weapon)){
      return
    }
  
    processGunArray()

    GunDataComponent.getMutable(weapon).active = true
    GunDataComponent.getMutable(weapon).recoilFactor = 0

    raycastSystem.registerGlobalDirectionRaycast(
        {
          entity: engine.CameraEntity,
          opts: {
            queryType: RaycastQueryType.RQT_HIT_FIRST,
            direction: Vector3.rotate(
              Vector3.Forward(),
              Transform.get(engine.CameraEntity).rotation,
            ),
            maxDistance: distance
          },
        },
        function (raycastResult) {
          console.log("RAYCAST RESULT - ", raycastResult)
    
          const playerPos = Transform.get(engine.PlayerEntity).position
          const CameraPos = Transform.get(engine.CameraEntity).position
          const CameraRot = Transform.get(engine.CameraEntity).rotation
    
          const startPosition = Vector3.add(playerPos, Vector3.rotate(Vector3.create(0.5, 0.4, 1),Transform.get(engine.CameraEntity).rotation))
      
    
          if(raycastResult.hits.length === 0){
            speed = 1
            let fake = Vector3.Forward()
            fake = Vector3.scale(fake, distance)
            fake = Vector3.rotate(fake, CameraRot)
            hitpoint = Vector3.add(CameraPos, fake)
          }
          else{
    
            // checkEnemyHit(raycastResult.hits[0].entityId as Entity)
    
            distance = getDistance(CameraPos, raycastResult.hits[0].position)
            speed = 1
            hitpoint = raycastResult.hits[0].position
          }
    
          let newPos = hitpoint
          shootBeam({start:startPosition, target:newPos, speed:speed, distance:distance, player:localUserId})

          if(GunDataComponent.getMutable(weapon).multiplayer){
            sendServerMessage(SERVER_MESSAGE_TYPES.SHOOT, {start:startPosition, target:newPos, speed:speed, distance:distance, player:localUserId, sceneId:GunDataComponent.getMutable(weapon).sceneId, soloShot:true})
          }
        }
      )
}

export function shootBeam(info:any){
    console.log('shooting beam', info)
    let start = Vector3.create(info.start.x, info.start.y, info.start.z)
    let target = Vector3.create(info.target.x, info.target.y, info.target.z)
    let laser = engine.addEntity()
    
    let projectile = "assets/" + GunDataComponent.getMutable(weapon).projectile + ".glb"
      GltfContainer.create(laser, {src:projectile, invisibleMeshesCollisionMask:0, visibleMeshesCollisionMask:0})
      Transform.create(laser)
  
    // try{
    // if(info.player == localUserId){
    //     // playSound(SOUND_TYPES.PLAYER_LASER_TIER1)
    // }
    // else{
    //     createTempSound(
    //     2,
    //     SOUND_TYPES.PLAYER_LASER_TIER1,
    //     false,
    //     3,
    //     undefined,
    //     undefined
    //     )      
    //     }
    // }
    // catch(e){
    // console.log('error playing gun sound', e)
    // }
  
    Transform.createOrReplace(laser, {position: start})
    // let newY = Transform.getMutable(laser).position
    // newY.y -= 1
  
    turn(laser,target)
    // BeamComponent.create(laser)
  
    Tween.create(laser, {
      mode: Tween.Mode.Move({
        start: start,
        end: target,
      }),
      duration: (info.distance / info.speed) * 1000,
      easingFunction: EasingFunction.EF_LINEAR,
    })
  
    utils.timers.setTimeout(()=>{
      engine.removeEntity(laser)
    }, (info.distance / info.speed) * 1000)
  }
  