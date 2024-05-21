import { AudioSource, AudioStream, AvatarAttach, ColliderLayer, Entity, GltfContainer, MeshCollider, MeshRenderer, Transform, VideoPlayer, VisibilityComponent } from "@dcl/sdk/ecs"
import { Actions, SERVER_MESSAGE_TYPES, Triggers } from "../helpers/types"
import mitt, { Emitter } from "mitt"
import { sendServerMessage } from "./Colyseus"
import { getCounterComponentByAssetId, setCounter, updateCounter } from "./Counter"
import { getStateComponentByAssetId, setState } from "./States"
import { getTriggerEvents } from "./Triggers"
import { movePlayerTo, openExternalUrl, openNftDialog, triggerEmote } from "~system/RestrictedActions"
import { Quaternion, Vector3 } from "@dcl/sdk/math"
import { utils } from "../helpers/libraries"

const actions =  new Map<Entity, Emitter<Record<Actions, void>>>()

export function getActionEvents(entity: Entity) {
    if (!actions.has(entity)) {
      actions.set(entity, mitt())
    }
    return actions.get(entity)!
  }

export function addActionComponent(scene:any){
    scene.actions.forEach((actions:any, aid:string)=>{
        let info = scene.parenting.find((entity:any)=> entity.aid === aid)
        if(info.entity){
            const actionEvents = getActionEvents(info.entity)
            actions.actions.forEach((action:any)=>{
                actionEvents.on(action.id, ()=>{
                    switch(action.type){
                        case Actions.SHOW_TEXT:
                            handleShowText(info.entity, action)
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

                        case Actions.PLACE_PLAYER_POSITION:
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
                    }
                })
            })
        }
    })
}

function handleShowText(entity:Entity, action:any){
    console.log('handling show text action for', entity, action)
}

function handleSetState(scene:any, info:any, action:any){
    let state = getStateComponentByAssetId(scene, info.aid)
    if(state){
        setState(state, action.state)

        const triggerEvents = getTriggerEvents(info.entity)
        triggerEvents.emit(Triggers.ON_STATE_CHANGE)
    }
}

function handleAddNumber(scene:any, info:any, action:any){
    let counter = getCounterComponentByAssetId(scene, info.aid, action.counter)
    if(counter){
        updateCounter(counter, action.value)
    }

    //todo
    //handle local vs multiplayer counter

    //if multiplayer, send to server
    sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_ACTION, {sceneId:scene.id, aid:info.aid, action:action})
}

function handleSetNumber(scene:any, info:any, action:any){
    let counter = getCounterComponentByAssetId(scene, info.aid, action.counter)
    if(counter){
        setCounter(counter, action.value)
    }

    //todo
    //handle local vs multiplayer counter//

    //if multiplayer, send to server
    sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_ACTION, {sceneId:scene.id, aid:info.aid, action:action})
}

function handleSubtractNumber(scene:any, info:any, action:any){
    let counter = getCounterComponentByAssetId(scene, info.aid, action.counter)
    if(counter){
        updateCounter(counter, (-1 * action.value))
    }

    //todo
    //handle local vs multiplayer counter//

    //if multiplayer, send to server
    sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_ACTION, {sceneId:scene.id, aid:info.aid, action:action})
}

function handlePlaySound(info:any, action:any){
    let audio = AudioSource.getMutableOrNull(info.entity)
    if(audio){
        audio.loop = action.loop
        audio.volume = action.volume ? action.volume : 1
        audio.playing = true
    }else{
        console.log('no audio file')
    }
}

function handleStopSound(info:any){
    let audio = AudioSource.getMutableOrNull(info.entity)
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
        gltf.visibleMeshesCollisionMask = vMask
      } else if (meshCollider) {
        meshCollider.collisionMask = vMask
      }
    }

    if (iMask !== undefined) {
        if (gltf) {
          gltf.invisibleMeshesCollisionMask = iMask
        }
    }
}

function handleOpenLink(action:any){
    openExternalUrl({url: action.url})
}

function handleMovePlayer(scene:any, action:any){
    let pos = action.movePos.split(",")
    let cam = action.moveCam ? action.moveCam.split(",") : "0,0,0"
    // let scene = Transform.get(localPlayer.activeScene!.parentEntity).position
    // movePlayerTo({newRelativePosition:{x: scene.x + parseFloat(pos[0]), y: scene.y + parseFloat(pos[1]), z:scene.z + parseFloat(pos[2])}, cameraTarget:{x: scene.x + parseFloat(cam[0]), y: scene.y + parseFloat(cam[1]), z:scene.z + parseFloat(cam[2])}})
    // break;

    movePlayerTo({
        newRelativePosition:{
            x:parseFloat(pos[0]), 
            y:parseFloat(pos[1]), 
            z:parseFloat(pos[2])
        }, 
        cameraTarget:{
            x:parseFloat(cam[0]), 
            y:parseFloat(cam[1]), 
            z:parseFloat(cam[2])
        }
    })
}

function handleEmote(action:any){
    triggerEmote({predefinedEmote: "" + action.emote})
}

function handleSetPosition(scene:any, info:any, action:any){
    let transform = Transform.getMutableOrNull(info.entity)
    if (transform) {
        let pos = action.movePos.split(",")
        if (action.moveRel) {
          transform.position = Vector3.add(
            transform.position,
            Vector3.create(parseFloat(pos[0]), parseFloat(pos[1]), parseFloat(pos[2])),
          )
        } else {
          transform.position = Vector3.create(parseFloat(pos[0]), parseFloat(pos[1]), parseFloat(pos[2]))
        }
      }
}

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
        let pos = action.movePos.split(",")
        if (action.moveRel) {
          transform.scale = Vector3.add(
            transform.scale,
            Vector3.create(parseFloat(pos[0]), parseFloat(pos[1]), parseFloat(pos[2])),
          )
        } else {
          transform.scale = Vector3.create(parseFloat(pos[0]), parseFloat(pos[1]), parseFloat(pos[2]))
        }
      }
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
    // console.log('give user reward', action, actionId)
    // showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Claiming Item...", animate:{enabled:true, return:false, time:7}})
    // sendServerMessage(SERVER_MESSAGE_TYPES.CLAIM_REWARD, {sceneId:"" + localPlayer.activeScene?.id, aid:action.aid, action:action.type})
}

function handleVerifyAccess(scene:any, info:any, action:any){
    // sendServerMessage(SERVER_MESSAGE_TYPES.VERIFY_ACCESS, {sceneId:"" + localPlayer.activeScene?.id, aid:action.aid, action:action.type})
}