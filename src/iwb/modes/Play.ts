import { Animator, AudioSource, AudioStream, ColliderLayer, Entity, GltfContainer, InputAction, MeshCollider, MeshRenderer, PointerEvents, TextShape, Transform, Tween, TweenSequence, VideoPlayer, VisibilityComponent, engine } from "@dcl/sdk/ecs"
import { colyseusRoom } from "../components/Colyseus"
import { createAsset, createEntity, getEntity } from "../components/IWB"
import { AudioLoadedComponent, GLTFLoadedComponent, MeshRenderLoadedComponent, PointersLoadedComponent, VideoLoadedComponent, VisibleLoadedComponent } from "../helpers/Components"
import { AUDIO_TYPES, COMPONENT_TYPES, IWBScene, NOTIFICATION_TYPES, PLAYER_GAME_STATUSES, Triggers } from "../helpers/types"
import { disableMeshColliderPlayMode, disableMeshRenderPlayMode, setMeshColliderPlayMode, setMeshRenderPlayMode } from "../components/Meshes"
import { disableVideoPlayMode, setVideoPlayMode } from "../components/Videos"
import { setGLTFPlayMode } from "../components/Gltf"
import { disableVisibilityPlayMode, setVisibilityPlayMode, updateAssetBuildVisibility } from "../components/Visibility"
import { disableAudioPlayMode, setAudioPlayMode } from "../components/Sounds"
import { disableAnimationPlayMode, setAnimationBuildMode } from "../components/Animator"
import { disableSmartItemsPlayMode, setSmartItemPlaydMode } from "../components/SmartItems"
import { setPointersPlayMode } from "../components/Pointers"
import { checkTransformComponent } from "../components/Transform"
import { disableTextShapePlayMode, setTextShapeForPlayMode } from "../components/TextShape"
import { disableTriggers, getTriggerEvents, setTriggersForPlayMode } from "../components/Triggers"
import { disableCounterForPlayMode } from "../components/Counter"
import { disableUiTextPlayMode, setUiTextPlayMode } from "../components/UIText"
import { disableUiImagePlayMode, setUiImagePlayMode } from "../components/UIImage"
import { getRandomIntInclusive } from "../helpers/functions"
import { displayMainView } from "../ui/Objects/IWBView"
import { movePlayerTo } from "~system/RestrictedActions"
import { stopAllIntervals, stopAllTimeouts } from "../components/Timer"
import { abortGameTermination, checkGameplay } from "../components/Game"
import { setUIClicked } from "../ui/ui"
import { localPlayer } from "../components/Player"
import { showNotification } from "../ui/Objects/NotificationPanel"
import { disableLivePanel, setLivePanel } from "../components/Live"
import { lastScene, removedEntities } from "../components/Scene"
import { removeItem } from "./Build"
import { getActionEvents, handleUnlockPlayer, updateActions } from "../components/Actions"
import { resetDialog, showDialogPanel } from "../ui/Objects/DialogPanel"
import { displaySkinnyVerticalPanel } from "../ui/Reuse/SkinnyVerticalPanel"
import { disablePlaylistForPlayMode, stopAllPlaylists } from "../components/Playlist"
import { disableAvatarShapePlayMode } from "../components/AvatarShape"
import { disablePathingForEntity } from "../components/Path"

export let disabledEntities: boolean = false
export let playModeReset: boolean = true

export let entitiesWithPathingEnabled:Map<Entity, any> = new Map()

export function updateDisabledEntities(value:boolean){
    disabledEntities = value
}

export function updatePlayModeReset(value: boolean) {
    playModeReset = value
}

