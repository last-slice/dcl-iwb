import { Animator, AudioSource, AudioStream, AvatarAttach, ColliderLayer, EasingFunction, Entity, Font, GltfContainer, MeshCollider, MeshRenderer, Move, PBTween, Rotate, Scale, TextAlignMode, Transform, Tween, TweenLoop, TweenSequence, UiText, UiTransform, VideoPlayer, VisibilityComponent, engine } from "@dcl/sdk/ecs"
import { Actions, COLLIDER_LAYERS, COMPONENT_TYPES, NOTIFICATION_TYPES, SERVER_MESSAGE_TYPES, Triggers, TWEEN_TYPES } from "../helpers/types"
import mitt, { Emitter } from "mitt"
import { colyseusRoom, sendServerMessage } from "./Colyseus"
import { getCounterComponentByAssetId, setCounter, updateCounter } from "./Counter"
import { getStateComponentByAssetId, setState } from "./States"
import { actionQueue, getTriggerEvents } from "./Triggers"
import { changeRealm, movePlayerTo, openExternalUrl, teleportTo, triggerEmote } from "~system/RestrictedActions"
import { Quaternion, Vector3 } from "@dcl/sdk/math"
import { utils } from "../helpers/libraries"
import { getEntity } from "./IWB"
import { startInterval, startTimeout, stopInterval } from "./Timer"
import { hideNotification, showNotification } from "../ui/Objects/NotificationPanel"
import { UiTexts, uiDataUpdate } from "./UIText"
import { UiImages, uiImageDataUpdate } from "./UIImage"
import { localPlayer } from "./Player"
import { displayGameStartUI, displayLoadingScreen } from "../ui/Objects/GameStartUI"
import { loadLevelAssets } from "./Level"
import { attemptGameEnd, movePlayerToLobby } from "./Game"
import { getEasingFunctionFromInterpolation } from "@dcl-sdk/utils"
import { island } from "./Config"
import { getRandomIntInclusive } from "../helpers/functions"
import { removedEntities } from "./Scene"
import { showDialogPanel } from "../ui/Objects/DialogPanel"

const actions =  new Map<Entity, Emitter<Record<Actions, void>>>()

let lockbox:Entity

export function getActionEvents(entity: Entity) {
    if (!actions.has(entity)) {
      actions.set(entity, mitt())
    }
    return actions.get(entity)!
}

export function getActionById(scene:any, aid:string, actionId:string){
    let actions = scene[COMPONENT_TYPES.ACTION_COMPONENT].get(aid)
    if(actions){
        return actions.actions.find(($:any)=> $.id === actionId)
    }
    return {}
}

export function actionListener(scene:any){
    scene[COMPONENT_TYPES.ACTION_COMPONENT].onAdd((assetAction:any, aid:any)=>{
        // let iwbInfo = scene[COMPONENT_TYPES.PARENTING_COMPONENT].find(($:any)=> $.aid === aid)
        // if(!iwbInfo.components.includes(COMPONENT_TYPES.ACTION_COMPONENT)){
        //   iwbInfo.components.push(COMPONENT_TYPES.ACTION_COMPONENT)
        // }//

        let info = getEntity(scene, aid)
        if(!info){
            return
        }

        assetAction.actions.onAdd((newAction:any, index:any)=>{
            updateActions(scene, info, newAction)
        }, )
    })
}

