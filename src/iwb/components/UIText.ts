import { COMPONENT_TYPES } from "../helpers/types";
import { getEntity } from "./IWB";
import { CustomUIText } from "../../ui_components/UISpriteText";
import { States } from "./States";
import { Numbers } from "./Counter";

export let UiTexts:Map<string, CustomUIText> = new Map()

export function checkUIText(scene:any, entityInfo:any){
    let uiTextInfo = scene[COMPONENT_TYPES.UI_TEXT_COMPONENT].get(entityInfo.aid)
    if(uiTextInfo){
        UiTexts.set(entityInfo.aid, new CustomUIText(8,8, uiTextInfo, 'center', "assets/" + uiTextInfo.src + ".png"))
        uiDataUpdate(scene, entityInfo)
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

export function setUiTextBuildMode(scene:any, entityInfo:any){
    let uiTextInfo = scene[COMPONENT_TYPES.UI_TEXT_COMPONENT].get(entityInfo.aid)
    if(uiTextInfo){
        let uiText = UiTexts.get(entityInfo.aid)
        if(uiText){
            uiText.setText(uiText.currentText, " ")
            uiText.hide()
        }
    }
}

export function disableUiTextPlayMode(scene:any, entityInfo:any){
    let uiTextInfo = scene[COMPONENT_TYPES.UI_TEXT_COMPONENT].get(entityInfo.aid)
    if(uiTextInfo){
        let uiText = UiTexts.get(entityInfo.aid)
        if(uiText){
            uiText.setText(uiText.currentText, " ")
            uiText.hide()
        }
    }
}
export function setUiTextPlayMode(scene:any, entityInfo:any){
    console.log('setting ui text play mode')
    let uiTextInfo = scene[COMPONENT_TYPES.UI_TEXT_COMPONENT].get(entityInfo.aid)
    if(uiTextInfo){
        let uiTextComponent = UiTexts.get(entityInfo.aid)
        if(uiTextComponent){
            let textData:string = " "
            uiTextComponent.currentText = uiTextInfo.label

            if(uiTextInfo.type > 0){
                console.log('ui type is data', uiTextComponent)
                let uiDataEntity = getEntity(scene, uiTextInfo.aid)
                console.log('uidata entity is', uiDataEntity)
                if(uiDataEntity){
                    console.log('we have ui data', uiTextInfo.type)
                    switch(uiTextInfo.type){
                        case 0://nothing
                            break;
                        case 1://state
                            if(States.has(uiDataEntity.entity)){
                                let state = States.get(uiDataEntity.entity)
                                textData += "" + state.currentValue
                            }
                            break;
                
                        case 2://counter//
                            if(Numbers.has(uiDataEntity.entity)){
                                let counter = Numbers.get(uiDataEntity.entity)
                                textData += "" + counter.currentValue
                            }
                            break;
                
                        default:
                            break;
                    }
                }
            }
            uiTextComponent.setText(uiTextComponent.currentText, textData)
        }
    }
}

export function uiDataUpdate(scene:any, entityInfo:any){
    console.log('ui update')
    // setUiTextPlayMode(scene, entityInfo)
    scene[COMPONENT_TYPES.PARENTING_COMPONENT].forEach((sceneEntity:any)=>{
        if(!["0", "1","2"].includes(entityInfo.aid)){
            let uiTextInfo = scene[COMPONENT_TYPES.UI_TEXT_COMPONENT].get(sceneEntity.aid)
            if(uiTextInfo){
                let uiTextComponent = UiTexts.get(sceneEntity.aid)

                if(uiTextComponent && uiTextInfo.aid === entityInfo.aid){
                    let textData:string = " "
                    switch(uiTextComponent.type){
                        case 0://nothing//
                            break;
                        case 1://state
                            if(States.has(entityInfo.entity)){
                                let state = States.get(entityInfo.entity)
                            textData += "" + state.currentValue
                            }
                            
                            break;
                
                        case 2://counter
                            if(Numbers.has(entityInfo.entity)){
                                let counter = Numbers.get(entityInfo.entity)
                                textData += "" + counter.currentValue
                            }
 
                            break;
                
                        default:
                            break;
                    }
                    uiTextComponent.setText(uiTextComponent.currentText, textData)
                }
            }
        }
    })
}