export async function disableSceneEntitiesOnLeave(sceneId:any){
    let scene = colyseusRoom.state.scenes.get(sceneId)
    if(scene && !scene.checkLeave && scene.loaded){
        scene[COMPONENT_TYPES.PARENTING_COMPONENT].forEach((item:any, index:number)=>{
            if(index > 2){
                let entityInfo = getEntity(scene, item.aid)
                if(entityInfo){
                    //check 3d//
                if (GLTFLoadedComponent.has(entityInfo.entity)) {
                    GLTFLoadedComponent.getMutable(entityInfo.entity).init = false
                }

                //check video
                if (VideoLoadedComponent.has(entityInfo.entity)) {
                    VideoLoadedComponent.getMutable(entityInfo.entity).init = false
                }

                //check audio
                if (AudioLoadedComponent.has(entityInfo.entity)) {
                    AudioLoadedComponent.getMutable(entityInfo.entity).init = false
                }

                if (VisibleLoadedComponent.has(entityInfo.entity)) {
                    VisibleLoadedComponent.getMutable(entityInfo.entity).init = false
                }

                // //check pointers
                if (PointersLoadedComponent.has(entityInfo.entity)) {
                    PointersLoadedComponent.getMutable(entityInfo.entity).init = false
                }

                disableTriggers(scene, entityInfo)
                }
            }
        })

        scene.checkLeave = true
        scene.checkDisabled = false
        scene.checkEnabled = false
    }
}

export async function disableSceneEntities(sceneId:any) {
    // console.log('disabling scene entities', lastScene, localPlayer.activeScene)
    // if (!disabledEntities) {
        // console.log('disabling entities')
        // stopAllIntervals()
        // stopAllTimeouts()

        let scene = colyseusRoom.state.scenes.get(sceneId)
        if(scene && !scene.checkDisabled && scene.loaded){
            console.log('disabling scene entities for', sceneId)
            displaySkinnyVerticalPanel(false)
            stopAllTimeouts()
            stopAllIntervals()
            stopAllPlaylists(sceneId)
            resetDialog()
            showDialogPanel(false)
            handleUnlockPlayer(null, null, null)

            checkGameplay(scene)

            let levels:any[] =[]
            scene[COMPONENT_TYPES.LEVEL_COMPONENT].forEach((level:any, aid:string)=>{
                levels.push(aid)
            })

            scene[COMPONENT_TYPES.PARENTING_COMPONENT].forEach((item:any, index:number)=>{
                if(index > 2){
                    let entityInfo = getEntity(scene, item.aid)
                    if(entityInfo){
                        //check 3d//
                    if (GLTFLoadedComponent.has(entityInfo.entity)) {
                        GLTFLoadedComponent.getMutable(entityInfo.entity).init = false
                    }
    
                    //check video
                    if (VideoLoadedComponent.has(entityInfo.entity)) {
                        VideoLoadedComponent.getMutable(entityInfo.entity).init = false
                    }
    
                    //check audio
                    if (AudioLoadedComponent.has(entityInfo.entity)) {
                        AudioLoadedComponent.getMutable(entityInfo.entity).init = false
                    }
    
                    if (VisibleLoadedComponent.has(entityInfo.entity)) {
                        VisibleLoadedComponent.getMutable(entityInfo.entity).init = false
                    }
    
                    // //check pointers
                    if (PointersLoadedComponent.has(entityInfo.entity)) {
                        PointersLoadedComponent.getMutable(entityInfo.entity).init = false
                    }
    
                    // //check smart items
                    // if (SmartItemLoadedComponent.has(entity)) {
                    //     SmartItemLoadedComponent.getMutable(entity).init = false//
                    // }
    
                    disableEntityForPlayMode(scene, entityInfo)
                    }
                }
            })
            scene.checkDisabled = true
            scene.checkEnabled = false

            disableDelayedActionTimers()
            disablePlayUI()
            disabledEntities = true
        }

        // disableDelayedActionTimers()
        // disablePlayUI()
        // disabledEntities = true//
    // }
}

