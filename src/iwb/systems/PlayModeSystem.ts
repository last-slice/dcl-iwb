import { Entity, InputAction, PointerEventType, PointerEvents, engine, inputSystem } from "@dcl/sdk/ecs"
import { handleInputTriggerForEntity, runGlobalTrigger } from "../components/Triggers"
import { uiInput } from "../ui/ui"
import { setButtonState } from "./InputSystem"
import { localPlayer, localUserId} from "../components/Player"
import { createBeam, startAttackCooldown } from "../components/Game"
import { GAME_WEAPON_TYPES, Triggers } from "../helpers/types"
import { colyseusRoom } from "../components/Colyseus"
import { excludeHidingUsers } from "../components/Config"
import { attemptFireWeapon } from "../components/Weapon"
import { localVehicleEntities } from "../components/Vehicle"

export let added = false

export function addPlayModeSystem(){
    if(!added){
        added = true
        engine.addSystem(PlayModeInputSystem)
        engine.addSystem(PlayModeSceneTick)
        console.log('adding playmode input system')//
    }
}

export function removePlayModSystem(){
    engine.removeSystem(PlayModeInputSystem)
    engine.removeSystem(PlayModeSceneTick)
    added = false
    console.log('removed playmode input system')
}

export function PlayModeInputSystem(dt: number) {
    // console.log(excludeHidingUsers)
    //DOWN BUTTON ACTIONS
    //POINTER//
    if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_HOVER_ENTER)) {
        const result = inputSystem.getInputCommand(InputAction.IA_POINTER, PointerEventType.PET_HOVER_ENTER)
        if(localPlayer && localPlayer.hasWeaponEquipped){
            attemptFireWeapon(dt)
        }

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
                    //check vehicle
                    let vehicleEntity = localVehicleEntities.get(result.hit.entityId as Entity)
                    if(vehicleEntity){
                        console.log('run attempt enter vehicle trigger')
                        handleInputTriggerForEntity(vehicleEntity, InputAction.IA_POINTER,  PointerEventType.PET_DOWN)
                    }else{
                        handleInputTriggerForEntity(result.hit.entityId as Entity, InputAction.IA_POINTER,  PointerEventType.PET_DOWN)
                    }
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

    if (inputSystem.isTriggered(InputAction.IA_ACTION_4, PointerEventType.PET_UP)) {
        setButtonState(InputAction.IA_ACTION_4, PointerEventType.PET_UP)
        const result = inputSystem.getInputCommand(InputAction.IA_ACTION_4, PointerEventType.PET_UP)
        if (result && !uiInput) {
            if (result.hit && result.hit.entityId) {
                handleInputTriggerForEntity(result.hit.entityId as Entity, InputAction.IA_ACTION_4,  PointerEventType.PET_UP)
            }
        }
    }

    //#3 Button
    if (inputSystem.isTriggered(InputAction.IA_ACTION_5, PointerEventType.PET_DOWN)) {
        setButtonState(InputAction.IA_ACTION_5, PointerEventType.PET_DOWN)
        const result = inputSystem.getInputCommand(InputAction.IA_ACTION_5, PointerEventType.PET_DOWN)
        if (result && !uiInput) {
            if (result.hit && result.hit.entityId) {
                handleInputTriggerForEntity(result.hit.entityId as Entity, InputAction.IA_ACTION_5,  PointerEventType.PET_DOWN)
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
    if (inputSystem.isTriggered(InputAction.IA_ACTION_6, PointerEventType.PET_DOWN)) {
        setButtonState(InputAction.IA_ACTION_6, PointerEventType.PET_DOWN)
        const result = inputSystem.getInputCommand(InputAction.IA_ACTION_6, PointerEventType.PET_DOWN)
        if (result && !uiInput) {
            if (result.hit && result.hit.entityId) {
                handleInputTriggerForEntity(result.hit.entityId as Entity, InputAction.IA_ACTION_6,  PointerEventType.PET_DOWN)
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

    //Space Button
    if (inputSystem.isTriggered(InputAction.IA_JUMP, PointerEventType.PET_DOWN)) {
        setButtonState(InputAction.IA_JUMP, PointerEventType.PET_DOWN)
        const result = inputSystem.getInputCommand(InputAction.IA_JUMP, PointerEventType.PET_DOWN)
        if (result && !uiInput) {
            if (result.hit && result.hit.entityId) {
                //check vehicle
                let vehicleEntity = localVehicleEntities.get(result.hit.entityId as Entity)
                if(vehicleEntity){
                    console.log('run attempt enter vehicle trigger')
                    handleInputTriggerForEntity(vehicleEntity, InputAction.IA_JUMP,  PointerEventType.PET_DOWN)
                }else{
                    handleInputTriggerForEntity(result.hit.entityId as Entity, InputAction.IA_JUMP,  PointerEventType.PET_DOWN)
                }            
            }else{
                runGlobalTrigger(undefined, Triggers.ON_INPUT_ACTION,  {input:InputAction.IA_JUMP, pointer:PointerEventType.PET_DOWN})
            }
        }
    }

    if (inputSystem.isTriggered(InputAction.IA_JUMP, PointerEventType.PET_UP)) {
        setButtonState(InputAction.IA_JUMP, PointerEventType.PET_UP)
        const result = inputSystem.getInputCommand(InputAction.IA_JUMP, PointerEventType.PET_UP)
        if (result && !uiInput) {
            if (result.hit && result.hit.entityId) {
                handleInputTriggerForEntity(result.hit.entityId as Entity, InputAction.IA_JUMP,  PointerEventType.PET_UP)
            }
        }
    }
}

export function PlayModeSceneTick(_dt: number) {
    colyseusRoom.state.scenes.forEach((scene:any, aid:string)=>{
      runGlobalTrigger(scene, Triggers.ON_CLOCK_TICK, {input:0, pointer:0})
    })
    // for (const entity of tickSet) {
    //   const triggerEvents = getTriggerEvents(entity)
    //   triggerEvents.emit(Triggers.ON_CLOCK_TICK, {input:0, type:0, entity:entity})
    // }
  }