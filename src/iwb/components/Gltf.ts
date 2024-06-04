import { ColliderLayer, GltfContainer, Transform } from "@dcl/sdk/ecs"
import { getEntity } from "./IWB"
import { GLTFLoadedComponent } from "../helpers/Components"
import { playerMode } from "./Config"
import { SCENE_MODES } from "../helpers/types"
import { setAnimationPlayMode } from "./Animator"

export function checkGLTFComponent(scene:any, entityInfo:any){
    let gltf = scene.gltfs.get(entityInfo.aid)
    if(gltf){
        GltfContainer.createOrReplace(entityInfo.entity, {
            src:"assets/" + gltf.src + ".glb", 
            visibleMeshesCollisionMask: gltf.visibleCollision === 3 ? ColliderLayer.CL_PHYSICS || ColliderLayer.CL_POINTER : gltf.visibleCollision, 
            invisibleMeshesCollisionMask: gltf.invisibleCollision === 3 ? ColliderLayer.CL_PHYSICS || ColliderLayer.CL_POINTER : gltf.invisibleCollision
        })
        GLTFLoadedComponent.createOrReplace(entityInfo.entity, {init:false, sceneId:scene.id})

        if(playerMode === SCENE_MODES.BUILD_MODE){
            setGLTFCollisionBuildMode(scene, entityInfo)
        }
    }
}

export function gltfListener(scene:any){
    scene.gltfs.onAdd((gltf:any, aid:any)=>{
        let entityInfo = getEntity(scene, aid)
        if(!entityInfo){
            return
        }

        gltf.listen("visibleCollision", (c:any, p:any)=>{
            if(p !== undefined){
                checkGLTFComponent(scene, entityInfo)
            }
        })

        gltf.listen("invisibleCollision", (c:any, p:any)=>{
            if(p !== undefined){
                checkGLTFComponent(scene, entityInfo)
            }
        })
    })
}

export function setGLTFCollisionBuildMode(scene:any, entityInfo:any) {
    let gltf = scene.gltfs.get(entityInfo.aid)
    if(gltf){
        let object = GltfContainer.getMutableOrNull(entityInfo.entity)
        if (object) {
            object.invisibleMeshesCollisionMask = gltf.invisibleCollision
            object.visibleMeshesCollisionMask = ColliderLayer.CL_POINTER
        }
    }
}

export function setGLTFPlayMode(scene:any, entityInfo:any){
    if (GLTFLoadedComponent.has(entityInfo.entity) && !GLTFLoadedComponent.get(entityInfo.entity).init){
        let gltfInfo = scene.gltfs.get(entityInfo.aid)
        if(gltfInfo){
            let gltf = GltfContainer.getMutableOrNull(entityInfo.entity)
            if(gltf){
                gltf.invisibleMeshesCollisionMask = (gltfInfo.invisibleCollision === 3 ? ColliderLayer.CL_PHYSICS | ColliderLayer.CL_POINTER : gltfInfo.invisibleCollision)
                gltf.visibleMeshesCollisionMask = (gltfInfo.visibleCollision === 3 ? ColliderLayer.CL_PHYSICS | ColliderLayer.CL_POINTER : gltfInfo.visibleCollision)
            }
            setAnimationPlayMode(scene, entityInfo)
        }
        GLTFLoadedComponent.getMutable(entityInfo.entity).init = true
    }
}