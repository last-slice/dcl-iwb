import { Transform } from "@dcl/sdk/ecs"
import { Quaternion } from "@dcl/sdk/math"
import { getEntity } from "./IWB"

export function addTransformComponent(scene:any){
    scene.transforms.forEach((transform:any, aid:string)=>{
        let entity = scene.parenting.find((entity:any)=> entity.aid === aid)
        if(entity){
            Transform.create(entity.entity, {position:transform.p, scale:transform.s, rotation:Quaternion.fromEulerDegrees(transform.r.x, transform.r.y, transform.r.z)})
        }
    })
}

export function transformListener(scene:any){
    scene.transforms.onAdd((transform:any, aid:any)=>{
        transform.p.listen("x", (c:any, p:any)=>{
            // console.log('transform position x change', p, c)//
            if(p !== undefined){
                let entity = getEntity(scene, aid)
                if(entity){
                    Transform.createOrReplace(entity.entity, 
                        {
                            position:transform.p, 
                            rotation:Quaternion.fromEulerDegrees(transform.r.x, transform.r.y, transform.r.z),
                            scale:transform.s, 
                        }
                    )
                }
            }
        })
    })
}