import { Animator, AudioSource, AudioStream, ColliderLayer, Entity, GltfContainer, MeshCollider, MeshRenderer, PointerEvents, TextShape, Transform, VideoPlayer, VisibilityComponent, engine } from "@dcl/sdk/ecs"
import { colyseusRoom } from "../components/Colyseus"
import { getEntity } from "../components/IWB"
import { AudioLoadedComponent, GLTFLoadedComponent, MeshLoadedComponent, VideoLoadedComponent, VisibleLoadedComponent } from "../helpers/Components"
import { AUDIO_TYPES } from "../helpers/types"

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
        // findSceneEntryTrigger(scene)

        scene.parenting.forEach((item:any, index:number)=>{
            if(index > 2){
                let entityInfo = getEntity(scene, item.aid)
                if(entityInfo){

                    enableGLTFComponent(scene, entityInfo)
                    enableVideoComponent(scene, entityInfo)
                    enableMeshComponent(scene, entityInfo)
                    enableVisibilityComponent(scene, entityInfo)
                    enableAudioComponent(scene, entityInfo)
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
        disableVisibility(scene, entityInfo)
        disableAudio(scene, entityInfo)
        disableVideo(scene, entityInfo)
        disableAnimations(scene, entityInfo)

        //need to deconstruct smart items into their separate components
        disableSmartItems(scene, entityInfo)

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

function disableVisibility(scene:any, entityInfo:any){
    let itemInfo = scene.visibilities.get(entityInfo.aid)
    if(itemInfo){
        VisibilityComponent.createOrReplace(entityInfo.entity, {
            visible: itemInfo.visible
        })
    }
}

function disableAudio(scene:any, entityInfo:any){
    let itemInfo = scene.sounds.get(entityInfo.aid)
    if(itemInfo){
        MeshRenderer.deleteFrom(entityInfo.entity)
        MeshCollider.deleteFrom(entityInfo.entity)
        TextShape.deleteFrom(entityInfo.entity)

        if(itemInfo.type === AUDIO_TYPES.SOUND){
            AudioSource.getMutable(entityInfo.entity).playing = false
        }else{
            AudioStream.getMutable(entityInfo.entity).playing = false
        }
    }
}

function disableVideo(scene:any, entityInfo:any){
    let itemInfo = scene.videos.get(entityInfo.aid)
    if(itemInfo){
        VideoPlayer.getMutable(entityInfo.entity).playing = false
    }
}

export function disableAnimations(scene:any, entityInfo:any){
    let itemInfo = scene.animators.get(entityInfo.aid)
    if(itemInfo){
        Animator.has(entityInfo.entity) ? Animator.stopAllAnimations(entityInfo.entity, true) : null
    }
}

function disableSmartItems(scene:any, entityInfo:any){
    // let itemInfo = scene.videos.get(entityInfo.aid)
    // if(itemInfo){
    //     VideoPlayer.getMutable(entityInfo.entity).playing = false
    // }

    // switch(items.get(sceneItem.id)?.n){
    //     case 'Trigger Area':
    //         if(sceneItem.trigArComp){
    //             MeshRenderer.deleteFrom(entity)

    //             Material.deleteFrom(entity)
    //             utils.triggers.enableTrigger(entity, false)
    //         }
    //         break;

    //     case 'Click Area':
    //         MeshRenderer.deleteFrom(entity)
    //         MeshCollider.deleteFrom(entity)
    //         Material.deleteFrom(entity)
    //         PointerEvents.deleteFrom(entity)
    //         break;

    //     case 'Dialog':
    //     case 'Reward':
    //         MeshRenderer.deleteFrom(entity)
    //         MeshCollider.deleteFrom(entity)
    //         Material.deleteFrom(entity)
    //         PointerEvents.deleteFrom(entity)
    //         TextShape.deleteFrom(entity)
    //         break;
    // }
}

function disableDelayedActionTimers(){
    // delayedActionTimers.forEach((timer)=>{
    //     utils.timers.clearTimeout(timer)
    // })
}

function disablePlayUI(){
    // clearShowTexts()
}


////////////////////////////////////////////////////////////////////////
//ENABLE FUNCTIONS

function enableGLTFComponent(scene:any, entityInfo:any){
    if (GLTFLoadedComponent.has(entityInfo.entity) && !GLTFLoadedComponent.get(entityInfo.entity).init){
        let gltfInfo = scene.gltfs.get(entityInfo.aid)
        if(gltfInfo){
            let gltf = GltfContainer.getMutableOrNull(entityInfo.entity)
            if(gltf){
                gltf.invisibleMeshesCollisionMask = (gltfInfo.invisibleCollision === 3 ? ColliderLayer.CL_PHYSICS | ColliderLayer.CL_POINTER : gltfInfo.invisibleCollision)
                gltf.visibleMeshesCollisionMask = (gltfInfo.visibleCollision === 3 ? ColliderLayer.CL_PHYSICS | ColliderLayer.CL_POINTER : gltfInfo.visibleCollision)
            }
            checkAnimation(scene, entityInfo)
        }
        GLTFLoadedComponent.getMutable(entityInfo.entity).init = true
    }
}

function checkAnimation(scene:any, entityInfo:any){
    let animatorInfo = scene.animators.get(entityInfo.aid)
    if(animatorInfo){
        Animator.deleteFrom(entityInfo.entity)

        let animations:any[] = []
        animatorInfo.states.forEach((state:any)=>{
            animations.push(state)
        })

        Animator.createOrReplace(entityInfo.entity, {
            states:animations
        })
    }
}

function enableVideoComponent(scene:any, entityInfo:any){
    if (VideoLoadedComponent.has(entityInfo.entity) && !VideoLoadedComponent.get(entityInfo.entity).init){
        let videoInfo = scene.videos.get(entityInfo.aid)
        if(videoInfo && videoInfo.autostart){
            console.log('need to start playing a video for play mode')
            let video = VideoPlayer.getMutableOrNull(entityInfo.entity)
            if(video){
                video.playing = true
                video.position = 0
            }
            checkAnimation(scene, entityInfo)
        }
        VideoLoadedComponent.getMutable(entityInfo.entity).init = true
    }
}

function enableMeshComponent(scene:any, entityInfo:any){
    if (MeshLoadedComponent.has(entityInfo.entity) && !MeshLoadedComponent.get(entityInfo.entity).init){
        let meshInfo = scene.meshes.get(entityInfo.aid)
        if(meshInfo){
            MeshCollider.setPlane(entityInfo.entity)
        }
        MeshLoadedComponent.getMutable(entityInfo.entity).init = true
    }
}

function enableVisibilityComponent(scene:any, entityInfo:any){
    if (VisibleLoadedComponent.has(entityInfo.entity) && !VisibleLoadedComponent.get(entityInfo.entity).init){
        let visibilityInfo = scene.visibilities.get(entityInfo.aid)
        if(visibilityInfo){
            VisibilityComponent.has(entityInfo.entity) && VisibilityComponent.createOrReplace(entityInfo.entity, {
                visible: visibilityInfo.visible
            })
        }
        VisibleLoadedComponent.getMutable(entityInfo.entity).init = true
    }
}

function enableAudioComponent(scene:any, entityInfo:any){
    if (AudioLoadedComponent.has(entityInfo.entity) && !AudioLoadedComponent.get(entityInfo.entity).init){
        let audioInfo = scene.sounds.get(entityInfo.aid)
        if(audioInfo){
            MeshRenderer.deleteFrom(entityInfo.entity)
            MeshCollider.deleteFrom(entityInfo.entity)
            TextShape.deleteFrom(entityInfo.entity)

            if(audioInfo.attach){
                Transform.createOrReplace(entityInfo.entity, {parent:engine.PlayerEntity})
            }
    
            let audio:any
            if(audioInfo.type === AUDIO_TYPES.SOUND){
                audio = AudioSource.getMutableOrNull(entityInfo.entity)
            }else{
                audio = AudioStream.getMutableOrNull(entityInfo.entity)
            }
    
            if(audio){
                audio.autostart = audioInfo.autostart
                audio.loop = audioInfo.loop
                audio.volume = audioInfo.volume
            }
        }
        AudioLoadedComponent.getMutable(entityInfo.entity).init = true
    }
}