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

export async function addParenting(scene:any){
    scene.parenting.forEach((item:any, i:number)=>{
        if(i > 2){

            createEntity(item)

            // pointerEventsSystem.onPointerDown({entity:ent, opts:{button:InputAction.IA_POINTER, maxDistance:10, hoverText:"Click Here"}}, ()=>{

            //     //TESTING SERVER LISTENERS
            //     // sendServerMessage('move',/// {sceneId:scene.id, aid:item.aid, mode:'p', axis:'x', direction:1, factor:1})//
               
            //     // sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET,
            //     //     {sceneId:scene.id, aid:item.aid, component:COMPONENT_TYPES.VISBILITY_COMPONENT, data:{}}
            //     // )

            //     sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET,
            //         {sceneId:scene.id, aid:item.aid, component:COMPONENT_TYPES.TEXT_COMPONENT, data:{text:"Awesome"}}
            //     )

            //     console.log(getAssetName(scene.id, item.aid))

            //     console.log(getCounterValue(scene.id, item.aid, "lives"))
            // })
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
            await checkTransformComponent(scene, item.aid)            
            await checkGLTFComponent(scene, item.aid)
            await checkMeshComponent(scene, item.aid)
            await checkMaterialComponent(scene, item.aid)

            //await cehckAudioComponent()

            // await checkSmartItemComponent()//


            if(playerMode === SCENE_MODES.BUILD_MODE){
                resetEntityForBuildMode(scene, item)
            }

            let fn = afterLoadActions.pop()
            if (fn) fn(scene.id, item.entity)


            
        }
    })
}