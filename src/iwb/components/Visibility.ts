import { VisibilityComponent } from "@dcl/sdk/ecs"
import { getEntity } from "./IWB"

export function addVisibilityComponent(scene:any){
    scene.visibilities.forEach((visibility:any, aid:string)=>{
        let info = scene.parenting.find((entity:any)=> entity.aid === aid)
        if(info.entity){
            VisibilityComponent.create(info.entity, {visible: visibility.visible})
        }
    })
}

export function visibilityListener(scene:any){
    scene.visibilities.onAdd((visibility:any, aid:any)=>{
        visibility.listen("visible", (c:any, p:any)=>{
            console.log('visiblity changed',aid, visibility, p, c)
            if(p !== undefined){
                let info = getEntity(scene, aid)
                if(info){
                    let vis = VisibilityComponent.getMutable(info.entity)
                    vis.visible = c
                }
            }
        })
    })
}

export function getAssetVisibility(scene:any, aid:string){
    let info = scene.parenting.find((entity:any)=> entity.aid === aid)
    if(info.entity){
        return VisibilityComponent.get(info.entity).visible
    }
    return false
}