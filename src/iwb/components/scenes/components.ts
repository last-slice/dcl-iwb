import {
    Animator,
    AudioSource,
    AudioStream,
    AvatarShape,
    ColliderLayer,
    Entity,
    GltfContainer,
    Material,
    MeshCollider,
    MeshRenderer,
    NftShape,
    TextShape,
    Transform,
    VideoPlayer,
    VisibilityComponent,
    engine
} from "@dcl/sdk/ecs";
import {COLLISION_LAYERS, COMPONENT_TYPES, IWBScene, MATERIAL_TYPES, Materials, SCENE_MODES, SceneItem, SelectedItem} from "../../helpers/types";
import {Color3, Color4} from "@dcl/sdk/math";
import {localPlayer, localUserId, players} from "../player/player";
import {entitiesFromItemIds, realmActions, sceneBuilds} from ".";
import {getRandomString, log} from "../../helpers/functions";
import { AudioLoadedComponent, GLTFLoadedComponent, SmartItemLoadedComponent, VideoLoadedComponent, VisibleLoadedComponent } from "../../helpers/Components";
import { resetEntityForBuildMode, selectedItem } from "../modes/build";
import { items } from "../catalog";
import { catalogSoundEntity } from "../sounds";
import { utils } from "../../helpers/libraries";
import { runTrigger } from "../modes/play";

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
        VisibleLoadedComponent.create(entity, {init:false, sceneId:scene.id})
    }
}

export function createGltfComponent(scene:IWBScene, entity:Entity, item:SceneItem){
    if(item.pending){
        MeshRenderer.setBox(entity)
    }else{
        let gltf:any = {
            src:"assets/" + item.id + ".glb",
            invisibleMeshesCollisionMask: item.colComp && item.colComp.iMask ? item.colComp && item.colComp.iMask : undefined,
            visibleMeshesCollisionMask: item.colComp && item.colComp.vMask ? item.colComp && item.colComp.vMask : undefined
        }
        GltfContainer.create(entity, gltf)

        if(item.animComp && item.animComp.enabled){
            console.log("item has anim comp", item.animComp)
            addAnimationComponent(scene, entity, item)
        }
    }
    GLTFLoadedComponent.create(entity, {init:false, sceneId:scene.id})
}

