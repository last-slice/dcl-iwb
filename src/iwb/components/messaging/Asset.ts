import { log } from "../../helpers/functions";
import { items } from "../catalog";
import { addEditSelectionPointer, confirmGrabItem, editAssets, removeEditSelectionPointer, removeItem, removeSelectionPointer } from "../modes/build";
import { localPlayer, localUserId } from "../player/player";
import { entitiesFromItemIds, loadSceneAsset, updateAsset } from "../scenes";
import { actionComponentListener } from "./listeners/ActionComponent";
import { collisionComponentListener } from "./listeners/CollisionComponent";
import { imageComponentListener } from "./listeners/ImageComponent";
import { nftComponentListener } from "./listeners/NFTComponent";
import { textComponentListener } from "./listeners/TextComponent";
import { transformComponentListener } from "./listeners/TransformComponent";
import { triggerComponentListener } from "./listeners/TriggerComponent";
import { videoComponentListener } from "./listeners/VideoComponent";
import {audioComponentListener} from "./listeners/AudioComponent";
import { materialComponentListener } from "./listeners/MaterialComponent";
import { utils } from "../../helpers/libraries";
import { SCENE_MODES } from "../../helpers/types";
import { VisibilityComponent } from "@dcl/sdk/ecs";
import { npcComponentListener } from "./listeners/NPCComponent";

export function assetListener(scene:any){
    scene.ass.onAdd((asset:any, key:any)=>{
        loadSceneAsset(scene.id, asset)

        //editing asset
        asset.listen("editing", (currentValue:any, previousValue:any) => {
            if(previousValue !== undefined){
                if(currentValue){
                    if(asset.editor !== localUserId){
                        log('someoen else is editing asset', asset)
                        let itemData = items.get(asset.id)
                        if(itemData){
                            log('item data', itemData)
                            itemData.bb ? addEditSelectionPointer(asset.aid, itemData) : null
                        }
                    }
                }else{
                    removeEditSelectionPointer(asset.aid)
                }      
            }

            if(previousValue !== undefined && previousValue && !currentValue){
                log('done editing asset', asset)
                updateAsset(asset)
            }
        });

        asset.listen("buildVis", (currentValue:any, previousValue:any) => {
            if(previousValue !== undefined){
                if(localPlayer.mode === SCENE_MODES.BUILD_MODE){
                    let entity = entitiesFromItemIds.get(asset.aid)
                    if(entity){
                        VisibilityComponent.createOrReplace(entity, {
                            visible:  currentValue
                        })
                    }
                }   
            }
        });

        imageComponentListener(asset)
        videoComponentListener(asset)
        audioComponentListener(asset)
        collisionComponentListener(scene,asset)
        nftComponentListener(asset)
        textComponentListener(asset)
        transformComponentListener(scene, asset)
        triggerComponentListener(asset)
        actionComponentListener(scene, asset)
        materialComponentListener(scene, asset)
        npcComponentListener(scene, asset)
    })

    scene.ass.onRemove(async (asset:any, key:any)=>{
        log("scene asset remove", key, asset)
        if(asset.editing && asset.editor === localUserId){
            await confirmGrabItem(asset)
        }
        removeItem(scene.id, asset)
    })
}