import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'

export let show = false

export function displayGamingBorderUI(value: boolean) {
    show = value
}

export function GamingBorderUI() {
    return (
        <UiEntity
            key={"iwbgamingborder"}
            uiTransform={{
                display: show ? "flex" : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                positionType: 'absolute',
            }}
            uiBackground={{color: Color4.create(1,1,1,.1)}}
        />
    )
}