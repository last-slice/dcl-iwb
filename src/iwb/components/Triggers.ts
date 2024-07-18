import { Entity, InputAction, PointerEventType, PointerEvents, engine, pointerEventsSystem } from "@dcl/sdk/ecs";
import { COMPONENT_TYPES, COUNTER_VALUE, TriggerConditionOperation, TriggerConditionType, Triggers } from "../helpers/types";
import mitt, { Emitter } from "mitt";
import { getActionEvents } from "./Actions";
import { getCounterComponentByAssetId } from "./Counter";
import { getEntity } from "./IWB";
import { States, getCurrentValue, getPreviousValue } from "./States";
import { tickSet } from "./Timer";
import { utils } from "../helpers/libraries";
import { LAYER_1, NO_LAYERS } from "@dcl-sdk/utils";
import { Color3 } from "@dcl/sdk/math";
import { getAssetIdByEntity } from "./Parenting";

export const actionQueue:any[] = []

// const triggers = new Map<Entity, Emitter<Record<Triggers, any>>>()
const triggers = new Map<Entity, any>()

export function checkTriggerComponent(scene:any, entityInfo:any){
  let itemInfo = scene[COMPONENT_TYPES.TRIGGER_COMPONENT].get(entityInfo.aid)
  if(itemInfo){
    itemInfo.triggers.forEach((trigger:any)=>{
      switch(trigger.type){
        case Triggers.ON_TICK:
          initOnTick(entityInfo.entity)
          break

        case Triggers.ON_INPUT_ACTION:
          initOnInputActionTrigger(entityInfo.entity, trigger)
          break;
      }
    })

    if(itemInfo.isArea){
      let transform = scene[COMPONENT_TYPES.TRANSFORM_COMPONENT].get(entityInfo.aid)
      if(transform){
        utils.triggers.addTrigger(entityInfo.entity, NO_LAYERS, LAYER_1,
          [{type:'box',
            scale: transform.scale
          }],
          ()=>{
            const triggerEvents = getTriggerEvents(entityInfo.entity)
          triggerEvents.emit(Triggers.ON_ENTER, {input:0, pointer:0, entity:entityInfo.entity})
          },
          ()=>{
            const triggerEvents = getTriggerEvents(entityInfo.entity)
          triggerEvents.emit(Triggers.ON_LEAVE, {input:0, pointer:0, entity:entityInfo.entity})
          },
          Color3.create(236/255,209/255,92/255)
        )
      }
    }
  }
}

export function getTriggerEvents(entity: Entity) {
    if (!triggers.has(entity)) {
      triggers.set(entity, new MittWrapper())
    }
    return triggers.get(entity)!
}

export function triggerListener(scene:any){
  scene[COMPONENT_TYPES.TRIGGER_COMPONENT].onAdd((assetTrigger:any, aid:any)=>{
    // let iwbInfo = scene[COMPONENT_TYPES.PARENTING_COMPONENT].find(($:any)=> $.aid === aid)
    // if(!iwbInfo.components.includes(COMPONENT_TYPES.TRIGGER_COMPONENT)){
    //   iwbInfo.components.push(COMPONENT_TYPES.TRIGGER_COMPONENT)
    // }

    let info = getEntity(scene, aid)
    if(!info){
        return
    }

    
    assetTrigger.triggers.onAdd((trigger:any, index:any)=>{
      trigger.listen("tick", (c:any, p:any)=>{
          console.log('trigger is', trigger, info.entity)
          updateTriggerEvents(scene, info, trigger)
      })
    })
  })
}

function updateTriggerEvents(scene:any, entityInfo:any, triggerInfo:any){
  const triggerEvents = getTriggerEvents(entityInfo.entity)

  if(triggerInfo.type === Triggers.ON_INPUT_ACTION && triggerEvents.isListening(triggerInfo.type)){
    console.log('alreadly listening for input trigger on entity', entityInfo.entity)
    return
  }

    triggerEvents.on(triggerInfo.type, (triggerEvent:any)=>{
      console.log('trigger event', triggerInfo, triggerEvent)
      let trigger = findTrigger(scene, triggerEvent)
      if(!trigger){
        console.log('cant find trigger')
        return
      }
        if(checkConditions(scene, trigger, entityInfo.aid, entityInfo.entity)){
          console.log('passed check conditions')
            for(const triggerAction of triggerInfo.actions){
              // console.log('trigger actions area', triggerAction)
                if(isValidAction(triggerAction)){
                  console.log('is valid action')
                    let {aid, action, entity} = getActionsByActionId(scene, triggerAction)
                    if(aid){
                      // console.log('action info is', {aid:aid, action:action, entity:entity})
                        actionQueue.push({aid:aid, action:action, entity:entity})
                    }
                }
            }
        }else{
            console.log('trigger condition not met')
        }
    })
}

