import { MessageBus } from '@dcl/sdk/message-bus'
import mitt from 'mitt'
import { setupMessageBus } from './messageBus'
import { connect } from '../../helpers/connection'
import { initiateMessageListeners } from './serverListeners'
import { createSceneListeners } from './sceneListeners'
import { getAssetUploadToken, log } from '../../helpers/functions'
import { createrPlayerListeners } from './playerListeners'

export let data:any
export let realm:any
export let cRoom:any

export let connected:boolean = false
export let sessionId:any
export let sceneMessageBus:any
export const iwbEvents = mitt()

export function createMessageManager(){
   sceneMessageBus = new MessageBus()
   setupMessageBus()
}

export function colyseusConnect(data:any){
    connect("iwb-world", data).then((room) => {
        cRoom = room
        sessionId = room.sessionId
        connected = true

        getAssetUploadToken()
        createMessageManager()
        initiateMessageListeners(room)
        createSceneListeners(room)
        createrPlayerListeners(room)
        
    }).catch((err) => {
        console.error('colyseus connection error', err)
    });
}

export function sendServerMessage(type:string, data:any){
    cRoom.send(type, data)
}
