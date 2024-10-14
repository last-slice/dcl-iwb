import { Billboard, BillboardMode, ColliderLayer, Entity, MeshCollider, PBTextShape, TextAlignMode, TextShape, VisibilityComponent } from "@dcl/sdk/ecs"
import { getEntity } from "./iwb"
import { Color4 } from "@dcl/sdk/math"
import { COMPONENT_TYPES } from "../helpers/types"

function addTextShape(scene:any, entityInfo:any, textShape:any){
    TextShape.createOrReplace(entityInfo.entity, 
        {
            text: textShape.isText ? textShape.text : scene[COMPONENT_TYPES.NAMES_COMPONENT].get(entityInfo.aid).value,
            font: textShape.font,
            fontSize: textShape.fontSize,
            fontAutoSize: textShape.fontAutoSize,
            // textAlign: textShape.textAlign,
            paddingTop: textShape.paddingTop,
            paddingBottom: textShape.paddingBottom,
            paddingLeft: textShape.paddingLeft,
            paddingRight: textShape.paddingRight,
            lineSpacing: textShape.lineSpacing,
            outlineColor: Color4.create(textShape.outlineColor.r, textShape.outlineColor.g, textShape.outlineColor.b, textShape.outlineColor.a),
            textColor: Color4.create(textShape.color.r, textShape.color.g, textShape.color.b, textShape.color.a),
        })
}

export function updateTextComponent(scene:any, entityInfo:any, newText:string){
    let itemInfo = scene[COMPONENT_TYPES.TEXT_COMPONENT].get(entityInfo.aid)        
    if(itemInfo){
        let textShape = TextShape.getMutable(entityInfo.entity)
        textShape.text = newText
    }
}


export function checkTextShapeComponent(scene:any, entityInfo:any){
    let itemInfo = scene[COMPONENT_TYPES.TEXT_COMPONENT].get(entityInfo.aid)
    if(itemInfo && itemInfo.onPlay){
        addTextShape(scene, entityInfo, itemInfo)
    }
}

export function disableTextShapePlayMode(scene:any, entityInfo:any){
    let itemInfo = scene[COMPONENT_TYPES.TEXT_COMPONENT].get(entityInfo.aid)
    if(itemInfo){
        if(!itemInfo.onPlay){
            TextShape.deleteFrom(entityInfo.entity)
        }
    }
}

export function setTextShapeForBuildMode(scene:any, entityInfo:any){
    let textInfo = scene[COMPONENT_TYPES.TEXT_COMPONENT].get(entityInfo.aid)
    if(textInfo){
        addTextShape(scene, entityInfo, textInfo)
    }
}

export function setTextShapeForPlayMode(scene:any, entityInfo:any){
    let meshInfo = scene[COMPONENT_TYPES.TEXT_COMPONENT].get(entityInfo.aid)
    if(meshInfo && meshInfo.hasOwnProperty("onPlay")){
        if(!meshInfo.onPlay){
            TextShape.deleteFrom(entityInfo.entity)
        }else{
            let textShape = TextShape.getMutableOrNull(entityInfo.entity)
            if(!textShape){
                return
            }
            textShape.text = meshInfo.isText ? meshInfo.text : scene[COMPONENT_TYPES.NAMES_COMPONENT].get(entityInfo.aid).value
        }
    }
}

export function textShapeListener(scene:any){
    scene[COMPONENT_TYPES.TEXT_COMPONENT].onAdd((textShape:any, aid:any)=>{
        let info = getEntity(scene, aid)
        if(!info){
            return
        }

        textShape.listen("text", (c:any, p:any)=>{
            if(p !== undefined){
                let text = TextShape.getMutable(info.entity)
                if(text){
                    text.text = c
                }
            }
        })

        textShape.listen("font", (c:any, p:any)=>{
            if(p !== undefined){
                let text = TextShape.getMutable(info.entity)
                if(text){
                    // text.font = fontStyles[c]
                }
            }
        })

        textShape.listen("fontSize", (c:any, p:any)=>{
            if(p !== undefined){
                let text = TextShape.getMutable(info.entity)
                if(text){
                    text.fontSize = c
                }
            }
        })

        textShape.listen("textAlign", (c:any, p:any)=>{
            if(p !== undefined){
                let text = TextShape.getMutable(info.entity)
                if(text){
                    text.textAlign = c
                }
            }
        })

        textShape.color.listen("r", (c:any, p:any)=>{
            addTextShape(scene, info, textShape)
        })
        textShape.color.listen("g", (c:any, p:any)=>{
            addTextShape(scene, info, textShape)
        })
        textShape.color.listen("b", (c:any, p:any)=>{
            addTextShape(scene, info, textShape)
        })
        textShape.color.listen("a", (c:any, p:any)=>{
            addTextShape(scene, info, textShape)
        })
    })
}