export function updateActions(scene:any, info:any, action:any){
    const actionEvents = getActionEvents(info.entity)

    actionEvents.on(action.id, ()=>{
        console.log('action received', action)
        switch(action.type){
            case Actions.SHOW_TEXT:
                handleShowText(scene, info, action)
                break;

            case Actions.HIDE_TEXT:
                handleHideText(info, action)
                break;

            case Actions.ADD_NUMBER:
                handleAddNumber(scene, info, action)
                break;

            case Actions.SET_NUMBER:
                handleSetNumber(scene, info, action)
                break;

            case Actions.SUBTRACT_NUMBER:
                handleSubtractNumber(scene, info, action)
                break;

            case Actions.SET_STATE:
                handleSetState(scene, info, action)
                break;

            case Actions.PLAY_SOUND:
                handlePlaySound(scene, info, action)
                break;

            case Actions.STOP_SOUND:
                handleStopSound(info)
                break;

            case Actions.PLAY_AUDIO_STREAM:
                handlePlayAudioStream(info)
                break;

            case Actions.STOP_AUDIO_STREAM:
                handleStopAudioStream(info)
                break;

            case Actions.SET_VISIBILITY:
                handleSetVisibility(info, action)
                break;

            case Actions.OPEN_LINK:
                handleOpenLink(action)
                break;

            case Actions.MOVE_PLAYER:
                handleMovePlayer(scene, action)
                break;

            case Actions.EMOTE:
                handleEmote(action)
                break;

            case Actions.PLAY_VIDEO:
                handlePlayVideo(scene, info, action)
                break;

            case Actions.STOP_VIDEO:
                handleStopVideo(scene, info, action)
                break;

            case Actions.SHOW_NOTIFICATION:
                handleShowNotification(scene, info, action)
                break;

            case Actions.HIDE_NOTIFICATION:
                hideNotification()
                break;

            case Actions.SET_POSITION:
                handleSetPosition(scene, info, action)
                break;

            case Actions.SET_ROTATION:
                handleSetRotation(scene, info, action)
                break;

            case Actions.SET_SCALE:
                handleSetScale(scene, info, action)
                break;

             case Actions.CLONE:
                handleClone(scene, info, action)
                break;

            case Actions.PLACE_PLAYER_POSITION:
                handlePlacePlayerPosition(scene, info, action)
                break;

            case Actions.ATTACH_PLAYER:
                handleAttachToPlayer(scene, info, action)
                break;

            case Actions.DETACH_PLAYER:
                handleDetachToPlayer(scene, info, action)
                break;

            case Actions.ENABLE_CLICK_AREA:
                handleEnableClickArea(scene, info, action)
                break;

            case Actions.DISABLE_CLICK_AREA:
                handleDisableClickArea(scene, info, action)
                break;

            case Actions.ENABLE_TRIGGER_AREA:
                handleEnableTriggerArea(info)
            break;

            case Actions.DISABLE_TRIGGER_AREA:
                handleDisableTriggerArea(info)
            break;

            case Actions.GIVE_REWARD:
                handleGiveReward(scene, info, action)

            case Actions.VERIFY_ACCESS:
                handleVerifyAccess(scene, info, action)
                break;

            case Actions.BATCH_ACTIONS:
                handleBatchAction(scene, info, action)
                break;

            case Actions.REMOVE:
                handleRemoveEntity(scene, info, action)
                break;

            case Actions.SHOW_CUSTOM_IMAGE:
                handleShowCustomImage(scene, info, action)
                break;//

            case Actions.HIDE_CUSTOM_IMAGE:
                handleHideCustomImage(scene, info, action)
                break;

            case Actions.PLAY_ANIMATION:
                handlePlayAnimation(scene, info, action)
                break;

            case Actions.STOP_ANIMATION:
                handleStopAnimation(scene, info, action)
                break;

            case Actions.ATTEMPT_GAME_START:
                handleAttemptGame(scene, info, action)
                break;

            case Actions.START_LOOP:
                handleStartLoop(scene, info, action)
                break;

            case Actions.STOP_LOOP:
                handleStopLoop(scene, info, action)
                break;

            case Actions.LOAD_LEVEL:
                handleLoadLevel(scene, info, action)
            break;

            case Actions.END_GAME:
                handleEndGame(scene, info, action)
            break;

            case Actions.LOCK_PLAYER:
                handleLockPlayer(scene, info, action)
                break;

            case Actions.UNLOCK_PLAYER:
                handleUnlockPlayer(scene, info, action)
                break;

            case Actions.START_TWEEN:
                handleStartTween(scene, info, action)
                break;

            case Actions.STOP_TWEEN:
                handleStopTween(scene, info, action)
                break;

             case Actions.TELEPORT_PLAYER:
                handleTeleportPlayer(scene, info, action)
                break;

            case Actions.RANDOM_ACTION:
                handleRandomAction(scene, info, action)
                break;

            case Actions.SHOW_DIALOG:
                handleShowDialog(scene, info, action)
                break;

        }
    })
}

