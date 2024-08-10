import { Animator, AvatarAnchorPointType, AvatarAttach, CameraModeArea, CameraType, EasingFunction, engine, Entity, GltfContainer, MeshRenderer, PBAvatarAttach, RaycastQueryType, raycastSystem, Transform, Tween, TweenLoop, TweenSequence, VisibilityComponent } from "@dcl/sdk/ecs"
import { Actions, COMPONENT_TYPES, GAME_WEAPON_TYPES, NOTIFICATION_TYPES, PLAYER_GAME_STATUSES, SERVER_MESSAGE_TYPES, SOUND_TYPES, Triggers } from "../helpers/types"
import { actionQueue, getTriggerEvents, runGlobalTrigger, runSingleTrigger } from "./Triggers"
import { colyseusRoom, sendServerMessage } from "./Colyseus"
import { hideNotification, showNotification } from "../ui/Objects/NotificationPanel"
import { getEntity } from "./IWB"
import { isGameAsset, disableLevelAssets, attemptLoadLevel } from "./Level"
import { localPlayer, localUserId } from "./Player"
import { utils } from "../helpers/libraries"
import { setUIClicked } from "../ui/ui"
import { displayGameLobby, updateLobbyPanel } from "../ui/Objects/GameLobby"
import { Quaternion, Vector3 } from "@dcl/sdk/math"
import { getDistance, getRandomPointInArea, getRandomString, roundQuaternion, turn } from "../helpers/functions"
import { movePlayerTo } from "~system/RestrictedActions"
import { disableUiTextPlayMode, uiDataUpdate } from "./UIText"
import { GunDataComponent } from "../helpers/Components"
import { addGunRecoilSystem, isProcessingGunRay, processGunArray } from "../systems/GunSystem"
import { displayCooldown } from "../ui/Objects/GameCooldownUI"
import { stopAllIntervals } from "./Timer"
import { updateAssetBuildVisibility } from "./Visibility"
import { disableCounterForPlayMode } from "./Counter"
import { displaySkinnyVerticalPanel } from "../ui/Reuse/SkinnyVerticalPanel"

export let gameEndingtimer:any
export let gameEntities:any[] = []
export let cooldownStart = 0
export let pendingGameCleanup = false

const gunFPSPosition = Vector3.create(0.2, -0.25, 0.2)
const gunFPSScale = Vector3.create(0.8, 0.8, 0.8) 
const gunFPSRotation = Quaternion.fromEulerDegrees(0,0,0)

export function updatePendingGameCleanup(value:boolean){
    pendingGameCleanup = value
}

export function disableLevelPlayMode(scene:any, entityInfo:any){
    let itemInfo = scene[COMPONENT_TYPES.LEVEL_COMPONENT].get(entityInfo.aid)
    console.log('disable level play mode item', itemInfo)
    if(itemInfo){
        updateAssetBuildVisibility(scene, false, entityInfo)

        //reset counters
        disableCounterForPlayMode(scene, entityInfo)

        //reset states

        //reset ui
        disableUiTextPlayMode(scene, entityInfo)
    }
}

export function gameListener(scene:any){
    scene[COMPONENT_TYPES.GAME_COMPONENT].onAdd((gameComponent:any, aid:any)=>{
        let info = getEntity(scene, aid)
        if(!info){
            return
        }

        gameComponent.listen("gameCountdown", (c:any, p:any)=>{
            console.log('game countodown', p, c, gameComponent.startingSoon)
            if((p !== undefined || p !== -500) && c > 0 && gameComponent.startingSoon){
                console.log('countdown started')
                uiDataUpdate(scene, info.entity, true)
            }

            // if(p !== undefined && (c !== -500 || c !== 0)){
            //     runGlobalTrigger(scene, Triggers.ON_GAME_START_COUNTDOWN)
            // }
    
            if(c === -500){
                // displayGamingCountdown(false, 0)
                //game countdown over
            }
        })

        gameComponent.listen("startingSoon", (c:any, p:any)=>{
            console.log('starting soon variable', p, c)
            if(c){
                prepGame(scene, aid, info, gameComponent)
            }
        })

        gameComponent.listen("started", (c:any, p:any)=>{
            console.log('started variable', p, c)
            if(c && (p === undefined || !p)){
                startGame(scene, aid, info, gameComponent)
            }
        })

        gameComponent.listen("ended", (c:any, p:any)=>{
            // console.log('ended variable', p, c)
            if(c && (p === undefined || !p)){
                endGame()
            }
        })

        gameComponent.listen("reset", (c:any, p:any)=>{
            console.log('reset variable', p, c)
            if(c){
                resetGame(gameComponent)
            }
        })
    })
}

