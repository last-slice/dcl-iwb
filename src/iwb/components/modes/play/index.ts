import { ColliderLayer, Entity, MeshCollider, VisibilityComponent } from "@dcl/sdk/ecs";
import { COLLISION_LAYERS, IWBScene } from "../../../helpers/types";
import { itemIdsFromEntities } from "../../scenes";
import { log } from "../../../helpers/functions";
import { hideAllOtherPointers } from "../build";


export function resetEntityForPlayMode(scene:IWBScene, entity:Entity){
    hideAllOtherPointers()
    
    let assetId = itemIdsFromEntities.get(entity)
    if(assetId){
        log("found asset id")
        let sceneItem = scene.ass.find((a)=> a.aid === assetId)
        if(sceneItem){
            log('found scene item', sceneItem)
            VisibilityComponent.createOrReplace(entity, {
                visible: sceneItem.visComp.visible
            })

            //check 2d collision 
            if(sceneItem.nftComp){
                if(sceneItem.colComp.vMask !== 1){
                    MeshCollider.deleteFrom(entity)
                }
            }
        }
    }
}