export function handlePlayAnimation(scene:any, entityInfo:any, action:any){
    Animator.stopAllAnimations(entityInfo.entity)
    const clip = Animator.getClip(entityInfo.entity, action.anim)
    clip.playing = true
    clip.loop = action.loop ? true : false
    clip.shouldReset = true
}

export function handleStopAnimation(scene:any, entityInfo:any, action:any){
    if(Animator.has(entityInfo.entity)){
        Animator.stopAllAnimations(entityInfo.entity)
    }
}

export function handleRemoveEntity(scene:any, entityInfo:any, action:any){
    engine.removeEntity(entityInfo.entity)
    if(!removedEntities.has(scene.id)){
        removedEntities.set(scene.id, [])
    }

    let removed = removedEntities.get(scene.id)
    let iwbInfo = scene[COMPONENT_TYPES.IWB_COMPONENT].get(entityInfo.aid)
    removed.push(iwbInfo)
    console.log('removed items are ', removed)
}

export function handleShowText(scene:any, entityInfo:any, action:any, forceDelay?:number){
    // addShowText(action)

    // if(forceDelay){
    //     startTimeout(entity, Actions.HIDE_TEXT, forceDelay, () =>
    //     handleHideText(entity, {}))
    // }

    // const uiTransformComponent = getUITransform(UiTransform, entity)
    // if (uiTransformComponent) {
    //   UiText.createOrReplace(entity, {
    //     value: text,
    //     font: font as unknown as Font,
    //     fontSize: size,
    //     textAlign: textAlign as unknown as TextAlignMode,
    //   })

    // //   startTimeout(entity, Actions.HIDE_TEXT, hideAfterSeconds, () =>
    // //     handleHideText(entity, {}),
    // //   )
    // }

    let uiText = UiTexts.get(entityInfo.aid)
    if(uiText){
        console.log('showing ui text')
        uiDataUpdate(scene, entityInfo)
        uiText.show()
    }
}

export function handleHideText(entityInfo:any, action:any){
    // removeShowText(action.id)
    // const uiTextComponent = UiText.getOrNull(entity)
    // if (uiTextComponent) {
    //   UiText.deleteFrom(entity)
    // }
    let uiText = UiTexts.get(entityInfo.aid)
    if(uiText){
        uiText.hide()
    }
}

export function handleShowCustomImage(scene:any, entityInfo:any, action:any){
    let uiImage = UiImages.get(entityInfo.aid)
    if(uiImage){
        uiImageDataUpdate(scene, entityInfo)
        uiImage.show()
    }
}

export function handleHideCustomImage(scene:any, entityInfo:any, action:any){
    console.log('handle hide custom image')
    let uiImage = UiImages.get(entityInfo.aid)
    if(uiImage){
        uiImage.hide()
    }
}

function handleSetState(scene:any, info:any, action:any){
    console.log('handling set state action', action)
    let state = getStateComponentByAssetId(scene, info.aid)
    if(state){
        setState(state, action.state)
        uiDataUpdate(scene, info)
        const triggerEvents = getTriggerEvents(info.entity)
        triggerEvents.emit(Triggers.ON_STATE_CHANGE, {entity:info.entity, input:0, pointer:0})
    }
}

function handleAddNumber(scene:any, info:any, action:any){
    console.log('adding number action', action )
    let counter = getCounterComponentByAssetId(scene, info.aid, action.counter)
    if(counter){
        updateCounter(counter, action.value)
        uiDataUpdate(scene, info)
        //single player
        const triggerEvents = getTriggerEvents(info.entity)
        triggerEvents.emit(Triggers.ON_COUNTER_CHANGE, {})

        //if multiplayer, send to server
        // sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_ACTION, {sceneId:scene.id, aid:info.aid, action:action})
    }
}

