import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { GamingTimer, displayGamingTimer } from './gamingTimer'
import { GamingCountdown, displayGamingCountdown } from './gamingCountdown'
import { LevelUI, displayLevelUI } from './levelUI'
import { ScoreUI, displayScoreUI } from './scoreUI'
import { HealthUI, displayHealthUI } from './healthUI'
import { LivesUI, displayLivesUI } from './livesUI'
import { GamingBorderUI, displayGamingBorderUI } from './gamingborderUI'

export let showGaming = true

export function displayGamingUI(value: boolean) {
    showGaming = value
}

export function resetAllGamingUI(){
    displayLevelUI(false)
    displayScoreUI(false)
    displayHealthUI(false)
    displayLivesUI(false)
    displayGamingBorderUI(false)
    displayGamingTimer(false, 0)
    displayGamingCountdown(false, 0)
}

export function createGamingUI() {
    return (
        <UiEntity
            key={"iwbgaminguiholder"}
            uiTransform={{
                display: showGaming ? "flex" : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                positionType: 'absolute',
            }}
        >
            <GamingBorderUI/>
            <GamingCountdown/>
            <GamingTimer/>
            <LevelUI/>
            <ScoreUI/>
            <HealthUI/>
            <LivesUI/>


        </UiEntity>
       
    )
}