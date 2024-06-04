import { VisibilityComponent } from "@dcl/sdk/ecs"
import { getEntity } from "./IWB"
import { VisibleLoadedComponent } from "../helpers/Components"

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

export function setVisibilityPlayMode(scene:any, entityInfo:any){
    if (VisibleLoadedComponent.has(entityInfo.entity) && !VisibleLoadedComponent.get(entityInfo.entity).init){
        let visibilityInfo = scene.visibilities.get(entityInfo.aid)
        if(visibilityInfo){
            VisibilityComponent.has(entityInfo.entity) && VisibilityComponent.createOrReplace(entityInfo.entity, {
                visible: visibilityInfo.visible
            })
        }
        VisibleLoadedComponent.getMutable(entityInfo.entity).init = true
    }
}

export function disableVisibilityPlayMode(scene:any, entityInfo:any){
    let itemInfo = scene.visibilities.get(entityInfo.aid)
    if(itemInfo){
        VisibilityComponent.createOrReplace(entityInfo.entity, {
            visible: itemInfo.visible
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