function handleSetNumber(scene:any, info:any, action:any){
    let counter = getCounterComponentByAssetId(scene, info.aid, action.counter)
    if(counter){
        setCounter(counter, action.value)
        uiDataUpdate(scene, info)

        //single player
        const triggerEvents = getTriggerEvents(info.entity)
        triggerEvents.emit(Triggers.ON_COUNTER_CHANGE, {})
        //if multiplayer, send to server//
        // sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_ACTION, {sceneId:scene.id, aid:info.aid, action:action})
    }
}

function handleSubtractNumber(scene:any, info:any, action:any){
    let counter = getCounterComponentByAssetId(scene, info.aid, action.counter)
    if(counter){
        updateCounter(counter, (-1 * action.value))
        uiDataUpdate(scene, info)
        //single player
        const triggerEvents = getTriggerEvents(info.entity)
        triggerEvents.emit(Triggers.ON_COUNTER_CHANGE, {})

        //if multiplayer, send to server
        // sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_ACTION, {sceneId:scene.id, aid:info.aid, action:action})
    }
}

function handlePlaySound(scene:any, info:any, action:any){
    let audio:any
    let itemInfo:any 
    itemInfo = scene[COMPONENT_TYPES.AUDIO_SOURCE_COMPONENT].get(info.aid)

    if(itemInfo){
        audio = AudioSource.getMutableOrNull(info.entity)
        if(audio){
            audio.loop = action.loop
            audio.volume = itemInfo.volume
            audio.playing = true
        }else{
            console.log('no audio file')
        }
    }

    itemInfo = scene[COMPONENT_TYPES.AUDIO_SOURCE_COMPONENT].get(info.aid)
    if(itemInfo){
        audio = AudioStream.getMutableOrNull(info.entity)
        console.log('audio is', audio)
        if(audio){
            // audio.loop = action.loop
            audio.volume = itemInfo.volume
            audio.playing = true
        }else{
            console.log('no audio file')
        }
    }

}

function handleStopSound(info:any){
    // let audio = AudioSource.getMutableOrNull(info.entity)
    // if(audio){
    //     audio.playing = false
    // }
    let audio = AudioStream.getMutableOrNull(info.entity)
    if(audio){
        audio.playing = false
    }
}

function handlePlayAudioStream(info:any){
    let audio = AudioStream.getMutableOrNull(info.entity)
    if(audio){
        audio.playing = true
    }
}

function handleStopAudioStream(info:any){
    let audio = AudioStream.getMutableOrNull(info.entity)
    if(audio){
        audio.playing = false
    }
}

function handlePlayVideo(scene:any, info:any, action:any){
    let video = VideoPlayer.getMutableOrNull(info.entity)
    if(video){
        video.playing = true
    }
}

function handleStopVideo(scene:any, info:any, action:any){
    let video = VideoPlayer.getMutableOrNull(info.entity)
    if(video){
        video.playing = false
    }
}

function handleSetVisibility(info:any, action:any){
    let {visible, vMask, iMask} = action

    const gltf = GltfContainer.getMutableOrNull(info.entity)
    const meshCollider = MeshCollider.getMutableOrNull(info.entity)

    if(visible !== undefined){
        if(gltf){
             VisibilityComponent.createOrReplace(info.entity, { visible})
        }
    }

    if (vMask !== undefined) {
      if (gltf) {
        gltf.visibleMeshesCollisionMask = vMask === 3 ? ColliderLayer.CL_POINTER | ColliderLayer.CL_PHYSICS : parseInt(Object.values(COLLIDER_LAYERS)[vMask].toString())
      } else if (meshCollider) {
        if(vMask !== 3){
            meshCollider.collisionMask =  parseInt(Object.values(COLLIDER_LAYERS)[vMask].toString())
        }
      }
    }

    if (iMask !== undefined) {
        if (gltf) {
          gltf.invisibleMeshesCollisionMask = iMask === 3 ? ColliderLayer.CL_POINTER | ColliderLayer.CL_PHYSICS : parseInt(Object.values(COLLIDER_LAYERS)[iMask].toString())
        }
    }
}

function handleOpenLink(action:any){
    openExternalUrl({url: action.url})
}

