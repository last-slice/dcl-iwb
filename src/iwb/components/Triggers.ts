import { Entity, InputAction, PointerEventType, PointerEvents, Transform, Tween, TweenState, TweenStateStatus, engine, pointerEventsSystem, tweenSystem } from "@dcl/sdk/ecs";
import { COMPONENT_TYPES, COUNTER_VALUE, SERVER_MESSAGE_TYPES, TriggerConditionOperation, TriggerConditionType, Triggers } from "../helpers/types";
import mitt, { Emitter } from "mitt";
import { getActionEvents } from "./Actions";
import { getCounterComponentByAssetId } from "./Counter";
import { getEntity } from "./IWB";
import { States, getCurrentValue, getPreviousValue } from "./States";
import { tickSet } from "./Timer";
import { utils } from "../helpers/libraries";
import { LAYER_1, NO_LAYERS } from "@dcl-sdk/utils";
import { Color3, Vector3 } from "@dcl/sdk/math";
import { getAssetIdByEntity } from "./Parenting";
import { colyseusRoom, sendServerMessage } from "./Colyseus";

export const actionQueue:any[] = []
export const decisionQueue:any[] = []

// const triggers = new Map<Entity, Emitter<Record<Triggers, any>>>()
const triggers = new Map<Entity, any>()

export function checkTriggerComponent(scene:any, entityInfo:any){
  let itemInfo = scene[COMPONENT_TYPES.TRIGGER_COMPONENT].get(entityInfo.aid)
  if(itemInfo){
    let hasEnter:any
    let hasLeave:any

    if(itemInfo.isArea){
      hasEnter = Triggers.ON_ENTER
      hasLeave = Triggers.ON_LEAVE
    }

    itemInfo.triggers.forEach((trigger:any)=>{
      switch(trigger.type){
        case Triggers.ON_CLOCK_TICK:
          initOnTick(entityInfo.entity)
          break

        case Triggers.ON_INPUT_ACTION:
          initOnInputActionTrigger(entityInfo.entity, trigger)
          break;

        case Triggers.ON_ENTER:
          hasEnter = Triggers.ON_ENTER
          break;

        case Triggers.ON_LEAVE:
          hasLeave = Triggers.ON_LEAVE
          break;

          case Triggers.ON_PICKUP:
            hasEnter = Triggers.ON_PICKUP
            break;
        
      }
    })

    if(hasEnter || hasLeave){
      let transform = scene[COMPONENT_TYPES.TRANSFORM_COMPONENT].get(entityInfo.aid)
      if(transform){
        console.log('trigger area scale', transform)
        itemInfo.trigger = utils.triggers.addTrigger(entityInfo.entity, NO_LAYERS, LAYER_1,
          [{type:'box',
            // position: Vector3.add(Transform.get(scene.parentEntity).position, transform.p),
            scale: itemInfo.isArea ? transform.r.y === 90 || transform.r.y === 180 ? Vector3.create(transform.s.z, transform.s.y, transform.s.x) : transform.s : Vector3.add(transform.s, Vector3.create(0.5,0.5,0.5))
          }],
          ()=>{
            if(hasEnter){
              const triggerEvents = getTriggerEvents(entityInfo.entity)
              triggerEvents.emit(Triggers.ON_ENTER, {input:0, pointer:0, entity:entityInfo.entity})
            }
          },
          ()=>{
            if(hasLeave){
              const triggerEvents = getTriggerEvents(entityInfo.entity)
              triggerEvents.emit(Triggers.ON_LEAVE, {input:0, pointer:0, entity:entityInfo.entity})
            }
          },
          Color3.create(236/255,209/255,92/255)
        )
      }
    }
  }
}

