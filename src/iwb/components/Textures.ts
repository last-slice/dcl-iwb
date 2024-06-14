import { ColliderLayer, GltfContainer, Material, MeshCollider, MeshRenderer, Transform } from "@dcl/sdk/ecs"
import { getEntity } from "./IWB"
import { Color4 } from "@dcl/sdk/math"
import { COMPONENT_TYPES } from "../helpers/types"

export function checkTextureComponent(scene:any, entityInfo:any){
    let itemInfo = scene[COMPONENT_TYPES.TEXTURE_COMPONENT].get(entityInfo.aid)
    if(itemInfo){
        let materialInfo = scene.materials.get(entityInfo.aid)
        // let emissiveInfo = scene.emissives.get(entityInfo.aid)
        
        switch(itemInfo.type){
            case 0:
                switch(materialInfo.type){
                    case 0:
                        Material.setPbrMaterial(entityInfo.entity, {
                            texture: itemInfo.path ?
                            Material.Texture.Common({
                                src: itemInfo.path
                            })
                            : undefined,
        
                            // emissiveTexture: emissiveInfo && emissiveInfo.path?
                            // Material.Texture.Common({
                            //     src: emissiveInfo.path
                            // })
                            // : undefined,
        
                            // emissiveColor: emissiveInfo ?
                            // Color4.create(emissiveInfo.color.r, emissiveInfo.color.g, emissiveInfo.color.b, emissiveInfo.color.a)
                            // : undefined,
        
                            // emissiveIntensity: emissiveInfo ? 
                            // emissiveInfo.intensity
                            // : undefined,
        
                            albedoColor: materialInfo.albedoColor ? 
                            Color4.create(materialInfo.albedoColor.r, materialInfo.albedoColor.g, materialInfo.albedoColor.b, materialInfo.albedoColor.a)
                            : undefined
                        })
                        break;
                }
                break;
            case 1:
                const videoTexture = Material.Texture.Video({ videoPlayerEntity: entityInfo.entity })
                Material.setPbrMaterial(entityInfo.entity, {
                    texture: videoTexture,
                    roughness: 1.0,
                    specularIntensity: 0,
                    metallic: 0,

                    // emissiveColor: emissiveInfo ?
                    // Color4.create(emissiveInfo.color.r, emissiveInfo.color.g, emissiveInfo.color.b, emissiveInfo.color.a)
                    // : undefined,

                    // emissiveIntensity: emissiveInfo ? 
                    // emissiveInfo.intensity
                    // : undefined,

                    emissiveTexture: videoTexture
                })
                break;
        }
    }
}

export function textureListener(scene:any){
    scene[COMPONENT_TYPES.TEXTURE_COMPONENT].onAdd((texture:any, aid:any)=>{
        // let iwbInfo = scene[COMPONENT_TYPES.PARENTING_COMPONENT].find(($:any)=> $.aid === aid)
        // if(!iwbInfo.components.includes(COMPONENT_TYPES.TEXTURE_COMPONENT)){
        //   iwbInfo.components.push(COMPONENT_TYPES.TEXTURE_COMPONENT)
        // }

        let entityInfo = getEntity(scene, aid)
        if(!entityInfo){
            return
        }

        texture.listen("path", (c:any, p:any)=>{
            checkTextureComponent(scene, entityInfo)
        })
    })
}