export function handleMovePlayer(scene:any, action:any){
    console.log('moving playerr', action)
    let newPosition = {...action}
    if(island === "world"){
        newPosition.x = Vector3.add(Transform.get(scene.parentEntity).position, newPosition).x
        newPosition.z = Vector3.add(Transform.get(scene.parentEntity).position, newPosition).z

        console.log('action is now ', action)
    }
    if(action.cx){
        movePlayerTo({
            newRelativePosition:{
                x:newPosition.x, 
                y:newPosition.y, 
                z:newPosition.z
            }, 
            cameraTarget:{
                x:newPosition.cx, 
                y:newPosition.cy, 
                z:newPosition.cz
            }
        })
    }else{
        movePlayerTo({
            newRelativePosition:{
                x:newPosition.x, 
                y:newPosition.y, 
                z:newPosition.z
            }
        })
    }

}

function handleEmote(action:any){
    triggerEmote({predefinedEmote: "" + action.emote})
}

function handleSetPosition(scene:any, info:any, action:any){
    let transform = Transform.getMutableOrNull(info.entity)
    if (transform) {
        let position = Vector3.create(action.x, action.y, action.z)
        if (action.moveRel) {
          transform.position = Vector3.add(
            transform.position,
            position)
        } else {
          transform.position = position
        }
      }
}

function handlePlacePlayerPosition(scene:any, info:any, action:any){}

function handleSetRotation(scene:any, info:any, action:any){
    let transform = Transform.getMutableOrNull(info.entity)
    if (transform) {
        let pos = action.movePos.split(",")
        if (action.moveRel) {
          transform.rotation = Quaternion.multiply(
            transform.rotation,
            Quaternion.fromEulerDegrees(parseFloat(pos[0]), parseFloat(pos[1]), parseFloat(pos[2])),
          )
        } else {
          transform.rotation = Quaternion.fromEulerDegrees(parseFloat(pos[0]), parseFloat(pos[1]), parseFloat(pos[2]))
        }
      }
}

function handleSetScale(scene:any, info:any, action:any){
    let transform = Transform.getMutableOrNull(info.entity)
    if (transform) {
        let scale = Vector3.create(action.x, action.y, action.z)
        if (action.moveRel) {
          transform.scale = Vector3.add(
            transform.scale,
            scale)
        } else {
          transform.scale = scale
        }
      }
}

function handleClone(scene:any, info:any, action:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_ACTION,
        {sceneId:scene.id, aid:info.aid, actionId:action.id}
    )
}

function handleAttachToPlayer(scene:any, info:any, action:any){
    AvatarAttach.createOrReplace(info.entity, { anchorPointId:action.anchor })
}

function handleDetachToPlayer(scene:any, info:any, action:any){
    AvatarAttach.deleteFrom(info.entity)
}

function handleEnableClickArea(scene:any, info:any, action:any){
    MeshCollider.setBox(info.entity, ColliderLayer.CL_POINTER)
}

function handleDisableClickArea(scene:any, info:any, action:any){
    MeshCollider.deleteFrom(info.entity)
}

function handleEnableTriggerArea(info:any){0
    utils.triggers.enableTrigger(info.entity, true)
}

function handleDisableTriggerArea(info:any){
    utils.triggers.enableTrigger(info.entity, false)
}

function handleGiveReward(scene:any, info:any, action:any){
    // console.log('give user reward', action, actionId)//
    // showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Claiming Item...", animate:{enabled:true, return:false, time:7}})
    // sendServerMessage(SERVER_MESSAGE_TYPES.CLAIM_REWARD, {sceneId:"" + localPlayer.activeScene?.id, aid:action.aid, action:action.type})
}

function handleVerifyAccess(scene:any, info:any, action:any){
    // sendServerMessage(SERVER_MESSAGE_TYPES.VERIFY_ACCESS, {sceneId:"" + localPlayer.activeScene?.id, aid:action.aid, action:action.type})
}

