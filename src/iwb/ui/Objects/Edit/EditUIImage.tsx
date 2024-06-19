import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
import {Color4} from '@dcl/sdk/math'
import {calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont} from '../../helpers'
import resources, { colors } from '../../../helpers/resources'
import { COMPONENT_TYPES, EDIT_MODES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { visibleComponent } from '../EditAssetPanel'
import { UiTexts } from '../../../components/UIText'
import { selectedItem } from '../../../modes/Build'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { setUIClicked } from '../../ui'
import { uiSizes } from '../../uiConfig'
import { UiImages } from '../../../components/UIImage'

let dataEntities:any[] = []
let selectedEntityIndex:number = 0

export function showUIImage(){
    let uiInfo = UiImages.get(selectedItem.aid)
    if(uiInfo){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(!scene){
            return 
        }
    
        let uiItemInfo = scene[COMPONENT_TYPES.UI_IMAGE_COMPONENT].get(selectedItem.aid)
        if(uiItemInfo){
            uiInfo.show()
        }
    }
}

export function hideUIImage(){
    let uiInfo = UiImages.get(selectedItem.aid)
    if(uiInfo){
        uiInfo.hide()
    }
}

export function EditUIImage() {
    return (
        <UiEntity
            key={resources.slug + "edit::uiimage::panel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.UI_IMAGE_COMPONENT ? 'flex' : 'none',
            }}
            >

            <ImageSourceRow/>
            <ImageSizeRow/>

{/* positioning row */}
<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
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
                height: '100%',
            }}
            uiText={{value: "Position (%)", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
        />
    </UiEntity>

    <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '75%',
        height: '100%',
    }}
    >
            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '50%',
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
    value: "Clear",
    fontSize: sizeFont(25, 15),
    color: Color4.White(),
    textAlign: 'middle-center'
}}
onMouseDown={() => {
    setUIClicked(true)
    clearUiPosition()
}}
onMouseUp={()=>{
    setUIClicked(false)
}}
/>

</UiEntity>
    </UiEntity>


</UiEntity>

    {/* positioning row */}
<UiEntity
    uiTransform={{
        flexDirection: 'row',
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
    height: '10%',
    margin:{bottom:"7%"}
}}
uiText={{value: "Top", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
/>

<UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '50%',
}}
>

<Input
    uiTransform={{
        width: '80%',
        height: '120%',
    }}
    placeholder={"Top Position"}
    color={Color4.White()}
    fontSize={sizeFont(20, 15)}
    textAlign='middle-center'
    onChange={(input) => {
        updateUiPosition("top", input)
    }}
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
    height: '10%',
    margin:{bottom:"7%"}
}}
uiText={{value: "Bottom", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
/>

<UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '50%',
}}
>

<Input
    uiTransform={{
        width: '80%',
        height: '120%',
    }}
    placeholder={"Bottom Position"}
    color={Color4.White()}
    fontSize={sizeFont(20, 15)}
    textAlign='middle-center'
    onChange={(input) => {
        updateUiPosition("bottom", input)
    }}
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
    height: '10%',
    margin:{bottom:"7%"}
}}
uiText={{value: "Left", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
/>

<UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '50%',
}}
>

<Input
    uiTransform={{
        width: '80%',
        height: '120%',
    }}
    placeholder={"Left Position"}
    color={Color4.White()}
    fontSize={sizeFont(20, 15)}
    textAlign='middle-center'
    onChange={(input) => {//
        updateUiPosition("left", input)
    }}
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
    height: '10%',
    margin:{bottom:"7%"}
}}
uiText={{value: "Right", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
/>

<UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '50%',
}}
>

<Input
    uiTransform={{
        width: '80%',
        height: '120%',
    }}
    placeholder={"Right Position"}
    color={Color4.White()}
    fontSize={sizeFont(20, 15)}
    textAlign='middle-center'
    onChange={(input) => {
        updateUiPosition("right", input)
    }}
/>

</UiEntity>

    </UiEntity>

</UiEntity>

<UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '10%',
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
    value: "Update",
    fontSize: sizeFont(25, 15),
    color: Color4.White(),
    textAlign: 'middle-center'
}}
onMouseDown={() => {
    setUIClicked(true)
    updateUi()
}}
onMouseUp={()=>{
    setUIClicked(false)
}}
/>
</UiEntity>
            
        </UiEntity>
    )
}


function ImageSourceRow(){
    return(
        <UiEntity
        key={resources.slug + "edit::ui::image::src::row"}
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
            height: '10%',
            margin:{bottom:"7%"}
        }}
        uiText={{value: "Image Source", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
        />

    <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '50%',
        }}
    >
        <Input
            uiTransform={{
                width: '100%',
                height: '120%',
            }}
            // uiBackground={{color:Color4.Purple()}}//
            placeholderColor={Color4.White()}
            placeholder={"" + (
                selectedItem && 
                selectedItem.enabled && 
                visibleComponent === COMPONENT_TYPES.UI_IMAGE_COMPONENT ?
                getUiVariable("src") : ""
            )}
            color={Color4.White()}
            fontSize={sizeFont(20, 15)}
            textAlign='middle-center'
            onChange={(value:string) => {
                upateUiImageSource(value)
            }}
        />
    </UiEntity>

    </UiEntity>
    )
}

