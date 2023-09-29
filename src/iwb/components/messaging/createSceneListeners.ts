import { log } from "../../helpers/functions"
import { SERVER_MESSAGE_TYPES } from "../../helpers/types"
import { selectParcel } from "../modes/create"

export function createSceneListeners(room:any){
    room.onMessage(SERVER_MESSAGE_TYPES.SELECT_PARCEL, (info:any)=>{
        log(SERVER_MESSAGE_TYPES.SELECT_PARCEL +' received', info)
        selectParcel(info)
    })
}