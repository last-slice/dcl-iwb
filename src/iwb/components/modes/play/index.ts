import { ColliderLayer, Entity, InputAction, MeshCollider, MeshRenderer, PointerEventType, PointerEvents, VisibilityComponent, engine } from "@dcl/sdk/ecs";
import { Actions, COLLISION_LAYERS, IWBScene, Triggers } from "../../../helpers/types";
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

            //check 2d collision 
            if(sceneItem.type === "2D"){
                if(sceneItem.colComp.vMask !== 1){
                    MeshCollider.deleteFrom(entity)
                }

                if(sceneItem.textComp){
                    MeshRenderer.deleteFrom(entity)
                }
            }

            //chck add pointers
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