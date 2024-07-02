import { Animator, AudioSource, AudioStream, ColliderLayer, Entity, GltfContainer, InputAction, MeshCollider, MeshRenderer, PointerEvents, TextShape, Transform, VideoPlayer, VisibilityComponent, engine } from "@dcl/sdk/ecs"
import { colyseusRoom } from "../components/Colyseus"
import { getEntity } from "../components/IWB"
import { AudioLoadedComponent, GLTFLoadedComponent, MeshRenderLoadedComponent, PointersLoadedComponent, VideoLoadedComponent, VisibleLoadedComponent } from "../helpers/Components"
import { AUDIO_TYPES, COMPONENT_TYPES, IWBScene } from "../helpers/types"
import { disableMeshColliderPlayMode, disableMeshRenderPlayMode, setMeshColliderPlayMode, setMeshRenderPlayMode } from "../components/Meshes"
import { disableVideoPlayMode, setVideoPlayMode } from "../components/Videos"
import { setGLTFPlayMode } from "../components/Gltf"
import { disableVisibilityPlayMode, setVisibilityPlayMode, updateAssetBuildVisibility } from "../components/Visibility"
import { disableAudioPlayMode, setAudioPlayMode } from "../components/Sounds"
import { disableAnimationPlayMode } from "../components/Animator"
import { disableSmartItemsPlayMode, setSmartItemPlaydMode } from "../components/SmartItems"
import { setPointersPlayMode } from "../components/Pointers"
import { checkTransformComponent } from "../components/Transform"
import { disableTextShapePlayMode, setTextShapeForPlayMode } from "../components/TextShape"
import { disableTriggers, setTriggersForPlayMode } from "../components/Triggers"
import { disableCounterForPlayMode } from "../components/Counter"
import { disableUiTextPlayMode, setUiTextPlayMode } from "../components/UIText"
import { disableUiImagePlayMode, setUiImagePlayMode } from "../components/UIImage"
import { getRandomIntInclusive } from "../helpers/functions"
import { displayMainView } from "../ui/Objects/IWBView"
import { movePlayerTo } from "~system/RestrictedActions"
import { stopAllIntervals, stopAllTimeouts } from "../components/Timer"

export let disabledEntities: boolean = false
export let playModeReset: boolean = true

export function updatePlayModeReset(value: boolean) {
    playModeReset = value
}

export async function disableSceneEntities(sceneId:any) {
    if (!disabledEntities) {
        console.log('disabling entities')
        stopAllIntervals()
        stopAllTimeouts()

        let scene = colyseusRoom.state.scenes.get(sceneId)
        if(scene){
            stopAllIntervals()

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
        }

        disableDelayedActionTimers()
        disablePlayUI()
        disabledEntities = true
    }
}

export function enableSceneEntities(sceneId: string) {
    let scene = colyseusRoom.state.scenes.get(sceneId)
    if(scene){
        updatePlayModeReset(true)

        // findSceneEntryTrigger(scene)//

        let levels:any[] =[]
        scene[COMPONENT_TYPES.LEVEL_COMPONENT].forEach((level:any, aid:string)=>{
            levels.push(aid)
        })

        scene[COMPONENT_TYPES.PARENTING_COMPONENT].forEach((item:any, index:number)=>{
            if(index > 2){
                let entityInfo = getEntity(scene, item.aid)
                if(entityInfo){
                    levels.forEach((level:string)=>{
                        let parenting = scene[COMPONENT_TYPES.PARENTING_COMPONENT].find((parent:any)=> parent.aid === level)
                        if(parenting && parenting.children.includes(item.aid)){
                            disableEntityForPlayMode(scene, entityInfo)
                            updateAssetBuildVisibility(scene, false, entityInfo)
                        }else{
                            setGLTFPlayMode(scene, entityInfo)
                            setVideoPlayMode(scene, entityInfo)
                            setMeshColliderPlayMode(scene, entityInfo)
                            setMeshRenderPlayMode(scene, entityInfo)
                            setVisibilityPlayMode(scene, entityInfo)
                            setAudioPlayMode(scene, entityInfo)
                            setSmartItemPlaydMode(scene, entityInfo)
                            setPointersPlayMode(scene, entityInfo)
                            checkTransformComponent(scene, entityInfo)
                            setTextShapeForPlayMode(scene, entityInfo)
                            setTriggersForPlayMode(scene, entityInfo)
                            setUiTextPlayMode(scene, entityInfo)
                            setUiImagePlayMode(scene, entityInfo)
                        }
                    })
                }
            }
        })
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
    disabledEntities = false
}

export function disableEntityForPlayMode(scene:any, entityInfo:any){
    let itemInfo = scene[COMPONENT_TYPES.IWB_COMPONENT].get(entityInfo.aid)
    if(itemInfo){
        disableVisibilityPlayMode(scene, entityInfo)
        disableAudioPlayMode(scene, entityInfo)
        disableVideoPlayMode(scene, entityInfo)
        disableAnimationPlayMode(scene, entityInfo)
        disableMeshColliderPlayMode(scene, entityInfo)
        disableMeshRenderPlayMode(scene, entityInfo)
        disableTextShapePlayMode(scene, entityInfo)
        disableSmartItemsPlayMode(scene, entityInfo)
        disableTriggers(scene, entityInfo)
        checkTransformComponent(scene, entityInfo)
        disableCounterForPlayMode(scene, entityInfo)
        disableUiTextPlayMode(scene, entityInfo)
        disableUiImagePlayMode(scene, entityInfo)

        //reset states//


        PointerEvents.deleteFrom(entityInfo.entity)
    }


    // if(scene){
    //     let assetId = itemIdsFromEntities.get(entity)
    //     if(assetId){
    //         let sceneItem = scene.ass.find((a:any)=> a.aid === assetId)
    //         if(sceneItem){
    //             disableSmartItems(entity, sceneItem)
    //             PointerEvents.deleteFrom(entity)
    //             sceneItem.visComp ? VisibilityComponent.createOrReplace(entity, {visible: sceneItem.visComp.visible}) : null
    //             resetTweenPositions(entity, sceneItem, scene)
    //         }
    //     }
    // }//
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