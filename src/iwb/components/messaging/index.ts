import { MessageBus } from '@dcl/sdk/message-bus'
import mitt from 'mitt'
import { setupMessageBus } from './messageBus'
import { client, connect } from '../../helpers/connection'
import { initiateMessageListeners } from './serverListeners'
import { createSceneListeners } from './sceneListeners'
import { createrPlayerListeners } from './playerListeners'
import { createIWBEventListeners } from './iwbEvents'
import {log} from "../../helpers/functions";
import { localUserId, players } from '../player/player'
import { Room } from 'colyseus.js'

export let data:any
export let cRoom:Room

export let connected:boolean = false
export let sessionId:any
export let sceneMessageBus:MessageBus
export const iwbEvents = mitt()

export function createMessageManager(){
   sceneMessageBus = new MessageBus()
   setupMessageBus()
}

export async function colyseusConnect(data:any, token:string, world?:any){

    connect('iwb-world', data, token, world).then((room:Room) => {
        log("Connected!");
        cRoom = room
        sessionId = room.sessionId
        connected = true

        room.onLeave((code:number)=>{
            log('left room with code', code)
        })

        createIWBEventListeners()
        !sceneMessageBus ? createMessageManager() : null
        initiateMessageListeners(room)
        createSceneListeners(room)
        createrPlayerListeners(room)
        console.log(cRoom.serializer)

    }).catch((err) => {
        console.error('colyseus connection error', err)
    });
}

export async function joinWorld(world?:any){
    if(connected){
        cRoom.removeAllListeners()
        cRoom.leave(true)
        connected = false
    }
    console.log('croom is', cRoom, world)
    await colyseusConnect(players.get(localUserId)?.dclData, "", world)
}

export function sendServerMessage(type:string, data:any){
    cRoom.send(type, data)
}