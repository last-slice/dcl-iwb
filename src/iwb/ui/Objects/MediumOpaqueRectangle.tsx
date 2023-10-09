import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { calculateImageDimensions, dimensions, getImageAtlasMapping } from '../helpers';
import resources from '../../helpers/resources';

export function MediumOpaqueRectangle(data:any) {
    return (
        <UiEntity
        key={data.key}
            uiTransform={{
                display:'flex',
                flexDirection: 'column',
                alignItems: data.alignItems ? data.alignItems : 'center',
                justifyContent: data.justifyContent ? data.justifyContent : 'center',
                alignContent: data.alignContent ? data.alignContent : 'center',
                width: calculateImageDimensions(data.size, 345 / 511).width,
                height: calculateImageDimensions(data.size, 345 / 511).height,
                positionType: data.positionType ? data.positionType : undefined,
                position: data.position ? data.positionType : undefined
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                src: resources.textures.atlas1
                },
                uvs:getImageAtlasMapping({
                    atlasHeight:1024,
                    atlasWidth:1024,
                    sourceTop:514,
                    sourceLeft:384,
                    sourceWidth:345,
                    sourceHeight:511
                })
            }}
        >
        </UiEntity>
    )
}
