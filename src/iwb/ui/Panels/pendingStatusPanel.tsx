import { Color4, Vector3 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position,UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { InputAction, PointerEventType } from '@dcl/sdk/ecs'
import { uiSizes } from '../uiConfig'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import resources, { colors } from '../../helpers/resources'
import { isPreview } from '../../helpers/functions'
import { Spinner, UISpinner } from '../../../ui_components/UISpinner'
import { playSound } from '../../components/sounds'
import { NOTIFICATION_TYPES, SERVER_MESSAGE_TYPES, SOUND_TYPES } from '../../helpers/types'
import { displaySetting, displaySettingsPanel } from './settings/settingsIndex'
import { showNotification } from './notificationUI'
import { cRoom } from '../../components/messaging'
import { realm, worlds } from '../../components/scenes'


let showView = false
let view = ""

export function displayPendingPanel(value:boolean, type:string){
    showView = value
    view = type

    if(type === "deployment"){
        spinner.show()
    }

    if(type === "update"){

    }
}

let spinner = new Spinner('images/loadingAnimation/spinner.png', 300)
spinner.show()

export function createPendingStatusPanel(){
  return(
    <UiEntity
    key={"iwbstatuspanel"}
    uiTransform={{
        width: calculateImageDimensions(15, getAspect(uiSizes.largeHorizontalPill)).width,
        height: calculateImageDimensions(11,getAspect(uiSizes.largeHorizontalPill)).height,
      display: showView ? 'flex' : 'none',
      justifyContent:'center',
      flexDirection:'row',
      alignContent:'center',
      alignItems:'center',
      positionType:'absolute',
      position:{top: '1%', left: isPreview ? '14%' : '13%'}
    }}
    uiBackground={{
      texture:{
          src: resources.textures.atlas2
      },
      textureMode: 'stretch',
      uvs:getImageAtlasMapping(uiSizes.largeHorizontalPill)
    }}
  >


    {/* pending deployment panel */}
    <UiEntity
    uiTransform={{
        width: '100%',
        height: '100%',
      justifyContent:'center',
      flexDirection:'row',
      alignContent:'center',
      alignItems:'center',
      display: view === "deployment" ? "flex" : "none"
    }}
    >
<UiEntity
    uiTransform={{
        width: '20%',
        height: '80%',
      justifyContent:'center',
      flexDirection:'column',
      alignContent:'center',
      alignItems:'center',
      margin:{left:"5%"}
    }}
    >

<UISpinner 
      spinner={spinner}
      uiTransform={{
          width: '90%',
          height: '90%',
          flexDirection:'column',
          justifyContent:'center',
      }}                    
  />
  </UiEntity>

<UiEntity
    uiTransform={{
        width: '80%',
        height: '100%',
      justifyContent:'center',
      flexDirection:'column',
      alignContent:'center',
      alignItems:'center',
    }}
    uiText={{value:"Deployment Pending", fontSize:sizeFont(25,15), color:Color4.White(), textAlign:'middle-left'}}
  />
  </UiEntity>

    {/* update ready panel */}
  <UiEntity
    uiTransform={{
        width: '100%',
        height: '100%',
      justifyContent:'center',
      flexDirection:'row',
      alignContent:'center',
      alignItems:'center',
      display: view === "update" ? "flex" : "none"
    }}
    >

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60%',
            height: '100%',
            margin:{top:"1%", bottom:'1%'},
        }}
        uiText={{value:"Update Ready", fontSize:sizeFont(25,20), color:Color4.White()}}
    />

    <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(4, getAspect(uiSizes.buttonPillBlue)).width,
            height: calculateImageDimensions(4,getAspect(uiSizes.buttonPillBlue)).height,
            margin:{top:"1%", bottom:'1%'},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
        }}
        uiText={{value:"Update", fontSize:sizeFont(25,20), color:Color4.White()}}
        onMouseDown={()=>{
            playSound(SOUND_TYPES.SELECT_3)
            displaySettingsPanel(false)
            displaySetting("Explore")
            showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Your deployment is processing...please wait for confirmation to refresh", animate:{enabled:true, time:7, return:true}})
            // cRoom.send(SERVER_MESSAGE_TYPES.FORCE_DEPLOYMENT, worlds.find((w)=> w.ens === realm))
            displayPendingPanel(true, "deployment")
        }}
    />

        </UiEntity>

        <UiEntity
    uiTransform={{
        width: '100%',
        height: '100%',
      justifyContent:'center',
      flexDirection:'row',
      alignContent:'center',
      alignItems:'center',
      display: view === "assetsready" ? "flex" : "none"
    }}
    >

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60%',
            height: '100%',
            margin:{top:"1%", bottom:'1%'},
        }}
        uiText={{value:"Asset(s) Ready", fontSize:sizeFont(25,20), color:Color4.White()}}
    />

    <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(4, getAspect(uiSizes.buttonPillBlue)).width,
            height: calculateImageDimensions(4,getAspect(uiSizes.buttonPillBlue)).height,
            margin:{top:"1%", bottom:'1%'},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
        }}
        uiText={{value:"Update", fontSize:sizeFont(25,20), color:Color4.White()}}
        onMouseDown={()=>{
            playSound(SOUND_TYPES.SELECT_3)
            displaySettingsPanel(false)
            displaySetting("Explore")
            showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Your deployment is processing...please wait for confirmation to refresh", animate:{enabled:true, time:7, return:true}})
            // cRoom.send(SERVER_MESSAGE_TYPES.FORCE_DEPLOYMENT, worlds.find((w)=> w.ens === realm))
            displayPendingPanel(true, "deployment")
        }}
    />

        </UiEntity>

        {/* refresh ready panel */}
        <UiEntity
    uiTransform={{
        width: '100%',
        height: '100%',
      justifyContent:'center',
      flexDirection:'row',
      alignContent:'center',
      alignItems:'center',
      display: view === "ready" ? "flex" : "none"
    }}
    >

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            margin:{top:"1%", bottom:'1%'},
        }}
        uiText={{value:"World Updated. Refresh Ready.", fontSize:sizeFont(25,20), color:Color4.White()}}
    />

        </UiEntity>

        {/* Disconnected panel */}
        <UiEntity
    uiTransform={{
        width: '100%',
        height: '100%',
      justifyContent:'center',
      flexDirection:'row',
      alignContent:'center',
      alignItems:'center',
      display: view === "disconnected" ? "flex" : "none"
    }}
    >

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            margin:{top:"1%", bottom:'1%'},
        }}
        uiText={{value:"Disconnected", fontSize:sizeFont(25,20), color:Color4.White()}}
    />

        </UiEntity>


  </UiEntity>

  )
}