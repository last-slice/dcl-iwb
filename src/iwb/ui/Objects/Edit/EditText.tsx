
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import resources, { colorsLabels, colors } from '../../../helpers/resources'
import { COMPONENT_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
import { sizeFont } from '../../helpers'
import { visibleComponent } from '../EditAssetPanel'
import { NftShape, engine } from '@dcl/sdk/ecs'

export let fontStyles:string[] = [
    "Sans Serif",
    "Serif",
    "Monospace"
]

let textLabelAlignment:string[] = [
    "Top Left",
    "Top Center",
    "Top Right",
    "Middle Left",
    "Middle Center",
    "Middle Right",
    "Bottom Left",
    "Bottom Center",
    "Bottom Right",
]

let textAlignment:string[] = [
    'top-left' , 'top-center' , 'top-right' , 'middle-left' , 'middle-center' , 'middle-right' , 'bottom-left' , 'bottom-center' , 'bottom-right'
]

export function loadCurrentTextData(){

}


export function EditText() {
    return (
        <UiEntity
            key={resources.slug + "edittextComponentPanel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.TEXT_COMPONENT ? 'flex' : 'none',
            }}
        >

     
        </UiEntity>
    )
}

function getText(){
    if(selectedItem && selectedItem.enabled){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(scene){
            let itemInfo = scene[COMPONENT_TYPES.TEXT_COMPONENT].get(selectedItem.aid)
            if(itemInfo){
                return itemInfo.text
            }
            return ""
        }
        return ""
    }
    return ""
}

function getFontSize(){
    if(selectedItem && selectedItem.enabled){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(scene){
            let itemInfo = scene[COMPONENT_TYPES.TEXT_COMPONENT].get(selectedItem.aid)
            if(itemInfo){
                return itemInfo.fontSize
            }
            return ""
        }
        return ""
    }
    return ""
}

function getFontStyle(){
    if(selectedItem && selectedItem.enabled){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(scene){
            let itemInfo = scene[COMPONENT_TYPES.TEXT_COMPONENT].get(selectedItem.aid)
            if(itemInfo){
               return fontStyles.findIndex((c)=> c === itemInfo.font)
            }
            return 0
        }
        return 0
    }
    return 0
}

function getTextAlign(){
    if(selectedItem && selectedItem.enabled){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(scene){
            let itemInfo = scene[COMPONENT_TYPES.TEXT_COMPONENT].get(selectedItem.aid)
            if(itemInfo){
                return itemInfo.textAlign
            }
            return 0
        }
        return 0
    }
    return 0
}

function getTextColor(){
    if(selectedItem && selectedItem.enabled){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(scene){
            let itemInfo = scene[COMPONENT_TYPES.TEXT_COMPONENT].get(selectedItem.aid)
            if(itemInfo){
                return colors.findIndex((ta)=> ta.r === itemInfo.color.r && ta.g === itemInfo.color.g && ta.b === itemInfo.color.b)
            }
            return 0
        }
        return 0
    }
    return 0
}

function selectColor(index: number) {
    if(index !== getTextColor()){
        updateText("color", colors[index])
    }    
}

function selectFont(index: number) {
    if(index !== getFontStyle()){
        updateText("font", index)
    }    
}

function selectTextAlign(index: number) {
    if(index !== getTextAlign()){
        updateText("textAlign", index)
    }  
}

function updateText(type:string, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
        {
            component:COMPONENT_TYPES.TEXT_COMPONENT, 
            aid:selectedItem.aid, sceneId:selectedItem.sceneId,
            [type]:value
        }
    )
}