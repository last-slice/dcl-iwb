import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import resources from '../../../../helpers/resources'
import { COMPONENT_TYPES, TriggerConditionType } from '../../../../helpers/types'
import { selectedItem } from '../../../../modes/Build'
import { sizeFont, calculateImageDimensions, getAspect, getImageAtlasMapping } from '../../../helpers'
import { setUIClicked } from '../../../ui'
import { uiSizes } from '../../../uiConfig'
import { editingTrigger, triggerInfoView, triggerView, update } from '../EditTrigger'
import { getAllAssetNames } from '../../../../components/Name'
import { colyseusRoom } from '../../../../components/Colyseus'
import { selectedTrigger } from './TriggerInfoPanel'
import { utils } from '../../../../helpers/libraries'

let entities:any[] = []
let entityConditions:any[] = []
let entityStates:any[] = []
let currentConditions:any[] = []
let operators:any[] = ["AND", "OR"]

let selectedEntityIndex:number = 0
let selectedConditionIndex:number = 0
let selectedOperatorIndex:number = 0

let newCondition:any = {}

export function updateTriggerConditionPanel(){
    entities.length = 0
    entities = getAllAssetNames(selectedItem.sceneId)

    getCurrentConditions()
    selectedOperatorIndex = operators.findIndex($=> selectedTrigger.operator)
}

function getCurrentConditions(){
    currentConditions.length = 0
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(scene){
        let triggerData = scene[COMPONENT_TYPES.TRIGGER_COMPONENT].get(selectedItem.aid)
        if(triggerData){
            let trigger = triggerData.triggers.find((trigger:any) => trigger.id === selectedTrigger.id)
            if(trigger){
                trigger.caid.forEach((caid:string, index:number)=>{
                    let itemInfo = scene[COMPONENT_TYPES.NAMES_COMPONENT].get(caid)
                    if(itemInfo){
                        currentConditions.push({triggerId:selectedTrigger.id, index:index, entityName:itemInfo.value, type: trigger.ctype[index], value:trigger.cvalue[index] ? trigger.cvalue[index] : undefined, counter:trigger.ccounter[index] ? trigger.ccounter[index] : undefined})
                    }
                })
            }
        }
    }
}

export function resetTriggerConditionsPanel(){
    entities.length = 0
    entityConditions.length = 0
    entityStates.length = 0
    selectedEntityIndex = 0
    selectedConditionIndex = 0
    newCondition = {}
}

