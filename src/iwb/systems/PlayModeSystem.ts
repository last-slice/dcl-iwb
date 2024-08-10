import { Entity, InputAction, PointerEventType, PointerEvents, engine, inputSystem } from "@dcl/sdk/ecs"
import { handleInputTriggerForEntity } from "../components/Triggers"
import { uiInput } from "../ui/ui"
import { setButtonState } from "./InputSystem"
import { localUserId} from "../components/Player"
import { createBeam, startAttackCooldown } from "../components/Game"
import { GAME_WEAPON_TYPES } from "../helpers/types"
import { colyseusRoom } from "../components/Colyseus"

export let added = false

export function addPlayModeSystem(){
    if(!added){
        added = true
        engine.addSystem(PlayModeInputSystem)
        console.log('adding playmode input system')
    }
}

export function removePlayModSystem(){
    engine.removeSystem(PlayModeInputSystem)
    added = false
    console.log('removed playmode input system')
}

export function PlayModeInputSystem(dt: number) {
    //DOWN BUTTON ACTIONS
    //POINTER//
    if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_HOVER_ENTER)) {
        const result = inputSystem.getInputCommand(InputAction.IA_POINTER, PointerEventType.PET_HOVER_ENTER)
        if (result && !uiInput) {
            if (result.hit && result.hit.entityId) {
                handleInputTriggerForEntity(result.hit.entityId as Entity, InputAction.IA_POINTER,  PointerEventType.PET_HOVER_ENTER)
            }
        }
    }

    if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_HOVER_LEAVE)) {
        const result = inputSystem.getInputCommand(InputAction.IA_POINTER, PointerEventType.PET_HOVER_LEAVE)
        if (result && !uiInput) {
            if (result.hit && result.hit.entityId) {
                handleInputTriggerForEntity(result.hit.entityId as Entity, InputAction.IA_POINTER,  PointerEventType.PET_HOVER_LEAVE)
            }
        }
    }

    if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN)) {
        setButtonState(InputAction.IA_POINTER, PointerEventType.PET_DOWN)
        const result = inputSystem.getInputCommand(InputAction.IA_POINTER, PointerEventType.PET_DOWN)
        console.log('ui input', uiInput)

        let player = colyseusRoom.state.players.get(localUserId)
        if(!player){
            return
        }

        // if(showingDialogPanel){
        //     advanceDialog()
        // }

        if(player.hasWeaponEquipped){
            if(!player.inCooldown && player.weaponType === GAME_WEAPON_TYPES.GUN){
                createBeam(dt)
                startAttackCooldown(localUserId)
            }
        }
        else{
            // if(showingTutorial && !uiInput){
            //     stopTutorialVideo()
            //     return
            // }
            if (result && !uiInput) {
                if (result.hit && result.hit.entityId) {
                    handleInputTriggerForEntity(result.hit.entityId as Entity, InputAction.IA_POINTER,  PointerEventType.PET_DOWN)
                }
            }
        }
    }

    if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_UP)) {
        setButtonState(InputAction.IA_POINTER, PointerEventType.PET_UP)
        const result = inputSystem.getInputCommand(InputAction.IA_POINTER, PointerEventType.PET_UP)
        if (result && !uiInput) {
            if (result.hit && result.hit.entityId) {
                handleInputTriggerForEntity(result.hit.entityId as Entity, InputAction.IA_POINTER,  PointerEventType.PET_UP)
            }
        }
    }

    //E Button
    if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)) {
        setButtonState(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)
        const result = inputSystem.getInputCommand(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)
        console.log('E button result', result, uiInput)
        if (result && !uiInput) {
            if (result.hit && result.hit.entityId) {
                handleInputTriggerForEntity(result.hit.entityId as Entity, InputAction.IA_PRIMARY,  PointerEventType.PET_DOWN)
            }
        }
    }

    if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_UP)) {
        setButtonState(InputAction.IA_PRIMARY, PointerEventType.PET_UP)
        const result = inputSystem.getInputCommand(InputAction.IA_PRIMARY, PointerEventType.PET_UP)
        if (result && !uiInput) {
            if (result.hit && result.hit.entityId) {
                handleInputTriggerForEntity(result.hit.entityId as Entity, InputAction.IA_PRIMARY,  PointerEventType.PET_UP)
            }
        }
    }

    //F Button
    if (inputSystem.isTriggered(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN)) {
        setButtonState(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN)
        const result = inputSystem.getInputCommand(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN)
        console.log('F button result', result, uiInput)
        if (result && !uiInput) {
            if (result.hit && result.hit.entityId) {
                handleInputTriggerForEntity(result.hit.entityId as Entity, InputAction.IA_SECONDARY,  PointerEventType.PET_DOWN)
            }
        }
    }

    if (inputSystem.isTriggered(InputAction.IA_SECONDARY, PointerEventType.PET_UP)) {
        setButtonState(InputAction.IA_SECONDARY, PointerEventType.PET_UP)
        const result = inputSystem.getInputCommand(InputAction.IA_SECONDARY, PointerEventType.PET_UP)
        if (result && !uiInput) {
            if (result.hit && result.hit.entityId) {
                handleInputTriggerForEntity(result.hit.entityId as Entity, InputAction.IA_SECONDARY,  PointerEventType.PET_UP)
            }
        }
    }

    //#1 Button
    if (inputSystem.isTriggered(InputAction.IA_ACTION_3, PointerEventType.PET_DOWN)) {
        setButtonState(InputAction.IA_ACTION_3, PointerEventType.PET_DOWN)
        const result = inputSystem.getInputCommand(InputAction.IA_ACTION_3, PointerEventType.PET_DOWN)
        console.log('E button result', result, uiInput)
        if (result && !uiInput) {
            if (result.hit && result.hit.entityId) {
                handleInputTriggerForEntity(result.hit.entityId as Entity, InputAction.IA_ACTION_3,  PointerEventType.PET_DOWN)
            }
        }
    }

    if (inputSystem.isTriggered(InputAction.IA_ACTION_3, PointerEventType.PET_UP)) {
        setButtonState(InputAction.IA_ACTION_3, PointerEventType.PET_UP)
        const result = inputSystem.getInputCommand(InputAction.IA_ACTION_3, PointerEventType.PET_UP)
        if (result && !uiInput) {
            if (result.hit && result.hit.entityId) {
                handleInputTriggerForEntity(result.hit.entityId as Entity, InputAction.IA_ACTION_3,  PointerEventType.PET_UP)
            }
        }
    }

    //#2 Button
    if (inputSystem.isTriggered(InputAction.IA_ACTION_4, PointerEventType.PET_DOWN)) {
        setButtonState(InputAction.IA_ACTION_4, PointerEventType.PET_DOWN)
        const result = inputSystem.getInputCommand(InputAction.IA_ACTION_4, PointerEventType.PET_DOWN)
        console.log('E button result', result, uiInput)
        if (result && !uiInput) {
            if (result.hit && result.hit.entityId) {
                handleInputTriggerForEntity(result.hit.entityId as Entity, InputAction.IA_ACTION_4,  PointerEventType.PET_DOWN)
            }
        }
    }

    //#3 Button
    if (inputSystem.isTriggered(InputAction.IA_ACTION_5, PointerEventType.PET_UP)) {
        setButtonState(InputAction.IA_ACTION_5, PointerEventType.PET_UP)
        const result = inputSystem.getInputCommand(InputAction.IA_ACTION_5, PointerEventType.PET_UP)
        if (result && !uiInput) {
            if (result.hit && result.hit.entityId) {
                handleInputTriggerForEntity(result.hit.entityId as Entity, InputAction.IA_ACTION_5,  PointerEventType.PET_UP)
            }
        }
    }

    if (inputSystem.isTriggered(InputAction.IA_ACTION_5, PointerEventType.PET_UP)) {
        setButtonState(InputAction.IA_ACTION_5, PointerEventType.PET_UP)
        const result = inputSystem.getInputCommand(InputAction.IA_ACTION_5, PointerEventType.PET_UP)
        if (result && !uiInput) {
            if (result.hit && result.hit.entityId) {
                handleInputTriggerForEntity(result.hit.entityId as Entity, InputAction.IA_ACTION_5,  PointerEventType.PET_UP)
            }
        }
    }

    //#4 Button
    if (inputSystem.isTriggered(InputAction.IA_ACTION_6, PointerEventType.PET_UP)) {
        setButtonState(InputAction.IA_ACTION_6, PointerEventType.PET_UP)
        const result = inputSystem.getInputCommand(InputAction.IA_ACTION_6, PointerEventType.PET_UP)
        if (result && !uiInput) {
            if (result.hit && result.hit.entityId) {
                handleInputTriggerForEntity(result.hit.entityId as Entity, InputAction.IA_ACTION_6,  PointerEventType.PET_UP)
            }
        }
    }

    if (inputSystem.isTriggered(InputAction.IA_ACTION_6, PointerEventType.PET_UP)) {
        setButtonState(InputAction.IA_ACTION_6, PointerEventType.PET_UP)
        const result = inputSystem.getInputCommand(InputAction.IA_ACTION_6, PointerEventType.PET_UP)
        if (result && !uiInput) {
            if (result.hit && result.hit.entityId) {
                handleInputTriggerForEntity(result.hit.entityId as Entity, InputAction.IA_ACTION_6,  PointerEventType.PET_UP)
            }
        }
    }
}