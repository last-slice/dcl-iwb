import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, dimensions, getImageAtlasMapping } from './helpers'

export let showRectanglePanel = false

export function displayRectanglePanel(value: boolean) {
    showRectanglePanel = value
}

export function createRectanglePanel() {
    return (
        <UiEntity
            key={"rectanglepanel"}
            uiTransform={{
                display: showRectanglePanel ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(35, 447/431).width,
                height: calculateImageDimensions(35, 447/431).height,
                positionType: 'absolute',
                position:{left:(dimensions.width - calculateImageDimensions(35, 447/431).width) / 2, top:(dimensions.height - calculateImageDimensions(35, 447/431).height) / 2}
            }}
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
                    sourceTop:266,
                    sourceLeft:577,
                    sourceWidth:447,
                    sourceHeight:431
                })
            }}
        >
        </UiEntity>

        </UiEntity>
    )
}