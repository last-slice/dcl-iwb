import { Billboard, BillboardMode, ColliderLayer, Entity, MeshCollider, PBTextShape, TextAlignMode, TextShape, VisibilityComponent } from "@dcl/sdk/ecs"
import { getEntity } from "./IWB"
import { Color4 } from "@dcl/sdk/math"
import { fontStyles } from "../ui/Objects/Edit/EditText"

function addTextShape(entity:Entity, textShape:any){
    TextShape.createOrReplace(entity, 
        {
            text: textShape.text,
            font: textShape.font,
            fontSize: textShape.fontSize,
            fontAutoSize: textShape.fontAutoSize,
            // textAlign: textShape.textAlign,//
            paddingTop: textShape.paddingTop,
            paddingBottom: textShape.paddingBottom,
            paddingLeft: textShape.paddingLeft,
            paddingRight: textShape.paddingRight,
            lineSpacing: textShape.lineSpacing,
            outlineColor: Color4.create(textShape.outlineColor.r, textShape.outlineColor.g, textShape.outlineColor.b, textShape.outlineColor.a),
            textColor: Color4.create(textShape.color.r, textShape.color.g, textShape.color.b, textShape.color.a),
        })
    MeshCollider.setPlane(entity, ColliderLayer.CL_POINTER)

    if(textShape.billboard){
        Billboard.create(entity, {billboardMode: BillboardMode.BM_Y})
    }
}

export function checkTextShapeComponent(scene:any, entityInfo:any){
    let itemInfo = scene.textShapes.get(entityInfo.aid)
    if(itemInfo){
        addTextShape(entityInfo.entity, itemInfo)
    }
}

export function textShapeListener(scene:any){
    scene.textShapes.onAdd((textShape:any, aid:any)=>{
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