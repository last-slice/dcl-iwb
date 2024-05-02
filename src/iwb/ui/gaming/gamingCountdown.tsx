import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { UICounter, CustomCounter } from '../../../ui_components/UICounter'

export let showGamingCountdown = false
export let levelCountdownTimer = new CustomCounter( 4, 4, 150, 'center', "images/customCounter/number_sheet.png")

export function displayGamingCountdown(value: boolean, reset?:number) {
    if(reset){
        levelCountdownTimer.setNumber(reset)    
    }


    showGamingCountdown = value

    if(value){
        levelCountdownTimer.show()
    }else{
        levelCountdownTimer.hide()
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
            }}
            // uiBackground={{color:Color4.Green()}}
        >

        <UICounter customCounter={levelCountdownTimer} />

        </UiEntity>
       
    )
}