import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import resources from '../../helpers/resources'
import { calculateImageDimensions, getAspect, dimensions, getImageAtlasMapping, sizeFont, calculateSquareImageDimensions } from '../helpers'
import { uiSizes } from '../uiConfig'
import { generateButtons, setUIClicked } from '../ui'
import { sendServerMessage } from '../../components/Colyseus'
import { SERVER_MESSAGE_TYPES, SOUND_TYPES } from '../../helpers/types'
import { HoriztonalButtons } from '../Reuse/HoriztonalButtons'
import { Color4 } from '@dcl/sdk/math'
import { paginateArray } from '../../helpers/functions'
import { marketplaceOriginal } from '../../components/Catalog'
import { playSound } from '@dcl-sdk/utils'

export let showStore = false
export let storeView = "main"
export let selectedItem:any

let buttons:any[] = [
    // {label:"Worlds", pressed:false, func:()=>{
    //     updateWorldView("Current World")
    //     // showYourBuilds()
    //     // updateExploreView("Current World")
    //     // displaySetting(button.label)
    //     }
    // },
    // {label:"Store", pressed:false, func:()=>{
    //     displayMainView(false)
    //     //showstore view
    //     }
    // },
    // {label:"Settings", pressed:false, func:()=>{
    //     updateMainView("Settings")
    //     // displayStatusView("Visual")
    //     // displaySetting(button.label)
    //     }
    // },
    // {label:"Info", pressed:false, func:()=>{

    //     updateMainView("Info")
    //     updateInfoView("Version")
    //     // updateTutorialsView("list")
    //     // updateHelpView("main")
    //     // displayStatusView("Version")
    //     // displaySetting(button.label)
    //     }
    // },
    // {label:"Close", pressed:false, func:()=>{
    //     // displaySettingsPanel(false)
    //     // displaySetting('Builds')
    //     displayMainView(false)
    //     // updateMainView("main")
    //     },
    //     position:{bottom:0},
    //     positionType:'absolute'
    // },
]

export let horiztonalButtons:any[] = [
    {label:"Marketplace", pressed:true, func:()=>{
        // updateWorldView("Current World")
        // setTableConfig(currentWorldTableConfig)
        // let scenes:any[] = []
        // colyseusRoom.state.scenes.forEach((sceneInfo:any)=>{
        //     scenes.push(sceneInfo)
        // })
        // updateIWBTable(scenes)
        playSound(SOUND_TYPES.SELECT_3)
        // showYourBuilds()
        // updateExploreView("Current World")
        },
        height:6,
        width:8,
        fontBigScreen:30,
        fontSmallScreen:12
    },
    {label:"Your Listings", pressed:false, func:()=>{
        // updateWorldView("My Worlds")
        // setTableConfig(myWorldConfig)
        // updateIWBTable(localPlayer.worlds)
        playSound(SOUND_TYPES.SELECT_3)
        // showWorlds()
        // updateExploreView("My Worlds")
        },
        height:6,
        width:8,
        fontBigScreen:30,
        fontSmallScreen:12
    },
]

let visibleItems:any[] = [
    {n:"Test", im:"", cat:"Fantasy"},
    {n:"Test", im:"", cat:"Fantasy"},
    {n:"Test", im:"", cat:"Fantasy"},
    {n:"Test", im:"", cat:"Fantasy"},
    {n:"Test", im:"", cat:"Fantasy"},
    {n:"Test", im:"", cat:"Fantasy"},
    {n:"Test", im:"", cat:"Fantasy"},
    {n:"Test", im:"", cat:"Fantasy"},
    {n:"Test", im:"", cat:"Fantasy"},
]
let visibleIndex:number = 1

export function displayStoreView(value:boolean){
    showStore = value

    if(showStore){
        storeView = "loading"
        sendServerMessage(SERVER_MESSAGE_TYPES.GET_MARKETPLACE,{})
    }
}

export function updateStoreVisibleItems(){
    visibleItems.length = 0
    visibleIndex = 1
    visibleItems = paginateArray([...marketplaceOriginal], visibleIndex, 9)
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

                {/* main content container */}
                <UiEntity
                uiTransform={{
                    display:'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent:'center',
                    width: '97%',
                    height: '85%',
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
        width: '20%',
        height: '100%',
    }}
    uiBackground={{color:Color4.Red()}}
    >

    {generateButtons({slug:"store-left-view", buttons:buttons})}

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
            <ItemView/>
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

        <HoriztonalButtons buttons={horiztonalButtons} slug={"main-store-view"} />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
        }}
        >
            {showStore && storeView === "main" && generateRows()}

            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
            // uiBackground={{color:Color4.Red()}}
            />
            
        </UiEntity>

        </UiEntity>
  
    )
}

function generateRows(){
    let arr:any[] = []
    let count= 0
    for(let i = 0; i < 2; i++){
        arr.push(<MarketplaceRow count={count}/>)
        count++
    }
    return arr
}

function generateMarketPlaceItems(index:number){
    let arr:any[] = []
    for(let i = 0; i < 3; i++){
        if(visibleItems[(index * 3) + i]){
            arr.push(<MarketplaceItem item={visibleItems[i]}/>)
        }
    }
    return arr
}

function MarketplaceRow(data:any){
    return(
        <UiEntity
        key={resources.slug + "store::row::" + data.count}
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '50%',
            margin:{left:'2%', right:'2%'}
        }}
        >
            {generateMarketPlaceItems(data.count)}
        </UiEntity>
    )
}

function MarketplaceItem(data:any){
    let item = data.item
    return(
        <UiEntity
        key={resources.slug + "store::item::" + item.n}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '33%',
            height: '100%',
            margin:'1%'
        }}
        // uiBackground={{color:Color4.Red()}}
        >
            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateSquareImageDimensions(15).width,
            height: calculateSquareImageDimensions(15).height,
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: '' + item.im
            },
        }}
        />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            margin:{bottom:'3%'}
        }}
        uiText={{value:item.n, fontSize:sizeFont(25,15)}}
        />

        <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '15%',
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
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png',
            },
            uvs:getImageAtlasMapping(uiSizes.buttonPillBlack)
        }}
        uiText={{value:"Info", fontSize:sizeFont(25,15)}}
        onMouseDown={()=>{
            setUIClicked(true)
            selectedItem = item
            updateStoreView("item")
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
        />
        </UiEntity>

        </UiEntity>
    )
}

function ItemView(){
    return(
        <UiEntity
        key={resources.slug + "store::item::view"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            display: showStore && storeView === "item" && selectedItem ? "flex" : "none"
        }}
        >

        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignContent:'flex-start',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '100%',
                height: '80%',
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
            justifyContent: 'center',
            width: '80%',
            height: '10%',
            margin:{left:"5%"}
        }}
        uiText={{value:"" + (selectedItem && selectedItem.n), fontSize:sizeFont(25,20), textAlign:'middle-left'}}
        />

                </UiEntity>

            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '20%',
        }}
        // uiBackground={{color:Color4.Blue()}}
        >

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            margin:{bottom:"2%"},
        }}
        uiText={{value:"Category: " + (selectedItem && selectedItem.cat), fontSize:sizeFont(25,20), textAlign:'middle-left'}}
        />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
        }}
        uiText={{value:"Artist: " + (selectedItem && selectedItem.o), fontSize:sizeFont(25,20), textAlign:'middle-left'}}
        />

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
        }}
        uiText={{value:"" + (selectedItem && selectedItem.d), fontSize:sizeFont(25,20), textAlign:'middle-left'}}
        />


            </UiEntity>


            </UiEntity>
    )
}
