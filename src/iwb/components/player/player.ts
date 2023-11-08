import { Player, PlayerData, SCENE_MODES, SERVER_MESSAGE_TYPES } from "../../helpers/types";
import { iwbEvents, joinWorld, sendServerMessage, world } from "../messaging";
import { deleteCreationEntities } from "../modes/create";
import {Entity} from "@dcl/sdk/ecs";
import { displayRealmTravelPanel } from "../../ui/Panels/realmTravelPanel";
import { utils } from "../../helpers/libraries";
import { displaySettingsPanel } from "../../ui/Panels/settings/settingsIndex";
import { movePlayerTo } from "~system/RestrictedActions";

export let localUserId:string
export let players:Map<string, Player> = new Map<string, Player>()

export async function addPlayer(userId:string, data?:any[], local?:boolean){
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


        players.delete(user)//
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
        iwbEvents.emit(SERVER_MESSAGE_TYPES.PLAY_MODE_CHANGED, {mode:mode})
        sendServerMessage(SERVER_MESSAGE_TYPES.PLAY_MODE_CHANGED, {mode:mode})
    }
}

export function worldTravel(w:any){
    displaySettingsPanel(false)
    displayRealmTravelPanel(true)
    movePlayerTo({newRelativePosition:{x:16, y:0, z:16}})
    utils.timers.setTimeout(()=>{
        world.world !== w.world ? joinWorld(w) : null
        displayRealmTravelPanel(false)
    }, 2000)
}