export async function enableSceneEntities(sceneId: string) {
    // console.log('enabling scene entities', lastScene, localPlayer.activeScene)
    let scene = colyseusRoom.state.scenes.get(sceneId)
    if(scene && !scene.checkEnabled){
        console.log('enable scene entities', sceneId)
        setUIClicked(false)
        updatePlayModeReset(true)

        abortGameTermination(scene)

        await loadRemovedItems(scene)

        // findSceneEntryTrigger(scene)//

        // let levels:any[] =[]
        // scene[COMPONENT_TYPES.LEVEL_COMPONENT].forEach((level:any, aid:string)=>{
        //     levels.push(aid)
        // })//

        triggerSceneEntitiesOnLoad(sceneId)
    }

    // log('enable scene entities for play mode')
    // let scene = sceneBuilds.get(sceneId)
    // if (scene) {
    //     findSceneEntryTrigger(scene)
        
    //     for (let i = 0; i < scene.entities.length; i++) {
    //         let entity = scene.entities[i]//

    //         let sceneItem = getSceneItem(scene, entity)
    //         if (sceneItem) {


    //             //check smart items
    //             console.log('about to check smart items for play mod')
    //             if (SmartItemLoadedComponent.has(entity) && !SmartItemLoadedComponent.get(entity).init) {
    //                 console.log('need to check for smart item play mode')
    //                 checkSmartItem(entity, sceneItem, scene)
    //                 SmartItemLoadedComponent.getMutable(entity).init = true
    //             }

    //         }
    //     }
    //     disabledEntities = false
    // }
    scene.checkLeave = false
    scene.checkEnabled = true
    scene.checkDisabled = false
}

export function triggerSceneEntitiesOnEnter(sceneId:string){
    let scene = colyseusRoom.state.scenes.get(sceneId)
    if(scene && scene.checkLeave){
        scene[COMPONENT_TYPES.PARENTING_COMPONENT].forEach((item:any, index:number)=>{
            if(index > 2){
                let entityInfo = getEntity(scene, item.aid)
                if(entityInfo){
    
                    setAudioPlayMode(scene, entityInfo)
                    setVideoPlayMode(scene, entityInfo)
                    setTriggersForPlayMode(scene, entityInfo)
    
                    let triggerEvents = getTriggerEvents(entityInfo.entity)
                    triggerEvents.emit(Triggers.ON_ENTER_SCENE, {input:0, pointer:0, entity:entityInfo.entity})
                }
            }
        })
        scene.checkLeave = false
        scene.checkDisabled = false
        scene.checkEnabled = true
    }
}

export function triggerSceneEntitiesOnLoad(sceneId:string){
    let scene = colyseusRoom.state.scenes.get(sceneId)
    scene[COMPONENT_TYPES.PARENTING_COMPONENT].forEach((item:any, index:number)=>{
        if(index > 2){
            let entityInfo = getEntity(scene, item.aid)
            if(entityInfo){

                setGLTFPlayMode(scene, entityInfo)
                
                setMeshColliderPlayMode(scene, entityInfo)
                setMeshRenderPlayMode(scene, entityInfo)
                setVisibilityPlayMode(scene, entityInfo)
                
                // setSmartItemPlaydMode(scene, entityInfo)
                setPointersPlayMode(scene, entityInfo)
                checkTransformComponent(scene, entityInfo)
                setTextShapeForPlayMode(scene, entityInfo)

                setUiTextPlayMode(scene, entityInfo)
                setUiImagePlayMode(scene, entityInfo)
                setLivePanel(scene, entityInfo)                
                
                let triggerEvents = getTriggerEvents(entityInfo.entity)
                triggerEvents.emit(Triggers.ON_LOAD_SCENE, {input:0, pointer:0, entity:entityInfo.entity})
            }
        }
    })
}
export function enableEntityForPlayMode(scene:any, entityInfo:any){

}

