
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import resources from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { Actions, COMPONENT_TYPES, EDIT_MODES, EDIT_MODIFIERS, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
import { visibleComponent } from '../EditAssetPanel'
import { uiSizes } from '../../uiConfig'
import { utils } from '../../../helpers/libraries'

let camera:any

export function getVirrtualCameraData(){
   let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }

    let cameraInfo = scene[COMPONENT_TYPES.VIRTUAL_CAMERA].get(selectedItem.aid)
    if(!cameraInfo){
        return
    }

    camera = cameraInfo
    console.log('camera info is', cameraInfo)
}

export function EditVirtualCamera() {
    return (
        <UiEntity
            key={resources.slug + "edit::virtual::camera::panel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.VIRTUAL_CAMERA ? 'flex' : 'none',
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
uiText={{textWrap:'nowrap', value:"Transition Type: " + getTransitionType(), textAlign:'middle-left', fontSize:sizeFont(20,15)}}
/>

<Dropdown
    options={["Select Transition Type", "Immediate", "Time", "Speed"]}
    onChange={changeTransitionType}
    uiTransform={{
        width: '90%',
        height: '10%',
    }}
    // uiBackground={{color:Color4.Purple()}}//
    color={Color4.White()}
    fontSize={sizeFont(20, 15)}
/>

<UiEntity
uiTransform={{
flexDirection: 'column',
alignItems: 'center',
justifyContent: 'center',
width: '100%',
height: '10%',
margin:{bottom:'1%'}
}}
uiText={{textWrap:'nowrap', value:"Transition Amount: " + (camera && camera.transitionAmount ? camera.transitionAmount : 0), textAlign:'middle-left', fontSize:sizeFont(20,15)}}
/>

<Input
    uiTransform={{
        width: '90%',
        height: '7%',
    }}
    // uiBackground={{color:Color4.Purple()}}//
    placeholderColor={Color4.White()}
    placeholder={"Enter Transition Amount"}
    color={Color4.White()}
    fontSize={sizeFont(20, 15)}
    textAlign='middle-center'
    onChange={(value:string) => {
        if(!isNaN(parseFloat(value))){
            update("transitionAmount", parseFloat(value))
        }
    }}
/>

 <UiEntity
            uiTransform={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
                margin:{top:"5%"}
            }}
        >

                    {/* url label */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
                height: '100%',
            }}
        uiText={{textWrap:'nowrap', value:"Look At Entity", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '85%',
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
            uvs: camera && camera.lookAt ? 
            getImageAtlasMapping(uiSizes.toggleOnTrans) : 
            getImageAtlasMapping(uiSizes.toggleOffTrans)
        }}
        onMouseDown={() => {
        }}
        />


        </UiEntity>


        </UiEntity>

        </UiEntity>
    )
}

function getTransitionType(){
    if(!camera){
        return ""
    }

    switch(camera.transitiontype){
        case -1:
            return "Immediate"

        case 0:
            return "Time"

        case 1:
            return "Speed"
    }
}

function changeTransitionType(index:number){
    if(index > 0){
        update("transitiontype", index - 2)
    }
}

function update(type:string, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
        {
            component:COMPONENT_TYPES.VIRTUAL_CAMERA, 
            sceneId:selectedItem.sceneId, 
            aid:selectedItem.aid,
            [type]:value
        }
    )
    utils.timers.setTimeout(()=>{
        getVirrtualCameraData()
    }, 100)
}