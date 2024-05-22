import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import resources from '../../helpers/resources'
import { calculateImageDimensions, getAspect, dimensions, getImageAtlasMapping, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'
import { generateButtons } from '../ui'
import { Color4 } from '@dcl/sdk/math'
import { HoriztonalButtons } from '../Reuse/HoriztonalButtons'
import { realm } from '../../components/Config'
import { IWBTable, setTableConfig, updateIWBTable } from '../Reuse/IWBTable'
import { testData } from '../../tests/testData'
import { formatDollarAmount, formatSize } from '../../helpers/functions'

let show = false

let buttons:any[] = [
    {label:"Worlds", pressed:false, func:()=>{
        updateMainView("Worlds")
        // showYourBuilds()
        // updateExploreView("Current World")
        // displaySetting(button.label)
        }
    },
    {label:"Store", pressed:false, func:()=>{
        updateMainView("Store")
        }
    },
    {label:"Settings", pressed:false, func:()=>{
        updateMainView("Settings")
        // displayStatusView("Visual")
        // displaySetting(button.label)
        }
    },
    {label:"Info", pressed:false, func:()=>{
        updateMainView("Info")
        // updateTutorialsView("list")
        // updateHelpView("main")
        // displayStatusView("Version")
        // displaySetting(button.label)
        }
    },
    {label:"Close", pressed:false, func:()=>{
        // displaySettingsPanel(false)
        // displaySetting('Builds')
        displayMainView(false)
        updateMainView("main")
        },
        position:{bottom:0},
        positionType:'absolute'
    },
]

let horiztonalButtons:any[] = [
    {label:"Current World", pressed:false, func:()=>{
        updateSubView("Current World")
        setTableConfig(currentWorldTableConfig)
        updateIWBTable(testData.scenes)
        // playSound(SOUND_TYPES.SELECT_3)
        // showYourBuilds()
        // updateExploreView("Current World")
        },
        height:6,
        width:8,
        fontBigScreen:30,
        fontSmallScreen:12
    },
    {label:"My Worlds", pressed:false, func:()=>{
        updateSubView("My Worlds")
        setTableConfig(myWorldConfig)
        updateIWBTable(testData.myworlds)
        // playSound(SOUND_TYPES.SELECT_3)
        // showWorlds()
        // updateExploreView("My Worlds")
        },
        height:6,
        width:8,
        fontBigScreen:30,
        fontSmallScreen:15
    },
    {label:"All Worlds", pressed:false, func:()=>{
        updateSubView("All Worlds")
        setTableConfig(allWorldsConfig)
        updateIWBTable(testData.allworlds)
        // playSound(SOUND_TYPES.SELECT_3)
        // // displayStatusView("All Worlds")
        // showAllWorlds()
        // updateExploreView("All Worlds")
        },
        height:6,
        width:8,
        fontBigScreen:30,
        fontSmallScreen:15
    },
]

export let mainView = ""
export let subView = ""

let currentWorldTableConfig:any = {
    height:'10%', width:'100%', rowCount:6,
    headerData:[
        {name:"Name", pcnt:"Parcel Count", si:"Size", pc:"Poly Count", go:"Visit"},
    ],
    tableSortFn:(a:any, b:any)=>{
        // Check if either of the names is "Realm Lobby"
        if (a.name === "Realm Lobby" && b.name !== "Realm Lobby") {
          return -1; // "Realm Lobby" comes first
        } else if (a.name !== "Realm Lobby" && b.name === "Realm Lobby") {
          return 1; // "Realm Lobby" comes first
        } else {
          // Both names are not "Realm Lobby", sort by parcel size (high to low)
        //   return b.pcnt - a.pcnt;
        return a.name.localeCompare(b.name)
        }
    },

    rowConfig:[
    { 
        key:"name",
        width:'30%',
        height:'100%',
        margin:{left:"1%"},
        value:"",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-left',
        color:Color4.White()
    },
    {
        key:"pcnt",
        width:'20%',
        height:'100%',
        margin:{left:"1%"},
        value:"",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-center',
        color:Color4.White(),
        func:(data:any)=>{
            return "" + formatSize(data) + "MB"
        }
    },
    {
        key:"si",
        width:'10%',
        height:'100%',
        margin:{left:"1%"},
        value:"Builds",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-center',
        color:Color4.White(),
        func:(data:any)=>{
            return "" + formatDollarAmount(data)
        }
    },
    {
        key:"pc",
        width:'20%',
        height:'100%',
        margin:{left:"1%"},
        value:"Builds",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-center',
        color:Color4.White()
    },
    {
        key:"go",
        width:'20%',
        height:'80%',
        margin:{left:"1%"},
        value:"Go",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-center',
        color:Color4.White(),
        image:true
    },
    ]
}

let myWorldConfig:any = {
    height:'10%', width:'100%',
    headerData:[
        {name:"Name", init:"Created", updated:"Last Update", builds:"Builds", go:"Go"},
    ],
    tableSortFn:(a:any, b:any) => a.name.localeCompare(b.name),
    rowConfig:[
    {   key:"name",
        width:'30%',
        height:'100%',
        margin:{left:"1%"},
        value:"World",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-left',
        color:Color4.White()
    },
    {
        key:"init",
        width:'13%',
        height:'100%',
        margin:{left:"1%"},
        value:"Last Update",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-center',
        color:Color4.White(),
        func:(data:any)=>{
            return "" + (data ? "Yes" : "No")
        }
    },
    {
        key:"updated",
        width:'30%',
        height:'100%',
        margin:{left:"1%"},
        value:"Go",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-center',
        color:Color4.White(),
        func:(data:any)=>{
            return "" + (data > 0 ? Math.floor((Math.floor(Date.now()/1000) - data) / 86400) + " days ago" : "Never" )
        }
    },
    {
        key:"builds",
        width:'13%',
        height:'100%',
        margin:{left:"1%"},
        value:"Builds",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-center',
        color:Color4.White()
    },
    {
        key:"go",
        width:'13%',
        height:'100%',
        margin:{left:"1%"},
        value:"Go",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-center',
        color:Color4.White(),
        image:true
    },
    ]
}

let allWorldsConfig:any = {
    height:'10%', width:'100%',
    headerData:[
        {worldName:"World", updated:"Last Update", builds:"Builds", go:"Go"},
    ],
    tableSortFn:(a:any, b:any) => {
        if (a.worldName === "BuilderWorld") return -1;
        if (b.worldName === "BuilderWorld") return 1;

        return a.worldName.localeCompare(b.worldName);
    },
    rowConfig:[
    {   key:"worldName",
        width:'40%',
        height:'100%',
        margin:{left:"1%"},
        value:"World",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-left',
        color:Color4.White()
    },
    {
        key:"updated",
        width:'30%',
        height:'100%',
        margin:{left:"1%"},
        value:"Last Update",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-center',
        color:Color4.White(),
        func:(data:any)=>{
            return "" + Math.floor((Math.floor(Date.now() / 1000) - data) / 86400) + " days ago"
        }
    },
    {
        key:"builds",
        width:'10%',
        height:'100%',
        margin:{left:"1%"},
        value:"Builds",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-center',
        color:Color4.White()
    },
    {
        key:"go",
        width:'20%',
        height:'100%',
        margin:{left:"1%"},
        value:"Go",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-center',
        color:Color4.White(),
        image:true
    },
    ]
}

export function displayMainView(value:boolean, toggle?:boolean){
    show = toggle ? !show : value
    resetViews()

    setTableConfig(currentWorldTableConfig)
    updateMainView("Worlds")
    updateSubView("Current World")

    if(show && subView === "Current World"){
        updateIWBTable(testData.scenes)
    }
}

function resetViews(){
    mainView = "Worlds"
    subView = "Current World"
    buttons.forEach(($:any)=>{
        $.pressed = false
    })
}

function updateMainView(view:string){
    let button = buttons.find($=> $.label === mainView)
    if(button){
        button.pressed = false
    }

    mainView = view
    button = buttons.find($=> $.label === view)
    if(button){
        button.pressed = true
    }
}

function updateSubView(view:string){
    let button = horiztonalButtons.find($=> $.label === subView)
    if(button){
        button.pressed = false
    }

    subView = view
    button = horiztonalButtons.find($=> $.label === view)
    if(button){
        button.pressed = true
    }
}

export function createMainView() {
    return (
        <UiEntity
        key={"" + resources.slug + "main-panel-ui"}
            uiTransform={{
                display: show? 'flex' : 'none',
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

                {/* left column container */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: '20%',
                        height: '100%',
                    }}
                    // uiBackground={{color:Color4.Red()}}
                    >

                    {generateButtons({slug:"main-view", buttons:buttons})}

                    </UiEntity>

                    <MainRightView />

                </UiEntity>

            </UiEntity>


        </UiEntity>
    )
}

function MainRightView(){
    return(
        <UiEntity
        key={resources.slug + "-main-view-right-container"}
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
            <HoriztonalButtons buttons={horiztonalButtons} slug={"main-view"} />

            {/* realm button row */}
    <UiEntity
    uiTransform={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
    }}
    // uiBackground={{color:Color4.Blue()}}
    >

    {/* current realm text */}
    <UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
        }}
        uiText={{
            value: "Current World: " + realm,
            textAlign: 'middle-left',
            color: Color4.White(),
            fontSize: sizeFont(25, 15)
        }}
    />

    </UiEntity>

    <IWBTable />

        </UiEntity>
  
    )
}