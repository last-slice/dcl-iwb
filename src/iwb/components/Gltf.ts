import { GltfContainer, Transform } from "@dcl/sdk/ecs"
import { getEntity } from "./IWB"

export function addGltfComponent(scene:any){
    scene.gltfs.forEach((gltf:any, aid:string)=>{
        let info = scene.parenting.find((entity:any)=> entity.aid === aid)
        if(info){
            GltfContainer.create(info.entity, {src:"assets/" + gltf.src + ".glb", visibleMeshesCollisionMask: gltf.visibleCollision, invisibleMeshesCollisionMask:gltf.invisibleCollision})
        }
    })
}

export function gltfListener(scene:any){
    scene.gltfs.onAdd((gltf:any, aid:any)=>{
        gltf.listen("visibleCollision", (c:any, p:any)=>{
            if(p !== undefined){
                let info = getEntity(scene, aid)
                if(info){
                    GltfContainer.getMutable(info.entity).visibleMeshesCollisionMask = c
                }
            }
        })

        gltf.listen("invisibleCollision", (c:any, p:any)=>{
            if(p !== undefined){
                let info = getEntity(scene, aid)
                if(info){
                    GltfContainer.getMutable(info.entity).invisibleMeshesCollisionMask = c
                }
            }
        })
    })
}