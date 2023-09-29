import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position,UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { utils } from '../helpers/libraries'
import { dimensions } from './helpers'
import { sendServerMessage } from '../components/messaging'
import { SCENE_MODES, SERVER_MESSAGE_TYPES } from '../helpers/types'
import { localUserId, players } from '../components/player/player'

export let showCreateScenePanel = false

export function displayCreateScenePanel(value:boolean){
    showCreateScenePanel = value
}//

export function createNewScenePanel(){
    return (
      <UiEntity
    key={"createscenepanel"}
    uiTransform={{
      display: players.has(localUserId) && players.get(localUserId).mode === SCENE_MODES.CREATE_SCENE_MODE ? 'flex' :'none',
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
          sendServerMessage(SERVER_MESSAGE_TYPES.SELECT_PARCEL, {player:localUserId, parcel:players.get(localUserId).currentParcel})
        }, 500)
    }}
  >

  </UiEntity>
    )
}