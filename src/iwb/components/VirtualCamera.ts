import { VirtualCamera } from "@dcl/sdk/ecs"
import { getEntity } from "./iwb"
import { COMPONENT_TYPES } from "../helpers/types"
import { isClient } from "./Config"

export function checkVirtualCameraComponent(scene:any, entityInfo:any){
    let cameraInfo = scene[COMPONENT_TYPES.VIRTUAL_CAMERA].get(entityInfo.aid)
    if(cameraInfo){
        if(!isClient){
            return
        }
        VirtualCamera.create(entityInfo.entit, {
            lookAtEntity: cameraInfo.lookAt ? cameraInfo.lookAt : undefined,
            defaultTransition: cameraInfo.transitiontype < 0 ? undefined : {
                transitionMode: cameraInfo.transitiontype === 0 ? 
                VirtualCamera.Transition.Time(cameraInfo.transitionAmount) :
                VirtualCamera.Transition.Speed(cameraInfo.transitionAmount)
            }
        })
    }
}

export function virtualCameraListener(scene:any){
    scene[COMPONENT_TYPES.MATERIAL_COMPONENT].onAdd((material:any, aid:any)=>{
        let info = getEntity(scene, aid)
        if(!info){
            return
        }
    })
}