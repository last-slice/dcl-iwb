import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Dropdown, Input } from '@dcl/sdk/react-ecs'
import resources from '../../helpers/resources'
import { calculateImageDimensions, getAspect, dimensions, getImageAtlasMapping, sizeFont, calculateSquareImageDimensions } from '../helpers'
import { uiSizes } from '../uiConfig'
import { generateButtons, setUIClicked } from '../ui'
import { sendServerMessage } from '../../components/Colyseus'
import { CatalogItemType, NOTIFICATION_TYPES, SERVER_MESSAGE_TYPES, SOUND_TYPES } from '../../helpers/types'
import { HoriztonalButtons } from '../Reuse/HoriztonalButtons'
import { Color4 } from '@dcl/sdk/math'
import { marketplaceItems, marketplaceOriginal, refreshMarketplaceItems, sortedAll, SortedNewest, styles } from '../../components/Catalog'
import { playSound } from '@dcl-sdk/utils'
import { currentPage, filterByStyle, filterCatalog, filtered, initCatalog, itemsPerPage, itemsToShow, refreshView, totalPages, updateCatalogSizing, updateCurrentPage, updateSearchFilter } from './CatalogPanel'
import { showNotification } from './NotificationPanel'
import { displayPendingPanel } from './PendingInfoPanel'
import { localPlayer } from '../../components/Player'
import { updateMainView } from './IWBView'

export let showStore = false
export let storeView = "main"
export let selectedItem:any

let selectedItems:any[] = []//

export let showCatalogPanel = false

let buttons:any[] = [
    {label:"Save", pressed:false, func:()=>{
        displayStoreView(false)
        saveNewAssets()
        },
        position:{bottom:'13%'},
        positionType:'absolute',
        displayCondition:()=>{
            if(localPlayer && localPlayer.homeWorld){
                return true
            }else{
                return false
            }
        }
    },
    {label:"Close", pressed:false, func:()=>{
        displayStoreView(false)
        },
        position:{bottom:0},
        positionType:'absolute'
    },
]

let filterButtons:any[] = [
    {
        label:"Select All", 
        width:6,
        height:5,
        fontBigScreen:20,
        fontSmallScreen:15,
        pressed:false, func:()=>{
            selectAllFilteredAssets()
        }
    },
    {
        label:"Remove All", 
        width:6,
        height:5,
        fontBigScreen:20,
        fontSmallScreen:15,
        pressed:false, func:()=>{
            removeAllSelectedAssets()
        }
    },
]

let horiztonalButtons:any[] = [
    {label:"Catalog", pressed:true, func:()=>{
        playSound(SOUND_TYPES.SELECT_3)
        showItems(SortedNewest)
        },
        height:4,
        width:6,
        fontBigScreen:30,
        fontSmallScreen:15
    },
    {label:"Your Catalog", pressed:false, func:()=>{
        playSound(SOUND_TYPES.SELECT_3)
        },
        height:4,
        width:6,
        fontBigScreen:30,
        fontSmallScreen:15
    },
]

function selectAllFilteredAssets(){
    selectedItems.length = 0
    selectedItems = [...filtered]
}

function removeAllSelectedAssets(){
    selectedItems.length = 0
    showItems(marketplaceOriginal)
}

function showItems(items:any){
    itemsToShow.length = 0
    updateCurrentPage(0, true)
    initCatalog(items)
}

function saveNewAssets(){
    if(selectedItems.length > 0){
        sendServerMessage(SERVER_MESSAGE_TYPES.ADD_WORLD_ASSETS, selectedItems.map(($:any)=> $.id))
        showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Items added! Initiate a deployment to include them in your world.", animate:{enabled:true, return:true, time:7}})
        displayPendingPanel(true, "assetsready")
    }
}

export function displayStoreView(value:boolean){
    showStore = value

    if(showStore){
        storeView = "loading"
        
        updateSearchFilter("")
        sendServerMessage(SERVER_MESSAGE_TYPES.GET_MARKETPLACE,{})
    }
}

export function updateStoreVisibleItems(){
    refreshMarketplaceItems()

    itemsToShow.length = 0
    selectedItems.length = 0

    updateCurrentPage(0)
    updateCatalogSizing(3,3,9)
    initCatalog(SortedNewest)
}

