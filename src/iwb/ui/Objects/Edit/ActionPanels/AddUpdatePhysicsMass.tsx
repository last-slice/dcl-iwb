import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { sizeFont } from '../../../helpers'
import { newActionData, updateActionData } from '../EditAction'
import resources from '../../../../helpers/resources'

export function AddUpdatePhysicsMass(){
    return(
        <UiEntity
        key={resources.slug + "action::update::physics::mass::panel"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
        }}
        // uiBackground={{color:Color4.Green()}}
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
        uiText={{value:"Enter new Mass in kg", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
        />

<Input
                onChange={(value) => {
                    let temp = parseFloat(value.trim())
                    if(!isNaN(temp)){
                        updateActionData({value:temp})
                    }
                }}
                onSubmit={(value) => {
                    let temp = parseFloat(value.trim())
                    if(!isNaN(temp)){
                        updateActionData({value:temp})
                    }
                }}
                fontSize={sizeFont(20,15)}
                placeholder={'mass in kg'}
                placeholderColor={Color4.White()}
                color={Color4.White()}
                uiTransform={{
                    width: '100%',
                    height:'15%',
                }}
                ></Input>

    </UiEntity>
    )
}