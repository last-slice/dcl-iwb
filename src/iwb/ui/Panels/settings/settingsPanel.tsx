import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { displaySetting, showSetting } from './settingsIndex'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { log } from '../../../helpers/functions'
import { VisualSettings } from './visualSettings'
import { AudioSettings } from './audioSettings'


export let settingsView = "Visual"

export function displayStatusView(view:string){
    settingsView = view
}


export function SettingsPanel() {
    return (
        <UiEntity
            key={"settingspanel"}
            uiTransform={{
                display: showSetting === "Settings" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}
        // uiBackground={{ color: Color4.Teal() }}//
        >

                        {/* buttons row */}
        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
        // uiBackground={{ color: Color4.Teal() }}
        >

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlue)).width,
            height: calculateImageDimensions(6,getAspect(uiSizes.buttonPillBlue)).height,
                margin:{top:"1%", bottom:'1%'},
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getButtonState("Visual")
            }}
            onMouseDown={() => {
                displayStatusView("Visual")
            }}
            uiText={{value:"Visual", color:Color4.White(), fontSize:sizeFont(30,20)}}
            />

            {/* <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlue)).width,
                height: calculateImageDimensions(6,getAspect(uiSizes.buttonPillBlue)).height,
                margin:{top:"1%", bottom:'1%', left:'1%'},
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getButtonState("Audio")
            }}
            onMouseDown={() => {
                displayStatusView("Audio")
            }}
            uiText={{value:"Audio", color:Color4.White(), fontSize:sizeFont(30,20)}}
            /> */}

        </UiEntity>

                    {/* settings data panel */}
                    <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '90%',
            }}
        // uiBackground={{ color: Color4.Red() }}
        >

            <VisualSettings/>
            <AudioSettings/>

        </UiEntity>

        </UiEntity>
    )
}


function getButtonState(button:string){
    if(settingsView === button){
        return getImageAtlasMapping(uiSizes.buttonPillBlue)
    }else{
        return getImageAtlasMapping(uiSizes.buttonPillBlack)
    }
}

