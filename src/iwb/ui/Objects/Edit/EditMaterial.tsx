
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateSquareImageDimensions, getImageAtlasMapping, sizeFont } from '../../helpers'
import resources from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { COMPONENT_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
import { visibleComponent } from '../EditAssetPanel'
import { localPlayer } from '../../../components/Player'

let typeIndex = 0
let material:any = {}

export let type:any[] = [
    "pbr",
    //unit
]

export function updateMaterialComponent(){
    let scene = localPlayer.activeScene
    if(!scene){
        return
    }

    let materialInfo = scene[COMPONENT_TYPES.MATERIAL_COMPONENT].get(selectedItem.aid)
    if(!materialInfo){
        return
    }

    material = {...materialInfo}
}

export function EditMaterial() {
    return (
        <UiEntity
            key={resources.slug + "editmaterialComponentPanel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.MATERIAL_COMPONENT ? 'flex' : 'none',
            }}
        >

        {/* main row */}
        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
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
        uiText={{value:"Material", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-center'}}
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
                    margin:{bottom:'3%'}
                }}
            uiText={{value:"Albedo Color", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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
                    placeholder={'' + (material && material.albedoColor && material.albedoColor.r)}
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
                    placeholder={'' + (material && material.albedoColor && material.albedoColor.g)}
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
                    placeholder={'' + (material && material.albedoColor && material.albedoColor.b)}
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
                    placeholder={'' + (material && material.albedoColor && material.albedoColor.a)}
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

function getTypeIndex(){
    if(selectedItem && selectedItem.enabled){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(scene){
            let itemInfo = scene[COMPONENT_TYPES.MATERIAL_COMPONENT].get(selectedItem.aid)
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
            component:COMPONENT_TYPES.MATERIAL_COMPONENT, 
            aid:selectedItem.aid, sceneId:selectedItem.sceneId,
            type:type,
            data:value
        }
    )
}

function validateColor(hue:string, color:string){
    let value = parseFloat(color)
    if(isNaN(value) || value < 0 || value > 1){
        return
    }

    update("albedoColor", {hue:hue, value:value})
}