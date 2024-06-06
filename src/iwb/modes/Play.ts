import { Animator, AudioSource, AudioStream, ColliderLayer, Entity, GltfContainer, MeshCollider, MeshRenderer, PointerEvents, TextShape, Transform, VideoPlayer, VisibilityComponent, engine } from "@dcl/sdk/ecs"
import { colyseusRoom } from "../components/Colyseus"
import { getEntity } from "../components/IWB"
import { AudioLoadedComponent, GLTFLoadedComponent, MeshRenderLoadedComponent, VideoLoadedComponent, VisibleLoadedComponent } from "../helpers/Components"
import { AUDIO_TYPES } from "../helpers/types"
import { setMeshRenderPlayMode } from "../components/Meshes"
import { disableVideoPlayMode, setVideoPlayMode } from "../components/Videos"
import { setGLTFPlayMode } from "../components/Gltf"
import { disableVisibilityPlayMode, setVisibilityPlayMode } from "../components/Visibility"
import { disableAudioPlayMode, setAudioPlayMode } from "../components/Sounds"
import { disableAnimationPlayMode } from "../components/Animator"
import { disableSmartItemsPlayMode, setSmartItemPlaydMode } from "../components/SmartItems"

export let disabledEntities: boolean = false
export let playModeReset: boolean = true

export function updatePlayModeReset(value: boolean) {
    playModeReset = value
}

export async function disableSceneEntities(sceneId:any) {
    if (!disabledEntities) {
        let scene = colyseusRoom.state.scenes.get(sceneId)
        if(scene){
            scene.parenting.forEach((item:any, index:number)=>{
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
                    // if (PointersLoadedComponent.has(entity)) {
                    //     PointersLoadedComponent.getMutable(entity).init = false
                    // }
    
                    // //check smart items
                    // if (SmartItemLoadedComponent.has(entity)) {
                    //     SmartItemLoadedComponent.getMutable(entity).init = false
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
        // findSceneEntryTrigger(scene)//

        scene.parenting.forEach((item:any, index:number)=>{
            if(index > 2){
                let entityInfo = getEntity(scene, item.aid)
                if(entityInfo){
                    setGLTFPlayMode(scene, entityInfo)
                    setVideoPlayMode(scene, entityInfo)
                    setMeshRenderPlayMode(scene, entityInfo)
                    setVisibilityPlayMode(scene, entityInfo)
                    setAudioPlayMode(scene, entityInfo)
                    setSmartItemPlaydMode(scene, entityInfo)
                }
            }
        })
    }

    disabledEntities = false
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

    //             if (PointersLoadedComponent.has(entity) && !PointersLoadedComponent.get(entity).init) {
    //                 checkPointers(entity, sceneItem)
    //                 PointersLoadedComponent.getMutable(entity).init = true
    //             }

    //         }
    //     }
    //     disabledEntities = false
    // }
}

export function disableEntityForPlayMode(scene:any, entityInfo:any){
    let itemInfo = scene.itemInfo.get(entityInfo.aid)
    if(itemInfo){
        disableVisibilityPlayMode(scene, entityInfo)
        disableAudioPlayMode(scene, entityInfo)
        disableVideoPlayMode(scene, entityInfo)
        disableAnimationPlayMode(scene, entityInfo)
        disableSmartItemsPlayMode(scene, entityInfo)

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