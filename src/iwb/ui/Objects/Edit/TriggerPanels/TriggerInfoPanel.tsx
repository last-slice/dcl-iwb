import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import resources from '../../../../helpers/resources'
import { COMPONENT_TYPES, ENTITY_POINTER_LABELS, POINTER_EVENTS, Triggers } from '../../../../helpers/types'
import { sizeFont } from '../../../helpers'
import { triggerInfoView, triggerView, update, updateTriggerInfoView } from '../EditTrigger'
import { colyseusRoom } from '../../../../components/Colyseus'
import { selectedItem } from '../../../../modes/Build'
import { TriggerConditionsPanel } from './TriggerConditionsPanel'
import { TriggerActionsPanel } from './TriggerActionsPanel'
import { setUIClicked } from '../../../ui'
import { utils } from '../../../../helpers/libraries'

export let selectedTrigger:any = {}

export function selectTriggerDetails(id:any){
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        deselectTriggerDetails()
        return
    }

    if(id){
        let triggers = scene[COMPONENT_TYPES.TRIGGER_COMPONENT].get(selectedItem.aid)
        if(!triggers){
            deselectTriggerDetails()
        }
        let trigger = triggers.triggers.find(($:any)=> $.id === id)
        if(!trigger){
            deselectTriggerDetails()
        }
        selectedTrigger = trigger
    }
    else{
        utils.timers.setTimeout(()=>{
            let triggers = scene[COMPONENT_TYPES.TRIGGER_COMPONENT].get(selectedItem.aid)
            if(triggers){
                console.log('triggers are', triggers.triggers)
                selectedTrigger = {...triggers.triggers[triggers.triggers.length-1]}
                console.log('trigger data is', selectedTrigger)
            }
        }, 200)
    }


}

export function deselectTriggerDetails(){
    selectedTrigger = {}
}

export function TriggerInfoPanel(){
    return(
        <UiEntity
        key={resources.slug + "trigger::info:panel"}
        uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignContent:'center',
        width: '100%',
        height: '100%',
        display: triggerView === "info" ? "flex" : "none"
        }}
    >
                <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent:'center',
            width: '100%',
            height: '10%',
        }}
            uiText={{value:"Trigger Type: " +  (selectedTrigger.type ? selectedTrigger.type.replace(/_/g, ' ').replace(/\b\w/g, (char:any) => char.toUpperCase()): ""), textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
        />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent:'center',
            width: '100%',
            height: '10%',//
            display: triggerInfoView !== "main" && selectedTrigger.type === Triggers.ON_INPUT_ACTION ? "flex" : "none"
            }}
            uiText={{value:"Input Type: " + (ENTITY_POINTER_LABELS[selectedTrigger.input] + (selectedTrigger.type === Triggers.ON_INPUT_ACTION ? ", Button: " + Object.values(POINTER_EVENTS)[selectedTrigger.pointer] : "")), textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
        />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            alignContent:'center',
            width: '100%',
            height: '30%',
            display: triggerInfoView === "main" ? "flex" : "none"
            }}
        >

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent:'center',
                width: '100%',
                height: '10%',
                margin:{bottom:"5%"},
                display: selectedTrigger.type && selectedTrigger.type === Triggers.ON_INPUT_ACTION ? "flex" : "none"
            }}//
                uiText={{value:"Input Button Type", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
            />

                    {/* trigger pointer button dropdown */}
                    <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '45%',
                margin:{bottom:'1%'},
                display: selectedTrigger.type && selectedTrigger.type === Triggers.ON_INPUT_ACTION ? "flex" : "none"
            }}
            >

                <Dropdown
                    options={[...ENTITY_POINTER_LABELS]}
                    selectedIndex={selectedTrigger.input ? selectedTrigger.input : 0}
                    onChange={(index:number)=>{
                        console.log('changing input')
                        update("edit", {id:selectedTrigger.id, input:index})
                    }}
                    uiTransform={{
                        width: '100%',
                        height: '120%',
                    }}
                    // uiBackground={{color:Color4.Purple()}}
                    color={Color4.White()}
                    fontSize={sizeFont(20, 15)}
                />

            </UiEntity>

                                {/* trigger pointer button dropdown */}
                                <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '45%',
                margin:{bottom:'1%'},
                display: selectedTrigger.type && selectedTrigger.type === Triggers.ON_INPUT_ACTION ? "flex" : "none"
            }}
            >

                <Dropdown
                    options={[...Object.values(POINTER_EVENTS)]}
                    selectedIndex={selectedTrigger.pointer ? selectedTrigger.pointer : 1}
                    onChange={(index:number)=>{
                        console.log('changing pointer')
                        update("edit", {id:selectedTrigger.id, pointer:index})
                    }}
                    uiTransform={{
                        width: '100%',
                        height: '120%',
                    }}
                    // uiBackground={{color:Color4.Purple()}}
                    color={Color4.White()}
                    fontSize={sizeFont(20, 15)}
                />

            </UiEntity>

        </UiEntity>


{/* trigger info main panel view */}
    <TriggerMainInfoPanel/>

     {/* trigger info conditions panel view */}
     <TriggerConditionsPanel/>

{/* trigger info actions panel view */}
        <TriggerActionsPanel/>


        </UiEntity>
    )
}

function TriggerMainInfoPanel(){
    return(
        <UiEntity
        key={resources.slug + "trigger::info::main::panel"}
        uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignContent:'center',
        width: '100%',
        height: '100%',
        display: triggerInfoView === "main" ? "flex" : "none"
        }}
    >
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin: {top: "2%"}
            }}
            uiBackground={{color: Color4.Black()}}
            uiText={{value: "Conditions", fontSize: sizeFont(30, 20)}}
            onMouseDown={() => {
                setUIClicked(true)
                updateTriggerInfoView("conditions")
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
        />
                    <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin: {top: "2%"}
            }}
            uiBackground={{color: Color4.Black()}}
            uiText={{value: "Actions", fontSize: sizeFont(30, 20)}}
            onMouseDown={() => {
                setUIClicked(true)
                updateTriggerInfoView("actions")
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
        />
        </UiEntity>
    )
}