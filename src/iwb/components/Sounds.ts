import { AudioSource, AudioStream, AvatarAnchorPointType, AvatarAttach, ColliderLayer, Entity, Material, MeshCollider, MeshRenderer, PBTextShape, TextShape, Transform, VisibilityComponent, engine } from "@dcl/sdk/ecs"
import { getEntity } from "./IWB"
import { Color4 } from "@dcl/sdk/math"
import { AUDIO_TYPES, CATALOG_IDS, COMPONENT_TYPES, SOUND_TYPES } from "../helpers/types"
import { log, getRandomIntInclusive } from "../helpers/functions"
import { utils } from "../helpers/libraries"
import resources from "../helpers/resources"
import { items } from "./Catalog"
import { AudioLoadedComponent } from "../helpers/Components"
import { updateTransform } from "./Transform"
import { sceneEdit, selectedItem } from "../modes/Build"
import { APP_NAME, chooseServer, getServers, initAudiusServers, server, updateAudiusInit } from "../ui/Objects/IWBViews/MusicView"
import { colyseusRoom } from "./Colyseus"
import { localPlayer } from "./Player"

export function checkAudioComponent(scene:any, entityInfo:any){
    let itemInfo = scene[COMPONENT_TYPES.AUDIO_COMPONENT].get(entityInfo.aid)
    if(itemInfo){
        AudioSource.create(entityInfo.entity, {
            audioClipUrl: itemInfo.url,
            playing: false,
            volume: itemInfo.volume,
            loop: itemInfo.loop
        })
        AudioStream.create(entityInfo.entity, {
            url: "" + itemInfo.url,
            playing: false,
            volume: itemInfo.volume
        })
        AudioLoadedComponent.createOrReplace(entityInfo.entity, {init:false, sceneId:scene.id})
    }
}

export function checkAudioSourceComponent(scene:any, entityInfo:any){
    // let itemInfo = scene[COMPONENT_TYPES.AUDIO_SOURCE_COMPONENT].get(entityInfo.aid)
    // if(itemInfo){
    //     AudioSource.create(entityInfo.entity, {
    //         audioClipUrl: itemInfo.url,
    //         playing: false,
    //         volume: itemInfo.volume,
    //         loop: itemInfo.loop
    //     })
    //     AudioStream.create(entityInfo.entity, {
    //         url: "" + itemInfo.url,
    //         playing: false,
    //         volume: itemInfo.volume
    //     })
    //     AudioLoadedComponent.createOrReplace(entityInfo.entity, {init:false, sceneId:scene.id})
    // }
}

export function checkAudioStreamComponent(scene:any, entityInfo:any){
    // let itemInfo = scene[COMPONENT_TYPES.AUDIO_STREAM_COMPONENT].get(entityInfo.aid)
    // if(itemInfo){
    //     AudioStream.create(entityInfo.entity, {
    //         url: itemInfo.url,
    //         playing: false,
    //         volume: itemInfo.volume,
    //     })
    //     AudioLoadedComponent.createOrReplace(entityInfo.entity, {init:false, sceneId:scene.id})
    // }
}

export function setAudioBuildMode(scene:any, entityInfo:any) {
    let audio:any

    let itemInfo = scene[COMPONENT_TYPES.AUDIO_COMPONENT].get(entityInfo.aid)
    if(itemInfo){
        console.log('setting audio for build mode')
        MeshRenderer.setBox(entityInfo.entity)
        MeshCollider.setBox(entityInfo.entity, ColliderLayer.CL_POINTER)

        let name = scene[COMPONENT_TYPES.NAMES_COMPONENT].get(entityInfo.aid)
        if(name){
            TextShape.createOrReplace(entityInfo.entity, {text: "" + name.value, fontSize: 3})
        }

        updateTransform(scene, entityInfo.aid, scene[COMPONENT_TYPES.TRANSFORM_COMPONENT].get(entityInfo.aid))

        switch(itemInfo.type){
            case 0:
                audio = AudioSource.getMutableOrNull(entityInfo.entity)
                if(audio){
                    audio.playing = false
                }
                break;

            case 1:
            case 2:
            case 3:
                audio = AudioStream.getMutableOrNull(entityInfo.entity)
                if(audio){
                    audio.playing = false
                }
                break;
        }
    }
}

