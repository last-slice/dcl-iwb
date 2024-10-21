import { AvatarAnchorPointType, AvatarAttach, CameraModeArea, ColliderLayer, EasingFunction, engine, Entity, GltfContainer, RaycastQueryType, raycastSystem, Transform, Tween, TweenLoop, TweenSequence } from "@dcl/sdk/ecs";
import { GunDataComponent } from "../helpers/Components";
import { COMPONENT_TYPES, GAME_TYPES, GAME_WEAPON_TYPES, SERVER_MESSAGE_TYPES, Triggers } from "../helpers/types";
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import { addGunRecoilSystem, isProcessingGunRay, processGunArray, removeAutoFiringSystem, removeGunRecoilSystem } from "../systems/GunSystem";
import { getDistance, turn } from "../helpers/functions";
import { colyseusRoom, sendServerMessage } from "./Colyseus";
import { localPlayer, localUserId } from "./Player";
import { utils } from "../helpers/libraries";
import { runGlobalTrigger } from "./Triggers";
import { addForceCamera } from "../modes/Play";
import { KeepRotatingComponent } from "./Actions";

export function unequipUserWeapon(scene:any){
    removeGunRecoilSystem()
    removeAutoFiringSystem()
    runGlobalTrigger(scene, Triggers.ON_UNEQUIP_WEAPON, {})
}

export function removeLocaPlayerWeapons(){
  if(localPlayer.weapon){
    engine.removeEntity(localPlayer.weapon.weaponEntity)
    engine.removeEntity(localPlayer.weapon.weaponFPVEntity)
    engine.removeEntity(localPlayer.weapon.weaponMuzzleEntity)
    engine.removeEntity(localPlayer.weapon.weaponFPVParentEntity)
  
    sendServerMessage(SERVER_MESSAGE_TYPES.REMOVE_WEAPONS_BUILD_MODE, {})
  }
}

export function equipUserWeapon(scene:any, weaponInfo:any){
    // let gameItemInfo = scene[COMPONENT_TYPES.GAME_ITEM_COMPONENT].get(entityInfo.aid)
    // if(!gameItemInfo){
    //     console.log('error getting weapon item info')
    //     return
    // }//

    let iwbInfo = scene[COMPONENT_TYPES.IWB_COMPONENT].get(weaponInfo.aid)

    addForceCamera(0)
    addFPVWeapon(weaponInfo, iwbInfo)

    runGlobalTrigger(scene, Triggers.ON_EQUIP_WEAPON, {projectile:weaponInfo.projectile})

    GunDataComponent.createOrReplace(weaponInfo.weaponFPVEntity, {
        active: false,
        multiplayer: weaponInfo.synced ? true : false,
        recoilFactor: 0,
        range: weaponInfo.range,
        ammo: weaponInfo.ammo,
        magSize: weaponInfo.magSize,
        maxAmmo: weaponInfo.maxAmmo,
        recoilSpeed: weaponInfo.recoilSpeed,
        projectile: weaponInfo.projectile,
        sceneId: scene.id,
        muzzlePosition: weaponInfo.muzzleOffsetFPV,
        recoilPosition: Vector3.create(weaponInfo.pOffsetFPV.x + 0.1, weaponInfo.pOffsetFPV.y - 0.08, weaponInfo.pOffsetFPV.z - 0.05),
        restPosition: weaponInfo.pOffsetFPV,//
        // restRotation:  Quaternion.create(gunFPSRotation.x, gunFPSRotation.y, gunFPSRotation.z, gunFPSRotation.w),
        // recoilRotation: Quaternion.multiply(Quaternion.create(gunFPSRotation.x, gunFPSRotation.y, gunFPSRotation.z, gunFPSRotation.w), Quaternion.fromEulerDegrees(-30,-10,20))
    })

    let gunTransform = {...Transform.get(weaponInfo.weaponFPVParentEntity).position}
    
    KeepRotatingComponent.createOrReplace(weaponInfo.weaponFPVParentEntity)

    Tween.createOrReplace(weaponInfo.weaponFPVParentEntity, {
      mode: Tween.Mode.Move({
        start: Vector3.add(gunTransform, Vector3.create(0, 0.005, 0)),
        end: Vector3.add(gunTransform, Vector3.create(0, -0.005, 0))
      }),
      duration: 1000,
      easingFunction: EasingFunction.EF_LINEAR,
      })
      
      TweenSequence.createOrReplace(weaponInfo.weaponFPVParentEntity, { sequence: [], loop: TweenLoop.TL_YOYO })

    if(weaponInfo.fireRate !== 0){
      addGunRecoilSystem()
    }
    
    localPlayer.weaponType = GAME_WEAPON_TYPES.GUN
}