export async function disableGameAsset(scene:any, iwbInfo:any){

    // if(isLevelAsset(scene, iwbInfo.aid) || isGameAsset(scene, iwbInfo.aid)){
    //     console.log('we have game asset to hide')
    //     disableLevelPlayMode(scene, iwbInfo)
    // }

    if(scene[COMPONENT_TYPES.LEVEL_COMPONENT].get(iwbInfo.aid)){
        console.log('we have game level to hide')
        disableLevelPlayMode(scene, iwbInfo)
    }

    if(isGameAsset(scene, iwbInfo.aid)){
        updateAssetBuildVisibility(scene, false, iwbInfo)
    }
}

export function attemptGameStart(info:any){
    let scene = colyseusRoom.state.scenes.get(info.sceneId)
    if(!scene){
        return
    }

    let gameInfo = scene[COMPONENT_TYPES.GAME_COMPONENT].get(info.aid)
    console.log('game start is', gameInfo)
    if(gameInfo.type === "SOLO"){
        if(info && info.canStart && info.level){
            localPlayer.canTeleport = !gameInfo.disableTeleport
            localPlayer.canMap = !gameInfo.disableMap

            let foundLevelAid:any
            scene[COMPONENT_TYPES.LEVEL_COMPONENT].forEach((levelInfo:any, aid:string) => {
                if(levelInfo.number === gameInfo.startLevel){
                    foundLevelAid = aid
                }
            });

            if(foundLevelAid){
                attemptLoadLevel(scene, gameInfo.currentLevelAid, foundLevelAid)
            }

            
            // let gameCurrentLevelEntity = getEntity(scene, gameInfo.currentLevelAid)
            // if(gameCurrentLevelEntity){
            //     handleSetNumber(scene, gameCurrentLevelEntity, {value: gameInfo.startLevel, counter:{}})
            // }
            // else{
            //     console.log('game current level entity has been deleted or cannot be found')
            // }
            
            // let entityInfo = getEntity(scene, info.level)
            // let actionInfo = scene[COMPONENT_TYPES.ACTION_COMPONENT].get(info.level)
            // if(actionInfo){
            //     if(actionInfo.actions && actionInfo.actions.length > 0){
            //         let action = actionInfo.actions.find(($:any)=> $.type === Actions.LOAD_LEVEL)
            //         if(action){
            //             localPlayer.canTeleport = !gameInfo.disableTeleport
            //             actionQueue.push({aid:info.level, action:action, entity:entityInfo.entity})
            //             setUIClicked(false)
            //         }
            //     }
            // }  
        }else{
            showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"" + gameInfo.name + " does not have a playable level yet!", animate:{enabled:true, return:true, time:5}})
        }
    }
    else{
        console.log('start multiplayer game')
        runGlobalTrigger(scene, Triggers.ON_JOIN_LOBBY, {input:0, pointer:0, entity:0})
        updateLobbyPanel(gameInfo)
        movePlayerToLobby(scene, gameInfo)
    }
}

export function movePlayerToLobby(scene:any, gameInfo:any){
    let position = Transform.get(scene.parentEntity).position
    let randomPoint = getRandomPointInArea(gameInfo.sp, gameInfo.ss.x, gameInfo.ss.y, gameInfo.ss.z)

    let spawnPosition = Vector3.add(position, randomPoint)
    movePlayerTo({newRelativePosition:spawnPosition})
}

