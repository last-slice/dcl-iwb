import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { settingsView } from './settingsPanel'
import { playSound } from '../../../components/sounds'
import { SERVER_MESSAGE_TYPES, SOUND_TYPES } from '../../../helpers/types'
import { settings } from '../../../components/player/player'
import { sendServerMessage } from '../../../components/messaging'

let labels:any[] = [
    {label:"Scene Notifications", key:"nots"},
    {label:"Popup Confirmations", key:"confirms"},
]


export function VisualSettings() {
    return (
        <UiEntity
            key={"visualsettings"}
            uiTransform={{
                display: settingsView === "Visual" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}
        // uiBackground={{ color: Color4.Teal() }}
            >

                {generateSettingsToggles()}

        </UiEntity>
    )
}

function generateSettingsToggles(){
    let arr:any[] = []
    labels.forEach((setting)=>{
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
            uvs: getButtonState(setting.key)
        }}
        onMouseDown={() => {
            playSound(SOUND_TYPES.SELECT_3)
            settings[setting.key] = !settings[setting.key]
            sendServerMessage(SERVER_MESSAGE_TYPES.PLAYER_SETTINGS, {action:"update", key:setting.key, value: settings[setting.key]})
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
        uiText={{value: setting.label, color:Color4.White(), fontSize:sizeFont(30,20)}}
        />

        </UiEntity>
        )
    })
    return arr
}

function getButtonState(button:string){
    if(settings && settings[button]){
        return getImageAtlasMapping(uiSizes.toggleOnTrans)
    }else{
        return getImageAtlasMapping(uiSizes.toggleOffTrans)
    }
}