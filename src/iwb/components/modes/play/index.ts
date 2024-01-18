import { AudioSource, AudioStream, ColliderLayer, Entity, InputAction, MeshCollider, MeshRenderer, PointerEventType, PointerEvents, TextShape, Transform, VideoPlayer, VisibilityComponent, engine } from "@dcl/sdk/ecs";
import { Actions, COLLISION_LAYERS, IWBScene, SceneItem, Triggers } from "../../../helpers/types";
import { itemIdsFromEntities, sceneBuilds } from "../../scenes";
import { getRandomIntInclusive, log } from "../../../helpers/functions";
import { movePlayerTo, openExternalUrl } from "~system/RestrictedActions";
import { items } from "../../catalog";
import { displaySettingsPanel } from "../../../ui/Panels/settings/settingsIndex";

export function resetEntityForPlayMode(scene:IWBScene, entity:Entity){
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
            }
        }
    }
}

export function findTriggerActionForEntity(entity:Entity, type:Triggers){
    sceneBuilds.forEach((scene,key)=>{
        let ent = scene.entities.find((e:any)=>e === entity)
        if(ent){
            try{
                let assetId = itemIdsFromEntities.get(entity)
                if(assetId){
                    let sceneItem = scene.ass.find((a:any)=> a.aid === assetId)
                    if(sceneItem){
                        log('found an asset with a trigger component', sceneItem, type)
                        let triggers = sceneItem.trigComp.triggers.filter((trig:any)=> trig.type === type)
                        log('found triggers', triggers)
                        triggers.forEach((trigger:any)=>{
                            runTrigger(trigger.actions)
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

export function runTrigger(actions:any){
    log('actions are', actions)
    actions.forEach((action:any, key:string)=>{
        switch(action.type){
            case Actions.OPEN_LINK:
                log('opening external url', action)
                openExternalUrl({url:"" + action.url})
                break;
        }
    })

    // for(let key in actions){
    //     let action = actions[key]
    //     switch(action.type){
    //         case Actions.OPEN_LINK:
    //             log('opening external url')
    //             openExternalUrl({url:"" + action.url})
    //             break;
    //     }
    // }
}

function check2DCollision(entity:Entity, sceneItem: SceneItem){
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

function checkPointers(entity:Entity, sceneItem: SceneItem){
    if(sceneItem.trigComp && sceneItem.trigComp.triggers.length > 0){
        PointerEvents.createOrReplace(entity,{
            pointerEvents:[
                {
                    eventType: PointerEventType.PET_DOWN,
                    eventInfo: {
                        button: InputAction.IA_POINTER,
                        hoverText: "" + "Click Here",
                        maxDistance: 5
                    }
                }
            ]
        })
    }
}

export function checkAudio(entity:Entity, sceneItem: SceneItem){
    if(sceneItem.audComp){
        log('checking audio component for play mode')

        let audio = AudioSource.getMutableOrNull(entity)

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