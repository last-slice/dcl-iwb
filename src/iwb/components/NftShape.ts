import { ColliderLayer, GltfContainer, Material, MeshCollider, MeshRenderer, NftShape, Transform } from "@dcl/sdk/ecs"
import { getEntity } from "./IWB"
import { Color4 } from "@dcl/sdk/math"

export function checkNftShapeComponent(scene:any, entityInfo:any){
    let itemInfo = scene.nftShapes.get(entityInfo.aid)
    if(itemInfo){
        NftShape.createOrReplace(entityInfo.entity,{
            urn: itemInfo.urn,
            style: itemInfo.style,
            color: itemInfo.color ? 
            Color4.create(itemInfo.color.r, itemInfo.color.g, itemInfo.color.b, itemInfo.color.a)
            : undefined
        })
    }
}

export function nftShapeListener(scene:any){
    scene.nftShapes.onAdd((nftShape:any, aid:any)=>{
        let entityInfo = getEntity(scene, aid)
        if(!entityInfo){
            return
        }

        nftShape.listen("style", (c:any, p:any)=>{
            if(p !== undefined){
                checkNftShapeComponent(scene, entityInfo)
            }
        })
    })
}