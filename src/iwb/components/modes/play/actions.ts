import { Animator, AudioSource, AudioStream, ColliderLayer, EasingFunction, Entity, GltfContainer, MeshCollider, Transform, Tween, TweenLoop, TweenSequence, VideoPlayer, VisibilityComponent } from "@dcl/sdk/ecs";
import { Actions, NOTIFICATION_TYPES, SERVER_MESSAGE_TYPES, SceneItem } from "../../../helpers/types";
import { movePlayerTo, openExternalUrl, triggerEmote } from "~system/RestrictedActions";
import { localPlayer } from "../../player/player";
import { addShowText } from "../../../ui/showTextComponent";
import { entitiesFromItemIds } from "../../scenes";
import { utils } from "../../../helpers/libraries";
import { addDelayedActionTimer, checkPointers } from ".";
import { showDialogPanel } from "../../../ui/Panels/DialogPanel";
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import { items } from "../../catalog";
import { sendServerMessage } from "../../messaging";
import { showNotification } from "../../../ui/Panels/notificationUI";
import { runTrigger } from "./triggers";

export function findAndRunAction(id:string){
    let scene = localPlayer.activeScene
    if(scene){
        let asset = scene.ass.find((asset:any)=> asset.actComp && asset.actComp.actions[id])
        if(asset){
            let action = asset.actComp.actions[id]
            action.id = id
            console.log('actions are ',[action])
            runTrigger(asset, [action])
        }else{
            console.log('did not find scene asset with action')
        }
    }else{
        console.log('no scene')
    }
}

export function handleTriggerAction(entity:Entity, asset:SceneItem, action:any, actionId:string){
    console.log('handling trigger action', entity, asset, action, actionId)
    switch(action.type){
        case Actions.OPEN_LINK:
            openExternalUrl({url:"" + action.url})
            break;

        case Actions.PLAY_AUDIO:
            if(asset.sty !== "Stream"){
                AudioSource.getMutable(entity).playing = true
            }else{
                AudioStream.getMutable(entity).playing = true
            }
            break;

        case Actions.STOP_AUDIO:
            if(asset.sty !== "Stream"){
                AudioSource.getMutable(entity).playing = false
            }else{
                AudioStream.getMutable(entity).playing = false
            }
            break;

        case Actions.TOGGLE_VIDEO:
            VideoPlayer.getMutable(entity).playing = !VideoPlayer.get(entity).playing
            break;

        case Actions.PLAY_ANIMATION:
            Animator.stopAllAnimations(entity, true)
            let clip = Animator.getClip(entity, action.animName)
            clip.shouldReset = true
            clip.playing = true
            clip.loop = action.animLoop
            break;

        case Actions.STOP_ANIMATION:
            Animator.stopAllAnimations(entity, true)
            let stopclip = Animator.getClip(entity, action.animName)
            stopclip.playing = false
            break;

        case Actions.TELEPORT_PLAYER:
            let pos = action.teleport.split(",")
            let cam = action.teleCam ? action.teleCam.split(",") : "0,0,0"
            let scene = Transform.get(localPlayer.activeScene!.parentEntity).position
            movePlayerTo({newRelativePosition:{x: scene.x + parseFloat(pos[0]), y: scene.y + parseFloat(pos[1]), z:scene.z + parseFloat(pos[2])}, cameraTarget:{x: scene.x + parseFloat(cam[0]), y: scene.y + parseFloat(cam[1]), z:scene.z + parseFloat(cam[2])}})
            break;

        case Actions.EMOTE:
            triggerEmote({predefinedEmote: "" + action.emote})
            break;

        case Actions.SET_VISIBILITY:
            console.log('setting visibility for action', action, asset)

            switch(asset.type){
                case "3D":
                    VisibilityComponent.createOrReplace(entity, {visible: action.vis})
                    if(GltfContainer.has(entity)){
                        GltfContainer.getMutable(entity).invisibleMeshesCollisionMask = action.iMask
                        GltfContainer.getMutable(entity).visibleMeshesCollisionMask = action.vMask
                    }                    
                    break;

                case '2D':
                    //to do, update different mesh type collisions
                    // MeshRenderer.getMutable(entity)
                    break;
            }
            break;

        case Actions.SHOW_TEXT:
            console.log('showing text action', action, actionId)
            let showText = {...action}
            showText.id = actionId
            addShowText(showText)
            break;

        case Actions.HIDE_TEXT:
            break;

        case Actions.START_DELAY:
            console.log('running delay action', action)
            let delayedAction:any

            let timer = utils.timers.setTimeout(()=>{
                console.log('delay action timer over, need to contineu on')
                let actionAsset = localPlayer.activeScene?.ass.find((asset:any)=> asset.actComp && asset.actComp.actions[action.startDId])
                if(actionAsset){
                    console.log('found action asset for delay action', actionAsset)
                    delayedAction = actionAsset.actComp.actions[action.startDId]
                    console.log('delay action is', action)
                    let entity = entitiesFromItemIds.get(actionAsset.aid)
                    if(entity){
                        handleTriggerAction(entity, asset, delayedAction, delayedAction.id)
                    }
                }
            }, 1000 * action.startDTimer)
            addDelayedActionTimer(timer)
            break;

        case Actions.SHOW_DIALOG:
            showDialogPanel(true, action.aid)
            break;

        case Actions.START_TWEEN:
            let mode:any
            let start = {...Transform.get(entity)}

            switch(action.twT){
                case 0:
                    mode = Tween.Mode.Move({
                        start: start.position,
                        end: Vector3.create(action.twEX, action.twEY, action.twEZ),
                      })
                    break;

                case 1:
                    mode = Tween.Mode.Rotate({
                        start: start.rotation,
                        end: Quaternion.fromEulerDegrees(action.twEX, action.twEY, action.twEZ),
                      })
                    break;

                case 2:
                    mode = Tween.Mode.Scale({
                        start: start.scale,
                        end: Vector3.create(action.twEX, action.twEY, action.twEZ),
                      })
                    break;
            }

            Tween.createOrReplace(entity, {
                mode: mode,
                duration: 1000 * action.twD,
                easingFunction: action.twE,
              })

              if(action.twL !== 2){
                TweenSequence.createOrReplace(entity, { sequence: [], loop: action.twL})
              }
            
            break;

        case Actions.ENABLE_CLICK_AREA:
            asset.trigComp.enabled = true
            MeshCollider.setBox(entity, ColliderLayer.CL_POINTER)
            checkPointers(entity, asset)
            break;

        case Actions.DISABLE_CLICK_AREA:
            asset.trigComp.enabled = false
            MeshCollider.deleteFrom(entity)
            break;

        case Actions.ENABLE_TRIGGER_AREA:
            utils.triggers.enableTrigger(entity, true)
            break;

        case Actions.DISABLE_TRIGGER_AREA:
            utils.triggers.enableTrigger(entity, false)
            break;

        case Actions.GIVE_REWARD:
            console.log('give user reward', action, actionId)
            showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Claiming Item...", animate:{enabled:true, return:false, time:7}})
            sendServerMessage(SERVER_MESSAGE_TYPES.CLAIM_REWARD, {sceneId:"" + localPlayer.activeScene?.id, aid:action.aid, action:action.type})

        case Actions.VERIFY_ACCESS:
            console.log('verifying access')
            sendServerMessage(SERVER_MESSAGE_TYPES.VERIFY_ACCESS, {sceneId:"" + localPlayer.activeScene?.id, aid:action.aid, action:action.type})
            break;
    }
}