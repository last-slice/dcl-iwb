import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { showSetting } from './settingsIndex'

export function ExplorePanel() {
    return (
        <UiEntity
            key={"explorepanel"}
            uiTransform={{
                display: showSetting === "Explore" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
            }}
        uiBackground={{ color: Color4.Yellow() }}
        >
        </UiEntity>
    )
}