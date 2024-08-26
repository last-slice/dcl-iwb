
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import resources, { colorsLabels, colors } from '../../../helpers/resources'
import { COMPONENT_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { sceneEdit, selectedItem } from '../../../modes/Build'
import { calculateSquareImageDimensions, getImageAtlasMapping, sizeFont } from '../../helpers'
import { visibleComponent } from '../EditAssetPanel'
import { ComponentType, NftShape, engine } from '@dcl/sdk/ecs'
import { localPlayer } from '../../../components/Player'
import { uiSizes } from '../../uiConfig'
import { getOnPlay } from './EditMeshRender'

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
            key={resources.slug + "edit::text:shape::panel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.TEXT_COMPONENT ? 'flex' : 'none',
            }}
        >

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            margin:{bottom:'1%'}
        }}
        uiText={{textWrap:'nowrap', value:"Edit Text Shape", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
        />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
        }}
    >
        <Input
            onChange={(value) => {
                updateText("data","text", value.trim())
            }}
            onSubmit={(value) => {
                updateText("data","text", value.trim())
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'enter text'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
            ></Input>
        </UiEntity>

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            margin:{bottom:'1%'}
        }}
        uiText={{textWrap:'nowrap', value:"Font Size", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
        />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
        }}
    >
        <Input
            onChange={(value) => {
                if(!isNaN(parseFloat(value.trim()))){
                    updateText("data","fontSize", parseFloat(value.trim()))
                }
            }}
            onSubmit={(value) => {
                if(!isNaN(parseFloat(value.trim()))){
                    updateText("data","fontSize", parseFloat(value.trim()))
                }
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'enter size (number)'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
            ></Input>
        </UiEntity>

        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
        >

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '70%',
                height: '100%',
            }}
        uiText={{value:"Show On Play", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30%',
                height: '100%',
            }}
        >

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateSquareImageDimensions(4).width,
                height: calculateSquareImageDimensions(4).height,
                margin:{top:"1%", bottom:'1%'},
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: selectedItem && selectedItem.enabled && getOnPlay(localPlayer.activeScene, COMPONENT_TYPES.TEXT_COMPONENT ,selectedItem.aid) ? getImageAtlasMapping(uiSizes.toggleOnTrans) : getImageAtlasMapping(uiSizes.toggleOffTrans)
            }}
            onMouseDown={() => {
                sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
                    {
                        component:COMPONENT_TYPES.TEXT_COMPONENT,
                        aid:selectedItem.aid, 
                        sceneId:selectedItem.sceneId,
                        onPlay: !getOnPlay(localPlayer.activeScene, COMPONENT_TYPES.TEXT_COMPONENT ,selectedItem.aid)
                    }
                )

            }}
            />
        </UiEntity>


        </UiEntity>

         {/* albedo color row */}
         <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
            }}
            >

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '15%',
                    margin:{bottom:'3%', top:'2%'}
                }}
            uiText={{value:"Text Color", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
            />

            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '70%',
                }}
            >
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '25%',
                    height: '100%',
                }}
            >

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '25%',
                    margin:{bottom:"5%"}
                }}
            uiText={{value:"r", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
            />

            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignContent: 'center',
                    width: '100%',
                    height: '70%',
                }}
                >
                <Input
                    onSubmit={(value) => {
                        validateColor('r', value.trim())
                    }}
                    onChange={(value) => {
                        validateColor('r', value.trim())
                    }}
                    fontSize={sizeFont(20, 15)}
                    placeholder={'' + (sceneEdit && visibleComponent === COMPONENT_TYPES.TEXT_COMPONENT ? sceneEdit[COMPONENT_TYPES.TEXT_COMPONENT].get(selectedItem.aid).color.r : "")}
                    placeholderColor={Color4.White()}
                    uiTransform={{
                        width: '100%',
                        height: '100%',
                    }}
                    color={Color4.White()}
                />
        </UiEntity>

            </UiEntity>
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '25%',
                    height: '100%',
                }}
            >

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '25%',
                    margin:{bottom:"5%"}
                }}
            uiText={{value:"g", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
            />

            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignContent: 'center',
                    width: '100%',
                    height: '70%',
                }}
                >
                <Input
                    onSubmit={(value) => {
                        validateColor('g', value.trim())
                    }}
                    onChange={(value) => {
                        validateColor('g', value.trim())
                    }}
                    fontSize={sizeFont(20, 15)}
                    placeholder={'' + (sceneEdit && visibleComponent === COMPONENT_TYPES.TEXT_COMPONENT ? sceneEdit[COMPONENT_TYPES.TEXT_COMPONENT].get(selectedItem.aid).color.g : "")}
                    placeholderColor={Color4.White()}
                    uiTransform={{
                        width: '100%',
                        height: '100%',
                    }}
                    color={Color4.White()}
                />
        </UiEntity>

            </UiEntity>
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '25%',
                    height: '100%',
                }}
            >

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '25%',
                    margin:{bottom:"5%"}
                }}
            uiText={{value:"b", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
            />

            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignContent: 'center',
                    width: '100%',
                    height: '70%',
                }}
                >
                <Input
                    onSubmit={(value) => {
                        validateColor('b', value.trim())
                    }}
                    onChange={(value) => {
                        validateColor('b', value.trim())
                    }}
                    fontSize={sizeFont(20, 15)}
                    placeholder={'' + (sceneEdit && visibleComponent === COMPONENT_TYPES.TEXT_COMPONENT ? sceneEdit[COMPONENT_TYPES.TEXT_COMPONENT].get(selectedItem.aid).color.b : "")}
                    placeholderColor={Color4.White()}
                    uiTransform={{
                        width: '100%',
                        height: '100%',
                    }}
                    color={Color4.White()}
                />
        </UiEntity>

            </UiEntity>
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '25%',
                    height: '100%',
                }}
            >

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '25%',
                    margin:{bottom:"5%"}
                }}
            uiText={{value:"a", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
            />

            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignContent: 'center',
                    width: '100%',
                    height: '70%',
                }}
                >
                <Input
                    onSubmit={(value) => {
                        validateColor('a', value.trim())
                    }}
                    onChange={(value) => {
                        validateColor('a', value.trim())
                    }}
                    fontSize={sizeFont(20, 15)}
                    placeholder={'' + (sceneEdit && visibleComponent === COMPONENT_TYPES.TEXT_COMPONENT ? sceneEdit[COMPONENT_TYPES.TEXT_COMPONENT].get(selectedItem.aid).color.a : "")}
                    placeholderColor={Color4.White()}
                    uiTransform={{
                        width: '100%',
                        height: '100%',
                    }}
                    color={Color4.White()}
                />
        </UiEntity>

            </UiEntity>

            </UiEntity>

         </UiEntity>
     
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
        updateText("data","color", colors[index])
    }    
}

function selectFont(index: number) {
    if(index !== getFontStyle()){
        updateText("data","font", index)
    }    
}

function selectTextAlign(index: number) {
    if(index !== getTextAlign()){
        updateText("data","textAlign", index)
    }  
}

function updateText(parameter:string, type:string, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
        {
            component:COMPONENT_TYPES.TEXT_COMPONENT, 
            aid:selectedItem.aid, sceneId:selectedItem.sceneId,
            type:parameter,
            [type]:value
        }
    )
}

function validateColor(hue:string, color:string){
    let value = parseFloat(color)
    if(isNaN(value) || value < 0){
        return
    }
    updateText("color", "data", {hue:hue, value:value})//
}