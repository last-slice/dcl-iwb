import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'

export let showPanel = false

export function displayLoadingScreen(value: boolean) {
    showPanel = value
}

export function createLoadingScreen() {
    return (
        <UiEntity
            key={"iwb-loading-panel"}
            uiTransform={{
                display: showPanel ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                positionType: 'absolute',
                position: { left: 0, top:0}
            }}
        uiBackground={{ color: Color4.Black() }}
        >

        </UiEntity>
    )
}