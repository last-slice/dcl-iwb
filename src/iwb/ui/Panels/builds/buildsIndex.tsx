import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { addLineBreak, calculateImageDimensions, calculateSquareImageDimensions, dimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { isPreview, log } from '../../../helpers/functions'
import { localUserId, players } from '../../../components/player/player'
import { IWBScene } from '../../../helpers/types'
import { sceneBuilds } from '../../../components/scenes'

export let showSettingsPanel = false
export let showSetting = "Explore"

export let buttons:any[] = [
    {label:"Info", pressed:false},
    {label:"Config", pressed:false},
    {label:"Access", pressed:false},
    {label:"Delete", pressed:false},

    {label:"Back", pressed:false},
    {label:"Close", pressed:false},
]

export let scene:IWBScene

export function displaySceneInfoPanel(value: boolean, selectedScene:IWBScene) {
    showSettingsPanel = value
    scene = selectedScene
}

export function displaySceneSetting(value:string){
    showSetting = value
}

export function createSceneInfoPanel() {
    return (
        <UiEntity
            key={"sceneinfopanel"}
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
                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin:{left:'10%', bottom:'5%'}
                }}
                // uiBackground={{color:Color4.Green()}}
                uiText={{value:"Editing Scene: " + (scene? scene.n : ""), fontSize: sizeFont(30,25), color:Color4.Black(), textAlign:'middle-left'}}
                >
                </UiEntity>

                    {/* main content container */}
                <UiEntity
                uiTransform={{
                    display:'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '97%',
                    height: '75%',
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

                    
                    {/* add scene panels here */}
                        

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
            positionType: button.label === "Close" || "Back" ? "absolute" : undefined,
            position: button.label === "Close" || "Back" ? {bottom:0} : undefined,
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
            // if(button.label === "Close"){
            //     displaySettingsPanel(false)
            //     displaySetting('Builds')
            // }else if(button.label === "My Worlds"){
            //     showWorlds()
            //     displaySetting(button.label)
            // }
            // else if(button.label === "Explore"){
            //     showAllWorlds()
            //     displaySetting(button.label)
            // }
            // else if(button.label === "Builds"){
            //     showYourBuilds()
            //     displaySetting(button.label)
            // }
            // else{
            //     displaySetting(button.label)
            // }
        }}
        uiText={{value: button.label, color:Color4.Black(), fontSize:sizeFont(30,20)}}
        />)
    })
    return arr
}

function getButtonDisplay(button:string){
    if(button === "Create" || button === "Access" || button === "Builds"){
        return isPreview ? 'flex' :  (localUserId && players.get(localUserId)!.homeWorld) ?  'flex' : 'none'
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