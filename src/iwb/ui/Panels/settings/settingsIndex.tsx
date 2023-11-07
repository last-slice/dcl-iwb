import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { addLineBreak, calculateImageDimensions, calculateSquareImageDimensions, dimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { BuildsPanel } from './buildsPanel'
import { AccessPanel } from './accessPanel'
import { ExplorePanel } from './explorePanel'
import { SettingsPanel } from './settingsPanel'
import { CreateScenePanel } from './createPanel'
import { world } from '../../../components/messaging'
import { log } from '../../../helpers/functions'

export let showSettingsPanel = false
export let showSetting = "Explore"

export let buttons:any[] = [
    {label:"Create", pressed:false},
    {label:"Access", pressed:false},
    {label:"Explore", pressed:false},
    {label:"Builds", pressed:false},
    {label:"Settings", pressed:false},
    {label:"Close", pressed:false},
]

export function displaySettingsPanel(value: boolean) {
    showSettingsPanel = value//
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
                position: { left: (dimensions.width - calculateImageDimensions(45, getAspect(uiSizes.horizRectangle)).width) / 2, top: (dimensions.height - calculateImageDimensions(45, getAspect(uiSizes.horizRectangle)).height) / 2 }
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

                {/* header container */}
                {/* <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                }}
                // uiBackground={{color:Color4.Green()}}
                uiText={{value:"Settings", fontSize: sizeFont(40,30), color:Color4.Black()}}
                >
                </UiEntity> */}

                    {/* main content container */}
                <UiEntity
                uiTransform={{
                    display:'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '97%',
                    height: '85%',
                    margin:{left:"1%"},
                    padding:{left:"2%", right:'2%', bottom:'2%'}
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
                        width: '80%',
                        height: '100%',
                    }}
                    // uiBackground={{color:Color4.Blue()}}
                    >

                    <CreateScenePanel/>
                    <BuildsPanel/>
                    <AccessPanel/>
                    <ExplorePanel/>
                    <SettingsPanel/>
                        

                    </UiEntity>

                </UiEntity>

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
            width: calculateImageDimensions(8, getAspect(uiSizes.rectangleButton)).width,
            height: calculateImageDimensions(15,getAspect(uiSizes.rectangleButton)).height,
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
            }else{
                displaySetting(button.label)
            }
        }}
        uiText={{value: button.label, color:Color4.Black(), fontSize:sizeFont(30,20)}}
        />)
    })
    return arr
}

function getButtonDisplay(button:string){
    if(button === "Create" || button === "Access"){
        return world && world.world === "main" ? "none" : 'flex'
    }else{
        return 'flex'
    }
}

function getButtonState(button:string){
    if(button === "Close"){
        return getImageAtlasMapping({
            atlasHeight: 1024,
            atlasWidth: 1024,
            sourceTop: 841,
            sourceLeft: 579,
            sourceWidth: 223,
            sourceHeight: 41
        })
    }
    else{
        if(showSetting === button || buttons.find((b:any)=> b.label === button).pressed){
            return getImageAtlasMapping(uiSizes.blueButton)
        }else{
            return getImageAtlasMapping({
                atlasHeight: 1024,
                atlasWidth: 1024,
                sourceTop: 801,
                sourceLeft: 802,
                sourceWidth: 223,
                sourceHeight: 41
            })
        }
    }
}