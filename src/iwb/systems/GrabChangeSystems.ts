import { engine } from "@dcl/sdk/ecs"
import { EDIT_MODES, EDIT_MODIFIERS } from "../helpers/types"
import { selectedItem } from "../modes/Build"

let positiveSystemAdded = false
let negativeSystemAdded = false
let time = 0

export let grabbedModifierType = EDIT_MODIFIERS.POSITION

export function updateGrabModifier(){
    if(grabbedModifierType === EDIT_MODIFIERS.ROTATION){
        grabbedModifierType = EDIT_MODIFIERS.SCALE
    }else if(grabbedModifierType === EDIT_MODIFIERS.POSITION){
        grabbedModifierType = EDIT_MODIFIERS.ROTATION
    }else{
        grabbedModifierType = EDIT_MODIFIERS.POSITION
    }
}

export function addPositiveGrabSystem(){
    if(!positiveSystemAdded){
        positiveSystemAdded = true
        engine.addSystem(GrabChangePositiveSystem)
    }
}

export function removePositiveGrabSystem(){
    engine.removeSystem(GrabChangePositiveSystem)
    positiveSystemAdded = false
    time = 0
}

export function GrabChangePositiveSystem(dt:number){
    if(time > 0){
        time -= dt
    }else{
        time = .05
        if(selectedItem && selectedItem.enabled && selectedItem.mode === EDIT_MODES.GRAB){
            switch(grabbedModifierType){
                case EDIT_MODIFIERS.ROTATION:
                    selectedItem.rotation += 5
                    break;

                case EDIT_MODIFIERS.POSITION:
                    selectedItem.distance += 0.5
                    break;

                case EDIT_MODIFIERS.SCALE:
                    selectedItem.scale += 0.1
                    break;
            }
        }
    }
}

export function addNegativeGrabSystem(){
    if(!negativeSystemAdded){
        negativeSystemAdded = true
        engine.addSystem(GrabChangeNegativeSystem)
    }
}

export function removeNegativeGrabSystem(){
    engine.removeSystem(GrabChangeNegativeSystem)
    negativeSystemAdded = false
    time = 0
}

export function GrabChangeNegativeSystem(dt:number){
    if(time > 0){
        time -= dt
    }else{
        time = .05
        if(selectedItem && selectedItem.enabled && selectedItem.mode === EDIT_MODES.GRAB){
            switch(grabbedModifierType){
                case EDIT_MODIFIERS.ROTATION:
                    selectedItem.rotation -= 5
                    break;

                case EDIT_MODIFIERS.POSITION:
                    selectedItem.distance -= 0.5
                    break;

                case EDIT_MODIFIERS.SCALE:
                    selectedItem.scale -= 0.1
                    break;
            }
        }
    }
}