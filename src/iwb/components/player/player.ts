import { PlayerData, SCENE_MODES, SERVER_MESSAGE_TYPES } from "../../helpers/types";
import { sendServerMessage } from "../messaging";
import { deleteCreationEntities } from "../modes/create";

export let localUserId:string
export let players:Map<string, any> = new Map()

export function addPlayer(userId:string, data?:any[], local?:boolean){
    if(local){
        localUserId = userId
    }

    let pData:any = {
        dclData:null,
        mode: SCENE_MODES.PLAYMODE,
        scenes:[],
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

export function setPlayMode(user:string, mode:SCENE_MODES){
    let player = players.get(user)
    if(player){
        player.mode = mode
        sendServerMessage(SERVER_MESSAGE_TYPES.PLAY_MODE_CHANGED, {mode:mode})
    }
}
