import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { sizeFont } from '../../../helpers'
import { Color4 } from '@dcl/sdk/math'
import { selectedItem } from '../../../../components/modes/build'
import { localPlayer } from '../../../../components/player/player'
import { log } from '../../../../helpers/functions'
import { items } from '../../../../components/catalog'
import {  ENTITY_EMOTES } from '../../../../helpers/types'

export let selectedEmoteIndex:number = 0

export function ActionPlayEmoteComponent(){
    return(
        <UiEntity
        key={"action-play-emote-component"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display:'flex'
        }}
    >

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
        key={"action-play-emote-dropdown"}
        options={selectedItem && selectedItem.enabled ? ENTITY_EMOTES : []}
        selectedIndex={selectedEmoteIndex}
        onChange={selectEmote}
        uiTransform={{
            width: '100%',
            height: '70%',
        }}
        // uiBackground={{color:Color4.Purple()}}
        color={Color4.White()}
        fontSize={sizeFont(20, 15)}
    />
    </UiEntity>

    <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '15%',
            margin:{bottom:'5%'}
        }}
    uiText={{value:"Select Emote", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
    />


</UiEntity>
                  
    )
}

function selectEmote(index:number){
    selectedEmoteIndex = index
}