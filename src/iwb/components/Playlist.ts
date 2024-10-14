import { AudioStream, Entity } from "@dcl/sdk/ecs";
import { COMPONENT_TYPES, SERVER_MESSAGE_TYPES, Triggers } from "../helpers/types";
import { getEntity } from "./iwb";
import { updateAssetMaterialForPlaylist } from "./Materials";
import { getRandomIntInclusive } from "../helpers/functions";
import resources from "../helpers/resources";
import { initAudiusServers, updateAudiusInit, getServers, chooseServer, server, APP_NAME } from "../ui/Objects/IWBViews/MusicView";
import { localPlayer } from "./Player";
import { utils } from "../helpers/libraries";
import { colyseusRoom, sendServerMessage } from "./Colyseus";

export function playlistListener(scene:any){
    scene[COMPONENT_TYPES.PLAYLIST_COMPONENT].onAdd((playlist:any, aid:any)=>{
        let entityInfo = getEntity(scene, aid)
        if(!entityInfo){
            return
        }

        playlist.listen("current", (c:any, p:any)=>{
            console.log('playlist current frame changed', p, c, playlist.playlist[c])
            // let texture:any
            // if(c !== undefined){
            //     texture = playlist.playlist[c]
            // }
            // if(texture){
            //     scene[COMPONENT_TYPES.MATERIAL_COMPONENT].forEach((material:any, aid:string)=>{
            //         if(material.textureType === 'PLAYLIST'){
            //             let meshEntity = getEntity(scene, aid)
            //             if(meshEntity){
            //                 material.texture = texture
            //                 material.emissiveType = material.textureType
            //                 material.emissiveTexture = texture
            //                 switch(playlist.type){
            //                     case 0:
            //                         updateMaterial(scene, material, meshEntity)
            //                         break;
        
            //                     case 1:
            //                         // stopVideoComponent(materialInfo)//
            //                         // updateMaterial(materialInfo, meshEntity)
            //                         // playVideoComponent(meshEntity, playlist.currentKeyframe)
            //                         break;
        
            //                     case 2:
            //                         break;
            //                 }
        
            //                 let triggerEvents = getTriggerEvents(meshEntity)
            //                 triggerEvents.emit(Triggers.ON_PLAYLIST_CHANGE, {pointer:0, input:0, entity:meshEntity.entity})
            //             }
            //         }
            //     })
            // }

            

            // playlist.meshAids.forEach((aid:string, i:number)=>{
            //     let meshEntity = getEntity(scene, aid)
            //     if(meshEntity){
            //         let materialInfo = scene[COMPONENT_TYPES.MATERIAL_COMPONENT].get(aid)
            //         if(materialInfo){
            //             materialInfo.texture = texture

            //             switch(playlist.type){
            //                 case 0:
            //                     updateMaterial(materialInfo, meshEntity)
            //                     break;

            //                 case 1:
            //                     stopVideoComponent(materialInfo)
            //                     updateMaterial(materialInfo, meshEntity)
            //                     playVideoComponent(meshEntity, playlist.currentKeyframe)
            //                     break;

            //                 case 2:
            //                     break;
            //             }

            //             let triggerEvents = getTriggerEvents(meshEntity)
            //             triggerEvents.emit(Triggers.ON_PLAYLIST_CHANGE, {pointer:0, input:0, entity:meshEntity.entity})
            //         }
            //     }
            // })//
        })
    })

    scene[COMPONENT_TYPES.TEXTURE_COMPONENT].onRemove((texture:any, aid:any)=>{
        let entityInfo = getEntity(scene, aid)
        if(!entityInfo){
            return
        }
    })
}

export function disablePlaylistForBuildMode(scene:any, entityInfo:any){
    let itemInfo = scene[COMPONENT_TYPES.PLAYLIST_COMPONENT].get(entityInfo.aid)
    if(itemInfo){
        utils.timers.clearTimeout(itemInfo.player)
    }
}

export function disablePlaylistForPlayMode(scene:any, entityInfo:any){
    let itemInfo = scene[COMPONENT_TYPES.PLAYLIST_COMPONENT].get(entityInfo.aid)
    if(itemInfo){
        utils.timers.clearTimeout(itemInfo.player)
    }
}

export function playImagePlaylist(currentScene:any, info:any, action:any, playlistInfo:any, local:boolean, reset?:boolean){
    console.log("playlist type is", local)

    let scene = colyseusRoom.state.scenes.get(currentScene.id)
    if(!scene || localPlayer.activeScene.id !== scene.id){
        console.log('invalid scene, will not play audius track')//
        return
    }

    if(local){
        reset ? playlistInfo.current = -1 : null
        playlistInfo.current += 1
    
        playlistInfo.current = (playlistInfo.playtype === 0 ? (playlistInfo.current >= playlistInfo.playlist.length ? 0 : playlistInfo.current) : getRandomIntInclusive(0, playlistInfo.playlist.length - 1))

        playlistInfo.player = utils.timers.setTimeout(()=>{
            utils.timers.clearTimeout(playlistInfo.player)
            playImagePlaylist(scene, info, action, playlistInfo, true)
        }, 1000 * playlistInfo.slideTime)
    }

    console.log('playlist current is', playlistInfo.current)
    playlistInfo.meshAids.forEach((aid:string)=>{
        console.log('need to update mesh aid with new texture', aid)
        updateAssetMaterialForPlaylist(scene, aid, playlistInfo.playlist[playlistInfo.current])
    })
}

export function stopAudiusPlaylist(scene:any, info:any){
    if(!scene || localPlayer.activeScene.id !== scene.id){
        console.log('invalid scene, will not play audius track')
        return
    }

    let audio = AudioStream.getMutableOrNull(info.entity)
    if(audio){
        audio.playing = false
    }
}

export async function seekAudiusPlaylist(scene:any, info:any, action:any, playlistInfo:any, reset?:boolean){
    if(!scene || localPlayer.activeScene.id !== scene.id){
        console.log('invalid scene, will not play audius track')
        return
    }

    // let entityInfo = getEntity(scene, info.aid)
    // if(!entityInfo){
    //     console.log('error with entity info, will not play audius track')
    //     return
    // }

    let audio = AudioStream.getMutableOrNull(info.entity)
    if(audio){
        audio.playing = false
    }

    if(!initAudiusServers){
        updateAudiusInit(true)
        await getServers()
    }
    chooseServer()

    reset ? playlistInfo.current = -1 : null
    playlistInfo.current += 1

    let audiusPlaylist = await fetch(server + "/v1/playlists/" + playlistInfo.audiusId + "/tracks?app_name=" + APP_NAME)
    let json = await audiusPlaylist.json()
    if(json && json.data && json.data.length > 0){
        if(playlistInfo.current > json.data.length){
            playlistInfo.current = 0
        }

        let trackToPlay = json.data[playlistInfo.current]
        if(trackToPlay){
            AudioStream.createOrReplace(info.entity,
                {
                    url:server + "/" + resources.audius.endpoints.stream + "/" + trackToPlay.id + "/stream?app_name=" + APP_NAME + "&t=" +Math.floor(Date.now()/1000),
                    playing:true,
                    volume:playlistInfo.volume
                }
            )
        }
        

    }
}

export function stopAllPlaylists(sceneId:string){
    sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_ACTION, {
        type:'ENDALL',
        sceneId:sceneId,
      })
}