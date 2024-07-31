import { Color4, Vector3 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position,UiBackgroundProps } from '@dcl/sdk/react-ecs'
import resources from '../../helpers/resources'
import { cooldownStart } from '../../components/Game'
import { sizeFont } from '../helpers'

let show = false

export function displayCooldown(value:boolean){
    show = value
}


export function createCooldownUI(){
  return (
    <UiEntity key={resources.slug + "game::cooldown::ui"}
      uiTransform={{
        width: '100%',
        height: '100%',
        display: show ? 'flex' : 'none',
        justifyContent:'center',
        flexDirection:'column',
        alignContent:'center',
        positionType:'absolute'
      }}
    //   uiBackground={{color:Color4.Red()}}
    >

<UiEntity
      uiTransform={{
        width: '10%',
        height: '10%',
        display: 'flex',
        alignSelf:'center',
        margin:{bottom:'5%'}
      }}
      uiText={{value:"Cooldown\n" + cooldownStart.toFixed(1), fontSize:sizeFont(35,25), }}
      />

    </UiEntity>
  )
  }