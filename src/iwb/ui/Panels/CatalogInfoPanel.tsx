import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Dropdown } from '@dcl/sdk/react-ecs'
import { CatalogItemType } from '../../helpers/types';
import { calculateImageDimensions, calculateSquareImageDimensions, dimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers';
import { selectCatalogItem, useSelectedItem } from '../../components/modes/build';
import resources from '../../helpers/resources';
import { Color4 } from '@dcl/sdk/math';
import { uiSizes } from '../uiConfig';
import { displayCatalogPanel } from './CatalogPanel';


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
            key={"info-panel"}
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
                uvs: getImageAtlasMapping({
                    atlasHeight: 1024,
                    atlasWidth: 1024,
                    sourceTop: 514,
                    sourceLeft: 384,
                    sourceWidth: 345,
                    sourceHeight: 511
                })
            }}
        >
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateSquareImageDimensions(15).width,
                    height: calculateSquareImageDimensions(20).height,
                    position: { left: (dimensions.width - calculateImageDimensions(115, 345 / 511).width) / 2, top: (dimensions.height - calculateImageDimensions(30, 345 / 511).height) / 2 }
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: resources.endpoints.proxy + selectedItem?.im
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
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateImageDimensions(6, getAspect(uiSizes.rectangleButton)).width,
                    height: calculateImageDimensions(20, getAspect(uiSizes.rectangleButton)).height,
                    position: { left: (dimensions.width - calculateImageDimensions(95, 345 / 511).width) / 2, top: (dimensions.height - calculateImageDimensions(35, 345 / 511).height) / 2 },
                    margin: { right: "1%" },
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.positiveButton)
                }}
                onMouseDown={() => {

                }}
                uiText={{ value: "Place", color: Color4.Black(), fontSize: sizeFont(25, 15) }}
            />
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateImageDimensions(6, getAspect(uiSizes.rectangleButton)).width,
                    height: calculateImageDimensions(20, getAspect(uiSizes.rectangleButton)).height,
                    position: { left: (dimensions.width - calculateImageDimensions(95, 345 / 511).width) / 2, top: (dimensions.height - calculateImageDimensions(34, 345 / 511).height) / 2 },
                    margin: { right: "1%" },
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
                uiText={{ value: "Download", color: Color4.Black(), fontSize: sizeFont(25, 15) }}
            />
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateImageDimensions(3, getAspect(uiSizes.backButton)).width,
                    height: calculateImageDimensions(3, getAspect(uiSizes.backButton)).height,
                    position: { left: (dimensions.width - calculateImageDimensions(80, 345 / 511).width) / 2, top: (dimensions.height - calculateImageDimensions(40, 345 / 511).height) / 2 },
                    margin: { right: "1%" },
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
             <UiEntity
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '10%',
                        height: '20%',
                        margin: {top: "10%"},
                        position: { left: (dimensions.width - calculateImageDimensions(115, 345 / 511).width) / 2, top: (dimensions.height - calculateImageDimensions(38, 345 / 511).height) / 2 },
                    }}
                    uiText={{ value:  `${selectedItem?.n}`, fontSize: sizeFont(20, 20)}}
                />

            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '10%',
                    height: '20%',
                    margin: {top: "10%"},
                    position: { left: (dimensions.width - calculateImageDimensions(115, 345 / 511).width) / 2, top: (dimensions.height - calculateImageDimensions(43, 345 / 511).height) / 2 },
                }}
                uiText={{ value: `${selectedItem?.cat}` }}
            />
                    <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '10%',
                    height: '20%',
                    margin: {top: "10%"},
                    position: { left: (dimensions.width - calculateImageDimensions(115, 345 / 511).width) / 2, top: (dimensions.height - calculateImageDimensions(48, 345 / 511).height) / 2 },
                }}
                uiText={{ value: `Artist:   ${selectedItem?.on}`, fontSize: sizeFont(15, 15) }}
            />

            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '10%',
                    height: '20%',
                    position: { left: (dimensions.width - calculateImageDimensions(115, 345 / 511).width) / 2, top: (dimensions.height - calculateImageDimensions(47.9, 345 / 511).height) / 2 },
                }}
                uiText={{ value: `SIZE:    ${selectedItem?.si}`,  fontSize: sizeFont(25, 15)}}
            />
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '10%',
                    height: '20%',
                    position: { left: (dimensions.width - calculateImageDimensions(93, 345 / 511).width) / 2, top: (dimensions.height - calculateImageDimensions(52.1, 345 / 511).height) / 2 },
                }}
                uiText={{ value: `POLY COUNT:   ${selectedItem?.pc}`,  fontSize: sizeFont(25, 15) }}
            />
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '10%',
                    alignContent: 'center',
                    height: '20%',
                    margin: {left: "10%", top: "5%"},
                    position: { left: (dimensions.width - calculateImageDimensions(105, 345 / 511).width) / 2, top: (dimensions.height - calculateImageDimensions(54, 345 / 511).height) / 2 },
                }}
                uiText={{ value: `DESCRIPTION:   ${selectedItem?.d}`,  fontSize: sizeFont(25, 15) }}
            />
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '10%',
                    height: '20%',
                    position: { left: (dimensions.width - calculateImageDimensions(115, 345 / 511).width) / 2, top: (dimensions.height - calculateImageDimensions(54, 345 / 511).height) / 2 },
                }}
                uiText={{ value: `TAGS:   ${selectedItem?.tag}`,  fontSize: sizeFont(25, 15) }}
            />
        </UiEntity>
    );
}