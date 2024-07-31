import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import resources from '../../../helpers/resources'
import { mainView } from '../IWBView'
import { HoriztonalButtons } from '../../Reuse/HoriztonalButtons'
import { sendServerMessage } from '../../../components/Colyseus'
import { settings } from '../../../components/Player'
import { SOUND_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { calculateSquareImageDimensions, sizeFont, getImageAtlasMapping } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { playSound } from '../../../components/Sounds'
import { setUIClicked } from '../../ui'
import { utils } from '../../../helpers/libraries'
import { addSceneRoofs, removeSceneRoofs } from '../../../components/Config'

let settingsView = "Visual"

let labels:any[] = [
    {label:"Scene Notifications", key:"nots"},
    {label:"Popup Confirmations", key:"confirms"},
    {label:"Check Scene Boundaries", key:"sceneCheck"},
    {label:"Enable Trigger Debug", key:"triggerDebug"},
    {label:"Show Height Limits", key:"heightLimits"},
]

export function updateSettingsView(view:string){
    let button = horiztonalButtons.find($=> $.label === settingsView)
    if(button){
        button.pressed = false
    }

    settingsView = view
    button = horiztonalButtons.find($=> $.label === view)
    if(button){
        button.pressed = true
    }
}

export let horiztonalButtons:any[] = [
    {label:"Visual", pressed:false, func:()=>{
        updateSettingsView("Visual")
        },
        height:6,
        width:8,
        fontBigScreen:30,
        fontSmallScreen:15
    },
    {label:"Audio", pressed:false, func:()=>{
        updateSettingsView("Audio")
        },
        height:6,
        width:8,
        fontBigScreen:30,
        fontSmallScreen:15
    }
]

export function SettingsView(){
    return(
        <UiEntity
        key={resources.slug + "-main-view-right-settings"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            display:mainView === "Settings" ? 'flex' : 'none'
        }}
        // uiBackground={{color:Color4.Red()}}
        >

        <HoriztonalButtons buttons={horiztonalButtons} slug={"settings2-view"} />

        <VisualSettings/>
        <AudioSettings/>

            </UiEntity>
    )
}

function VisualSettings(){
    return (
        <UiEntity
        key={resources.slug + "-settings-view-visual"}            
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

function AudioSettings(){
    return (
        <UiEntity
        key={resources.slug + "-settings-view-audio"}            
        uiTransform={{
            display: settingsView === "Audio" ? 'flex' : 'none',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            }}
        // uiBackground={{ color: Color4.Teal() }}
            >

        </UiEntity>
    )
}



function generateSettingsToggles(){
    let arr:any[] = []
    labels.forEach((setting)=>{
        arr.push(
        <UiEntity
        key={resources.slug + setting.label + "-settings"}
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
            setUIClicked(true)
            playSound(SOUND_TYPES.SELECT_3)
            settings[setting.key] = !settings[setting.key]
            if(setting.key === "triggerDebug"){
                utils.triggers.enableDebugDraw(settings[setting.key])
            }
            if(setting.key === "heightLimits"){
                if(settings[setting.key]){
                    addSceneRoofs()
                }else{
                    removeSceneRoofs()
                }
            }
            sendServerMessage(SERVER_MESSAGE_TYPES.PLAYER_SETTINGS, {action:"update", key:setting.key, value: settings[setting.key]})
        }}
        onMouseUp={()=>{
            setUIClicked(false)
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
        uiText={{textWrap:'nowrap', value: setting.label, color:Color4.White(), fontSize:sizeFont(30,20)}}
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