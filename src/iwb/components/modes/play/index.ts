import { Animator, AudioSource, AudioStream, ColliderLayer, Entity, GltfContainer, InputAction, Material, MeshCollider, MeshRenderer, PointerEventType, PointerEvents, TextShape, Transform, VideoPlayer, VideoTexture, VisibilityComponent, engine } from "@dcl/sdk/ecs";
import { Actions, COLLISION_LAYERS, ENTITY_EMOTES, ENTITY_EMOTES_SLUGS, IWBScene, SceneItem, Triggers } from "../../../helpers/types";
import { entitiesFromItemIds, itemIdsFromEntities, sceneBuilds } from "../../scenes";
import { getRandomIntInclusive, log } from "../../../helpers/functions";
import { movePlayerTo, openExternalUrl, triggerEmote } from "~system/RestrictedActions";
import { items } from "../../catalog";
import { displaySettingsPanel } from "../../../ui/Panels/settings/settingsIndex";
import { localPlayer } from "../../player/player";
import { utils } from "../../../helpers/libraries";
import { Color3, Quaternion } from "@dcl/sdk/math";
import { handleTriggerAction } from "./actions";
import { clearShowTexts } from "../../../ui/showTextComponent";
import { sceneParent } from "../../iwb";
import { resetTweenPositions } from "../build";

export let delayedActionTimers:any[] = []

// export function resetEntityForPlayMode(scene:IWBScene, entity:Entity){
//     log('resetting enttiy for play mode')
//     let assetId = itemIdsFromEntities.get(entity)
//     if(assetId){
//         let sceneItem = scene.ass.find((a)=> a.aid === assetId)
//         if(sceneItem){
//             VisibilityComponent.createOrReplace(entity, {
//                 visible: sceneItem.visComp.visible
//             })

//             check2DCollision(entity, sceneItem)
//             checkPointers(entity, sceneItem)
//             checkAudio(entity, sceneItem)
//             checkVideo(entity, sceneItem)
//         }
//     }
// }

export function getSceneItem(scene:IWBScene, entity:Entity){
    let assetId = itemIdsFromEntities.get(entity)
    if(assetId){
        let sceneItem = scene.ass.find((a)=> a.aid === assetId)
        if(sceneItem){
            return sceneItem
        }else{
            return false
        }
    }else{
        return false
    }
}

export function disableEntityForPlayMode(sceneId:string, entity:Entity){
    let scene = sceneBuilds.get(sceneId)
    if(scene){
        let assetId = itemIdsFromEntities.get(entity)
        if(assetId){
            let sceneItem = scene.ass.find((a:any)=> a.aid === assetId)
            if(sceneItem){
                disableAudio(entity, sceneItem)
                disableVideo(entity, sceneItem)
                disableSmartItems(entity, sceneItem)
                disableAnimations(entity, sceneItem)
                disableVisibility(entity, sceneItem)
                PointerEvents.deleteFrom(entity)
                sceneItem.visComp ? VisibilityComponent.createOrReplace(entity, {visible: sceneItem.visComp.visible}) : null
                resetTweenPositions(entity, sceneItem, scene)
            }
        }
    }
}

export function findSceneEntryTrigger(scene:IWBScene){
    let triggerAssets = scene.ass.filter((asset:SceneItem)=> asset.trigComp)
    triggerAssets.forEach((tasset:SceneItem)=>{
        let triggers = tasset.trigComp.triggers.filter((trig:any)=> trig.type === Triggers.ON_ENTER)
        triggers.forEach((trigger:any)=>{
            runTrigger(tasset, trigger.actions)
        })
    })
}

export function findTriggerActionForEntity(entity:Entity, type:Triggers, pointer:InputAction){
    log('finding trigger action for entity', entity, type, pointer)
    sceneBuilds.forEach((scene,key)=>{
        let ent = scene.entities.find((e:any)=>e === entity)
        if(ent){
            try{
                let assetId = itemIdsFromEntities.get(entity)
                if(assetId){
                    let triggerAsset = scene.ass.find((a:any)=> a.aid === assetId)
                    if(triggerAsset){
                        log('found an asset with a trigger component', triggerAsset, type)
                        let triggers = triggerAsset.trigComp.triggers.filter((trig:any)=> trig.type === type && trig.pointer === pointer)
                        log('found triggers', triggers)
                        triggers.forEach((trigger:any)=>{
                            runTrigger(triggerAsset, trigger.actions)
                        })
                    }
                }
            }
            catch(e){
                log('error with entiy trigger', e)
            }
        }
    })
}

