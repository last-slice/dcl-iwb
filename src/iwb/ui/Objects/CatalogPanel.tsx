import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'
import { CatalogItemType, EDIT_MODES, NOTIFICATION_TYPES, SCENE_MODES, SERVER_MESSAGE_TYPES } from '../../helpers/types'
import { sortedAll, original, Sorted2D, Sorted3D, SortedAudio, SortedSmartItems, refreshSortedItems, styles, items, deleteRealmAsset } from '../../components/Catalog'
import { log } from '../../helpers/functions'
import resources from '../../helpers/resources'
import { Color4 } from '@dcl/sdk/math'
import { playerMode } from '../../components/Config'
import { displayCatalogInfoPanel, setSelectedInfoItem } from './CatalogInfoPanel'
import { selectCatalogItem } from '../../modes/Build'
import { setUIClicked } from '../ui'
import { displayStoreView } from './StoreView'
import { sendServerMessage } from '../../components/Colyseus'
import { showNotification } from './NotificationPanel'
import { displayPendingPanel } from './PendingInfoPanel'

let alphabet = [
    "A", "B", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"
]

let catalogInitialized = false
let columns = 3;
let rows = 3;
export let currentPage = 0;
export let itemsPerPage = 9;
export let totalPages = 0

export let showCatalogPanel = false
export let filtered: CatalogItemType[] = []
export let itemsToShow: CatalogItemType[] = []

export let styleFilter = "All"
export let searchFilter = ""

export let selectedSetting = 0

export function updateCatalogSizing(row:number, column:number, perPage:number){
    rows = row
    columns = column
    itemsPerPage = perPage
}

export function updateSearchFilter(filter:string){//
    searchFilter = filter
}

export function updateCurrentPage(value:number, force?:boolean){
    currentPage += value
    force ? currentPage = value : null
    console.log('current page is', currentPage, value)
}

export function displayCatalogPanel(show: boolean) {
    if (show) {
        itemsToShow.length = 0
        updateCatalogSizing(4,2,8)


        refreshSortedItems()

        // if (!catalogInitialized) {
            initCatalog(sortedAll)
            catalogInitialized = true
        // }
    }

    showCatalogPanel = show
}

export function initCatalog(items:CatalogItemType[]){
    filtered = items
    totalPages = Math.ceil(items.length / (columns * rows));
    refreshView()
}

export function refreshView() {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    itemsToShow = filtered.slice(startIndex, endIndex);
}

function selectSetting(index:number){
    if(selectedSetting !== index){
        selectedSetting = index
    }
    // if(selectedSetting === 0){
    //     selectedSetting = 1
    // }else{
    //     selectedSetting = 0
    // }
    refreshSortedItems()
    filterCatalog()
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

export function filterByStyle(index: number) {
    styleFilter = styles[index]
    filterCatalog()
}

export function filterCatalog() {
    currentPage = 0

    let filteredResult: CatalogItemType[] = []

    if(styleFilter === "Audio"){
        let result = sortedAll.filter(item => item.tag.includes("Audio"))
        filteredResult = [...result]
    }else if(styleFilter === "All"){
        filteredResult = [...sortedAll]
    }else{
        let result = sortedAll.filter(item =>
            (item.sty && item.sty.toLowerCase().includes(styleFilter.toLowerCase()))
        );
        filteredResult = [...result]
    }

    // if (searchFilter !== "") {//
        let result = filteredResult.filter(item =>
            item.n.toLowerCase().includes(searchFilter.toLowerCase()) ||
            (item.sty && item.sty.toLowerCase().includes(searchFilter.toLowerCase())) ||
            (item.cat && item.cat.toLowerCase().includes(searchFilter.toLowerCase())) ||
            (item.d && item.d.toLowerCase().includes(searchFilter.toLowerCase())) ||
            (item.on && item.on.toLowerCase().includes(searchFilter.toLowerCase())) ||
            (item.tag && item.tag.includes(searchFilter.toLowerCase()))
        );
        filteredResult = [...result]
    // }

    filtered = filteredResult
    totalPages = Math.ceil(filtered.length / (columns * rows));

    refreshView()
}

export function generateAlphabet() {
    let arr: any[] = []
    for (let i = 0; i < alphabet.length; i++) {
        arr.push(<AlphabetItem row={i} item={alphabet[i]}/>)
    }
    return arr
}

function AlphabetItem(data: any) {
    return (
        <UiEntity
            key={resources.slug + "-alphbaet-item-" + data.item}
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
                setUIClicked(true)
                let pageLetter = findPageForLetter(data.item)
                log('page letter found is', pageLetter)
                if (pageLetter !== null && pageLetter - 1 >= 0) {
                    currentPage = pageLetter - 1
                    refreshView()
                }
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
        />
    )
}

function generateCatalogRows() {
    if(itemsToShow.length > 0){
        let arr: any[] = []

        let start = 0
        let end = 2
        for (let i = 0; i < Math.ceil(itemsToShow.length / 2); i++) {
            arr.push(<CatalogRow row={start} items={itemsToShow.slice(start, end)}/>)
            start += 2
            end += 2
        }
        return arr
    }else{
        return(
            <UiEntity
            key={"catalog-empty-container"}
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '60%',
            }}
            >
                <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                }}
                uiText={{value:"Choose assets from the Catalog!", fontSize:sizeFont(25,20)}}
                />

                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(5.5, getAspect(uiSizes.buttonPillBlack)).width,
                        height: calculateImageDimensions(5.5, getAspect(uiSizes.buttonPillBlack)).height,
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                    }}
                    onMouseDown={() => {
                        setUIClicked(true)
                        displayCatalogPanel(false)
                        displayStoreView(true)
                    }}
                    onMouseUp={()=>{
                        setUIClicked(false)
                    }}
                    uiText={{value:"View", fontSize:sizeFont(25,20)}}
                />

            </UiEntity>
        )
    }
}

