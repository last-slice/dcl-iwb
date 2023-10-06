import { MessageBus } from '@dcl/sdk/message-bus'
import { setupMessageBus } from './messageBus'
import { connect } from '../../helpers/connection'
import { initiateMessageListeners } from './serverListeners'
import { createSceneListeners } from './createSceneListeners'
import { log } from '../../helpers/functions'

export let data:any
export let realm:any
export let cRoom:any

export let connected:boolean = false
export let sessionId:any
export let sceneMessageBus:any

export function createMessageManager(){
   sceneMessageBus = new MessageBus()
   setupMessageBus()
}

export function colyseusConnect(data:any, token:string){

    connect("iwb-world", data, token).then((room) => {
        log("Connected!");
        cRoom = room
        sessionId = room.sessionId
        connected = true

        initiateMessageListeners(room)
        createSceneListeners(room)
        
    }).catch((err) => {
        console.error('colyseus connection error', err)
    });
}

export function sendServerMessage(type:string, data:any){
    cRoom.send(type, data)
}
