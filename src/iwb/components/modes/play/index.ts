import { AudioSource, ColliderLayer, Entity, InputAction, MeshCollider, MeshRenderer, PointerEventType, PointerEvents, TextShape, Transform, VisibilityComponent, engine } from "@dcl/sdk/ecs";
import { Actions, COLLISION_LAYERS, IWBScene, SceneItem, Triggers } from "../../../helpers/types";
import { itemIdsFromEntities, sceneBuilds } from "../../scenes";
import { log } from "../../../helpers/functions";
import { openExternalUrl } from "~system/RestrictedActions";

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

function checkAudio(entity:Entity, sceneItem: SceneItem){
    if(sceneItem.audComp){
        MeshRenderer.deleteFrom(entity)
        MeshCollider.deleteFrom(entity)
        TextShape.deleteFrom(entity)

        let audio = AudioSource.getMutable(entity)

        //check position
        if(sceneItem.audComp.attachedPlayer){
            Transform.createOrReplace(entity, {parent:engine.PlayerEntity})
        }

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