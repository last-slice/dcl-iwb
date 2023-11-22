import { GltfContainer, MeshCollider, MeshRenderer, Transform, engine } from "@dcl/sdk/ecs"
import { log } from "../../helpers/functions"
import { NOTIFICATION_TYPES, SERVER_MESSAGE_TYPES } from "../../helpers/types"
import { showNotification } from "../../ui/Panels/notificationUI"
import { Vector3 } from "@dcl/sdk/math"
import { addPlayerScenes, localUserId, players } from "../player/player"
import { items } from "../catalog"
import { Room } from "colyseus.js"
import { iwbEvents } from "."//

export function createrPlayerListeners(room:Room){
    log('creating player listeners for room', room.roomId)
    room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_ASSET_UPLOADED, (info:any)=>{
        log(SERVER_MESSAGE_TYPES.PLAYER_ASSET_UPLOADED +' received', info)
        showNotification({type:NOTIFICATION_TYPES.IMAGE, image:info.im, message:"Your asset " + info.n + " is uploading and pending deployment. A placeholder object is temporarily available.", animate:{enabled:true, return:true, time:10}})
        if(info){
            items.set(info.id, info)
        }
    })

    room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_ASSET_CATALOG, (info:any)=>{
        log(SERVER_MESSAGE_TYPES.PLAYER_ASSET_CATALOG +' received', info)

        if(info){
            info.forEach((asset:any)=>{
                items.set(asset.id, asset)
            })
        }
    })

    room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_SCENES_CATALOG, (info:any)=>{
        log(SERVER_MESSAGE_TYPES.PLAYER_SCENES_CATALOG +' received', info)
        addPlayerScenes(info.user, info.scenes)
    })

    room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_CATALOG_DEPLOYED, (info:any)=>{
        log(SERVER_MESSAGE_TYPES.PLAYER_CATALOG_DEPLOYED +' received', info)
        showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Your latest asset uploads have been deployed. Refresh to use them.", animate:{enabled:true, return:true, time:10}})
    })

    room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_RECEIVED_MESSAGE, (info:any)=>{
        log(SERVER_MESSAGE_TYPES.PLAYER_RECEIVED_MESSAGE +' received', info)
    })

    room.onMessage(SERVER_MESSAGE_TYPES.PLAY_MODE_CHANGED, (info:any)=>{
        log(SERVER_MESSAGE_TYPES.PLAY_MODE_CHANGED +' received', info)
        players.get(localUserId)!.mode = info.mode
        iwbEvents.emit(SERVER_MESSAGE_TYPES.PLAY_MODE_CHANGED, {mode:info.mode})
    })
}