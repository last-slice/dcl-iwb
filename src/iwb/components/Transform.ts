import { Entity, Transform } from "@dcl/sdk/ecs"
import { Quaternion } from "@dcl/sdk/math"
import { getEntity } from "./IWB"

// export function addTransformComponent(scene:any){
//     scene.transforms.forEach((transform:any, aid:string)=>{
//         let entity = scene.parenting.find((entity:any)=> entity.aid === aid)
//         if(entity){
//             Transform.create(entity.entity, {position:transform.p, scale:transform.s, rotation:Quaternion.fromEulerDegrees(transform.r.x, transform.r.y, transform.r.z)})
//         }
//     })
// }

export function checkTransformComponent(scene:any, entityInfo:any){
    let transform = scene.transforms.get(entityInfo.aid)
    if(transform){
        Transform.create(entityInfo.entity, {parent:scene.parentEntity, position:transform.p, scale:transform.s, rotation:Quaternion.fromEulerDegrees(transform.r.x, transform.r.y, transform.r.z)})
    }
}

export function transformListener(scene:any){
    scene.transforms.onAdd((transform:any, aid:any)=>{
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
    let info = getEntity(scene, aid)
    if(info){
        Transform.createOrReplace(info.entity, 
            {
                parent:scene.parentEntity,
                position:transform.p, 
                rotation:Quaternion.fromEulerDegrees(transform.r.x, transform.r.y, transform.r.z),
                scale:transform.s, 
            }
        )
    }
}