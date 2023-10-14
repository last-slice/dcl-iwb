import { log } from "../../helpers/functions"
import { SERVER_MESSAGE_TYPES } from "../../helpers/types"
import { items } from "../catalog"
import { localUserId, players, removePlayer } from "../player/player"


export function initiateMessageListeners(room:any){
    room.onMessage(SERVER_MESSAGE_TYPES.INIT, (info:any)=>{
      log(SERVER_MESSAGE_TYPES.INIT +' received', info)

        //set initial catalog
        let catalog = info.catalog
        for (const key in catalog) {
            if (catalog.hasOwnProperty(key)) {
              const value = catalog[key];
              items.set(key,value)
            }
          }
        log('catalog size is', items.size)

        //set deployed iwb version
        players.get(localUserId).version = info.iwb.v
    })

    room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_LEAVE, (info:any)=>{
      log(SERVER_MESSAGE_TYPES.PLAYER_LEAVE +' received', info)
      removePlayer(info.player)
    })

    room.onMessage(SERVER_MESSAGE_TYPES.CATALOG_UPDATED, (info:any)=>{
      log(SERVER_MESSAGE_TYPES.CATALOG_UPDATED +' received', info)
    })
}