export function setAudioPlayMode(scene:any, entityInfo:any){
    if (AudioLoadedComponent.has(entityInfo.entity) && !AudioLoadedComponent.get(entityInfo.entity).init){
        let audioSource = scene[COMPONENT_TYPES.AUDIO_COMPONENT].get(entityInfo.aid)
        if(audioSource){
            MeshRenderer.deleteFrom(entityInfo.entity)
            MeshCollider.deleteFrom(entityInfo.entity)
            TextShape.deleteFrom(entityInfo.entity)

            if(audioSource.attach){
                Transform.createOrReplace(entityInfo.entity, {parent:engine.PlayerEntity})
            }

            let audio:any
            switch(audioSource.type){
                case 0:
                    audio = AudioSource.getMutableOrNull(entityInfo.entity)
                    if(audio){
                        audio.playing = false
                        audio.loop = audioSource.loop
                        audio.volume = audioSource.volume
                    }
                    break;

                case 1:
                case 2:
                case 3:
                    audio = AudioStream.getMutableOrNull(entityInfo.entity)
                    if(audio){
                        audio.playing = false
                        audio.volume = audioSource.volume
                    }
                    break;
            }
        }


        AudioLoadedComponent.getMutable(entityInfo.entity).init = true
    }
}

export function disableAudioPlayMode(scene:any, entityInfo:any){
    let audioSource = scene[COMPONENT_TYPES.AUDIO_COMPONENT].get(entityInfo.aid)
    console.log('disabling audio play mode', audioSource)
    let audio:any
    // if(audioSource){
        audio = AudioSource.getMutableOrNull(entityInfo.entity)
        // console.log('audio soruce is', audio)
        if(audio){
            audio.playing = false
        }
    // }

    // if(audioStream){
        audio = AudioStream.getMutableOrNull(entityInfo.entity)
        if(audio){
            audio.playing = false
        }
    // }
}

// export function getAudio(scene:any, aid:string){
//     return scene[COMPONENT_TYPES.SOUND_COMPONENT].get(aid)
// }

export function updateSoundAttachView(scene:any, aid:string, attach:boolean, entityInfo:any){

    // if(attach){

    // }else{
    //     updateTransform(scene, entityInfo.aid, scene[COMPONENT_TYPES.TRANSFORM_COMPONENT].get(entityInfo.aid))
    // }
    // TextShape.createOrReplace(entityInfo.entity,{text:"" + (attach ? "Audio\nAttached" : "Audio\nPlaced"), fontSize: 3})
}

