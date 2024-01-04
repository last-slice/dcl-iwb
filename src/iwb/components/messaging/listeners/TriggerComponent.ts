import { log } from "../../../helpers/functions";
import { EDIT_MODIFIERS } from "../../../helpers/types";
import { transformObject } from "../../modes/build";


export function triggerComponentListener(asset:any){
    asset.trigComp.listen("enabled", (currentValue:any, previousValue:any) => {
        if(previousValue !== undefined){
            log('need to toggle trigger component for asset', currentValue)
        }
    });
}