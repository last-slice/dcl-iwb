import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position,UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { Transform, engine } from '@dcl/ecs'
import { objName } from './CatalogPanel'
import { dimensions } from './helpers'

export let showNotificationPanel = false

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
    uiBackground={{color: Color4.create(0.063, 0.118, 0.31, .5) }}
  >
      <Label
        onMouseDown={() => {console.log('Player Position clicked !')}}
        // value={`Shape: ${getShape()}`}
        value = {`Object: ${objName}`}
        fontSize={18}
        uiTransform={{ width: '100%', height: 30 } }
      />
      <Label
        onMouseDown={() => {console.log('Player Position clicked !')}}
        value={`Player: ${getPlayerPosition()}`}
        fontSize={18}
        uiTransform={{ width: '100%', height: 30 } }
      />

  </UiEntity>
    )
}

function getPlayerPosition() {
  const playerPosition = Transform.getOrNull(engine.PlayerEntity)
  if (!playerPosition) return ' no data yet'
  const { x, y, z } = playerPosition.position
  return `{X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}, z: ${z.toFixed(2)} }`
}

// function getShape(){
//   if(sphereSelect){
//     return 'Sphere'
//   }
//   if(triSelect){
//     return 'Cylinder'
//   }
//   if(cubeSelect){
//     return 'Cube'
//   }
//   if(customSelect){
//     return 'Custom Model'
//   }
//   else{
//     return 'No Object Selected'
//   }

// }