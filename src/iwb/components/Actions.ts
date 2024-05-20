import { Entity } from "@dcl/sdk/ecs"
import { Actions, SERVER_MESSAGE_TYPES, Triggers } from "../helpers/types"
import mitt, { Emitter } from "mitt"
import { sendServerMessage } from "./Colyseus"
import { getCounterComponentByAssetId, updateCounter } from "./Counter"
import { getStateComponentByAssetId, setState } from "./States"
import { getTriggerEvents } from "./Triggers"

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

                        case Actions.ADD_NUMBER:
                            handleAddNumber(scene, info, action)
                            break;

                        case Actions.SET_STATE:
                            handleSetState(scene, info.entity, info, action)
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

function handleSetState(scene:any, entity:Entity, info:any, action:any){
    let state = getStateComponentByAssetId(scene, info.aid)
    if(state){
        setState(state, action.state)

        const triggerEvents = getTriggerEvents(entity)
        triggerEvents.emit(Triggers.ON_STATE_CHANGE)
    }
}

function handleAddNumber(scene:any, info:any, action:any){
    let counter = getCounterComponentByAssetId(scene, info.aid, action.counter)
    if(counter){
        updateCounter(counter, action.value)
    }

    //todo
    //handle local vs multiplayer counter//

    //if multiplayer, send to server
    sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_ACTION, {sceneId:scene.id, aid:info.aid, action:action})
}