function generateRowItems(row: number, items: CatalogItemType[]) {
    return items.map((item, index) => {
        return <CatalogItem row={row + "-" + index} item={item}/>
    })
}

const CatalogRow = ({row, items}: { row: number, items: CatalogItemType[] }) => {
    return (
        <UiEntity
            key={"catalog-row" + row}
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                alignContent:'center',
                justifyContent: 'center',
                width: '85%',
                height: '15%',
                margin: {top: '1%', bottom:'1%'}
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
                width: '50%',
                height: '100%',
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.horizRectangle)
            }}
        >

            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '80%',
                }}
                >

                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '70%',
                    height: '100%',
                }}
                >
                                {/* item image */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    justifyContent: 'flex-start',
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
                    // setUIClicked(true)//
                    if (playerMode && playerMode === SCENE_MODES.BUILD_MODE) {
                        selectCatalogItem(item.id, EDIT_MODES.GRAB, false)
                    }
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
            >

                <UiEntity
                    uiTransform={{
                        display: item.anim ? 'flex' : 'none',
                        justifyContent: 'flex-start',
                        width: calculateSquareImageDimensions(2).width,
                        height: calculateSquareImageDimensions(2).height,
                        positionType:'absolute',
                        position:{right:0, bottom:0}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png',
                        },
                        uvs: getImageAtlasMapping(uiSizes.rotateLeftArrow2Trans)
                    }}
                />

            </UiEntity>
                </UiEntity>

                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '30%',
                    height: '100%',
                }}
                >
                     {/* <UiEntity
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
                        uvs: getImageAtlasMapping(uiSizes.gridButtonTrans)
                    }}
                    onMouseDown={() => {
                        if (players.get(localUserId)?.mode === SCENE_MODES.BUILD_MODE) {
                            selectCatalogItem(item.id, EDIT_MODES.GRAB, false)
                        }
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
                    onMouseDown={() => {
                        setUIClicked(true)
                        setSelectedInfoItem(item)
                        displayCatalogPanel(false)
                    }}
                    onMouseUp={()=>{
                        setUIClicked(false)
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
                            margin: {left: '1%'}
                        }}
                        uiBackground={{
                            textureMode: 'stretch',
                            texture: {
                                src: 'assets/atlas1.png'
                            },
                            uvs: getImageAtlasMapping(uiSizes.trashButtonTrans)
                        }}
                        onMouseDown={() => {
                            setUIClicked(true)
                            deleteRealmAsset(item)
                            sendServerMessage(SERVER_MESSAGE_TYPES.DELETE_WORLD_ASSETS, [item.id])
                            showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Item removed! Initiate a deployment to remove them from your world.", animate:{enabled:true, return:true, time:7}})
                            displayPendingPanel(true, "assetsready")//
                        }}
                        onMouseUp={()=>{
                            setUIClicked(false)
                        }}
                    />

                </UiEntity>

            </UiEntity>

            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '15%',
                    margin:{bottom:'3%', left:"5%"}
                }}
                uiText={{
                    value: item.n.length > 20 ? item.n.substring(0, 20) + "..." : item.n,
                    fontSize: sizeFont(20, 15),
                    textAlign:'middle-left'
                }}
                // uiBackground={{color:Color4.Blue()}}
            />

        </UiEntity>
    )
}

export function createCatalogPanel(){
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
                uvs: getImageAtlasMapping(uiSizes.vertRectangleOpaque)
            }}
            onMouseDown={()=>{
                setUIClicked(true)
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
        >

            {/* header container */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '90%',
                    height: '8%',
                    margin:{top:"2%"}
                }}
                uiText={{value: "Asset Catalog", fontSize: sizeFont(30, 20)}}
                // uiBackground={{color:Color4.Blue()}}
            />

            {/* search bar */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignContent: 'center',
                    width: '85%',
                    height: '5%',
                    margin: {bottom: '1%', top:'1%'}
                }}
                >

            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignContent: 'center',
                    width: '50%',
                    height: '100%',
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
                            height: '100%',
                        }}
                        color={Color4.White()}
                />
                </UiEntity>
                <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignContent: 'center',
                    width: '50%',
                    height: '100%',
                }}
                >

                {/* dropdown container */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignContent: 'center',
                    width: '100%',
                    height: '100%',
                }}
                // uiBackground={{color:Color4.Green()}}
            >

                <Dropdown
                    options={['Public', 'Private']}
                    selectedIndex={selectedSetting}
                    onChange={selectSetting}
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

            {/* dropdown containers */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignContent: 'center',
                    width: '85%',
                    height: '10%',
                }}
                // uiBackground={{color:Color4.Green()}}
            >

              {/* style dropdown container */}
              <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignContent: 'center',
                    width: '100%',
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
                uiText={{value:"Asset Styles", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
                />

                
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
                    width: '85%',
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
                    position: {left: '3%', top: '24%'}
                }}
                // uiBackground={{color:Color4.Blue()}}
            >

                {generateAlphabet()}

            </UiEntity>
            
            
            </UiEntity>
    )
}