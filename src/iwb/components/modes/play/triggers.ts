import { Entity, InputAction } from "@dcl/sdk/ecs"
import { log } from "../../../helpers/functions"
import { IWBScene, SceneItem, Triggers } from "../../../helpers/types"
import { localPlayer } from "../../player/player"
import { sceneBuilds, itemIdsFromEntities, entitiesFromItemIds } from "../../scenes"
import { handleTriggerAction } from "./actions"
import { utils } from "../../../helpers/libraries"


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
                            //check trigger conditions
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

export function findEntitiesWithTrigger(sceneId:string, trigger:Triggers){
    log('finding entities with trigger action', sceneId, trigger)
    let scene = sceneBuilds.get(sceneId)
    if(scene){
        console.log('found scene, now need to find triggers')
        try{
            let assets:any[] = scene.ass.filter((asset:any)=> asset.trigComp && asset.trigComp.enabled && asset.trigComp.triggers.findIndex((et:any) => et.type === trigger) >= 0)
            // console.log('assets are ', assets)
            assets.forEach((asset:any)=>{
                let triggers = asset.trigComp.triggers
                // console.log('triggers are')
                triggers.forEach((trigger:any)=>{
                    console.log('trigger is', trigger)
                    runTrigger(asset.aid, trigger.actions)
                })
            })
        }
        catch(e){
            console.log('error adding entity trigger', e)
        }
    }
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
