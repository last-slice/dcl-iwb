import ReactEcs, {Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps} from '@dcl/sdk/react-ecs'
import {
    addLineBreak,
    calculateImageDimensions,
    calculateSquareImageDimensions,
    dimensions,
    getAspect,
    getImageAtlasMapping,
    sizeFont,
    uiSizer
} from '../../helpers'
import {uiSizes} from '../../uiConfig'
import {EditTransform} from './EditTransform'
import {
    cancelEditingItem,
    cancelSelectedItem,
    deleteSelectedItem,
    saveItem,
    selectedItem
} from '../../../components/modes/build'
import {EDIT_MODES, EDIT_MODIFIERS} from '../../../helpers/types'
import {EditObjectDetails} from './EditObjectDetails'
import {EditObjectData, openEditComponent, visibleComponent} from './EditObjectDataPanel'
import {Color4} from '@dcl/sdk/math'

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
                height: calculateImageDimensions(27, 345 / 511).height,
                positionType: 'absolute',
                position: {right: '4%', bottom: '3%'}
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
                <EditObjectDetails/>
                <EditObjectData/>

                {/* button rows */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '90%',
                        height: '5%',
                        margin: {top: '1%'}
                    }}
                    // uiBackground={{color:Color4.Green()}}
                >

                    {/* save button */}
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '30%',
                            height: '100%',
                            margin: {left: "1%", right: "1%"}
                        }}
                        uiBackground={{
                            textureMode: 'stretch',
                            texture: {
                                src: 'assets/atlas2.png'
                            },
                            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                        }}
                        uiText={{value: "Save", fontSize: sizeFont(20, 16)}}
                        onMouseDown={() => {
                            saveItem()
                        }}
                    />

                    {/* delete button */}
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '30%',
                            height: '100%',
                            margin: {left: "1%", right: "1%"}
                        }}
                        uiBackground={{
                            textureMode: 'stretch',
                            texture: {
                                src: 'assets/atlas2.png'
                            },
                            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                        }}
                        uiText={{value: "Delete", fontSize: sizeFont(20, 16)}}
                        onMouseDown={() => {
                            deleteSelectedItem(selectedItem.entity)
                        }}
                    />

                    {/* cancel button */}
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '30%',
                            height: '100%',
                            margin: {left: "1%", right: "1%"}
                        }}
                        uiBackground={{
                            textureMode: 'stretch',
                            texture: {
                                src: 'assets/atlas2.png'
                            },
                            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                        }}
                        uiText={{value: "Cancel", fontSize: sizeFont(20, 16)}}
                        onMouseDown={() => {
                            cancelEditingItem()
                        }}
                    />
                </UiEntity>
            </UiEntity>
        </UiEntity>
    )
}
