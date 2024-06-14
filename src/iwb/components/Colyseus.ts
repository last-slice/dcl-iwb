import {getPlayer} from "@dcl/sdk/players";
import { Room } from 'colyseus.js'
import mitt from 'mitt'
import { connect } from '../helpers/connection'
import { log } from '../helpers/functions'
import { createColyseusListeners } from "./Listeners";
import { createTimerSystem } from "./Timer";
import { engine } from "@dcl/sdk/ecs";
import { displayPendingPanel } from "../ui/Objects/PendingInfoPanel";

export let data:any
export let colyseusRoom:Room

export let connected:boolean = false
export let sessionId:any
export const iwbEvents = mitt()

export async function colyseusConnect(data:any, token:string, world?:any) {
    connect('iwb-world', data, token, world).then((room: Room) => {
        log("Connected!");
        colyseusRoom = room
        sessionId = room.sessionId
        connected = true

        room.onLeave((code: number) => {
            log('left room with code', code)
            connected = false
            displayPendingPanel(true, "disconnected")
        })

        engine.addSystem(createTimerSystem())
        createColyseusListeners(room)//
        
        
    }).catch((err) => {
        console.error('colyseus connection error', err)
    });
}

export async function joinWorld(world?: any) {
    if (connected) {
        colyseusRoom.removeAllListeners()
        colyseusRoom.leave(true)
        connected = false
    }
    console.log('colyseusRoom is', colyseusRoom, world)
    try{
        const playerData = getPlayer()
        await colyseusConnect(playerData, "", world)
    }
    catch(e){
        console.log('error connecting to colyseus')
    }
}

export function sendServerMessage(type: string, data: any) {
    // log('sending server message', type, data)
    try{
        connected && colyseusRoom.send(type, data)
    }
    catch(e){
        log('error sending message to server', e)
    }
}