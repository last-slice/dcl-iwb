import { sceneMessageBus } from "."
import { log } from "../../functions"

export function setupMessageBus(){
    sceneMessageBus.on("message", (info:any)=>{
        log('message bus message', info)
    })
}




