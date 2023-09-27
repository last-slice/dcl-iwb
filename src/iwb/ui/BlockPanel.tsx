import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, dimensions, getImageAtlasMapping } from './helpers'

export let showBlockPanel = false

export function displayBlockPanel(value: boolean) {
    showBlockPanel = value
}

export function createBlockPanel() {
    return (
        <UiEntity
            key={"blockpanel"}
            uiTransform={{
                display: showBlockPanel ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(45, 580/403).width,
                height: calculateImageDimensions(45, 580/403).height,
                positionType: 'absolute',
                position:{left:(dimensions.width - calculateImageDimensions(45, 580/403).width) / 2, top:(dimensions.height - calculateImageDimensions(45, 580/403).height) / 2}
            }}
            // uiBackground={{ color: Color4.Red() }}//
        >
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                height: '100%',
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                src: 'assets/atlas2.png'
                },
                uvs:getImageAtlasMapping({
                    atlasHeight:1024,
                    atlasWidth:1024,
                    sourceTop:495,
                    sourceLeft:2,
                    sourceWidth:580,
                    sourceHeight:403
                })
            }}
        >
        </UiEntity>

        </UiEntity>
    )
}