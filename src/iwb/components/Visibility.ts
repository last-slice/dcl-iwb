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

export function setVisibilityBuildMode(scene:any, entityInfo:any){
    let itemInfo = scene.visibilities.get(entityInfo.aid)
    if(itemInfo){
        VisibilityComponent.createOrReplace(entityInfo.entity, {
            visible: itemInfo.buildVis
        })
    }
}

export function getAssetVisibility(scene:any, aid:string){
    let itemInfo = scene.visibilities.get(aid)
    if(itemInfo){
        return itemInfo.visible
    }
    return false
}