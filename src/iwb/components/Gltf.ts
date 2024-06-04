import { ColliderLayer, GltfContainer, Transform } from "@dcl/sdk/ecs"
import { getEntity } from "./IWB"
import { GLTFLoadedComponent } from "../helpers/Components"
import { checkVideoComponent } from "./Videos"
import { playerMode } from "./Config"
import { SCENE_MODES } from "../helpers/types"
import { resetEntityForBuildMode } from "../modes/Build"

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