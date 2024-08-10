import {getPlayer} from "@dcl/sdk/players";
import { Room } from 'colyseus.js'
import mitt from 'mitt'
import { connect } from '../helpers/connection'
import { isPreview, log } from '../helpers/functions'
import { createColyseusListeners } from "./Listeners";
import { createTimerSystem } from "./Timer";
import { engine } from "@dcl/sdk/ecs";
import { displayPendingPanel } from "../ui/Objects/PendingInfoPanel";
import { island, localConfig } from "./Config";
import { addLoadingScreen } from "../systems/LoadingSystem";

export let data:any
export let colyseusRoom:Room

export let connected:boolean = false
export let sessionId:any
export const iwbEvents = mitt()

export async function colyseusConnect(data:any, token:string, world?:any, island?:any) {
    connect('iwb-world', data, token, world, island, island !== "world" ? localConfig : undefined).then((room: Room) => {
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
        createColyseusListeners(room)
        
    }).catch((err) => {
        console.error('colyseus connection error', err)
    });
}

export async function joinWorld(world?: any) {
    !isPreview ? addLoadingScreen() :null

    if (connected) {
        colyseusRoom.removeAllListeners()
        colyseusRoom.leave(true)
        connected = false
    }
    console.log('colyseusRoom is', colyseusRoom, world, island)
    try{
        let playerData:any = getPlayer()
        if(playerData){
            delete playerData.wearables
            delete playerData.avatar
            delete playerData.emotes
        }
        await colyseusConnect(playerData, "", world, island)
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