export function TriggerConditionsPanel(){
    return(
        <UiEntity
            uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            alignContent:'center',
            width: '100%',
            height: '100%',
            display: triggerInfoView === "conditions" ? "flex" : "none"
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
                display: currentConditions.length > 0 ? "flex" : 'none'
            }}
                uiText={{value:"Add Condition Operator", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
            />

             {/* condition operator dropdown */}
        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent:'center',
                width: '100%',
                height: '10%',
                margin:{top:"1%"}
            }}
            >

            <Dropdown
                options={[...operators]}
                selectedIndex={selectedOperatorIndex}
                onChange={selectConditionOperatorIndex}
                uiTransform={{
                    width: '100%',
                    height: '100%',
                }}
                color={Color4.White()}
                fontSize={sizeFont(20, 15)}
            />

            </UiEntity>

        {/* condition entity dropdown */}
        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent:'center',
                width: '100%',
                height: '10%',
                margin:{top:"1%"}
            }}
            >

            <Dropdown
                options={[...["Select Entity"], ...entities.map($=> $.name)]}
                selectedIndex={selectedEntityIndex}
                onChange={selectConditionEntityIndex}
                uiTransform={{
                    width: '100%',
                    height: '100%',
                }}
                color={Color4.White()}
                fontSize={sizeFont(20, 15)}
            />

            </UiEntity>

                   {/* condition dropdown */}
        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent:'center',
                width: '100%',
                height: '10%',
                margin:{top:"1%"},
                display: selectedEntityIndex !== 0 ? "flex" : "none"
            }}
            >

            <Dropdown
                // options={[...["Select Entity"], ...getEntityList()]}
                options={[...["Select Condition"], ...entityConditions.length > 0 ? entityConditions.map($=> $.condition.replace(/_/g, " ")) : []]}
                selectedIndex={selectedConditionIndex}
                onChange={selectConditionIndex}
                uiTransform={{
                    width: '100%',
                    height: '100%',
                }}
                color={Color4.White()}
                fontSize={sizeFont(20, 15)}
            />

            </UiEntity>


     {/* condition state value dropdown */}
        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent:'center',
                width: '100%',
                height: '10%',
                margin:{top:"1%"},
                display: newCondition.condition && newCondition.condition.type === COMPONENT_TYPES.STATE_COMPONENT ? "flex" : "none"
            }}
            >

            <Dropdown
                // options={[...["Select Entity"], ...getEntityList()]}//
                options={[...["Select Condition States"], ...entityStates]}
                selectedIndex={0}
                onChange={(index:number)=>{
                    newCondition.value = entityStates[index-1]
                }}
                uiTransform={{
                    width: '100%',
                    height: '100%',
                }}
                color={Color4.White()}
                fontSize={sizeFont(20, 15)}
            />

            </UiEntity>


     {/* condition counter value dropdown */}
     <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent:'center',
                width: '100%',
                height: '10%',
                margin:{top:"1%", bottom:"1%"},
                display: newCondition.condition && newCondition.condition.type === COMPONENT_TYPES.COUNTER_COMPONENT ? "flex" : "none"
            }}
            >

                <Input
            onChange={(value) => {
                newCondition.counter = parseFloat(value.trim())
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'enter counter number'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
            ></Input>

            </UiEntity>

            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf:'flex-start',
                margin:{top:"1%"},
                width: calculateImageDimensions(10, getAspect(uiSizes.buttonPillBlack)).width,
                height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            uiText={{
                value: "Add Condition",
                fontSize: sizeFont(25, 15),
                color: Color4.White(),
                textAlign: 'middle-center'
            }}
            onMouseDown={() => {
                setUIClicked(true)
                newCondition.aid = entities[selectedEntityIndex-1].aid
                console.log('new condition is', newCondition)

                update("addcondition", {...newCondition,...{tid:selectedTrigger.id}})
                selectedEntityIndex = 0
                selectedConditionIndex = 0
                newCondition = {}

                utils.timers.setTimeout(()=>{getCurrentConditions()}, 200)
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
    alignContent:'center',
    width: '100%',
    height: '10%',
}}
    uiText={{value:"Current Conditions", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
/>

<UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignContent:'center',
    width: '100%',
    height: '45%',
}}
>

    {selectedItem && 
    selectedItem.enabled && 
    editingTrigger && 
    triggerView === "info" && 
    triggerInfoView === "conditions" && 

    getTriggerConditions()
    }
    
</UiEntity>

            </UiEntity>
    )
}

export function TriggerConditionRow(info:any){
    let data:any = info.data
    return(
        <UiEntity
        key={resources.slug + "trigger-condition-row-"+ info.rowCount}
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
                margin:{top:"1%", bottom:'1%', left:"2%", right:'2%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.rowPillDark)}}
                >

            {/* condition name column */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
                height: '100%',
                margin:{left:'2%'}
            }}
            uiText={{textWrap:'nowrap', value:"" + (data.entityName.length > 20 ? data.entityName.substring(0, 20) + "..." : data.entityName), textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
            />

             <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30%', 
                height: '100%',
            }}
            uiText={{textWrap:'nowrap', value:"" + (getConditionValue(data.type)), fontSize:sizeFont(20,15), color:Color4.White()}}
            />

                <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '10%', 
                height: '100%',
            }}
            uiText={{textWrap:'nowrap', value:"" + (data.value ? data.value : data.counter ? data.counter : ""), fontSize:sizeFont(20,15), color:Color4.White()}}
            />

            {/* action edit buttons column */}
            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '10%',
                height: '100%',
            }}
            >

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).width,
                    height: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).height,
                    margin:{left:"1%"}
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas1.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.trashButton)
                }}
                onMouseDown={() => {
                    console.log('data is', data)
                    update("deletecondition", {tid: data.triggerId, index:data.index})
                    utils.timers.setTimeout(()=>{getCurrentConditions()}, 200)
                }}
            />
                </UiEntity>

            </UiEntity>
    )
}

function getConditionValue(condition:any){
    switch(condition){
        case TriggerConditionType.WHEN_COUNTER_EQUALS:
            return "Counter = "
        case TriggerConditionType.WHEN_COUNTER_IS_GREATER_THAN:
            return "Counter > "
        case TriggerConditionType.WHEN_COUNTER_IS_LESS_THAN:
            return "Counter < "
        case TriggerConditionType.WHEN_STATE_IS:
            return "State = "
        case TriggerConditionType.WHEN_STATE_IS_NOT:
            return "State != "
        case TriggerConditionType.WHEN_PREVIOUS_STATE_IS:
            return "Prev State = "
        case TriggerConditionType.WHEN_PREVIOUS_STATE_IS_NOT:
            return "Prev State != "
    }
}

