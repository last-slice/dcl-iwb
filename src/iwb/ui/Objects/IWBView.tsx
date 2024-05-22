import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import resources from '../../helpers/resources'
import { calculateImageDimensions, getAspect, dimensions, getImageAtlasMapping, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'
import { generateButtons } from '../ui'
import { Color4 } from '@dcl/sdk/math'
import { HoriztonalButtons } from '../Reuse/HoriztonalButtons'
import { realm } from '../../components/Config'
import { IWBTable, setTableConfig, updateIWBTable } from '../Reuse/IWBTable'

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
        setTableConfig(tableConfig)
        updateIWBTable(testData)
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
        setTableConfig(tableConfig2)
        updateIWBTable(testData2)
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
        setTableConfig(tableConfig2)
        updateIWBTable(testData3)
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

let tableConfig:any = {
    height:'10%', width:'100%',
    headerData:[
        {world:"Scenes", update:"Last Update", builds:"Builds", go:"Go"},
    ],
    rowConfig:[
    {   key:"world",
        width:'40%',
        height:'100%',
        margin:{left:"1%"},
        value:"World",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-left',
        color:Color4.White()
    },
    {
        key:"update",
        width:'30%',
        height:'100%',
        margin:{left:"1%"},
        value:"Last Update",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-center',
        color:Color4.White()
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
        color:Color4.White()
    },
    ]
}

let tableConfig2:any = {
    height:'10%', width:'100%',
    headerData:[
        {world:"World", update:"Last Update", builds:"Builds", go:"Go"},
    ],
    rowConfig:[
    {   key:"world",
        width:'40%',
        height:'100%',
        margin:{left:"1%"},
        value:"World",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-left',
        color:Color4.White()
    },
    {
        key:"update",
        width:'30%',
        height:'100%',
        margin:{left:"1%"},
        value:"Last Update",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-center',
        color:Color4.White()
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
        color:Color4.White()
    },
    ]
}

let testData:any[] = [
    {world:"scene name", update:1, builds:1, go:"Go"}
]

let testData2:any[] = [
    {world:"my world name", update:2, builds:2, go:"Go2"}
]

let testData3:any[] = [
    {world:"all world name", update:3, builds:3, go:"Go3"}
]

export function displayMainView(value:boolean, toggle?:boolean){
    show = toggle ? !show : value
    resetViews()

    setTableConfig(tableConfig)
    updateMainView("Worlds")
    updateSubView("Current World")

    if(show && subView === "Current World"){
        updateIWBTable(testData)
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

                {/* right column container */}
                <UiEntity
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

                </UiEntity>

            </UiEntity>


        </UiEntity>
    )
}