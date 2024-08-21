import { AvatarShape, ColliderLayer, MeshCollider, Transform } from "@dcl/sdk/ecs"
import { getEntity } from "./IWB"
import { Color4 } from "@dcl/sdk/math"
import { COMPONENT_TYPES } from "../helpers/types"

export function checkAvatarShape(scene:any, entityInfo:any, data?:any){
    let itemInfo = scene[COMPONENT_TYPES.AVATAR_SHAPE_COMPONENT].get(entityInfo.aid)
    if(itemInfo){


        if(data){
            itemInfo = {...data}
        }
        console.log('here we are', itemInfo)


        let wearables:string[] = [
            "urn:decentraland:off-chain:base-avatars:standard_hair",
            'urn:decentraland:off-chain:base-avatars:f_eyes_00',
            'urn:decentraland:off-chain:base-avatars:f_eyebrows_00',
            'urn:decentraland:off-chain:base-avatars:f_mouth_00',
        ]
        itemInfo.wearables.forEach((wearable:string)=>{
            wearables.push("urn:decentraland:matic:collections-v2:" + wearable)
        })
        AvatarShape.createOrReplace(entityInfo.entity,
            {
                id: itemInfo.name,
                bodyShape: itemInfo.bodyShape == 0 ? "urn:decentraland:off-chain:base-avatars:BaseMale" : "urn:decentraland:off-chain:base-avatars:BaseFemale",
                name : itemInfo.displayName ? itemInfo.name : "",
                wearables:wearables,
                emotes:[],
                hairColor: Color4.create(itemInfo.hairColor.r/255, itemInfo.hairColor.g/255, itemInfo.hairColor.b/255),
                eyeColor: Color4.create(itemInfo.eyeColor.r/255, itemInfo.eyeColor.g/255, itemInfo.eyeColor.b/255),
                skinColor:Color4.create(itemInfo.skinColor.r/255, itemInfo.skinColor.g/255, itemInfo.skinColor.b/255),
            }
        )
    }
}

export function disableAvatarShapePlayMode(scene:any, entityInfo:any){
    MeshCollider.deleteFrom(entityInfo.entity)
}

export function setAvatarShapeBuildMode(scene:any, entityInfo:any){
    MeshCollider.setBox(entityInfo.entity, ColliderLayer.CL_POINTER)
}

export function avatarShapeListener(scene:any){
    scene[COMPONENT_TYPES.AVATAR_SHAPE_COMPONENT].onAdd((avatarShape:any, aid:any)=>{
        let entityInfo = getEntity(scene, aid)
        if(!entityInfo){
            return
        }

        avatarShape.listen("name", (c:any, p:any)=>{
            console.log('avatar name changed')
            if(p !== 0 || p !== undefined){
                checkAvatarShape(scene, entityInfo)
            }
        })    

        avatarShape.listen("bodyShape", (c:any, p:any)=>{
            console.log('avatar bodyShape changed')
            if(p !== 0 || p !== undefined){
                checkAvatarShape(scene, entityInfo)
            }
        })    

        avatarShape.listen("displayName", (c:any, p:any)=>{
            console.log('avatar displayName changed')
            if(p !== 0 || p !== undefined){
                checkAvatarShape(scene, entityInfo)
            }
        })    

        avatarShape.wearables && avatarShape.wearables.onAdd((item:any)=>{
            console.log('avatar wearables onAdd', item)
                checkAvatarShape(scene, entityInfo)
        })   

        avatarShape.wearables && avatarShape.wearables.onRemove((item:any)=>{
            console.log('avatar wearables onRemove', item)
                checkAvatarShape(scene, entityInfo)
        })//

        avatarShape.eyeColor.listen("r", (c:any, p:any)=>{
            console.log('avatar eyeColor changed')
            if(p !== c){
                checkAvatarShape(scene, entityInfo)
            }
        })   
        avatarShape.eyeColor.listen("g", (c:any, p:any)=>{
            console.log('avatar eyeColor changed')
            if(p !== c){
                checkAvatarShape(scene, entityInfo)
            }
        }) 
        avatarShape.eyeColor.listen("b", (c:any, p:any)=>{
            console.log('avatar eyeColor changed')
            if(p !== c){
                checkAvatarShape(scene, entityInfo)
            }
        })  

        avatarShape.skinColor.listen("r", (c:any, p:any)=>{
            console.log('avatar skinColor changed')
            if(p !== c){
                checkAvatarShape(scene, entityInfo)
            }
        })   
        avatarShape.skinColor.listen("g", (c:any, p:any)=>{
            console.log('avatar skinColor changed')
            if(p !== c){
                checkAvatarShape(scene, entityInfo)
            }
        }) 
        avatarShape.skinColor.listen("b", (c:any, p:any)=>{
            console.log('avatar skinColor changed')
            if(p !== c){
                checkAvatarShape(scene, entityInfo)
            }
        })  

        avatarShape.hairColor.listen("r", (c:any, p:any)=>{
            console.log('avatar hairColor changed')
            if(p !== c){
                checkAvatarShape(scene, entityInfo)
            }
        })   
        avatarShape.hairColor.listen("g", (c:any, p:any)=>{
            console.log('avatar hairColor changed')
            if(p !== c){
                checkAvatarShape(scene, entityInfo)
            }
        }) 
        avatarShape.hairColor.listen("b", (c:any, p:any)=>{
            console.log('avatar hairColor changed')
            if(p !== c){
                checkAvatarShape(scene, entityInfo)
            }
        })  
    })
}