import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { getImageAtlasMapping, sizeFont } from '../../../helpers'
import { newActionData, updateActionData } from '../EditAction'
import resources from '../../../../helpers/resources'

let editData:any = undefined
export function updateActionOpenLink(data?:any){
    if(data){
        editData = data
    }
}


export function AddLinkActionPanel(){
    return(
        <UiEntity
        key={resources.slug + "action::link::panel"}
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
            margin:{bottom:'5%'}
        }}
        uiText={{value:"URL Link", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
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
                updateActionData({url: value.trim()}, true)
            }}
            onSubmit={(value) => {
                updateActionData({url: value.trim()}, true)
            }}
            fontSize={sizeFont(20,15)}
            placeholder={editData ? ""+  editData.url : ''}
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