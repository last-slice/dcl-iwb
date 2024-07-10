import { ColliderLayer, GltfContainer, MeshCollider, VisibilityComponent } from "@dcl/sdk/ecs"
import { getEntity } from "./IWB"
import { VisibleLoadedComponent } from "../helpers/Components"
import { COMPONENT_TYPES, SCENE_MODES } from "../helpers/types"
import { playerMode } from "./Config"

export function addVisibilityComponent(scene:any){
    scene[COMPONENT_TYPES.VISBILITY_COMPONENT].forEach((visibility:any, aid:string)=>{
        let info = scene[COMPONENT_TYPES.PARENTING_COMPONENT].find((entity:any)=> entity.aid === aid)
        if(info.entity){
            VisibilityComponent.create(info.entity, {visible: visibility.visible})
        }
    })
}

export function visibilityListener(scene:any){
    scene[COMPONENT_TYPES.VISBILITY_COMPONENT].onAdd((visibility:any, aid:any)=>{
        // let iwbInfo = scene[COMPONENT_TYPES.PARENTING_COMPONENT].find(($:any)=> $.aid === aid)
        // if(!iwbInfo.components.includes(COMPONENT_TYPES.VISBILITY_COMPONENT)){
        //   iwbInfo.components.push(COMPONENT_TYPES.VISBILITY_COMPONENT)
        // }

        let entityInfo = getEntity(scene, aid)
        if(!entityInfo){
            return
        }

        visibility.listen("visible", (c:any, p:any)=>{
            if(p !== undefined){
                let info = getEntity(scene, aid)
                if(info && playerMode === SCENE_MODES.PLAYMODE){
                    let vis = VisibilityComponent.getMutable(info.entity)
                    vis.visible = c
                }
            }
        })
    })
}

export function updateAssetBuildVisibility(scene:any, visibility:boolean, entityInfo:any, updatingChild?:boolean){
    VisibilityComponent.createOrReplace(entityInfo.entity, {visible: visibility})

    let meshCollider = scene[COMPONENT_TYPES.MESH_COLLIDER_COMPONENT].get(entityInfo.aid)
    if(meshCollider){
      MeshCollider.setBox(entityInfo.entity, ColliderLayer.CL_POINTER)
    }

    let gltfInfo = scene[COMPONENT_TYPES.GLTF_COMPONENT].get(entityInfo.aid)
    if(gltfInfo){
        let gltf = GltfContainer.getMutableOrNull(entityInfo.entity)
        if(gltf){
            gltf.invisibleMeshesCollisionMask = !visibility ? ColliderLayer.CL_NONE : gltfInfo.invisibleCollision
            gltf.visibleMeshesCollisionMask = !visibility ? ColliderLayer.CL_NONE : gltfInfo.visibleCollision
        }
    }

    if(updatingChild){}
    else{
        updateChildrenVisibility(scene, visibility, entityInfo)
    }
}

export function updateChildrenVisibility(scene:any, visibility:boolean, entityInfo:any){
    let parentItem = scene[COMPONENT_TYPES.PARENTING_COMPONENT].find(($:any)=> $.aid === entityInfo.aid)
    if(parentItem && parentItem.children.length > 0){
        parentItem.children.forEach((aid:any)=>{
            let childEntityInfo = getEntity(scene, aid)
            let visibilityInfo = scene[COMPONENT_TYPES.VISBILITY_COMPONENT].get(childEntityInfo.aid)
            if(visibilityInfo){
                visibilityInfo.visible = visibility
            }
            updateAssetBuildVisibility(scene, visibility, childEntityInfo, true)
        })
    }
}

export function setVisibilityBuildMode(scene:any, entityInfo:any){
    let itemInfo = scene[COMPONENT_TYPES.IWB_COMPONENT].get(entityInfo.aid)
    if(itemInfo){
        updateAssetBuildVisibility(scene, itemInfo.buildVis, entityInfo)
    }
}

export function setVisibilityPlayMode(scene:any, entityInfo:any){
    if (VisibleLoadedComponent.has(entityInfo.entity) && !VisibleLoadedComponent.get(entityInfo.entity).init){
        let visibilityInfo = scene[COMPONENT_TYPES.VISBILITY_COMPONENT].get(entityInfo.aid)
        if(visibilityInfo){
            VisibilityComponent.has(entityInfo.entity) && VisibilityComponent.createOrReplace(entityInfo.entity, {
                visible: visibilityInfo.visible
            })
        }
        VisibleLoadedComponent.getMutable(entityInfo.entity).init = true
    }
}

export function disableVisibilityPlayMode(scene:any, entityInfo:any){
    let itemInfo = scene[COMPONENT_TYPES.VISBILITY_COMPONENT].get(entityInfo.aid)
    if(itemInfo){
        VisibilityComponent.createOrReplace(entityInfo.entity, {
            visible: itemInfo.visible
        })
    }
}

export function getAssetVisibility(scene:any, aid:string){
    let itemInfo = scene[COMPONENT_TYPES.VISBILITY_COMPONENT].get(aid)
    if(itemInfo){
        return itemInfo.visible
    }
    return false
}