function ImageSizeRow(){
    return(
        <UiEntity
        key={resources.slug + "edit::ui::image::size::row"}
        uiTransform={{
            flexDirection: 'row',
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
            width: '50%',
            height: '100%',
            margin:{right:"2%"}
        }}
        >
     <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            margin:{bottom:"7%"}
        }}
        uiText={{value: "Width", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
        />

    <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '50%',
        }}
    >
        <Input
            uiTransform={{
                width: '100%',
                height: '120%',
            }}
            // uiBackground={{color:Color4.Purple()}}//
            placeholderColor={Color4.White()}
            placeholder={"" + (
                selectedItem && 
                selectedItem.enabled && 
                visibleComponent === COMPONENT_TYPES.UI_IMAGE_COMPONENT ?
                getUiVariable("width") : ""
            )}
            color={Color4.White()}
            fontSize={sizeFont(20, 15)}
            textAlign='middle-center'
            onChange={(value:string) => {
                updateUiSize('width', value)
            }}
        />
    </UiEntity>

        </UiEntity>

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50%',
            height: '100%',
            margin:{left:"2%"}
        }}
        >

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            margin:{bottom:"7%"}
        }}
        uiText={{value: "Height (blank for square)", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
        />

    <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '50%',
        }}
    >
        <Input
            uiTransform={{
                width: '100%',
                height: '120%',
            }}
            // uiBackground={{color:Color4.Purple()}}//
            placeholderColor={Color4.White()}
            placeholder={"" + (
                selectedItem && 
                selectedItem.enabled && 
                visibleComponent === COMPONENT_TYPES.UI_IMAGE_COMPONENT ?
                getUiVariable("height") : ""
            )}
            color={Color4.White()}
            fontSize={sizeFont(20, 15)}
            textAlign='middle-center'
            onChange={(input) => {
                updateUiSize('height', input)
            }}
        />
    </UiEntity>


        </UiEntity>

    </UiEntity>
    )
}

function getUiVariable(variable:any){
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return ""
    }

    let uiInfo = scene[COMPONENT_TYPES.UI_IMAGE_COMPONENT].get(selectedItem.aid)
    if(uiInfo && uiInfo[variable]){
        return uiInfo[variable]
    }
    return ""
}

function updateUiSize(key:string, value:string){
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }

    let size = parseInt(value.trim())

    let uiInfo:any = UiImages.get(selectedItem.aid)
    if(uiInfo){
        uiInfo[key] = size
    }

    let uiTextInfo = scene[COMPONENT_TYPES.UI_IMAGE_COMPONENT].get(selectedItem.aid)
    if(uiTextInfo){
        uiTextInfo[key] = size
    }
}

function upateUiImageSource(value:string){
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }

    let uiInfo = UiImages.get(selectedItem.aid)
    if(uiInfo){
        uiInfo.src = value.trim()
    }

    let uiItemInfo = scene[COMPONENT_TYPES.UI_IMAGE_COMPONENT].get(selectedItem.aid)
    if(uiItemInfo){
        uiItemInfo.src = value.trim()
    }
}

function updateUiPosition(type:string, value:any){
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }

    let uiInfo = scene[COMPONENT_TYPES.UI_IMAGE_COMPONENT].get(selectedItem.aid)
    if(uiInfo){
        switch(type){
            case 'top':
                uiInfo.pt = parseInt(value.trim())
                break;

            case 'bottom':
                uiInfo.pb = parseInt(value.trim())
                break;

            case 'left':
                uiInfo.pl = parseInt(value.trim())
                break;

            case 'right':
                uiInfo.pr = parseInt(value.trim())
                break;
        }
    }

    let uiImageInfo = UiImages.get(selectedItem.aid)
    if(uiImageInfo){
        if(!uiImageInfo.position){
            uiImageInfo.position = {}   
        }
        uiImageInfo.position[type] = `${value.trim()}%`
    }

    console.log('ui image is now', uiImageInfo)
}

function clearUiPosition(){
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }

    let uiInfo = scene[COMPONENT_TYPES.UI_IMAGE_COMPONENT].get(selectedItem.aid)
    if(uiInfo){
        uiInfo.pt = undefined
        uiInfo.pr = undefined
        uiInfo.pl = undefined
        uiInfo.pb = undefined
    }

    let uiImage = UiImages.get(selectedItem.aid)
    if(uiImage){
        uiImage.position = undefined
    }
    console.log(uiImage)
}

function updateUi(){
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }

    let uiTextInfo = scene[COMPONENT_TYPES.UI_IMAGE_COMPONENT].get(selectedItem.aid)
    if(uiTextInfo){
        let data = {...uiTextInfo}
        // data.aid = dataEntities[selectedEntityIndex].aid
        sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET,
            {
                component:COMPONENT_TYPES.UI_IMAGE_COMPONENT, 
                aid:selectedItem.aid, sceneId:selectedItem.sceneId,
                data: data
            }
        )
    }
}