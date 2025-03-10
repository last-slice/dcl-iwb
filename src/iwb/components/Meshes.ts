import { ColliderLayer, GltfContainer, MeshCollider, MeshRenderer, Transform } from "@dcl/sdk/ecs"
import { getEntity } from "./iwb"
// import {  MeshColliderLoadedComponent, MeshRenderLoadedComponent } from "../helpers/Components"
import { COMPONENT_TYPES } from "../helpers/types"

export function checkMeshRenderComponent(scene:any, entityInfo:any){
    let mesh = scene[COMPONENT_TYPES.MESH_RENDER_COMPONENT].get(entityInfo.aid)
    if(mesh && entityInfo.entity){
        switch(mesh.shape){
            case 0:
                MeshRenderer.setPlane(entityInfo.entity)
                break;
            case 1:
                MeshRenderer.setBox(entityInfo.entity)
                break;

            case 2:
                MeshRenderer.setSphere(entityInfo.entity)
                break;
        }
        // MeshRenderLoadedComponent.createOrReplace(entityInfo.entity, {init:false, sceneId:scene.id})
        // console.log('setting mesh renderer for entity', entityInfo.aid)
    }
}

export function checkMeshColliderComponent(scene:any, entityInfo:any){
    let mesh = scene[COMPONENT_TYPES.MESH_COLLIDER_COMPONENT].get(entityInfo.aid)
    // console.log('checking mesh collider component', entityInfo.aid, mesh)
    if(mesh && entityInfo.entity){
        // console.log('setting mesh collider', mesh)
        switch(mesh.shape){
            case 0:
                MeshCollider.setPlane(entityInfo.entity, mesh.layer)
                break;
            case 1:
                MeshCollider.setBox(entityInfo.entity, mesh.layer)
                break;
            case 2:
                MeshCollider.setSphere(entityInfo.entity, mesh.layer)
                break;
            
        }
        // MeshColliderLoadedComponent.createOrReplace(entityInfo.entity, {init:false, sceneId:scene.id})
    }
}

export function meshListener(scene:any){
    scene[COMPONENT_TYPES.MESH_COLLIDER_COMPONENT].onAdd((mesh:any, aid:any)=>{

        let entityInfo = getEntity(scene, aid)
        if(!entityInfo){
            return
        }

        mesh.listen("layer", (c:any, p:any)=>{
            // console.log('mesh collision changed', p, c)
            if(p !== undefined){
                switch(mesh.shape){
                    case 0:
                        MeshCollider.setPlane(entityInfo.entity, c)
                        break;

                    case 1:
                        MeshCollider.setBox(entityInfo.entity, c)
                        break;

                    case 2:
                        MeshCollider.setSphere(entityInfo.entity, c)
                        break;
                }
            }
        })
    })

    scene[COMPONENT_TYPES.MESH_RENDER_COMPONENT].onAdd((mesh:any, aid:any)=>{
        // let iwbInfo = scene[COMPONENT_TYPES.PARENTING_COMPONENT].find(($:any)=> $.aid === aid)
        // if(!iwbInfo.components.includes(COMPONENT_TYPES.MESH_RENDER_COMPONENT)){
        //   iwbInfo.components.push(COMPONENT_TYPES.MESH_RENDER_COMPONENT)
        // }

        let entityInfo = getEntity(scene, aid)
        if(!entityInfo){
            return
        }

        mesh.listen("shape", (c:any, p:any)=>{
            console.log('mesh renderer shape changed', p, c)
            if(p !== undefined){
                switch(mesh.shape){
                    case 0:
                        MeshRenderer.setPlane(entityInfo.entity)
                        break;

                    case 1:
                        MeshRenderer.setBox(entityInfo.entity)
                        break;

                    case 2:
                        MeshRenderer.setSphere(entityInfo.entity)
                        break;
                }
            }
        })
    })
}

export function setMeshRenderBuildMode(scene:any, entityInfo:any){
    checkMeshRenderComponent(scene, entityInfo)
    // MeshRenderLoadedComponent.has(entityInfo.entity) ? MeshRenderLoadedComponent.getMutable(entityInfo.entity).init = true : null
}

export function setMeshRenderPlayMode(scene:any, entityInfo:any){
    let meshInfo = scene[COMPONENT_TYPES.MESH_RENDER_COMPONENT].get(entityInfo.aid)//
    if(meshInfo && entityInfo.entity){
        if(!meshInfo.onPlay){
            MeshRenderer.deleteFrom(entityInfo.entity)
        }
        // MeshRenderLoadedComponent.has(entityInfo.entity) ? MeshRenderLoadedComponent.getMutable(entityInfo.entity).init = true : null
    }
}

export function setMeshColliderBuildMode(scene:any, entityInfo:any){
    let meshInfo = scene[COMPONENT_TYPES.MESH_COLLIDER_COMPONENT].get(entityInfo.aid)
    if(meshInfo){
        checkMeshColliderComponent(scene, entityInfo)
        // MeshRenderLoadedComponent.has(entityInfo.entity) ? MeshRenderLoadedComponent.getMutable(entityInfo.entity).init = true : null
    }
}

export function setMeshColliderPlayMode(scene:any, entityInfo:any){
    let meshInfo = scene[COMPONENT_TYPES.MESH_COLLIDER_COMPONENT].get(entityInfo.aid)
    // console.log('setting mesh collider play mode', entityInfo.aid, meshInfo)
    if(meshInfo && entityInfo.entity){
        if(meshInfo.layer === 0 || !meshInfo.onPlay){
            MeshCollider.deleteFrom(entityInfo.entity)
        }else{
            checkMeshColliderComponent(scene, entityInfo)
        }
        // MeshRenderLoadedComponent.has(entityInfo.entity) ? MeshRenderLoadedComponent.getMutable(entityInfo.entity).init = true : null
    }
}

export function disableMeshRenderPlayMode(scene:any, entityInfo:any){
    let meshInfo = scene[COMPONENT_TYPES.MESH_RENDER_COMPONENT].get(entityInfo.aid)
    if(meshInfo && entityInfo.entity){
        // console.log('disabling mesh renderedr play mode', scene.id, entityInfo.aid)
        if(!meshInfo.onPlay){
            MeshRenderer.deleteFrom(entityInfo.entity)
        }
        // MeshRenderLoadedComponent.has(entityInfo.entity) ? MeshRenderLoadedComponent.getMutable(entityInfo.entity).init = true : null
    }
}

export function disableMeshColliderPlayMode(scene:any, entityInfo:any, disableLevel?:boolean){
    if(disableLevel){
        MeshCollider.deleteFrom(entityInfo.entity)
        return
    }

    let meshInfo = scene[COMPONENT_TYPES.MESH_COLLIDER_COMPONENT].get(entityInfo.aid)
    if(meshInfo && entityInfo.entity){
        if(!meshInfo.onPlay){
            MeshCollider.deleteFrom(entityInfo.entity)
        }
        // MeshRenderLoadedComponent.has(entityInfo.entity) ? MeshRenderLoadedComponent.getMutable(entityInfo.entity).init = true : null
    }
}