import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { GamingTimer } from './gamingTimer'
import { GamingCountdown } from './gamingCountdown'
import { LevelUI } from './levelUI'
import { ScoreUI } from './scoreUI'
import { HealthUI } from './healthUI'
import { LivesUI } from './livesUI'

export let showGaming = true

export function displayGamingUI(value: boolean) {
    showGaming = value
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
            <GamingCountdown/>
            <GamingTimer/>
            <LevelUI/>
            <ScoreUI/>
            <HealthUI/>
            <LivesUI/>


        </UiEntity>
       
    )
}