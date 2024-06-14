import { Schemas, engine } from "@dcl/sdk/ecs"
import { colyseusRoom } from "./Colyseus"
import { getEntity } from "./IWB"
import resources from "../helpers/resources"
import { COMPONENT_TYPES } from "../helpers/types"

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

// export function addStateComponent(scene:any){
//     scene[COMPONENT_TYPES.STATE_COMPONENT].forEach((state:any, aid:string)=>{
//         let info = scene[COMPONENT_TYPES.PARENTING_COMPONENT].find((entity:any)=> entity.aid === aid)
//         if(info){
//             States.create(info.entity, {
//                 defaultValue: state.defaultValue,
//                 values:state.values
//             })
//         }
//     })
// }//

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
    scene[COMPONENT_TYPES.STATE_COMPONENT].onAdd((state:any, aid:any)=>{
      // let iwbInfo = scene[COMPONENT_TYPES.PARENTING_COMPONENT].find(($:any)=> $.aid === aid)
      // if(!iwbInfo.components.includes(COMPONENT_TYPES.STATE_COMPONENT)){
      //   iwbInfo.components.push(COMPONENT_TYPES.STATE_COMPONENT)
      // }

      let itemInfo = getEntity(scene, aid)
      if(!itemInfo){
          return
      }

      States.create(itemInfo.entity,{
        defaultValue: state.defaultValue,
        currentValue: state.defaultValue,
        values: state.values ? state.values : []
      })

      state.listen("defaultValue", (c:any, p:any)=>{
        let component = States.getMutableOrNull(itemInfo.entity)
        if(component){
          component.defaultValue = c
        } 
      })

      state.listen("currentValue", (c:any, p:any)=>{
        let component = States.getMutableOrNull(itemInfo.entity)
        if(component){
          component.currentValue = c
        } 
      })

      state.listen("previousValue", (c:any, p:any)=>{
        let component = States.getMutableOrNull(itemInfo.entity)
        if(component){
          component.previousValue = c
        } 
      })

      state.values.onAdd((state:any, index:any)=>{
        let component = States.getMutableOrNull(itemInfo.entity)
        if(component){
          component.values.push(state)
        }
      })
    })
}