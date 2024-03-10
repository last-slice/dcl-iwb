import { log } from "../../../helpers/functions";
import { updateTextComponent } from "../../scenes/components";

export function textComponentListener(asset:any){
    if(asset.textComp){
        asset.textComp.onChange((value:any, key:any)=>{
            console.log('texct comp change', key, value)
            updateTextComponent(asset.aid, asset.matComp, asset.textComp)
        })
    }
}