function updateEntityConditions(aid:string){
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }

    let states = scene[COMPONENT_TYPES.STATE_COMPONENT].get(aid)
    if(states){
        let conditions = [...Object.values(TriggerConditionType)]
        entityConditions.push({type:COMPONENT_TYPES.STATE_COMPONENT, condition:conditions.find($=> $ === TriggerConditionType.WHEN_STATE_IS)})
        entityConditions.push({type:COMPONENT_TYPES.STATE_COMPONENT, condition:conditions.find($=> $ === TriggerConditionType.WHEN_STATE_IS_NOT)})
        entityConditions.push({type:COMPONENT_TYPES.STATE_COMPONENT, condition:conditions.find($=> $ === TriggerConditionType.WHEN_PREVIOUS_STATE_IS)})
        entityConditions.push({type:COMPONENT_TYPES.STATE_COMPONENT, condition:conditions.find($=> $ === TriggerConditionType.WHEN_PREVIOUS_STATE_IS_NOT)})//
    }

    let counters = scene[COMPONENT_TYPES.COUNTER_COMPONENT].get(aid)
    if(counters){
        let conditions = [...Object.values(TriggerConditionType)]
        entityConditions.push({type:COMPONENT_TYPES.COUNTER_COMPONENT, condition:conditions.find($=> $ === TriggerConditionType.WHEN_COUNTER_EQUALS)})
        entityConditions.push({type:COMPONENT_TYPES.COUNTER_COMPONENT, condition:conditions.find($=> $ === TriggerConditionType.WHEN_COUNTER_IS_LESS_THAN)})
        entityConditions.push({type:COMPONENT_TYPES.COUNTER_COMPONENT, condition:conditions.find($=> $ === TriggerConditionType.WHEN_COUNTER_IS_GREATER_THAN)})
    }
}

function updateEntityStates(aid:string){
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }

    let states = scene[COMPONENT_TYPES.STATE_COMPONENT].get(aid)
    if(!states){
        return
    }

    states.values.forEach((state:any)=>{
        entityStates.push(state)
    })
}

function selectConditionEntityIndex(index:number){
    selectedEntityIndex = index
    if(index !== 0){
        updateEntityConditions(entities[index-1].aid)
        updateEntityStates(entities[index-1].aid)
    }
}

function selectConditionOperatorIndex(index:number){
    selectedOperatorIndex = index
    update("edit", {conditionperator:operators[index]})
}

function selectConditionIndex(index:number){
    selectedConditionIndex = index
    if(index !== 0){
        newCondition.condition = entityConditions[index-1]
        console.log('new condition is', newCondition)
    }
}

function getTriggerConditions(justCount?:boolean){
    let arr:any[] = []
    let count = 0
    currentConditions.forEach((condition:any, i:number)=>{
        arr.push(<TriggerConditionRow data={{triggerId:condition.triggerId, index:condition.index, entityName:condition.entityName, type: condition.type, value:condition.value, counter:condition.counter}} rowCount={count} />)
        count++
    })
    return arr
    // let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    // if(scene){
    //     let triggerData = scene[COMPONENT_TYPES.TRIGGER_COMPONENT].get(selectedItem.aid)
    //     if(triggerData){
    //         let trigger = triggerData.triggers.find((trigger:any) => trigger.id === selectedTrigger.id)
    //         if(trigger){
    //             trigger.caid.forEach((caid:string, index:number)=>{
    //                 let itemInfo = scene[COMPONENT_TYPES.NAMES_COMPONENT].get(caid)
    //                 if(itemInfo){
    //                     if(justCount){}
    //                     else{
    //                         arr.push(<TriggerConditionRow data={{triggerId:selectedTrigger.id, index:index, entityName:itemInfo.value, type: trigger.ctype[index], value:trigger.cvalue[index] ? trigger.cvalue[index] : undefined, counter:trigger.ccounter[index] ? trigger.ccounter[index] : undefined}} rowCount={count} />)
    //                     }
    //                     count++
    //                 }
    //             })
    //         }
    //     }
    // }
    // if(justCount){
    //     return count
    // }else{
    //     return arr
    // }

}