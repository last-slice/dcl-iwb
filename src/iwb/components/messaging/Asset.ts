import { log } from "../../helpers/functions";
import { items } from "../catalog";
import { addEditSelectionPointer, editAssets, removeEditSelectionPointer, removeItem, removeSelectionPointer } from "../modes/build";
import { localUserId } from "../player/player";
import { loadSceneAsset, updateAsset } from "../scenes";
import { actionComponentListener } from "./listeners/ActionComponent";
import { collisionComponentListener } from "./listeners/CollisionComponent";
import { imageComponentListener } from "./listeners/ImageComponent";
import { nftComponentListener } from "./listeners/NFTComponent";
import { textComponentListener } from "./listeners/TextComponent";
import { transformComponentListener } from "./listeners/TransformComponent";
import { triggerComponentListener } from "./listeners/TriggerComponent";
import { videoComponentListener } from "./listeners/VideoComponent";

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

        imageComponentListener(asset)
        videoComponentListener(asset)
        collisionComponentListener(scene,asset)
        nftComponentListener(asset)
        textComponentListener(asset)
        transformComponentListener(scene, asset)
        triggerComponentListener(asset)
        actionComponentListener(scene, asset)
    })

    scene.ass.onRemove((asset:any, key:any)=>{
        log("scene asset remove", key, asset)
        removeItem(scene.id, asset)
    })
}