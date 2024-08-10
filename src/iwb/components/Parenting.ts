import { Entity, engine } from "@dcl/sdk/ecs"
import { localUserId } from "./Player"
import { COMPONENT_TYPES, SCENE_MODES } from "../helpers/types"
import { updateAssetBuildVisibility } from "./Visibility"


export function getAssetIdByEntity(scene:any, entity:Entity){
    let assetId:any
    scene[COMPONENT_TYPES.IWB_COMPONENT].forEach((iwbInfo:any, aid:string)=>{
        if(iwbInfo.entity === entity){
            assetId = aid
        }
    })
    return assetId
}

export function findAssetParent(scene:any, aid:string){
    // console.log('finding asset parent', aid)
    if(scene[COMPONENT_TYPES.PARENTING_COMPONENT].length > 0){
        for(const parent of scene[COMPONENT_TYPES.PARENTING_COMPONENT]){
            if(parent.children.includes(aid)){
                // console.log('parent info is', parent)//
                switch(parent.aid){
                    case '0':
                        return scene.parentEntity
                    case '1':
                        return engine.PlayerEntity
                    case '2':
                        return engine.CameraEntity
                    default:
                        let entityInfo = scene[COMPONENT_TYPES.IWB_COMPONENT].get(parent.aid)
                        return entityInfo.entity
                }
            }
        }
        return scene.parentEntity
    }else{
        return engine.RootEntity
    }
}

export function parentingListener(scene:any){
    scene[COMPONENT_TYPES.PARENTING_COMPONENT].onAdd(async(item:any, aid:any)=>{
        // if(item.aid){
        //     if(!["0","1","2"].includes(item.aid)){
        //         await createEntity(item)
        //     }

        //     PointersLoadedComponent.createOrReplace(item.entity, {init: false, sceneId: scene.id})

        //     await checkTransformComponent(scene, item)  
        //     await checkGLTFComponent(scene, item)
        //     await checkTextureComponent(scene, item)
        //     await checkPointerComponent(scene, item)
        //     await checkMeshRenderComponent(scene, item)
        //     await checkMeshColliderComponent(scene, item)
        //     await checkMaterialComponent(scene, item)
        //     await checkAudioSourceComponent(scene, item)
        //     await checkAudioStreamComponent(scene, item)
        //     await checkTextShapeComponent(scene, item)
        //     await checkVideoComponent(scene, item)
        //     await checkNftShapeComponent(scene, item)
        //     await checkCounterComponent(scene, item)
        //     await checkUIText(scene, item)
        //     await checkUIImage(scene, item)
        //     await checkTriggerComponent(scene, item)
        //     await checkBillboardComponent(scene, item)
            
        //     // await checkSmartItemComponent()


        //     if(playerMode === SCENE_MODES.BUILD_MODE){
        //         resetEntityForBuildMode(scene, item)
        //     }

        //     let fn = afterLoadActions.pop()
        //     if (fn) fn(scene.id, item.entity)
        // }
    })

    // scene[COMPONENT_TYPES.PARENTING_COMPONENT].onRemove(async(item:any, aid:any)=>{

    // })
}