export function runTrigger(sceneItem:SceneItem, actions:any){
    actions.forEach((data:any)=>{
        let entity:any
        let asset = localPlayer.activeScene?.ass.find((asset:any)=> asset.aid === data.aid)
        if(asset && asset.actComp){
            let action = asset.actComp.actions[data.id]

            entity = entitiesFromItemIds.get(asset.aid)
            if(entity){
                handleTriggerAction(entity, asset, action, data.id)
            }
        }
    })
}

export function check2DCollision(entity:Entity, sceneItem: SceneItem){
    //check 2d collision 
    if(sceneItem.type === "2D"){
        if(sceneItem.colComp.iMask === 2 || sceneItem.colComp.vMask === 2){
            MeshCollider.setPlane(entity)
        }else{
            console.log('setting video plane mask to', sceneItem.colComp)
            MeshCollider.setPlane(entity, sceneItem.colComp.vMask)
        }

        // if(sceneItem.textComp){
        //     MeshRenderer.deleteFrom(entity)
        // }//
    }
}

export function checkPointers(entity:Entity, sceneItem: SceneItem){
    console.log('checking pointer', sceneItem.trigComp)
    if(sceneItem.trigComp && sceneItem.trigComp.triggers.length > 0 && sceneItem.trigComp.enabled){
        let pointers:any[] = []
        sceneItem.trigComp.triggers.forEach((trigger:any, i:number)=>{
            pointers.push(
                {
                    eventType: PointerEventType.PET_DOWN,
                    eventInfo: {
                        button: trigger.pointer,
                        hoverText: "" + trigger.hoverText,
                        maxDistance: trigger.distance
                    }
                }
            )
        })

        PointerEvents.createOrReplace(entity,{
            pointerEvents:pointers
        })
    }
}

export function checkAudio(entity:Entity, sceneItem: SceneItem){
    if(sceneItem.audComp){
        log('checking audio component for play mode')
        
        // let data:any = {}
        // if(sceneItem.id !==""){
        //     data.loop = sceneItem.audComp.loop
        //     data.playing = sceneItem.audComp.autostart
        //     data.audioClipUrl = AudioSource.get(entity).audioClipUrl

        //     AudioSource.createOrReplace(entity,{
        //         audioClipUrl:"",
        //         playing:
        //     })

        // }else{
        //     AudioStream.createOrReplace(entity, {
        //         url: 
        //     })
        // }

         if(sceneItem.audComp.attachedPlayer){
            Transform.createOrReplace(entity, {parent:engine.PlayerEntity})
        }

        let audio:any
        if(sceneItem.id !== "e6991f31-4b1e-4c17-82c2-2e484f53a124"){
            audio = AudioSource.getMutableOrNull(entity)
        }
        else{
            console.log('playing streaming audio')
            audio = AudioStream.getMutableOrNull(entity)
        }
        
        //check position//
        if(sceneItem.audComp.attachedPlayer){
            Transform.createOrReplace(entity, {parent:engine.PlayerEntity})
        }

        if(audio){
            //check autostart
            if(sceneItem.audComp.autostart){
                audio.playing = sceneItem.audComp.autostart
            }

            //check loop
            if(sceneItem.audComp.loop){
                audio.loop = sceneItem.audComp.loop
            }


            console.log('playing audio', audio)
        }
    }
}

export function checkVideo(entity:Entity, sceneItem: SceneItem){
    if(sceneItem.vidComp){
        if(sceneItem.vidComp.autostart){
            let video = VideoPlayer.getMutableOrNull(entity)
            if(video){
                video.playing = true
                video.position = 0
            }
        }
    }
}

export function check3DCollision(entity: Entity, sceneItem: SceneItem) {
    if (sceneItem.type === "3D") {
        let gltf = GltfContainer.getMutableOrNull(entity)
        if(gltf){
            gltf.invisibleMeshesCollisionMask = (sceneItem.colComp.iMask === 3 ? ColliderLayer.CL_PHYSICS | ColliderLayer.CL_POINTER : sceneItem.colComp.iMask)
            gltf.visibleMeshesCollisionMask = (sceneItem.colComp.vMask === 3 ? ColliderLayer.CL_PHYSICS | ColliderLayer.CL_POINTER : sceneItem.colComp.vMask)
        }
    }
}

