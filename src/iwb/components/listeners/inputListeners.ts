import { InputAction, PointerEventType, engine, inputSystem } from "@dcl/sdk/ecs";
import { InputListenSystem } from "../systems/InputListenSystem";

export let buttonsPressed:Map<number, any> = new Map()

export let pressed:any[] = []

export function setButtonState(button:number, state:number){
    let b = buttonsPressed.get(button)
    b.id = state
}

export function createInputListeners(){
    buttonsPressed.set(InputAction.IA_POINTER, {id:null})
    buttonsPressed.set(InputAction.IA_ACTION_3, {id:null})
    buttonsPressed.set(InputAction.IA_ACTION_4, {id:null})
    buttonsPressed.set(InputAction.IA_ACTION_5, {id:null})
    buttonsPressed.set(InputAction.IA_ACTION_6, {id:null})
    buttonsPressed.set(InputAction.IA_WALK, {id:null})
    buttonsPressed.set(InputAction.IA_SECONDARY, {id:null})
    buttonsPressed.set(InputAction.IA_PRIMARY, {id:null})
    
    engine.addSystem(InputListenSystem)
}