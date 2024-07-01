import { Entity, engine } from "@dcl/sdk/ecs"
import { isLocalPlayer, localUserId } from "./Player"
import { checkGLTFComponent } from "./Gltf"
import { checkTransformComponent } from "./Transform"
import { PointersLoadedComponent, RealmEntityComponent } from "../helpers/Components"
import { playerMode } from "./Config"
import { COMPONENT_TYPES, SCENE_MODES } from "../helpers/types"
import { addBuildModePointers, confirmGrabItem, removeItem, resetEntityForBuildMode } from "../modes/Build"
import { afterLoadActions } from "./Scene"
import { checkMaterialComponent } from "./Materials"
import { checkTextShapeComponent } from "./TextShape"
import { checkVideoComponent } from "./Videos"
import { displaySceneAssetInfoPanel, showSceneInfoPanel } from "../ui/Objects/SceneInfoPanel"
import { checkNftShapeComponent } from "./NftShape"
import { checkMeshColliderComponent, checkMeshRenderComponent } from "./Meshes"
import { checkTextureComponent } from "./Textures"
import { checkPointerComponent } from "./Pointers"
import { checkAudioSourceComponent, checkAudioStreamComponent } from "./Sounds"
import { checkCounterComponent } from "./Counter"
import { checkTriggerComponent } from "./Triggers"
import { checkUIText } from "./UIText"
import { checkUIImage } from "./UIImage"
import { colyseusRoom } from "./Colyseus"
import { checkBillboardComponent } from "./Billboard"

// export function createEntity(item:any){
//     let ent = engine.addEntity()
//     item.entity = ent
//     // item.components = []

//     console.log('creating entity', ent)
//     RealmEntityComponent.create(ent)

//     if (playerMode === SCENE_MODES.BUILD_MODE) {
//         addBuildModePointers(ent)
//     }
//     console.log('finished creating entity')
// }

export function getAssetIdByEntity(scene:any, entity:Entity){
    let assetId:any
    scene[COMPONENT_TYPES.IWB_COMPONENT].forEach((iwbInfo:any, aid:string)=>{
        if(iwbInfo.entity === entity){
            assetId = aid
        }
    })
    return assetId

    // for(let i = 0; i < scene[COMPONENT_TYPES.PARENTING_COMPONENT].length; i++){
    //     let entityInfo = scene[COMPONENT_TYPES.PARENTING_COMPONENT][i]
    //     if(entityInfo && entityInfo.entity && entityInfo.entity === entity){
    //         return entityInfo.aid
    //     }
    // }
    // return undefined
}

export function findAssetParent(scene:any, aid:string){
    console.log('finding asset parent', aid)
    if(scene[COMPONENT_TYPES.PARENTING_COMPONENT].length > 0){
        for(const parent of scene[COMPONENT_TYPES.PARENTING_COMPONENT]){
            if(parent.children.includes(aid)){
                console.log('parent info is', parent)
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

    scene[COMPONENT_TYPES.PARENTING_COMPONENT].onRemove(async(item:any, aid:any)=>{
        console.log('remove parenting item', aid, item)
        colyseusRoom.state.players.forEach(async (player:any, address:string)=>{
            if(player.selectedAsset && player.selectedAsset.assetId === item.aid && player.address === localUserId){
                removeItem(item.entity)
                await confirmGrabItem(scene, item.entity, player.selectedAsset)
                return
            }
        })
    })
}