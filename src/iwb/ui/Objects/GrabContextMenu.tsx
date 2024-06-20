import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position,UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { InputAction, PointerEventType, Transform } from '@dcl/sdk/ecs'
import resources from '../../helpers/resources'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'
import { grabbedModifierType } from '../../systems/GrabChangeSystems'
import { selectedItem } from '../../modes/Build'
import { EDIT_MODES, EDIT_MODIFIERS } from '../../helpers/types'

let showHover = false
export function displayGrabContextMenu(value:boolean){
  showHover = value
}

export function createGrabContextMenu(){
  return(
    <UiEntity
    key={resources.slug + "grab::context::menu"}
    uiTransform={{
      width: calculateImageDimensions(15, getAspect(uiSizes.smallPill)).width,
      height:calculateImageDimensions(7, getAspect(uiSizes.smallPill)).height,
      display: showHover ? 'flex' : 'none',
      justifyContent:'center',
      flexDirection:'column',
      alignContent:'center',
      alignItems:'center',
      positionType:'absolute',
      position:{top:'2%', right:'20%'}
    }}
    uiBackground={{
      texture:{
          src: resources.textures.atlas2
      },
      textureMode: 'stretch',
      uvs:getImageAtlasMapping(uiSizes.smallPill)
    }}
  >

    {/* context row 1 */}
        <UiEntity
    uiTransform={{
      width: '90%',
      height: '15%',
      justifyContent:'center',
      flexDirection:'row',
      margin:{top:"1%", bottom:"1%"},
    }}
    uiText={{fontSize:sizeFont(25,20), value:"Grab Edit: " + (grabbedModifierType === 0 ? "Positon" : grabbedModifierType === 1 ? "Rotation" : "Scale")}}
      />
{/* 
<UiEntity
    uiTransform={{
      width: '90%',
      height: '15%',
      justifyContent:'center',
      flexDirection:'row',
      margin:{top:"1%", bottom:"1%"},
    }}
    uiText={{fontSize:sizeFont(25,20), value:"P: " + getTransform(EDIT_MODIFIERS.POSITION)}}
      />

<UiEntity
    uiTransform={{
      width: '90%',
      height: '15%',
      justifyContent:'center',
      flexDirection:'row',
      margin:{top:"1%", bottom:"1%"},
    }}
    uiText={{fontSize:sizeFont(25,20), value:"R: " + getTransform(EDIT_MODIFIERS.ROTATION)}}
      />

<UiEntity
    uiTransform={{
      width: '90%',
      height: '15%',
      justifyContent:'center',
      flexDirection:'row',
      margin:{top:"1%", bottom:"1%"},
    }}
    uiText={{fontSize:sizeFont(25,20), value:"S: "  + getTransform(EDIT_MODIFIERS.SCALE)}}
      /> */}

  </UiEntity>

  )
}

function getTransform(type:any){
    if(!selectedItem || !selectedItem.enabled || selectedItem.mode !== EDIT_MODES.GRAB){
        return ""
    }

    let transform = Transform.get(selectedItem.entity)
    console.log(transform)
    switch(type){
        case EDIT_MODIFIERS.POSITION:
            return "x: " + transform.position.x.toFixed(2), ", " + "y: " + transform.position.y.toFixed(2), ", " + "z: " + transform.position.z.toFixed(2)
        case EDIT_MODIFIERS.SCALE:
            return "x: " + transform.scale.x.toFixed(2), ", " + "y: " + transform.scale.y.toFixed(2), ", " + "z: " + transform.scale.z.toFixed(2)
        case EDIT_MODIFIERS.ROTATION:
            let rotation = Quaternion.toEulerAngles(transform.rotation)
            return "x: " + rotation.x.toFixed(2), ", " + "y: " + rotation.y.toFixed(2), ", " + "z: " + rotation.z.toFixed(2)
    }
    
}