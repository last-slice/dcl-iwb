import { log } from "../../../helpers/functions";

export function visibilityComponentListener(asset:any){
    if(asset.visComp){
        asset.visComp.listen("visible", (currentValue:any, previousValue:any) => {
            log("asset visibility changed", previousValue, currentValue)
        });
    }

}