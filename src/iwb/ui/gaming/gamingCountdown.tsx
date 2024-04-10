import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { UICounter, CustomCounter } from '../../../ui_components/UICounter'
import { engine } from '@dcl/sdk/ecs'
import { utils } from '../../helpers/libraries'

export let showGamingCountdown = true
export let counter = new CustomCounter( 4, 4, 150, 'center', "images/customCounter/number_sheet.png")
export let countdown = 0
export let countdownInterval:any

displayGamingCountdown(true, 5)

export function displayGamingCountdown(value: boolean, time?:number) {
    showGamingCountdown = value

    if(value){
        counter.show()
        if(time){
            counter.increaseNumberBy(time)
            countdown = time

            countdownInterval = utils.timers.setInterval(()=>{
                console.log('countdown is ', countdown)
                if(countdown > 1){
                    countdown--
                    counter.increaseNumberBy(-1)
                }else{
                    displayGamingCountdown(false)
                }
            }, 1000)
        }
    }else{
        counter.hide()
        utils.timers.clearInterval(countdownInterval)
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

        <UICounter customCounter={counter} />

        </UiEntity>
       
    )
}