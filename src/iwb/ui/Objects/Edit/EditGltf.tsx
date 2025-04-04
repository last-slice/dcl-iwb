
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateSquareImageDimensions, getImageAtlasMapping, sizeFont } from '../../helpers'
import resources from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { COMPONENT_TYPES, SceneItem, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
import { visibleComponent } from '../EditAssetPanel'
import { ColliderLayer, ComponentType } from '@dcl/sdk/ecs'
import { items, original, Sorted3D } from '../../../components/Catalog'

let invisibleIndex:number = 2
let visibleIndex:number = 1

export let invisibleLayers:any[] = [
    "None",
    "Pointer",
    "Physics",
    "Physics + Pointer",
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

export let visibleLayers:any[] = [
    "None",
    "Pointer",
    "Physics",
    "Physics + Pointer",
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

export function EditGltf() {
    return (
        <UiEntity
            key={resources.slug + "editgltfComponentPanel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.GLTF_COMPONENT ? 'flex' : 'none',
            }}
        >

<UiEntity
            uiTransform={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:"5%"}
            }}
            uiText={{value:"3d Model: " + get3Dmodel(), fontSize:sizeFont(25,20), textAlign:'middle-left', color:Color4.White()}}
        />


<Dropdown
    options={[...[{name:"Select GLB"}], ...getScene3DModels()].map((item:any)=>item.name)}
    selectedIndex={0}
    onChange={(index:number)=>{
        updateGltf('src', [...[{name:"Select GLB"}], ...getScene3DModels()][index].src)
    }}
    uiTransform={{
        width: '95%',
        height: '10%',
    }}
    color={Color4.White()}
    fontSize={sizeFont(20, 15)}
/>

        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:"5%"}
            }}
            uiText={{value:"Collision Details", fontSize:sizeFont(25,20), textAlign:'middle-left', color:Color4.White()}}
        />


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
        uiText={{value:"Invisible Layer", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-center'}}
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
                    options={invisibleLayers}
                    selectedIndex={getInvisibleIndex()}
                    onChange={selectInvisibleLayer}
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
                    selectedIndex={getVisibleIndex()}                    
                    onChange={selectVisibleLayer}
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
     
        </UiEntity>
    )
}

function getScene3DModels(){
    if(!selectedItem || !selectedItem.enabled)  return []

    let sceneModels:any[] = []
    Sorted3D.forEach((item:SceneItem)=>{
        sceneModels.push({name:item.n, src:item.id})
    })

    return sceneModels
}


function get3Dmodel(){
    if(!selectedItem || !selectedItem.enabled)  return ""

    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene) return ""

    let iwbInfo = scene[COMPONENT_TYPES.IWB_COMPONENT].get(selectedItem.aid)
    if(!iwbInfo) return ""

    let item = items.get(iwbInfo.id)

    if(!item) return ""
    return "" + item.n
}

function getInvisibleIndex(){
    if(selectedItem && selectedItem.enabled){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(scene){
            let itemInfo = scene[COMPONENT_TYPES.GLTF_COMPONENT].get(selectedItem.aid)
            if(itemInfo){
                return itemInfo.invisibleCollision
            }
            return 0
        }
        return 0
    }
    return 0
}

function getVisibleIndex(){
    if(selectedItem && selectedItem.enabled){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(scene){
            let itemInfo = scene[COMPONENT_TYPES.GLTF_COMPONENT].get(selectedItem.aid)
            if(itemInfo){
                return itemInfo.visibleCollision
            }
            return 0
        }
        return 0
    }
    return 0
}

function selectVisibleLayer(index: number) {
    if(index !== visibleIndex){
        visibleIndex = index
        updateGltf('visibleCollision', index)
    }    
}

function selectInvisibleLayer(index: number) {
    if(index !== invisibleIndex){
        invisibleIndex = index    
        updateGltf('invisibleCollision', index)
    }    
}

function updateGltf(type:any, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
        {
            component:COMPONENT_TYPES.GLTF_COMPONENT, 
            aid:selectedItem.aid, sceneId:selectedItem.sceneId,
            [type]:value
        }
    )
}