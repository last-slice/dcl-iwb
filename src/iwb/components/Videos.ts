import { Entity, Material, VideoPlayer } from "@dcl/sdk/ecs"
import { selectedItem } from "../modes/Build"
import { getEntity } from "./iwb"
import { COMPONENT_TYPES } from "../helpers/types"
import { updateMaterial } from "./Materials"
import { colyseusRoom } from "./Colyseus"

export let pendingVideoScreens:any[] = []
export let playingVideos:Entity[] = []

export function setPlayingVideo(entity:Entity){
    playingVideos.push(entity)
}

export async function removePlayingVideo(entity:Entity){
    let entityIndex = playingVideos.findIndex((e:any)=> e === entity)
    if(entityIndex >=0){
        playingVideos.splice(entityIndex, 1)
    }
}

export async function checkVideoComponent(scene:any, entityInfo:any){
    let itemInfo = scene[COMPONENT_TYPES.VIDEO_COMPONENT].get(entityInfo.aid)
    if(!itemInfo){
        return
    }

    if(itemInfo.type === 1){
        console.log('we have pending  video screen, add until all players are loaded')
        pendingVideoScreens.push({sceneId:scene.id, entityInfo})
        console.log('pending video items', pendingVideoScreens)
    }else{
        let videoPlayer = VideoPlayer.getMutableOrNull(entityInfo.entity)
        if(videoPlayer){
            videoPlayer.playing = false
        }
    
        VideoPlayer.createOrReplace(entityInfo.entity, {
            src: "" + itemInfo.texture,
            playing: false,
            volume: itemInfo.volume > 1 ? 1 : itemInfo.volume,
            loop: itemInfo.loop
        })
        itemInfo.videoTexture = Material.Texture.Video({ videoPlayerEntity: entityInfo.entity })
        console.log('created video player')
    }
}

export function videoListener(scene:any){
    scene[COMPONENT_TYPES.VIDEO_COMPONENT].onAdd((video:any, aid:any)=>{
        let entityInfo = getEntity(scene, aid)
        if(!entityInfo){
            return
        }

        video.listen("link", (c:any, p:any)=>{
            console.log('updating video link', c)
            let videoInfo = VideoPlayer.getMutableOrNull(entityInfo.entity)
            if(!videoInfo){
                return
            }

            let restart = false
            if(videoInfo.playing){
                restart = true
                videoInfo.playing = false
            }
            videoInfo.src = c
            videoInfo.playing = restart
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

export async function disableVideoPlayMode(scene:any, entityInfo:any){
    let itemInfo = scene[COMPONENT_TYPES.VIDEO_COMPONENT].get(entityInfo.aid)
    if(!itemInfo){
        return
    }
    if(itemInfo.type !== 0){
        return
    }
    let videoPlayer = VideoPlayer.getMutableOrNull(entityInfo.entity)
    if(!videoPlayer){
        return
    }
    videoPlayer.playing = false
    await removePlayingVideo(entityInfo.entity)
}

export function playVideoFile(){
    if(VideoPlayer.has(selectedItem.entity)){
        VideoPlayer.getMutable(selectedItem.entity).playing = true
    }
}

export function stopVideoFile(){
    if(VideoPlayer.has(selectedItem.entity)){
        VideoPlayer.getMutable(selectedItem.entity).playing = false
    }
}

export function loadPendingVideoScreens(){
    console.log('loading pending video screens', pendingVideoScreens.length)
    pendingVideoScreens.forEach((videoScreen:any)=>{
        let scene = colyseusRoom.state.scenes.get(videoScreen.sceneId)
        let material = scene[COMPONENT_TYPES.MATERIAL_COMPONENT].get(videoScreen.entityInfo.aid)
        console.log('material is', material)
        if(scene){
            updateMaterial(scene, material, videoScreen.entityInfo)
        }
    })
    pendingVideoScreens.length = 0
}