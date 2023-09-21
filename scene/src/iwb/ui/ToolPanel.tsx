import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position,UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { dimensions } from './ui'
import { Color4 } from '@dcl/sdk/math'

export let showToolPanel = true

export function displayToolPanel(value:boolean){
    showToolPanel = value
}

export function createToolPanel(){
    return (
      <UiEntity
    key={"toolpanel"}
    uiTransform={{
      display: showToolPanel ? 'flex' :'none',
      flexDirection:'column',
      alignItems:'center',
      justifyContent:'center',
      width: dimensions.width * .5,
      height: dimensions.height * .1,
      positionType:'absolute',
      position:{right:(dimensions.width - (dimensions.width * .5)) / 2,bottom:"1%"}
    }}
    uiBackground={{color:Color4.Red()}}
  >

  </UiEntity>
    )
}