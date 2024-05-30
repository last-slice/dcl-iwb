import { ColliderLayer, GltfContainer, MeshCollider, MeshRenderer, Transform } from "@dcl/sdk/ecs"
import { getEntity } from "./IWB"

// export function addGltfComponent(scene:any){
//     // scene.gltfs.forEach((gltf:any, aid:string)=>{
//     //     createGLTF(scene, aid, gltf)
//     // })
// }

export function checkMeshComponent(scene:any, aid:string){
    let info = scene.parenting.find((entity:any)=> entity.aid === aid)
    if(info){
        let mesh = scene.meshes.get(aid)
        if(mesh){
            MeshRenderer.setPlane(info.entity)
            MeshCollider.setPlane(info.entity, mesh.collision === -500 ? ColliderLayer.CL_POINTER || ColliderLayer.CL_PHYSICS : mesh.collision)
        }
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