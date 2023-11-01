import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { displaySetting, showSetting } from './settingsIndex'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { log } from '../../../helpers/functions'


let settings:any[] = [
    {label:"Scene Notifications", enabled:true},
    {label:"Display Build", enabled:true},
    {label:"Save Notifications", enabled:true},
    {label:"Popup Confirmations", enabled:true},

]

export function SettingsPanel() {
    return (
        <UiEntity
            key={"settingspanel"}
            uiTransform={{
                display: showSetting === "Settings" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
            }}
        // uiBackground={{ color: Color4.Teal() }}
        >

        {generateSettingsToggles(settings)}

        </UiEntity>
    )
}

function generateSettingsToggles(settings:any[]){
    let arr:any[] = []
    settings.forEach((setting)=>{
        arr.push(
        <UiEntity
        key={setting.label + "-settings"}
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50%',
            height: '10%',
            margin:{top:"1%", bottom:'1%'},
        }}
        >

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateSquareImageDimensions(4).width,
            height: calculateSquareImageDimensions(4).height,
            margin:{top:"1%", bottom:'1%'},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getButtonState(setting.label)
        }}
        onMouseDown={() => {
            settings.find((set:any)=>set.label === setting.label).enabled = !settings.find((set:any)=>set.label === setting.label).enabled 
        }}
        />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80%',
            height: '100%',
            margin:{left:"1%",},
        }}
        uiText={{value: setting.label, color:Color4.Black(), fontSize:sizeFont(30,20)}}
        />

        </UiEntity>
        )
    })
    return arr
}


function getButtonState(button:string){
    if(settings.find((b:any)=> b.label === button).enabled){
        return getImageAtlasMapping(uiSizes.toggleOn)
    }else{
        return getImageAtlasMapping(uiSizes.toggleOff)
    }
}