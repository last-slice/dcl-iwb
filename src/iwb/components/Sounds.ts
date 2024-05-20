import { AudioSource, ColliderLayer, Entity, Material, MeshCollider, MeshRenderer, PBTextShape, TextShape, Transform, VisibilityComponent, engine } from "@dcl/sdk/ecs"
import { getEntity } from "./IWB"
import { Color4 } from "@dcl/sdk/math"

export function addSoundComponent(scene:any){
    scene.sounds.forEach((sound:any, aid:string)=>{
        let info = scene.parenting.find((entity:any)=> entity.aid === aid)
        if(info.entity){
            MeshRenderer.setBox(info.entity)
            MeshCollider.setBox(info.entity, ColliderLayer.CL_POINTER)
            
            Material.setPbrMaterial(info.entity,{
                albedoColor: Color4.create(0,0,1,.5)
            })

            AudioSource.create(info.entity,{
                audioClipUrl: "assets/" + sound.url + ".mp3",
                playing: false,
                volume: sound.volume,
                loop: sound.loop,
            })

            updateSoundAttachView(aid, sound.attach, info.entity)
        }
    })
}

export function updateSoundAttachView(aid:string, attach:boolean, entity?:Entity){
    let ent:any = entity
    if(!ent){
    }
    TextShape.createOrReplace(ent,{text:"" + (attach ? "Audio\nAttached" : "Audio\nPlaced"), fontSize: 3})
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
    scene.sounds.onAdd((sound:any, aid:any)=>{
        let info = getEntity(scene, aid)
        if(!info){
            return
        }

        sound.listen("url", (c:any, p:any)=>{
            if(p !== undefined){
                updateSoundURL(info.entity, c)
            }
        })

        sound.listen("attach", (c:any, p:any)=>{
            if(p !== undefined){
                updateSoundAttachView(aid, c, info.entity)
            }
        })

        sound.listen("volume", (c:any, p:any)=>{
            if(p !== undefined){
                updateSoundVolume(info.entity, c)
            }
        })

        sound.listen("loop", (c:any, p:any)=>{
            if(p !== undefined){
                updateSoundLoop(info.entity, c)
            }
        })

        sound.listen("autostart", (c:any, p:any)=>{
            if(p !== undefined){
                updateSoundAutostart(info.entity, c)
            }
        })
    })
}