export function attemptGameEnd(info:any){
    let scene = colyseusRoom.state.scenes.get(info.sceneId)
    // let gameInfo = scene[COMPONENT_TYPES.GAME_COMPONENT].get(info.aid)
    if(scene){
        stopAllIntervals(true)
        disableLevelAssets(scene)
        displaySkinnyVerticalPanel(false)
        //to do
        //clean up any game timers etc etc
    }
    localPlayer.canTeleport = true
    localPlayer.canMap = true
}

export function abortGameTermination(scene:any){
    if(localPlayer.gameStatus === PLAYER_GAME_STATUSES.PLAYING){
        utils.timers.clearTimeout(gameEndingtimer)
        hideNotification()
    }
}

export function killAllGameplay(){//
    if(localPlayer.gameStatus === PLAYER_GAME_STATUSES.PLAYING){
        sendServerMessage(SERVER_MESSAGE_TYPES.END_GAME, {})
        attemptGameEnd({sceneId: localPlayer.activeScene.id})
    }
}

export function checkGameplay(scene:any){
    if(localPlayer.gameStatus === PLAYER_GAME_STATUSES.PLAYING){
        gameEndingtimer = utils.timers.setTimeout(()=>{
            hideNotification()
            sendServerMessage(SERVER_MESSAGE_TYPES.END_GAME, {})
            attemptGameEnd({sceneId: scene.id})
        }, 1000 * 5)
        showNotification({type:NOTIFICATION_TYPES.MESSAGE, message: "Your Game will auto end in 5 seconds", animate:{enabled:true, return: false, time:5}})
    }
}

function prepGame(scene:any, aid:string, info:any, gameComponent:any){
    runGlobalTrigger(scene, Triggers.ON_GAME_START_COUNTDOWN, {input:0, pointer:0, entity:info.entity})

    addWeapons(gameComponent)
    addHitBoxes(gameComponent)
}

function startGame(scene:any, aid:string, info:any, gameInfo:any){
    ///enable ray casting,
    //add objects to players
    //do we load the game items here?
    //etc etc

    //do we check if player is playing right now? or expose that as a condition in the scene

    runGlobalTrigger(scene, Triggers.ON_GAME_START, {
        input:0,
        pointer:0,
        entity: info.entity
    })

    console.log('player game status is', localPlayer.gameStatus, localPlayer.gameId, aid, gameInfo)

    if(localPlayer && localPlayer.gameStatus === PLAYER_GAME_STATUSES.PLAYING && localPlayer.gameId === gameInfo.id){
        movePlayerToTeamSpawn(scene, gameInfo)
    }
}

function endGame(){
    // removePhysicsObjects()
}

function resetGame(gameInfo:any){
    gameEntities.forEach((item:any)=>{
        engine.removeEntity(item.entity)
    })
    gameEntities.length = 0

    gameInfo.teams.forEach((team:any)=>{
        team.mates.forEadh((mate:string)=>{
            let player = colyseusRoom.state.players.get(mate)
            removeWeapon(player)
        })
    })
}

function movePlayerToTeamSpawn(scene:any, gameInfo:any){
    let position = Transform.get(scene.parentEntity).position
    let teamInfo:any

    gameInfo.teams.forEach((team:any, aid:string)=>{
        if(team.mates && team.mates.includes(localUserId)){
            teamInfo = team
        }
    })

    if(teamInfo){
        let randomPoint = getRandomPointInArea(teamInfo.sp, teamInfo.ss.x, teamInfo.ss.y, teamInfo.ss.z)

        let spawnPosition = Vector3.add(position, randomPoint)
        movePlayerTo({newRelativePosition:spawnPosition})
    }
}

function addWeapons(gameInfo:any){
    console.log('adding game weapon', gameInfo)
    if(!gameInfo.hasWeapons){
        return
    }

    gameInfo.teams.forEach((team:any)=>{
        team.mates.forEadh((mate:string)=>{
            if(mate === localUserId){
                addLocalWeapon(gameInfo)
            }else{
                addOtherWeapon(gameInfo, mate)
            }
        })
    })
}

