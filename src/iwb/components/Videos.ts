import { Material, VideoPlayer } from "@dcl/sdk/ecs"
// import { VideoLoadedComponent } from "../helpers/Components"
import { selectedItem } from "../modes/Build"
import { getEntity } from "./IWB"
import { COMPONENT_TYPES } from "../helpers/types"

export async function checkVideoComponent(scene:any, entityInfo:any, texture:string){
    let itemInfo = scene[COMPONENT_TYPES.VIDEO_COMPONENT].get(entityInfo.aid)
    if(itemInfo){
        console.log('entity info', entityInfo.entity)
        let videoPlayer = VideoPlayer.getMutableOrNull(entityInfo.entity)
        if(videoPlayer){
            videoPlayer.playing = false
        }

        VideoPlayer.createOrReplace(entityInfo.entity, {
            src: "" + texture,
            playing: false,
            volume: itemInfo.volume > 1 ? 1 : itemInfo.volume,//
            loop: itemInfo.loop
        })
        console.log('video player is', VideoPlayer.get(entityInfo.entity))
        // VideoLoadedComponent.createOrReplace(entityInfo.entity, {init:false, sceneId:scene.id})
    }
}

export function videoListener(scene:any){
    scene[COMPONENT_TYPES.VIDEO_COMPONENT].onAdd((video:any, aid:any)=>{
        let entityInfo = getEntity(scene, aid)
        if(!entityInfo){
            return
        }

        video.listen("url", (c:any, p:any)=>{
            let videoInfo = VideoPlayer.getMutable(entityInfo.entity)
            if(videoInfo){
                let restart = false
                if(videoInfo.playing){
                    restart = true
                    videoInfo.playing = false
                }
                videoInfo.src = c
                videoInfo.playing = restart
            }
        })

        video.listen("loop", (c:any, p:any)=>{
            if(p !== undefined){
                let videoInfo = VideoPlayer.getMutable(entityInfo.entity)
                if(videoInfo){
                    videoInfo.loop = c
                }
            }
        })

        video.listen("loop", (c:any, p:any)=>{
            if(p !== undefined){
                let videoInfo = VideoPlayer.getMutable(entityInfo.entity)
                if(videoInfo){
                    videoInfo.volume = c
                }
            }
        })
    })
}

export function setVideoBuildMode(scene:any, entityInfo:any){
    let itemInfo = scene[COMPONENT_TYPES.VIDEO_COMPONENT].get(entityInfo.aid)
    if(itemInfo){
        stopVideoComponent(entityInfo)
    }
}

export function setVideoPlayMode(scene:any, entityInfo:any){
    // if (VideoLoadedComponent.has(entityInfo.entity) && !VideoLoadedComponent.get(entityInfo.entity).init){
        let videoInfo = scene[COMPONENT_TYPES.VIDEO_COMPONENT].get(entityInfo.aid)
        if(videoInfo && videoInfo.autostart){
            playVideoComponent(entityInfo)
        }
    //     VideoLoadedComponent.getMutable(entityInfo.entity).init = true
    // }
}

export function playVideoComponent(entityInfo:any, position?:any){
    let video = VideoPlayer.getMutableOrNull(entityInfo.entity)
    if(video){
        video.playing = true
        video.position = position ? position : 0
    }
}

export function stopVideoComponent(entityInfo:any){
    let video = VideoPlayer.getMutableOrNull(entityInfo.entity)
    if(video){
        video.playing = false
    }
}

export function disableVideoPlayMode(scene:any, entityInfo:any){
    let itemInfo = scene[COMPONENT_TYPES.VIDEO_COMPONENT].get(entityInfo.aid)
    if(itemInfo){
        VideoPlayer.getMutable(entityInfo.entity).playing = false
    }
}

export function playVideoFile(){
    console.log(selectedItem)
    console.log(VideoPlayer.get(selectedItem.entity))
    console.log(Material.get(selectedItem.entity))
    if(VideoPlayer.has(selectedItem.entity)){
        VideoPlayer.getMutable(selectedItem.entity).playing = true
    }
}

export function stopVideoFile(){
    if(VideoPlayer.has(selectedItem.entity)){
        VideoPlayer.getMutable(selectedItem.entity).playing = false
    }
}