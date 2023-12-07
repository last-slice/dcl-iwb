
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { sizeFont } from '../../helpers'
import { visibleComponent } from './EditObjectDataPanel'
import { COMPONENT_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { sendServerMessage } from '../../../components/messaging'
import { selectedItem } from '../../../components/modes/build'

export function VisibilityComponentPanel() {
    return (
        <UiEntity
            key={"editvisibilitycomponentpanel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.VISBILITY_COMPONENT ? 'flex' : 'none',
            }}
        >

        {/* url label */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:"2%"}
            }}
        uiText={{value:"URL", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

                <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '20%',
            }}
            uiBackground={{color:Color4.Green()}}
            onMouseDown={()=>{
                sendServerMessage(SERVER_MESSAGE_TYPES.UPDATE_ITEM_COMPONENT, {component:COMPONENT_TYPES.VISBILITY_COMPONENT, action:"toggle", data:{aid:selectedItem.aid, sceneId:selectedItem.sceneId}})
            }}
            uiText={{value:"Toggle", fontSize:sizeFont(25,15), color:Color4.White(), textAlign:'middle-center'}}
            />
           
        </UiEntity>
    )
}