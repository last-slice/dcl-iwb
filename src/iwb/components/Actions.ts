import { Animator, AudioSource, AudioStream, AvatarAttach, ColliderLayer, Entity, Font, GltfContainer, MeshCollider, MeshRenderer, TextAlignMode, Transform, UiText, UiTransform, VideoPlayer, VisibilityComponent, engine } from "@dcl/sdk/ecs"
import { Actions, COLLIDER_LAYERS, COMPONENT_TYPES, NOTIFICATION_TYPES, SERVER_MESSAGE_TYPES, Triggers } from "../helpers/types"
import mitt, { Emitter } from "mitt"
import { colyseusRoom, sendServerMessage } from "./Colyseus"
import { getCounterComponentByAssetId, setCounter, updateCounter } from "./Counter"
import { getStateComponentByAssetId, setState } from "./States"
import { getTriggerEvents } from "./Triggers"
import { movePlayerTo, openExternalUrl, triggerEmote } from "~system/RestrictedActions"
import { Quaternion, Vector3 } from "@dcl/sdk/math"
import { utils } from "../helpers/libraries"
import { getEntity } from "./IWB"
import { getUITransform } from "../ui/helpers"
import { startInterval, startTimeout, stopInterval } from "./Timer"
import { addShowText, removeShowText } from "../ui/Objects/ShowText"
import { hideNotification, showNotification } from "../ui/Objects/NotificationPanel"
import { UiTexts, uiDataUpdate } from "./UIText"
import { UiImages, uiImageDataUpdate } from "./UIImage"
import { localPlayer } from "./Player"
import { displayGameStartUI } from "../ui/Objects/GameStartUI"
import { loadLevelAssets } from "./Level"
import { attemptGameEnd } from "./Game"

const actions =  new Map<Entity, Emitter<Record<Actions, void>>>()

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
        // }

        let info = getEntity(scene, aid)
        if(!info){
            return
        }

        assetAction.actions.onAdd((newAction:any, index:any)=>{
            updateActions(scene, info, newAction)
        }, )
    })
}

function updateActions(scene:any, info:any, action:any){
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
                handlePlaySound(info, action)
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
                break;

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
        }
    })
}

export function handlePlayAnimation(scene:any, entityInfo:any, action:any){
    Animator.stopAllAnimations(entityInfo.entity)
    const clip = Animator.getClip(entityInfo.entity, action.anim)
    clip.playing = true
}

export function handleStopAnimation(scene:any, entityInfo:any, action:any){
    if(Animator.has(entityInfo.entity)){
        Animator.stopAllAnimations(entityInfo.entity)
    }
}

export function handleRemoveEntity(scene:any, entityInfo:any, action:any){
    engine.removeEntity(entityInfo.entity)
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
        //if multiplayer, send to server
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

function handlePlaySound(info:any, action:any){
    // let audio = AudioSource.getMutableOrNull(info.entity)
    // if(audio){
    //     audio.loop = action.loop
    //     audio.volume = action.volume ? action.volume : 1
    //     audio.playing = true
    // }else{
    //     console.log('no audio file')
    // }

    let audio = AudioStream.getMutableOrNull(info.entity)
    console.log('audio is', audio)
    if(audio){
        // audio.loop = action.loop
        audio.volume = action.volume ? action.volume : 1
        audio.playing = true
    }else{
        console.log('no audio file')
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

function handleMovePlayer(scene:any, action:any){
    console.log('moving playerr', action)
    if(action.cx){
        movePlayerTo({
            newRelativePosition:{
                x:action.x, 
                y:action.y, 
                z:action.z
            }, 
            cameraTarget:{
                x:action.cx, 
                y:action.cy, 
                z:action.cz
            }
        })
    }else{
        movePlayerTo({
            newRelativePosition:{
                x:action.x, 
                y:action.y, 
                z:action.z
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
    const actionEvents = getActionEvents(info.entity)
    action.actions.forEach((actionId:any)=>{
        actionEvents.emit(actionId, getActionById(scene, info.aid, actionId))
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
        //display loading screen
        
        let sceneTransform = Transform.get(scene.parentEntity).position
        let spawnLocation = Vector3.add(sceneTransform, {...levelInfo.loadingSpawn})
        handleMovePlayer(scene, {...spawnLocation, ...{cx:levelInfo.loadingSpawnLook.x, cy:levelInfo.loadingSpawnLook.y, cz:levelInfo.loadingSpawnLook.z}})
        loadLevelAssets(scene, info, action)
    }
}

function handleEndGame(scene:any, info:any, action:any){
    attemptGameEnd({sceneId:scene.id})
    sendServerMessage(SERVER_MESSAGE_TYPES.END_GAME, {})
}