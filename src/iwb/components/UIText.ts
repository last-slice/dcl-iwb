import { COMPONENT_TYPES } from "../helpers/types";
import { getEntity } from "./IWB";
import { CustomUIText } from "../../ui_components/UISpriteText";

export let UiTexts:Map<string, CustomUIText> = new Map()

export function checkUIText(scene:any, entityInfo:any){
    let uiTextInfo = scene[COMPONENT_TYPES.UI_TEXT_COMPONENT].get(entityInfo.aid)
    if(uiTextInfo){
        UiTexts.set(entityInfo.aid, new CustomUIText(8,8, uiTextInfo.size, 'center', "assets/" + uiTextInfo.src + ".png"))
    }
}

export function uiTextListener(scene:any){
    scene[COMPONENT_TYPES.UI_TEXT_COMPONENT].onAdd((uiText:any, aid:any)=>{
        let info = getEntity(scene, aid)
        if(!info){
            return
        }

        // uiText.listen("text", (c:any, p:any)=>{
        // })//
    })
}