function handleBatchAction(scene:any, info:any, action:any){
    scene[COMPONENT_TYPES.ACTION_COMPONENT].forEach((actionComponent:any, aid:string)=>{
        let entityInfo = getEntity(scene, aid)
        if(entityInfo){
            action.actions.forEach((actionId:any)=>{
                if(actionComponent.actions && actionComponent.actions.length > 0 && actionComponent.actions.find(($:any)=> $.id === actionId)){
                    const actionEvents = getActionEvents(entityInfo.entity)
                    actionEvents.emit(actionId, getActionById(scene, entityInfo.aid, actionId))
                }
            })
        }
    })
}

function handleRandomAction(scene:any, info:any, action:any){
    let random = getRandomIntInclusive(0, action.actions.length - 1)
    let randomActionId = action.actions[random]

    console.log('random action is', randomActionId)

    scene[COMPONENT_TYPES.ACTION_COMPONENT].forEach((actionComponent:any, aid:string)=>{
        let entityInfo = getEntity(scene, aid)
        if(entityInfo){
            if(actionComponent.actions && actionComponent.actions.length > 0 && actionComponent.actions.find(($:any)=> $.id === randomActionId)){
                const actionEvents = getActionEvents(entityInfo.entity)
                actionEvents.emit(randomActionId, getActionById(scene, entityInfo.aid, randomActionId))
            }
        }
    })
}

function handleShowNotification(scene:any, info:any, action:any){
    showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:action.message, animate:{enabled:true, return: true, time:action.time}})
}

function handleAttemptGame(scene:any, info:any, action:any){
    console.log("handling attempt game start", info.aid, action)
    if(!localPlayer.playingGame){
        let game:any = {...scene[COMPONENT_TYPES.GAME_COMPONENT].get(info.aid)}
        game.entity = info.entity
        displayGameStartUI(true, game)//
    }
}

function handleStartLoop(scene:any, info:any, action:any){
    const actionEvents = getActionEvents(info.entity)

    console.log("loop actions are", action)
    action.actions && action.actions.forEach((actionId:any)=>{
        startInterval(info.entity, actionId, action.timer, () => {
            console.log("interval action", actionId)
            actionEvents.emit(actionId, getActionById(scene, info.aid, actionId))
          })
    })
}

function handleStopLoop(scene:any, info:any, action:any){
    stopInterval(info.entity, action.id)
}

function handleLoadLevel(scene:any, info:any, action:any){
    let levelInfo = scene[COMPONENT_TYPES.LEVEL_COMPONENT].get(info.aid)
    if(levelInfo){
        displayLoadingScreen(true, levelInfo)

        scene[COMPONENT_TYPES.GAME_COMPONENT].forEach((gameInfo:any, aid:string)=>{
            movePlayerToLobby(scene, gameInfo)
        })
    
        loadLevelAssets(scene, info, action)
    }
}

function handleEndGame(scene:any, info:any, action:any){
    attemptGameEnd({sceneId:scene.id})
    sendServerMessage(SERVER_MESSAGE_TYPES.END_GAME, {})
}

function handleLockPlayer(scene:any, info:any, action:any){
    lockbox = engine.addEntity()
    let left = engine.addEntity()
    let right = engine.addEntity()
    let front = engine.addEntity()
    let back = engine.addEntity()

    let player = Transform.get(engine.PlayerEntity).position
    console.log(Transform.get(engine.PlayerEntity).position)

    Transform.createOrReplace(lockbox, {position: Vector3.create(player.x, player.y + 1, player.z)})

    MeshCollider.setPlane(left, ColliderLayer.CL_PHYSICS)
    MeshCollider.setPlane(right, ColliderLayer.CL_PHYSICS)
    MeshCollider.setPlane(front, ColliderLayer.CL_PHYSICS)
    MeshCollider.setPlane(back, ColliderLayer.CL_PHYSICS)

    Transform.create(left, {position: Vector3.create(-0.5, 0, 0), rotation:Quaternion.fromEulerDegrees(0,90,0), scale:Vector3.create(1,100,1), parent:lockbox})
    Transform.create(right, {position: Vector3.create(0.5, 0, 0), rotation:Quaternion.fromEulerDegrees(0,90,0), scale:Vector3.create(1,100,1), parent:lockbox})
    Transform.create(front, {position: Vector3.create(0, 0, 0.5), scale:Vector3.create(1,100,1), parent:lockbox})
    Transform.create(back, {position: Vector3.create(0, 0, -0.5), scale:Vector3.create(1,100,1), parent:lockbox})
}

