import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { sizeFont } from '../../../helpers'
import { updateActionData } from '../EditAction'
import resources from '../../../../helpers/resources'

let editData:any

export function updateActionNotificationPanel(data?:any){
    editData = undefined

    if(data){
        editData = data
    }
}

export function AddShowNotificationPanel(){
    return(
        <UiEntity
        key={resources.slug + "action::show::notification::panel"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
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
            margin:{bottom:'1%'}
        }}
        uiText={{value:"Notification Text", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
        />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '15%',
            margin:{bottom:'5%'}
        }}
    >
        <Input
            onChange={(value) => {
                updateActionData({message:value.trim()})
            }}
            fontSize={sizeFont(20,15)}
            placeholder={editData ? editData.message : 'Enter text'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100',
            }}
            ></Input>
        </UiEntity>


        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            margin:{bottom:'1%'}
        }}
        uiText={{value:"Hide After Seconds", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
        />
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '15%',
        }}
    >
        <Input
            onChange={(value) => {
                let editNum = parseFloat(value.trim())
                if(isNaN(editNum))  return;
                updateActionData({timer:editNum})
            }}
            onSubmit={(value) => {
                let editNum = parseFloat(value.trim())
                if(isNaN(editNum))  return;
                updateActionData({timer:editNum})
            }}
            fontSize={sizeFont(20,15)}
            placeholder={editData ? "" + editData.timer : '0'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100',
            }}
            ></Input>
        </UiEntity>


    </UiEntity>
    )
}