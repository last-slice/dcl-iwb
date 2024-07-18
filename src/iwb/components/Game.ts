import { Transform, VisibilityComponent } from "@dcl/sdk/ecs"
import { Actions, COMPONENT_TYPES, NOTIFICATION_TYPES, PLAYER_GAME_STATUSES, SERVER_MESSAGE_TYPES, Triggers } from "../helpers/types"
import { actionQueue, getTriggerEvents, runGlobalTrigger } from "./Triggers"
import { colyseusRoom, sendServerMessage } from "./Colyseus"
import { hideNotification, showNotification } from "../ui/Objects/NotificationPanel"
import { getEntity } from "./IWB"
import { unloadAllSceneGameAssets } from "./Level"
import { localPlayer, localUserId } from "./Player"
import { utils } from "../helpers/libraries"
import { setUIClicked } from "../ui/ui"
import { displayGameLobby, updateLobbyPanel } from "../ui/Objects/GameLobby"
import { Vector3 } from "@dcl/sdk/math"
import { getRandomPointInArea } from "../helpers/functions"
import { movePlayerTo } from "~system/RestrictedActions"
import { uiDataUpdate } from "./UIText"

export let gameEndingtimer:any

export function attemptGameStart(info:any){
    let scene = colyseusRoom.state.scenes.get(info.sceneId)
    if(!scene){
        return
    }

    let gameInfo = scene[COMPONENT_TYPES.GAME_COMPONENT].get(info.aid)
    console.log('game start is', gameInfo)//
    if(gameInfo.type === "SOLO"){
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
    else{
        console.log('start multiplayer game')
        runGlobalTrigger(scene, Triggers.ON_JOIN_LOBBY, {input:0, pointer:0, entity:0})
        updateLobbyPanel(gameInfo)
        movePlayerToLobby(scene, gameInfo)
    }
}

function movePlayerToLobby(scene:any, gameInfo:any){
    let position = Transform.get(scene.parentEntity).position
    let randomPoint = getRandomPointInArea(gameInfo.sp, gameInfo.ss.x, gameInfo.ss.y, gameInfo.ss.z)

    let spawnPosition = Vector3.add(position, randomPoint)
    console.log('spawn position is', spawnPosition)
    movePlayerTo({newRelativePosition:spawnPosition})
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

export function gameListener(scene:any){
    scene[COMPONENT_TYPES.GAME_COMPONENT].onAdd((gameComponent:any, aid:any)=>{
        let info = getEntity(scene, aid)
        if(!info){
            return
        }

        gameComponent.listen("gameCountdown", (c:any, p:any)=>{
            console.log('game countodown', p, c, gameComponent.startingSoon)
            if((p !== undefined || p !== -500) && c > 0 && gameComponent.startingSoon){
                console.log('countdown started')
                uiDataUpdate(scene, info.entity, true)
            }

            // if(p !== undefined && (c !== -500 || c !== 0)){
            //     runGlobalTrigger(scene, Triggers.ON_GAME_START_COUNTDOWN)
            // }
    
            if(c === -500){
                // displayGamingCountdown(false, 0)
                //game countdown over
            }
        })

        gameComponent.listen("startingSoon", (c:any, p:any)=>{
            console.log('starting soon variable', p, c)
            if(c){
                prepGame(scene, aid, info, gameComponent)
            }
        })

        gameComponent.listen("started", (c:any, p:any)=>{
            console.log('started variable', p, c)
            if(c && (p === undefined || !p)){
                startGame(scene, aid, info, gameComponent)
            }
        })
    })
}

function prepGame(scene:any, aid:string, info:any, gameComponent:any){
    runGlobalTrigger(scene, Triggers.ON_GAME_START_COUNTDOWN, {input:0, pointer:0, entity:info.entity})
}

function startGame(scene:any, aid:string, info:any, gameInfo:any){
    ///enable ray casting,
    //add objects to players
    //do we load the game items here?
    //etc etc

    //do we check if player is playing right now? or expose that as a condition in the scene

    runGlobalTrigger(scene, Triggers.ON_GAME_START, {
        input:0,
        pointer:0,
        entity: info.entity
    })

    console.log('player game status is', localPlayer.gameStatus, localPlayer.gameId, aid, gameInfo)

    if(localPlayer && localPlayer.gameStatus == PLAYER_GAME_STATUSES.PLAYING && localPlayer.gameId === gameInfo.id){
        movePlayerToTeamSpawn(scene, gameInfo)
    }
}

function movePlayerToTeamSpawn(scene:any, gameInfo:any){
    let position = Transform.get(scene.parentEntity).position
    let teamInfo:any

    gameInfo.teams.forEach((team:any, aid:string)=>{
        if(team.mates && team.mates.includes(localUserId)){
            teamInfo = team
        }
    })

    if(teamInfo){
        let randomPoint = getRandomPointInArea(teamInfo.sp, teamInfo.ss.x, teamInfo.ss.y, teamInfo.ss.z)

        let spawnPosition = Vector3.add(position, randomPoint)
        movePlayerTo({newRelativePosition:spawnPosition})
    }
}
