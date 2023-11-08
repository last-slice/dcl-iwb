import { sceneMessageBus } from "."
import { log } from "../../helpers/functions"
import { IWB_MESSAGE_TYPES } from "../../helpers/types"
import { otherUserPlaceditem, otherUserRemovedSeletedItem, otherUserSelectedItem } from "../modes/build"
import { localUserId, players } from "../player/player"

export function setupMessageBus(){
    sceneMessageBus.on("message", (info:any)=>{
        log('message bus message', info)
    })

    sceneMessageBus.on(IWB_MESSAGE_TYPES.USE_SELECTED_ASSET, (info:any)=>{
        log(IWB_MESSAGE_TYPES.USE_SELECTED_ASSET + ' message bus received', info)
        if(info.user !== localUserId){
            //need to show asset for other user
            let player = players.get(info.user)
            if(player){
                otherUserSelectedItem(player, info.item)
            }
        }
    })

    sceneMessageBus.on(IWB_MESSAGE_TYPES.PLACE_SELECTED_ASSET, (info:any)=>{
        log(IWB_MESSAGE_TYPES.PLACE_SELECTED_ASSET + ' message bus received', info)
        if(info.user !== localUserId){
            //need to show asset for other user
            let player = players.get(info.user)
            if(player){
                otherUserPlaceditem(player, info)
            }
        }
    })

    sceneMessageBus.on(IWB_MESSAGE_TYPES.REMOVE_SELECTED_ASSET, (info:any)=>{
        log(IWB_MESSAGE_TYPES.REMOVE_SELECTED_ASSET + ' message bus received', info)
        if(info.user !== localUserId){
            //need to show asset for other user
            let player = players.get(info.user)
            if(player){
                otherUserRemovedSeletedItem(player)
            }
        }
    })
}




