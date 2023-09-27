import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, dimensions, getImageAtlasMapping } from './helpers'

export let showUploadConfirmPanel = false

export function diplayUploadConfirmPanel(value: boolean) {
    showUploadConfirmPanel = value
}

export function createUploadConfirmPanel() {
    return (
        <UiEntity
            key={"uploadconfirmpanel"}
            uiTransform={{
                display: showUploadConfirmPanel ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(35, 578/232).width,
                height: calculateImageDimensions(35, 578/232).height,
                positionType: 'absolute',
                position:{left:(dimensions.width - calculateImageDimensions(35, 578/232).width) / 2, top:(dimensions.height - calculateImageDimensions(35, 578/232).height) / 2}
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
                    sourceTop:263,
                    sourceLeft:0,
                    sourceWidth:578,
                    sourceHeight:232
                })
            }}
        >
            <Button
        uiTransform={{ width: 100, height: 50, position: { top: 0, left: 20 }, alignSelf: 'flex-start' }}
        value='Place Item'
        variant='primary'
        fontSize={14}
        uiBackground={{ color: Color4.create(0.063, 0.118, 0.31, .5) }}
        onMouseDown={() => {


        }}
      />
        </UiEntity>

        </UiEntity>
    )
}