import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { addLineBreak, calculateImageDimensions, calculateSquareImageDimensions, dimensions, getAspect, getImageAtlasMapping, sizeFont, uiSizer } from '../helpers'
import { uiSizes } from '../uiConfig'
import { EditTransform } from './EditTransform'
import { selectedItem } from '../../components/modes/build'
import { EDIT_MODES } from '../../helpers/types'//

export function createEditObjectPanel() {
    return (
        <UiEntity
            key={"editobjectpanel"}
            uiTransform={{
                display: selectedItem && selectedItem.enabled && selectedItem.mode === EDIT_MODES.EDIT ? 'flex' : 'none',
                // display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(20, getAspect(uiSizes.horzRectangleOpaque)).width,
                height: calculateImageDimensions(20, getAspect(uiSizes.horzRectangleOpaque)).height,
                positionType: 'absolute',
                position: { right: '4%', top:'2%' }
            }}
        // uiBackground={{ color: Color4.Red() }}
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
                        src: 'assets/atlas1.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.horzRectangleOpaque)
                }}
            >

                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '90%',
                        height: '10%',
                        margin:{top:'2%'}
                    }}
                uiText={{value: "Editing Object Name", fontSize:sizeFont(20,15)}}
                />

                    <EditTransform/>

                </UiEntity>
        </UiEntity>
    )
}