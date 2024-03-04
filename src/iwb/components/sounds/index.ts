import { AudioSource, AudioStream, Entity, PBAudioSource, Transform, engine } from "@dcl/sdk/ecs";
import resources from "../../helpers/resources";
import { items } from "../catalog";
import { SOUND_TYPES } from "../../helpers/types";
import { getRandomIntInclusive, log } from "../../helpers/functions";
import { utils } from "../../helpers/libraries";

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
    Transform.createOrReplace(catalogSoundEntity, {parent:engine.PlayerEntity})

    let catalog = [...items.values()].filter((it:any)=> !it.ugc)

    resources.audioClips.forEach((clip)=>{
        audioClips.set(clip.key, catalog.find((item:any)=> item.n === clip.name))
    })

    resources.audioClips.forEach((sound)=>{
        const sEntity = engine.addEntity()
        let data:any = {
            vol: sound.volume ? sound.volume : 1,
            loop:sound.loop,
            sound:sEntity
        }

        AudioSource.create(sEntity, {
            audioClipUrl: "assets/" + catalog.find((item:any)=> item.ty === "Audio" && item.n === sound.name)?.id + ".mp3",
            loop: sound.loop,
            playing: false
        })

        if(sound.attach){
            Transform.create(sEntity, {
                parent: engine.PlayerEntity
            })
        }else{
            // if(sound.pos){
            //     angzaarLog("adding position to sound")//
            //     Transform.create(sEntity, {
            //         position: sound.pos,    
            //     })
            //     MeshRenderer.setBox(sEntity)
            // }//
        }
        sounds.set(sound.key, data)
    })
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
        loop:true
    })

    buildPlaylist = [...items.values()].filter((item:any)=> item.ty === "Audio" && item.cat === "Loops")

    playPlaylist()
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