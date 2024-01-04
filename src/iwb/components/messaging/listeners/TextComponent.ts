import { log } from "../../../helpers/functions";
import { updateTextComponent } from "../../scenes/components";

export function textComponentListener(asset:any){
    if(asset.textComp){
        asset.textComp.onChange((value:any, key:any)=>{
            updateTextComponent(asset.aid, asset.matComp, asset.textComp)
        })
    }
}