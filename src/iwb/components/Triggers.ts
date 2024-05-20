import { Entity, InputAction, PointerEvents, engine, pointerEventsSystem } from "@dcl/sdk/ecs";
import { TriggerConditionOperation, TriggerConditionType, Triggers } from "../helpers/types";
import mitt, { Emitter } from "mitt";
import { getEntity } from "./IWB";
import { getActionEvents } from "./Actions";

// const actionQueue: { entity: Entity; action: Action }[] = []
const actionQueue:any[] = []

const triggers = new Map<Entity, Emitter<Record<Triggers, void>>>()

export function getTriggerEvents(entity: Entity) {
    if (!triggers.has(entity)) {
      triggers.set(entity, mitt())
    }
    return triggers.get(entity)!
}

export function addTriggerComponent(scene:any){
    scene.triggers.forEach((triggers:any, aid:string)=>{
        let info = scene.parenting.find((entity:any)=> entity.aid === aid)
        if(info.entity){
            triggers.triggers.forEach((trigger:any)=>{
                switch(trigger.type){
                    case Triggers.ON_INPUT_ACTION:
                        initOnInputActionTrigger(info.entity, trigger)
                        break;
                }

                const triggerEvents = getTriggerEvents(info.entity)
                triggerEvents.on(trigger.type, ()=>{
                    if(checkConditions(trigger)){
                        for(const triggerAction of trigger.actions){
                            if(isValidAction(triggerAction)){
                                let {aid, action, entity} = getActionsByActionId(scene, triggerAction)
                                if(aid){
                                    actionQueue.push({aid:aid, action:action, entity:entity})
                                }
                            }
                        }
                    }
                })
            })
        }
    })


    engine.addSystem(PlayTriggerSystem)
}

function isValidAction(action: string /*TriggerAction*/) {
    // const { id, /*name*/ } = action
    return !!action //&& !!name
  }

function checkConditions(trigger:any) {
    // if (trigger.conditions && trigger.conditions.length > 0) {
    //   const conditions = trigger.conditions.map(checkCondition)
    //   const isTrue = (result?: boolean) => !!result
    //   const operation = trigger.operation || TriggerConditionOperation.AND
    //   switch (operation) {
    //     case TriggerConditionOperation.AND: {
    //       return conditions.every(isTrue)
    //     }
    //     case TriggerConditionOperation.OR: {
    //       return conditions.some(isTrue)
    //     }
    //   }
    // }
    // if there are no conditions, the trigger can continue
    return true
  }

//   function checkCondition(condition: any) {
//     const entity = getEntityByCondition(condition)
//     if (entity) {
//       try {
//         switch (condition.type) {
//           case TriggerConditionType.WHEN_STATE_IS: {
//             const states = States.getOrNull(entity)
//             if (states !== null) {
//               const currentValue = getCurrentValue(states)
//               return currentValue === condition.value
//             }
//             break
//           }
//           case TriggerConditionType.WHEN_STATE_IS_NOT: {
//             const states = States.getOrNull(entity)
//             if (states !== null) {
//               const currentValue = getCurrentValue(states)
//               return currentValue !== condition.value
//             }
//             break
//           }
//           case TriggerConditionType.WHEN_PREVIOUS_STATE_IS: {
//             const states = States.getOrNull(entity)
//             if (states !== null) {
//               const previousValue = getPreviousValue(states)
//               return previousValue === condition.value
//             }
//             break
//           }
//           case TriggerConditionType.WHEN_PREVIOUS_STATE_IS_NOT: {
//             const states = States.getOrNull(entity)
//             if (states !== null) {
//               const previousValue = getPreviousValue(states)
//               return previousValue !== condition.value
//             }
//             break
//           }
//           case TriggerConditionType.WHEN_COUNTER_EQUALS: {
//             const counter = Counter.getOrNull(entity)
//             if (counter !== null) {
//               const numeric = Number(condition.value)
//               if (!isNaN(numeric)) {
//                 return counter.value === numeric
//               }
//             }
//             break
//           }
//           case TriggerConditionType.WHEN_COUNTER_IS_GREATER_THAN: {
//             const counter = Counter.getOrNull(entity)
//             if (counter !== null) {
//               const numeric = Number(condition.value)
//               if (!isNaN(numeric)) {
//                 return counter.value > numeric
//               }
//             }
//             break
//           }
//           case TriggerConditionType.WHEN_COUNTER_IS_LESS_THAN: {
//             const counter = Counter.getOrNull(entity)
//             if (counter !== null) {
//               const numeric = Number(condition.value)
//               if (!isNaN(numeric)) {
//                 return counter.value < numeric
//               }
//             }
//             break
//           }
//           case TriggerConditionType.WHEN_DISTANCE_TO_PLAYER_LESS_THAN: {
//             const position = getWorldPosition(entity)

//             const numeric = Number(condition.value)
//             if (!isNaN(numeric)) {
//               return Vector3.distance(position, getPlayerPosition()) < numeric
//             }

//             break
//           }
//           case TriggerConditionType.WHEN_DISTANCE_TO_PLAYER_GREATER_THAN: {
//             const position = getWorldPosition(entity)
//             const numeric = Number(condition.value)
//             if (!isNaN(numeric)) {
//               return Vector3.distance(position, getPlayerPosition()) > numeric
//             }
//             break
//           }
//         }
//       } catch (error) {
//         console.error('Error in condition', condition)
//       }
//     }
//     return false
//   }

// function getEntityById(componentName: string, id: number) {
//     const Component = engine.getComponent(
//       componentName,
//     ) as LastWriteWinElementSetComponentDefinition<T>
//     const entities = Array.from(engine.getEntitiesWith(Component))
//     const result = entities.find(([_entity, value]) => value.id === id)
//     return Array.isArray(result) && result.length > 0 ? result[0] : null
//   }

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

function initOnInputActionTrigger(entity:Entity, trigger:any){
    const pointerEvent = PointerEvents.getOrNull(entity)

    const opts = {
      button:
        pointerEvent?.pointerEvents[0].eventInfo?.button ||
        InputAction.IA_PRIMARY,
      ...(pointerEvent === null ? { hoverText: 'Press' } : {}),
    }

    pointerEventsSystem.onPointerDown(
      {
        entity,
        opts,
      },
      () => {
        const triggerEvents = getTriggerEvents(entity)
        triggerEvents.emit(Triggers.ON_INPUT_ACTION)
      },
    )
}

export function PlayTriggerSystem(dt:number){
    while (actionQueue.length > 0) {
        const { entity, action, aid } = actionQueue.shift()!
        const actionEvents = getActionEvents(entity)
        actionEvents.emit(action.id, action)
      }
}

