
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateSquareImageDimensions, getImageAtlasMapping, sizeFont } from '../../helpers'
import resources from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { COMPONENT_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
import { visibleComponent } from '../EditAssetPanel'

let typeIndex = 0

export let type:any[] = [
    "pbr",
    //unit
]

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
            [type]:value
        }
    )
}