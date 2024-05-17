import * as utils from '@dcl-sdk/utils'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position,UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { InputAction, MeshCollider, MeshRenderer, Texture, Transform, engine, pointerEventsSystem } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import { Actions, NOTIFICATION_DETAIL, NOTIFICATION_TYPES, SOUND_TYPES } from '../../helpers/types'
import { log } from '../../helpers/functions'
import resources from '../../helpers/resources'
import { calculateImageDimensions, dimensions, getImageAtlasMapping, addLineBreak, sizeFont, calculateSquareImageDimensions, getAspect } from '../helpers'
import { playSound } from '../../components/sounds'
import { localPlayer, settings } from '../../components/player/player'
import { uiSizes } from '../uiConfig'
import { findAndRunAction } from '../../components/modes/play/actions'

let show = false

let currentDialog:any = {
    index:0,
    name:"",
    dialogs:[
        {text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
        buttons:[{label:"Test Button", action: "aid"}]
    }
    ]
}

export function showDialogPanel(value:boolean, aid?:string){
    if(value){
        let sceneItem = localPlayer.activeScene?.ass.find((asset:any)=> asset.aid === aid)
        if(sceneItem && sceneItem.dialComp && sceneItem.dialComp.dialogs.length > 0){
            let dialComp = sceneItem.dialComp
            currentDialog.dialogs = [...dialComp.dialogs]
            currentDialog.index = dialComp.i
            show = value
        }else{
            show = false
        }
    }else{
        show = value
        resetDialog()
    }
}

export function resetDialog(){
    currentDialog.index = 0
    currentDialog.dialogs.length = 0
}

export function advanceDialog(){
    if(currentDialog.index + 1 > currentDialog.dialogs.length - 1){
        showDialogPanel(false)
    }else{
        currentDialog.index += 1
    }
}

export function createDialogPanel(){
    return (
      <UiEntity key={"iwbdialogpanel"}
        uiTransform={{
          width: calculateImageDimensions(42, 824/263).width,
          height: calculateImageDimensions(42, 824/263).height,
          display: show ? 'flex' : 'none',
          justifyContent:'center',
          flexDirection:'column',
          alignItems:'center',
          alignContent:'center',
          positionType:'absolute',
          position:{left:(dimensions.width - calculateImageDimensions(42, 824/263).width) / 2, bottom:'10%'}
        }}
        uiBackground={{
          texture:{
              src:resources.textures.atlas2
          },
          textureMode: 'stretch',
          uvs:getImageAtlasMapping({
            atlasHeight:1024,
            atlasWidth:1024,
            sourceTop:0,
            sourceLeft:0,
            sourceWidth:824,
            sourceHeight:263
        })
        }}
        onMouseDown={()=>{
            advanceDialog()
        }}
      >

        {/* name text */}
        <UiEntity
        uiTransform={{
          width: '90%',
          height: '10%',
          justifyContent:'center',
          flexDirection:'column',
          alignItems:'center',
          alignContent:'center',
          margin:{top:"2%"},
          display: currentDialog && currentDialog.dialogs.length > 0 && currentDialog.dialogs[currentDialog.index].name ? "flex" : "none"
        }}
        // uiBackground={{color:Color4.Red()}}
        uiText={{value:"" + (currentDialog && currentDialog.dialogs.length > 0 && currentDialog.dialogs[currentDialog.index].name), fontSize:sizeFont(20,15), color:Color4.White(), textAlign:'middle-left'}}
        />

        {/* dialog text */}
        <UiEntity
        uiTransform={{
          width: '90%',
          height: 'auto',
          justifyContent:'flex-start',
          flexDirection:'column',
        }}
        // uiBackground={{color:Color4.Green()}}
            uiText={{value:addLineBreak("" + (currentDialog && currentDialog.dialogs.length > 0 && currentDialog.dialogs[currentDialog.index].text), undefined, 80), fontSize:sizeFont(20,15), color:Color4.White(), textAlign:'top-left'}}
        />

        <UiEntity
        uiTransform={{
          width: '90%',
          height: '20%',
          justifyContent:'center',
          flexDirection:'row',
          display:'flex'
        }}
        >
            {generateButtons()}
        </UiEntity>

</UiEntity>

    )
}

function generateButtons(){
    let arr:any[] = []
    let count = 0
    if(currentDialog.dialogs.length > 0 && currentDialog.dialogs[currentDialog.index].buttons){
        currentDialog.dialogs[currentDialog.index].buttons.forEach((button:any)=>{
            arr.push(<DialogButton button={button} count={count} />)
        })
    }
    return arr
}

function DialogButton(data:any){
    let info = data.button
    let count = data.count
    return(
        <UiEntity
        key={"dialog-button-" + count}
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(7, getAspect(uiSizes.buttonPillBlack)).width,
        height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
            margin: {left: "1%", right: "1%"}
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
        }}
        uiText={{value: "" + (info.label), fontSize: sizeFont(20, 16)}}
        onMouseDown={() => {
            advanceDialog()
            if(info.actions){
                info.actions.forEach((action:string)=>{
                    findAndRunAction(action)
                })
            }
        }}
    />
    )
}