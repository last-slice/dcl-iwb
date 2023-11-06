import { PlayerData, SCENE_MODES, SERVER_MESSAGE_TYPES } from "../../helpers/types";
import { sendServerMessage } from "../messaging";
import { deleteCreationEntities } from "../modes/create";
import {Entity} from "@dcl/sdk/ecs";
import {CatalogItemType} from "../catalog";

export interface Player {
    dclData:any,
    mode:SCENE_MODES,
    scenes:PlayerScene[],
    buildingAllowed:string[],
    currentParcel:string,
    uploadToken:string,
    version: number
    activeScene: PlayerScene
}

export interface PlayerScene {
    parcels:string[],
    baseParcel:string,
    parentEntity:Entity,
    assets: SceneItem[],
}

export interface SceneItem extends CatalogItemType{
    position: {x:number, y:number, z:number},
    rotation: {x:number, y:number, z:number, w:number},
    scale: {x:number, y:number, z:number}
}

export let localUserId:string
export let players:Map<string, Player> = new Map<string, Player>()



export function addPlayer(userId:string, data?:any[], local?:boolean){
    if(local){
        localUserId = userId
    }

    let pData:any = {
        dclData:null,
        mode: SCENE_MODES.PLAYMODE,
        scenes:[],
        objects:[],
        buildingAllowed:[]
    }

    if(data){

        data.forEach((item:any)=>{
            for(let key in item){
                pData[key] = item[key]
            }
        })
    }
    players.set(userId, pData)

    console.log("Player *** ", players.get(userId))
}

export function removePlayer(user:string){
    /**
     * todo
     * add other garbage collection and entity clean up here
     */

    let player = players.get(user)
    if(player){

        /**
         * maybe move to its own file and function
         */
        if(player.mode === SCENE_MODES.CREATE_SCENE_MODE){
            deleteCreationEntities(user)
        }


        players.delete(user)
    }
}

export function addPlayerScenes(user:string, scenes:any[]){
    let player = players.get(user)
    if(player){
        scenes.forEach((scene)=>{
            player.scenes.push(scene)
        })
    }
}

export function setPlayMode(user:string, mode:SCENE_MODES){
    let player = players.get(user)
    if(player){
        player.mode = mode
        sendServerMessage(SERVER_MESSAGE_TYPES.PLAY_MODE_CHANGED, {mode:mode})
    }
}
