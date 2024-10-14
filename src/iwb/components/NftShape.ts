import { ColliderLayer, GltfContainer, Material, MeshCollider, MeshRenderer, NftShape, Transform } from "@dcl/sdk/ecs"
import { getEntity } from "./iwb"
import { Color4 } from "@dcl/sdk/math"
import { COMPONENT_TYPES } from "../helpers/types"

export function buildNFTURN(itemInfo:any){
    return "urn:decentraland:" + itemInfo.chain + ":" + itemInfo.standard + ":" +itemInfo.contract + ":" +itemInfo.tokenId
}

export function checkNftShapeComponent(scene:any, entityInfo:any){
    let itemInfo = scene[COMPONENT_TYPES.NFT_COMPONENT].get(entityInfo.aid)
    if(itemInfo){
        console.log('creating nft shape', itemInfo, "urn:decentraland:" + itemInfo.chain + ":" + itemInfo.standard + ":" +itemInfo.contract + ":" +itemInfo.tokenId,)
        NftShape.createOrReplace(entityInfo.entity,{
            urn: buildNFTURN(itemInfo),
            style: itemInfo.style,
            color: itemInfo.color ? 
            Color4.create(itemInfo.color.r, itemInfo.color.g, itemInfo.color.b, itemInfo.color.a)
            : undefined
        })
    }
}

export function nftShapeListener(scene:any){
    scene[COMPONENT_TYPES.NFT_COMPONENT].onAdd((nftShape:any, aid:any)=>{
        // let iwbInfo = scene[COMPONENT_TYPES.PARENTING_COMPONENT].find(($:any)=> $.aid === aid)
        // if(!iwbInfo.components.includes(COMPONENT_TYPES.NFT_COMPONENT)){
        //   iwbInfo.components.push(COMPONENT_TYPES.NFT_COMPONENT)
        // }

        let entityInfo = getEntity(scene, aid)
        if(!entityInfo){
            return
        }

        nftShape.listen("style", (c:any, p:any)=>{
            if(p !== undefined){
                checkNftShapeComponent(scene, entityInfo)
            }
        })

        nftShape.listen("chain", (c:any, p:any)=>{
            if(p !== undefined){
                checkNftShapeComponent(scene, entityInfo)
            }
        })

        nftShape.listen("standard", (c:any, p:any)=>{
            if(p !== undefined){
                checkNftShapeComponent(scene, entityInfo)
            }
        })

        nftShape.listen("contract", (c:any, p:any)=>{
            if(p !== undefined){
                checkNftShapeComponent(scene, entityInfo)
            }
        })

        nftShape.listen("tokenId", (c:any, p:any)=>{
            if(p !== undefined){
                checkNftShapeComponent(scene, entityInfo)
            }
        })
    })
}