function handleUnlockPlayer(scene:any, info:any, action:any){
    engine.removeEntityWithChildren(lockbox)
}

function handleStopTween(scene:any, info:any, action:any){
    if(action){
        TweenSequence.deleteFrom(info.entity)
        Tween.deleteFrom(info.entity)
    }
}

function handleStartTween(scene:any, info:any, action:any){
    if (action) {
      // Get the initial tween if exists to revert the object movement to that sequence when executing a tween from actions
      const initialTween = Tween.getMutableOrNull(info.entity)
      let tween

      switch (action.ttype) {
        case TWEEN_TYPES.MOVE: {
          tween = handleMoveItem(scene, info, action)
          break
        }
        case TWEEN_TYPES.ROTATION: {
          tween = handleRotateItem(scene, info, action)
          break
        }
        case TWEEN_TYPES.SCALE: {
          tween = handleScaleItem(scene, info, action)
          break
        }
        default: {
          throw new Error(`Unknown tween type: ${action.type}`)
        }
      }

      revertTween(info.entity, initialTween, tween)
    }
  }

  // Restart to the initial movement sequence when executing an aditional tween
  function revertTween(
    entity: Entity,
    initialTween: PBTween | null,
    tween: PBTween,
  ) {
    const tweenSequence = TweenSequence.getMutableOrNull(entity)
    let _revertTween = {
      ...tween,
    }

    console.log('trying to revert tween')

    if (!initialTween || !tweenSequence || !tweenSequence.loop) return

    console.log('got past initial return revert tween')

    switch (initialTween.mode?.$case) {
      case 'move': {
        _revertTween = {
          ..._revertTween,
          mode: Tween.Mode.Move({
            start: (tween.mode as { $case: 'move'; move: Move }).move.end,
            end: initialTween.mode.move.start,
          }),
        }
        break
      }
      case 'rotate': {
        _revertTween = {
          ..._revertTween,
          mode: Tween.Mode.Rotate({
            start: (tween.mode as { $case: 'rotate'; rotate: Rotate }).rotate
              .end,
            end: initialTween.mode.rotate.start,
          }),
        }
        break
      }
      case 'scale': {
        _revertTween = {
          ..._revertTween,
          mode: Tween.Mode.Scale({
            start: (tween.mode as { $case: 'scale'; scale: Scale }).scale.end,
            end: initialTween.mode.scale.start,
          }),
        }
        break
      }
      default: {
        throw new Error(`Unknown tween mode: ${initialTween.mode}`)
      }
    }

    // If the initial tween is not playing but the loop property is active, start it
    initialTween.playing = true
    tweenSequence.sequence = [_revertTween, initialTween]
    console.log('tween sequence is', tweenSequence)
  }

  // MOVE_ITEM
  function handleMoveItem(scene:any, info:any, action:any){
    let transform = scene[COMPONENT_TYPES.TRANSFORM_COMPONENT].get(info.aid)
    // if(!transform){
    //     return
    // }

    // const transform = Transform.get(info.entity)
    const { timer, ip, relative, x,y,z } = action
    const end = Vector3.create(x, y, z)
    const endPosition = relative ? Vector3.add(transform.p, end) : end

    let tween = Tween.createOrReplace(info.entity, {
        mode: Tween.Mode.Move({
          start: transform.p,
          end: endPosition,
        }),
        duration: timer * 1000, // from secs to ms
        easingFunction: getEasingFunctionFromInterpolation(ip),
      })

    switch(action.tloop){
        case 0://nothing
            utils.timers.setTimeout(()=>{
                Tween.deleteFrom(info.entity)
            }, timer * 1000)
            break;

        case 1://restart
            TweenSequence.deleteFrom(info.entity)
            TweenSequence.createOrReplace(info.entity, { sequence: [], loop: TweenLoop.TL_RESTART })
            break

        case 2://yoyo
            TweenSequence.deleteFrom(info.entity)
            TweenSequence.create(info.entity, { sequence: [], loop: TweenLoop.TL_YOYO })
        break;
    }

    return tween
  }

  // ROTATE_ITEM
  function handleRotateItem(scene:any, info:any, action:any){
    const transform = Transform.get(info.entity)
    const { timer, ip, relative, x,y,z } = action
    const end = Quaternion.fromEulerDegrees(x,y,z)
    const endRotation = relative
      ? Quaternion.multiply(transform.rotation, end)
      : end

    let tween = Tween.createOrReplace(info.entity, {
      mode: Tween.Mode.Rotate({
        start: transform.rotation,
        end: endRotation,
      }),
      duration: timer * 1000, // from secs to ms
      easingFunction: getEasingFunctionFromInterpolation(ip),
    })

    switch(action.tloop){
        case 0://nothing
            break;

        case 1://restart
            TweenSequence.deleteFrom(info.entity)
            TweenSequence.createOrReplace(info.entity, {
                loop: TweenLoop.TL_RESTART,
                sequence: [
                  {
                    mode: Tween.Mode.Rotate({
                      start: Quaternion.fromEulerDegrees(0, Math.floor(y), 0),
                      end: Quaternion.fromEulerDegrees(0, Math.floor(y) * 2, 0)
                    }),
                    duration: timer * 1000,
                    easingFunction: EasingFunction.EF_LINEAR
                  }
                ]
            })
            break

        case 2://yoyo
            TweenSequence.deleteFrom(info.entity)
            TweenSequence.create(info.entity, { sequence: [], loop: TweenLoop.TL_YOYO })
        break;
    }

    return tween
  }

  // SCALE_ITEM
  function handleScaleItem(scene:any, info:any, action:any){
    const transform = Transform.get(info.entity)
    const { timer, ip, relative, x,y,z } = action
    const end = Vector3.create(x, y, z)
    const endScale = relative ? Vector3.add(transform.scale, end) : end

    let tween = Tween.createOrReplace(info.entity, {
        mode: Tween.Mode.Scale({
          start: transform.scale,
          end: endScale,
        }),
        duration: timer * 1000, // from secs to ms
        easingFunction: getEasingFunctionFromInterpolation(ip),
      }) 

    switch(action.tloop){
        case 0://nothing
            break;

        case 1://restart
            TweenSequence.deleteFrom(info.entity)
            TweenSequence.createOrReplace(info.entity, { sequence: [], loop: TweenLoop.TL_RESTART })
            break

        case 2://yoyo
            TweenSequence.deleteFrom(info.entity)
            TweenSequence.create(info.entity, { sequence: [], loop: TweenLoop.TL_YOYO })
        break;
    }
    return tween
  }