function addLocalWeapon(gameInfo:any){
    let forceFPV = engine.addEntity()
    gameEntities.push({entity:forceFPV, aid:getRandomString(5)})

    CameraModeArea.createOrReplace(forceFPV, {
        area: Vector3.create(2, 4, 2),
        mode: CameraType.CT_FIRST_PERSON,
      })
    Transform.createOrReplace(forceFPV, {position: Vector3.Zero(), parent:engine.PlayerEntity})

    let gunRootCamera = engine.addEntity()
    gameEntities.push({entity:gunRootCamera, aid:getRandomString(5)})

    let gunRootRightHand = engine.addEntity()
    gameEntities.push({entity:gunRootRightHand, aid:getRandomString(5)})

    Transform.create(gunRootCamera, {
      parent: engine.CameraEntity
    })
    AvatarAttach.createOrReplace(gunRootRightHand, { anchorPointId: AvatarAnchorPointType.AAPT_RIGHT_HAND })		

    let weapon = engine.addEntity()
    gameEntities.push({entity:weapon, aid:getRandomString(5)})

    let weaponModel:string = ""
    switch(gameInfo.model){
        case GAME_WEAPON_TYPES.GUN:
            break;
    }

    GunDataComponent.createOrReplace(weapon, {
        active: false,
        recoilFactor: 0,
        recoilSpeed: 3,
        recoilPosition: Vector3.create(gunFPSPosition.x+0.1, gunFPSPosition.y-0.08, gunFPSPosition.z - 0.05),
        restPosition: Vector3.create(gunFPSPosition.x, gunFPSPosition.y, gunFPSPosition.z),
        restRotation:  Quaternion.create(gunFPSRotation.x, gunFPSRotation.y, gunFPSRotation.z, gunFPSRotation.w),
        recoilRotation: Quaternion.multiply(Quaternion.create(gunFPSRotation.x, gunFPSRotation.y, gunFPSRotation.z, gunFPSRotation.w), Quaternion.fromEulerDegrees(-30,-10,20))
    })

    Transform.createOrReplace(weapon, {position: Vector3.create(8, -2, 8), rotation: Quaternion.fromEulerDegrees(0,90,0), scale: Vector3.create(1,1,1)})   
    GltfContainer.createOrReplace(weapon,{src: weaponModel})

    gunRootCamera = engine.addEntity()
    Transform.createOrReplace(gunRootCamera, {
        parent: engine.CameraEntity
    })

    const gunTranform = Transform.getMutable(weapon)       
    gunTranform.parent = gunRootCamera		
    Vector3.copyFrom(gunFPSPosition, gunTranform.position)
    gunTranform.scale = gunFPSScale
    gunTranform.rotation = gunFPSRotation

    Tween.create(gunRootCamera, {
      mode: Tween.Mode.Move({
        start: Vector3.create(0.15, -.17, 0.45),
        end: Vector3.create(0.15, -.18, 0.45),
      }),
      duration: 1000,
      easingFunction: EasingFunction.EF_LINEAR,
      })
      
    TweenSequence.create(gunRootCamera, { sequence: [], loop: TweenLoop.TL_YOYO })
    addGunRecoilSystem()

    let player = colyseusRoom.state.players.get(localUserId)
    player.hasWeaponEquipped = true
    player.inCooldown = false
    player.canAttack = true
    player.weapon = weapon
}

function addOtherWeapon(gameInfo:any, mate:string){
    let ohterPlayer = colyseusRoom.state.players.get(mate)
    if(ohterPlayer){
        let weapon = ohterPlayer.weapon ? ohterPlayer.weapon : engine.addEntity()
        gameEntities.push({entity:weapon, aid:getRandomString(5)})

        let weaponModel:string = ""
        switch(gameInfo.model){
            case GAME_WEAPON_TYPES.GUN:
                break;
        }
    
        // Animator.createOrReplace(ent,{
        //     states:[{
        //     clip: anim,
        //     playing: false,
        //     loop: false
        //     }],
        // })

        GltfContainer.createOrReplace(weapon,{src: weaponModel})
        Transform.createOrReplace(weapon, {position: Vector3.create(.17, 2.1, .21), parent:ohterPlayer.parent})

        ohterPlayer.weapon = weapon
        ohterPlayer.hasWeaponEquipped = true
        ohterPlayer.inCooldown = false
        ohterPlayer.canAttack = true
      }
}

