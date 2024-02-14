import { Color4, Vector3 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position,UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { InputAction, PointerEventType } from '@dcl/sdk/ecs'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from './helpers'
import resources from '../helpers/resources'
import { uiSizes } from './uiConfig'
import { stopTutorialVideo } from '../components/player/player'
import { displaySetting, displaySettingsPanel } from './Panels/settings/settingsIndex'
import { displayStatusView } from './Panels/settings/settingsPanel'
import { showTutorials, updateTutorialsView } from './Panels/settings/help/tutorialsPanel'
import { updateHelpView } from './Panels/settings/help/helpPanelMain'

let showView = false
export function displayTutorialVideoControls(value:boolean){
    showView = value
}

export function createTutorialVideoControPanel(){
  return(
    <UiEntity
    key={"iwbtutorialvideocontrolpanel"}
    uiTransform={{
      width: calculateImageDimensions(13, getAspect(uiSizes.smallPill)).width,
      height:calculateImageDimensions(13, getAspect(uiSizes.smallPill)).height,
      display: showView ? 'flex' : 'none',
      justifyContent:'center',
      flexDirection:'row',
      alignContent:'center',
      alignItems:'center',
      positionType:'absolute',
      position:{top:'1%', left:'20%'}
    }}
    uiBackground={{
      texture:{
          src: resources.textures.atlas2
      },
      textureMode: 'stretch',
      uvs:getImageAtlasMapping(uiSizes.smallPill)
    }}
  >

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(4, getAspect(uiSizes.buttonPillBlue)).width,
                height: calculateImageDimensions(4,getAspect(uiSizes.buttonPillBlue)).height,
                margin:{top:"1%", bottom:'1%', left:'1%', right:'1%'},
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
            }}
            onMouseDown={() => {
                displayTutorialVideoControls(false)
                updateTutorialsView("list")
                updateHelpView("tutorials")
                showTutorials()
                displayStatusView("Help")
                displaySetting("Info")
                displaySettingsPanel(true)
                stopTutorialVideo()
            }}
            uiText={{value:"Back", color:Color4.White(), fontSize:sizeFont(30,20)}}
            />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(4, getAspect(uiSizes.buttonPillBlue)).width,
                height: calculateImageDimensions(4,getAspect(uiSizes.buttonPillBlue)).height,
                margin:{top:"1%", bottom:'1%', left:'1%', right:'1%'},
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
            }}
            onMouseDown={() => {
                displayTutorialVideoControls(false)
                displaySetting("Explore")
                displayStatusView("Version")
                stopTutorialVideo()
            }}
            uiText={{value:"Stop", color:Color4.White(), fontSize:sizeFont(30,20)}}
            />

  </UiEntity>

  )
}