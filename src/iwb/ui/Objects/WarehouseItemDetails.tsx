import ReactEcs, {Dropdown, UiEntity} from '@dcl/sdk/react-ecs'
import resources from '../../helpers/resources'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'
import { utils } from '../../helpers/libraries'
import { engine } from '@dcl/sdk/ecs'
import { hideWarehouseDetailsPanel, playAssetAnimation, selectAssetAnimation, selectedWarehouseItem, warehouseAnimations, warehouseDetailsPanelPosition } from '../../warehouse/Warehouse'
import { setUIClicked } from '../ui'
import { Color4 } from '@dcl/sdk/math'
import { formatDollarAmount } from '../../helpers/functions'
import { openExternalUrl } from '~system/RestrictedActions'
import { localUserId } from '../../components/Player'

let showWarehousePanel:boolean = true

export function createWarehouseItemDetailsPanel() {
    return (
        <UiEntity
            key={resources.slug + "warehosue-item-info-panel"}
            uiTransform={{
                display: showWarehousePanel ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: calculateImageDimensions(25, getAspect(uiSizes.horizRectangle)).width,
                height: calculateImageDimensions(25,getAspect(uiSizes.horizRectangle)).height,
                positionType: 'absolute',
                position: {right: '3%', bottom: `${warehouseDetailsPanelPosition}%`}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png',
                },
                uvs: getImageAtlasMapping(uiSizes.horizRectangle)
            }}
            // onMouseDown={()=>{
            //     setUIClicked(true)
            //     hideWarehouseDetailsPanel()
            //     setUIClicked(false)
            // }}
            // onMouseUp={()=>{
            //     setUIClicked(false)
            // }}
        >
            {/* top image row */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '90%',
                    height: '30%',
                    margin: {top: "5%"}
                }}
                // uiBackground={{color:Color4.Green()}}
            >
                 {/* image column */}
                 <UiEntity
                    uiTransform={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        width: '30%',
                        height: '100%',
                    }}
                    // uiBackground={{color:Color4.Blue()}}
                >

                    <UiEntity
                        uiTransform={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: calculateSquareImageDimensions(15).width,
                            height: calculateSquareImageDimensions(15).height,
                        }}
                        uiBackground={{
                            textureMode: 'stretch',
                            texture: {
                                src: selectedWarehouseItem ? selectedWarehouseItem.im : ""
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

                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        width: '60%',
                        height: '100%',
                        margin:{left:"2%"}
                    }}
                    // uiBackground={{color:Color4.Green()}}
                >
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: calculateImageDimensions(7, getAspect(uiSizes.buttonPillBlack)).width,
                            height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
                            margin: {bottom: "2%"}
                        }}
                        uiBackground={{
                            textureMode: 'stretch',
                            texture: {
                                src: 'assets/atlas2.png'
                            },
                            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                        }}
                        onMouseDown={() => {
                            // if (playerMode === SCENE_MODES.BUILD_MODE) {
                            //     selectCatalogItem(selectedItem?.id, EDIT_MODES.GRAB, false)
                            //     displayCatalogInfoPanel(false)
                            //     displayGrabContextMenu(true)
                            // }
                            setUIClicked(true)
                            openExternalUrl({url: (resources.DEBUG ? resources.endpoints.validateTest : resources.endpoints.toolsetProd) + "/warehouse/asset/" + localUserId + "/" + selectedWarehouseItem.id + ".glb"})
                            setUIClicked(false)
                        }}
                        onMouseUp={()=>{
                            setUIClicked(false)
                        }}
                        uiText={{value: "Download", color: Color4.White(), fontSize: sizeFont(25, 20)}}
                    />

                    <UiEntity
                        uiTransform={{
                            display: warehouseAnimations.length > 0 ? 'flex' : 'none',
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            width: '80%',
                            height: '50%',
                        }}
                        // uiBackground={{color:Color4.Green()}}
                    >
                        <UiEntity
                        uiTransform={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            width: '80%',
                            height: '100%',
                        }}
                    >
                        <Dropdown
                            options={[...warehouseAnimations]}
                            selectedIndex={0}
                            onChange={selectAssetAnimation}
                            uiTransform={{
                                width: '100%',
                                height: '90%',
                            }}
                            color={Color4.White()}
                            fontSize={sizeFont(20, 15)}
                        />
                        </UiEntity>

                        <UiEntity
                        uiTransform={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            width: '20%',
                            height: '100%',
                        }}
                    >
        
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(2, getAspect(uiSizes.rightCarrotWhite)).width,
                height: calculateImageDimensions(2,getAspect(uiSizes.rightCarrotWhite)).height,
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png',
                },
                uvs: getImageAtlasMapping(uiSizes.rightCarrotWhite)
            }}
            onMouseDown={()=>{
                setUIClicked(true)
                playAssetAnimation()
                setUIClicked(false)
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
            />
                        </UiEntity>

                        </UiEntity>

                        

                </UiEntity>

                </UiEntity>

                {/* item name */}
                <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '90%',
                    height: '15%',
                    margin:{top:"2%"}
                }}
                uiText={{value: `${selectedWarehouseItem?.n}`, fontSize: sizeFont(25, 20), textAlign: 'middle-left'}}
                />


            {/* size and tri count row */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '90%',
                    height: '30%',
                    margin: {top: "1%"}
                }}
                // uiBackground={{color:Color4.Blue()}}
            >

                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '50%',
                        height: '100%',
                    }}
                >

<UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '20%',
            }}
            uiText={{
                value: `Artist: ${selectedWarehouseItem?.on}`,
                textAlign: 'middle-left',
                fontSize: sizeFont(25, 15)
            }}
        />

                    <UiEntity
                            uiTransform={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                height: '22%',
                            }}
                            uiText={{
                                value: `Size: ${(selectedWarehouseItem?.si / 1024 / 1024).toFixed(2)}MB`,
                                textAlign: 'middle-left',
                                fontSize: sizeFont(25, 15)
                            }}
                        />

                        <UiEntity
                                uiTransform={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '100%',
                                    height: '22%',
                                }}
                                uiText={{
                                    value: 'Poly Count: ' + (selectedWarehouseItem ? formatDollarAmount(selectedWarehouseItem?.pc) : 0),
                                    textAlign: 'middle-left',
                                    fontSize: sizeFont(25, 15)
                                }}
                            />

                        <UiEntity
                                uiTransform={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '100%',
                                    height: '22%',
                                }}
                                uiText={{value: `Type: ${selectedWarehouseItem?.ty}`, fontSize: sizeFont(25, 15), textAlign: 'middle-left'}}
                            />

                        <UiEntity
                            uiTransform={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                height: '22%',
                            }}
                            uiText={{value: `Tags:   ${selectedWarehouseItem?.tag}`, fontSize: sizeFont(25, 15), textAlign: 'middle-left'}}
                        />

                </UiEntity>


                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '50%',
                        height: '100%',
                    }}
                >
                    <UiEntity
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: 'auto',
                        alignContent: 'center',
                        height: 'auto',
                    }}
                    uiText={{
                        value: `Description:   ${selectedWarehouseItem?.d}`,
                        fontSize: sizeFont(25, 15),
                        textAlign: 'top-left'
                    }}
                />
                    </UiEntity>

                

                

                
            </UiEntity>


{/* back button column */}
    <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(2, getAspect(uiSizes.backButton)).width,
            height: calculateImageDimensions(2, getAspect(uiSizes.backButton)).height,
            positionType:'absolute',
            position:{top:'5%', right:'3%'}
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.backButton)
        }}
        onMouseDown={() => {
            setUIClicked(true)
            hideWarehouseDetailsPanel()
            setUIClicked(false)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
                    />

            </UiEntity>
    )
}