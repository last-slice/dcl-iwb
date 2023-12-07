
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { sizeFont } from '../../helpers'

export function EditObjectData() {
    return (
        <UiEntity
            key={"editobjectdatainfo"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '95%',
                height: '35%',
            }}
        uiBackground={{color:Color4.Blue()}}
        >

        {/* details label */}
        <UiEntity
            key={"editobjectdatainfo"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '90%',
                height: '10%',
                margin:{top:"2%"}
            }}
        uiBackground={{color:Color4.Blue()}}
        uiText={{value:"Asset Details", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />
            
        </UiEntity>
    )
        }