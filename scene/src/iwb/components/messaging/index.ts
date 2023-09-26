import { MessageBus } from '@dcl/sdk/message-bus'
import { setupMessageBus } from './messageBus'
import { connect } from '../../helpers/connection'
import { log } from '../../functions'
import { initiateMessageListeners } from './serverListeners'

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

export function colyseusConnect(data:any){
    connect("iwb-world", data).then((room) => {
        log("Connected!");
        cRoom = room
        sessionId = room.sessionId
        connected = true

        initiateMessageListeners(room)
    }).catch((err) => {
        console.error('colyseus connection error', err)
    });
}
