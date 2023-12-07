import { Entity, VisibilityComponent } from "@dcl/sdk/ecs";
import { IWBScene } from "../../../helpers/types";
import { itemIdsFromEntities } from "../../scenes";
import { log } from "../../../helpers/functions";


export function resetEntityForPlayMode(scene:IWBScene, entity:Entity){
    let assetId = itemIdsFromEntities.get(entity)
    if(assetId){
        log("found asset id")
        let sceneItem = scene.ass.find((a)=> a.aid === assetId)
        if(sceneItem){
            log('found scene item', sceneItem)
            VisibilityComponent.createOrReplace(entity, {
                visible: sceneItem.visComp.visible
            })
        }
    }
}