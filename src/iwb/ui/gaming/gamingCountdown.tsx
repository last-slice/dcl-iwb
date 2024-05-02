import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { UICounter, CustomCounter } from '../../../ui_components/UICounter'
import { clearGameCountdownInterval, startGameCountdownTime } from '../../components/systems/GameSystems'

export let showGamingCountdown = true
export let gameCountdownTimer = new CustomCounter( 4, 4, 150, 'center', "images/customCounter/number_sheet.png")

export function displayGamingCountdown(value: boolean, time?:number) {
    showGamingCountdown = value

    if(value){
        gameCountdownTimer.show()
    }else{
        gameCountdownTimer.hide()
    }
}

export function GamingCountdown() {
    return (
        <UiEntity
            key={"iwbgamingcountdown"}
            uiTransform={{
                display: showGamingCountdown ? "flex" : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: 'auto',
                height: 'auto',
                positionType: 'absolute',
                position:{left:'50%', top:'50%'}
            }}
            // uiBackground={{color:Color4.Green()}}
        >

        <UICounter customCounter={gameCountdownTimer} />

        </UiEntity>
       
    )
}