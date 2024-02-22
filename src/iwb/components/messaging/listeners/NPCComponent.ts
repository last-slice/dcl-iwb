import { log } from "../../../helpers/functions";
import { refreshWearables } from "../../../ui/Panels/edit/NPCComponent";
import { sceneBuilds } from "../../scenes";

export function npcComponentListener(scene:any, asset:any){
    if(asset.npcComp){
        asset.npcComp.wearables.onAdd((action:any, key:any) => {
            refreshWearables()
        });

        asset.npcComp.wearables.onRemove((action:any, key:any) => {
            refreshWearables()
        });
    }
}