function disableAudio(entity:Entity, sceneItem: SceneItem){
    if(sceneItem.audComp){
        log('disabling audio component for play mode')
        MeshRenderer.deleteFrom(entity)
        MeshCollider.deleteFrom(entity)
        TextShape.deleteFrom(entity)

        let itemData = items.get(sceneItem.id)
        if(itemData){
            log('audio item data is', itemData)
            if(itemData.id !== "e6991f31-4b1e-4c17-82c2-2e484f53a124"){
                AudioSource.getMutable(entity).playing = false
            }else{
                AudioStream.getMutable(entity).playing = false
            }
        }    
    }
}

function disableVideo(entity:Entity, sceneItem: SceneItem){
    if(sceneItem.vidComp){
        VideoPlayer.getMutable(entity).playing = false
    }
}

function disableSmartItems(entity:Entity, sceneItem: SceneItem){
    switch(items.get(sceneItem.id)?.n){
        case 'Trigger Area':
            if(sceneItem.trigArComp){
                MeshRenderer.deleteFrom(entity)
                MeshCollider.deleteFrom(entity)
                Material.deleteFrom(entity)
                utils.triggers.enableTrigger(entity, false)
            }
            break;

        case 'Click Area':
            MeshRenderer.deleteFrom(entity)
            MeshCollider.deleteFrom(entity)
            Material.deleteFrom(entity)
            PointerEvents.deleteFrom(entity)
            break;

        case 'Dialog':
        case 'Reward':
            MeshRenderer.deleteFrom(entity)
            MeshCollider.deleteFrom(entity)
            Material.deleteFrom(entity)
            PointerEvents.deleteFrom(entity)
            TextShape.deleteFrom(entity)
            break;
    }
}

export function teleportToScene(scene:IWBScene){
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

    displaySettingsPanel(false)

    movePlayerTo({newRelativePosition:position, cameraTarget:camera})
}

export function checkSmartItem(entity:Entity, sceneItem: SceneItem, scene:IWBScene){
    console.log("checking smart item for play mode", sceneItem)
    MeshRenderer.deleteFrom(entity)
    MeshCollider.deleteFrom(entity)
    Material.deleteFrom(entity)

    switch(items.get(sceneItem.id)?.n){
        case 'Trigger Area':
            if(sceneItem.trigArComp && sceneItem.trigArComp.enabled){
                utils.triggers.enableTrigger(entity, sceneItem.trigArComp.enabled)
            }else{
                utils.triggers.enableTrigger(entity, false)
            }
            break;

        case 'Click Area':
            if(sceneItem.trigComp && sceneItem.trigComp.enabled){
                MeshCollider.setBox(entity, ColliderLayer.CL_POINTER)
            }
            break;

        case 'NPC'://
            // Transform.createOrReplace(entity, {
            //     parent: sceneParent,
            //     position: sceneItem.p,
            //     rotation: Quaternion.fromEulerDegrees(sceneItem.r.x, sceneItem.r.y, sceneItem.r.z),
            //     scale: sceneItem.s
            // })
            break;
    }
}

export function disableAnimations(entity:Entity, sceneItem:SceneItem){
    if(sceneItem.animComp){
        Animator.has(entity) ? Animator.stopAllAnimations(entity, true) : null
    }
}

export function disableVisibility(entity:Entity, sceneItem:SceneItem){
    if(!sceneItem.visComp.visible){
        VisibilityComponent.getMutable(entity).visible = false
    }
}

export function checkAnimation(entity:Entity, sceneItem: SceneItem){
    console.log('checking animations for play mode', sceneItem)
    if(sceneItem.animComp && sceneItem.animComp.enabled && sceneItem.animComp.autostart){
        Animator.deleteFrom(entity)

        let animations:any[] = []

        sceneItem.animComp.animations.forEach((animation:string, i:number)=>{
            let anim:any = {
                clip:animation,
                playing: sceneItem.animComp.autostart && sceneItem.animComp.startIndex === i ? true : false,
                loop: sceneItem.animComp.autoloop && sceneItem.animComp.autostart && sceneItem.animComp.startIndex === i ? true : false
            }
            animations.push(anim)
        })

        Animator.createOrReplace(entity, {
            states:animations
        })
    }
}

export function addDelayedActionTimer(timer:any){
    delayedActionTimers.push(timer)
}

export function disableDelayedActionTimers(){
    delayedActionTimers.forEach((timer)=>{
        utils.timers.clearTimeout(timer)
    })
    delayedActionTimers.length = 0
}

export function disablePlayUI(){
    clearShowTexts()
}

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