import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Dropdown, Input, UiEntity } from '@dcl/sdk/react-ecs'
import { newActionData, updateActionData, updateActionView } from '../EditAction'
import resources from '../../../../helpers/resources'
import { sizeFont } from '../../../helpers'
import { selectedItem } from '../../../../modes/Build'
import { colyseusRoom } from '../../../../components/Colyseus'
import { COMPONENT_TYPES } from '../../../../helpers/types'

let selectedIndex:number = 0
export let entityStates:any[] = []

export function updateEntityStates(){
    entityStates.length = 0
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(scene){
        let states = scene[COMPONENT_TYPES.STATE_COMPONENT].get(selectedItem.aid)
        if(states && states.values.length > 0){
            entityStates = [...states.values]
        }
        newActionData.state = entityStates[0]
    }
    selectedIndex = 0
}


export function AddSetStatePanel(){
    return(
        <UiEntity
        key={resources.slug + "action::state::panel"}
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
        uiText={{value:"Select State", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
        />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '15%',
            margin:{bottom:'1%'}
        }}
        >

        <Dropdown
            options={[...entityStates]}
            selectedIndex={selectedIndex}
            onChange={selectState}
            uiTransform={{
                width: '100%',
                height: '120%',
            }}
            color={Color4.White()}
            fontSize={sizeFont(20, 15)}
                />

        </UiEntity>

    </UiEntity>
    )
}

function selectState(index:number){
    selectedIndex = index

    let data = {...newActionData}
    newActionData.state = [...entityStates][index]
    updateActionData(data, true)
    // newActionData = {...}
}
    
