import { Entity, PBTextShape, TextShape, VisibilityComponent } from "@dcl/sdk/ecs"
import { getEntity } from "./IWB"
import { Color4 } from "@dcl/sdk/math"

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
            outlineColor: Color4.create(textShape.outlineColor[0],textShape.outlineColor[1],textShape.outlineColor[2]),
            textColor: Color4.create(textShape.textColor[0],textShape.textColor[1],textShape.textColor[2], textShape.textColor[3]),
        })
}

export function addTextShapeComponent(scene:any){
    scene.textShapes.forEach((textShape:any, aid:string)=>{
        let info = scene.parenting.find((entity:any)=> entity.aid === aid)
        if(info.entity){
            addTextShape(info.entity, textShape)
        }
    })
}

export function textShapeListener(scene:any){
    scene.textShapes.onAdd((textShape:any, aid:any)=>{
        let info = getEntity(scene, aid)
        if(!info){
            return
        }

        textShape.listen("text", (c:any, p:any)=>{
            if(p !== undefined){
                addTextShape(info.entity, textShape)
            }
        })
    })
}