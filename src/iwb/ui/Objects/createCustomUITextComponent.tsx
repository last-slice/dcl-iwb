import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position,UiBackgroundProps } from '@dcl/sdk/react-ecs'
import resources from '../../helpers/resources'
import { UiTexts } from '../../components/UIText'
import { CustomUIText, UISpriteText } from '../../../ui_components/UISpriteText'
import { localPlayer } from '../../components/Player'
import { colyseusRoom } from '../../components/Colyseus'
import { COMPONENT_TYPES } from '../../helpers/types'

export function createCustomUITextComponent(){
  return(
    <UiEntity
    key={resources.slug + "uitext::component::ui"}
    uiTransform={{
      width: '100%',
      height:'100%',
      justifyContent:'center',
      flexDirection:'column',
      alignContent:'center',
      alignItems:'center',
      positionType:'absolute',
      position:{top:0, right:0}
    }}
  >

        {localPlayer && localPlayer.activeScene && generateUITextComponents()}

  </UiEntity>

  )
}

function generateUITextComponents(){
    let scene = colyseusRoom.state.scenes.get(localPlayer.activeScene.id)
    if(!scene){
        return []
    }

    let arr:any[] = []

    scene[COMPONENT_TYPES.UI_TEXT_COMPONENT].forEach((component:any, aid:string)=>{
        let uiText = UiTexts.get(aid)
        if(uiText){
            // uiText.setText(component.text)
            uiText.visible ? uiText.show() : uiText.hide()
            arr.push(<UISpriteText customText={uiText} />)
        }
    })
    return arr
}
