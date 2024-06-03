import ReactEcs, {Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps} from '@dcl/sdk/react-ecs'
import resources from '../../helpers/resources'
import { localPlayer, settings } from '../../components/Player'
import { EDIT_MODES, COMPONENT_TYPES } from '../../helpers/types'
import { selectedItem, saveItem, deleteSelectedItem, cancelEditingItem, updateSelectedAssetId, selectedAssetId } from '../../modes/Build'
import { calculateImageDimensions, calculateSquareImageDimensions, getImageAtlasMapping, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'
import { displaySkinnyVerticalPanel } from '../Reuse/SkinnyVerticalPanel'
import { getView } from '../uiViews'
import { items } from '../../components/Catalog'
import { colyseusRoom } from '../../components/Colyseus'

export function createEditAssetPanel() {
    return (
        <UiEntity
            key={resources.slug + "editobjectpanel"}
            uiTransform={{
                display: selectedItem && selectedItem.enabled && selectedItem.mode === EDIT_MODES.EDIT /*&& visibleComponent !== COMPONENT_TYPES.ADVANCED_COMPONENT*/ ? 'flex' : 'none',
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
                {/* <EditObjectData/>  */}

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
                            if(settings.confirms){
                                updateSelectedAssetId(selectedItem.aid)
                                displaySkinnyVerticalPanel(true, getView("Confirm Delete Entity"), localPlayer.activeScene.names.get(selectedAssetId).value)
                            }else{
                                deleteSelectedItem(selectedItem.aid)
                            }
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

function EditObjectDetails() {
    return (
        <UiEntity
            key={resources.slug + "editobjectdetailsinfo"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '95%',
                height: '20%',
                margin:{top:'5%'}
            }}
        // uiBackground={{color:Color4.Teal()}}
        >


            {/* top image row */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection:'row',
                    justifyContent: 'center',
                    width: '90%',
                    height: '80%',
                }}
                // uiBackground={{color:Color4.Green()}}
            >

                {/* image column */}
                <UiEntity
                uiTransform={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection:'row',
                    justifyContent: 'center',
                    width: '40%',
                    height: '100%',
                }}
                // uiBackground={{color:Color4.Blue()}}
            >

                 <UiEntity
                uiTransform={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateSquareImageDimensions(10).width,
                    height: calculateSquareImageDimensions(10).height,
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: "" + (selectedItem && selectedItem.enabled ? items.get(selectedItem.catalogId)!.im : "")
                    },
                    uvs: getImageAtlasMapping({
                        atlasHeight: 256,
                        atlasWidth: 256,
                        sourceTop: 0,
                        sourceLeft: 0,
                        sourceWidth: 256,
                        sourceHeight: 256
                    })
                }}
                />

                </UiEntity>

                   
                {/* buttons column */}
                <UiEntity
                uiTransform={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection:'column',
                    justifyContent: 'center',
                    width: '40%',
                    height: '100%',
                }}
                // uiBackground={{color:Color4.Green()}}
            >


                </UiEntity>

                 {/* back button column */}
                 <UiEntity
                uiTransform={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection:'column',
                    justifyContent: 'flex-start',
                    width: '20%',
                    height: '100%',
                    margin:{top:"5%"}
                }}
                // uiBackground={{color:Color4.Teal()}}
            >
                 {/* <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateImageDimensions(2, getAspect(uiSizes.backButton)).width,
                    height: calculateImageDimensions(2, getAspect(uiSizes.backButton)).height,
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.backButton)
                }}
                onMouseDown={() => {
                    displayCatalogInfoPanel(false)
                    displayCatalogPanel(true)
                }}
            /> */}
                </UiEntity>

            </UiEntity>

            {/* header and description row */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection:'column',
                    justifyContent: 'center',
                    width: '90%',
                    height: '20%',
                    margin:{top:"1%"}
                }}
                // uiBackground={{color:Color4.Yellow()}}
            >

                    {/* item name */}
                    <UiEntity
                    uiTransform={{
                        display: 'flex',//
                        flexDirection: 'column',
                        width: '100%',
                        height: '100%',
                        justifyContent:'center',
                    }}
                    uiText={{ value: "" + (selectedItem && selectedItem.enabled ? getAssetName() : ""), fontSize: sizeFont(40, 30), textAlign:'middle-left'}}
                     />
                     
                     
            </UiEntity>
            
        </UiEntity>
    )
}

function getAssetName(){
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(scene){
        let itemInfo = scene.names.get(selectedItem.aid)
        if(itemInfo){
            return itemInfo.value
        }
        return ""
    }
    return ""
}