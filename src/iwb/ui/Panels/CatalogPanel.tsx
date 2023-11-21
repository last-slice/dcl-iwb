import ReactEcs, {Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Dropdown, Input} from '@dcl/sdk/react-ecs'
import {Color4, Vector3} from '@dcl/sdk/math'
import {items} from '../../components/catalog'

import {
    addLineBreak,
    calculateImageDimensions,
    calculateSquareImageDimensions,
    dimensions,
    getImageAtlasMapping,
    sizeFont
} from '../helpers'
import { log } from '../../helpers/functions'
import resources from '../../helpers/resources'
import {selectCatalogItem} from '../../components/modes/build'
import { CatalogItemType, EDIT_MODES, SCENE_MODES } from '../../helpers/types'
import { uiSizes } from '../uiConfig'
import { localUserId, players } from '../../components/player/player'
import { displayCatalogInfoPanel, setSelectedInfoItem } from './CatalogInfoPanel'

export let showCatalogPanel = false

export function displayCatalogPanel(value: boolean) {
    showCatalogPanel = value
}

export let objName = ''

let currentFilterType = 'All';

const columns = 2;
const rows = 3;

let currentPage = 0;
const itemsPerPage = 9;

let settings:any[] = [
    {label:"Public", enabled:true},
]

export function createCatalogPanel() {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    let original = [...items.values()]
    // log('original is', original)
    
    const sorted = original.sort((a, b) => a.n.localeCompare(b.n));
    const itemsToShow = sorted.slice(startIndex, endIndex);

    // log('sorted is', itemsToShow)
    const totalPages = Math.ceil(original.length / (columns * rows));
    const itemsArray = Array.from(items.values());

    const filteredItems = itemsArray.filter(item => 
        currentFilterType === 'All' || item.ty === currentFilterType
    );

    return (
        <UiEntity
            key={"catalogpanel"}
            uiTransform={{
                display: showCatalogPanel ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: calculateImageDimensions(25, 345 / 511).width,
                height: calculateImageDimensions(30, 345 / 511).height,
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
                    flexDirection: 'column',
                    width: '90%',
                    height: '8%',
                }}
                uiText={{ value: "Asset Catalog", fontSize: sizeFont(30, 20) }}
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
                    height: '5%',
                    margin:{bottom:'1%'}
                }}
            // uiBackground={{color:Color4.Blue()}}
            >

                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'center',
                        flexDirection: 'row',
                        width: "70%",
                        height:'100%'
                    }}
                    // uiBackground={{color:Color4.Gray()}}
                    // uiBackground={{
                    //     textureMode: 'stretch',
                    //     texture: {
                    //         src: 'assets/atlas2.png'
                    //     },
                    //     uvs: getImageAtlasMapping(uiSizes.opaqueSearchBG)
                    // }}
                >
                    <Input
                        onSubmit={(value) => {
                            console.log('submitted value: ' + value)
                        }}
                        fontSize={15}
                        placeholder={'Search Assets'}
                        placeholderColor={Color4.White()}
                        uiTransform={{
                            width: '100%',
                            height: '120%',
                        }}
                        ></Input>

                </UiEntity>

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
                    onMouseUp={() => {
                        if (currentPage - 1 >= 0) {
                            currentPage--
                        }
                    }}
                />
                <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignContent: 'center',
                    width: '18%',
                    height: '100%',
                }}
                    // uiBackground={{color:Color4.Teal()}}
                    >
                </UiEntity>


            </UiEntity>

                    {/* dropdown containers */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignContent: 'center',
                    width: '90%',
                    height: '5%',
                    margin:{bottom:'1%'}
                }}
            // uiBackground={{color:Color4.Green()}}
            >
            <Dropdown
                    options={[`3D`, `2D`, `All`]}
                    onChange={selectDimension}
                    uiTransform={{
                        width: '70%',
                        height: '120%',
                    }}
                    // uiBackground={{color:Color4.Purple()}}
                    color={Color4.White()}
                    fontSize={sizeFont(20,15)}
                />


                    {/* public / private toggle container */}
                <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignContent: 'center',
                    width: '30%',
                    height: '100%',
                }}
                    // uiBackground={{color:Color4.Teal()}}
                    >

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateSquareImageDimensions(4).width,
            height: calculateSquareImageDimensions(4).height,
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getButtonState(settings[0].label)
        }}
        onMouseDown={() => {
            // settings.find((set:any)=>set.label === setting.label).enabled = !settings.find((set:any)=>set.label === setting.label).enabled 
        }}
        />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80%',
            height: '100%',
            margin:{left:"1%",},
        }}
        uiText={{value: settings[0].label, color:Color4.White(), fontSize:sizeFont(20,15)}}
        />


                </UiEntity>

                </UiEntity>


 {/* style dropdown containers */}
                <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignContent: 'center',
                    width: '90%',
                    height: '5%',
                    margin:{bottom:'1%'}
                }}
            // uiBackground={{color:Color4.Green()}}
            >
                <Dropdown
                    options={[`Public`, `Private`, `All`]}
                    onChange={selectDimension}
                    uiTransform={{
                        width: '100%',
                        height: '120%',
                    }}
                    // uiBackground={{color:Color4.Purple()}}
                    color={Color4.White()}
                    fontSize={sizeFont(20,15)}
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
                    uiText={{value: "Page " + (currentPage + 1) + " / " + totalPages, fontSize:sizeFont(20,15)}}
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
                    uiText={{ value: "<", fontSize: sizeFont(20, 12) }}
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
        arr.push(<CatalogRow row={start} items={itemsToShow.slice(start, end)} />)
        start += 3
        end += 3
    }
    return arr
}

function generateRowItems(row: number, items: CatalogItemType[]) {
    return items.map((item, index) => {
        return <CatalogItem row={row + "-" + index} item={item} />
    })
}

export const CatalogRow = ({ row, items }: { row: number, items: CatalogItemType[] }) => {
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
                height: '21%',
                margin: { top: '1%' }
            }}
        // uiBackground={{color:Color4.Green()}}
        >

            {generateRowItems(row, items)}

        </UiEntity>
    )
}

function CatalogItem({ row, item }: { row: string, item: CatalogItemType }) {
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
                    width: calculateSquareImageDimensions(7).width,
                    height: calculateSquareImageDimensions(7).height,
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
                uiText={{ value: item.n.length > 15 ? item.n.substring(0,15) + "..." : item.n, fontSize: sizeFont(20, 12) }}
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
                    margin: { top: '2%' }
                }}
            // uiBackground={{color:Color4.Green()}}
            >

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
                    onMouseDown={() => {
                        setSelectedInfoItem(item)
                        displayCatalogInfoPanel(true)
                        displayCatalogPanel(false)
                        
                    }}
                />


            </UiEntity>


        </UiEntity>
    )
}//

function selectDimension(index: number) {
    switch (index) {
        case 0:
            currentFilterType = '3D';
            break;
        case 1:
            currentFilterType = '2D';
            break;
        case 2:
            currentFilterType = 'All';
            break;
    }
}


function getButtonState(button:string){
    if(settings.find((b:any)=> b.label === button).enabled){
        return getImageAtlasMapping(uiSizes.toggleOnTrans)
    }else{
        return getImageAtlasMapping(uiSizes.toggleOffTrans)
    }
}