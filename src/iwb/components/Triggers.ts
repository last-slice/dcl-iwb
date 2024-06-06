import { Entity, InputAction, PointerEvents, engine, pointerEventsSystem } from "@dcl/sdk/ecs";
import { COMPONENT_TYPES, COUNTER_VALUE, TriggerConditionOperation, TriggerConditionType, Triggers } from "../helpers/types";
import mitt, { Emitter } from "mitt";
import { getActionEvents } from "./Actions";
import { getCounterComponentByAssetId, getCounterValue } from "./Counter";
import { getEntity } from "./IWB";

// const actionQueue: { entity: Entity; action: Action }[] = []
const actionQueue:any[] = []

const triggers = new Map<Entity, Emitter<Record<Triggers, any>>>()

export function getTriggerEvents(entity: Entity) {
    if (!triggers.has(entity)) {
      triggers.set(entity, mitt())
    }
    return triggers.get(entity)!
}

export function triggerListener(scene:any){
  scene.triggers.onAdd((trigger:any, aid:any)=>{
    !scene.components.includes(COMPONENT_TYPES.TRIGGER_COMPONENT) ? scene.components.push(COMPONENT_TYPES.TRIGGER_COMPONENT) : null

    let info = getEntity(scene, aid)
    if(!info){
        return
    }

    const triggerEvents = getTriggerEvents(info.entity)
    triggerEvents.on(trigger.type, (pointerEvent:any)=>{
        if(checkInputAction(trigger.input, pointerEvent) && checkConditions(scene, trigger, aid, info.entity)){
            for(const triggerAction of trigger.actions){
                if(isValidAction(triggerAction)){
                    let {aid, action, entity} = getActionsByActionId(scene, triggerAction)
                    if(aid){
                        actionQueue.push({aid:aid, action:action, entity:entity})
                    }
                }
            }
        }else{
            // console.log('trigger condition not met')
        }
    })
})


  engine.addSystem(PlayTriggerSystem)
}

// export function addTriggerComponent(scene:any){
//     scene.triggers.forEach((triggers:any, aid:string)=>{
//         let info = scene.parenting.find((entity:any)=> entity.aid === aid)
//         if(info.entity){
//             triggers.triggers.forEach((trigger:any)=>{
//                 // switch(trigger.type){
//                 //     case Triggers.ON_INPUT_ACTION:
//                 //         initOnInputActionTrigger(info.entity, trigger)
//                 //         break;
//                 // }

//                 const triggerEvents = getTriggerEvents(info.entity)
//                 triggerEvents.on(trigger.type, (pointerEvent:any)=>{
//                     if(checkInputAction(trigger.input, pointerEvent) && checkConditions(scene, trigger, aid, info.entity)){
//                         for(const triggerAction of trigger.actions){
//                             if(isValidAction(triggerAction)){
//                                 let {aid, action, entity} = getActionsByActionId(scene, triggerAction)
//                                 if(aid){
//                                     actionQueue.push({aid:aid, action:action, entity:entity})
//                                 }
//                             }
//                         }
//                     }else{
//                         // console.log('trigger condition not met')
//                     }
//                 })
//             })
//         }
//     })


//     engine.addSystem(PlayTriggerSystem)
// }

function isValidAction(action: string /*TriggerAction*/) {
    // const { id, /*name*/ } = action
    return !!action //&& !!name
}

function checkInputAction(triggerInput:any, input:InputAction){
    return triggerInput === input
}

