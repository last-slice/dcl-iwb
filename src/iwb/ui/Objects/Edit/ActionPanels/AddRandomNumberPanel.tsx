import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { getImageAtlasMapping, sizeFont } from '../../../helpers'
import { newActionData, updateActionData } from '../EditAction'
import resources from '../../../../helpers/resources'


let editData:any = undefined


export function updateActionRandomNumber(data?:any){
    if(data){
        editData = data
    }
}


export function AddRandomNumberPanel(){
    return(
        <UiEntity
        key={resources.slug + "action::random::number::panel"}
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '25%',
        }}
    >

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
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
            margin:{bottom:'5%'}
        }}
        uiText={{value:"Min Number", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
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
                updateActionData({min:editNum}, true)
            }}
            onSubmit={(value) => {
                let editNum = parseFloat(value.trim())
                if(isNaN(editNum)) return
                updateActionData({min:editNum}, true)
            }}
            fontSize={sizeFont(20,15)}
            placeholder={editData ? "" + editData.min : '1'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100',
            }}
            ></Input>
        </UiEntity>
        </UiEntity>

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
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
            margin:{bottom:'5%'}
        }}
        uiText={{value:"Max Number", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
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
                updateActionData({max:editNum}, true)
            }}
            onSubmit={(value) => {
                let editNum = parseFloat(value.trim())
                if(isNaN(editNum)) return
                updateActionData({max:editNum}, true)
            }}
            fontSize={sizeFont(20,15)}
            placeholder={editData ? "" + editData.max : '10'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100',
            }}
            ></Input>
        </UiEntity>
        </UiEntity>
       
    </UiEntity>
    )
}