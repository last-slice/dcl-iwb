import { Color4, Vector3 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position,UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { InputAction, PointerEventType } from '@dcl/sdk/ecs'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from './helpers'
import resources from '../helpers/resources'
import { uiSizes } from './uiConfig'
import { isPreview } from '../helpers/functions'
import { localPlayer } from '../components/player/player'
import { SCENE_MODES } from '../helpers/types'
import { realm } from '../components/scenes'
import { rotateUVs } from '../../ui_components/utilities'

let showView = true
export function displayIWBMap(value:boolean){
    showView = value
}

export function createIWBMap(){
  return(
    <UiEntity
    key={"iwbmap"}
    uiTransform={{
        width: calculateImageDimensions(12.5, getAspect(uiSizes.vertRectangle)).width,
        height: calculateImageDimensions(12.5,getAspect(uiSizes.vertRectangle)).height,
      display: showView ? 'flex' : 'none',
      justifyContent:'flex-start',
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
                width: '84%',
                height: '76%',
                positionType:'absolute',
                margin:{top:"4%"}
            }}
            >

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width:calculateSquareImageDimensions(3).width,
                height: calculateSquareImageDimensions(3).height,
                positionType:'absolute',
            }}
            uiBackground={{
              texture:{
                  src: "images/map_arrow.png"
              },
              textureMode: 'stretch',
              uvs:rotateUVs(localPlayer && localPlayer.rotation ? localPlayer.rotation : 0)
            }}
            />

            </UiEntity>

         


            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '84%',
                height: '76%',
                margin:{top:'4%'}
            }}
            />


          <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '86.5%',
                height: '20%',
                positionType:'absolute',
                position:{bottom:'5.5%'}
            }}
            uiBackground={{color:Color4.Black()}}
            >

            {/* left column info */}
          <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
                height: '100%',
            }}
            >

            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '50%',
            }}
            uiText={{value:"" + (localPlayer && realm.split(".")[0]), fontSize:sizeFont(20,15), color:Color4.White(), textAlign:'middle-left'}}            
            />

    <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '50%',
            }}
            uiText={{value:"" + (localPlayer && localPlayer.activeScene ? localPlayer.activeScene.n : "No Scene"), fontSize:sizeFont(20,15), color:Color4.White(), textAlign:'middle-left'}}            
            />

              </UiEntity>


            {/* right column info */}
              <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
                height: '100%',
            }}
            >

            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '50%',
            }}
            uiText={{value:"" + (localPlayer && localPlayer.mode === SCENE_MODES.PLAYMODE ? "Play Mode" : "Build Mode"), fontSize:sizeFont(20,15), color:Color4.White(), textAlign:'middle-center'}}            
            />

    <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '50%',
            }}
            uiText={{value:"" + (localPlayer && localPlayer.currentParcel), fontSize:sizeFont(20,15), color:Color4.White(), textAlign:'middle-center'}}            
            />

              </UiEntity>



            </UiEntity>

  </UiEntity>

  )
}