import { Billboard, BillboardMode, ColliderLayer, Entity, MeshCollider, PBTextShape, TextAlignMode, TextShape, VisibilityComponent } from "@dcl/sdk/ecs"
import { getEntity } from "./IWB"
import { Color4 } from "@dcl/sdk/math"
import { COMPONENT_TYPES } from "../helpers/types"

function addTextShape(entity:Entity, textShape:any){
    TextShape.createOrReplace(entity, 
        {
            text: textShape.text,
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
        addTextShape(entityInfo.entity, itemInfo)
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
        addTextShape(entityInfo.entity, textInfo)
    }
}

export function setTextShapeForPlayMode(scene:any, entityInfo:any){
    let meshInfo = scene[COMPONENT_TYPES.TEXT_COMPONENT].get(entityInfo.aid)
    if(meshInfo && meshInfo.hasOwnProperty("onPlay")){
        if(!meshInfo.onPlay){
            TextShape.deleteFrom(entityInfo.entity)
        }
    }
}

export function textShapeListener(scene:any){
    scene[COMPONENT_TYPES.TEXT_COMPONENT].onAdd((textShape:any, aid:any)=>{
        // let iwbInfo = scene[COMPONENT_TYPES.PARENTING_COMPONENT].find(($:any)=> $.aid === aid)
        // if(!iwbInfo.components.includes(COMPONENT_TYPES.TEXT_COMPONENT)){
        //   iwbInfo.components.push(COMPONENT_TYPES.TEXT_COMPONENT)
        // }

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

        textShape.listen("color", (c:any, p:any)=>{
            if(p !== undefined){
                let text = TextShape.getMutable(info.entity)
                if(text){
                    text.textColor = Color4.create(textShape.color.r, textShape.color.g, textShape.color.b, textShape.color.a)
                }
            }
        })
    })
}