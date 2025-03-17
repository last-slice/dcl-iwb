import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { sizeFont } from '../../../helpers'
import { newActionData, updateActionData } from '../EditAction'
import resources from '../../../../helpers/resources'

let editData:any = undefined


export function updateActionVolumeDown(data?:any){
    if(data){
        editData = data
    }
}


export function AddVolumeDownPanel(){
    return(
        <UiEntity
        key={resources.slug + "action::volume::down::panel"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: 'auto',
        }}
    >

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '12%',
            margin:{bottom:'5%'}
        }}
        uiText={{value:"Decrease Volume By (must be between 0 - 1)", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
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
            onChange={(value) => {
                let editNum = parseFloat(value.trim())
                if(isNaN(editNum)) return
                updateActionData({value:editNum}, true)
            }}
            onSubmit={(value) => {
                let editNum = parseFloat(value.trim())
                if(isNaN(editNum)) return
                updateActionData({value:editNum}, true)
            }}
            fontSize={sizeFont(20,15)}
            placeholder={editData ? "" + editData.value : '0'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
            ></Input>
        </UiEntity>
    </UiEntity>
    )
}