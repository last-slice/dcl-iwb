import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Actions, ENTITY_EMOTES, ENTITY_EMOTES_SLUGS } from '../../../../helpers/types'
import { sizeFont } from '../../../helpers'
import { newActionData, updateActionData } from '../EditAction'
import resources from '../../../../helpers/resources'

export function AddEmoteActionPanel(){
    return(
        <UiEntity
        key={resources.slug + "action::emote::panel"}
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
            height: '10%',
            margin:{bottom:'5%'}
        }}
        uiText={{value:"Choose Emote", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
        />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '70%',
        }}
    >
        <Dropdown
        options={ENTITY_EMOTES}
        selectedIndex={0}
        onChange={selectEmote}
        uiTransform={{
            width: '100%',
            height: '120%',
        }}
        // uiBackground={{color:Color4.Purple()}}//
        color={Color4.White()}
        fontSize={sizeFont(20, 15)}
    />
        </UiEntity>
    </UiEntity>
    )
}

function selectEmote(index:number){
    updateActionData({emote:ENTITY_EMOTES_SLUGS[index], name:newActionData.name, type:newActionData.type}, true)
}