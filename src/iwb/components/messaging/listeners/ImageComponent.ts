import { log } from "../../../helpers/functions";
import { updateImageUrl } from "../../scenes/components";


export function imageComponentListener(asset:any){
    if(asset.imgComp){
        asset.imgComp.listen("url", (currentValue:any, previousValue:any) => {
            updateImageUrl(asset.aid, asset.matComp, currentValue)
        });
    }
}