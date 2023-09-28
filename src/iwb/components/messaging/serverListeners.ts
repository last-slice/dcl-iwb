import { log } from "../../helpers/functions"
import { SERVER_MESSAGE_TYPES } from "../../helpers/types"
import { items } from "../catalog"
import { playerLeftDuringCreation } from "../hq"


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
    })

    room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_LEAVE, (info:any)=>{
      log(SERVER_MESSAGE_TYPES.PLAYER_LEAVE +' received', info)
      playerLeftDuringCreation(info.player)
    })

    room.onMessage(SERVER_MESSAGE_TYPES.CATALOG_UPDATED, (info:any)=>{
      log(SERVER_MESSAGE_TYPES.CATALOG_UPDATED +' received', info)
    })
}