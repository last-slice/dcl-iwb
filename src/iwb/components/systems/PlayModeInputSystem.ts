import {engine, Entity, InputAction, inputSystem, PointerEvents, PointerEventsResult, PointerEventType} from "@dcl/sdk/ecs"
import {setButtonState} from "../listeners/inputListeners"
import {log} from "../../helpers/functions"
import {EDIT_MODES, ENTITY_TRIGGER_SLUGS, SCENE_MODES, Triggers} from "../../helpers/types"
import {displayHover, updateContextEvents} from "../../ui/contextMenu"
import { findTriggerActionForEntity } from "../modes/play"

export let added = false

export function addPlayModeSystem(){
    if(!added){
        added = true
        log('adding play mode input system')
        engine.addSystem(PlayModeInputSystem)
    }
}

export function removePlayModSystem(){
    engine.removeSystem(PlayModeInputSystem)
    added = false
}

export function PlayModeInputSystem(dt: number) {

    //HOVER ACTIONS
    // const hoverResult = inputSystem.getInputCommand(InputAction.IA_POINTER, PointerEventType.PET_HOVER_ENTER)
    // if (hoverResult && hoverResult.hit && hoverResult.hit.entityId) {
    //     let hoverEvents = PointerEvents.get(hoverResult.hit.entityId as Entity)
    //     if (hoverEvents) {
    //         updateContextEvents([...hoverEvents.pointerEvents])
    //         displayHover(true)
    //     }
    // }

    // const hover = inputSystem.getInputCommand(InputAction.IA_POINTER, PointerEventType.PET_HOVER_LEAVE)
    // if (hover) {
    //     displayHover(false)
    // }


    // //DOWN BUTTON ACTIONS
    // //POINTER
    if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN)) {
        setButtonState(InputAction.IA_POINTER, PointerEventType.PET_DOWN)
        displayHover(false)

        const result = inputSystem.getInputCommand(InputAction.IA_POINTER, PointerEventType.PET_DOWN)
        if (result) {
            if (result.hit && result.hit.entityId) {
                findTriggerActionForEntity(result.hit.entityId as Entity, Triggers.ON_CLICK, InputAction.IA_POINTER)
            }
        }
    }

    // //E BUTTON
    if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)) {
        setButtonState(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)
        displayHover(false)

        const result = inputSystem.getInputCommand(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)
        if (result) {
            if (result.hit && result.hit.entityId) {
                console.log('e button pressed')
                findTriggerActionForEntity(result.hit.entityId as Entity, Triggers.ON_CLICK, InputAction.IA_PRIMARY)
            }
        }
    }

    // //F BUTTON
    if (inputSystem.isTriggered(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN)) {
        setButtonState(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN)
        displayHover(false)

        const result = inputSystem.getInputCommand(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN)
        if (result) {
            if (result.hit && result.hit.entityId) {
                console.log('f button pressed')
                findTriggerActionForEntity(result.hit.entityId as Entity, Triggers.ON_CLICK, InputAction.IA_SECONDARY)
            }
        }
    }

    // //W BUTTON
    if (inputSystem.isTriggered(InputAction.IA_FORWARD, PointerEventType.PET_DOWN)) {
        setButtonState(InputAction.IA_FORWARD, PointerEventType.PET_DOWN)
        displayHover(false)

        const result = inputSystem.getInputCommand(InputAction.IA_FORWARD, PointerEventType.PET_DOWN)
        if (result) {
            if (result.hit && result.hit.entityId) {
                findTriggerActionForEntity(result.hit.entityId as Entity, Triggers.ON_CLICK, InputAction.IA_FORWARD)
            }
        }
    }

    // //S BUTTON
    if (inputSystem.isTriggered(InputAction.IA_BACKWARD, PointerEventType.PET_DOWN)) {
        setButtonState(InputAction.IA_BACKWARD, PointerEventType.PET_DOWN)
        displayHover(false)

        const result = inputSystem.getInputCommand(InputAction.IA_BACKWARD, PointerEventType.PET_DOWN)
        if (result) {
            if (result.hit && result.hit.entityId) {
                findTriggerActionForEntity(result.hit.entityId as Entity, Triggers.ON_CLICK, InputAction.IA_BACKWARD)
            }
        }
    }

     // //D BUTTON
     if (inputSystem.isTriggered(InputAction.IA_RIGHT, PointerEventType.PET_DOWN)) {
        setButtonState(InputAction.IA_RIGHT, PointerEventType.PET_DOWN)
        displayHover(false)

        const result = inputSystem.getInputCommand(InputAction.IA_RIGHT, PointerEventType.PET_DOWN)
        if (result) {
            if (result.hit && result.hit.entityId) {
                findTriggerActionForEntity(result.hit.entityId as Entity, Triggers.ON_CLICK, InputAction.IA_RIGHT)
            }
        }
    }

    // //A BUTTON
    if (inputSystem.isTriggered(InputAction.IA_LEFT, PointerEventType.PET_DOWN)) {
        setButtonState(InputAction.IA_LEFT, PointerEventType.PET_DOWN)
        displayHover(false)

        const result = inputSystem.getInputCommand(InputAction.IA_LEFT, PointerEventType.PET_DOWN)
        if (result) {
            if (result.hit && result.hit.entityId) {
                findTriggerActionForEntity(result.hit.entityId as Entity, Triggers.ON_CLICK, InputAction.IA_LEFT)
            }
        }
    }

    // //A BUTTON
    if (inputSystem.isTriggered(InputAction.IA_LEFT, PointerEventType.PET_DOWN)) {
        setButtonState(InputAction.IA_LEFT, PointerEventType.PET_DOWN)
        displayHover(false)

        const result = inputSystem.getInputCommand(InputAction.IA_LEFT, PointerEventType.PET_DOWN)
        if (result) {
            if (result.hit && result.hit.entityId) {
                findTriggerActionForEntity(result.hit.entityId as Entity, Triggers.ON_CLICK, InputAction.IA_LEFT)
            }
        }
    }

    // //JUMP BUTTON
    if (inputSystem.isTriggered(InputAction.IA_JUMP, PointerEventType.PET_DOWN)) {
        setButtonState(InputAction.IA_JUMP, PointerEventType.PET_DOWN)
        displayHover(false)

        const result = inputSystem.getInputCommand(InputAction.IA_JUMP, PointerEventType.PET_DOWN)
        if (result) {
            if (result.hit && result.hit.entityId) {
                findTriggerActionForEntity(result.hit.entityId as Entity, Triggers.ON_CLICK, InputAction.IA_JUMP)
            }
        }
    }

    // //SHIFT BUTTON
    if (inputSystem.isTriggered(InputAction.IA_WALK, PointerEventType.PET_DOWN)) {
        setButtonState(InputAction.IA_WALK, PointerEventType.PET_DOWN)
        displayHover(false)

        const result = inputSystem.getInputCommand(InputAction.IA_WALK, PointerEventType.PET_DOWN)
        if (result) {
            if (result.hit && result.hit.entityId) {
                findTriggerActionForEntity(result.hit.entityId as Entity, Triggers.ON_CLICK, InputAction.IA_WALK)
            }
        }
    }

    // //#1 BUTTON
    if (inputSystem.isTriggered(InputAction.IA_ACTION_3, PointerEventType.PET_DOWN)) {
        setButtonState(InputAction.IA_ACTION_3, PointerEventType.PET_DOWN)
        displayHover(false)

        const result = inputSystem.getInputCommand(InputAction.IA_ACTION_3, PointerEventType.PET_DOWN)
        if (result) {
            if (result.hit && result.hit.entityId) {
                findTriggerActionForEntity(result.hit.entityId as Entity, Triggers.ON_CLICK, InputAction.IA_ACTION_3)
            }
        }
    }

    // //#2 BUTTON
    if (inputSystem.isTriggered(InputAction.IA_ACTION_4, PointerEventType.PET_DOWN)) {
        setButtonState(InputAction.IA_ACTION_4, PointerEventType.PET_DOWN)
        displayHover(false)

        const result = inputSystem.getInputCommand(InputAction.IA_ACTION_4, PointerEventType.PET_DOWN)
        if (result) {
            if (result.hit && result.hit.entityId) {
                findTriggerActionForEntity(result.hit.entityId as Entity, Triggers.ON_CLICK, InputAction.IA_ACTION_4)
            }
        }
    }

    // //#3 BUTTON
    if (inputSystem.isTriggered(InputAction.IA_ACTION_5, PointerEventType.PET_DOWN)) {
        setButtonState(InputAction.IA_ACTION_5, PointerEventType.PET_DOWN)
        displayHover(false)

        const result = inputSystem.getInputCommand(InputAction.IA_ACTION_5, PointerEventType.PET_DOWN)
        if (result) {
            if (result.hit && result.hit.entityId) {
                findTriggerActionForEntity(result.hit.entityId as Entity, Triggers.ON_CLICK, InputAction.IA_ACTION_5)
            }
        }
    }

    // //#4 BUTTON
    if (inputSystem.isTriggered(InputAction.IA_ACTION_6, PointerEventType.PET_DOWN)) {
        setButtonState(InputAction.IA_ACTION_6, PointerEventType.PET_DOWN)
        displayHover(false)

        const result = inputSystem.getInputCommand(InputAction.IA_ACTION_6, PointerEventType.PET_DOWN)
        if (result) {
            if (result.hit && result.hit.entityId) {
                findTriggerActionForEntity(result.hit.entityId as Entity, Triggers.ON_CLICK, InputAction.IA_ACTION_6)
            }
        }
    }
}