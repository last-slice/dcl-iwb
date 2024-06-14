import { Entity, Transform } from "@dcl/sdk/ecs"
import { Quaternion } from "@dcl/sdk/math"
import { getEntity } from "./IWB"
import { findAssetParent } from "./Parenting"
import { COMPONENT_TYPES } from "../helpers/types"

export function checkTransformComponent(scene:any, entityInfo:any){
    let transform = scene[COMPONENT_TYPES.TRANSFORM_COMPONENT].get(entityInfo.aid)
    if(transform){
        Transform.createOrReplace(entityInfo.entity, {parent:findAssetParent(scene,entityInfo.aid), position:transform.p, scale:transform.s, rotation:Quaternion.fromEulerDegrees(transform.r.x, transform.r.y, transform.r.z)})
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
    }
}