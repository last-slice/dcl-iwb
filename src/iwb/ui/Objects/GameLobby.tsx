import { Color4, Vector3 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position,UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { InputAction, PointerEventType } from '@dcl/sdk/ecs'
import resources from '../../helpers/resources'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'
import { localPlayer, localUserId } from '../../components/Player'
import { PLAYER_GAME_STATUSES } from '../../helpers/types'

let show = true
let gameData:any

export function displayGameLobby(value:boolean){
    show = value
}

export function updateLobbyPanel(data:any){
    gameData = data
    console.log('data is', gameData)
}

export function createGameLobbyPanel(){
  return(
    <UiEntity
    key={resources.slug + "iwb::game::lobby"}
    uiTransform={{
      width: calculateImageDimensions(15, getAspect(uiSizes.smallPill)).width,
    //   height:'auto',
      height:calculateImageDimensions(15, getAspect(uiSizes.smallPill)).height,
      display: getPlayerStatus() ? 'flex' : 'none',
      justifyContent:'center',
      flexDirection:'column',
      alignContent:'center',
      alignItems:'center',
      positionType:'absolute',
      position:{top:'1%', right:'5%'}
    }}
    uiBackground={{
      texture:{
          src: resources.textures.atlas2
      },
      textureMode: 'stretch',
      uvs:getImageAtlasMapping(uiSizes.smallPill)
    }}
  >

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignContent:'center',
        width: '80%',
        height: '80%',
    }}
    // uiBackground={{color:Color4.Blue()}}
    >

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent:'center',
                width: '100%',
                height: '10%',
                margin:{bottom:'4%'}
            }}
                uiText={{value:"Game Lobby", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
            />

            {/* {localPlayer.playingGame && gameData && gameData.} */}
            {getPlayerStatus() && gameData && generateLobbyRows()}

    </UiEntity>

  </UiEntity>
  )
}

function generateLobbyRows(){
    let arr:any[] = []
    let count = 0
    gameData && gameData.teams.forEach((team:any, i:number)=>{
        
        arr.push(
            <UiEntity
            key={resources.slug + "gaming::lobby::row" + count}
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                height: '10%',
                margin:{top:"2%", bottom:"2%"}
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Team " + team.id + (team.mates.includes(localUserId) ? " (You)" : "") + ' - ' +  team.mates.length , textAlign:'middle-left', fontSize:sizeFont(20,15)}}
            />
        )
        count++
    })
    return arr
}

function getPlayerStatus(){
    return localPlayer && (localPlayer.gameStatus === PLAYER_GAME_STATUSES.WAITING || localPlayer.gameStatus === PLAYER_GAME_STATUSES.LOBBY)
}