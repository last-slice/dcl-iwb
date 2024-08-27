import { AvatarAttach, ColliderLayer, GltfContainer, PointerEvents, Transform } from "@dcl/sdk/ecs"
import { getEntity } from "./IWB"
import { LevelAssetGLTF } from "../helpers/Components"
import { playerMode } from "./Config"
import { COLLIDER_LAYERS, COMPONENT_TYPES, SCENE_MODES } from "../helpers/types"
import { setAnimationPlayMode } from "./Animator"

export function checkGLTFComponent(scene:any, entityInfo:any, isLevelAsset?:boolean){
    let gltf = scene[COMPONENT_TYPES.GLTF_COMPONENT].get(entityInfo.aid)
    if(gltf){
        if(isLevelAsset){
            console.log('we have level asset', entityInfo.entity)
            LevelAssetGLTF.create(entityInfo.entity)
        }

        GltfContainer.createOrReplace(entityInfo.entity, {
            src:"assets/" + gltf.src + ".glb", 
            visibleMeshesCollisionMask: (gltf.visibleCollision === 3 ? ColliderLayer.CL_PHYSICS | ColliderLayer.CL_POINTER : parseInt(Object.values(COLLIDER_LAYERS).filter(value => typeof value === 'number')[gltf.visibleCollision].toString())), 
            invisibleMeshesCollisionMask: (gltf.invisibleCollision === 3 ? ColliderLayer.CL_PHYSICS | ColliderLayer.CL_POINTER : parseInt(Object.values(COLLIDER_LAYERS).filter(value => typeof value === 'number')[gltf.invisibleCollision].toString()))
        })
        // GLTFLoadedComponent.createOrReplace(entityInfo.entity, {init:false, sceneId:scene.id})

        if(playerMode === SCENE_MODES.BUILD_MODE){
            setGLTFCollisionBuildMode(scene, entityInfo)
        }
    }
}

export function gltfListener(scene:any){
    scene[COMPONENT_TYPES.GLTF_COMPONENT].onAdd((gltf:any, aid:any)=>{
        // let iwbInfo = scene[COMPONENT_TYPES.PARENTING_COMPONENT].find(($:any)=> $.aid === aid)
        // if(!iwbInfo.components.includes(COMPONENT_TYPES.GLTF_COMPONENT)){
        //   iwbInfo.components.push(COMPONENT_TYPES.GLTF_COMPONENT)
        // }

        let entityInfo = getEntity(scene, aid)
        if(!entityInfo){
            return
        }

        gltf.listen("visibleCollision", (c:any, p:any)=>{
            if(p !== undefined){
                console.log('gltf visible collision change', p, c)
                checkGLTFComponent(scene, entityInfo)
            }
        })

        gltf.listen("invisibleCollision", (c:any, p:any)=>{
            if(p !== undefined){
                console.log('gltf invisible collision change', p, c)
                checkGLTFComponent(scene, entityInfo)
            }
        })
    })
}

export function setGLTFCollisionBuildMode(scene:any, entityInfo:any) {
    let gltf = scene[COMPONENT_TYPES.GLTF_COMPONENT].get(entityInfo.aid)
    if(gltf){
        let object = GltfContainer.getMutableOrNull(entityInfo.entity)
        if (object) {
            // if(object.invisibleMeshesCollisionMask !== ColliderLayer.CL_POINTER && object.visibleMeshesCollisionMask !== ColliderLayer.CL_POINTER){
            //     console.log('set glft build mode', object)
            //     object.visibleMeshesCollisionMask = ColliderLayer.CL_POINTER//
            // }    
            object.invisibleMeshesCollisionMask = 2
            object.visibleMeshesCollisionMask = 1 //ColliderLayer.CL_PHYSICS | ColliderLayer.CL_POINTER
        }
        AvatarAttach.deleteFrom(entityInfo.entity)
    }
}

export function setGLTFPlayMode(scene:any, entityInfo:any, disableLevel?:boolean){
    // if (GLTFLoadedComponent.has(entityInfo.entity) && !GLTFLoadedComponent.get(entityInfo.entity).init){
        let gltfInfo = scene[COMPONENT_TYPES.GLTF_COMPONENT].get(entityInfo.aid)
        if(gltfInfo){
            let gltf = GltfContainer.getMutableOrNull(entityInfo.entity)
            if(gltf){
                if(disableLevel){
                    gltf.invisibleMeshesCollisionMask = 0
                    gltf.visibleMeshesCollisionMask = 0
                }else{
                    console.log('set gltf play mode', gltfInfo)
                    gltf.invisibleMeshesCollisionMask = (gltfInfo.invisibleCollision === 3 ? ColliderLayer.CL_PHYSICS | ColliderLayer.CL_POINTER : parseInt(Object.values(COLLIDER_LAYERS).filter(value => typeof value === 'number')[gltfInfo.invisibleCollision].toString()))
                    gltf.visibleMeshesCollisionMask = (gltfInfo.visibleCollision === 3 ? ColliderLayer.CL_PHYSICS | ColliderLayer.CL_POINTER : parseInt(Object.values(COLLIDER_LAYERS).filter(value => typeof value === 'number')[gltfInfo.visibleCollision].toString()))    
                }
            }
            setAnimationPlayMode(scene, entityInfo)
        }
        // GLTFLoadedComponent.getMutable(entityInfo.entity).init = true
        AvatarAttach.deleteFrom(entityInfo.entity)
    // }
}