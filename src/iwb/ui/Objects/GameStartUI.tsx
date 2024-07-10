import { Color4 } from '@dcl/sdk/math'
import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
import { addLineBreak, calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import { setUIClicked } from '../ui'
import resources from '../../helpers/resources'
import { uiSizes } from '../uiConfig'
import { SERVER_MESSAGE_TYPES, Triggers } from '../../helpers/types'
import { sendServerMessage } from '../../components/Colyseus'
import { localPlayer } from '../../components/Player'

let showGameStart = false
let startGame:any

export function displayGameStartUI(value:boolean, game?:any){
    showGameStart = value

    if(game){
        startGame = game
    }
}

export function createGameStartUI(){
  return(
    <UiEntity
    key={resources.slug + "game::start::ui"}
    uiTransform={{
      width: '100%',
      height:'100%',
      justifyContent:'center',
      flexDirection:'column',
      alignContent:'center',
      alignItems:'center',
      positionType:'absolute',
      position:{top:0, right:0},
      display: showGameStart ? "flex" :"none"
    }}
  >

<UiEntity
    uiTransform={{
        width: calculateImageDimensions(50, getAspect(uiSizes.horizRectangle)).width,
        height: calculateImageDimensions(50, getAspect(uiSizes.horizRectangle)).height,
      justifyContent:'center',
      flexDirection:'column',
      alignContent:'center',
      alignItems:'center',
    }}
    uiBackground={{
        textureMode: 'stretch',
        texture: {
            src: 'assets/atlas2.png'
        },
        uvs: getImageAtlasMapping(uiSizes.horizRectangle)
    }}
  >

    <UiEntity
    uiTransform={{
      width: '100%',
      height:'100%',
      justifyContent:'center',
      flexDirection:'row',
      alignContent:'center',
      alignItems:'center',
    }}
    // uiBackground={{color:Color4.Yellow()}}
    >
        <UiEntity
        uiTransform={{
        width: '50%',
        height:'100%',
        justifyContent:'center',
        flexDirection:'column',
        alignContent:'center',
        alignItems:'center',
        }}
        // uiBackground={{color:Color4.Blue()}}
        >
        <UiEntity
        uiTransform={{
        width: calculateSquareImageDimensions(30).width,
        height:calculateSquareImageDimensions(30).height,
        justifyContent:'center',
        flexDirection:'column',
        alignContent:'center',
        alignItems:'center',
        margin:{left:"3%"}
        }}
        uiBackground={{color:Color4.White()}}
        />
        </UiEntity>

        <UiEntity
        uiTransform={{
        width: '50%',
        height:'100%',
        justifyContent:'flex-start',
        flexDirection:'column',
        alignContent:'center',
        alignItems:'center',
        }}
        // uiBackground={{color:Color4.Red()}}
        >
            <UiEntity
            uiTransform={{
            width: '100%',
            height:'30%',
            justifyContent:'center',
            flexDirection:'column',
            alignContent:'center',
            alignItems:'center',
            }}
            uiText={{value:"Start Game " + (startGame && startGame.name), fontSize:sizeFont(25,20)}}
            />

            <UiEntity
                uiTransform={{
                width: '90%',
                height:'30%',
                justifyContent:'center',
                flexDirection:'column',
                alignContent:'center',
                alignItems:'center',
                }}
                uiText={{value:"" + addLineBreak("" + (startGame && startGame.description), undefined, 50), fontSize:sizeFont(20,15), textAlign:'top-left'}}
                />

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(7, getAspect(uiSizes.buttonPillBlack)).width,
                height: calculateImageDimensions(7, getAspect(uiSizes.buttonPillBlack)).height,
                margin:'2%'
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            uiText={{
                value: "Start Game",
                fontSize: sizeFont(25, 15),
                color: Color4.White(),
                textAlign: 'middle-center'
            }}
            onMouseDown={() => {
                setUIClicked(true)
                console.log('on mouse down')

                displayGameStartUI(false)
                sendServerMessage(SERVER_MESSAGE_TYPES.START_GAME, {sceneId: startGame.id, entity:startGame.entity})

            }}
            onMouseUp={()=>{
                setUIClicked(false)
                console.log('on mouse up')
            }}
        />

    <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(7, getAspect(uiSizes.buttonPillBlack)).width,
            height: calculateImageDimensions(7, getAspect(uiSizes.buttonPillBlack)).height,
            margin:'2%'
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
        }}
        uiText={{
            value: "Cancel",
            fontSize: sizeFont(25, 15),
            color: Color4.White(),
            textAlign: 'middle-center'
        }}
        onMouseDown={() => {
            setUIClicked(true)
            displayGameStartUI(false)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
    />


        </UiEntity>

    </UiEntity>

  </UiEntity>


  </UiEntity>

  )
}

export function createEndGameButton(){
    return(
        <UiEntity
        key={resources.slug + "game::end::button::ui"}
        uiTransform={{
          width: '100%',
          height:'100%',
          justifyContent:'center',
          flexDirection:'column',
          alignContent:'center',
          alignItems:'center',
          positionType:'absolute',
          position:{top:0, right:0},
          display: localPlayer && localPlayer.playingGame ? "flex" :"none"
        }}
      >
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
            height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
            margin:'1%',
            positionType:'absolute',
            position:{left:'11%', top:'6%'}
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
        }}
        uiText={{
            value: "End Game",
            fontSize: sizeFont(25, 15),
            color: Color4.White(),
            textAlign: 'middle-center'
        }}
        onMouseDown={() => {
            setUIClicked(true)
            sendServerMessage(SERVER_MESSAGE_TYPES.END_GAME, {})
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
    />
        </UiEntity>
    )
}