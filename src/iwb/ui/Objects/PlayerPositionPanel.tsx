import { Color4, Vector3 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position,UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { rotateUVs } from '../../../ui_components/utilities'
import { playerMode, realm } from '../../components/Config'
import { localPlayer } from '../../components/Player'
import { isPreview } from '../../helpers/functions'
import resources from '../../helpers/resources'
import { SCENE_MODES, IWBScene } from '../../helpers/types'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont, calculateSquareImageDimensions } from '../helpers'
import { uiSizes } from '../uiConfig'
import { colyseusRoom } from '../../components/Colyseus'
import { setUIClicked } from '../ui'
import { displayExpandedMap, expandedMapshow } from './ExpandedMapView'
import { Transform } from '@dcl/sdk/ecs'
import { engine } from '@dcl/sdk/ecs'

let showView = false

export function displayPlayerPositionPanel(value:boolean){
    showView = value
}

export function createPlayerPositionPanel(){
    let playerPosition = Vector3.One()
    
    if(Transform.has(engine.PlayerEntity)){
        playerPosition = Transform.get(engine.PlayerEntity).position
    }

    if(localPlayer && localPlayer.activeScene){
        let scene = colyseusRoom.state.scenes.get(localPlayer.activeScene.id)
        if(scene){
            let scenePosition = Transform.get(scene.parentEntity).position
            playerPosition = Vector3.subtract(playerPosition, scenePosition)
        }
    }
  return(
    <UiEntity
    key={"" + resources.slug + "player-position-panel"}
    uiTransform={{
        width: calculateImageDimensions(10.5, getAspect(uiSizes.horizRectangle)).width,
        height: calculateImageDimensions(3,getAspect(uiSizes.horizRectangle)).height,
      display: showView ? 'flex' : 'none',
      justifyContent:'flex-start',
      flexDirection:'column',
      alignContent:'center',
      alignItems:'center',
      positionType:'absolute',
      position:{top: isPreview ? '67%' : '27%', left:'0.5%'}
    }}
    uiBackground={{
      texture:{
          src: resources.textures.atlas2
      },
      textureMode: 'stretch',
      uvs:getImageAtlasMapping(uiSizes.horizRectangle)
    }}
  >
          <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
            }}
            uiText={{
                textWrap:'nowrap',
                textAlign: 'middle-center',
                value: `{x:${playerPosition.x.toFixed(2)}, y:${playerPosition.y.toFixed(2)}, z:${playerPosition.z.toFixed(2)}}`,
                fontSize: sizeFont(25,20),
                color: Color4.White(),
            }}
            />

  </UiEntity>
  )
}