function findTrigger(scene:any, triggerEvent:any){
  let aid = getAssetIdByEntity(scene, triggerEvent.entity)
  // console.log('trigger aid is', aid)
  if(!aid){
    return false
  }
    let triggers = scene[COMPONENT_TYPES.TRIGGER_COMPONENT].get(aid)
    if(!triggers){
      return false
    }
    // console.log('triggers', triggers)
    // console.log('trigger found', triggers.triggers.find(($:any)=> $.input === triggerEvent.input && $.pointer === triggerEvent.pointer))
    return triggers.triggers.find(($:any)=> $.input === triggerEvent.input && $.pointer === triggerEvent.pointer)
}

function isValidAction(action: string /*TriggerAction*/) {
    // const { id, /*name*/ } = action//
    return !!action //&& !!name
}

function checkConditions(scene:any, trigger:any, aid:string, entity:Entity) {
    if (trigger.caid && trigger.caid.length > 0) {
      let triggerConditions:any[] = []
      trigger.caid.forEach((caid:string, index:number)=>{
        triggerConditions.push(
          {
            aid:caid, 
            type:trigger.ctype[index], 
            value:trigger.cvalue[index],
            counter: trigger.ccounter[index]
          })
      })
      const conditions = triggerConditions.map((condition:any) => checkCondition(scene, aid, entity, condition))
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

  function checkCondition(scene:any, aid:string, triggerEntity:Entity, condition:any) {
      try {
        let actionEntity = getEntity(scene, condition.aid)
        if(actionEntity){
          let entity = actionEntity.entity
          console.log('checking condition', condition)
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
              console.log('condition counter is', counter)
              if(!counter){
                return false
              }
  
              if(counter.currentValue){
                const numeric = Number(condition.counter)
                if (!isNaN(numeric)) {
                  return counter.currentValue === numeric
                }
              }
              break
            }
  
            case TriggerConditionType.WHEN_COUNTER_IS_GREATER_THAN: {
              let counter = getCounterComponentByAssetId(scene, aid, condition.counter)
              if(!counter){
                return false
              }
  
              if(counter.currentValue){
                const numeric = Number(condition.counter)
                if (!isNaN(numeric)) {
                  return counter.currentValue > numeric
                }
              }
              break
            }
            case TriggerConditionType.WHEN_COUNTER_IS_LESS_THAN: {
              let counter = getCounterComponentByAssetId(scene, aid, condition.counter)
              if(!counter){
                return false
              }

              if(counter.currentValue){
                const numeric = Number(condition.counter)
                console.log('numerica is', numeric)
                if (!isNaN(numeric)) {
                  return counter.currentValue < numeric
                }
              }
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
        }
      } catch (error) {
        console.error('Error in condition', condition)
      }
    return false
  }

function getActionsByActionId(scene:any, actionId:string) {
    let assets = scene[COMPONENT_TYPES.ACTION_COMPONENT].toJSON()
    // console.log('finding action by id', actionId)
    for(let aid in assets){
        let actions = assets[aid].actions
        // console.log('actions are', actions)
        let found = actions.find(($:any)=> $.id === actionId)
        let info = getEntity(scene, aid)

        if(found && info.entity){
            return {aid:aid, action:found, entity:info.entity}
        }
    }
    return {}
}

export function handleInputTriggerForEntity(entity:Entity, input:InputAction, pointer:PointerEventType){
    console.log('handle input trigger for entity', entity, input, pointer)
    const triggerEvents = getTriggerEvents(entity)
    triggerEvents.emit(Triggers.ON_INPUT_ACTION, {input:input, pointer:pointer, entity:entity})
}

function initOnInputActionTrigger(entity:Entity, trigger:any){
    // console.log('adding input action trigger')
    // const pointerEvent = PointerEvents.getOrNull(entity)

    // const opts = {
    //   maxDistance:15,
    //   button:
    //     pointerEvent?.pointerEvents[0].eventInfo?.button ||
    //     InputAction.IA_PRIMARY,
    //   ...(pointerEvent === null ? { hoverText: 'Press' } : {}),
    // }

    // console.log('options are', opts)

    // pointerEventsSystem.onPointerDown(
    //   {
    //     entity,
    //     opts:{button:InputAction.IA_POINTER, maxDistance:15, hoverText:'here', showFeedback:true},
    //   },
    //   () => {
    //     console.log('here clicking action')
    //     const triggerEvents = getTriggerEvents(entity)
    //     triggerEvents.emit(Triggers.ON_INPUT_ACTION, {input:InputAction.IA_POINTER, pointer:PointerEventType.PET_DOWN})
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

function initOnTick(entity:Entity){
  tickSet.add(entity)
}

export function disableTriggers(scene:any, entityInfo:any){
  let itemInfo = scene[COMPONENT_TYPES.TRIGGER_COMPONENT].get(entityInfo.aid)
  if(itemInfo){
    const triggerEvents = getTriggerEvents(entityInfo.entity)
    // triggerEvents.off("*", ()=>{
    //   console.log('disabling triggers')
    // })
    triggerEvents.remove()
    tickSet.delete(entityInfo.entity)
  }
}

export function setTriggersForPlayMode(scene:any, entityInfo:any){
  let itemInfo = scene[COMPONENT_TYPES.TRIGGER_COMPONENT].get(entityInfo.aid)
  if(itemInfo){
    itemInfo.triggers.forEach((trigger:any)=>{
      updateTriggerEvents(scene, entityInfo, trigger)
    })
    tickSet.add(entityInfo.entity)
  }
}

export function runGlobalTrigger(scene:any, type:Triggers, data:any){
  scene[COMPONENT_TYPES.PARENTING_COMPONENT].forEach((item:any)=>{
    let entityInfo = getEntity(scene, item.aid)
    if(entityInfo){
      data.entity = entityInfo.entity
      let triggerEvents = getTriggerEvents(entityInfo.entity)
      triggerEvents.emit(type, data)
    }
  })
}

class MittExtender {
  emitter:any
  callbacks:Map<string,Function>

  constructor(){
    this.emitter = mitt()
    this.callbacks = new Map()
  }
  on(type:Triggers, callback:any){
     if(!this.callbacks.has(type)){
      this.callbacks.set(type, callback)
     }

     this.emitter.on(type, callback)
     console.log('received event', type)
  }
  remove(){
    this.emitter.all.clear()
    this.callbacks.clear()
  }

  emit(type:Triggers, event:any) {
    this.emitter.emit(type, event);
  }

  isListening(type:Triggers) {
    return this.callbacks.has(type)// && this.listeners.get(type).has(handler);
  }
}


class MittWrapper {
  emitter:any
  listeners:Map<string,any>

  constructor() {
    this.emitter = mitt();
    this.listeners = new Map();
  }

  on(type:any, handler:any) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }else{
      const handlers = this.listeners.get(type);
      handlers.delete(handler)
    }

    const handlers = this.listeners.get(type);
    if (!handlers.has(handler)) {
      handlers.add(handler);
      this.emitter.on(type, handler);
    }
  }

  off(type:any, handler:any) {
    if (this.listeners.has(type)) {
      const handlers = this.listeners.get(type);
      if (handlers.has(handler)) {
        handlers.delete(handler);
        this.emitter.off(type, handler);

        // Clean up if there are no more handlers for this event type
        if (handlers.size === 0) {
          this.listeners.delete(type);
        }
      }
    }
  }

  remove(){
    this.emitter.all.clear()
    this.listeners.clear()
  }

  emit(type:any, event:any) {
    this.emitter.emit(type, event);
  }

  isListening(type:any, handler:any) {
    return this.listeners.has(type)// && this.listeners.get(type).has(handler);
  }
}