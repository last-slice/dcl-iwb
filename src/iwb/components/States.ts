import { Schemas, engine } from "@dcl/sdk/ecs"
import { colyseusRoom } from "./Colyseus"
import { getEntity } from "./IWB"
import resources from "../helpers/resources"

export const States = engine.defineComponent(resources.slug + "state::component", {
    id: Schemas.Number,
    values: Schemas.Array(Schemas.String),
    defaultValue: Schemas.Optional(Schemas.String),
    currentValue: Schemas.Optional(Schemas.String),
    previousValue: Schemas.Optional(Schemas.String),
  })

export function isValidState(states:any, value: string | undefined) {
    return !!value && states.values.includes(value)
}

export function getCurrentValue(states:any) {
    if (isValidState(states, states.currentValue)) {
      return states.currentValue!
    }
    return getDefaultValue(states)
  }
  
  export function getDefaultValue(states:any) {
    if (isValidState(states, states.defaultValue)) {
      return states.defaultValue!
    }
    if (states.values.length > 0) {
      return states.values[0]
    }
  }
  
  export function getPreviousValue(states:any) {
    if (isValidState(states, states.previousValue)) {
      return states.previousValue!
    }
    return null
  }

export function addStateComponent(scene:any){
    scene.states.forEach((state:any, aid:string)=>{
        let info = scene.parenting.find((entity:any)=> entity.aid === aid)
        if(info){
            States.create(info.entity, {
                defaultValue: state.defaultValue,
                values:state.values
            })
        }
    })
}

export function getStateComponentByAssetId(scene:string, aid:string){
    let entityInfo = getEntity(scene, aid)
    if(entityInfo){
        return States.getMutableOrNull(entityInfo.entity)
    }
    return undefined
}

export function setState(state:any, value:any){
    const defaultValue = getDefaultValue(state)
    let nextState: string | undefined = value
    nextState = isValidState(state, nextState) ? nextState : defaultValue
    const previousValue = state.currentValue ?? defaultValue ?? undefined
    state.previousValue = previousValue
    state.currentValue = nextState
    console.log('state component is now', state)
}

export function stateListener(scene:any){
    scene.counters.onAdd((counters:any, aid:any)=>{
        //todo
        
        // let info = getEntity(scene, aid)
        // if(!info){
        //     return
        // }

        // counters.values.onAdd((counter:any, key:any)=>{
        //     counter.listen("currentValue", (c:any, p:any)=>{
        //         // console.log('counter current value changed', key, p, c)

        //         // let counter = getCounterComponentByAssetId(scene, info.aid, action)
        //         // if(counter){
        //         //     updateCounter(counter, action.value)
        //         // }
        //     })

        //     counter.listen("previousValue", (c:any, p:any)=>{
        //         // console.log('counter previous value changed', key, p, c)
        //     })
        // })
    })
}