import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position,UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { dimensions } from '../helpers'
import { utils } from '../../helpers/libraries'
import { sendServerMessage } from '../../components/messaging'
import { SERVER_MESSAGE_TYPES } from '../../helpers/types'
import { localUserId, players } from '../../components/player/player'
import { SmallOpaqueRectangle } from '../Objects/SmallOpaqueRectangle'

export let showCreateScenePanel = true

export function displayCreateScenePanel(value:boolean){
    showCreateScenePanel = value
}

export function createNewScenePanel(){
    return (

      <UiEntity
key={"createscenepanel"}
uiTransform={{
  display:'flex',
  // display: players.has(localUserId) && players.get(localUserId).mode === SCENE_MODES.CREATE_SCENE_MODE ? 'flex' :'none',
  flexDirection:'column',
  alignItems:'center',
  justifyContent:'center',
  width: dimensions.width * .2,
  height: dimensions.height * 0.4,
  positionType:'absolute',
  position:{right:'.5%',bottom:'1%'}
}}
uiBackground={{color:Color4.Blue()}}
onMouseDown={()=>{
    utils.timers.setTimeout(()=>{
      sendServerMessage(SERVER_MESSAGE_TYPES.SELECT_PARCEL, {player:localUserId, parcel:players.get(localUserId).currentParcel})
    }, 500)
}}
>

<SmallOpaqueRectangle
key={"createscenepanel"}
size={20}

/>

</UiEntity>
    )
}
