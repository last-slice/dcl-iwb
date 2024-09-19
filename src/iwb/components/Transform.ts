import { Entity, Transform } from "@dcl/sdk/ecs"
import { Quaternion } from "@dcl/sdk/math"
import { getEntity } from "./IWB"
import { findAssetParent } from "./Parenting"
import { COMPONENT_TYPES } from "../helpers/types"
import { updateTriggerArea } from "./Triggers"

export function checkTransformComponent(scene:any, entityInfo:any){
    console.log('checking transform component', scene.parentEntity)
    let transform = scene[COMPONENT_TYPES.TRANSFORM_COMPONENT].get(entityInfo.aid)
    // console.log('transform is', transform)
    if(transform){
        // console.log('transform found for', entityInfo.aid)
        Transform.createOrReplace(entityInfo.entity, {parent:findAssetParent(scene,entityInfo.aid), position:transform.p, scale:transform.s, rotation:Quaternion.fromEulerDegrees(transform.r.x, transform.r.y, transform.r.z)})

        //check if object has trigger
        // let triggerInfo = scene[COMPONENT_TYPES.TRIGGER_COMPONENT].get(entityInfo.aid)
        // if(triggerInfo){
        //     console.log('entity has trigger component, need to update')
        //     updateTriggerArea(scene, entityInfo, transform)
        // }//
    }
}

export function transformListener(scene:any){
    scene[COMPONENT_TYPES.TRANSFORM_COMPONENT].onAdd((transform:any, aid:any)=>{
        let entityInfo = getEntity(scene, aid)
        if(!entityInfo){
            return
        }

        transform.listen("delta", (c:any, p:any)=>{
            if(p !== undefined){
                checkTransformComponent(scene, entityInfo)
            }
        })

        transform.p.listen("x", (c:any, p:any)=>{
            if(p !== undefined){
                updateTransform(scene, aid, transform)
            }
        })

        transform.p.listen("y", (c:any, p:any)=>{
            if(p !== undefined){
                updateTransform(scene, aid, transform)
            }
        })

        transform.p.listen("z", (c:any, p:any)=>{
            if(p !== undefined){
                updateTransform(scene, aid, transform)
            }
        })

        transform.r.listen("x", (c:any, p:any)=>{
            if(p !== undefined){
                updateTransform(scene, aid, transform)
            }
        })

        transform.r.listen("y", (c:any, p:any)=>{
            if(p !== undefined){
                updateTransform(scene, aid, transform)
            }
        })

        transform.r.listen("z", (c:any, p:any)=>{
            if(p !== undefined){
                updateTransform(scene, aid, transform)
            }
        })

        transform.s.listen("x", (c:any, p:any)=>{
            if(p !== undefined){
                updateTransform(scene, aid, transform)
            }
        })

        transform.s.listen("y", (c:any, p:any)=>{
            if(p !== undefined){
                updateTransform(scene, aid, transform)
            }
        })

        transform.s.listen("z", (c:any, p:any)=>{
            if(p !== undefined){
                updateTransform(scene, aid, transform)
            }
        })
    })
}

export function updateTransform(scene:any, aid:string, transform:any){
    console.log('updating transform', aid)
    let info = getEntity(scene, aid)
    if(info){
        Transform.createOrReplace(info.entity, 
            {
                parent: findAssetParent(scene, aid),
                position:transform.p, 
                rotation:Quaternion.fromEulerDegrees(transform.r.x, transform.r.y, transform.r.z),
                scale:transform.s,
            }
        )

        let triggerInfo = scene[COMPONENT_TYPES.TRIGGER_COMPONENT].get(info.aid)
        if(triggerInfo){
            console.log('entity has trigger component, need to update')
            updateTriggerArea(scene, info, transform)
        }
    }
}