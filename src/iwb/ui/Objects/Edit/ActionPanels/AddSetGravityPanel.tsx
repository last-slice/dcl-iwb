import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Actions, ENTITY_EMOTES, ENTITY_EMOTES_SLUGS } from '../../../../helpers/types'
import { sizeFont } from '../../../helpers'
import { newActionData, updateActionData } from '../EditAction'
import resources from '../../../../helpers/resources'

export function AddSetGravityPanel(){
    return(
        <UiEntity
        key={resources.slug + "action::set::gravity::panel"}
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
        uiText={{value:"Set Scene Gravity", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
        />

         <Input
            onChange={(value) => {
                if(isNaN(parseFloat(value.trim()))){
                    return
                }
                updateActionData({value:parseFloat(value.trim())})
            }}
            onSubmit={(value) => {
                if(isNaN(parseFloat(value.trim()))){
                    return
                }
                updateActionData({value:parseFloat(value.trim())})
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'Enter new gravity number (m/s2)'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '15%',
            }}
            ></Input>
    </UiEntity>
    )
}