export function updateStoreView(view:string){
    storeView = view
}

export function createStoreview() {
    return (
        <UiEntity
        key={"" + resources.slug + "main-store-ui"}
            uiTransform={{
                display: showStore? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(45, getAspect(uiSizes.horizRectangle)).width,
                height: calculateImageDimensions(45, getAspect(uiSizes.horizRectangle)).height,
                positionType: 'absolute',
                position: { left: (dimensions.width - calculateImageDimensions(45, getAspect(uiSizes.horizRectangle)).width) / 2, bottom: '15%'}
            }}
        // uiBackground={{ color: Color4.Red() }}
        >

            {/* main bg container */}
            <UiEntity
                uiTransform={{
                    display:'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    justifyContent:'center'
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.horizRectangle)
                }}
                onMouseDown={()=>{
                    setUIClicked(true)
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
            >


                {/* main item container */}
                <UiEntity
                uiTransform={{
                    display: storeView === "item" ? 'flex' : 'none',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent:'center',
                    width: '97%',
                    height: '93%',
                    margin:{left:"1%"},
                    padding:{left:"1%", right:'2%', bottom:'2%'},
                }}
                >
                    <ItemView/>
                </UiEntity>

                {/* main content container */}
                <UiEntity
                uiTransform={{
                    display: storeView !== "item" ? 'flex' : 'none',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent:'center',
                    width: '97%',
                    height: '93%',
                    margin:{left:"1%"},
                    padding:{left:"1%", right:'2%', bottom:'2%'}
                }}
                >
                    <MainLeftView />
                    <MainRightView />

                </UiEntity>

            </UiEntity>


        </UiEntity>
    )
}

function MainLeftView(){
   return(
   <UiEntity
    key={resources.slug + "-store-view-left-container"}
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '25%',
        height: '100%',
    }}
    // uiBackground={{color:Color4.Red()}}
    >

    <LeftDataView/>

    </UiEntity>
   )
}

function MainRightView(){
    return(
        <UiEntity
        key={resources.slug + "-store-view-right-container"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '75%',
            height: '100%',
            margin:{left:'2%'}
        }}
        // uiBackground={{color:Color4.Blue()}}
        >

            <DataView/>
            <LoadingView/>
        </UiEntity>
  
    )
}

function LoadingView(){
    return(
        <UiEntity
        key={resources.slug + "-store-view-right-loading"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            margin:{left:'2%'},
            display:showStore && storeView === "loading" ? "flex" : "none"
        }}
        // uiBackground={{color:Color4.Blue()}}
        >

    <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '75%',
            height: '10%',
        }}
        uiText={{value:"LOADING...", fontSize:sizeFont(25,20)}}
        />

        </UiEntity>
  
    )
}

function LeftDataView(){
    return(
        <UiEntity
        key={resources.slug + "-store-view-left-data"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display:showStore && storeView === "main" ? "flex" : "none"
        }}
        // uiBackground={{color:Color4.Blue()}}
        >

        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignContent: 'center',
                width: '100%',
                height: '8%',
            }}
            >
            <Input
                    onChange={(value) => {
                        updateSearchFilter(value.trim())
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
                width: '100%',
                height: '10%',
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
                height: '8%',
            }}
            // uiBackground={{color:Color4.Green()}}
        >

            <Dropdown
            options={[...styles]}
            onChange={filterByStyle}
            selectedIndex={0}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Purple()}}
            color={Color4.White()}
            fontSize={sizeFont(20, 15)}
            />
        </UiEntity>

        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'center',
                width: '100%',
                height: '8%',
            }}
            // uiBackground={{color:Color4.Green()}}
        >
     {showStore  && localPlayer && localPlayer.homeWorld &&  <HoriztonalButtons height={'100%'} buttons={filterButtons} slug={"store-left-filter-buttons"} />}

        </UiEntity>



            {showStore && generateButtons({slug:"store-left-view", buttons:buttons})}


        </UiEntity>
    )
}

