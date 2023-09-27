import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position,UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { utils } from '../helpers/libraries'
import { attemptParcelSelection } from '../components/hq'
import { dimensions } from './helpers'

export let showCreateScenePanel = true

export function displayCreateScenePanel(value:boolean){
    showCreateScenePanel = value//
}

export function createNewScenePanel(){
    return (
      <UiEntity
    key={"createscenepanel"}
    uiTransform={{
      display: showCreateScenePanel ? 'flex' :'none',
      flexDirection:'column',
      alignItems:'center',
      justifyContent:'center',
      width: dimensions.width * .1,
      height: dimensions.height * 0.15,
      positionType:'absolute',
      position:{left:'.5%',top:'25%'}
    }}
    uiBackground={{color:Color4.Blue()}}
    onMouseDown={()=>{
        utils.timers.setTimeout(()=>{
            attemptParcelSelection()
        }, 500)
    }}
  >

  </UiEntity>
    )
}