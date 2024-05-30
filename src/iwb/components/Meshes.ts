import { ColliderLayer, GltfContainer, MeshCollider, MeshRenderer, Transform } from "@dcl/sdk/ecs"
import { getEntity } from "./IWB"
import { MeshLoadedComponent } from "../helpers/Components"

// export function addGltfComponent(scene:any){
//     // scene.gltfs.forEach((gltf:any, aid:string)=>{
//     //     createGLTF(scene, aid, gltf)
//     // })
// }

export function checkMeshComponent(scene:any, entityInfo:any){
    let mesh = scene.meshes.get(entityInfo.aid)
    if(mesh){
        MeshRenderer.setPlane(entityInfo.entity)
        MeshCollider.setPlane(entityInfo.entity, mesh.collision === -500 ? ColliderLayer.CL_POINTER || ColliderLayer.CL_PHYSICS : mesh.collision)
        MeshLoadedComponent.create(entityInfo.entity, {init:false, sceneId:scene.id})
    }
}

export function meshListener(scene:any){
    scene.meshes.onAdd((mesh:any, aid:any)=>{
        mesh.listen("collision", (c:any, p:any)=>{
            if(p !== undefined){
                let info = getEntity(scene, aid)
                if(info){
                    MeshCollider.setPlane(info.entity, mesh.p === -500 ? ColliderLayer.CL_POINTER || ColliderLayer.CL_PHYSICS : mesh.p)
                }
            }
        })
    })
}

export function setMeshBuildMode(scene:any, entityInfo:any){
    let mesh = scene.meshes.get(entityInfo.aid)
    if(mesh){
        MeshCollider.setPlane(entityInfo.entity, mesh.collision === -500 ? ColliderLayer.CL_POINTER || ColliderLayer.CL_PHYSICS : mesh.collision)
    }
}