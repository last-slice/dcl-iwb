
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import resources from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { COMPONENT_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
import { visibleComponent } from '../EditAssetPanel'
import { uiSizes } from '../../uiConfig'

let typeIndex = 0
let path:string = ""

export let type:any[] = [
    "texture",
    "video"
]

export function EditTexture() {
    return (
        <UiEntity
            key={resources.slug + "edittextureComponentPanel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.TEXTURE_COMPONENT ? 'flex' : 'none',
            }}
        >

        {/* main row */}
        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
                margin:{top:"5%"}
            }}
        >

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
                height: '50%',
            }}
        uiText={{value:"Texture", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
                height: '60%',
            }}
        >

                <Dropdown
            options={type}
            selectedIndex={getTypeIndex()}
            onChange={selectTypeIndex}
            uiTransform={{
                width: '100%',
                height: '120%',
            }}
            // uiBackground={{color:Color4.Purple()}}
            color={Color4.White()}
            fontSize={sizeFont(20, 15)}
        />

        </UiEntity>



        </UiEntity>

                        {/* path */}
                        <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '20%',
                    margin: {top: "2%"},
                    display: getTypeIndex() === 0 ? "flex" : "none"
                }}
            >

            {/* url label */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '15%',
                }}
                uiText={{value: "Path", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
            />



            {/* url input info */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '50%',
                    margin: {top: "5%"}
                }}
            >

                <Input
                    onSubmit={(value) => {
                        console.log('submitted value: ' + value)
                    }}
                    onChange={(input) => {
                        path = input
                    }}
                    color={Color4.White()}
                    fontSize={sizeFont(25, 15)}
                    placeholder={"" + getPath()}
                    placeholderColor={Color4.White()}
                    uiTransform={{
                        width: '100%',
                        height: '120%',
                    }}
                ></Input>

                <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
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
                        value: "Save",
                        fontSize: sizeFont(25, 15),
                        color: Color4.White(),
                        textAlign: 'middle-center'
                    }}
                    onMouseDown={() => {
                        update("path", path)
                    }}
                />


            </UiEntity>

            </UiEntity>
     
        </UiEntity>
    )
}

function getPath(){
    if(selectedItem && selectedItem.enabled){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(scene){
            let itemInfo = scene.textures.get(selectedItem.aid)
            if(itemInfo){
                return itemInfo.path ? itemInfo.path : ""
            }
            return ""
        }
        return ""
    }
    return ""
}

function getTypeIndex(){
    if(selectedItem && selectedItem.enabled){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(scene){
            let itemInfo = scene.textures.get(selectedItem.aid)
            if(itemInfo){
                return itemInfo.type
            }
            return 0
        }
        return 0
    }
    return 0
}

function selectTypeIndex(index: number) {
    if(index !== typeIndex){
        typeIndex = index    
        update('type', index)
    }    
}

function update(type:any, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
        {
            component:COMPONENT_TYPES.TEXTURE_COMPONENT, 
            aid:selectedItem.aid, sceneId:selectedItem.sceneId,
            [type]:value
        }
    )
}