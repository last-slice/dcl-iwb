import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { UICounter, CustomCounter } from '../../../ui_components/UICounter'
import { Color4 } from '@dcl/sdk/math'

export let showGamingTimer = false
export let counter = new CustomCounter( 4, 4, 60, 'center', "images/customCounter/number_sheet.png")

export function displayGamingTimer(value: boolean) {
    showGamingTimer = value

    counter.show()
    counter.increaseNumberBy(10)

    if(value){
        counter.show()
      
    }else{
        counter.hide()
    }
}

export function GamingTimer() {
    return (
        <UiEntity
            key={"iwbgamingtimer"}
            uiTransform={{
                display: showGamingTimer ? "flex" : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: 'auto',
                height: 'auto',
                positionType: 'absolute',
                position:{left:'50%', top:'10%'}
            }}
            // uiBackground={{color:Color4.Green()}}
        >

        <UICounter customCounter={counter} />

        </UiEntity>
       
    )
}