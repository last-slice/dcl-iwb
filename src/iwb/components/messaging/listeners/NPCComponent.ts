import { log } from "../../../helpers/functions";
import { refreshWearables, updateNPC } from "../../../ui/Panels/edit/NPCComponent";
import { sceneBuilds } from "../../scenes";

export function npcComponentListener(scene:any, asset:any){
    if(asset.npcComp){
        asset.npcComp.wearables.onAdd((action:any, key:any) => {
            refreshWearables()
            updateNPC(scene, asset.aid)
        });

        asset.npcComp.wearables.onRemove((action:any, key:any) => {
            refreshWearables()
            updateNPC(scene, asset.aid)
        });

        asset.npcComp.listen("change", (currentValue:any, previousValue:any) => {
            if(previousValue !== undefined){
                updateNPC(scene, asset.aid)
            }
        });

    }
}