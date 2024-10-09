import { Animator, AudioSource, AudioStream, AvatarAnchorPointType, AvatarAttach, CameraModeArea, ColliderLayer, Entity, GltfContainer, InputAction, MeshCollider, MeshRenderer, PointerEvents, TextShape, Transform, Tween, TweenSequence, VideoPlayer, VisibilityComponent, engine } from "@dcl/sdk/ecs"
import { colyseusRoom } from "../components/Colyseus"
import { createAsset, createEntity, getEntity } from "../components/IWB"
// import { AudioLoadedComponent, GLTFLoadedComponent, MeshRenderLoadedComponent, PointersLoadedComponent, VideoLoadedComponent, VisibleLoadedComponent } from "../helpers/Components"
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
import { abortGameTermination, checkGameplay, disableGameAsset } from "../components/Game"
import { setUIClicked } from "../ui/ui"
import { localPlayer } from "../components/Player"
import { showNotification } from "../ui/Objects/NotificationPanel"
import { disableLivePanel, setLivePanel } from "../components/Live"
import { lastScene, removedEntities, sceneAttachedParents } from "../components/Scene"
import { removeItem } from "./Build"
import { getActionEvents, handleUnlockPlayer, updateActions } from "../components/Actions"
import { resetDialog, showDialogPanel } from "../ui/Objects/DialogPanel"
import { displaySkinnyVerticalPanel } from "../ui/Reuse/SkinnyVerticalPanel"
import { disablePlaylistForPlayMode, stopAllPlaylists } from "../components/Playlist"
import { disableAvatarShapePlayMode } from "../components/AvatarShape"
import { disablePathingForEntity } from "../components/Path"
import { Vector3 } from "@dcl/sdk/math"
import { checkMultiplayerSyncOnEnter } from "../components/Multiplayer"

export let entitiesWithPathingEnabled:Map<Entity, any> = new Map()
export let cameraForce:Entity

export async function handleSceneEntitiesOnLeave(sceneId:string){
    let scene = colyseusRoom.state.scenes.get(sceneId)
    if(scene && !scene.checkedLeave && scene.loaded){
        console.log('handleSceneEntitiesOnLeave for', sceneId)
        scene.checkedLeave = true
        scene.checkedEntered = false

        scene[COMPONENT_TYPES.PARENTING_COMPONENT].forEach((item:any, index:number)=>{
            if(index > 2){
                let entityInfo = getEntity(scene, item.aid)
                if(entityInfo && !scene[COMPONENT_TYPES.VEHICLE_COMPONENT].has(entityInfo.aid)){ 
                    handleSceneEntityOnLeave(scene, entityInfo)//
                }
            }
        })
    }
}

export function addForceCamera(mode:number){
    if(cameraForce || cameraForce === -500){
        cameraForce = engine.addEntity()
        CameraModeArea.create(cameraForce, {mode:mode, area: Vector3.create(3,3,3)})
        AvatarAttach.create(cameraForce, {anchorPointId:AvatarAnchorPointType.AAPT_HIP})
    }
}

export function removeForceCamera(){
    engine.removeEntity(cameraForce)
    cameraForce = -500 as Entity
}

export function handleSceneEntityOnLeave(scene:any, entityInfo:any){
    if(localPlayer.gameStatus !== PLAYER_GAME_STATUSES.PLAYING){
        disableTriggers(scene, entityInfo)
        disableLivePanel(scene, entityInfo)
        resetAttachedEntity(scene, entityInfo)
        disableAudioPlayMode(scene, entityInfo)
        disableCounterForPlayMode(scene, entityInfo)
    }

    checkGameplay(scene)

    let triggerEvents = getTriggerEvents(entityInfo.entity)
    triggerEvents.emit(Triggers.ON_LEAVE_SCENE, {input:0, pointer:0, entity:entityInfo.entity})
}

export async function handleSceneEntitiesOnEnter(sceneId:string){
    let scene = colyseusRoom.state.scenes.get(sceneId)
    console.log('scene check leave is', scene.checkLeave)
    if(scene && !scene.checkedEntered){
        scene.checkedEntered = true//
        scene.checkedLeave = false

        await loadRemovedItems(scene)

        scene[COMPONENT_TYPES.PARENTING_COMPONENT].forEach((item:any, index:number)=>{
            if(index > 2){
                let entityInfo = getEntity(scene, item.aid)
                if(entityInfo){
                    handleSceneEntityOnEnter(scene, entityInfo)
                }
            }
        })
    }
}

