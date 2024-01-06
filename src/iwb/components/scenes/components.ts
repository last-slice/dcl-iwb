import { Entity, GltfContainer, VideoPlayer, Material, VisibilityComponent, MeshCollider, NftShape, NftFrameType, TextShape, Font } from "@dcl/sdk/ecs";
import { COLLISION_LAYERS, COMPONENT_TYPES, EDIT_MODES, IWBScene, SCENE_MODES, SceneItem } from "../../helpers/types";
import { Color4 } from "@dcl/sdk/math";
import { localPlayer, localUserId, players } from "../player/player";
import { entitiesFromItemIds, sceneBuilds } from ".";
import { log } from "../../helpers/functions";

export function createVisibilityComponent(scene:IWBScene, entity:Entity, item:SceneItem){
    if(item.comps.includes(COMPONENT_TYPES.VISBILITY_COMPONENT)){
        let visible = false

        let mode = players.get(localUserId)?.mode
        if(mode === SCENE_MODES.PLAYMODE){
            if(scene.o === localUserId){
                if(scene.e){
                    visible = item.visComp.visible
                }
            }else{
                if(scene.e && !scene.priv){
                    visible = true
                }
            }
        }
        else{
            if(scene.o === localUserId || scene.bps.includes(localUserId)){
                if(scene.e){
                    visible = true
                }
            }
        }

        VisibilityComponent.create(entity, {
            visible:  visible
        })
    }
}

export function createGltfComponent(entity:Entity, item:SceneItem){
    // log('creating gltf component', item.id)
    let gltf:any = {
        src:"assets/" + item.id + ".glb",
        invisibleMeshesCollisionMask: item.colComp && item.colComp.iMask ? item.colComp && item.colComp.iMask : undefined,
        visibleMeshesCollisionMask: item.colComp && item.colComp.vMask ? item.colComp && item.colComp.vMask : undefined
    }
    GltfContainer.create(entity, gltf)
}

export function createVideoComponent(entity:Entity, item:SceneItem){
    VideoPlayer.create(entity, {
        src: item.vidComp.url,
        playing: item.vidComp.autostart,
        volume: item.vidComp.volume,
        loop: item.vidComp.loop
    })

    const videoTexture = Material.Texture.Video({ videoPlayerEntity: entity })

    Material.setPbrMaterial(entity, {
        texture: videoTexture,
        roughness: 1.0,
        specularIntensity: 0,
        metallic: 0,
        emissiveColor:Color4.White(),
        emissiveIntensity: 1,
        emissiveTexture: videoTexture
    })
}


export function updateImageUrl(aid:string, materialComp:any, url:string, entity?:Entity){
    // log('updating image url', aid, materialComp, url)
    let ent = entity ? entity : entitiesFromItemIds.get(aid)
    
    if(ent){
        let texture = Material.Texture.Common({
            src: "" + url
        })
        
        Material.setPbrMaterial(ent, {
            // albedoColor: Color4.create(parseFloat(matComp.color[0]), parseFloat(matComp.color[1]), parseFloat(matComp.color[2]), parseFloat(matComp.color[3])),
            metallic: parseFloat(materialComp.metallic),
            roughness:parseFloat(materialComp.roughness),
            specularIntensity:parseFloat(materialComp.intensity),
            emissiveIntensity: materialComp.emissPath !== "" ? parseFloat(materialComp.emissInt) : undefined,
            texture: texture,
            // emissiveColor: item.matComp.emissPath !== "" ? item.matComp,
            emissiveTexture: materialComp.emissPath !== "" ? materialComp.emissPath : undefined
          })
    }
}

export function updateVideoPlaying(aid:string, playing:boolean){
    let ent = entitiesFromItemIds.get(aid)

    if(ent){
        let video = VideoPlayer.getMutable(ent)
        if(video){
            video.playing = playing
        }
    }
}

export function updateVideoAutostart(aid:string, autostart:boolean){
}

export function updateVideoVolume(aid:string, volume:number){
    let ent = entitiesFromItemIds.get(aid)

    if(ent){
        let video = VideoPlayer.getMutable(ent)
        if(video){
            video.volume = volume
        }
    }
}

export function updateVideoUrl(aid:string, materialComp:any, url:string){
    // log('updating video url', aid, materialComp, url)
    let ent = entitiesFromItemIds.get(aid)

    if(ent){
        let video = VideoPlayer.getMutable(ent)
        if(video){
            let restart = false
            if(video.playing){
                restart = true
                video.playing = false
            }
            video.src = url
            video.playing = restart
        }
    }
}

export function updateCollision(sceneId:string, assetId:string, layer:string, value:number){
    let entity = entitiesFromItemIds.get(assetId)
    let scene = sceneBuilds.get(sceneId)
    if(scene){
        let asset = scene.ass.find((asset:any)=> asset.aid === assetId)
        if(asset){
            switch(asset.type){
                case '3D':
                    if(entity){
                        let gltf = GltfContainer.getMutable(entity)
                        if(gltf){
                            if(layer === COLLISION_LAYERS.INVISIBLE){
                                gltf.invisibleMeshesCollisionMask = value
                            }
                
                            if(layer === COLLISION_LAYERS.VISIBLE){
                                gltf.visibleMeshesCollisionMask = value
                            }
                        }
                    }
                    break;

                case '2D':
                    log('update 2d collision')

                    break;
            }
        }
    }
}

export function updateNFTFrame(aid:string, materialComp:any, nftComp:any, entity?:Entity){
    // log('updating nft image', aid, materialComp, nftComp)
    let ent = entity ? entity : entitiesFromItemIds.get(aid)
    
    if(ent){
        NftShape.createOrReplace(ent, {
            urn: 'urn:decentraland:ethereum:erc721:' + nftComp.contract + ':' + nftComp.tokenId,
            style: nftComp.style
          })

        if(localPlayer.mode === SCENE_MODES.BUILD_MODE && !MeshCollider.has(ent)){
            MeshCollider.setBox(ent)
        }
    }
}

export function updateTextComponent(aid:string, materialComp:any, textComp:any, entity?:Entity){
    // log('updating text component', aid, materialComp, textComp)
    let ent = entity ? entity : entitiesFromItemIds.get(aid)
    
    if(ent){
        TextShape.createOrReplace(ent,{
            text: textComp.text,
            textColor: textComp.color,
            font: textComp.font,
            fontSize: textComp.fontSize,
            textAlign: textComp.align,
            outlineWidth: textComp.outlineWidth > 0 ? textComp.outlineWidth : undefined,
            outlineColor: textComp.outlineWidth > 0 ? textComp.outlineColor : undefined
        })
    }
}