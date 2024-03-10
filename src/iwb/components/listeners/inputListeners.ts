import {engine, InputAction} from "@dcl/sdk/ecs";
import {InputListenSystem} from "../systems/InputListenSystem";
import { addPlayModeSystem, PlayModeInputSystem } from "../systems/PlayModeInputSystem";

export let buttonsPressed: Map<number, { id: number | null }> = new Map()

export let pressed: any[] = []

export function setButtonState(button: number, state: number) {
    let b = buttonsPressed.get(button)
    b!.id = state
}

export function createInputListeners() {
    buttonsPressed.set(InputAction.IA_POINTER, {id: null})
    buttonsPressed.set(InputAction.IA_ACTION_3, {id: null})
    buttonsPressed.set(InputAction.IA_ACTION_4, {id: null})
    buttonsPressed.set(InputAction.IA_ACTION_5, {id: null})
    buttonsPressed.set(InputAction.IA_ACTION_6, {id: null})
    buttonsPressed.set(InputAction.IA_WALK, {id: null})
    buttonsPressed.set(InputAction.IA_SECONDARY, {id: null})
    buttonsPressed.set(InputAction.IA_PRIMARY, {id: null})
    buttonsPressed.set(InputAction.IA_BACKWARD, {id: null})
    buttonsPressed.set(InputAction.IA_FORWARD, {id: null})
    buttonsPressed.set(InputAction.IA_LEFT, {id: null})
    buttonsPressed.set(InputAction.IA_RIGHT, {id: null})
    buttonsPressed.set(InputAction.IA_JUMP, {id: null})

    // engine.addSystem(InputListenSystem)
    addPlayModeSystem()
}