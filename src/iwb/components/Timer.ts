import { Entity } from '@dcl/sdk/ecs'
import { getTriggerEvents } from './Triggers'
import { COMPONENT_TYPES, PLAYER_GAME_STATUSES, Triggers } from '../helpers/types'
import { localPlayer } from './Player'
import { scene } from '../ui/Objects/SceneMainDetailPanel'
import { colyseusRoom } from './Colyseus'

interface DelayAction {
  action: string
  timeout: number
  callback: Function
}

interface IntervalAction {
  action: string
  aid:string
  sceneId:string
  timeout: number
  interval: number
  callback: Function
}

export const tickSet = new Set<Entity>()

const queueDelay = new Map<Entity, Array<DelayAction>>()
const queueInterval = new Map<Entity, Array<IntervalAction>>()

export function createTimerSystem() {
  return function timerSystem(dt: number) {
    intervalSystem(dt)
    delaySystem(dt)
    tickSystem(dt)
  }

  function intervalSystem(dt: number) {
    for (const [entity, actions] of queueInterval.entries()) {
      const triggerEvents = getTriggerEvents(entity)

      for (const action of actions) {
        if (action.timeout === action.interval) {
          action.callback()
        }

        action.timeout -= dt

        if (action.timeout <= 0) {
          action.timeout = action.interval
          triggerEvents.emit(Triggers.ON_LOOP)
        }
      }
    }
  }

  function delaySystem(dt: number) {
    for (const [entity, actions] of queueDelay.entries()) {
      const triggerEvents = getTriggerEvents(entity)
      const completedActions = []
      let idx = 0

      // Iterate entity actions and verify is the timeout is reached to execute the callback
      for (const action of actions) {
        action.timeout -= dt

        if (action.timeout <= 0) {
          action.callback()
          triggerEvents.emit(Triggers.ON_DELAY)
          completedActions.push(idx)
        }
        idx++
      }

      // Remove completed actions from the queue
      for (const action of completedActions) {
        actions.splice(action, 1)
      }
    }
  }

  function tickSystem(_dt: number) {
    for (const entity of tickSet) {
      const triggerEvents = getTriggerEvents(entity)
      triggerEvents.emit(Triggers.ON_TICK)
    }
  }
}

export function startTimeout(
  entity: Entity,
  action: string,
  timeout: number,
  callback: () => void,
) {
  const actionCallbacks = queueDelay.get(entity) ?? []
  actionCallbacks.push({ timeout, action, callback })
  queueDelay.set(entity, actionCallbacks)
}

export function stopTimeout(entity: Entity, action: string) {
  const delays = queueDelay.get(entity) ?? []
  queueDelay.set(
    entity,
    delays.filter(($) => $.action !== action),
  )
}

export function stopAllTimeouts() {
  queueDelay.clear()
}

export function startInterval(
  entity: Entity,
  aid:string,
  action: string,
  interval: number,
  sceneId:string,
  callback: () => void,
) {
  const actionCallbacks = queueInterval.get(entity) ?? []
  actionCallbacks.push({aid:aid, sceneId:sceneId, timeout: interval, action, callback, interval })
  queueInterval.set(entity, actionCallbacks)
}

export function stopInterval(entity: Entity, action: string) {
  // const intervals = queueInterval.get(entity) ?? []
  // queueInterval.set(
  //   entity,
  //   intervals.filter(($) => $.action !== action),
  // )
  queueInterval.delete(entity)
}

export function stopAllIntervals(gameIntervals?:boolean) {
  if(localPlayer.gameStatus !== PLAYER_GAME_STATUSES.PLAYING || gameIntervals){
    queueInterval.clear()
  }
  else{
    queueInterval.forEach((interval:any, entity)=>{
      let scene = colyseusRoom.state.scenes.get(interval.sceneId)
      if(scene){
        let gameItem = scene[COMPONENT_TYPES.GAME_ITEM_COMPONENT].get(interval.aid)
        if(gameItem){
        }
      }
    })
  }
}