export function disableEntityForPlayMode(scene:any, entityInfo:any){
    let itemInfo = scene[COMPONENT_TYPES.IWB_COMPONENT].get(entityInfo.aid)
    if(itemInfo && localPlayer.gameStatus !== PLAYER_GAME_STATUSES.PLAYING){
        disableVisibilityPlayMode(scene, entityInfo)
        disableAudioPlayMode(scene, entityInfo)
        disableVideoPlayMode(scene, entityInfo)
        disableAnimationPlayMode(scene, entityInfo)
        disableMeshColliderPlayMode(scene, entityInfo)
        disableMeshRenderPlayMode(scene, entityInfo)
        disableTextShapePlayMode(scene, entityInfo)
        disableSmartItemsPlayMode(scene, entityInfo)

        checkTransformComponent(scene, entityInfo)
        disableCounterForPlayMode(scene, entityInfo)
        disableUiTextPlayMode(scene, entityInfo)
        disableUiImagePlayMode(scene, entityInfo)
        disableLivePanel(scene, entityInfo)
        resetTween(scene, entityInfo)
        setAnimationBuildMode(scene, entityInfo)
        disablePlaylistForPlayMode(scene, entityInfo)
        disableAvatarShapePlayMode(scene, entityInfo)
        disablePathingForEntity(scene, entityInfo)
        //to do
        // - reset states
        // - reset tweens
        // - disabe smart items?


        PointerEvents.deleteFrom(entityInfo.entity)
    }
}

function disableDelayedActionTimers(){
    // delayedActionTimers.forEach((timer)=>{
    //     utils.timers.clearTimeout(timer)
    // })
}

function disablePlayUI(){
    // clearShowTexts()
}

export function teleportToScene(info:any){
    let scene = colyseusRoom.state.scenes.get(info.id)
    if(!localPlayer.canTeleport){
        showNotification({type:NOTIFICATION_TYPES.MESSAGE, message: "Telporting is disabled", animate:{enabled:true, return:true, time:3}})
        return
    }

    if(scene){
        let rand = getRandomIntInclusive(0, scene.sp.length-1)
        let parent = Transform.get(scene.parentEntity).position

        let position = {x:0, y:0, z:0}
        let camera = {x:0, y:0, z:0}
    
        let [sx,sy,sz] = scene.sp[rand].split(",")
        let [cx,cy,cz] = scene.cp[rand].split(",")
    
        position.x = parent.x + parseInt(sx)
        position.y = parent.y + parseInt(sy)
        position.z = parent.z + parseInt(sz)
    
        camera.x = parent.x + parseInt(cx)
        camera.y = parent.y + parseInt(cy)
        camera.z = parent.z + parseInt(cz)
    
        displayMainView(false)
    
        movePlayerTo({newRelativePosition:position, cameraTarget:camera})
    }
}

export function resetTween(scene:any, entityInfo:any){
    // let tweenData = Tween.getMutableOrNull(entityInfo.entity)
    // tweenData ? tweenData.playing = false : null
    TweenSequence.deleteFrom(entityInfo.entity)
    Tween.deleteFrom(entityInfo.entity)
}

async function loadRemovedItems(scene:any){
    let removedItems:any[] = removedEntities.get(scene.id)
    console.log('removed items to load are ', removedItems)
    if(removedItems && removedItems.length > 0){
        for(let i = 0; i < removedItems.length; i++){
            let removedInfo = removedItems[i]
            let iwbInfo = scene[COMPONENT_TYPES.IWB_COMPONENT].get(removedInfo.aid)
            console.log('iwb info is', iwbInfo, iwbInfo.aid, iwbInfo.entity)

            await createEntity(iwbInfo)
            console.log('entity is now', iwbInfo.entity)
            await createAsset(scene, iwbInfo)

            let actions = scene[COMPONENT_TYPES.ACTION_COMPONENT].get(iwbInfo.aid)
            if(actions && actions.actions && actions.actions.length > 0){
                const actionEvents = getActionEvents(iwbInfo.entity)
                actionEvents.off("*", ()=>{})

                actions.actions.forEach((action:any)=>{
                    updateActions(scene, iwbInfo, action)
                })
            }
        }
        removedEntities.delete(scene.id)
    }
}