function handleTeleportPlayer(scene:any, info:any, action:any){
    console.log('handle teleport player', action)
    switch(action.ttype){
        case 0:
            teleportTo({worldCoordinates:{x:action.x, y:action.y}})
            break;

        case 1:
            changeRealm({realm:action.text})
            break;

        case 2:
            changeRealm({realm:action.url})
            break;
    }    
}

function handleShowDialog(scene:any, info:any, action:any){
    console.log('handling show dialog', info.aid, info, action)
    let dialogInfo = scene[COMPONENT_TYPES.DIALOG_COMPONENT].get(info.aid)
    console.log('dialog info', dialogInfo)
    if(!dialogInfo){
        return
    }
    showDialogPanel(true, {...dialogInfo})
}

export function runDialogAction(id:string){
    let scene = localPlayer.activeScene
    if(!scene){
        return
    }

    scene[COMPONENT_TYPES.ACTION_COMPONENT].forEach((actionComponent:any, aid:string)=>{
        if(actionComponent.actions && actionComponent.actions.length > 0){
            let found = actionComponent.actions.find(($:any)=> $.id === id)
            if(found){
                let entityInfo = getEntity(scene, aid)
                if(entityInfo){
                    actionQueue.push({aid:aid, action:found, entity:entityInfo.entity})
                }
            }
        }
    })
}