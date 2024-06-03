import { engine } from "@dcl/sdk/ecs"
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

export async function addParenting(scene:any){
    scene.parenting.forEach((item:any, i:number)=>{
        if(i > 2){
            createEntity(item)
        }
    })
}

function createEntity(item:any){
    let ent = engine.addEntity()
    item.entity = ent

    RealmEntityComponent.create(ent)

    if (playerMode === SCENE_MODES.BUILD_MODE) {
        addBuildModePointers(ent)
    }
}

export function parentingListener(scene:any){
    scene.parenting.onAdd(async(item:any, aid:any)=>{
        if(item.aid){
            await createEntity(item)
            PointersLoadedComponent.create(item.entity, {init: false, sceneId: scene.id})


            //addAssetComponents(localScene, entity, item, itemConfig.ty, itemConfig.n)
            await checkTransformComponent(scene, item)            
            await checkGLTFComponent(scene, item)
            await checkMeshComponent(scene, item)
            await checkMaterialComponent(scene, item)
            await checkSoundComponent(scene, item)
            await checkTextShapeComponent(scene, item)
            await checkVideoComponent(scene, item)

            // await checkSmartItemComponent()


            if(playerMode === SCENE_MODES.BUILD_MODE){
                resetEntityForBuildMode(scene, item)
            }

            let fn = afterLoadActions.pop()
            if (fn) fn(scene.id, item.entity)
            
        }
    })
}