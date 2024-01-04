import { log } from "../../../helpers/functions";
import { COLLISION_LAYERS } from "../../../helpers/types";
import { updateCollision } from "../../scenes/components";


export function collisionComponentListener(scene:any, asset:any){
    if(asset.colComp){
        asset.colComp.listen("iMask", (currentValue:any, previousValue:any) => {
            log("invisible collision mask changed", previousValue, currentValue)
            updateCollision(scene.id, asset.aid, COLLISION_LAYERS.INVISIBLE, currentValue)
        });

        asset.colComp.listen("vMask", (currentValue:any, previousValue:any) => {
            log("visible collision mask changed", previousValue, currentValue)
            updateCollision(scene.id, asset.aid, COLLISION_LAYERS.VISIBLE, currentValue)
        });
    }
}