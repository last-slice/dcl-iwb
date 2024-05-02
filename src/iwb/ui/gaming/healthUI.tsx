import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { UICounter, CustomCounter } from '../../../ui_components/UICounter'
import { Color4 } from '@dcl/sdk/math'

export let show = false
export let healthUI = new CustomCounter( 4, 4, 25, 'center', "images/customCounter/number_sheet.png")

export function displayHealthUI(value: boolean) {
    show = value

    if(value){
        healthUI.show()
      
    }else{
        healthUI.hide()
    }
}

export function HealthUI() {
    return (
        <UiEntity
            key={"iwbgaminghealthui"}
            uiTransform={{
                display: show ? "flex" : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: 'auto',
                height: 'auto',
                positionType: 'absolute',
                position:{right:'5%', top:'10%'}
            }}
        >

        <UICounter customCounter={healthUI} />

        </UiEntity>
       
    )
}