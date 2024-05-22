import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import resources from "../../helpers/resources"
import { playSound } from '@dcl-sdk/utils'
import { Color4 } from '@dcl/sdk/math'
import { SOUND_TYPES } from '../../helpers/types'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import { setUIClicked } from '../ui'
import { uiSizes } from '../uiConfig'

export function IWBButton(data:any){
    let button = data.button
    return(
        <UiEntity
      key={resources.slug + "-" + button.label + "-iwb-button"}
      uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: calculateImageDimensions(button.width ? button.width : 7, getAspect(uiSizes.buttonPillBlue)).width,
          height: calculateImageDimensions(button.height ? button.height : 7,getAspect(uiSizes.buttonPillBlue)).height,
          margin:{top:"1%", bottom:'1%'},
          positionType: button.positionType ? button.positionType : undefined,
          position: button.position ? button.position : undefined,
        //   display: getButtonDisplay(button.label)
      }}
      uiBackground={{
          textureMode: 'stretch',
          texture: {
              src: 'assets/atlas2.png'
          },
          uvs: getButtonState(data.buttons, button.label)
      }}
      onMouseDown={() => {
        setUIClicked(true)
        playSound(SOUND_TYPES.WOOD_3)
        button.func()
      }}
      onMouseUp={()=>{
        setUIClicked(false)
      }}
      uiText={{value: button.label, color:Color4.White(), fontSize:sizeFont(button.fontBigScreen ? button.fontBigScreen : 30,button.fontSmallScreen ? button.fontSmallScreen : 20)}}
      />
    )
}

function getButtonDisplay(button:string){
    return 'flex'
}
  
function getButtonState(buttons?:any[], button?:string){
    if(buttons){
        if(buttons.find((b:any)=> b.label === button).pressed){
        return getImageAtlasMapping(uiSizes.buttonPillBlue)
        }else{
            return getImageAtlasMapping(uiSizes.buttonPillBlack)
        }
    }else{
        return getImageAtlasMapping(uiSizes.buttonPillBlack)
    }
}