
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { log } from '../../../helpers/functions'
import resources, { colors, colorsLabels } from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { COMPONENT_TYPES, EDIT_MODES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
import { visibleComponent } from '../EditAssetPanel'
import { generateButtons, setUIClicked, setupUI } from '../../ui'
import { uiSizes } from '../../uiConfig'

let newState:string = ""

function getAssetStates(){
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return []
    }
    
    let states = scene[COMPONENT_TYPES.STATE_COMPONENT].get(selectedItem.aid)
    if(!states){
        return []
    }

    let arr:any[] = []
    let count = 0

    states.values.forEach((state:any, i:number)=>{
        arr.push(<Row data={{value:state, default: states.defaultValue === state ? true : undefined}} rowCount={count} />)
        count++
    })
    return arr
}

function getSync(){
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return false
    }
    
    let sync = scene[COMPONENT_TYPES.MULTIPLAYER_COMPONENT].get(selectedItem.aid)
    if(!sync || !sync.syncedComponents.has(selectedItem.aid)){
        return false
    }

    return sync.syncedComponents.get(selectedItem.aid).state
}

export function EditState() {
    return (
        <UiEntity
            key={resources.slug + "edit::state::panel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.STATE_COMPONENT ? 'flex' : 'none',
            }}
        >


        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{bottom:"5%"}
            }}
        uiText={{value:"Asset States", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

<UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            margin:{bottom:'1%'}
        }}
        >
            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '75%',
            height: '100%',
        }}
        >

        <Input
            onChange={(value) => {
                newState = value.trim()
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'Enter State Name'}
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
            width: '25%',
            height: '100%',
            margin:{left:'1%'}
        }}
        >
                    <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf:'flex-start',
                width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
                height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            uiText={{
                value: "Add State",
                fontSize: sizeFont(25, 15),
                color: Color4.White(),
                textAlign: 'middle-center'
            }}
            onMouseDown={() => {
                setUIClicked(true)
                update("add", {value:newState})
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
        />
            </UiEntity>

        </UiEntity>

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            margin:{bottom:'2%'}
        }}
        uiText={{value:"All States", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
        />

        {selectedItem && selectedItem.enabled && visibleComponent === COMPONENT_TYPES.STATE_COMPONENT && getAssetStates()}
        </UiEntity>
    )
}

export function Row(info:any){
    let data:any = info.data
    return(
        <UiEntity
        key={resources.slug + "-edit-state-row-"+ info.rowCount}
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '7%',
                margin:{top:"1%", bottom:'1%', left:"2%", right:'2%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.rowPillDark)}}
                >

             <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40%', 
                height: '100%',
                margin:{left:'1%'}
            }}
            uiText={{value:"" + data.value, textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
            />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40%', 
                height: '100%',
            }}
            uiText={{value:"" + (data.default ? "Default" : "Set Default"), textAlign:'middle-center', fontSize:sizeFont(20,15), color:Color4.White()}}
            onMouseDown={()=>{
                setUIClicked(true)
                if(!data.default){
                    update("default", {default:data.value})
                }
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
            >
            </UiEntity>

            {/* action edit buttons column */}
            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '100%',
            }}
            >

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).width,
                    height: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).height,
                    margin:{left:"1%"}
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas1.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.trashButton)
                }}
                onMouseDown={() => {
                    setUIClicked(true)
                    update("delete", {value:data.value})
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
            />
                </UiEntity>

            </UiEntity>
    )
}

function update(action:string, data:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET,
        {
            component:COMPONENT_TYPES.STATE_COMPONENT,
            aid:selectedItem.aid,
            sceneId:selectedItem.sceneId,
            action:action,
            data:data,
        }
    )
}