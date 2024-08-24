import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { sizeFont } from '../../../helpers'
import { newActionData, updateActionData } from '../EditAction'
import resources from '../../../../helpers/resources'
import { quests } from '../../../../components/Quests'

let selectedQuestIndex:number = 0
let selectedQuestAction:number = 0
let selectedQuestActions:any[] = []

let displayQuestActions = false
let updated = false

export function releaseQuestAction(){
    updated = false
    selectedQuestIndex = 0
    selectedQuestAction = 0 
    selectedQuestActions.length = 0//
    displayQuestActions = false
}

export function updateQuests(){
    if(updated){
        return
    }
    updated = true
    updateActionData({questId:quests[selectedQuestIndex].id})
    updateQuestActions()

    if(selectedQuestActions.length > 0){
        displayQuestActions = true
        updateActionData({actionId:selectedQuestActions[selectedQuestIndex]})
    }
}

function updateQuestActions(){
    let definition = quests[selectedQuestIndex].definition
    console.log('definition is', definition)
    if(definition){
        let steps = definition.steps
        console.log('stesps are ', steps)
        if(steps){
            steps.forEach((step:any) => {
                let tasks = step.tasks
                console.log('tasks are', tasks)
                if(tasks){
                    tasks.forEach((task:any) => {
                        let actions = task.actionItems
                        console.log('actions are a', actions)
                        if(actions){
                           
                            actions.forEach((action:any) => {
                                selectedQuestActions.push(action.parameters.id);
                              });
                        }
                      });
                }
              });
        }
    }
}

export function AddQuestActionPanel(){
    return(
        <UiEntity
        key={resources.slug + "action::quest::panel"}
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
            displayQuestActions = true
            updateQuestActions()
        }}
        uiTransform={{
            width: '100%',
            height: '120%',
        }}
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
            height: '10%',
            margin:{bottom:'1%'},
            display: displayQuestActions ? "flex" : "none"
        }}
        uiText={{value:"Choose Quest Action", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
        />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '15%',
            margin:{bottom:'1%'},
            display: displayQuestActions ? "flex" : "none"
        }}
    >
        <Dropdown
        options={[...selectedQuestActions.sort((a:any, b:any)=> a.localeCompare(b))]}
        selectedIndex={0}
        onChange={(index:number)=>{
            selectedQuestAction = index
            updateActionData({actionId: selectedQuestActions[index]})
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