import { ColliderLayer, GltfContainer, MeshCollider, MeshRenderer, Transform } from "@dcl/sdk/ecs"
import { getEntity } from "./IWB"
import {  MeshColliderLoadedComponent, MeshRenderLoadedComponent } from "../helpers/Components"

export function checkMeshRenderComponent(scene:any, entityInfo:any){
    let mesh = scene.meshRenders.get(entityInfo.aid)
    if(mesh){
        switch(mesh.shape){
            case 0:
                MeshRenderer.setPlane(entityInfo.entity)
                break;
            case 1:
                MeshRenderer.setBox(entityInfo.entity)
                break;
        }
        MeshRenderLoadedComponent.createOrReplace(entityInfo.entity, {init:false, sceneId:scene.id})
    }
}

export function checkMeshColliderComponent(scene:any, entityInfo:any){
    let mesh = scene.meshColliders.get(entityInfo.aid)
    if(mesh){
        switch(mesh.shape){
            case 0:
                MeshCollider.setPlane(entityInfo.entity)
                break;
            case 1:
                MeshCollider.setBox(entityInfo.entity)
                break;
            
        }
        MeshColliderLoadedComponent.createOrReplace(entityInfo.entity, {init:false, sceneId:scene.id})
    }
}

export function meshListener(scene:any){
    scene.meshColliders.onAdd((mesh:any, aid:any)=>{
        let entityInfo = getEntity(scene, aid)
        if(!entityInfo){
            return
        }

        mesh.listen("layer", (c:any, p:any)=>{
            console.log('mesh collision changed', p, c)
            if(p !== undefined){
                MeshCollider.setPlane(entityInfo.entity, c)
            }
        })
    })
}

export function setMeshRenderBuildMode(scene:any, entityInfo:any){
    checkMeshRenderComponent(scene, entityInfo)
    MeshRenderLoadedComponent.has(entityInfo.entity) ? MeshRenderLoadedComponent.getMutable(entityInfo.entity).init = true : null
}

export function setMeshRenderPlayMode(scene:any, entityInfo:any){
    let meshInfo = scene.meshRenders.get(entityInfo.aid)
    if(meshInfo){
        if(!meshInfo.onPlay){
            MeshRenderer.deleteFrom(entityInfo.entity)
        }
    }
    MeshRenderLoadedComponent.has(entityInfo.entity) ? MeshRenderLoadedComponent.getMutable(entityInfo.entity).init = true : null
}

export function setMeshColliderPlayMode(scene:any, entityInfo:any){
    let meshInfo = scene.meshColliders.get(entityInfo.aid)
    if(meshInfo){
        if(!meshInfo.onPlay){
            MeshCollider.deleteFrom(entityInfo.entity)
        }
    }
    MeshRenderLoadedComponent.has(entityInfo.entity) ? MeshRenderLoadedComponent.getMutable(entityInfo.entity).init = true : null
}

export function disableMeshRenderPlayMode(scene:any, entityInfo:any){
    let meshInfo = scene.meshRenders.get(entityInfo.aid)
    if(meshInfo){
        if(!meshInfo.onPlay){
            MeshRenderer.deleteFrom(entityInfo.entity)
        }
    }
    MeshRenderLoadedComponent.has(entityInfo.entity) ? MeshRenderLoadedComponent.getMutable(entityInfo.entity).init = true : null
}

export function disableMeshColliderPlayMode(scene:any, entityInfo:any){
    let meshInfo = scene.meshColliders.get(entityInfo.aid)
    if(meshInfo){
        if(!meshInfo.onPlay){
            MeshCollider.deleteFrom(entityInfo.entity)
        }
    }
    MeshRenderLoadedComponent.has(entityInfo.entity) ? MeshRenderLoadedComponent.getMutable(entityInfo.entity).init = true : null
}