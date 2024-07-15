import { ColliderLayer, GltfContainer, Material, MeshCollider, MeshRenderer, Transform } from "@dcl/sdk/ecs"
import { getEntity } from "./IWB"
import { Color4 } from "@dcl/sdk/math"
import { COMPONENT_TYPES } from "../helpers/types"

export function checkMaterialComponent(scene:any, entityInfo:any){
    let material = scene[COMPONENT_TYPES.MATERIAL_COMPONENT].get(entityInfo.aid)
    if(material){
        switch(material.type){
            case 1:
                const videoTexture = Material.Texture.Video({ videoPlayerEntity: entityInfo.entity })
                Material.setPbrMaterial(entityInfo.entity, {
                    texture: videoTexture,
                    roughness: 1.0,
                    specularIntensity: 0,
                    metallic: 0,
                    emissiveColor:Color4.White(),
                    emissiveIntensity: 1,
                    emissiveTexture: videoTexture
                })
                break;

            case 0:
                Material.setPbrMaterial(entityInfo.entity, {
                    texture: material.texture ?
                    Material.Texture.Common({
                        src: material.texture.src
                    })
                    : undefined
                    ,

                    emissiveTexture: material.emissive && material.emissive.src?
                    Material.Texture.Common({
                        src: material.emissive.src
                    })
                    : undefined,

                    emissiveColor: material.emissive ? 
                    Color4.create(material.emissive.color.r, material.emissive.color.g, material.emissive.color.b, material.emissive.color.a)
                    : undefined,

                    emissiveIntensity: material.emissive ? 
                    material.emissiveIntensity
                    : undefined,

                    albedoColor: material.albedoColor ? 
                    Color4.create(material.albedoColor.r, material.albedoColor.g, material.albedoColor.b, material.albedoColor.a)
                    : undefined
                })
                break;
        }
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