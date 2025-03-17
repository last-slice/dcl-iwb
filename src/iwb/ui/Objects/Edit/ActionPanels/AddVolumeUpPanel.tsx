import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { sizeFont } from '../../../helpers'
import { newActionData, updateActionData } from '../EditAction'
import resources from '../../../../helpers/resources'

let editData:any = undefined
export function updateActionVolumeUp(data?:any){
    if(data){
        editData = data
    }
}

export function AddVolumeUpPanel(){
    return(
        <UiEntity
        key={resources.slug + "action::volume::up::panel"}
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
            height: '12%',
            margin:{bottom:'5%'}
        }}
        uiText={{value:"Increase Volume By (must be between 0 - 1)", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
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