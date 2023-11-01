import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { showSetting } from './settingsIndex'

export function AccessPanel() {
    return (
        <UiEntity
            key={"accesspanel"}
            uiTransform={{
                display: showSetting === "Access" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
            }}
        uiBackground={{ color: Color4.Green() }}
        >
        </UiEntity>
    )
}