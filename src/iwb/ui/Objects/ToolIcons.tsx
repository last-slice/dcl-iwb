import { Color4 } from "@dcl/sdk/math"
import ReactEcs, { UiEntity, Label } from "@dcl/sdk/react-ecs"
import resources from "../../helpers/resources"
import { playSound } from "@dcl-sdk/utils"
import { connected } from "../../components/Colyseus"
import { localPlayer, localUserId, hasBuildPermissions, setPlayMode, isLocalPlayer } from "../../components/Player"
import { EDIT_MODES, SCENE_MODES, SOUND_TYPES } from "../../helpers/types"
import { selectedItem } from "../../modes/Build"
import { dimensions, calculateSquareImageDimensions, getImageAtlasMapping, uiSizer } from "../helpers"
import { island, playerMode } from "../../components/Config"
import { settingsIconData, topTools, uiModes, uiSizes } from "../uiConfig"
import { setUIClicked } from "../ui"
import { showStore } from "./StoreView"
import { displayQuestPanel, showQuestView } from "./QuestPanel"

export let showToolsPanel = false

export function displayToolsPanel(value: boolean) {
    showToolsPanel = value
}

export function createToolsPanel() {
    return (
        <UiEntity
            key={"" + resources.slug + "tools-panel"}
            uiTransform={{
                // display: checkModeAndPermissions(),
                display: connected ? 'flex' :'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
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
                margin:{bottom:"5%"},
                display: island === "world" ? "flex" : "none"
            }}
            // uiBackground={{ color: Color4.Green() }}//
        >

            {/* mode icon */}
            <UiEntity
            uiTransform={{
                display: localPlayer && (localPlayer.canBuild || localPlayer.worldPermissions) ? "flex" : "none",
                width: calculateSquareImageDimensions(4).width,
                height: calculateSquareImageDimensions(4).height,
                flexDirection:'row',
                margin: { top: '5', bottom: '5'},
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                src: isLocalPlayer(localUserId) ? uiModes[playerMode].atlas : ''
                },
                uvs: isLocalPlayer(localUserId) ? getImageAtlasMapping(uiModes[playerMode].uvs) : getImageAtlasMapping()
            }}
            onMouseDown={()=>{
                setUIClicked(true)
                if(selectedItem && selectedItem.enabled || showStore){
                    return
                }
                
                if(isLocalPlayer(localUserId)){
                   if(playerMode === SCENE_MODES.PLAYMODE && hasBuildPermissions()){
                    setPlayMode(localUserId, SCENE_MODES.BUILD_MODE)
                   }else{
                    setPlayMode(localUserId, SCENE_MODES.PLAYMODE)
                   }
                }
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
            />  

{/* <UiEntity
            uiTransform={{
                display: localPlayer && (playerMode === SCENE_MODES.PLAYMODE) ? "flex" : "none",
                width: calculateSquareImageDimensions(4).width,
                height: calculateSquareImageDimensions(4).height,
                flexDirection:'row',
                margin: { top: '5', bottom: '5'},
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src:resources.textures.atlas2
                },
                uvs: getImageAtlasMapping(uiSizes.trophyIcon)//
            }}
            onMouseDown={()=>{
                setUIClicked(true)
                displayQuestPanel(!showQuestView)
                setUIClicked(false)
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
            />   */}

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
        setUIClicked(true)
        if(config.always){}
        else{
            if(selectedItem && selectedItem.enabled || showStore){
                return
            }
        }

        if(config.toggle){
            config.enabled = !config.enabled
        }

        if(config.fn){
            config.fn()
        }
        playSound(SOUND_TYPES.WOOD_3)
    }}
    onMouseUp={()=>{
        setUIClicked(false)
    }}
    >     
    </UiEntity>  
    )
}

function getDisplay(config:any){
    switch(config.name){
        case 'Upload':
            return isLocalPlayer(localUserId) && playerMode === SCENE_MODES.BUILD_MODE && !localPlayer.dclData.isGuest && localPlayer.homeWorld ? 'flex' : 'none'
 
        case 'Settings':
            return 'flex'

        case 'SceneInfo':
            return isLocalPlayer(localUserId) && localPlayer && localPlayer.activeScene !== null && playerMode === SCENE_MODES.BUILD_MODE ? 'flex' : 'none'

        default:
            return isLocalPlayer(localUserId) && playerMode === SCENE_MODES.BUILD_MODE && config.visible ? 'flex' : 'none'
    }
}