import { AudioSource, AudioStream, ColliderLayer, Entity, InputAction, Material, MeshCollider, MeshRenderer, PointerEventType, PointerEvents, TextShape, Transform, VideoPlayer, VideoTexture, VisibilityComponent, engine } from "@dcl/sdk/ecs";
import { Actions, COLLISION_LAYERS, IWBScene, SceneItem, Triggers } from "../../../helpers/types";
import { entitiesFromItemIds, itemIdsFromEntities, sceneBuilds } from "../../scenes";
import { getRandomIntInclusive, log } from "../../../helpers/functions";
import { movePlayerTo, openExternalUrl } from "~system/RestrictedActions";
import { items } from "../../catalog";
import { displaySettingsPanel } from "../../../ui/Panels/settings/settingsIndex";
import { localPlayer } from "../../player/player";
import { utils } from "../../../helpers/libraries";
import { Color3 } from "@dcl/sdk/math";

export function resetEntityForPlayMode(scene:IWBScene, entity:Entity){
    log('resetting enttiy for play mode')
    let assetId = itemIdsFromEntities.get(entity)
    if(assetId){
        let sceneItem = scene.ass.find((a)=> a.aid === assetId)
        if(sceneItem){
            VisibilityComponent.createOrReplace(entity, {
                visible: sceneItem.visComp.visible
            })

            check2DCollision(entity, sceneItem)
            checkPointers(entity, sceneItem)
            checkAudio(entity, sceneItem)
            checkVideo(entity, sceneItem)
        }
    }
}

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
                PointerEvents.deleteFrom(entity)
            }
        }
    }
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
    log('actions are', actions)
    actions.forEach((data:any)=>{
        console.log('action data is ', data)

        let entity:any
        let asset = localPlayer.activeScene?.ass.find((asset:any)=> asset.aid === data.aid)
        if(asset && asset.actComp){
            let action = asset.actComp.actions[data.id]
            console.log('entity action is', action)

            entity = entitiesFromItemIds.get(asset.aid)
            if(entity){
                switch(action.type){
                    case Actions.OPEN_LINK:
                        // log('opening external url')
                        openExternalUrl({url:"" + action.url})
                        break;
        
                    case Actions.PLAY_AUDIO:
                        // log('playing audio')
        
                        if(asset.sty !== "Stream"){
                            AudioSource.getMutable(entity).playing = true
                        }else{
                            AudioStream.getMutable(entity).playing = true
                        }
                        break;
        
                    case Actions.STOP_AUDIO:
                        // log('stopping audio')
        
                        if(asset.sty !== "Stream"){
                            AudioSource.getMutable(entity).playing = false
                        }else{
                            AudioStream.getMutable(entity).playing = false
                        }
                        break;
        
                    case Actions.TOGGLE_VIDEO:
                        VideoPlayer.getMutable(entity).playing = !VideoPlayer.get(entity).playing
                        console.log('video player is', VideoPlayer.get(entity))
                        break;
                }
            }
        }
    })
}

export function check2DCollision(entity:Entity, sceneItem: SceneItem){
    //check 2d collision 
    if(sceneItem.type === "2D"){
        if(sceneItem.colComp.vMask !== 1){
            MeshCollider.deleteFrom(entity)
        }

        if(sceneItem.textComp){
            MeshRenderer.deleteFrom(entity)
        }
    }
}

export function checkPointers(entity:Entity, sceneItem: SceneItem){
    log('checking pointers for play asset', sceneItem)
    if(sceneItem.trigComp && sceneItem.trigComp.triggers.length > 0){
        log('we have play pointers', sceneItem.trigComp.triggers)

        let pointers:any[] = []
        sceneItem.trigComp.triggers.forEach((trigger:any, i:number)=>{
            pointers.push(
                {
                    eventType: PointerEventType.PET_DOWN,
                    eventInfo: {
                        button: trigger.pointer,
                        hoverText: "" + trigger.hoverText,
                        maxDistance: 5
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

        let audio:any
        if(sceneItem.sty !== "Stream"){
            audio = AudioSource.getMutableOrNull(entity)
        }
        else{
            audio = AudioStream.getMutableOrNull(entity)
        }
        
        //check position
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
        }
    }
}

export function checkVideo(entity:Entity, sceneItem: SceneItem){
    if(sceneItem.vidComp && sceneItem.vidComp.autostart){
        let video = VideoPlayer.getMutableOrNull(entity)
        if(video){
            log('setting new video', sceneItem, video)
            video.playing = true
            video.position = 0
            log('setting new video', sceneItem, video)
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
            if(itemData.sty === "Local"){
                AudioSource.getMutable(entity).playing = false
            }else{
                //AudioStream.getMutable(entity).playing = false//
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
    if(sceneItem.trigArComp){
        switch(items.get(sceneItem.id)?.n){
            case 'Trigger Area':
                MeshRenderer.deleteFrom(entity)
                MeshCollider.deleteFrom(entity)
                Material.deleteFrom(entity)
                utils.triggers.enableTrigger(entity, sceneItem.trigArComp.enabled)
                break;
        }
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

export function checkSmartItem(entity:Entity, sceneItem: SceneItem){
    console.log("checking smart item for play mode", sceneItem)
    switch(items.get(sceneItem.id)?.n){
        case 'Trigger Area':
            console.log('need to enable all trigger areas')
            MeshRenderer.deleteFrom(entity)
            MeshCollider.deleteFrom(entity)
            Material.deleteFrom(entity)

            utils.triggers.enableTrigger(entity, sceneItem.trigArComp.enabled)
            break;
    }
}