import { Color4 } from '@dcl/sdk/math'
import ReactEcs, {Dropdown, Input, UiBackgroundProps, UiEntity, UiLabelProps} from '@dcl/sdk/react-ecs'
import { addLineBreak, calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import { setUIClicked } from '../ui'
import resources from '../../helpers/resources'
import { uiSizes } from '../uiConfig'
import { GAME_TYPES, PLAYER_GAME_STATUSES, SERVER_MESSAGE_TYPES, Triggers } from '../../helpers/types'
import { sendServerMessage } from '../../components/Colyseus'
import { localPlayer } from '../../components/Player'

let showGameStart = false
let showLoadingScreen = false
let showBackground = false
let startGame:any
let loadingScreen:any
let loadingTime:number = 0

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
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: '' + (startGame ? startGame.image : "")
            },
            // uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
        }}
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
        // uiBackground={{color:Color4.Red()}}//
        >
            <UiEntity
            uiTransform={{
            width: '100%',
            height:'10%',
            justifyContent:'center',
            flexDirection:'column',
            alignContent:'center',
            alignItems:'center',
            margin:{top:"10%"}
            }}
            uiText={{value:"Start Game " + (startGame && startGame.name), fontSize:sizeFont(45,20), textAlign:'middle-left'}}
            />

                <UiEntity
                uiTransform={{
                width: '90%',
                height:'10%',
                justifyContent:'center',
                flexDirection:'column',
                alignContent:'center',
                alignItems:'center',
                }}
                uiText={{value:"Type: " + (startGame && startGame.type), fontSize:sizeFont(30,15), textAlign:'top-left'}}
                />

                {
                    startGame && startGame.premiumAccessType >= 0 &&
                <UiEntity
                        uiTransform={{
                        width: '90%',
                        height:'10%',
                        justifyContent:'center',
                        flexDirection:'column',
                        alignContent:'center',
                        alignItems:'center',
                        }}
                        uiText={{value:"Restrictions: " + getRestrictions(), fontSize:sizeFont(30,15), textAlign:'top-left'}}
                        />
                }



            <UiEntity
                uiTransform={{
                width: '90%',
                height:'20%',
                justifyContent:'center',
                flexDirection:'column',
                alignContent:'center',
                alignItems:'center',
                }}
                uiText={{value:"" + (startGame && startGame.description), fontSize:sizeFont(30,15), textAlign:'top-left'}}
                />

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(7, getAspect(uiSizes.buttonPillBlack)).width,
                height: calculateImageDimensions(7, getAspect(uiSizes.buttonPillBlack)).height,
                margin:'2%',
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            uiText={{
                value: "" + (!startGame ? "none" : startGame.type === GAME_TYPES.SOLO ? "Start Game" : "Join Lobby"),
                fontSize: sizeFont(25, 15),
                color: Color4.White(),
                textAlign: 'middle-center'
            }}
            onMouseDown={() => {
                setUIClicked(true)
                displayGameStartUI(false)
                sendServerMessage(SERVER_MESSAGE_TYPES.START_GAME, {sceneId: startGame.id, entity:startGame.entity})
                setUIClicked(false)
            }}
            onMouseUp={()=>{
                setUIClicked(false)
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
          display: localPlayer && localPlayer.gameStatus === PLAYER_GAME_STATUSES.PLAYING ? "flex" :"none"
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
            position:{right:'5%', top:'3%'}
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

export function updateLoadingTimer(time:number){
    loadingTime = time
    console.log("loading time is now", loadingTime)
}

export function displayLoadingScreen(value:boolean, level?:any){
    loadingScreen = level

    showLoadingScreen = value

    if(!level){
        loadingScreen = undefined
    }   

    // if(level && level.loadingScreen){
    //     showBackground = true
    // }else{
    //     showBackground = false
    // }
}

export function createLoadingScreen(){
    return(
        <UiEntity
        key={resources.slug + "game::loading::ui"}
        uiTransform={{
          width: '100%',
          height:'100%',
          justifyContent:'center',
          flexDirection:'column',
          alignContent:'center',
          alignItems:'center',
          positionType:'absolute',
          position:{top:0, right:0},
          display: showLoadingScreen ? "flex" :"none"
        }}
      >
        <UiEntity
        uiTransform={{
          width: '100%',
          height:'100%',
          justifyContent:'center',
          flexDirection:'column',
          alignContent:'center',
          alignItems:'center',
          positionType:'absolute',
          position:{left:0, top:0},
        }}
        uiBackground={getBackgroundType()}
      ></UiEntity>

<UiEntity
        uiTransform={{
          width: '100%',
          height:'100%',
          justifyContent:'center',
          flexDirection:'column',
          alignContent:'center',
          alignItems:'center',
        }}
        uiText={{value: "Loading Level\n" + (loadingTime), textAlign:'middle-center', textWrap:'nowrap', color:Color4.White(), fontSize:sizeFont(60,30)}}
      ></UiEntity>

        </UiEntity>
    )
}

function getBackgroundType(){
    let props:UiBackgroundProps = {}
    if(loadingScreen && loadingScreen.loadingType === 1){
        props.textureMode = 'stretch'
        props.texture = {src:"" + (loadingScreen && loadingScreen.loadingScreen)}
    }else{
        props.color = Color4.Black()
    }
    return props
}

// function getLoadingText(){
//     let props:UiLabelProps = {value:"", fontSize:sizeFont(40,30)}
//     if(loadingScreen && loadingScreen.loadingType === 1){
//         props.value = ""
//     }else{
//         props.value = "Loading Level..." + 
//     }
//     return props
// }



function getRestrictions(){
    switch(startGame.premiumAccessType){
        case 0:
            return "Requires NFT"

        case 1:
            return "Requires Wearing an Item"

        case 2:
            return "Daily play"
    }
}