import { ColliderLayer, GltfContainer, Material, MeshCollider, MeshRenderer, Transform } from "@dcl/sdk/ecs"
import { getEntity } from "./IWB"
import { Color4 } from "@dcl/sdk/math"
import { COMPONENT_TYPES } from "../helpers/types"

export function checkMaterialComponent(scene:any, entityInfo:any){
    let material = scene[COMPONENT_TYPES.MATERIAL_COMPONENT].get(entityInfo.aid)
    if(material){
        updateMaterial(material, entityInfo)
    }
}

export function materialListener(scene:any){
    scene[COMPONENT_TYPES.MATERIAL_COMPONENT].onAdd((material:any, aid:any)=>{
        // let iwbInfo = scene[COMPONENT_TYPES.PARENTING_COMPONENT].find(($:any)=> $.aid === aid)
        // if(!iwbInfo.components.includes(COMPONENT_TYPES.MATERIAL_COMPONENT)){
        //   iwbInfo.components.push(COMPONENT_TYPES.MATERIAL_COMPONENT)
        // }//
        let info = getEntity(scene, aid)
        if(!info){
            return
        }

        material.albedoColor && material.albedoColor.listen("r", (c:any, p:any)=>{
            checkMaterialComponent(scene, info)
        })
        material.albedoColor && material.albedoColor.listen("g", (c:any, p:any)=>{
            checkMaterialComponent(scene, info)
        })
        material.albedoColor && material.albedoColor.listen("b", (c:any, p:any)=>{
            checkMaterialComponent(scene, info)
        })
        material.albedoColor && material.albedoColor.listen("a", (c:any, p:any)=>{
            checkMaterialComponent(scene, info)
        })
    })
}

export function updateMaterial(material:any, entityInfo:any){
    switch(material.type){
        case 0:
            Material.setPbrMaterial(entityInfo.entity, {
                texture: material.texture ?
                Material.Texture.Common({
                    src: material.texture
                })
                : undefined
                ,
        
                emissiveTexture: material.emissiveType !== "NONE" ?
                Material.Texture.Common({
                    src: material.emissiveTexture
                })
                : undefined,
        
                emissiveColor: material.emissiveType !== "NONE" ? 
                Color4.create(material.emissiveColor.r, material.emissiveColor.g, material.emissiveColor.b, material.emissiveColor.a)
                : undefined,
        
                emissiveIntensity: material.emissiveType !== "NONE" ? 
                material.emissiveIntensity
                : undefined,
        
                albedoColor: material.albedoColor ? 
                Color4.create(material.albedoColor.r, material.albedoColor.g, material.albedoColor.b, material.albedoColor.a)
                : undefined
            })
            break;

        case 1:
            const videoTexture = Material.Texture.Video({ videoPlayerEntity: entityInfo.entity })
            Material.setPbrMaterial(entityInfo.entity, {
                texture: videoTexture,
                roughness: material.roughness,
                specularIntensity: material.intensity,
                metallic: material.metallic,
                emissiveColor: material.emissiveColor ? material.emissiveColor : undefined,
                emissiveIntensity: material.emissiveIntensity ? material.emissiveIntensity : undefined,
                emissiveTexture: material.emissiveTexture ? videoTexture : undefined
            })
            break;
    }
}