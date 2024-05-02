import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { UICounter, CustomCounter } from '../../../ui_components/UICounter'
import { Color4 } from '@dcl/sdk/math'

export let showGamingUI = false
export let levelUI = new CustomCounter( 4, 4, 25, 'center', "images/customCounter/number_sheet.png")

export function displayLevelUI(value: boolean) {
    showGamingUI = value

    if(value){
        levelUI.show()
      
    }else{
        levelUI.hide()
    }
}

export function LevelUI() {
    return (
        <UiEntity
            key={"iwbgaminglevelui"}
            uiTransform={{
                display: showGamingUI ? "flex" : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: 'auto',
                height: 'auto',
                positionType: 'absolute',
                position:{right:'5%', top:'5%'}
            }}
        >

        <UICounter customCounter={levelUI} />

        </UiEntity>
       
    )
}