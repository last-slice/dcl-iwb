import { utils } from "../../../helpers/libraries";
import { displayGamingCountdown } from "../../../ui/gaming/gamingCountdown";
import { displayGamingTimer } from "../../../ui/gaming/gamingTimer";
import { displayHealthUI, healthUI } from "../../../ui/gaming/healthUI";
import { displayLevelUI, levelUI } from "../../../ui/gaming/levelUI";
import { displayLivesUI, livesUI } from "../../../ui/gaming/livesUI";
import { displayScoreUI, scoreUI } from "../../../ui/gaming/scoreUI";
import { startGameCountdownTime, startGameTimerSystem } from "../../systems/GameSystems";

export function gameTimerEnded(){
    console.log('game timer ended')
    displayGamingTimer(false)
}

export function gameCountdownEnded(){
    console.log('game countdown ended')
    displayGamingCountdown(false)
}

export function startGameCountdownTimer(time:number){
    displayGamingCountdown(true, time)
}

export function startGameTesting(){
    startGameTimerSystem(10)
    startGameCountdownTime(7)
    

    displayLivesUI(true)
    livesUI.increaseNumberBy(3)

    displayScoreUI(true)
    scoreUI.increaseNumberBy(25)

    displayHealthUI(true)
    healthUI.setNumber(100)

    displayLevelUI(true)
    levelUI.setNumber(1)
    // utils.timers.setInterval(()=>{
    //     levelUI.increaseNumberBy(1)
    // }, 1000)
}
