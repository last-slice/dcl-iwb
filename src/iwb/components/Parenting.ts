import { Entity, engine } from "@dcl/sdk/ecs"
import { isLocalPlayer } from "./Player"
import { checkGLTFComponent } from "./Gltf"
import { checkTransformComponent } from "./Transform"
import { PointersLoadedComponent, RealmEntityComponent } from "../helpers/Components"
import { playerMode } from "./Config"
import { COMPONENT_TYPES, SCENE_MODES } from "../helpers/types"
import { addBuildModePointers, resetEntityForBuildMode } from "../modes/Build"
import { afterLoadActions } from "./Scene"
import { checkMaterialComponent } from "./Materials"
import { checkSoundComponent } from "./Sounds"
import { checkTextShapeComponent } from "./TextShape"
import { checkVideoComponent } from "./Videos"
import { displaySceneAssetInfoPanel, showSceneInfoPanel } from "../ui/Objects/SceneInfoPanel"
import { checkNftShapeComponent } from "./NftShape"
import { checkMeshColliderComponent, checkMeshRenderComponent } from "./Meshes"
import { checkTextureComponent } from "./Textures"
import { getEntity } from "./IWB"

function createEntity(item:any){
    let ent = engine.addEntity()
    item.entity = ent

    RealmEntityComponent.create(ent)

    if (playerMode === SCENE_MODES.BUILD_MODE) {
        addBuildModePointers(ent)
    }
}

export function getAssetIdByEntity(scene:any, entity:Entity){
    for(let i = 0; i < scene.parenting.length; i++){
        let entityInfo = scene.parenting[i]
        if(entityInfo && entityInfo.entity && entityInfo.entity === entity){
            return entityInfo.aid
        }
    }
    return undefined
}

export function findAssetParent(scene:any, aid:string){
    for(let i = 0; i < scene.parenting.length; i++){
        let parent = scene.parenting[i]
        for(let j = 0; parent.children.length; j++){
            let child = parent.children[j]
            if(child === aid){
                console.log('parent aid is', parent)
                switch(parent.aid){
                    case '0':
                        return scene.parentEntity
                    case '1':
                        return engine.PlayerEntity
                    case '2':
                        return engine.CameraEntity
                    default:
                        return parent.entity
                }
            }
        }
    }
}

export function parentingListener(scene:any){
    scene.parenting.onAdd(async(item:any, aid:any)=>{
        !scene.components.includes(COMPONENT_TYPES.PARENTING_COMPONENT) ? scene.components.push(COMPONENT_TYPES.PARENTING_COMPONENT) : null
        
        if(item.aid){
            if(!["0","1","2"].includes(item.aid)){
                await createEntity(item)
            }
          
            item.children.onAdd((child:any, parentAid:any)=>{
                let entityInfo = getEntity(scene, child)
                checkTransformComponent(scene, entityInfo)      
            })
            PointersLoadedComponent.createOrReplace(item.entity, {init: false, sceneId: scene.id})

            ////addAssetComponents(localScene, entity, item, itemConfig.ty, itemConfig.n)
              
            await checkGLTFComponent(scene, item)
            await checkTextureComponent(scene, item)
            await checkMeshRenderComponent(scene, item)
            await checkMeshColliderComponent(scene, item)
            await checkMaterialComponent(scene, item)
            await checkSoundComponent(scene, item)
            await checkTextShapeComponent(scene, item)
            await checkVideoComponent(scene, item)
            await checkNftShapeComponent(scene, item)

            //// await checkSmartItemComponent()//


            if(playerMode === SCENE_MODES.BUILD_MODE){
                resetEntityForBuildMode(scene, item)
            }

            let fn = afterLoadActions.pop()
            if (fn) fn(scene.id, item.entity)
        }
    })

    scene.parenting.onRemove(async(item:any, aid:any)=>{
        console.log('remove parenting item', aid, item)

        // if(asset.editing && asset.editor === localUserId){
        //     asset.sceneId = scene.id
        //     await confirmGrabItem(asset)
        // }

        engine.removeEntity(item.entity)
        if(showSceneInfoPanel){
            displaySceneAssetInfoPanel(true)
        }
    })
}