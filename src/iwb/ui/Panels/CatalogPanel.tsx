import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
import {Color4} from '@dcl/sdk/math'
import {styles} from '../../components/catalog'

import {calculateImageDimensions, calculateSquareImageDimensions, getImageAtlasMapping, sizeFont} from '../helpers'
import {log} from '../../helpers/functions'
import {selectCatalogItem} from '../../components/modes/build'
import {CatalogItemType, EDIT_MODES, SCENE_MODES} from '../../helpers/types'
import {uiSizes} from '../uiConfig'
import {localUserId, players} from '../../components/player/player'
import {displayCatalogInfoPanel, setSelectedInfoItem} from './CatalogInfoPanel'
import {items, original, refreshSortedItems, Sorted2D, Sorted3D, sortedAll, SortedAudio} from "../../components/catalog/items";

let catalogInitialized = false
export let showCatalogPanel = false

export let filtered: CatalogItemType[] = []

export let itemsToShow: CatalogItemType[] = []

export let styleFilter = "All"
export let typeFilter = "All"
let assetTypeSelectedIndex = 3
export let searchFilter = ""


export function displayCatalogPanel(show: boolean) {
    if (show) {
        if (!catalogInitialized) {
            filtered = sortedAll
            totalPages = Math.ceil(original.length / (columns * rows));
            refreshView()

            catalogInitialized = true
        }
    }

    showCatalogPanel = show
}

function refreshView() {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    itemsToShow = filtered.slice(startIndex, endIndex);
}

export let objName = ''

const columns = 3;
const rows = 3;

let currentPage = 0;
const itemsPerPage = 9;
let totalPages = 0

let settings: any[] = [
    {label: "Public", enabled: true},
    {label: "Private", enabled: false},
]

export let selectedSetting = 0

let alphabet = [
    "A", "B", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"
]

function updateSelectedSetting(){
    if(selectedSetting === 0){
        selectedSetting = 1
    }else{
        selectedSetting = 0
    }
    refreshSortedItems()
    filterCatalog()//
}

function findPageForLetter(letter: string): number | null {
    //let start = 0;
    let temp = [...filtered]
    //let end = temp.length - 1;

    for (let page = 1; page <= Math.ceil(temp.length / itemsPerPage); page++) {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, temp.length);

        const namesOnPage = temp.slice(startIndex, endIndex);

        // Check if any name on the page starts with the letter "B"
        if (namesOnPage.some(item => item.n.toLowerCase().startsWith(letter.toLowerCase()))) {
            return page;
        }
    }

    return null; // No names starting with "B" found in the list
}

function filterByStyle(index: number) {
    styleFilter = styles[index]
    filterCatalog()
}

function filterCatalog() {
    currentPage = 0

    let toFilter: CatalogItemType[]
    switch (typeFilter) {
        case '3D':
            toFilter = Sorted3D;
            break;
        case '2D':
            toFilter = Sorted2D;
            break
        case 'Audio':
            toFilter = SortedAudio;
            break;
        default:
            toFilter = sortedAll;
    }

    let filteredResult: CatalogItemType[]

    if (styleFilter === "All") {
        filteredResult = toFilter
    } else {
        let result = toFilter.filter(item =>
            (item.sty && item.sty.toLowerCase().includes(styleFilter.toLowerCase()))
        );
        filteredResult = [...result]
    }

    if (searchFilter !== "") {
        log('searching filter by', searchFilter)
        let result = filteredResult.filter(item =>
            item.n.toLowerCase().includes(searchFilter.toLowerCase()) ||
            (item.sty && item.sty.toLowerCase().includes(searchFilter.toLowerCase())) ||
            (item.cat && item.cat.toLowerCase().includes(searchFilter.toLowerCase())) ||
            (item.d && item.d.toLowerCase().includes(searchFilter.toLowerCase())) ||
            (item.on && item.on.toLowerCase().includes(searchFilter.toLowerCase()))
        );
        log('search filter result', result)
        filteredResult = [...result]
    }

    filtered = filteredResult
    totalPages = Math.ceil(filtered.length / (columns * rows));

    refreshView()
}

