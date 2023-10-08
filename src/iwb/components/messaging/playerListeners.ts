import { log } from "../../helpers/functions"
import { NOTIFICATION_TYPES, SERVER_MESSAGE_TYPES } from "../../helpers/types"
import { showNotification } from "../../ui/notificationUI"

export function createrPlayerListeners(room:any){
    room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_ASSET_UPLOADED, (info:any)=>{
        log(SERVER_MESSAGE_TYPES.PLAYER_ASSET_UPLOADED +' received', info)
        showNotification({type:NOTIFICATION_TYPES.IMAGE, image:info.image, message:"Your asset " + info.name + " is ready to use!\nRefresh the Browser.", animate:{enabled:true, return:true, time:10}})
    })
}