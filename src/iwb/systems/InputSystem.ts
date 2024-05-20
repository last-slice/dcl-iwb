import { Entity, InputAction, PointerEventType, engine, inputSystem } from "@dcl/sdk/ecs"
import { handleInputTriggerForEntity } from "../components/Triggers"


export let added = false

export function addInputSystem(){
    if(!added){
        added = true
        engine.addSystem(InputListenSystem)
    }
}

export function removeInputSystem(){
    engine.removeSystem(InputListenSystem)
    added = false
}

export function InputListenSystem(dt:number){


    //DOWN BUTTON ACTIONS
    //POINTER
    if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN)) {
        // setButtonState(InputAction.IA_POINTER, PointerEventType.PET_DOWN)
        // selectedItem && !selectedItem.enabled ? displayHover(false) : null
        const result = inputSystem.getInputCommand(InputAction.IA_POINTER, PointerEventType.PET_DOWN)
        if (result) {
            if (result.hit && result.hit.entityId) {
                handleInputTriggerForEntity(result.hit.entityId as Entity, InputAction.IA_POINTER)
            }
        }
    }

    //PRIMARY//
    if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)) {
        // setButtonState(InputAction.IA_POINTER, PointerEventType.PET_DOWN)
        // selectedItem && !selectedItem.enabled ? displayHover(false) : null
        const result = inputSystem.getInputCommand(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)
        if (result) {
            if (result.hit && result.hit.entityId) {
                handleInputTriggerForEntity(result.hit.entityId as Entity, InputAction.IA_PRIMARY)
            }
        }
    }


    InputAction.IA_PRIMARY
}