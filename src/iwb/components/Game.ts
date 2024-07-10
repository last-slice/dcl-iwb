import { VisibilityComponent } from "@dcl/sdk/ecs"
import { Actions, COMPONENT_TYPES, NOTIFICATION_TYPES, SERVER_MESSAGE_TYPES, Triggers } from "../helpers/types"
import { actionQueue, getTriggerEvents } from "./Triggers"
import { colyseusRoom, sendServerMessage } from "./Colyseus"
import { hideNotification, showNotification } from "../ui/Objects/NotificationPanel"
import { getEntity } from "./IWB"
import { unloadAllSceneGameAssets } from "./Level"
import { localPlayer } from "./Player"
import { utils } from "../helpers/libraries"
import { setUIClicked } from "../ui/ui"

export let gameEndingtimer:any

export function attemptGameStart(info:any){
    let scene = colyseusRoom.state.scenes.get(info.sceneId)
    let gameInfo = scene[COMPONENT_TYPES.GAME_COMPONENT].get(info.aid)
    if(info && info.canStart && info.level){
        let entityInfo = getEntity(scene, info.level)
        let actionInfo = scene[COMPONENT_TYPES.ACTION_COMPONENT].get(info.level)
        if(actionInfo){
            if(actionInfo.actions && actionInfo.actions.length > 0){
                let action = actionInfo.actions.find(($:any)=> $.type === Actions.LOAD_LEVEL)
                if(action){
                    localPlayer.canTeleport = !gameInfo.disableTeleport
                    actionQueue.push({aid:info.level, action:action, entity:entityInfo.entity})
                    setUIClicked(false)
                }
            }
        }
           
    }else{
        showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"" + gameInfo.name + " does not have a playable level yet!", animate:{enabled:true, return:true, time:5}})
    }
}

export function attemptGameEnd(info:any){
    let scene = colyseusRoom.state.scenes.get(info.sceneId)
    // let gameInfo = scene[COMPONENT_TYPES.GAME_COMPONENT].get(info.aid)
    if(scene){
        unloadAllSceneGameAssets(scene)
        //to do
        //clean up any game timers etc etc
    }
    localPlayer.canTeleport = true
}

export function abortGameTermination(scene:any){
    if(localPlayer.playingGame){
        utils.timers.clearTimeout(gameEndingtimer)
        hideNotification()
    }
}

export function checkGameplay(scene:any){
    if(localPlayer.playingGame){
        gameEndingtimer = utils.timers.setTimeout(()=>{
            hideNotification()
            attemptGameEnd({sceneId: scene.id})
            sendServerMessage(SERVER_MESSAGE_TYPES.END_GAME, {})
        }, 1000 * 5)
        showNotification({type:NOTIFICATION_TYPES.MESSAGE, message: "Your Game will auto end in 5 seconds", animate:{enabled:true, return: false, time:5}})
    }
}

export function disableLevelPlayMode(scene:any, entityInfo:any){
    let itemInfo = scene[COMPONENT_TYPES.LEVEL_COMPONENT].get(entityInfo.aid)
    console.log('disable level play mode item', itemInfo)
    if(itemInfo){
        VisibilityComponent.createOrReplace(entityInfo.entity, {
            visible: false
        })
    }
}