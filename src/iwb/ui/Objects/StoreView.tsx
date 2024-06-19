import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import resources from '../../helpers/resources'
import { calculateImageDimensions, getAspect, dimensions, getImageAtlasMapping, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'
import { generateButtons, setUIClicked } from '../ui'
let show = false

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

export let mainView = ""

export function displayStoreView(value:boolean){
    show = value
}

export function createStoreview() {
    return (
        <UiEntity
        key={"" + resources.slug + "main-store-ui"}
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
                    displayStoreView(false)
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
    // uiBackground={{color:Color4.Red()}}
    >

    {generateButtons({slug:"main-view", buttons:buttons})}

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

    <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '75%',
            height: '10%',
        }}
        uiText={{value:"COMING SOON", fontSize:sizeFont(25,20)}}
        />

        </UiEntity>
  
    )
}