export function addFPVWeapon(weaponInfo:any, entityInfo:any){ 
  if(weaponInfo.type > -1){
      weaponInfo.weaponFPVParentEntity = engine.addEntity()
      Transform.create(weaponInfo.weaponFPVParentEntity, {
          parent: engine.CameraEntity
      })

      weaponInfo.weaponFPVEntity = engine.addEntity()
      Transform.createOrReplace(weaponInfo.weaponFPVEntity, {
        parent: weaponInfo.weaponFPVParentEntity,
        position: weaponInfo.pOffsetFPV,
        rotation: Quaternion.fromEulerDegrees(weaponInfo.rOffsetFPV.x, weaponInfo.rOffsetFPV.y, weaponInfo.rOffsetFPV.z),
        scale: weaponInfo.sizeFPV,
      })

      weaponInfo.weaponMuzzleEntity = engine.addEntity()
      Transform.createOrReplace(weaponInfo.weaponMuzzleEntity, {
        parent: weaponInfo.weaponFPVParentEntity,
        position: weaponInfo.muzzleOffsetFPV,
      })

      GltfContainer.createOrReplace(weaponInfo.weaponFPVEntity, {src: "assets/" + entityInfo.id + ".glb", invisibleMeshesCollisionMask:ColliderLayer.CL_NONE, visibleMeshesCollisionMask: ColliderLayer.CL_NONE})
      console.log('weapong entity is', weaponInfo.weaponFPVEntity)
      return weaponInfo.weaponFPVEntity
  }
}

export function attemptFireWeapon(dt:number){
    // let speed:any
    // let hitpoint:any

    // let distance = GunDataComponent.getMutable(weapon).range
  
    // if(isProcessingGunRay || !weapon || !GunDataComponent.has(weapon)){
    //   return
    // }
  
    // processGunArray()

    // GunDataComponent.getMutable(weapon).active = true
    // GunDataComponent.getMutable(weapon).recoilFactor = 0

    // raycastSystem.registerGlobalDirectionRaycast(
    //     {
    //       entity: engine.CameraEntity,
    //       opts: {
    //         queryType: RaycastQueryType.RQT_HIT_FIRST,
    //         direction: Vector3.rotate(
    //           Vector3.Forward(),
    //           Transform.get(engine.CameraEntity).rotation,
    //         ),
    //         maxDistance: distance
    //       },
    //     },
    //     function (raycastResult) {
    //       console.log("RAYCAST RESULT - ", raycastResult)
    
    //       const playerPos = Transform.get(engine.PlayerEntity).position
    //       const CameraPos = Transform.get(engine.CameraEntity).position
    //       const CameraRot = Transform.get(engine.CameraEntity).rotation
    
    //       const startPosition = Vector3.add(playerPos, Vector3.rotate(Vector3.create(0.5, 0.4, 1),Transform.get(engine.CameraEntity).rotation))
      
    
    //       if(raycastResult.hits.length === 0){
    //         speed = 1
    //         let fake = Vector3.Forward()
    //         fake = Vector3.scale(fake, distance)
    //         fake = Vector3.rotate(fake, CameraRot)
    //         hitpoint = Vector3.add(CameraPos, fake)
    //       }
    //       else{
    
    //         // checkEnemyHit(raycastResult.hits[0].entityId as Entity)
    
    //         distance = getDistance(CameraPos, raycastResult.hits[0].position)
    //         speed = 1
    //         hitpoint = raycastResult.hits[0].position
    //       }
    
    //       let newPos = hitpoint
    //       shootBeam({start:startPosition, target:newPos, speed:speed, distance:distance, player:localUserId})

    //       if(GunDataComponent.getMutable(weapon).multiplayer){
    //         sendServerMessage(SERVER_MESSAGE_TYPES.SHOOT, {start:startPosition, target:newPos, speed:speed, distance:distance, player:localUserId, sceneId:GunDataComponent.getMutable(weapon).sceneId, soloShot:true})
    //       }
    //     }
    //   )
}

export function shootBeam(info:any){
    console.log('shooting beam', info)
    let start = Vector3.create(info.start.x, info.start.y, info.start.z)
    let target = Vector3.create(info.target.x, info.target.y, info.target.z)
    let laser = engine.addEntity()
    
    // let projectile = "assets/" + GunDataComponent.getMutable(weapon).projectile + ".glb"
    // GltfContainer.create(laser, {src:projectile, invisibleMeshesCollisionMask:0, visibleMeshesCollisionMask:0})
    // Transform.create(laser)




  
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
  