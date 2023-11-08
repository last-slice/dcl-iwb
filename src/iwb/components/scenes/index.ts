import { log } from "../../helpers/functions"
import { addBoundariesForParcel } from "../modes/create"

export let scenes:any[] = []
export let worlds:any[] = []

export function setScenes(info:any){
    log('server scene list', info)

    //set creator worlds
    info.forEach((scene:any)=>{
        scenes.push({owner:scene.owner, builds:1, updated:scene.updated, scna:scene.scna, name:scene.name, id:scene.id})

        let ownerIndex = worlds.findIndex((sc)=> sc.owner === scene.owner)
        if(ownerIndex >= 0){
            worlds[ownerIndex].builds += 1
            if(scene.updated > scenes[ownerIndex].updated){
                worlds[ownerIndex].updated = scene.updated
            }
        }else{
            worlds.push({owner:scene.owner, builds:1, updated:scene.updated, name:scene.name, id:scene.id})
        }
    })

    log('local scenes are now', scenes)
}

export function loadScene(info:any){
    info.pcls.forEach((parcel:string)=>{
        addBoundariesForParcel(parcel, true, true)
    })
}