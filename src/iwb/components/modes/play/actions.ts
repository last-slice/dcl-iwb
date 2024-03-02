import { Animator, AudioSource, AudioStream, Entity, GltfContainer, Transform, VideoPlayer, VisibilityComponent } from "@dcl/sdk/ecs";
import { Actions, SceneItem } from "../../../helpers/types";
import { movePlayerTo, openExternalUrl, triggerEmote } from "~system/RestrictedActions";
import { localPlayer } from "../../player/player";
import { addShowText } from "../../../ui/showTextComponent";

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
                    GltfContainer.getMutable(entity).invisibleMeshesCollisionMask = action.iMask
                    GltfContainer.getMutable(entity).visibleMeshesCollisionMask = action.vMask
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
    }
}