function DataView(){
    return(
        <UiEntity
        key={resources.slug + "-store-view-right-data"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            display:showStore && storeView === "main" ? "flex" : "none"
        }}
        // uiBackground={{color:Color4.Blue()}}
        >

        <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '7%',
            margin:{bottom:'2%'}
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
                    <HoriztonalButtons buttons={horiztonalButtons} slug={"main-store-view"} />
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

        <UiEntity
            uiTransform={{
                display: localPlayer && localPlayer.homeWorld ? "flex" : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlack)).width,
                height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
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
                showItems(selectedItems)
            }}
            onMouseUp={() => {
                setUIClicked(false)
            }}
            uiText={{value:"Selected " + selectedItems.length, color: Color4.White(), fontSize: sizeFont(30, 15)}}
        />

            {/* <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
        }}
        uiText={{value:"Selected Assests " + selectedItems.length, fontSize:sizeFont(20,15)}}
        /> */}
            </UiEntity>

            </UiEntity>



        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '90%',
        }}
        >
            {showStore && storeView === "main" && generateRows()}
            
        </UiEntity>

        <UiEntity
                uiTransform={{
                    display: showStore && storeView === "main"  ? 'flex' : 'none',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignContent: 'center',
                    alignItems: 'center',
                    width: '95%',
                    height: '10%',
                }}
                // uiBackground={{color:Color4.Blue()}}
            >

     {/* alphabet search bar vertical */}
            {/* <UiEntity
            uiTransform={{
                display: showStore && storeView === "main" ? 'flex' : 'none',
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: "center",
                alignItems: 'center',
                width: '100%',
                height: '5%',
            }}
            // uiBackground={{color:Color4.Blue()}}
        >

            {showStore && storeView === "main" && generateAlphabet()}

        </UiEntity> */}

        <UiEntity
            uiTransform={{
                display: totalPages > 1 ? 'flex' : 'none',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '95%',
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
                    onMouseDown={() => {
                        setUIClicked(true)
                        if (currentPage - 1 >= 0) {
                            updateCurrentPage(-1)
                            refreshView()
                        }
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
                    onMouseDown={() => {
                        setUIClicked(true)
                        if ((currentPage + 1) * itemsPerPage + itemsPerPage <= marketplaceItems.size){
                            updateCurrentPage(1) 
                        }
                        refreshView()
                    }}
                    onMouseUp={()=>{
                        setUIClicked(false)
                    }}
                />

            </UiEntity>

            </UiEntity>

        </UiEntity>
  
    )
}

function generateRows(){
    let arr: any[] = []
    let start = 0
    let end = 3

    for (let i = 0; i < Math.ceil(itemsToShow.length / 3); i++) {
        arr.push(<MarketplaceRow row={start} items={itemsToShow.slice(start, end)}/>)
        start += 3
        end += 3
    }
    return arr
}

function generateMarketPlaceItems(row: number, items: CatalogItemType[]){
    // let arr:any[] = []
    // for(let i = 0; i < 3; i++){
    //     if(visibleItems[(index * 3) + i]){
    //         arr.push(<MarketplaceItem item={visibleItems[i]}/>)
    //     }
    // }
    // // return arr

    return items.map((item, index) => {
        return <MarketplaceItem row={row + "-" + index} item={item}/>
    })
}

function MarketplaceRow({row, items}: { row: number, items: CatalogItemType[] }){
    return(
        <UiEntity
        key={resources.slug + "store::row::" + row}
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '33%',
            margin:'1%'
        }}
        >
            {generateMarketPlaceItems(row, items)}
        </UiEntity>
    )
}

