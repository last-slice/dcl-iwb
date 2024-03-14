import { Animator, AudioSource, AudioStream, Entity, GltfContainer, Transform, VideoPlayer, VisibilityComponent } from "@dcl/sdk/ecs";
import { Actions, SceneItem } from "../../../helpers/types";
import { movePlayerTo, openExternalUrl, triggerEmote } from "~system/RestrictedActions";
import { localPlayer } from "../../player/player";
import { addShowText } from "../../../ui/showTextComponent";
import { entitiesFromItemIds } from "../../scenes";
import { utils } from "../../../helpers/libraries";
import { addDelayedActionTimer } from ".";
import { showDialogPanel } from "../../../ui/Panels/DialogPanel";

export function handleTriggerAction(entity:Entity, asset:SceneItem, action:any, actionId:string){
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
            let scene = Transform.get(localPlayer.activeScene!.parentEntity).position
            movePlayerTo({newRelativePosition:{x: scene.x + parseFloat(pos[0]), y: scene.y + parseFloat(pos[1]), z:scene.z + parseFloat(pos[2])}})
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
            console.log('need to show dialog panel', action.aid)
            showDialogPanel(true, action.aid)
            break;
    }
}