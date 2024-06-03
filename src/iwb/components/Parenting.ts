import { Entity, engine } from "@dcl/sdk/ecs"
import { isLocalPlayer } from "./Player"
import { checkGLTFComponent } from "./Gltf"
import { checkTransformComponent } from "./Transform"
import { PointersLoadedComponent, RealmEntityComponent } from "../helpers/Components"
import { playerMode } from "./Config"
import { SCENE_MODES } from "../helpers/types"
import { addBuildModePointers, resetEntityForBuildMode } from "../modes/Build"
import { afterLoadActions } from "./Scene"
import { checkMeshComponent } from "./Meshes"
import { checkMaterialComponent } from "./Materials"
import { checkSoundComponent } from "./Sounds"
import { checkTextShapeComponent } from "./TextShape"
import { checkVideoComponent } from "./Videos"
import { displaySceneAssetInfoPanel, showSceneInfoPanel } from "../ui/Objects/SceneInfoPanel"

let aidByEntity:Map<number, string> = new Map()
let entityByAid:Map<string, Entity> = new Map()

function createEntity(item:any){
    let ent = engine.addEntity()
    // item.entity = ent
    aidByEntity.set(ent, item.aid)
    entityByAid.set(item.aid, ent)

    RealmEntityComponent.create(ent)

    if (playerMode === SCENE_MODES.BUILD_MODE) {
        addBuildModePointers(ent)
    }
}

export function getAssetIdByEntity(scene:any, entity:Entity){
    return aidByEntity.get(entity)
    for(let i = 0; i < scene.parenting.length; i++){
        let entityInfo = scene.parenting[i]
        if(entityInfo.entity === entity){
            return entityInfo.aid
        }
    }
    return undefined
}

export function getEntityByAssetId(aid:string){
    return entityByAid.get(aid)
}

export function parentingListener(scene:any){
    scene.parenting.onAdd(async(item:any, aid:any)=>{
        console.log('added item', item)

        if(item.aid){
            await createEntity(item)
            // PointersLoadedComponent.createOrReplace(item.entity, {init: false, sceneId: scene.id})


            ////addAssetComponents(localScene, entity, item, itemConfig.ty, itemConfig.n)
            await checkTransformComponent(scene, item)        
            // await checkGLTFComponent(scene, item)
            // await checkMeshComponent(scene, item)
            // await checkMaterialComponent(scene, item)
            // await checkSoundComponent(scene, item)
            // await checkTextShapeComponent(scene, item)
            // await checkVideoComponent(scene, item)

            //// await checkSmartItemComponent()


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