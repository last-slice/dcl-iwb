import { sceneMessageBus } from "."
import { log } from "../../helpers/functions"

export function setupMessageBus(){
    sceneMessageBus.on("message", (info:any)=>{
        log('message bus message', info)
    })
}




