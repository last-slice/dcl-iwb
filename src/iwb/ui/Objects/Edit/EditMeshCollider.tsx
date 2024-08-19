
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateSquareImageDimensions, getImageAtlasMapping, sizeFont } from '../../helpers'
import resources from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { COMPONENT_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { sceneEdit, selectedItem } from '../../../modes/Build'
import { visibleComponent } from '../EditAssetPanel'
import { getOnPlay } from './EditMeshRender'
import { localPlayer } from '../../../components/Player'
import { uiSizes } from '../../uiConfig'

let shapeIndex = 0
let collisionIndex = 1

export let shapes:any[] = [
    "Plane",
    "Box",
    "Cylinder",
    "Sphere"
]

export let visibleLayers:any[] = [
    "None",
    "Pointer",
    "Physics",
    "Custom1",
    "Custom2",
    "Custom3",
    "Custom4",
    "Custom5",
    "Custom6",
    "Custom7",
    "Custom8",
    "Custom9",
]

export function EditMeshCollider() {
    return (
        <UiEntity
            key={resources.slug + "editmeshcolliderComponentPanel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.MESH_COLLIDER_COMPONENT ? 'flex' : 'none',
            }}
        >

        {/* main row */}
        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
                margin:{top:"5%"}
            }}
        >

                    {/* invisible mask layer */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
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
                margin:{bottom:"10%"}
            }}
        uiText={{value:"Shape", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-center'}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '60%',
            }}
        >

                        <Dropdown
                    options={shapes}
                    selectedIndex={getShapeIndex()}
                    onChange={selectShapeIndex}
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

                            {/* visible mask layer */}
                            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
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
                margin:{bottom:"10%"}
            }}
        uiText={{value:"Visible Layer", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-center'}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '60%',
            }}
        >

                        <Dropdown
                    options={visibleLayers}
                    selectedIndex={getCollisionIndex()}                    
                    onChange={selectCollisionLayer}
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
                uvs: selectedItem && selectedItem.enabled && getOnPlay(sceneEdit, COMPONENT_TYPES.MESH_COLLIDER_COMPONENT ,selectedItem.aid) ? getImageAtlasMapping(uiSizes.toggleOnTrans) : getImageAtlasMapping(uiSizes.toggleOffTrans)
            }}
            onMouseDown={() => {
                sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
                    {
                        component:COMPONENT_TYPES.MESH_COLLIDER_COMPONENT,
                        aid:selectedItem.aid, 
                        sceneId:selectedItem.sceneId,
                        onPlay: !getOnPlay(sceneEdit, COMPONENT_TYPES.MESH_COLLIDER_COMPONENT ,selectedItem.aid)
                    }
                )

            }}
            />
        </UiEntity>


        </UiEntity>
     
        </UiEntity>
    )
}

function getShapeIndex(){
    if(selectedItem && selectedItem.enabled){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(scene){
            let itemInfo = scene[COMPONENT_TYPES.MESH_COLLIDER_COMPONENT].get(selectedItem.aid)
            if(itemInfo){
                return itemInfo.shape
            }
            return 0
        }
        return 0
    }
    return 0
}

function getCollisionIndex(){
    if(selectedItem && selectedItem.enabled){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(scene){
            let itemInfo = scene[COMPONENT_TYPES.MESH_COLLIDER_COMPONENT].get(selectedItem.aid)
            if(itemInfo){
                return itemInfo.layer
            }
            return 0
        }
        return 0
    }
    return 0
}

function selectCollisionLayer(index: number) {
    if(index !== collisionIndex){
        collisionIndex = index
        update('layer', index)
    }    
}

function selectShapeIndex(index: number) {
    if(index !== shapeIndex){
        shapeIndex = index    
        update('shape', index)
    }    
}

function update(type:any, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
        {
            component:COMPONENT_TYPES.MESH_COLLIDER_COMPONENT, 
            aid:selectedItem.aid, sceneId:selectedItem.sceneId,
            [type]:value
        }
    )
}