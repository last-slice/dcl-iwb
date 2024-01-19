import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Dropdown } from '@dcl/sdk/react-ecs'
import { CatalogItemType, EDIT_MODES, SCENE_MODES } from '../../helpers/types';
import { calculateImageDimensions, calculateSquareImageDimensions, dimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers';
import resources from '../../helpers/resources';
import { Color4 } from '@dcl/sdk/math';
import { uiSizes } from '../uiConfig';
import { displayCatalogPanel } from './CatalogPanel';
import { formatDollarAmount } from '../../helpers/functions';
import { localUserId, players } from '../../components/player/player';
import { selectCatalogItem } from '../../components/modes/build';

export let showCatalogInfoPanel = false

export function displayCatalogInfoPanel(value: boolean) {
    showCatalogInfoPanel = value;
}

let selectedItem: CatalogItemType | null = null;


export function setSelectedInfoItem(item: CatalogItemType | null) {
    selectedItem = item;
    displayCatalogInfoPanel(true)
}


export function createCatalogInfoPanel() {
    if (!showCatalogInfoPanel || !selectedItem) return null;

    return (
        <UiEntity
            key={"catalog-item-info-panel"}
            uiTransform={{
                display: showCatalogInfoPanel ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: calculateImageDimensions(25, 345 / 511).width,
                height: calculateImageDimensions(25, 345 / 511).height,
                positionType: 'absolute',
                position: { right: '3%', bottom: '3%' }
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas1.png',
                },
                uvs: getImageAtlasMapping(uiSizes.vertRectangleOpaque)
            }}
        >

            {/* top image row */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection:'row',
                    justifyContent: 'center',
                    width: '90%',
                    height: '30%',
                    margin:{top:"3%"}
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
                    width: calculateSquareImageDimensions(15).width,
                    height: calculateSquareImageDimensions(15).height,
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: selectedItem?.im
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
                // uiBackground={{color:Color4.Blue()}}
            >
                  <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateImageDimensions(6, getAspect(uiSizes.rectangleButton)).width,
                    height: calculateImageDimensions(12, getAspect(uiSizes.rectangleButton)).height,
                    margin:{bottom:"2%"}
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.positiveButton)
                }}
                onMouseDown={() => {
                    if(players.get(localUserId)?.mode === SCENE_MODES.BUILD_MODE){
                        selectCatalogItem(selectedItem?.id, EDIT_MODES.GRAB, false)
                        displayCatalogInfoPanel(false)
                    }  
                }}
                uiText={{ value: "Place", color: Color4.White(), fontSize: sizeFont(25, 20) }}
            />

                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateImageDimensions(6, getAspect(uiSizes.rectangleButton)).width,
                    height: calculateImageDimensions(12, getAspect(uiSizes.rectangleButton)).height,
                    margin:{top:"2%"},
                    display:'none'
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.normalButton)
                }}
                onMouseDown={() => {

                }}
                uiText={{ value: "Download", color: Color4.White(), fontSize: sizeFont(25, 20) }}
            />


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
                 <UiEntity
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
            />
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
                    height: '15%',
                    margin:{top:"1%"}
                }}
                // uiBackground={{color:Color4.Blue()}}
            >

                    {/* item name */}
                    <UiEntity
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        height: '30%',
                        margin:{bottom:"5%"}
                    }}
                    uiText={{ value:  `${selectedItem?.n}`, fontSize: sizeFont(40, 30), textAlign:'middle-left'}}
                     />


                    {/* item catalog */}
                    <UiEntity
                        uiTransform={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            height: '20%',
                            margin:{bottom:"5%"}
                        }}
                        uiText={{ value: `Catalog Name ${selectedItem?.cat}`, fontSize: sizeFont(25, 15), textAlign:'middle-left'}}
                    />

                    <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '20%',
                }}
                uiText={{ value: `Artist:   ${selectedItem?.on}`, fontSize: sizeFont(25, 15), textAlign:'middle-left'}}
                /> 

                </UiEntity>

            {/* size and tri count row */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection:'row',
                    justifyContent: 'center',
                    width: '90%',
                    height: '10%',
                    margin:{top:"1%"}
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
                uiText={{ value: `Size: ${(selectedItem?.si / 1024 / 1024).toFixed(2)}MB`, textAlign:'middle-left',  fontSize: sizeFont(25, 15)}}
            /> 

                <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '50%',
                    height: '100%',
                }}
                uiText={{ value: 'Poly Count: ' + formatDollarAmount(selectedItem?.pc), textAlign:'middle-left',  fontSize: sizeFont(25, 15)}}
            />

            </UiEntity>


            {/* catalog row */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    alignSelf:'center',
                    flexDirection:'column',
                    justifyContent: 'flex-start',
                    width: '90%',
                    height: '5%',
                    margin:{top:"1%"}
                }}
                // uiBackground={{color:Color4.Blue()}}
            >

                   <UiEntity
                    uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: 'auto',
                    alignContent: 'center',
                    height: 'auto',
                }}
                uiText={{ value: `Catalog:   ${selectedItem?.d}`,  fontSize: sizeFont(25, 15), textAlign:'middle-left' }}
            />

            </UiEntity>

            {/* description row */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    alignSelf:'center',
                    flexDirection:'column',
                    justifyContent: 'flex-start',
                    width: '90%',
                    height: '15%',
                    margin:{top:"1%"}
                }}
                // uiBackground={{color:Color4.Blue()}}
            >

                    <UiEntity
                    uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: 'auto',
                    alignContent: 'center',
                    height: 'auto',
                }}
                uiText={{ value: `Description:   ${selectedItem?.d}`,  fontSize: sizeFont(25, 15), textAlign:'middle-left' }}
            />

            </UiEntity>


            {/* tags row */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    alignSelf:'center',
                    flexDirection:'column',
                    justifyContent: 'flex-start',
                    width: '90%',
                    height: '10%',
                    margin:{top:"1%"}
                }}
                // uiBackground={{color:Color4.Blue()}}
            >

                <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: 'auto',
                    height: 'auto',
                }}
                uiText={{ value: `Tags:   ${selectedItem?.tag}`,  fontSize: sizeFont(25, 15), textAlign:'middle-left' }}
            />


            </UiEntity>

        </UiEntity>
    );
}