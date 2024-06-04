import { ColliderLayer, GltfContainer, Material, MeshCollider, MeshRenderer, Transform } from "@dcl/sdk/ecs"
import { getEntity } from "./IWB"
import { Color4 } from "@dcl/sdk/math"

export function checkMaterialComponent(scene:any, entityInfo:any){
    // let material = scene.materials.get(entityInfo.aid)
    // if(material){
    //     switch(material.type){
    //         case 'video':
    //             const videoTexture = Material.Texture.Video({ videoPlayerEntity: entityInfo.entity })
    //             Material.setPbrMaterial(entityInfo.entity, {
    //                 texture: videoTexture,
    //                 roughness: 1.0,
    //                 specularIntensity: 0,
    //                 metallic: 0,
    //                 emissiveColor:Color4.White(),
    //                 emissiveIntensity: 1,
    //                 emissiveTexture: videoTexture
    //             })
    //             break;

    //         case 'pbr':
    //             Material.setPbrMaterial(entityInfo.entity, {
    //                 texture: material.texture ?
    //                 Material.Texture.Common({
    //                     src: material.texture.src
    //                 })
    //                 : undefined
    //                 ,

    //                 emissiveTexture: material.emissive && material.emissive.src?
    //                 Material.Texture.Common({
    //                     src: material.emissive.src
    //                 })
    //                 : undefined,

    //                 emissiveColor: material.emissive ? 
    //                 Color4.create(material.emissive.color.r, material.emissive.color.g, material.emissive.color.b, material.emissive.color.a)
    //                 : undefined,

    //                 emissiveIntensity: material.emissive ? 
    //                 material.emissiveIntensity
    //                 : undefined,

    //                 albedoColor: material.albedoColor ? 
    //                 Color4.create(material.albedoColor.r, material.albedoColor.g, material.albedoColor.b, material.albedoColor.a)
    //                 : undefined
    //             })
    //             break;
    //     }
    // }
}

export function materialListener(scene:any){
    scene.materials.onAdd((material:any, aid:any)=>{
        // material.listen("collision", (c:any, p:any)=>{
        //     if(p !== undefined){
        //         let info = getEntity(scene, aid)
        //         if(info){
        //             MeshCollider.setPlane(info.entity, mesh.p === -500 ? ColliderLayer.CL_POINTER || ColliderLayer.CL_PHYSICS : mesh.p)
        //         }
        //     }
        // })
    })
}