function MarketplaceItem({row, item}: { row: string, item: CatalogItemType }){
    // let item = data.item
    return(
        <UiEntity
        key={resources.slug + "store::item::" + item.n}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '33%',
            height: '100%',
            margin:'1%'
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: isSelected(item.id) ? getImageAtlasMapping(uiSizes.buttonPillBlue) : getImageAtlasMapping(uiSizes.horizRectangle)
        }}
        onMouseDown={()=>{
            setUIClicked(true)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
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
        // uiBackground={{color:Color4.Blue()}}
        >
         <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateSquareImageDimensions(11).width,
            height: calculateSquareImageDimensions(11).height,
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: '' + item.im
            },
        }}
        />
        </UiEntity>

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30%',
            height: '100%',
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
                        margin: {top: '1%'}
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
                        selectedItem = item
                        updateStoreView("item")
                    }}
                    onMouseUp={()=>{
                        setUIClicked(false)
                    }}
                />

                <UiEntity
                    uiTransform={{
                        display: localPlayer && (localPlayer.homeWorld || localPlayer.worldPermissions) ? 'flex' : "none",
                        justifyContent: 'center',
                        alignContent: 'center',
                        flexDirection: 'row',
                        width: calculateSquareImageDimensions(4).width,
                        height: calculateSquareImageDimensions(4).height,
                        margin: {top: '1%'},
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: isSelected(item.id) ? getImageAtlasMapping(uiSizes.minusButton) :  getImageAtlasMapping(uiSizes.plusButton)
                    }}
                    onMouseDown={() => {
                        setUIClicked(true)
                        if(localPlayer && (localPlayer.homeWorld || localPlayer.worldPermissions)){
                            toggleSelectItem(item)
                        }
                    }}
                    onMouseUp={()=>{
                        setUIClicked(false)
                    }}
                />
        </UiEntity>
        </UiEntity>

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '15%',
            margin:{bottom:'3%'}
        }}
        // uiBackground={{color:Color4.Green()}}
        uiText={{value:item.n.length > 15 ? item.n.substring(0, 15) + "..." : item.n, fontSize:sizeFont(25,15)}}
        />


        </UiEntity>
    )
}

function ItemView(){
    return(
        <UiEntity
        key={resources.slug + "store::item::view"}
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            display: showStore && storeView === "item" && selectedItem ? "flex" : "none"
        }}
        >

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignContent:'flex-start',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '50%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            >
    
    <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateSquareImageDimensions(30).width,
            height: calculateSquareImageDimensions(30).height,
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: '' + (selectedItem && selectedItem.im)
            },
        }}
        />

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '20%',
            margin:{left:"5%"}
        }}
        >

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
        height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
        margin:{bottom:'2%'},
        display: localPlayer && (localPlayer.homeWorld || localPlayer.worldPermissions) ? "flex" : "none"
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
        if(localPlayer && (localPlayer.homeWorld || localPlayer.worldPermissions)){
            toggleSelectItem(selectedItem)
            updateStoreView("main")
            selectedItem = undefined
        }
    }}
    onMouseUp={() => {
        setUIClicked(false)
    }}
    uiText={{value:"" + (selectedItem && selectedItems.find(($:any)=> $.id === selectedItem.id) ? "Unselect" : "Select"), fontSize: sizeFont(30, 15)}}
/>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
        height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
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
        updateStoreView("main")
        selectedItem = undefined
    }}
    onMouseUp={() => {
        setUIClicked(false)
    }}
    uiText={{value:"Back", fontSize: sizeFont(30, 15)}}
/>
</UiEntity>

        </UiEntity>

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignContent:'flex-start',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '50%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            >

    <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
        }}
        uiText={{value:"" + (selectedItem && selectedItem.n), fontSize:sizeFont(40,25), textAlign:'middle-left', textWrap:'nowrap'}}
        />

<UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
        }}
        >
            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50%',
            height: '100%',
        }}
        >
            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
        }}
        uiText={{value:"Category: " + (selectedItem && selectedItem.cat), fontSize:sizeFont(25,20), textAlign:'middle-left'}}
        />
        </UiEntity>

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50%',
            height: '100%',
        }}
        >
            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
        }}
        uiText={{value:"Artist: " + (selectedItem && selectedItem.o), fontSize:sizeFont(25,20), textAlign:'middle-left'}}
        />
        </UiEntity>

        </UiEntity>

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
            uiText={{value:"Type: " + (selectedItem && selectedItem.ty), fontSize:sizeFont(25,20), textAlign:'middle-left'}}
            />


                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '20%',
                }}
                uiText={{value:"" + (selectedItem && selectedItem.d), fontSize:sizeFont(25,20), textAlign:'top-left'}}
                />

                </UiEntity>


            </UiEntity>
    )
}

function isSelected(id:string){
    if(selectedItems.find(($:any)=> $.id === id)){
        return true
    }else{
        return false
    }
}

function toggleSelectItem(item:CatalogItemType){
    if(isSelected(item.id)){
        let itemIndex = selectedItems.findIndex(($:any)=> $.id === item.id)
        if(itemIndex >= 0){
            selectedItems.splice(itemIndex, 1)
        }
    }else{
        selectedItems.push(item)
    }
}