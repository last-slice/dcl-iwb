import {engine, Transform} from "@dcl/sdk/ecs"
import {localPlayer} from "../player/player"
import {checkScenePermissions} from "../scenes";
import { Quaternion } from "@dcl/sdk/math";
import { refreshMap } from "../../ui/map";
import { utils } from "../../helpers/libraries";
import { displayGamingCountdown, gameCountdownTimer } from "../../ui/gaming/gamingCountdown";
import { displayGamingTimer, gameCountdownTimerDisplay } from "../../ui/gaming/gamingTimer";
import { gameCountdownEnded, gameTimerEnded } from "../modes/gaming/playing";

let gameTimer = 0
export function startGameTimerSystem(time:number){
    gameTimer = time
    engine.addSystem(GameTimerSystem)
    displayGamingTimer(true)
}

export function GameTimerSystem(dt: number) {
    if(gameTimer > 0){
        gameTimer -= dt
        gameCountdownTimerDisplay.setNumber(Math.ceil(gameTimer))
    }else{
        engine.removeSystem(GameTimerSystem)
        gameTimer = 0
        gameTimerEnded()
    }
}


export let gameCountdown = 0
let countdownInterval:any
export function startGameCountdownTime(time:number){
    gameCountdown = time
    gameCountdownTimer.increaseNumberBy(time)

    displayGamingCountdown(true)

    countdownInterval = utils.timers.setInterval(()=>{
        if(gameCountdown > 1){
            gameCountdown--
            gameCountdownTimer.increaseNumberBy(-1)
            
            //play sound based on game config?
        }else{
            clearGameCountdownInterval()
            gameCountdownEnded()
        }
    }, 1000)
}

export function clearGameCountdownInterval(){
    utils.timers.clearInterval(countdownInterval)
}