export function updateTriggerArea(scene:any, entityInfo:any, transform:any){
  console.log('updating trigger area')
  let triggerInfo = scene[COMPONENT_TYPES.TRIGGER_COMPONENT].get(entityInfo.aid)
  if(!triggerInfo){
    return
  }
  try{
    utils.triggers.setAreas(entityInfo.entity, [{type:'box',
      // position: Vector3.add(Transform.get(scene.parentEntity).position, transform.p),
      scale: triggerInfo.isArea ? transform.r.y === 90 || transform.r.y === 270 ? Vector3.create(transform.s.z, transform.s.y, transform.s.x) : transform.s : Vector3.add(transform.s, Vector3.create(0.5,0.5,0.5))
    }])
  }
  catch(e){
    console.log('error setting trigger area')
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

    //

    
    assetTrigger.triggers.onAdd((trigger:any, index:any)=>{
      trigger.listen("tick", (c:any, p:any)=>{
          console.log('trigger is', trigger, info.entity)
          updateTriggerEvents(scene, info, trigger)

          if(trigger.type === Triggers.ON_PICKUP && !info.trigger){
            let transform = scene[COMPONENT_TYPES.TRANSFORM_COMPONENT].get(info.aid)
            info.trigger = utils.triggers.addTrigger(info.entity, NO_LAYERS, LAYER_1,
              [{type:'box',
                // position: Vector3.add(Transform.get(scene.parentEntity).position, transform.p),
                scale: info.isArea ? transform.r.y === 90 || transform.r.y === 180 ? Vector3.create(transform.s.z, transform.s.y, transform.s.x) : transform.s : Vector3.add(transform.s, Vector3.create(0.5,0.5,0.5))
              }],
              ()=>{
                  const triggerEvents = getTriggerEvents(info.entity)
                  triggerEvents.emit(Triggers.ON_PICKUP, {input:0, pointer:0, entity:info.entity})
              },
              ()=>{
              },
              Color3.create(236/255,209/255,92/255)
            )
          }
      })
    })

    assetTrigger.triggers.onRemove((trigger:any, index:any)=>{
      console.log("trigger removed")
      if(trigger.type === Triggers.ON_PICKUP){
        utils.triggers.removeTrigger(info.entity)
        const triggerEvents = getTriggerEvents(info.entity)
        triggerEvents.off("*")
      }
    })


  })
}

export function updateTriggerEvents(scene:any, entityInfo:any, triggerInfo:any){
  const triggerEvents = getTriggerEvents(entityInfo.entity)

  if(triggerEvents.isListening(triggerInfo.type)){
    console.log('alreadly listening for input trigger on entity', entityInfo.entity)
    return
  }

    triggerEvents.on(triggerInfo.type, (triggerEvent:any)=>{
      // console.log('trigger event', triggerInfo, triggerEvent)
      let trigger = findTrigger(scene, triggerEvent, triggerInfo.type)
      if(!trigger){
        console.log('cant find trigger')
        return
      }

      console.log('trigger found', triggerEvent, trigger.decisions)

      checkDecisionPaths(scene, trigger, entityInfo)
    })
}

function checkDecisionPaths(scene:any, trigger:any, entityInfo:any){
  trigger.decisions.forEach(async (decision:any, i:number)=>{
    // console.log('decisin is', decision)//
    decisionQueue.push({sceneId:scene.id, aid:entityInfo.aid, entity:entityInfo.entity, decision:decision})
  })
}

function findTrigger(scene:any, triggerEvent:any, type:Triggers){
  let aid = getAssetIdByEntity(scene, triggerEvent.entity)
  if(!aid){
    return false
  }
    let triggers = scene[COMPONENT_TYPES.TRIGGER_COMPONENT].get(aid)
    if(!triggers){
      return false//
    }
    // console.log('triggers', triggers)
    // console.log('trigger found', triggers.triggers.find(($:any)=> $.input === triggerEvent.input && $.pointer === triggerEvent.pointer))
    return triggers.triggers.find(($:any)=> $.input === triggerEvent.input && $.pointer === triggerEvent.pointer && $.type === type)
}

function isValidAction(action: string /*TriggerAction*/) {
    // const { id, /*name*/ } = action//
    return !!action //&& !!name
}

async function evaluateDecision(decisionItem:any){
  let {sceneId, aid, entity, decision} = decisionItem
  let scene = colyseusRoom.state.scenes.get(sceneId)
  if(!scene){
    return
  }

  if(await checkConditions(scene, decision, aid, entity)){
    // console.log('passed check conditions')
      for(const triggerAction of decision.actions){
        // console.log('trigger actions area', triggerAction)
          if(isValidAction(triggerAction)){
            // console.log('is valid action')
              let {aid, action, entity} = getActionsByActionId(scene, triggerAction)
              if(aid){
                // actionQueue.push({aid:aid, action:action, entity:entity, decisionId:decision.id, sceneId:scene.id})
                // decisionActions.push({aid:aid, action:action, entity:entity})

                // const { entity, action, aid, decisionId } = actionQueue.shift()!//
                const actionEvents = getActionEvents(entity)
                switch(action.channel){
                  case 0:
                    console.log('running individual channel action')
                    actionEvents.emit(action.id, action)
                    break;

                  case 1:
                    console.log('running global channel action')
                    sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_ACTION, {
                      // type:action.type,//
                      type:'scene-action',
                      aid:aid,
                      sceneId:sceneId,
                      actionId:action.id,
                      forceScene:true,
                      action:action
                    })
                    break;

                  case 2:
                    console.log('running team channel action')
                    break;

                  default:
                    console.log('no channel specified, run locally')
                    actionEvents.emit(action.id, action)
                    break;
                }
              }
          }
      }
      runningDecision = false
      // decisionQueue.push({id:decision.id, actions:decisionActions}) 
  }else{
      // console.log('trigger condition not met')
      runningDecision = false
  }
}

