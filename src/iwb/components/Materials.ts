import { ColliderLayer, GltfContainer, Material, MeshCollider, MeshRenderer, Transform, VideoPlayer } from "@dcl/sdk/ecs"
import { getEntity } from "./IWB"
import { Color4 } from "@dcl/sdk/math"
import { COMPONENT_TYPES } from "../helpers/types"
import { checkVideoComponent } from "./Videos"

export function checkMaterialComponent(scene:any, entityInfo:any){
    let material = scene[COMPONENT_TYPES.MATERIAL_COMPONENT].get(entityInfo.aid)
    if(material){
        updateMaterial(scene, material, entityInfo)
    }
}

export function materialListener(scene:any){
    scene[COMPONENT_TYPES.MATERIAL_COMPONENT].onAdd((material:any, aid:any)=>{
        // let iwbInfo = scene[COMPONENT_TYPES.PARENTING_COMPONENT].find(($:any)=> $.aid === aid)
        // if(!iwbInfo.components.includes(COMPONENT_TYPES.MATERIAL_COMPONENT)){
        //   iwbInfo.components.push(COMPONENT_TYPES.MATERIAL_COMPONENT)//
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

        material.listen("texture", (c:any, p:any)=>{
            console.log('texture changed', p, c)
            checkMaterialComponent(scene, info)
        })

       material.listen("emissveTexture", (c:any, p:any)=>{
            console.log('emissveTexture changed', p, c)
            checkMaterialComponent(scene, info)
        })

        material.listen("emissiveIntensity", (c:any, p:any)=>{
            console.log('emissiveIntensity changed', p, c)
            checkMaterialComponent(scene, info)
        })
    })
}

export async function updateMaterial(scene:any, material:any, entityInfo:any){
    switch(material.type){
        case 0:
            switch(material.textureType){
                case 'NONE':
                    Material.deleteFrom(entityInfo.entity)
                    break;

                case 'VIDEO':
                    await checkVideoComponent(scene, entityInfo, material.texture)
                        const videoTexture = Material.Texture.Video({ videoPlayerEntity: entityInfo.entity })
                        Material.setPbrMaterial(entityInfo.entity, {
                            texture: videoTexture,
                            roughness: material.roughness,
                            specularIntensity: material.intensity,
                            metallic: material.metallic,
                            emissiveColor: material.emissiveType === "COLOR" ? material.emissiveColor : undefined,
                            emissiveIntensity: material.emissiveIntensity ? material.emissiveIntensity : undefined,
                            emissiveTexture: material.emissiveType === "TEXTURE" ? videoTexture : undefined
                        })
                    break;

                case 'TEXTURE':
                    Material.setPbrMaterial(entityInfo.entity, {//
                        texture: material.textureType === "TEXTURE" ?
                        Material.Texture.Common({
                            src: material.texture ? material.texture : ""
                        })
                        : undefined
                        ,
                
                        emissiveTexture: material.emissiveType !== "NONE" ?
                        Material.Texture.Common({
                            src: material.emissiveTexture ? material.emissiveTexture : ""
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

                    case 'COLOR':
                        Material.setPbrMaterial(entityInfo.entity, {
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

                
            }
            break;

        case 1:
            break;
    }
}