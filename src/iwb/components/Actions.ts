import { Entity } from "@dcl/sdk/ecs"
import { Actions } from "../helpers/types"
import mitt, { Emitter } from "mitt"

// const actions = new Map<Entity,Emitter<Record<string, ActionPayload<ActionType>>>>()
const actions =  new Map<Entity, Emitter<Record<Actions, void>>>()

export function getActionEvents(entity: Entity) {
    if (!actions.has(entity)) {
      actions.set(entity, mitt())
    }
    return actions.get(entity)!
  }

export function addActionComponent(scene:any){
    scene.actions.forEach((actions:any, aid:string)=>{
        let info = scene.parenting.find((entity:any)=> entity.aid === aid)
        if(info.entity){
            const actionEvents = getActionEvents(info.entity)
            actions.actions.forEach((action:any)=>{
                actionEvents.on(action.id, ()=>{
                    switch(action.type){
                        case Actions.SHOW_TEXT:
                            handleShowText(info.entity, action)
                            break;
                    }
                })
            })
        }
    })
}

function handleShowText(entity:Entity, action:any){
    console.log('handling show text action for', entity, action)
}