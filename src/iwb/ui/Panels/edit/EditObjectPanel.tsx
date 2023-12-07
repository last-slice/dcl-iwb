import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { addLineBreak, calculateImageDimensions, calculateSquareImageDimensions, dimensions, getAspect, getImageAtlasMapping, sizeFont, uiSizer } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { EditTransform } from './EditTransform'
import { selectedItem } from '../../../components/modes/build'
import { EDIT_MODES, EDIT_MODIFIERS } from '../../../helpers/types'
import { EditObjectDetails } from './EditObjectDetails'
import { EditObjectData } from './EditObjectDataPanel'

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
                width: calculateImageDimensions(25, 345 / 511).width,
                height: calculateImageDimensions(30, 345 / 511).height,
                positionType: 'absolute',
                position: { right: '4%', bottom:'3%' }
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
                    uvs: getImageAtlasMapping(uiSizes.vertRectangleOpaque)
                }}
            >
                <EditObjectDetails />
                <EditObjectData/>
                <EditTransform/>

                </UiEntity>
        </UiEntity>
    )
}