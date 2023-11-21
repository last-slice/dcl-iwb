import ReactEcs, {Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps} from '@dcl/sdk/react-ecs'
import {Color4, Vector3} from '@dcl/sdk/math'
import {items} from '../../components/catalog'
import {
    addLineBreak,
    calculateImageDimensions,
    calculateSquareImageDimensions,
    getImageAtlasMapping,
    sizeFont
} from '../helpers'
import {log} from '../../helpers/functions'
import resources from '../../helpers/resources'
import {selectCatalogItem} from '../../components/modes/build'
import { CatalogItemType, EDIT_MODES, SCENE_MODES } from '../../helpers/types'
import { uiSizes } from '../uiConfig'
import { localUserId, players } from '../../components/player/player'

export let showCatalogPanel = false

export function displayCatalogPanel(value: boolean) {
    showCatalogPanel = value
}

export let itemSelect = false
export let customSelect = false
export let itemCode = 0
export let objName = ''

const columns = 2;
const rows = 3;

let currentPage = 0;
const itemsPerPage = 9;

export function createCatalogPanel() {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    let original = [...items.values()]
    // log('original is', original)
    
    const sorted = original.sort((a, b) => a.n.localeCompare(b.n));
    const itemsToShow = sorted.slice(startIndex, endIndex);

    // log('sorted is', itemsToShow)
    const totalPages = Math.ceil(itemsToShow.length / (columns * rows));

    return (
        <UiEntity
            key={"catalogpanel"}
            uiTransform={{
                display: showCatalogPanel ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: calculateImageDimensions(25, 345 / 511).width,
                height: calculateImageDimensions(25, 345 / 511).height,
                positionType: 'absolute',
                position: {right: '3%', bottom: '3%'}
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
                    flexDirection: 'column',
                    width: '90%',
                    height: '10%',
                }}
                uiText={{value: "Asset Catalog", fontSize: sizeFont(30, 20)}}
                // uiBackground={{color:Color4.Blue()}}
            />


            {/* placeholder for search bar */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignContent: 'center',
                    width: '90%',
                    height: '8%',
                }}
                // uiBackground={{color:Color4.Blue()}}
            >

                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'center',
                        flexDirection: 'row',
                        width: "60%",
                        height:'80%'
                    }}
                    uiBackground={{color:Color4.Gray()}}
                />

                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'center',
                        flexDirection: 'row',
                        width: calculateSquareImageDimensions(4).width,
                        height: calculateSquareImageDimensions(4).height,
                        margin: {right: '2%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.opaqueSearchIcon)
                    }}
                    uiText={{value: "<", fontSize: sizeFont(20, 12)}}
                    onMouseUp={() => {
                        if (currentPage - 1 >= 0) {
                            currentPage--
                        }
                    }}
                />

            </UiEntity>

            {generateCatalogRows(itemsToShow)}


            {/* paginate container */}
            <UiEntity
                uiTransform={{
                    display: totalPages > 1 ? 'flex' : 'none',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignContent: 'center',
                    alignItems: 'center',
                    width: '90%',
                    height: '8%',
                }}
                // uiBackground={{color:Color4.Blue()}}
            >

                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '10%',
                        height: '100%',
                        margin:{right:'5%'}
                    }}
                    uiText={{value: "Page " + (currentPage + 1) + " / " + totalPages}}
                />

                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'center',
                        flexDirection: 'row',
                        width: calculateSquareImageDimensions(4).width,
                        height: calculateSquareImageDimensions(4).height,
                        margin: {right: '2%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.opaqueArrowleft)
                    }}
                    uiText={{value: "<", fontSize: sizeFont(20, 12)}}
                    onMouseUp={() => {
                        if (currentPage - 1 >= 0) {
                            currentPage--
                        }
                    }}
                />

                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'center',
                        flexDirection: 'row',
                        width: calculateSquareImageDimensions(4).width,
                        height: calculateSquareImageDimensions(4).height,
                        margin: {left: '2%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.opaqueArrowRight)
                    }}
                    uiText={{value: ">", fontSize: sizeFont(20, 12)}}
                    onMouseUp={() => {
                        if ((currentPage + 1) * itemsPerPage + itemsPerPage <= items.size)
                            currentPage++
                    }}
                />

            </UiEntity>


        </UiEntity>
    )
}

function generateCatalogRows(itemsToShow: CatalogItemType[]) {
    let arr: any[] = []

    let start = 0
    let end = 3
    for (let i = 0; i < Math.ceil(itemsToShow.length / 3); i++) {
        arr.push(<CatalogRow row={start} items={itemsToShow.slice(start, end)}/>)
        start += 3
        end += 3
    }
    return arr
}

function generateRowItems(row: number, items: CatalogItemType[]) {
    return items.map((item, index) => {
        return <CatalogItem row={row + "-" + index} item={item}/>
    })
}

export const CatalogRow = ({row, items}: { row: number, items: CatalogItemType[] }) => {
    // log('row is', data)
    return (
        <UiEntity
            key={"catalog-row" + row}
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '90%',
                height: '23%',
                margin: {top: '1%'}
            }}
            // uiBackground={{color:Color4.Green()}}
        >

            {generateRowItems(row, items)}

        </UiEntity>
    )
}

function CatalogItem({row, item}: { row: string, item: CatalogItemType }) {
    return (
        <UiEntity
            key={"catalog-item-row" + row}
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '33%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Teal()}}//
        >

            {/* item image */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateSquareImageDimensions(8).width,
                    height: calculateSquareImageDimensions(8).height,
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: item.im
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
                onMouseDown={() => {
                    if(players.get(localUserId)?.mode === SCENE_MODES.BUILD_MODE){
                        selectCatalogItem(item.id, EDIT_MODES.GRAB)
                    }  
                }}
            />

            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '90%',
                    height: '20%',
                }}
                uiText={{value: addLineBreak(item.n, undefined, 15), fontSize: sizeFont(20, 12)}}
                // uiBackground={{color:Color4.Blue()}}
            />


            <UiEntity
                uiTransform={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignContent: 'center',
                    flexDirection: 'row',
                    width: '90%',
                    height: '15%',
                    margin: {top: '2%'}
                }}
                // uiBackground={{color:Color4.Green()}}
            >

                {/* <UiEntity
                    uiTransform={{
                        display: localUserId && players.get(localUserId)!.canBuild ? 'flex' : 'none',
                        justifyContent: 'center',
                        alignContent: 'center',
                        flexDirection: 'row',
                        width: '50%',
                        height: '100%',
                        margin: {right: '1%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.blueButton)
                    }}
                    uiText={{value: "Use", fontSize: sizeFont(20, 12)}}
                    onMouseDown={() => {
                        selectCatalogItem(item.id)
                        useSelectedItem()
                    }}
                /> */}

                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'center',
                        flexDirection: 'row',
                        width: calculateSquareImageDimensions(4).width,
                        height: calculateSquareImageDimensions(4).height,
                        margin: {left: '1%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas1.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.infoButtonOpaque)
                    }}

                    // uiText={{value: "Info", fontSize: sizeFont(20, 12)}}
                />


            </UiEntity>


        </UiEntity>
    )
}