async function checkConditions(scene:any, decision:any, aid:string, entity:Entity) {
  if(decision.conditions && decision.conditions.length > 0){
    let triggerConditions:any[] = []
    decision.conditions.forEach(async (condition:any, i:number)=>{
      triggerConditions.push(
        {
          aid:condition.aid, 
          type:condition.type, 
          condition:condition.condition,
          value:condition.value,
          counter:condition.counter
        })
    })
    const conditions = triggerConditions.map((condition:any) => checkCondition(scene, aid, entity, condition))
    console.log('condition evaluations', conditions)
    const isTrue = (result?: boolean) => !!result
    const operation = decision.operator || TriggerConditionOperation.AND
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
        // console.log('checking condition', condition)
        let actionEntity = getEntity(scene, condition.aid)
        if(actionEntity){
          let entity = actionEntity.entity
          console.log('checking condition', condition)
          switch (condition.condition) {
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
              let counter = getCounterComponentByAssetId(scene, condition.aid, condition.counter)
              // console.log('condition counter is', counter)
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
              let counter = getCounterComponentByAssetId(scene, condition.aid, condition.counter)
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
              let counter = getCounterComponentByAssetId(scene, condition.aid, condition.counter)
              if(!counter){
                return false
              }

              if(counter.currentValue){
                const numeric = Number(condition.counter)
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

let isTriggerSystemAdded = false
export function addPlayTriggerSystem(){
  if(!isTriggerSystemAdded){
    isTriggerSystemAdded = true
    engine.addSystem(PlayTriggerSystem)
    engine.addSystem(PlayTriggerDecisionSystem)
  }
}

export function removePlayTriggerSystem(){
  engine.removeSystem(PlayTriggerSystem)
  engine.removeSystem(PlayTriggerDecisionSystem)
  isTriggerSystemAdded = false
}
export function PlayTriggerSystem(dt:number){
    while (actionQueue.length > 0) {
      let potentialAction = actionQueue[0]
      if(potentialAction.force || runningDecision){
        // console.log(actionQueue)
        const { entity, action, aid, decisionId } = actionQueue.shift()!
        const actionEvents = getActionEvents(entity)
        actionEvents.emit(action.id, action)
        checkDecisionActions(decisionId)
      }
    }

    const entitiesWithTweens = engine.getEntitiesWith(Tween)
    for (const [entity] of entitiesWithTweens) {
      handleOnTweenEnd(entity)
    }
}

let runningDecision = false
export function checkDecisionActions(decisionId:string){
  console.log('checking decision actions', decisionId)
  if(!decisionId){
    runningDecision = false
    return
  }

  if(actionQueue.filter(($:any)=> $.decisionId === decisionId).length === 0){
    console.log('decision actions are over, we can run new decision')
    runningDecision = false
  }
}

export function PlayTriggerDecisionSystem(dt:number){
  // console.log('decision queue', decisionQueue.length)
  while (decisionQueue.length > 0 && !runningDecision) {
      runningDecision = true

      // console.log('decision queue is', decisionQueue)
      const decisionItem  = decisionQueue.shift()!
      // console.log('decision item is', decisionItem)

      evaluateDecision(decisionItem)
    }
}


function initOnTick(entity:Entity){
  tickSet.add(entity)
  console.log('adding tick')
}

export function disableTriggers(scene:any, entityInfo:any){
  let itemInfo = scene[COMPONENT_TYPES.TRIGGER_COMPONENT].get(entityInfo.aid)
  if(itemInfo){
    const triggerEvents = getTriggerEvents(entityInfo.entity)
    triggerEvents.off(Triggers.ON_INPUT_ACTION, ()=>{
      console.log('disabling triggers')
    })

    // triggerEvents.remove()
    // tickSet.delete(entityInfo.entity)
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
      console.log('emitting trigger for entity', entityInfo.entity)
      data.entity = entityInfo.entity
      let triggerEvents = getTriggerEvents(entityInfo.entity)
      triggerEvents.emit(type, data)
    }
  })
}

export function runSingleTrigger(entityInfo:any, type:Triggers, data:any){
  let triggerEvents = getTriggerEvents(entityInfo.entity)
  triggerEvents.emit(type, data)
}

// ON_TWEEN_END
function handleOnTweenEnd(entity: Entity) {
  if (
    Tween.getOrNull(entity) &&
    TweenState.getOrNull(entity)?.state === TweenStateStatus.TS_COMPLETED &&
    tweenSystem.tweenCompleted(entity)
  ) {
    const triggerEvents = getTriggerEvents(entity)
    triggerEvents.emit(Triggers.ON_TWEEN_END, {input:0, pointer:0, entity:entity})
    Tween.deleteFrom(entity)
  }
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