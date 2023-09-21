import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position,UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { dimensions } from './ui'
import { Color4 } from '@dcl/sdk/math'

export let showCatalogPanel = true

export function displayCatalogPanel(value:boolean){
    showCatalogPanel = value
}

export function createCatalogPanel(){
    return (
      <UiEntity
    key={"catalogpanel"}
    uiTransform={{
      display: showCatalogPanel ? 'flex' :'none',
      flexDirection:'column',
      alignItems:'center',
      justifyContent:'center',
      width: dimensions.width * .15,
      height: '100%',
      positionType:'absolute',
      position:{right:0,top:0}
    }}
    uiBackground={{color:Color4.Red()}}
  >

  </UiEntity>
    )
}