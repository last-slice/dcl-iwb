import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { addLineBreak, calculateImageDimensions, calculateSquareImageDimensions, dimensions, getImageAtlasMapping } from './helpers'

export function PillPanel(info:any) {
    return (
        <UiEntity
            key={"pillpanel"}
            uiTransform={{
                display: info.show? 'flex' :'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(45, 824/263).width,
                height: calculateImageDimensions(45, 824/263).height,
                positionType: 'absolute',
                position:{left:(dimensions.width - calculateImageDimensions(45, 824/263).width) / 2, top:(dimensions.height - calculateImageDimensions(45, 824/263).height) / 2}
            }}
        >
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent:'center',
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
                    sourceTop:0,
                    sourceLeft:0,
                    sourceWidth:824,
                    sourceHeight:263
                })
            }}
        >



        </UiEntity>
        


        </UiEntity>
    )
}