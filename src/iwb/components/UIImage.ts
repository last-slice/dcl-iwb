import { COMPONENT_TYPES } from "../helpers/types";
import { getEntity } from "./iwb";
import { UIImage } from "../ui/Objects/UIImage";

export let UiImages:Map<string, UIImage> = new Map()

export function checkUIImage(scene:any, entityInfo:any){
    let itemInfo = scene[COMPONENT_TYPES.UI_IMAGE_COMPONENT].get(entityInfo.aid)
    if(itemInfo){
        UiImages.set(entityInfo.aid, new UIImage(entityInfo.aid, itemInfo))
        uiImageDataUpdate(scene, entityInfo)
    }
}

export function uiImageListener(scene:any){
    scene[COMPONENT_TYPES.UI_IMAGE_COMPONENT].onAdd((uiImage:any, aid:any)=>{
        let info = getEntity(scene, aid)
        if(!info){
            return
        }

        // uiImage.listen("text", (c:any, p:any)=>{
        // })//
    })
}

export function setUiImageBuildMode(scene:any, entityInfo:any){
    let itemInfo = scene[COMPONENT_TYPES.UI_IMAGE_COMPONENT].get(entityInfo.aid)
    if(itemInfo){
        let uiImage = UiImages.get(entityInfo.aid)
        if(uiImage){
            uiImage.hide()
        }
    }
}

export function disableUiImagePlayMode(scene:any, entityInfo:any){
    setUiImageBuildMode(scene, entityInfo)
}
export function setUiImagePlayMode(scene:any, entityInfo:any){
    // let itemInfo = scene[COMPONENT_TYPES.UI_IMAGE_COMPONENT].get(entityInfo.aid)
    // if(itemInfo){
    //     let uiImageComponent = UiImages.get(entityInfo.aid)
    //     if(uiImageComponent){
    //     }
    // }
}

export function uiImageDataUpdate(scene:any, entityInfo:any){
    // console.log('ui update')
    // setUiTextPlayMode(scene, entityInfo)
    // scene[COMPONENT_TYPES.PARENTING_COMPONENT].forEach((sceneEntity:any)=>{
    //     if(!["0", "1","2"].includes(entityInfo.aid)){
    //         let uiTextInfo = scene[COMPONENT_TYPES.UI_IMAGE_COMPONENT].get(sceneEntity.aid)
    //         if(uiTextInfo){
    //             let uiTextComponent = UiTexts.get(sceneEntity.aid)

    //             if(uiTextComponent && uiTextInfo.aid === entityInfo.aid){
    //                 let textData:string = " "
    //                 switch(uiTextComponent.type){
    //                     case 0://nothing//
    //                         break;
    //                     case 1://state
    //                         if(States.has(entityInfo.entity)){
    //                             let state = States.get(entityInfo.entity)
    //                         textData += "" + state.currentValue
    //                         }
                            
    //                         break;
                
    //                     case 2://counter
    //                         if(Numbers.has(entityInfo.entity)){
    //                             let counter = Numbers.get(entityInfo.entity)
    //                             textData += "" + counter.currentValue
    //                         }
 
    //                         break;
                
    //                     default:
    //                         break;
    //                 }
    //                 uiTextComponent.setText(uiTextComponent.currentText, textData)
    //             }
    //         }
    //     }
    // })
}