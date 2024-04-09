
import {Room} from "colyseus.js"
import { hideNotification, showNotification } from "../../ui/Panels/notificationUI"
import { NOTIFICATION_TYPES, SERVER_MESSAGE_TYPES } from "../../helpers/types"
import { log } from "../../helpers/functions"
import { engine } from "@dcl/sdk/ecs"
import { loadGame } from "../modes/gaming"

export async function createGameListeners(room:Room){
    room.onMessage(SERVER_MESSAGE_TYPES.CREATE_GAME_LOBBY, (info: any) => {
        log(SERVER_MESSAGE_TYPES.CREATE_GAME_LOBBY + ' received', info)

        hideNotification()
        if(info.valid){
            showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Lobby Object placed. Go here to edit Global Game Configurations.", animate:{enabled:true, return:true, time:10}})

        }else{
            showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Error Creating Game Lobby.", animate:{enabled:true, return:true, time:5}})
        }
    })
}