export function createCatalogPanel() {
    return (
        <UiEntity
            key={"catalogpanel-main"}
            uiTransform={{
                display: showCatalogPanel ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: calculateImageDimensions(25, 345 / 511).width,
                height: calculateImageDimensions(30, 345 / 511).height,
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

            {/* header container */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '90%',
                    height: '8%',
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
                    height: '5%',
                    margin: {bottom: '1%'}
                }}
                // uiBackground={{color:Color4.Blue()}}
            >

                {/* search bar */}
                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'center',
                        flexDirection: 'row',
                        width: "70%",
                        height: '100%'
                    }}
                >
                    <Input
                        onChange={(value) => {
                            searchFilter = value.trim()
                            log('search filter is', searchFilter)
                            filterCatalog()
                        }}
                        fontSize={sizeFont(20, 15)}
                        placeholder={'Search Assets'}
                        placeholderColor={Color4.White()}
                        uiTransform={{
                            width: '100%',
                            height: '120%',
                        }}
                        color={Color4.White()}
                    ></Input>

                </UiEntity>

                {/* search icon */}
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
                    }}
                />

                {/* public / private toggle container */}
                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignContent: 'center',
                        width: '25%',
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
                            uvs: getButtonState(settings[selectedSetting].label)
                        }}
                        onMouseDown={() => {
                            updateSelectedSetting()
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
                            margin: {left: "1%",},
                        }}
                        uiText={{value: settings[selectedSetting].label, color: Color4.White(), fontSize: sizeFont(20, 15)}}
                    />


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
                    height: '10%',
                    margin: {bottom: '1%', top:'2%'}
                }}
                // uiBackground={{color:Color4.Green()}}
            >

            {/* type dropdown container */}
                <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignContent: 'center',
                    width: '50%',
                    height: '100%',
                }}
                // uiBackground={{color:Color4.Blue()}}
            >

                {/* dropdown label */}
                <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignContent: 'center',
                    width: '100%',
                    height: '50%',
                }}
                uiText={{value:"Asset Type", fontSize:sizeFont(20,15), color:Color4.White()}}
                />


                {/* dropdown container */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignContent: 'center',
                    width: '100%',
                    height: '50%',
                }}
                // uiBackground={{color:Color4.Green()}}
            >

                <Dropdown
                    key={"type-dropdown"}
                    options={[`3D`, `2D`, `Audio`, `All`]}
                    selectedIndex={assetTypeSelectedIndex}
                    onChange={selectDimension}
                    uiTransform={{
                        width: '100%',
                        height: '100%',
                    }}
                    // uiBackground={{color:Color4.Purple()}}
                    color={Color4.White()}
                    fontSize={sizeFont(20, 15)}
                />
            </UiEntity>
            </UiEntity>

                        {/* style dropdown container */}
                        <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignContent: 'center',
                    width: '50%',
                    height: '100%',
                }}
                // uiBackground={{color:Color4.Blue()}}
            >

                {/* dropdown label */}
                <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignContent: 'center',
                    width: '100%',
                    height: '50%',
                }}
                uiText={{value:"Asset Styles", fontSize:sizeFont(20,15), color:Color4.White()}}
                />


                {/* dropdown container */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignContent: 'center',
                    width: '100%',
                    height: '50%',
                }}
                // uiBackground={{color:Color4.Green()}}
            >

                <Dropdown
                key={"style-dropdown"}
                options={[...styles]}
                onChange={filterByStyle}
                uiTransform={{
                    width: '100%',
                    height: '100%',
                }}
                // uiBackground={{color:Color4.Purple()}}
                color={Color4.White()}
                fontSize={sizeFont(20, 15)}
                />
            </UiEntity>
            </UiEntity>


            </UiEntity>

            


            {generateCatalogRows()}


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
                        width: '25%',
                        height: '100%',
                        margin: {right: '5%'}
                    }}
                    uiText={{value: "Page " + (currentPage + 1) + " / " + totalPages, fontSize: sizeFont(20, 15)}}
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
                            refreshView()
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
                        refreshView()
                    }}
                />

            </UiEntity>


            {/* alphabet search bar vertical */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignContent: "center",
                    alignItems: 'center',
                    width: '5%',
                    height: '70%',
                    positionType: 'absolute',
                    position: {left: '2.5%', top: '25%'}
                }}
                // uiBackground={{color:Color4.Blue()}}
            >

                {generateAlphabet()}

            </UiEntity>


        </UiEntity>
    )
}

function generateAlphabet() {
    let arr: any[] = []

    // let start = 0
    // let end = 3
    for (let i = 0; i < alphabet.length; i++) {
        arr.push(<AlphabetItem row={i} item={alphabet[i]}/>)
    }
    return arr
}

export function AlphabetItem(data: any) {
    return (
        <UiEntity
            key={"alphbaet-item-" + data.item}
            uiTransform={{
                //display: searchFilter && searchFilter !=='' ?'none':'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '90%',
                height: '21%',
                margin: {top: '1%'}
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value: "" + data.item.toUpperCase()}}
            onMouseDown={() => {
                log('finding page for letter ', data.item)
                let pageLetter = findPageForLetter(data.item)
                log('page letter found is', pageLetter)
                if (pageLetter !== null && pageLetter - 1 >= 0) {
                    currentPage = pageLetter - 1
                    refreshView()
                }
            }}
        />
    )
}

function generateCatalogRows() {
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
                height: '21%',
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
            key={"catalog-item-row" + item.id}
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
                    if (players.get(localUserId)?.mode === SCENE_MODES.BUILD_MODE) {
                        selectCatalogItem(item.id, EDIT_MODES.GRAB, false)
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
                uiText={{
                    value: item.n.length > 15 ? item.n.substring(0, 15) + "..." : item.n,
                    fontSize: sizeFont(20, 12)
                }}
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
}

function selectDimension(index: number) {
    switch (index) {
        case 0:
            typeFilter = '3D';
            totalPages = Math.ceil(Sorted3D.length / (columns * rows));
            break;
        case 1:
            typeFilter = '2D';
            totalPages = Math.ceil(Sorted2D.length / (columns * rows));
            break;
        case 2:
            typeFilter = 'Audio';
            totalPages = Math.ceil(SortedAudio.length / (columns * rows));
            break;
        case 3:
            typeFilter = 'All';
            totalPages = Math.ceil(sortedAll.length / (columns * rows));
            break;
    }

    currentPage = 0;

    filterCatalog()
}

function getButtonState(button: string) {
    if (settings.find((b: any) => b.label === button).enabled) {
        return getImageAtlasMapping(uiSizes.toggleOnTrans)
    } else {
        return getImageAtlasMapping(uiSizes.toggleOffTrans)
    }
}