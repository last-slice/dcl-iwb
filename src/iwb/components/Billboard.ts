import { colyseusRoom } from "./Colyseus";
import { getEntity } from "./iwb";
import { playerMode } from "./Config";
import { COMPONENT_TYPES, SCENE_MODES } from "../helpers/types";
// import { BillboardLoadedComponent } from "../helpers/Components";
import { Billboard } from "@dcl/sdk/ecs";
import { updateTransform } from "./Transform";

export function checkBillboardComponent(scene:any, entityInfo:any){
    let itemInfo = scene[COMPONENT_TYPES.BILLBOARD_COMPONENT].get(entityInfo.aid)
    if(itemInfo && entityInfo.entity){
        Billboard.createOrReplace(entityInfo.entity, {billboardMode: itemInfo.mode})
        // BillboardLoadedComponent.createOrReplace(entityInfo.entity, {init:false, sceneId:scene.id})
    }
}

export function billboardListener(scene:any){
    scene[COMPONENT_TYPES.BILLBOARD_COMPONENT].onAdd((billboard:any, aid:any)=>{
        let entityInfo = getEntity(scene, aid)
        if(!entityInfo){
            return
        }

        billboard.listen("mode", (current:any, previous:any)=>{
            checkBillboardComponent(scene, entityInfo)
            // if(previous !== undefined && playerMode === SCENE_MODES.BUILD_MODE){
                // checkBillboardComponent(scene, entityInfo)
                // let billboard = Billboard.getMutable(entityInfo.entity)
                // if(billboard){
                //     billboard.billboardMode = current
                // }
            // }
        })
    })

    scene[COMPONENT_TYPES.BILLBOARD_COMPONENT].onRemove((billboard:any, aid:any)=>{
        let entityInfo = getEntity(scene, aid)
        if(!entityInfo){
            return
        }
        Billboard.deleteFrom(entityInfo.entity)

        let transform = scene[COMPONENT_TYPES.TRANSFORM_COMPONENT].get(entityInfo.aid)
        if(transform){
            updateTransform(scene, entityInfo.aid, transform)
        }
    })
}