function addHitBoxes(gameInfo:any){
    console.log('adding game hitboxes', gameInfo)
    if(!gameInfo.hasWeapons){
        return
    }

    gameInfo.teams.forEach((team:any)=>{
        team.mates.forEadh((mate:string)=>{
            let player = colyseusRoom.state.players.get(mate)

            let parent = engine.addEntity()
            let local = mate === localUserId

            let parentData:PBAvatarAttach = {
                avatarId: local ? undefined : player.address,
                anchorPointId: AvatarAnchorPointType.AAPT_SPINE2
            }
            AvatarAttach.create(parent, parentData)
            MeshRenderer.setBox(parent)

            player.hitBoxParent = parent

            let hitBox = engine.addEntity()
            Transform.create(hitBox, {parent: parent})
            // GltfContainer.create(hitBox, {src: 'assets/' + gameInfo.hitBox + ".glb"})

            MeshRenderer.setBox(hitBox)
            player.hitBox = hitBox
        })
    })
}

export function addGamePlayer(player:any, local:boolean){
    let parent = engine.addEntity()
    let parentData:PBAvatarAttach = {
        avatarId: local ? undefined : player.address,
        anchorPointId: AvatarAnchorPointType.AAPT_SPINE
    }
    AvatarAttach.create(parent, parentData)
    MeshRenderer.setBox(parent)

    player.parent = parent
}

export function removeGamePlayer(playerInfo:any){
    let player = colyseusRoom.state.players.get(playerInfo.address)
    if(!player){
        return
    }

    console.log('removing player info from multiplayer')
    engine.removeEntityWithChildren(player.parent)

    removeWeapon(player)
}

function removeWeapon(player:any){
    if(player.weapon){
        engine.removeEntity(player.weapon)
    }
  
    if(player.hitBox){
        engine.removeEntity(player.hitBox)
    }
}

export function startAttackCooldown(user:string){  
    let player = colyseusRoom.state.players.get(user)
    if(!player){
        return
    }

    player.inCooldown = true
    // disableCursor()
  
    displayCooldown(true)
  
    cooldownStart = 3
  
    let cooldownInt = utils.timers.setInterval(()=>{
      cooldownStart -= .1
    }, 100)
  
    utils.timers.setTimeout(()=>{
      displayCooldown(false)

      utils.timers.clearInterval(cooldownInt)
      cooldownStart = 0
  
      player.inCooldown = false
      if(player.canAttack){
        // enableCursor()
      }
    }, 1000 * cooldownStart)
}

export function createBeam(dt:number){
    let distance:any
    let speed:any
    let hitpoint:any
    
    let player = colyseusRoom.state.players.get(localUserId)
    let weapon = player.weapon
  
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
          maxDistance:500
        },
      },
      function (raycastResult) {
        console.log("RAYCAST RESULT - ", raycastResult)
  
        const playerPos = Transform.get(engine.PlayerEntity).position
        const CameraPos = Transform.get(engine.CameraEntity).position
        const CameraRot = Transform.get(engine.CameraEntity).rotation
    
        // const forwardVec = Vector3.create(1,-1,1)
        // Vector3.scale(forwardVec, .1)
        // Vector3.rotate(forwardVec, CameraRot)
    
        const startPosition = Vector3.add(playerPos, Vector3.rotate(Vector3.create(0.35, 0.4,0.1),Transform.get(engine.CameraEntity).rotation))
    
  
        if(raycastResult.hits.length === 0){
          distance = 30
          speed = 1
          let fake = Vector3.Forward()
          fake = Vector3.scale(fake, distance)
          fake = Vector3.rotate(fake, CameraRot)
          hitpoint = Vector3.add(CameraPos, fake)
        }
        else{

          checkEnemyHit(raycastResult.hits[0].entityId as Entity)
  
          distance = getDistance(CameraPos, raycastResult.hits[0].position)
          speed = 1
          hitpoint = raycastResult.hits[0].position
  
        //   if(raycastResult.hits[0].meshName && raycastResult.hits[0].meshName === "flyBot_collider"){
        //     if(raycastResult.hits[0].entityId){
        //       shootShip(raycastResult.hits[0].entityId as Entity)
        //     }
        //   }
        }
  
        let newPos = hitpoint
        shootBeam({start:startPosition, target:newPos, speed:speed, distance:distance, player:localUserId})
        sendServerMessage(SERVER_MESSAGE_TYPES.SHOOT, {start:startPosition, target:newPos, speed:speed, distance:distance, player:localUserId})
      }
    )
}

