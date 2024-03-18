import { Color4, Vector3 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position,UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { InputAction, PointerEventType } from '@dcl/sdk/ecs'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from './helpers'
import resources from '../helpers/resources'
import { uiSizes } from './uiConfig'
import { isPreview } from '../helpers/functions'

let showView = false
export function displayIWBMap(value:boolean){
    showView = value
}

export function createIWBMap(){
  return(
    <UiEntity
    key={"iwbmap"}
    uiTransform={{
        width: calculateImageDimensions(11, getAspect(uiSizes.vertRectangle)).width,
        height: calculateImageDimensions(11,getAspect(uiSizes.vertRectangle)).height,
      display: showView ? 'flex' : 'none',
      justifyContent:'center',
      flexDirection:'column',
      alignContent:'center',
      alignItems:'center',
      positionType:'absolute',
      position:{top: isPreview ? '25%' : '5%', left:'-0.5%'}
    }}
    uiBackground={{
      texture:{
          src: resources.textures.atlas2
      },
      textureMode: 'stretch',
      uvs:getImageAtlasMapping(uiSizes.vertRectangle)
    }}
  >

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '80%',
            }}
            uiText={{value:"Map Coming soon", color:Color4.White(), textAlign:'middle-center'}}            
            />


<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '85%',
                height: '20%',
                positionType:'absolute',
                position:{bottom:'5.5%'}
            }}
            uiBackground={{color:Color4.Black()}}
            uiText={{value:"Play Mod3", fontSize:sizeFont(20,15), color:Color4.White(), textAlign:'middle-center'}}            
            />

  </UiEntity>

  )
}