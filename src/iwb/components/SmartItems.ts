import { MeshRenderer, MeshCollider, ColliderLayer, Material, PointerEvents, TextShape, Billboard, BillboardMode } from "@dcl/sdk/ecs"
import { COMPONENT_TYPES } from "../helpers/types"
import { getEntity } from "./IWB"
import { Color4 } from "@dcl/sdk/math"


export function clickAreaListener(scene:any){
    scene.clickAreas.onAdd((counter:any, aid:any)=>{
        !scene.components.includes(COMPONENT_TYPES.CLICK_AREA_COMPONENT) ? scene.components.push(COMPONENT_TYPES.CLICK_AREA_COMPONENT) : null

        let info = getEntity(scene, aid)
        if(!info){
            return
        }
    })
}

export function setSmartItemBuildMode(scene:any, entityInfo:any) {
    setClickAreaBuildMode(scene, entityInfo)
}

function setClickAreaBuildMode(scene:any, entityInfo:any){
    let itemInfo = scene.clickAreas.get(entityInfo.aid)
    if(itemInfo){
        MeshRenderer.setBox(entityInfo.entity)
        MeshCollider.setBox(entityInfo.entity, ColliderLayer.CL_POINTER)
        Material.setPbrMaterial(entityInfo.entity, {
            albedoColor: Color4.create(54 / 255, 221 / 255, 192 / 255, .5)
        })

        let name = scene.names.get(entityInfo.aid)
        if(name){
            TextShape.createOrReplace(entityInfo.entity, {text: "" + name.value, fontSize: 3})
            Billboard.create(entityInfo.entity, {billboardMode: BillboardMode.BM_Y})
        }
    }
}

export function setSmartItemPlaydMode(scene:any, entityInfo:any) {
    // setClickAreaPlayMode(scene, entityInfo)
}

export function disableSmartItemsPlayMode(scene:any, entityInfo:any){
    disableClickAreaPlayMode(scene, entityInfo)
}

function disableClickAreaPlayMode(scene:any, entityInfo:any){
    let itemInfo = scene.clickAreas.get(entityInfo.aid)
    if(itemInfo){
        MeshRenderer.deleteFrom(entityInfo.entity)
        MeshCollider.deleteFrom(entityInfo.entity)
        Material.deleteFrom(entityInfo.entity)
        PointerEvents.deleteFrom(entityInfo.entity)
        TextShape.deleteFrom(entityInfo.entity)
        Billboard.deleteFrom(entityInfo.entity)
    }
}

function setClickAreaPlayMode(scene:any, entityInfo:any){
}

export function updateClickAreaTextLabel(scene:any, entityInfo:any, value:string){
    if(scene.clickAreas.has(entityInfo.aid)){
        TextShape.createOrReplace(entityInfo.entity, {text: "" + value, fontSize: 3})
    }
}

function disableSmartItems(scene:any, entityInfo:any){
    // let itemInfo = scene.videos.get(entityInfo.aid)
    // if(itemInfo){
    //     VideoPlayer.getMutable(entityInfo.entity).playing = false
    // }

    // switch(items.get(sceneItem.id)?.n){
    //     case 'Trigger Area':
    //         if(sceneItem.trigArComp){
    //             MeshRenderer.deleteFrom(entity)

    //             Material.deleteFrom(entity)
    //             utils.triggers.enableTrigger(entity, false)
    //         }
    //         break;

    //     case 'Click Area':
    //         MeshRenderer.deleteFrom(entity)
    //         MeshCollider.deleteFrom(entity)
    //         Material.deleteFrom(entity)
    //         PointerEvents.deleteFrom(entity)
    //         break;

    //     case 'Dialog':
    //     case 'Reward':
    //         MeshRenderer.deleteFrom(entity)
    //         MeshCollider.deleteFrom(entity)
    //         Material.deleteFrom(entity)
    //         PointerEvents.deleteFrom(entity)
    //         TextShape.deleteFrom(entity)
    //         break;
    // }
}