export function shootBeam(info:any){
    console.log('shooting beam', info)
    let start = Vector3.create(info.start.x, info.start.y, info.start.z)
    let target = Vector3.create(info.target.x, info.target.y, info.target.z)
    let laser = engine.addEntity()

    let projectile:string = "assets/4b5ea2e7-991a-47b1-9159-6c6b2ba210d2.glb"
  
    // let b:any
    //   if(weapon){
    //       switch(info.beam){
    //           case 't1':
    //              b= resources.models.beams.t1
    //               break;
    //           case 't2':
    //               b= resources.models.beams.t2
    //               break;
    //           case 't3':
    //               b= resources.models.beams.t3
    //               break;
    //           case 't4':
    //               b=  resources.models.beams.t4
    //               break;
    //           case 't5':
    //               b= resources.models.beams.t5
    //               break;
    //       }
    //     }
  
      GltfContainer.create(laser, {src:projectile})
      Transform.create(laser)
  
    //   try{
    //     if(info.player == localUserId){
    //       playSound(SOUND_TYPES.PLAYER_LASER_TIER1)
    //     }
    //     else{
    //       createTempSound(
    //         2,
    //         SOUND_TYPES.PLAYER_LASER_TIER1,
    //         false,
    //         3,
    //         undefined,
    //         undefined
    //         )      
    //       }
    //   }
    //   catch(e){
    //     console.log('error playing gun sound', e)
    //   }
  
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
      duration: info.distance / 150 * 1000,
      easingFunction: EasingFunction.EF_LINEAR,
    })
  
    utils.timers.setTimeout(()=>{
      engine.removeEntity(laser)
    }, info.distance / 150 * 1000)
}

export function playGameShoot(info:any){
    if(info.player !== localUserId){
        shootBeam(info)

        let op = colyseusRoom.state.players.get(info.player)
        if(op){
            let weapon = op.weapon
            // switch(info.beam){
            //     case  't1':
            //     Animator.playSingleAnimation(weapon, "ssShoot")
            //     break;

            //     case  't2':
            //     Animator.playSingleAnimation(weapon, "wmShoot")
            //     break;

            //     case  't3':
            //     Animator.playSingleAnimation(weapon, "ebShoot")
            //     break;

            //     case  't4':
            //     Animator.playSingleAnimation(weapon, "ncShoot")
            //     break;

            //     case  't5':
            //     Animator.playSingleAnimation(weapon, "bfgShoot")
            //       break;      
            // }
        }
    }   
}

export function checkEnemyHit(hitEntity:Entity){
    console.log("checking entity hit", hitEntity)
    let scene = localPlayer.activeScene
    if(!scene){
        return
    }

    // let id = hitIDFromEnemyEntity.get(entity)
    // if(id){
    //     angzaarLog('found enemy to attack, sending to server', id)
    //     cRoom.send('attack', {id:id})
    // }else{
        let gameInfo = scene[COMPONENT_TYPES.GAME_COMPONENT].get(localPlayer.gameData.level)
        if(!gameInfo){
            return 
        }
        gameInfo.teams.forEach((team:any)=>{
            team.mates.forEach((mate:string)=>{
                let player = colyseusRoom.state.players.get(mate)
                if(hitEntity === player.hitBox){
                    console.log('hit player, return', mate)
                    sendServerMessage(SERVER_MESSAGE_TYPES.HIT_OBJECT, {userId:mate})
                    return
                }
            })
        })
        // colyseusRoom.state.players.forEach((player:any, userId:string)=>{
        //     if(hitEntity === player.hitBox){
        //         console.log('hit player, return', userId)
        //         sendServerMessage(SERVER_MESSAGE_TYPES.HIT_OBJECT, {userId:userId})
        //         return
        //     }
        // })
    // }
}