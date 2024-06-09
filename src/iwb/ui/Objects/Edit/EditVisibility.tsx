
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import resources from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { COMPONENT_TYPES, EDIT_MODES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
import { sizeFont, calculateSquareImageDimensions, getImageAtlasMapping } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { visibleComponent } from '../EditAssetPanel'
import { getAssetVisibility } from '../../../components/Visibility'

export function EditVisibility() {
    return (
        <UiEntity
            key={resources.slug + "edit::visibility::panel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.VISBILITY_COMPONENT ? 'flex' : 'none',
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

                    {/* url label */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
                height: '100%',
            }}
        uiText={{value:"Enabled", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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
            uvs: selectedItem && selectedItem.enabled && selectedItem.mode === EDIT_MODES.EDIT ? getVisibility() : getImageAtlasMapping(uiSizes.toggleOffTrans)
        }}
        onMouseDown={() => {
            sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
                {
                    component:COMPONENT_TYPES.VISBILITY_COMPONENT,
                    aid:selectedItem.aid, 
                    sceneId:selectedItem.sceneId
                }
            )

        }}
        />


        </UiEntity>


        </UiEntity>
     
        </UiEntity>
    )
}

function getVisibility(){
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(scene){
        if(getAssetVisibility(scene, selectedItem.aid)){
            return getImageAtlasMapping(uiSizes.toggleOnTrans)
        }else{
            return getImageAtlasMapping(uiSizes.toggleOffTrans)
        }
    }
    return getImageAtlasMapping(uiSizes.toggleOffTrans)
}