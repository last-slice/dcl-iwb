import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { sizeFont } from '../../../helpers'
import { newActionData, updateActionData } from '../EditAction'
import resources from '../../../../helpers/resources'
import { quests } from '../../../../components/Quests'

let selectedQuestIndex:number = 0
let updated = false

export function releaseQuestAction(){
    updated = false
    selectedQuestIndex = 0
}

export async function updateQuestsList(){
    console.log('quest id is', selectedQuestIndex, quests[selectedQuestIndex].id)
    updateActionData({questId:quests[selectedQuestIndex].id})
    // newActionData.questId = quests[selectedQuestIndex].id
}

export function AddQuestStartPanel(){
    return(
        <UiEntity
        key={resources.slug + "action::quest::start::panel"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
        }}
        // uiBackground={{color:Color4.Green()}}//
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
        uiText={{value:"Choose Quest", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
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
        options={[...quests.map(($:any)=> $.name).sort((a:any, b:any)=> a.localeCompare(b))]}
        selectedIndex={0}
        onChange={(index:number)=>{
            selectedQuestIndex = index
            updateQuestsList()
        }}
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