export function handleSceneEntityOnEnter(scene:any, entityInfo:any){
    console.log('handle on scene enter', scene)
    setPointersPlayMode(scene, entityInfo)
    setAudioPlayMode(scene, entityInfo)
    setVideoPlayMode(scene, entityInfo)
    setLivePanel(scene, entityInfo)   
    setTextShapeForPlayMode(scene, entityInfo)
    setTriggersForPlayMode(scene, entityInfo)

    checkMultiplayerSyncOnEnter(scene, entityInfo)

    let triggerEvents = getTriggerEvents(entityInfo.entity)
    triggerEvents.emit(Triggers.ON_ENTER_SCENE, {input:0, pointer:0, entity:entityInfo.entity})
}

export async function handleSceneEntitiesOnUnload(sceneId:string){
    let scene = colyseusRoom.state.scenes.get(sceneId)
        if(scene && !scene.checkedUnloaded && scene.loaded){
            console.log('handleSceneEntitiesOnUnload for', sceneId)
            scene.checkedUnloaded = true
            scene.checkedLoaded = false

            displaySkinnyVerticalPanel(false)
            stopAllTimeouts()
            stopAllIntervals()
            stopAllPlaylists(sceneId)
            resetDialog()
            showDialogPanel(false)
            handleUnlockPlayer(null, null, null)

            scene[COMPONENT_TYPES.PARENTING_COMPONENT].forEach((item:any, index:number)=>{
                if(index > 2){
                    let entityInfo = getEntity(scene, item.aid)
                    if(entityInfo){
                        handleSceneEntityOnUnload(scene, entityInfo)
                    }
                }
            })
            disableDelayedActionTimers()
            disablePlayUI()
        }
}

export async function handleSceneEntityOnUnload(scene:any, entityInfo:any){
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
        
        resetTween(scene, entityInfo)
        setAnimationBuildMode(scene, entityInfo)
        disablePlaylistForPlayMode(scene, entityInfo)
        disableAvatarShapePlayMode(scene, entityInfo)
        disablePathingForEntity(scene, entityInfo)
        //to do
        // - reset states
        // - disabe smart items?


        PointerEvents.deleteFrom(entityInfo.entity)

        await disableGameAsset(scene, itemInfo)

        let triggerEvents = getTriggerEvents(entityInfo.entity)
        triggerEvents.emit(Triggers.ON_UNLOAD_SCENE, {input:0, pointer:0, entity:entityInfo.entity})
    }
}

export async function handleSceneEntitiesOnLoad(sceneId:string){
    let scene = colyseusRoom.state.scenes.get(sceneId)
    if(scene && !scene.checkedLoaded){
        console.log('handleSceneEntitiesOnLoad for scene ', sceneId)
        scene.checkedLoaded = true
        scene.checkedUnloaded = false

        setUIClicked(false)
        abortGameTermination(scene)

        scene[COMPONENT_TYPES.PARENTING_COMPONENT].forEach((item:any, index:number)=>{
            if(index > 2){
                let entityInfo = getEntity(scene, item.aid)
                if(entityInfo && !scene[COMPONENT_TYPES.VEHICLE_COMPONENT].has(entityInfo.aid)){
                    handleSceneEntityOnLoad(scene, entityInfo)
                }
            }
        })
    }
}

export function handleSceneEntityOnLoad(scene:any, entityInfo:any){
    setGLTFPlayMode(scene, entityInfo)
                    
    setMeshColliderPlayMode(scene, entityInfo)
    setMeshRenderPlayMode(scene, entityInfo)
    setVisibilityPlayMode(scene, entityInfo)
    
    
    checkTransformComponent(scene, entityInfo)
    setTextShapeForPlayMode(scene, entityInfo)

    setUiTextPlayMode(scene, entityInfo)
    setUiImagePlayMode(scene, entityInfo)             
    setTriggersForPlayMode(scene, entityInfo)
    
    let triggerEvents = getTriggerEvents(entityInfo.entity)
    triggerEvents.emit(Triggers.ON_LOAD_SCENE, {input:0, pointer:0, entity:entityInfo.entity})
}

function disableDelayedActionTimers(){
    // delayedActionTimers.forEach((timer)=>{
    //     utils.timers.clearTimeout(timer)
    // })
}

function disablePlayUI(){
    // clearShowTexts()
}

function resetAttachedEntity(scene:any, entityInfo:any){
    let attachedIndex = sceneAttachedParents.findIndex($=> $.entity === entityInfo.entity)
    if(attachedIndex >=0){
        let attachedInfo = sceneAttachedParents[attachedIndex]
        engine.removeEntity(attachedInfo.parent)
        sceneAttachedParents.splice(attachedIndex, 1)

        checkTransformComponent(scene, entityInfo)
    }
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