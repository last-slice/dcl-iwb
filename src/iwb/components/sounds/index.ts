import { AudioSource, AudioStream, Entity, PBAudioSource, Transform, engine } from "@dcl/sdk/ecs";
import resources from "../../helpers/resources";
import { items } from "../catalog";
import { SOUND_TYPES } from "../../helpers/types";
import { getRandomIntInclusive, log } from "../../helpers/functions";
import { utils } from "../../helpers/libraries";

export let sounds:Map<string,any> = new Map()
export let audioClips = new Map<string, any>()
export let catalogSoundEntity:Entity

// export let playlists:any[] = []
// export let playlistName:string = "Gallery/Venue"
export let playlist:any[] = []
export let playlistIndex:number = 0
export let playlistEntity:Entity
// export let playlistPlaying:boolean = false

let loopTimes = -1
let playedTimes = 0

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
            //     angzaarLog("adding position to sound")
            //     Transform.create(sEntity, {
            //         position: sound.pos,    
            //     })
            //     MeshRenderer.setBox(sEntity)
            // }//
        }
        sounds.set(sound.key, data)
    })
    // createPlaylists()
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
    AudioSource.create(playlistEntity)

    playlist = [...items.values()].filter((item:any)=> item.ty === "Audio" && item.cat === "Loops")

    // for (const item of audioItems) {
    //   const { sty, n, cat, len } = item;



    AudioSource.onChange(playlistEntity, (info:any)=>{
        console.log('audio change', info)
    })

    playPlaylist()
}

export function playPlaylist(){
    playlistIndex = getRandomIntInclusive(0, playlist.length - 1)
    stopPlaylist()
    playNextSong()
}

export function stopPlaylist(){
    AudioSource.getMutable(playlistEntity).playing = false
}

let timeout:any

export function playNextSong(seek?:boolean, loop?:boolean){
    if(seek){
        playlistIndex++
    }


    playedTimes = 0
    loopTimes = 0

    let player = AudioSource.getMutable(playlistEntity)
    player.playing = false 

    // let playlist = playlistData[playlistName]
    // let item = audioItems.find((audio:any)=> audio.n === playlist[playlistIndex])

    let song = playlist[playlistIndex]
    loopTimes = song.len < 5 ? 10 : 5

    console.log('audio playlist item is', song)

    player.audioClipUrl = "assets/" + song.id + ".mp3"
    player.playing = true
    player.volume = .2

    timeout = utils.timers.setTimeout(()=>{
        loopTrack()
    }, 1000 * song.len)

    // playlistPlaying = true
}



function loopTrack(){
    playedTimes++
    if(playedTimes >= loopTimes){
        playNextSong(true)
    }else{

        let song = playlist[playlistIndex]
        AudioSource.createOrReplace(playlistEntity,{
            playing: true,
            audioClipUrl:"assets/" + song.id + ".mp3",
            volume:.2
        })
        // let player = AudioSource.getMutable(playlistEntity)
        // player.playing = false 
        

        // player.audioClipUrl = "assets/" + song.id + ".mp3"
        // player.playing = true
    
        timeout = utils.timers.setTimeout(()=>{
            loopTrack()
        }, 1000 * song.len)
    }
}