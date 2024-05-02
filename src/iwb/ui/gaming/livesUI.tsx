import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { UICounter, CustomCounter } from '../../../ui_components/UICounter'
import { Color4 } from '@dcl/sdk/math'

export let show = false
export let livesUI = new CustomCounter( 4, 4, 25, 'center', "images/customCounter/number_sheet.png")

export function displayLivesUI(value: boolean) {
    show = value

    if(value){
        livesUI.show()
      
    }else{
        livesUI.hide()
    }
}

export function LivesUI() {
    return (
        <UiEntity
            key={"iwbgaminglivesui"}
            uiTransform={{
                display: show ? "flex" : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: 'auto',
                height: 'auto',
                positionType: 'absolute',
                position:{right:'5%', top:'15%'}
            }}
        >

        <UICounter customCounter={livesUI} />

        </UiEntity>
       
    )
}