export function createVideoComponent(sceneId:string, entity:Entity, item:SceneItem){
    VideoPlayer.create(entity, {
        src: item.vidComp.url,
        playing: false,
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

    VideoLoadedComponent.create(entity, {init:false, sceneId:sceneId})
}

export function createSmartItemComponent(scene:IWBScene, entity:Entity, item:SceneItem, name:string){
    log('creating smart item component', name)

    switch(name){
        case 'Trigger Area':
            addTriggerArea(scene, entity, item, name)
            break;

        case 'NPC':
            addNPCAvatar(scene, entity, item, name)
            break;
    }

    if(localPlayer.mode === SCENE_MODES.BUILD_MODE){
        resetEntityForBuildMode(scene, entity)
    }

    SmartItemLoadedComponent.create(entity, {init:false, sceneId:scene.id})
}

export function addTriggerArea(scene:IWBScene, entity:Entity, item:SceneItem, name:string){
    console.log('adding trigger area component', item, name)
    utils.triggers.addTrigger(
        entity, utils.NO_LAYERS, utils.LAYER_1,
        [{type: 'box', position: {x: 0, y: 0, z: 0}, scale:{x:item.s.x, y:item.s.y,z:item.s.z }}],
        ()=>{
            log('entered trigger area')
            runTrigger(item, item.trigArComp.eActions)
        },
        ()=>{
            log('left trigger area')
            runTrigger(item, item.trigArComp.lActions)
        }, Color3.create(236/255,209/255,92/255)
    )
    utils.triggers.enableTrigger(entity, item.trigArComp.enabled)
}

export function addClickArea(scene:IWBScene, entity:Entity, item:SceneItem, name:string){
    MeshCollider.setBox(entity, ColliderLayer.CL_POINTER)
}

export function updateImageUrl(aid:string, materialComp:any, url:string, entity?:Entity){
    let ent = entity ? entity : entitiesFromItemIds.get(aid)

    if(ent){
        let texture = Material.Texture.Common({
            src: "" + url
        })

        if(materialComp.type === Materials.PBR){
            console.log('updating pbr material')
            Material.setPbrMaterial(ent, {
                // albedoColor: Color4.create(parseFloat(matComp.color[0]), parseFloat(matComp.color[1]), parseFloat(matComp.color[2]), parseFloat(matComp.color[3])),
                metallic: parseFloat(materialComp.metallic),
                roughness:parseFloat(materialComp.roughness),
                specularIntensity:parseFloat(materialComp.intensity),
                // emissiveIntensity: materialComp.emiss ? parseFloat(materialComp.emissInt) : undefined,
                texture: texture,
                // emissiveColor: materialComp.emiss ? materialComp.matComp.emissColor : undefined,
                // emissiveTexture: materialComp.emissPath !== "" ? materialComp.emissPath : undefined
              })
        }
        if(materialComp.type === Materials.BASIC){
            console.log('updating basic material')
            Material.setBasicMaterial(ent, {
                texture: texture,
              })
        }
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

export function updateVideoLoop(aid:string, looping:boolean){
    let ent = entitiesFromItemIds.get(aid)

    if(ent){
        let video = VideoPlayer.getMutable(ent)
        if(video){
            video.loop = looping
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

export function createAudioComponent(scene:any, entity:Entity, item:SceneItem){
    console.log('creating audio component', item)
    if(item.id !== "e6991f31-4b1e-4c17-82c2-2e484f53a124"){
        AudioSource.create(entity, {
            audioClipUrl: item.ugc ? "assets/" + item.id + ".mp3" : item.audComp.url,
            playing: false,
            volume: item.audComp.volume,
            loop: item.audComp.loop
        })
    }else{
        console.log('creating audio stream')
        AudioStream.create(entity, {
            url: item.audComp.url,
            playing: false,
            volume: item.audComp.volume,
        })
    }
    
    updateAudioAttach(item.aid, item.audComp)
    AudioLoadedComponent.create(entity, {init:false, sceneId:scene.id})

    if(localPlayer.mode === SCENE_MODES.BUILD_MODE){
        resetEntityForBuildMode(scene, entity)
    }
}

export function updateAudioComponent(aid:string, id:string, audComp:any,){
    updateAudioUrl(aid,id, audComp, audComp)
    updateAudioAttach(aid, audComp)
}

export function updateAudioUrl(aid:string, id:string, audComp:any, url:string){
    log('updating audio url', aid, id, audComp, url)
    let ent = entitiesFromItemIds.get(aid)

    if(ent){
        let audio:any
        if(id !== "e6991f31-4b1e-4c17-82c2-2e484f53a124"){
            audio = AudioSource.getMutable(ent)
        }
        else{
            audio = AudioStream.getMutable(ent)
        }

        if(audio){
            let restart = false
            if(audio.playing){
                restart = true
                audio.playing = false
            }
            audio.audioClipUrl = url
            audio.playing = restart
        }
    }
}

export function updateAudioAttach(aid:string, audComp:any, ){
    log('updating audio attached player', aid, audComp)
    let ent = entitiesFromItemIds.get(aid)

    if(ent){
        console.log('audio entity does exist', ent)
        Material.setPbrMaterial(ent,{
            albedoColor: Color4.create(0,0,1,.5)
        })

        if(localPlayer.mode === SCENE_MODES.BUILD_MODE){
            if(audComp.attachedPlayer){
                TextShape.createOrReplace(ent,{text:"Audio\nAttached", fontSize: 3})
            }
            else{
                TextShape.createOrReplace(ent,{text:"Audio\nPlaced", fontSize: 3})
            }
        }
    }
}

export function updateAudioLoop(aid:string, id:string, audComp:any){
    log('updating audio loop', aid, audComp)
    let ent = entitiesFromItemIds.get(aid)

    if(ent){
        let audio:any
        if(id !== "e6991f31-4b1e-4c17-82c2-2e484f53a124"){
            audio = AudioSource.getMutable(ent)
        }else{
            audio = AudioStream.getMutable(ent)
        }

        if(audio){
            audio.loop = audComp.loop
        }
    }
}

export function updateAudio(key:string, aid:string, id:string, audComp:any){
    log('updating audio loop', aid, audComp)
    let ent = entitiesFromItemIds.get(aid)

    if(ent){
        let audio:any
        if(id !== "e6991f31-4b1e-4c17-82c2-2e484f53a124"){
            audio = AudioSource.getMutable(ent)
        }
        else{
            audio = AudioStream.getMutable(ent)
        }

        if(audio){
            audio[key] = audComp[key]
        }
    }
}

export function updateAudioPlaying(aid:string, playing:boolean){
    let ent = entitiesFromItemIds.get(aid)

    if(ent){
        let audioSource = AudioSource.getMutable(ent)
        if(audioSource){
            audioSource.playing = playing
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
                    if(entity && !asset.pending){
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
    log('updating text component', aid, materialComp, textComp)
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

export function updateMaterialComponent(aid:string, materialComp:any, entity?:Entity){
    let ent = entity ? entity : entitiesFromItemIds.get(aid)

    if(ent){
        // let texture = Material.Texture.Common({
        //     src: "" + url
        // })

        if(materialComp.type === "pbr"){
            Material.setPbrMaterial(ent, {
        
                albedoColor: Color4.create(parseFloat(materialComp.color[0]), parseFloat(materialComp.color[1]), parseFloat(materialComp.color[2]), parseFloat(materialComp.color[3])),
                metallic: parseFloat(materialComp.metallic),
                roughness:parseFloat(materialComp.roughness),
                specularIntensity:parseFloat(materialComp.intensity),
                emissiveIntensity: materialComp.emissPath !== "" ? parseFloat(materialComp.emissInt) : undefined,
                emissiveColor: materialComp.emissColor.length > 0 ? Color4.create(parseFloat(materialComp.color[0]), parseFloat(materialComp.color[1]), parseFloat(materialComp.color[2]), parseFloat(materialComp.color[3])) : undefined,
                emissiveTexture: materialComp.emissPath !== "" ? materialComp.emissPath : undefined
              })
        }else{
        }
    }
}

export function addAnimationComponent(scene:IWBScene, entity:Entity, item:SceneItem){
    let animations:any[] = []

    item.animComp.animations.forEach((animation:string, i:number)=>{
        let anim:any = {
            clip:animation,
            playing: false,
            loop: false
        }
        animations.push(anim)
    })

    Animator.createOrReplace(entity, {
        states:animations//
    })

    console.log('animator is now', Animator.get(entity))
}

export function playAudioFile(catalogId?:string){
    let itemData = items.get(catalogId ? catalogId : selectedItem.catalogId)

    if(itemData){
        if(itemData.id !== "e6991f31-4b1e-4c17-82c2-2e484f53a124"){
            AudioSource.createOrReplace(catalogSoundEntity, {
                audioClipUrl:  "assets/" + itemData.id + ".mp3",
                loop:false,
                playing:true
            })
        }else{
            console.log('trying to preview audio stream')
            AudioStream.createOrReplace(catalogSoundEntity, {
                url: selectedItem.itemData.audComp.url,
                playing:true,
            })
        }
    }
}

export function stopAudioFile(catalogId?:string){
    let audio:any
    let itemData = items.get(catalogId ? catalogId : selectedItem.catalogId)
    let entity = catalogId ? catalogSoundEntity : selectedItem.entity

    if(itemData){
        if(itemData.id !== "e6991f31-4b1e-4c17-82c2-2e484f53a124"){
            audio = AudioSource.getMutable(entity)
        }else{
            audio = AudioStream.getMutable(entity)
        }
        audio.playing = false
    }
}

export function playVideoFile(){
    let video:any
    let itemData = items.get(selectedItem.catalogId)

    if(itemData){
        video = VideoPlayer.getMutable(selectedItem.entity)
        video.playing = true
    }
}

export function stopVideoFile(){
    let video:any
    let itemData = items.get(selectedItem.catalogId)

    if(itemData){
        video = VideoPlayer.getMutable(selectedItem.entity)
        video.playing = false
    }
}

export function addNPCAvatar(scene:IWBScene, entity:Entity, item:SceneItem, name:string){
    console.log('creating npc', item.npcComp)
    AvatarShape.createOrReplace(entity, {
        id: item.npcComp ? item.npcComp.name : getRandomString(5),
        name: item.npcComp ? item.npcComp.name : "",
        bodyShape:  item.npcComp && item.npcComp.bodyShape == 0 ? "urn:decentraland:off-chain:base-avatars:BaseMale" :  "urn:decentraland:off-chain:base-avatars:BaseFemale", 
        wearables:[],
        emotes:[],
        hairColor:  item.npcComp ?  Color4.create(item.npcComp.hairColor.r / 255, item.npcComp.hairColor.g / 255, item.npcComp.hairColor.b / 255) : undefined,
        skinColor: item.npcComp ?  Color4.create(item.npcComp.skinColor.r  / 255, item.npcComp.skinColor.g / 255, item.npcComp.skinColor.b / 255) : undefined,
        eyeColor: item.npcComp ?   Color4.create(item.npcComp.eyeColor.r  / 255, item.npcComp.eyeColor.g / 255, item.npcComp.eyeColor.b / 255) : undefined
    })
}//