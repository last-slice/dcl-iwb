import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { addLineBreak, calculateImageDimensions, calculateSquareImageDimensions, dimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'
import { cRoom, colyseusConnect, joinWorld } from '../../components/messaging'
import { localUserId, players } from '../../components/player/player'

export function createDebugPanel() {
    return (
        <UiEntity
            key={"debugpanel"}
            uiTransform={{
                display: DEBUG ? 'flex' : 'none',
                // display:'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(20, getAspect(uiSizes.vertRectangle)).width,
                height: calculateImageDimensions(5,getAspect(uiSizes.vertRectangle)).height,
                positionType: 'absolute',
                position: { left: (dimensions.width - calculateImageDimensions(35, getAspect(uiSizes.vertRectangle)).width) / 2, top: '2%' }
            }}
        // uiBackground={{ color: Color4.Red() }}
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
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.vertRectangle)
                }}
            >

<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(8, getAspect(uiSizes.rectangleButton)).width,
                height: calculateImageDimensions(15,getAspect(uiSizes.rectangleButton)).height,
                margin:{top:"1%", bottom:'1%'},
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.normalButton)
            }}
            onMouseDown={() => {
                cRoom.leave()
            }}
            uiText={{value: "Leave Room", color:Color4.Black(), fontSize:sizeFont(30,20)}}
            />

        </UiEntity>

        </UiEntity>
    )
}


