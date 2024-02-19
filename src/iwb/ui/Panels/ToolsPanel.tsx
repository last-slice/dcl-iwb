import { Color4 } from "@dcl/sdk/math"
import ReactEcs, { UiEntity, Label } from "@dcl/sdk/react-ecs"
import { players, localUserId, setPlayMode, hasBuildPermissions, localPlayer } from "../../components/player/player"
import { atHQ, log } from "../../helpers/functions"
import { SCENE_MODES, SOUND_TYPES } from "../../helpers/types"
import { dimensions, calculateSquareImageDimensions, getImageAtlasMapping } from "../helpers"
import { uiModes, topTools, bottomTools, settingsIconData } from "../uiConfig"
import { connected } from "../../components/messaging"
import { playSound } from "../../components/sounds"

export let showToolsPanel = false

export function displayToolsPanel(value: boolean) {
    showToolsPanel = value
}

export function createToolsPanel() {
    return (
        <UiEntity
            key={"toolspanel"}
            uiTransform={{
                // display: checkModeAndPermissions(),
                display: connected ? 'flex' :'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: dimensions.width * .04,
                height: '90%',
                positionType: 'absolute',
                position: { right: 0, bottom: '3%' }
            }}
            // uiBackground={{ color: Color4.Red() }}
        >

        {/* settings icon */}
        <CreateToolIcon data={settingsIconData} rowNum={'settings-icon'} toggle={true} />

            {/* top tool container */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                alignSelf:'flex-start',
                width: '100%',
                height: '50%',
                margin:{bottom:"5%"}
            }}
            // uiBackground={{ color: Color4.Green() }}
        >

            {/* mode icon */}
            <UiEntity
            uiTransform={{
                display: 'flex',
                width: calculateSquareImageDimensions(4).width,
                height: calculateSquareImageDimensions(4).height,
                flexDirection:'row',
                margin: { top: '5', bottom: '5'},
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                src: players.has(localUserId) ? uiModes[players.get(localUserId)!.mode].atlas : ''
                },
                uvs: players.has(localUserId) ? getImageAtlasMapping(uiModes[players.get(localUserId)!.mode].uvs) : getImageAtlasMapping()
            }}
            onMouseDown={()=>{
                if(players.has(localUserId)){
                   let mode = players.get(localUserId)!.mode
                   if(mode == 0 && hasBuildPermissions()){
                    setPlayMode(localUserId, SCENE_MODES.BUILD_MODE)
                   }else{
                    setPlayMode(localUserId, SCENE_MODES.PLAYMODE)
                   }
                }
            }}
            />  

            {createTopToolIcons(topTools)}
        </UiEntity>

            {/* bottom tool container */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                width: '100%',
                height: '40%',
                margin:{top:"5%"},
                display:'flex'
            }}
            // uiBackground={{ color: Color4.Blue() }}
        >
            {/* {createBottomToolIcons(bottomTools)} */}
        </UiEntity>
        </UiEntity>
    )
}

function createTopToolIcons(data:any){
    const arr = []
    if(data.length === 0){
      arr.push(<CreateEmptyRow /> ) 
    }else{
        let count = 0
        for (let i = 0; i < data.length; i++) {
            arr.push(<CreateToolIcon data={data[i]} rowNum={count} /> ) 
            count++
        }
    }
    return arr
}

function createBottomToolIcons(data:any){
    const arr = []
    if(data.length === 0){
      arr.push(<CreateEmptyRow /> ) 
    }else{
        let count = 0
        for (let i = 0; i < data.length; i++) {
            arr.push(<CreateToolIcon data={data[i]} rowNum={count} toggle={true} /> ) 
            count++
        }
    }
    return arr
}

export function CreateEmptyRow(props: {}) {
    return (<UiEntity //cell wrapper
      uiTransform={{
        width: '100%',
        height: '100%',
        display: 'flex',
      }}
    >
      <Label
        value= {'Loading...'}
        fontSize={22}
        color = {Color4.Black()}
        textAlign= {'middle-center'}
        uiTransform={{
          width: `100%`,
          height: '100%',
        }}
      />
    </UiEntity>)
  }

function CreateToolIcon(data:any){

    let config = data.data
    return ( <UiEntity
    key={config.name}
    uiTransform={{
        display: getDisplay(config),
        width: calculateSquareImageDimensions(4).width,
        height: calculateSquareImageDimensions(4).height,
        flexDirection:'row',
        margin: { top: '5', bottom: '5'},
    }}
    uiBackground={{
        textureMode: 'stretch',
        texture: {
        src: config.atlas,
        },
        uvs: config.uvOverride ? config.uvOverride() : getImageAtlasMapping(config.enabled ? config.enabledUV : config.disabledUV)
    }}
    onMouseDown={()=>{
        if(data.toggle){
            log('need to toggle button state')
            // config.enabled = !config.enabled//
        }

        if(config.fn){
            config.fn()
        }
        playSound(SOUND_TYPES.WOOD_3)
    }}
    >     
    </UiEntity>  
    )
}

function getDisplay(config:any){
    switch(config.name){
        case 'Upload':
            return players.has(localUserId) && players.get(localUserId)!.mode === SCENE_MODES.BUILD_MODE && players.get(localUserId)!.dclData.hasConnectedWeb3 && players.get(localUserId)!.homeWorld ? 'flex' : 'none'

        case 'Settings':
            return 'flex'

        case 'SceneInfo':
            return players.has(localUserId) && players.get(localUserId)?.activeScene && players.get(localUserId)?.activeScene !== null && players.get(localUserId)?.mode === SCENE_MODES.BUILD_MODE ? 'flex' : 'none'

        default:
            return players.has(localUserId) && players.get(localUserId)!.mode === SCENE_MODES.BUILD_MODE && config.visible ? 'flex' : 'none'
    }
}

// function checkModeAndPermissions(){
//     let player = players.get(localUserId)
//     if(!atHQ() && localUserId && player!.mode !== SCENE_MODES.CREATE_SCENE_MODE){
//          if(player!.buildingAllowed.length > 0){
//             // console.log('player building parcels allowed', player.buildingAllowed)
//             if(player!.buildingAllowed.find((b:any)=> b.parcel === player!.currentParcel)){
//                 return "flex"
//             }else{
//                 return "none"
//             }
//          }else{
//             return "none"
//          }
//     }
//     else{
//         return "none"
//     }
// }