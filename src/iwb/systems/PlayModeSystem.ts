import { Entity, InputAction, PointerEventType, engine, inputSystem } from "@dcl/sdk/ecs"
import { log } from "../helpers/functions"
import { handleInputTriggerForEntity } from "../components/Triggers"
import { uiInput } from "../ui/ui"

export let added = false

export function addPlayModeSystem(){
    if(!added){
        added = true
        engine.addSystem(PlayModeInputSystem)
    }
}

export function removePlayModSystem(){
    engine.removeSystem(PlayModeInputSystem)
    added = false
}

export function PlayModeInputSystem(dt: number) {
    //DOWN BUTTON ACTIONS
    //POINTER
    if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN)) {
        // setButtonState(InputAction.IA_POINTER, PointerEventType.PET_DOWN)
        // selectedItem && !selectedItem.enabled ? displayHover(false) : null//
        const result = inputSystem.getInputCommand(InputAction.IA_POINTER, PointerEventType.PET_DOWN)
        if (result && !uiInput) {
            if (result.hit && result.hit.entityId) {
                handleInputTriggerForEntity(result.hit.entityId as Entity, InputAction.IA_POINTER)
            }
        }
    }
}