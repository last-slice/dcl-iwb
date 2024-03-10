import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { addLineBreak, calculateImageDimensions, calculateSquareImageDimensions, dimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { BuildsPanel, showYourBuilds } from './buildsPanel'
import { ExplorePanel, showAllWorlds, updateExploreView } from './explorePanel'
import { SettingsPanel, displayStatusView } from './settingsPanel'
import { CreateScenePanel } from './createPanel'
import { YourWorlds, showWorlds } from './youWorlds'
import { realm } from '../../../components/scenes'
import { isPreview, log } from '../../../helpers/functions'
import { localUserId, players } from '../../../components/player/player'
import { VersionPanel } from './versionPanel'
import { connected } from '../../../components/messaging'
import { StatusPanel } from './StatusPanel'
import { playSound } from '../../../components/sounds'
import { SOUND_TYPES } from '../../../helpers/types'
import { showTutorials, updateTutorialsView } from './help/tutorialsPanel'
import { updateHelpView } from './help/helpPanelMain'

export let showSettingsPanel = false
export let showSetting = "Explore"

export let buttons:any[] = [
    {label:"Explore", pressed:false},
    // {label:"My Worlds", pressed:false},
    // {label:"Builds", pressed:false},
    {label:"Create", pressed:false},
    {label:"Settings", pressed:false},
    {label:"Info", pressed:false},
    {label:"Close", pressed:false},
]

export function displaySettingsPanel(value: boolean) {
    showSettingsPanel = value
    if(showSettingsPanel){
        showYourBuilds()
        displaySetting("Explore")
    }
}

export function displaySetting(value:string){
    showSetting = value
}

export function createSettingsPanel() {
    return (
        <UiEntity
            key={"settingspanel"}
            uiTransform={{
                display: showSettingsPanel ? 'flex' : 'none',
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
                // uiBackground={{color:Color4.Green()}}
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

                    {generateSettingsButtons(buttons)}


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

                    {/* <YourWorlds/> */}
                    {/* <BuildsPanel/> */}
                    <ExplorePanel/>
                    <CreateScenePanel/>
                    <SettingsPanel/>
                    <StatusPanel/>
                        
                    </UiEntity>

                </UiEntity>


                {/* connection status label */}
            {/* <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '5%',
                positionType:'absolute',
                position:{bottom:'10%', left: '25%'}
            }}
            uiText={{value:"Status: " + (connected ? "Connected" : "Disconnected"), textAlign:'middle-left', fontSize: sizeFont(20,15), color:Color4.White()}}
            /> */}

            </UiEntity>

        </UiEntity>
    )
}

function generateSettingsButtons(buttons:any[]){
    let arr:any[] = []
    buttons.forEach((button)=>{
        arr.push(
        <UiEntity
        key={button.label + "-settings"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(7, getAspect(uiSizes.buttonPillBlue)).width,
            height: calculateImageDimensions(7,getAspect(uiSizes.buttonPillBlue)).height,
            margin:{top:"1%", bottom:'1%'},
            positionType: button.label === "Close" ? "absolute" : undefined,
            position: button.label === "Close" ? {bottom:0} : undefined,
            display: getButtonDisplay(button.label)
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getButtonState(button.label)
        }}
        onMouseDown={() => {
            if(button.label === "Close"){
                displaySettingsPanel(false)
                displaySetting('Builds')
            }else if(button.label === "My Worlds"){
                showWorlds()
                displaySetting(button.label)
            }
            else if(button.label === "Explore"){
                showYourBuilds()
                updateExploreView("Current World")
                displaySetting(button.label)
            }
            else if(button.label === "Builds"){
                showYourBuilds()
                displaySetting(button.label)
            }
            else if(button.label === "Info"){
                updateTutorialsView("list")
                updateHelpView("main")
                displayStatusView("Version")
                displaySetting(button.label)
            }
            else if(button.label ==="Settings"){
                displayStatusView("Visual")
                displaySetting(button.label)
            }
            else{
                displaySetting(button.label)
            }
            playSound(SOUND_TYPES.WOOD_3)
        }}
        uiText={{value: button.label, color:Color4.White(), fontSize:sizeFont(30,20)}}
        />)
    })
    return arr
}

function getButtonDisplay(button:string){
    if(button === "Create"){
        return isPreview ? 'flex' :  (localUserId && players.get(localUserId)!.homeWorld) ?  'flex' : 'none'
    }else{
        return 'flex'
    }
}

function getButtonState(button:string){
    if(showSetting === button || buttons.find((b:any)=> b.label === button).pressed){
        return getImageAtlasMapping(uiSizes.buttonPillBlue)
    }else{
        return getImageAtlasMapping(uiSizes.buttonPillBlack)
    }
}