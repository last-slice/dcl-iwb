import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { addLineBreak, calculateImageDimensions, calculateSquareImageDimensions, dimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'

export let show = false

export function displayExpandedMap(value: boolean, w?:string) {
    show = value
}


export function createExpandedMap() {
    return (
        <UiEntity
            key={"iwbexpandedmap"}
            uiTransform={{
                display: show ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(50, getAspect(uiSizes.horizRectangle)).width,
                height: calculateImageDimensions(50, getAspect(uiSizes.horizRectangle)).height,
                positionType: 'absolute',
                position: { left: (dimensions.width - calculateImageDimensions(50, getAspect(uiSizes.horizRectangle)).width) / 2, bottom: '25%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.horizRectangle)
            }}
        >
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    display:'flex',
                    justifyContent:'flex-start'
                }}
            >

        </UiEntity>

        </UiEntity>
    )
}