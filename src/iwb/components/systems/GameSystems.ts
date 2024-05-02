import {engine } from "@dcl/sdk/ecs"
import { utils } from "../../helpers/libraries";
import { displayGamingCountdown, levelCountdownTimer } from "../../ui/gaming/gamingCountdown";
import { displayGamingTimer, gameCountdownTimerDisplay } from "../../ui/gaming/gamingTimer";
import { levelCountdownEnded, levelTimerEnded, currentGame } from "../modes/gaming/playing";
import { LevelTimer } from "../../helpers/types";

let levelTimer:LevelTimer
export function startGameTimerSystem(){
    levelTimer = {...currentGame.currentLevel.timer}
    levelTimer.current = levelTimer.start

    if(levelTimer.direction > 0){
        engine.addSystem(LevelTimerUpSystem)
    }else{
        engine.addSystem(LevelTimerDownSystem)
    }
    displayGamingTimer(true)
}

export function LevelTimerDownSystem(dt: number) {
    if(levelTimer.current! > levelTimer.end){
        levelTimer.current! -= dt
        gameCountdownTimerDisplay.setNumber(Math.ceil(levelTimer.current!))
    }else{
        engine.removeSystem(LevelTimerDownSystem)
        levelTimerEnded()
    }
}

export function LevelTimerUpSystem(dt: number) {
    if(levelTimer.current! < levelTimer.end){
        levelTimer.current! += dt
        gameCountdownTimerDisplay.setNumber(Math.floor(levelTimer.current!))
    }else{
        engine.removeSystem(LevelTimerUpSystem)
        levelTimerEnded()
    }
}


export let levelCountdown = 0
let levelCountdownInterval:any
export function startlevelCountdownTimer(time:number){
    levelCountdown = time
    levelCountdownTimer.increaseNumberBy(time)

    displayGamingCountdown(true)

    levelCountdownInterval = utils.timers.setInterval(()=>{
        if(levelCountdown > 1){
            levelCountdown--
            levelCountdownTimer.increaseNumberBy(-1)
            
            //play sound based on game config?
        }else{
            clearGameCountdownInterval()
            levelCountdownEnded()
        }
    }, 1000)
}

export function clearGameCountdownInterval(){
    utils.timers.clearInterval(levelCountdownInterval)
}