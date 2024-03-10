import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { calculateImageDimensions, dimensions, getImageAtlasMapping } from '../helpers';

export function SmallOpaqueRectangle(data:any) {
    return (
        <UiEntity
        key={data.key}
            uiTransform={{
                display:'flex',
                flexDirection: 'column',
                alignItems: data.alignItems ? data.alignItems : 'center',
                justifyContent: data.justifyContent ? data.justifyContent : 'center',
                alignContent: data.alignContent ? data.alignContent : 'center',
                width: calculateImageDimensions(data.size, 378 / 248).width,
                height: calculateImageDimensions(data.size, 378 / 248).height,
                positionType: data.positionType ? data.positionType : undefined,
                position: data.position ? data.positionType : undefined
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                src: 'assets/atlas1.png',
                },
                uvs:getImageAtlasMapping({
                    atlasHeight:1024,
                    atlasWidth:1024,
                    sourceTop:776,
                    sourceLeft:0,
                    sourceWidth:378,
                    sourceHeight:248
                })
            }}
        >
        </UiEntity>
    )
}
