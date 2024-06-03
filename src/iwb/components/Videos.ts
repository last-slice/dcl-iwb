import { VideoPlayer } from "@dcl/sdk/ecs"
import { VideoLoadedComponent } from "../helpers/Components"

export function checkVideoComponent(scene:any, entityInfo:any){
    let itemInfo = scene.videos.get(entityInfo.aid)
    if(itemInfo){
        VideoPlayer.create(entityInfo.entity, {
            src: "assets/" + itemInfo.url,
            playing: true,
            volume: itemInfo.volume,
            loop: itemInfo.loop
        })
        VideoLoadedComponent.create(entityInfo.entity, {init:false, sceneId:scene.id})
    }
}

export function setVideoBuildMode(scene:any, entityInfo:any){
    let itemInfo = scene.videos.get(entityInfo.aid)
    if(itemInfo){
        VideoPlayer.getMutable(entityInfo.entity).playing = false
    }
}