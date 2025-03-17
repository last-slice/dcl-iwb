import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { sizeFont } from '../../../helpers'
import { newActionData, updateActionData } from '../EditAction'
import resources, { colors } from '../../../../helpers/resources'
import { colyseusRoom } from '../../../../components/Colyseus'
import { selectedItem } from '../../../../modes/Build'
import { COMPONENT_TYPES } from '../../../../helpers/types'

let selectedQuestIndex:number = 0
let updated = false
let quests:any[] = []

let editData:any = undefined
export function updateQuestStartPanel(data?:any){
    editData = undefined
    
    if(data){
        editData = data
    }
}

export function releaseQuestAction(){
    updated = false
    selectedQuestIndex = 0
    quests.length = 0
}

export async function updateQuestsList(){
    
    // console.log('quest id is', selectedQuestIndex, quests[selectedQuestIndex].id)
    // updateActionData({questId:quests[selectedQuestIndex].id})
    // // newActionData.questId = quests[selectedQuestIndex].id

    quests.length = 0
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }

    scene[COMPONENT_TYPES.QUEST_COMPONENT].forEach((questComponent:any, aid:string)=>{
        quests.push({aid:aid, name:questComponent.name})
    })

    updateActionData({text:quests[selectedQuestIndex].aid})
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

        {/* <UiEntity
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
        // options={[...quests.map(($:any)=> $.name).sort((a:any, b:any)=> a.localeCompare(b))]}
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
        </UiEntity> */}


        <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin:{bottom:'1%'},
                }}
                uiText={{value:"Enter Quest Id", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
                />
        
          <Input
                    onChange={(value) => {
                        updateActionData({actionId:value.trim()})
                    }}
                    onSubmit={(value) => {
                        updateActionData({actionId:value.trim()})
                    }}
                    fontSize={sizeFont(20,15)}
                    placeholder={editData ? "" + editData.actionId : 'Enter Quest Id'}
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