import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import resources from '../../helpers/resources'
import { calculateImageDimensions, getAspect, dimensions, getImageAtlasMapping, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'
import { generateButtons, setUIClicked } from '../ui'
import { IWBTable, setTableConfig, updateIWBTable } from '../Reuse/IWBTable'
import { InfoView, updateInfoView } from './IWBViews/InfoView'
import { SettingsView, updateSettingsView } from './IWBViews/SettingsView'
import { currentWorldTableConfig, horiztonalButtons, updateWorldView, WorldsView, worldView } from './IWBViews/WorldView'
import { displayStoreView } from './StoreView'
import { CreateSceneView } from './IWBViews/CreateView'
import { colyseusRoom } from '../../components/Colyseus'
import { island } from '../../components/Config'
import { addStreamEntity, MusicView, streamEntity, updateMusicView } from './IWBViews/MusicView'
import { engine } from '@dcl/sdk/ecs'
import { displayCatalogPanel } from './CatalogPanel'
import { displayQuestCreatorPanel } from './QuestCreatorPanel'

let show = false

let buttons:any[] = [
    {label:"Worlds", pressed:false, func:()=>{
        updateMainView("Worlds")
        updateWorldView("Current World")
        }
    },
    {label:"Catalog", pressed:false, func:()=>{
        displayMainView(false)
        displayCatalogPanel(false)
        displayStoreView(true)
        }
    },
    {label:"Create", pressed:false, func:()=>{
        updateMainView("CreateView")
        },
        displayCondition:()=>{
            return island === "world"
        }
    },
    {label:"Settings", pressed:false, func:()=>{
        updateMainView("Settings")
        updateSettingsView("Visual")
        },
        displayCondition:()=>{
            return island === "world"
        }
    },
    {label:"Info", pressed:false, func:()=>{
        updateMainView("Info")
        updateInfoView("Version")
        },
        displayCondition:()=>{
            return island === "world"
        }
    },
    {label:"Audius", pressed:false, func:()=>{
        if(!streamEntity){
            addStreamEntity()
        }
        updateMusicView()
        updateMainView("Audius")
        },
        // displayCondition:()=>{
        //     return island === "world"
        // },
        width: 3.5,
        height:8,
        customImage:resources.textures.audiusIcon,
        margin:{top:"5%"},
        uvs:resources.uvs.audiusIcon
    },
    {label:"Close", pressed:false, func:()=>{
        updateIWBTable([])
        displayMainView(false)
        },
        position:{bottom:0},
        positionType:'absolute'
    },
]

export let mainView = ""

export function displayMainView(value:boolean, toggle?:boolean){
    show = toggle ? !show : value
    resetViews()

    if(!show){
        updateIWBTable([]) 
    }
   

    setTableConfig(currentWorldTableConfig)
    updateMainView("Worlds")
    updateWorldView("Current World")

    if(show && worldView === "Current World"){
        let scenes:any[] = []
        colyseusRoom.state.scenes.forEach((sceneInfo:any)=>{
            scenes.push(sceneInfo)
        })
        updateIWBTable(scenes)
    }
}

function resetViews(){
    mainView = "Worlds"
    buttons.forEach(($:any)=>{
        $.pressed = false
    })
}

export function updateMainView(view:string){
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
   return(<UiEntity
    key={resources.slug + "-main-view-left-container"}
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
            margin:{left:'2%'},
        }}
        // uiBackground={{color:Color4.Blue()}}
        >

            <WorldsView/>
            <SettingsView/>
            <InfoView/>
            <CreateSceneView/>
            <MusicView/>
            <CreateMainView />

        </UiEntity>
  
    )
}

function CreateMainView(){
    return(
    <UiEntity
    key={"" + resources.slug + "creator::panel::main::view"}
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: '100%',
        display:mainView === "CreateView" ? 'flex' : 'none'
    }}
    >

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',

    }}
    uiText={{value:"Creator View", textAlign:'middle-center', textWrap:'nowrap', fontSize:sizeFont(25,20)}}
  />

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '95%',
        height: '90%',
    }}
  >
    {   show && mainView === "CreateView" &&
        generateButtons(
            {
                slug:"create-new-panel", 
                buttons:[
                     {label:"Scenes", pressed:false, width:7, bigScreen:20, smallScreen:15, height:5, func:()=>{
                        updateMainView("Create")
                     }},
                    //  {label:"Quests", pressed:false, width:7, bigScreen:20, smallScreen:15, height:5, func:()=>{
                    //     displayMainView(false)
                    //     displayQuestCreatorPanel(true)
                    //  }}
                    ]
                }
        )
    }
  </UiEntity>

  </UiEntity>
)
}