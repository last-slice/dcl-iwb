import { GltfContainer, Transform } from "@dcl/sdk/ecs"
import { getEntity } from "./IWB"
import { GLTFLoadedComponent } from "../helpers/Components"

// export function addGltfComponent(scene:any){
//     // scene.gltfs.forEach((gltf:any, aid:string)=>{
//     //     createGLTF(scene, aid, gltf)
//     // })
// }

export function checkGLTFComponent(scene:any, entityInfo:any){
    let gltf = scene.gltfs.get(entityInfo.aid)
    if(gltf){
        GltfContainer.create(entityInfo.entity, {src:"assets/" + gltf.src + ".glb", visibleMeshesCollisionMask: gltf.visibleCollision, invisibleMeshesCollisionMask:gltf.invisibleCollision})
        GLTFLoadedComponent.create(entityInfo.entity, {init:false, sceneId:scene.id})
    }
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

export function checkGLTFCollision(scene:any, entityInfo:any) {
    let gltf = scene.gltfs.get(entityInfo.aid)
    if(gltf){
        let object = GltfContainer.getMutableOrNull(entityInfo.entity)
        if (object) {
            object.invisibleMeshesCollisionMask = gltf.invisibleCollision
            object.visibleMeshesCollisionMask = gltf.visibleCollision
        }
    }
}