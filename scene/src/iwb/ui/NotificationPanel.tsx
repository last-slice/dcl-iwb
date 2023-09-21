import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position,UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { dimensions } from './ui'
import { Color4 } from '@dcl/sdk/math'

export let showNotificationPanel = true

export function displayNotificationPanel(value:boolean){
    showNotificationPanel = value
}

export function createNotificationPanel(){
    return (
      <UiEntity
    key={"notificationpanel"}
    uiTransform={{
      display: showNotificationPanel ? 'flex' :'none',
      flexDirection:'column',
      alignItems:'center',
      justifyContent:'center',
      width: dimensions.width * .4,
      height: dimensions.height * .15,
      positionType:'absolute',
      position:{right:(dimensions.width - (dimensions.width * .4)) / 2,top:"1%"}
    }}
    uiBackground={{color:Color4.Red()}}
  >

  </UiEntity>
    )
}