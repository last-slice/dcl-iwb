import { utils } from "../../../helpers/libraries";
import { Game, Level } from "../../../helpers/types";
import { resetAllGamingUI } from "../../../ui/gaming/createGamingUI";
import { displayGamingCountdown } from "../../../ui/gaming/gamingCountdown";
import { displayGamingTimer } from "../../../ui/gaming/gamingTimer";
import { displayGamingBorderUI } from "../../../ui/gaming/gamingborderUI";
import { displayHealthUI, healthUI } from "../../../ui/gaming/healthUI";
import { displayLevelUI, levelUI } from "../../../ui/gaming/levelUI";
import { displayLivesUI, livesUI } from "../../../ui/gaming/livesUI";
import { displayScoreUI, scoreUI } from "../../../ui/gaming/scoreUI";
import { startGameTimerSystem, startlevelCountdownTimer } from "../../systems/GameSystems";
import { testGameData } from "./testGameData";
import { startGameWaves } from "./waveModule";

export let currentGame:Game

export function levelTimerEnded(){
    displayGamingTimer(false)
    
    console.log('level timer ended, do we check win conditions?')
}

export function levelCountdownEnded(){
    displayGamingCountdown(false)

    let level:Level | undefined = currentGame.currentLevel

    //check if game has a timer
    if(level && level.timer){
        startGameTimerSystem()
    }

    startGameLevel()
}

export function attemptGameStart(id:string){
    //check if currently playing

    //reset all gamig ui
    resetAllGamingUI()

    //setup current game ui based on game settings
    currentGame = {...testGameData}
    currentGame.started = false

    if(currentGame.uiBorder){
        displayGamingBorderUI(true)
    }

    initGameLevel(currentGame.startLevel)
}

export function initGameLevel(startLevel:number){
    currentGame.currentLevel = currentGame.levels[startLevel-1]
    console.log('starting level', currentGame.currentLevel)
    
    setupLevelUI()
}

export function setupLevelUI(){
    let level:Level | undefined = currentGame.currentLevel

    if(level){
        if(currentGame.startLives){
            livesUI.setNumber(currentGame.startLives)
            displayLivesUI(true)
        }
    
        if(level.showLevel){
            levelUI.setNumber(level.number)
            displayLevelUI(true)
        }
    
        if(currentGame.startHealth){
            healthUI.setNumber(currentGame.startHealth)
            displayHealthUI(true)
        }
    
        if(currentGame.startScore){
            scoreUI.setNumber(currentGame.startScore)
            displayScoreUI(true)
        }
        
        if(level.countdown){
            startlevelCountdownTimer(level.countdown.start)
        }   
    }
}

export function startGameLevel(){
    currentGame.started = true

    if(currentGame.currentLevel && currentGame.currentLevel.waves){
        startGameWaves(currentGame.currentLevel.waves)
    }
}



export function startTestGame(){
    // displayLivesUI(true)
    // livesUI.increaseNumberBy(3)

    // displayScoreUI(true)
    // scoreUI.increaseNumberBy(25)

    // displayHealthUI(true)
    // healthUI.setNumber(100)

    // displayLevelUI(true)
    // levelUI.setNumber(1)
    // utils.timers.setInterval(()=>{
    //     levelUI.increaseNumberBy(1)
    // }, 1000)
}