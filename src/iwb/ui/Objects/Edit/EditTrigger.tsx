
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import resources from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { COMPONENT_TYPES, SERVER_MESSAGE_TYPES, TriggerConditionType, Triggers } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
import { MainTriggerPanel } from './TriggerPanels/MainTriggerPanel'
import { TriggerInfoPanel, selectTriggerDetails } from './TriggerPanels/TriggerInfoPanel'
import { AddTriggerPanel } from './TriggerPanels/AddTriggerPanel'
import { resetTriggerConditionsPanel, updateTriggerConditionPanel } from './TriggerPanels/TriggerConditionsPanel'
import { visibleComponent } from '../EditAssetPanel'
import { resetTriggerActionsPanel, updateTriggerActionsPanel } from './TriggerPanels/TriggerActionsPanel'

export let triggerView = "main"
export let triggerInfoView = "main"
export let editingTrigger = false

export function enableTriggerEdit(value:boolean){
    editingTrigger = value

    if(value){
        updateTriggerView("main") 
    }
}

export function resetTriggerPanels(){
    resetTriggerConditionsPanel()
}

export function updateTriggerView(value:string, triggerId?:string){
    triggerView = value

    if(value === "info"){
        triggerInfoView = "main"

        resetTriggerConditionsPanel()
        resetTriggerActionsPanel()
        selectTriggerDetails(triggerId)
    }
}

export function updateTriggerInfoView(value:string){
    triggerInfoView = value

    switch(triggerInfoView){
        case 'conditions':
            updateTriggerConditionPanel()
            break;

        case 'actions':
            updateTriggerActionsPanel()
            break;

        default:
            resetTriggerPanels()
            break;
    }
}

// function selectTriggerButton(index:number){
//     newTriggerData.input = index
//     update('edit', {id:newTriggerData.id, data:{input:index}})
// }

// function getEntityActionList(){
//     if(entitiesWithActions.length === 0){
//         return []
//     }
//     let actions = entitiesWithActions[entityIndex > 0 ? entityIndex-1 : 0].actions
//     return actions.map((item:any) => item.name)
// }

// function selectEntityActionIndex(index:number){
//     entityActionIndex = index
// }

/// views
export function EditTrigger(){
    return (
        <UiEntity
        key={resources.slug + "advanced::trigger:panel::ui"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: editingTrigger && visibleComponent === COMPONENT_TYPES.TRIGGER_COMPONENT ? 'flex' : 'none',
            }}
        >

        {/* main trigger panel view */}
        <MainTriggerPanel/>

                {/* add trigger panel view */}
                <AddTriggerPanel/>

            {/* trigger info panel view */}
            <TriggerInfoPanel/>

        </UiEntity>
    )
}


export function update(action:string, triggerData:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET,
        {
            component:COMPONENT_TYPES.TRIGGER_COMPONENT,
            aid:selectedItem.aid,
            sceneId:selectedItem.sceneId,
            action:action,
            data:triggerData,
        }
    )
}