export function updateSoundURL(entity:Entity, url:string){
    let audio = AudioSource.getMutable(entity)
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

export function updateSoundLoop(entity:Entity, loop:boolean){
    let audio = AudioSource.getMutable(entity)
    if(audio){
        audio.loop = loop
    }
}

export function updateSoundVolume(entity:Entity, volume:number){
    let audio = AudioSource.getMutable(entity)
    if(audio){
        audio.volume = volume
    }
}

export function updateSoundAutostart(entity:Entity, auto:boolean){
    let audio:any = AudioSource.getMutable(entity)
    if(audio){
    }
}

export function soundsListener(scene:any){
    scene[COMPONENT_TYPES.AUDIO_COMPONENT].onAdd((sound:any, aid:any)=>{
        let info = getEntity(scene, aid)
        if(!info){
            return
        }

        // sound.listen("url", (c:any, p:any)=>{
        //     if(p !== undefined){
        //         updateSoundURL(info.entity, c)
        //         AudioLoadedComponent.createOrReplace(info.entity, {init:false, sceneId:scene.id})
        //     }
        // })

        // sound.listen("attach", (c:any, p:any)=>{
        //     if(p !== undefined){
        //         updateSoundAttachView(scene, aid, c, info)
        //         AudioLoadedComponent.createOrReplace(info.entity, {init:false, sceneId:scene.id})
        //     }
        // })

        // sound.listen("volume", (c:any, p:any)=>{
        //     if(p !== undefined){
        //         updateSoundVolume(info.entity, c)
        //         AudioLoadedComponent.createOrReplace(info.entity, {init:false, sceneId:scene.id})
        //     }
        // })

        // sound.listen("loop", (c:any, p:any)=>{
        //     if(p !== undefined){
        //         updateSoundLoop(info.entity, c)
        //         AudioLoadedComponent.createOrReplace(info.entity, {init:false, sceneId:scene.id})
        //     }
        // })

        // sound.listen("autostart", (c:any, p:any)=>{
        //     if(p !== undefined){
        //         updateSoundAutostart(info.entity, c)
        //         AudioLoadedComponent.createOrReplace(info.entity, {init:false, sceneId:scene.id})
        //     }
        // })
    })
}




//system sounds
export let sounds:Map<string,any> = new Map()
export let audioClips = new Map<string, any>()
export let catalogSoundEntity:Entity

export let buildPlaylist:any[] = []
export let buildPlaylistIndex:number = 0
export let playlistEntity:Entity

let loopTimes = -1
let playedTimes = 0
let builderPlaylistVolume = 0.1

let timeout:any

export async function createSounds(){
    catalogSoundEntity = engine.addEntity()
    AudioSource.create(catalogSoundEntity)
    AudioStream.create(catalogSoundEntity)
    // AvatarAttach.create(catalogSoundEntity,
    //     {avatarId: localUserId,
    //         anchorPointId: AvatarAnchorPointType.AAPT_HEAD
    //     }
    // )
    Transform.createOrReplace(catalogSoundEntity, {parent:engine.PlayerEntity})

    // let catalog = [...items.values()].filter((it:any)=> !it.ugc)

    // resources.audioClips.forEach((clip)=>{
    //     audioClips.set(clip.key, catalog.find((item:any)=> item.n === clip.name))
    // })

    // resources.audioClips.forEach((sound)=>{
    //     const sEntity = engine.addEntity()
    //     let data:any = {
    //         vol: sound.volume ? sound.volume : 1,
    //         loop:sound.loop,
    //         sound:sEntity
    //     }

    //     AudioSource.create(sEntity, {
    //         audioClipUrl: "assets/" + catalog.find((item:any)=> item.ty === "Audio" && item.n === sound.name)?.id + ".mp3",
    //         loop: sound.loop,
    //         playing: false
    //     })

    //     if(sound.attach){
    //         Transform.create(sEntity, {
    //             parent: engine.PlayerEntity
    //         })
    //     }else{
    //         // if(sound.pos){
    //         //     angzaarLog("adding position to sound")//
    //         //     Transform.create(sEntity, {
    //         //         position: sound.pos,    
    //         //     })
    //         //     MeshRenderer.setBox(sEntity)
    //         // }
    //     }
    //     sounds.set(sound.key, data)
    // })
    createPlaylists()
}

export function playSound(key:SOUND_TYPES | string, volume?:number, loop?:boolean){
    let sound = sounds.get(key)
    log('sound is', sound)
    if(sound){
        if(sound.loop || loop){
            playLoop(sound,volume)
        }
        else{
            playOnce(sound,volume)
        }    
    }
}

export function stopSound(id:string){
    const sound = sounds.get(id)
    if(sound){
        const audioSource = AudioSource.getMutable(sound.sound)
        audioSource.playing = false
    }
}

export function playOnce(sound:any, volume?:number){
    let vol = 1
    const audioSource = AudioSource.getMutable(sound.sound)
    audioSource.playing = false
    audioSource.volume = volume ? volume : vol
    audioSource.playing = true
}

function playLoop(id:string, volume?:number){
    let vol = 1
    const sound = sounds.get(id)
    const audioSource = AudioSource.getMutable(sound.sound)
    audioSource.playing = false
    if(volume){
        vol = volume
    }   
    else{
        vol = sounds.get(id).vol
    }
    audioSource.volume = vol
    audioSource.loop = true
    audioSource.playing = true
}

export function createPlaylists(){
    playlistEntity = engine.addEntity()
    Transform.createOrReplace(playlistEntity, {parent:engine.PlayerEntity})
    AudioSource.create(playlistEntity, {
        volume: builderPlaylistVolume,
        audioClipUrl:"",
        loop:true,
        playing:false
    })

    buildPlaylist = [...items.values()].filter((item:any)=> item.ty === "Audio" && item.cat === "Loops")

    // playPlaylist()
}

export function playPlaylist(){
    if(AudioSource.has(playlistEntity) && !AudioSource.get(playlistEntity).playing){
        buildPlaylistIndex = getRandomIntInclusive(0, buildPlaylist.length - 1)
        stopPlaylist()
        playNextSong()
    }
}

export function stopPlaylist(){
    AudioSource.getMutable(playlistEntity).playing = false
}

export function playNextSong(seek?:number, loop?:boolean){
    if(seek){
        utils.timers.clearTimeout(timeout)
        buildPlaylistIndex += seek
        buildPlaylistIndex <= 0 ? buildPlaylistIndex = 0 : null
    }

    let player = AudioSource.getMutable(playlistEntity)
    player.playing = false 

    playedTimes = 0
    loopTimes = 0

    // let playlist = playlistData[playlistName]
    // let item = audioItems.find((audio:any)=> audio.n === playlist[playlistIndex])

    let song = buildPlaylist[buildPlaylistIndex]
    loopTimes = song.len < 5 ? 7 : 5 // need to determine how many times to loop based on song length

    console.log('song is', song, builderPlaylistVolume)

    AudioSource.createOrReplace(playlistEntity,{
        volume: builderPlaylistVolume,
        audioClipUrl: "assets/" + song.id + ".mp3",
        playing:true,
        loop:true
    })

    timeout = utils.timers.setTimeout(()=>{
        loopTrack()
    }, 1000 * song.len ? song.len : 3)
}

export function stopBuildSong(){
    utils.timers.clearTimeout(timeout)
    stopPlaylist()
}

export function changeBuildVolume(direction:number){
    builderPlaylistVolume += direction
    let audio = AudioSource.getMutable(playlistEntity)
    if(audio){
        audio.volume = builderPlaylistVolume
    }
}

function loopTrack(){
    playedTimes++
    console.log(playedTimes, loopTimes)
    if(playedTimes >= loopTimes){
        utils.timers.clearTimeout(timeout)
        playNextSong(1)
    }
}

export async function playAudioFile(catalogId?:string, streamId?:string, custom?:boolean){
    if(streamId){
        Transform.createOrReplace(catalogSoundEntity, {parent:engine.PlayerEntity})

        let url:any
        if(custom){
            url = streamId
        }else{
            if(!initAudiusServers){
                updateAudiusInit(true)
                await getServers()
            }
            chooseServer()
            url = server + "/" + resources.audius.endpoints.stream + "/" + streamId + "/stream?app_name=" + APP_NAME + "&t=" +Math.floor(Date.now()/1000)
        }

        AudioStream.createOrReplace(catalogSoundEntity,
            {
                url:url,
                playing:true,
                volume:1
            }
        )
    }
    else{
        let itemData = items.get(catalogId ? catalogId : selectedItem.catalogId)
        if(itemData){
            if(itemData.id !== CATALOG_IDS.AUDIO_STREAM){
                console.log('not audio stream', itemData)
    
                Transform.createOrReplace(catalogSoundEntity, {parent:engine.PlayerEntity})
    
                // let clip = AudioSource.getMutableOrNull(catalogSoundEntity)
                // if(!clip){
    
                // }
                // clip.playing = false
                // clip.audioClipUrl = "assets/" + itemData.id + ".mp3"
                // clip.playing = true
                AudioSource.createOrReplace(catalogSoundEntity, {
                    audioClipUrl:  "assets/" + itemData.id + ".mp3",
                    loop:false,
                    playing:true,
                    volume:1
                })
                
                // clip.volume = 10
                // clip.playing = true
    
                // AudioSource.playSound(catalogSoundEntity, "asset/" + itemData.id + ".mp3")
                
                // AudioStream.createOrReplace(catalogSoundEntity, {
                //     url: "assets/" + itemData.id + ".mp3",
                //     playing:true,
                // })//
                
            }else{
                console.log('trying to preview audio stream')
                let streamInfo = sceneEdit[COMPONENT_TYPES.AUDIO_COMPONENT].get(selectedItem.aid)
                console.log("stream info is", streamInfo)
                if(streamInfo && streamInfo.type > 0){
                    Transform.createOrReplace(catalogSoundEntity, {parent:engine.PlayerEntity})
                    AudioStream.createOrReplace(catalogSoundEntity, {
                        url: streamInfo.url,
                        playing:true,
                        volume: streamInfo.volume
                    })
                }
            }
        }
    }
    
}

export function playAudioStream(){

}

export function stopAudioFile(catalogId?:string, stream?:boolean){
    if(stream){
        let audio = AudioStream.getMutableOrNull(catalogSoundEntity)
        if(audio){
            audio.playing = false
        }
    }else{
        let audio:any
        let itemData = items.get(catalogId ? catalogId : selectedItem.catalogId)
        // let entity = catalogId ? catalogSoundEntity : selectedItem.entity
    
        if(itemData){
            if(itemData.id !== CATALOG_IDS.AUDIO_STREAM){
                audio = AudioSource.getMutable(catalogSoundEntity)
                // audio.playing = false
            }else{
                audio = AudioStream.getMutable(catalogSoundEntity)
                // audio.playing = false//
            }
            audio.playing = false
        }
        // AudioStream.getMutable(catalogSoundEntity).playing = false
    }
}

export function AudioFinishedSystem(dt:number){
    for (const [entity] of engine.getEntitiesWith(AudioSource)) {
        let audio = AudioSource.getMutableOrNull(entity)
        if(audio){
            console.log('audio playing', audio.playing, entity)
        }
        
    }
}

export async function searchAudius(filter:string, url?:string){
    if(!initAudiusServers){
        updateAudiusInit(true)
        await getServers()
    }
    chooseServer()

    let search = await fetch(server + "/" + (url ? url : resources.audius.endpoints.search) + filter)
    let jsonSearch = await search.json()
    console.log('search was ', jsonSearch)
    if(jsonSearch.data && jsonSearch.data.length > 0){
        return jsonSearch.data
    }else{
        return []
    }
}

export async function playAudiusTrack(info:any){
    let scene = colyseusRoom.state.scenes.get(info.sceneId)
    if(!scene || localPlayer.activeScene.id !== scene.id){
        console.log('invalid scene, will not play audius track')
        return
    }

    let entityInfo = getEntity(scene, info.playlistAid)
    if(!entityInfo){
        console.log('error with entity info, will not play audius track')
        return
    }

    let audio = AudioStream.getMutableOrNull(entityInfo.entity)
    if(audio){
        audio.playing = false
    }

    if(!initAudiusServers){
        updateAudiusInit(true)
        await getServers()
    }
    chooseServer()


    AudioStream.createOrReplace(info.entity,
        {
            url:server + "/" + resources.audius.endpoints.stream + "/" + info.track + "/stream?app_name=" + APP_NAME + "&t=" +Math.floor(Date.now()/1000),
            playing:true,
            volume:1
        }
    )
}