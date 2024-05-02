import { displayGamingCountdown } from "../../../ui/gaming/gamingCountdown";
import { displayGamingTimer } from "../../../ui/gaming/gamingTimer";

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