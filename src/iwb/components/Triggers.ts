import { Entity, InputAction, PointerEvents, engine, pointerEventsSystem } from "@dcl/sdk/ecs";
import { COMPONENT_TYPES, COUNTER_VALUE, TriggerConditionOperation, TriggerConditionType, Triggers } from "../helpers/types";
import mitt, { Emitter } from "mitt";
import { getActionEvents } from "./Actions";
import { getCounterComponentByAssetId, getCounterValue } from "./Counter";
import { getEntity } from "./IWB";
import { States, getCurrentValue, getPreviousValue } from "./States";

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
  scene.triggers.onAdd((assetTrigger:any, aid:any)=>{
    !scene.components.includes(COMPONENT_TYPES.TRIGGER_COMPONENT) ? scene.components.push(COMPONENT_TYPES.TRIGGER_COMPONENT) : null

    let info = getEntity(scene, aid)
    if(!info){
        return
    }

    
    assetTrigger.triggers.onAdd((trigger:any, index:any)=>{
      trigger.listen("tick", (c:any, p:any)=>{
          updateTriggerEvents(scene, info, trigger)
      })
    })
  })
  engine.addSystem(PlayTriggerSystem)
}

function updateTriggerEvents(scene:any, entityInfo:any, trigger:any){
  const triggerEvents = getTriggerEvents(entityInfo.entity)
  triggerEvents.off(trigger.type)

  triggerEvents.on(trigger.type, (pointerEvent:any)=>{
    console.log('trigger action ', trigger)
    if(trigger.type === Triggers.ON_INPUT_ACTION && !checkInputAction(trigger.input, pointerEvent)){
      console.log('not the correct input action')
      return
    }
      if(checkConditions(scene, trigger, entityInfo.aid, entityInfo.entity)){
        console.log('passed check conditions')
          for(const triggerAction of trigger.actions){
              if(isValidAction(triggerAction)){
                console.log('is valid action')
                  let {aid, action, entity} = getActionsByActionId(scene, triggerAction)
                  if(aid){
                    console.log('action id is', action)
                      actionQueue.push({aid:aid, action:action, entity:entity})
                  }
              }
          }
      }else{
          console.log('trigger condition not met')//
      }
  })
}

function isValidAction(action: string /*TriggerAction*/) {
    // const { id, /*name*/ } = action
    return !!action //&& !!name
}

function checkInputAction(triggerInput:any, input:InputAction){
    return triggerInput === input
}

function checkConditions(scene:any, trigger:any, aid:string, entity:Entity) {
    if (trigger.conditions && trigger.conditions.length > 0) {
      const conditions = trigger.conditions.map((condition:any) => checkCondition(scene, aid, entity, condition))
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
      return true
    }
    return true
  }

  function checkCondition(scene:any, aid:string, entity:Entity, condition:any) {
    // const entity = getEntityByCondition(condition)
    // if (entity) {
      try {
        switch (condition.type) {
          case TriggerConditionType.WHEN_STATE_IS: {
            const states = States.getOrNull(entity)
            if (states !== null) {
              const currentValue = getCurrentValue(states)
              return currentValue === condition.value
            }
            break
          }
          case TriggerConditionType.WHEN_STATE_IS_NOT: {
            const states = States.getOrNull(entity)
            if (states !== null) {
              const currentValue = getCurrentValue(states)
              return currentValue !== condition.value
            }
            break
          }
          case TriggerConditionType.WHEN_PREVIOUS_STATE_IS: {
            const states = States.getOrNull(entity)
            if (states !== null) {
              const previousValue = getPreviousValue(states)
              return previousValue === condition.value
            }
            break
          }
          case TriggerConditionType.WHEN_PREVIOUS_STATE_IS_NOT: {
            const states = States.getOrNull(entity)
            if (states !== null) {
              const previousValue = getPreviousValue(states)
              return previousValue !== condition.value
            }
            break
          }
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
    console.log('handle input trigger for entity', entity, input)
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

        console.log('emitting action', action)
        actionEvents.emit(action.id, action)
      }
}