function checkConditions(scene:any, trigger:any, aid:string, entity:Entity) {
    if (trigger.conditions && trigger.conditions.length > 0) {
      const conditions = trigger.conditions.map((condition:any) => checkCondition(scene, aid, condition))
      const isTrue = (result?: boolean) => !!result
      const operation = trigger.operation || TriggerConditionOperation.AND
      switch (operation) {
        case TriggerConditionOperation.AND: {
          return conditions.every(isTrue)
        }
        case TriggerConditionOperation.OR: {
          return conditions.some(isTrue)
        }
      }
    // return true//
    }
    return true
  }

  function checkCondition(scene:any, aid:string, condition:any) {
    // const entity = getEntityByCondition(condition)
    // if (entity) {
      try {
        switch (condition.type) {
        //   case TriggerConditionType.WHEN_STATE_IS: {
        //     const states = States.getOrNull(entity)
        //     if (states !== null) {
        //       const currentValue = getCurrentValue(states)
        //       return currentValue === condition.value
        //     }
        //     break
        //   }
        //   case TriggerConditionType.WHEN_STATE_IS_NOT: {
        //     const states = States.getOrNull(entity)
        //     if (states !== null) {
        //       const currentValue = getCurrentValue(states)
        //       return currentValue !== condition.value
        //     }
        //     break
        //   }
        //   case TriggerConditionType.WHEN_PREVIOUS_STATE_IS: {
        //     const states = States.getOrNull(entity)
        //     if (states !== null) {
        //       const previousValue = getPreviousValue(states)
        //       return previousValue === condition.value
        //     }
        //     break
        //   }
        //   case TriggerConditionType.WHEN_PREVIOUS_STATE_IS_NOT: {
        //     const states = States.getOrNull(entity)
        //     if (states !== null) {
        //       const previousValue = getPreviousValue(states)
        //       return previousValue !== condition.value
        //     }
        //     break
        //   }
          case TriggerConditionType.WHEN_COUNTER_EQUALS: {
            let counter = getCounterComponentByAssetId(scene, aid, condition.counter)
            if(!counter){
              return false
            }

            if(counter.currentValue){
              const numeric = Number(condition.value)
              if (!isNaN(numeric)) {
                return counter.currentValue === numeric
              }
            }

            // const value = getCounterValue(scene.id, aid, condition.counter, COUNTER_VALUE.CURRENT)
            // if(value !== ""){
            //   const numeric = Number(condition.value)
            //   if (!isNaN(numeric)) {
            //     return value === numeric
            //   }
            // }
            break
          }

          case TriggerConditionType.WHEN_COUNTER_IS_GREATER_THAN: {
            let counter = getCounterComponentByAssetId(scene, aid, condition.counter)
            if(!counter){
              return false
            }

            if(counter.currentValue){
              const numeric = Number(condition.value)
              if (!isNaN(numeric)) {
                return counter.currentValue > numeric
              }
            }

            // const value = getCounterValue(scene.id, aid, condition.counter, COUNTER_VALUE.CURRENT)
            // if(value !== ""){
            //     const numeric = Number(condition.value)
            //     console.log('counter number is ', numeric)
            //     if (!isNaN(numeric)) {
            //         console.log('counter is greater than ', value, numeric)
            //       return value > numeric
            //     }   
            // }
            break
          }
          case TriggerConditionType.WHEN_COUNTER_IS_LESS_THAN: {
            let counter = getCounterComponentByAssetId(scene, aid, condition.counter)
            if(!counter){
              return false
            }

            if(counter.currentValue){
              const numeric = Number(condition.value)
              if (!isNaN(numeric)) {
                return counter.currentValue < numeric
              }
            }

            // const counter = Counter.getOrNull(entity)
            // if (counter !== null) {
            //   const numeric = Number(condition.value)
            //   if (!isNaN(numeric)) {
            //     return counter.value < numeric
            //   }
            // }
            break
          }
        //   case TriggerConditionType.WHEN_DISTANCE_TO_PLAYER_LESS_THAN: {
        //     const position = getWorldPosition(entity)

        //     const numeric = Number(condition.value)
        //     if (!isNaN(numeric)) {
        //       return Vector3.distance(position, getPlayerPosition()) < numeric
        //     }

        //     break
        //   }
        //   case TriggerConditionType.WHEN_DISTANCE_TO_PLAYER_GREATER_THAN: {
        //     const position = getWorldPosition(entity)
        //     const numeric = Number(condition.value)
        //     if (!isNaN(numeric)) {
        //       return Vector3.distance(position, getPlayerPosition()) > numeric
        //     }
        //     break
        //   }
        }
      } catch (error) {
        console.error('Error in condition', condition)
      }
    // }
    return false
  }

function getActionsByActionId(scene:any, actionId:string) {
    let assets = scene.actions.toJSON()
    for(let aid in assets){
        let actions = assets[aid].actions
        let found = actions.find(($: { id: string; })=> $.id === actionId)
        let info = getEntity(scene, aid)

        if(found && info.entity){
            return {aid:aid, action:found, entity:info.entity}
        }
    }
    return {}
}

export function handleInputTriggerForEntity(entity:Entity, input:InputAction){
    const triggerEvents = getTriggerEvents(entity)
    triggerEvents.emit(Triggers.ON_INPUT_ACTION, input)
}

function initOnInputActionTrigger(entity:Entity, trigger:any){
    // console.log('adding input action trigger')
    // const pointerEvent = PointerEvents.getOrNull(entity)
//
    // const opts = {
    //   button:
    //     pointerEvent?.pointerEvents[0].eventInfo?.button ||
    //     InputAction.IA_PRIMARY,
    //   ...(pointerEvent === null ? { hoverText: 'Press' } : {}),
    // }

    // pointerEventsSystem.onPointerDown(
    //   {
    //     entity,
    //     opts,
    //   },
    //   () => {
    //     const triggerEvents = getTriggerEvents(entity)
    //     triggerEvents.emit(Triggers.ON_INPUT_ACTION, {input: })
    //   },
    // )
}

export function PlayTriggerSystem(dt:number){
    while (actionQueue.length > 0) {
        const { entity, action, aid } = actionQueue.shift()!
        const actionEvents = getActionEvents(entity)
        actionEvents.emit(action.id, action)
      }
}

