import { engine, Entity, MeshRenderer, Transform, VirtualCamera } from "@dcl/sdk/ecs"
import { getEntity } from "./iwb"
import { COMPONENT_TYPES } from "../helpers/types"
import { isClient } from "./Config"
import { Quaternion, Vector3 } from "@dcl/sdk/math"

let cameraParentMapping:Map<Entity, Entity> = new Map()

export function checkVirtualCameraComponent(scene:any, entityInfo:any){
    let cameraInfo = scene[COMPONENT_TYPES.VIRTUAL_CAMERA].get(entityInfo.aid)
    if(cameraInfo){
        // if(!isClient){
        //     return
        // }
        VirtualCamera.createOrReplace(entityInfo.entity, {
            lookAtEntity: cameraInfo.lookAt ? cameraInfo.lookAt : undefined,
            defaultTransition: cameraInfo.transitiontype < 0 ? undefined : {
                transitionMode: cameraInfo.transitiontype === 0 ? 
                VirtualCamera.Transition.Time(cameraInfo.transitionAmount) :
                VirtualCamera.Transition.Speed(cameraInfo.transitionAmount)
            }
        })
    }
}

export function setVirtualCameraBuildMode(scene:any, entityInfo:any){
    let cameraInfo = scene[COMPONENT_TYPES.VIRTUAL_CAMERA].get(entityInfo.aid)
    if(!cameraInfo) return

    let cameraArrow = engine.addEntity()
    Transform.create(cameraArrow, {parent:entityInfo.entity, position:Vector3.create(0,0,1), rotation: Quaternion.fromEulerDegrees(90,0,0), scale:Vector3.create(0.1, 1, 0.1)})
    MeshRenderer.setCylinder(cameraArrow)
    cameraParentMapping.set(entityInfo.entity, cameraArrow)
}

export function setVirtualCameraPlayMode(scene:any, entityInfo:any){
    let child = cameraParentMapping.get(entityInfo.entity)
    if(!child)  return;

    engine.removeEntity(child)
    cameraParentMapping.delete(entityInfo.entity)
}

export function virtualCameraListener(scene:any){
    scene[COMPONENT_TYPES.MATERIAL_COMPONENT].onAdd((camera:any, aid:any)=>{
        let entityInfo = getEntity(scene, aid)
        if(!entityInfo){
            return
        }

        let virtualCamera = VirtualCamera.getMutableOrNull(entityInfo.entity)
        if(!virtualCamera)  return

        // camera.listen('fov', (current:number, previous:number)=>{
        //     if(previous !== undefined){
        //         virtualCamera.fov = current
        //     }
        // })

        camera.listen('lookAt', (current:string, previous:string)=>{
            if(previous !== undefined){
                let lookAtEntityInfo = getEntity(scene, current)
                if(!lookAtEntityInfo)   return

                virtualCamera.lookAtEntity = lookAtEntityInfo.entity
            }
        })

    })
}