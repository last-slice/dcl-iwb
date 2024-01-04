import { log } from "../../../helpers/functions";
import { updateTextComponent } from "../../scenes/components";

export function textComponentListener(asset:any){
    if(asset.textComp){

        asset.textComp.onChange((value:any, key:any)=>{
            updateTextComponent(asset.aid, asset.matComp, asset.textComp)
        })
    //     asset.textComp.listen("text", (currentValue:any, previousValue:any) => {
    //         updateTextComponent(asset.aid, asset.matComp, asset.textComp)
    //     });

    //     asset.textComp.listen("font", (currentValue:any, previousValue:any) => {
    //         updateTextComponent(asset.aid, asset.matComp, asset.textComp)
    //     });

    //     asset.textComp.listen("fontSize", (currentValue:any, previousValue:any) => {
    //         updateTextComponent(asset.aid, asset.matComp, asset.textComp)
    //     });

    //     asset.textComp.listen("color", (currentValue:any, previousValue:any) => {
    //         updateTextComponent(asset.aid, asset.matComp, asset.textComp)
    //     });
    }
}