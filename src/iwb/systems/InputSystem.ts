import { Entity, InputAction, PointerEventType, PointerEvents, engine, inputSystem } from "@dcl/sdk/ecs"
import { handleInputTriggerForEntity } from "../components/Triggers"
import { uiInput } from "../ui/ui"
import { displayHover, updateContextEvents } from "../ui/Objects/ContextMenu"
import { playerMode } from "../components/Config"
import { log } from "../helpers/functions"
import { SCENE_MODES, EDIT_MODES, COMPONENT_TYPES } from "../helpers/types"
import { selectedItem, cancelSelectedItem, dropSelectedItem, deleteSelectedItem, updateSelectedAssetId, editItem, grabItem, deleteGrabbedItem, duplicateItemInPlace } from "../modes/Build"
import { localPlayer, settings } from "../components/Player"
import { displaySkinnyVerticalPanel } from "../ui/Reuse/SkinnyVerticalPanel"
import { getView } from "../ui/uiViews"
import { getAssetIdByEntity } from "../components/Parenting"
import { getEntity } from "../components/IWB"


export let added = false

export let buttonsPressed: Map<number, { id: number | null }> = new Map()

export let hoveredEntity:Entity

export function setButtonState(button: number, state: number) {
    let b = buttonsPressed.get(button)
    b!.id = state
}

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
    addInputSystem()
}

export function InputListenSystem(dt:number){
    //HOVER ACTIONS
    const hoverResult = inputSystem.getInputCommand(InputAction.IA_POINTER, PointerEventType.PET_HOVER_ENTER)
    if (hoverResult && hoverResult.hit && hoverResult.hit.entityId) {
        let hoverEvents = PointerEvents.get(hoverResult.hit.entityId as Entity)
        if (hoverEvents && !selectedItem || !selectedItem.enabled) {
            updateContextEvents([...hoverEvents.pointerEvents])
            displayHover(true)
            hoveredEntity = hoverResult.hit.entityId as Entity
        }
    }

    const hover = inputSystem.getInputCommand(InputAction.IA_POINTER, PointerEventType.PET_HOVER_LEAVE)
    if(hover){
        displayHover(false)
            hoveredEntity = -500 as Entity
    }
    // if (hover && hover.hit && hover.hit.entityId) {
    //     if(selectedItem && !selectedItem.enabled){
    //         displayHover(false)
    //         hoveredEntity = -500 as Entity
    //     }
    // }

    //DOWN BUTTON ACTIONS
    //POINTER





    //PRIMARY
    if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)) {
        displayHover(false)
        setButtonState(InputAction.IA_POINTER, PointerEventType.PET_DOWN)

        if(selectedItem && selectedItem.enabled){
            dropSelectedItem()
        }
        else{
            const result = inputSystem.getInputCommand(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)
            // if (result && !uiInput) {
            //     if (result.hit && result.hit.entityId) {
            //         handleInputTriggerForEntity(result.hit.entityId as Entity, InputAction.IA_PRIMARY)
            //     }
            // }
        }
    }

    //SECONDARY
    if (inputSystem.isTriggered(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN)) {
        displayHover(false)
        setButtonState(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN)

        const result = inputSystem.getInputCommand(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN)
        if(!uiInput){
            if (result) {
                if (result.hit && result.hit.entityId){
                    console.log('F press on entity', result)
                    let aid = getAssetIdByEntity(localPlayer.activeScene, result.hit.entityId as Entity)
                    console.log('aid is', aid)
                    if(aid){
                        if(settings.confirms){
                            updateSelectedAssetId(aid)
                            displaySkinnyVerticalPanel(true, getView("Confirm Delete Entity"), localPlayer.activeScene[COMPONENT_TYPES.NAMES_COMPONENT].get(aid).value)
                        }else{
                            deleteSelectedItem(aid)
                        }
                    }
                }
                else{
                    // log('player pressed #F on an object with no result in Build mode, need to delete', hoveredEntity)
                    //not sure if we need this implementation anymore
                }
            }
        }
    }

    //F BUTTON
    if (inputSystem.isTriggered(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN)) {
        displayHover(false)
        setButtonState(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN)
        const result = inputSystem.getInputCommand(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN)
        if (result) {
            if (result.hit && result.hit.entityId) {
                log('player pressed #F on an object in Build mode, need to edit')
                if (selectedItem && selectedItem.enabled && selectedItem.mode === EDIT_MODES.GRAB) {
                    log('player has selected item, need to delete')
                    deleteGrabbedItem()
                } else {
                    log('player pressed #E on an object taht isnt selected need to delete')
                    let aid = getAssetIdByEntity(localPlayer.activeScene, result.hit.entityId as Entity)
                    if(aid){
                        if(settings.confirms){
                            updateSelectedAssetId(aid)
                            displaySkinnyVerticalPanel(true, getView("Confirm Delete Entity"), localPlayer.activeScene[COMPONENT_TYPES.NAMES_COMPONENT].get(aid).value)
                        }else{
                            deleteSelectedItem(aid)
                        }
                    }
                }
            } else {
                log('player pressed #F on an object with no result in Build mode, need to delete', hoveredEntity)
                if (selectedItem && selectedItem.enabled) {
                    log('player has selected item, need to delete')
                    if (selectedItem.mode === EDIT_MODES.GRAB) {
                        deleteGrabbedItem()
                    } else {
                        // saveItem()
                    }
                } else {
                    log('player does not have item selected')
                    let aid = getAssetIdByEntity(localPlayer.activeScene, hoveredEntity as Entity)
                    if(aid){
                        if(settings.confirms){
                            updateSelectedAssetId(aid)
                            displaySkinnyVerticalPanel(true, getView("Confirm Delete Entity"), localPlayer.activeScene[COMPONENT_TYPES.NAMES_COMPONENT].get(aid).value)
                        }else{
                            deleteSelectedItem(aid)
                        }
                    }
                }
            }
        } else {
            log('pressed F key but no result')
        }
    }


    //#1 BUTTON
    if (inputSystem.isTriggered(InputAction.IA_ACTION_3, PointerEventType.PET_DOWN)) {
        displayHover(false)

        if(selectedItem && selectedItem.enabled && selectedItem.mode === EDIT_MODES.GRAB){
            cancelSelectedItem()
        }
        else{
            console.log('ui input is', uiInput)
            // setButtonState(InputAction.IA_POINTER, PointerEventType.PET_DOWN)
            // selectedItem && !selectedItem.enabled ? displayHover(false) : null
            const result = inputSystem.getInputCommand(InputAction.IA_ACTION_3, PointerEventType.PET_DOWN)
            // if(!uiInput){
                if (result) {
                    console.log('rsult is', result)
                    if(result.hit && result.hit.entityId){
                        let aid = getAssetIdByEntity(localPlayer.activeScene, result.hit.entityId as Entity)
                        if(aid){
                            editItem(aid, EDIT_MODES.EDIT)
                        }
                    }else{
                        // console.log('hit 1 button without hitting object and not in grab mode')
                        // if(hoveredEntity !== -500){//

                        // }
                    }
                }
            // }
        }
    }


    //E
    if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)) {
        displayHover(false)
        setButtonState(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)
        const result = inputSystem.getInputCommand(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)
        if (result) {
            if (result.hit && result.hit.entityId) {
                if (selectedItem && selectedItem.enabled) {
                    if (selectedItem.mode === EDIT_MODES.GRAB) {
                        console.log('dropping item')
                        dropSelectedItem()
                    } else {
                        console.log('pressed e while editing asset, do nothing')
                    }
                } else {
                    log('player pressed #E on an object in Build mode, need to grab')
                    grabItem(result.hit.entityId as Entity)
                }
            } else {
                log('player pressed #E in Build mode')
                if (selectedItem && selectedItem.enabled) {
                    if (selectedItem.mode === EDIT_MODES.GRAB) {
                        dropSelectedItem()
                    } else {
                        // saveItem()
                    }
                } else {
                    log('player pressed #E on in build mode without selecting item or hitting asset', hoveredEntity)
                }
            }
        }
    }

    //#3
    if (inputSystem.isTriggered(InputAction.IA_ACTION_5, PointerEventType.PET_DOWN)) {
        // Logic in response to button press//
        displayHover(false)

        // Logic in response to button press
        const result = inputSystem.getInputCommand(InputAction.IA_ACTION_5, PointerEventType.PET_DOWN)
        if (result) {
            if (result.hit && result.hit.entityId) {
                log('player pressed #3 on an object')
                if (playerMode === SCENE_MODES.BUILD_MODE) {
                    log('player pressed #3 on an object in Build mode, need to duplicate in place')
                    let aid = getAssetIdByEntity(localPlayer.activeScene, result.hit.entityId as Entity)
                    if(!aid){
                        return
                    }
                    duplicateItemInPlace(aid)
                }
            }
        }
    }


    // //W BUTTON
    // if (inputSystem.isTriggered(InputAction.IA_FORWARD, PointerEventType.PET_DOWN)) {
    //     setButtonState(InputAction.IA_FORWARD, PointerEventType.PET_DOWN)
    //     displayHover(false)

    //     const result = inputSystem.getInputCommand(InputAction.IA_FORWARD, PointerEventType.PET_DOWN)
    //     if (result) {
    //         if (result.hit && result.hit.entityId) {
    //             findTriggerActionForEntity(result.hit.entityId as Entity, Triggers.ON_CLICK, InputAction.IA_FORWARD)
    //         }
    //     }
    // }

    // //S BUTTON
    // if (inputSystem.isTriggered(InputAction.IA_BACKWARD, PointerEventType.PET_DOWN)) {
    //     setButtonState(InputAction.IA_BACKWARD, PointerEventType.PET_DOWN)
    //     displayHover(false)

    //     const result = inputSystem.getInputCommand(InputAction.IA_BACKWARD, PointerEventType.PET_DOWN)
    //     if (result) {
    //         if (result.hit && result.hit.entityId) {
    //             findTriggerActionForEntity(result.hit.entityId as Entity, Triggers.ON_CLICK, InputAction.IA_BACKWARD)
    //         }
    //     }
    // }

     // //D BUTTON
    //  if (inputSystem.isTriggered(InputAction.IA_RIGHT, PointerEventType.PET_DOWN)) {
    //     setButtonState(InputAction.IA_RIGHT, PointerEventType.PET_DOWN)
    //     displayHover(false)

    //     const result = inputSystem.getInputCommand(InputAction.IA_RIGHT, PointerEventType.PET_DOWN)
    //     if (result) {
    //         if (result.hit && result.hit.entityId) {
    //             findTriggerActionForEntity(result.hit.entityId as Entity, Triggers.ON_CLICK, InputAction.IA_RIGHT)
    //         }
    //     }
    // }

    // //A BUTTON
    // if (inputSystem.isTriggered(InputAction.IA_LEFT, PointerEventType.PET_DOWN)) {
    //     setButtonState(InputAction.IA_LEFT, PointerEventType.PET_DOWN)
    //     displayHover(false)

    //     const result = inputSystem.getInputCommand(InputAction.IA_LEFT, PointerEventType.PET_DOWN)
    //     if (result) {
    //         if (result.hit && result.hit.entityId) {
    //             findTriggerActionForEntity(result.hit.entityId as Entity, Triggers.ON_CLICK, InputAction.IA_LEFT)
    //         }
    //     }
    // }

    // //A BUTTON
    // if (inputSystem.isTriggered(InputAction.IA_LEFT, PointerEventType.PET_DOWN)) {
    //     setButtonState(InputAction.IA_LEFT, PointerEventType.PET_DOWN)
    //     displayHover(false)

    //     const result = inputSystem.getInputCommand(InputAction.IA_LEFT, PointerEventType.PET_DOWN)
    //     if (result) {
    //         if (result.hit && result.hit.entityId) {
    //             findTriggerActionForEntity(result.hit.entityId as Entity, Triggers.ON_CLICK, InputAction.IA_LEFT)
    //         }
    //     }
    // }

    // //JUMP BUTTON
    // if (inputSystem.isTriggered(InputAction.IA_JUMP, PointerEventType.PET_DOWN)) {
    //     setButtonState(InputAction.IA_JUMP, PointerEventType.PET_DOWN)
    //     displayHover(false)

    //     const result = inputSystem.getInputCommand(InputAction.IA_JUMP, PointerEventType.PET_DOWN)
    //     if (result) {
    //         if (result.hit && result.hit.entityId) {
    //             findTriggerActionForEntity(result.hit.entityId as Entity, Triggers.ON_CLICK, InputAction.IA_JUMP)
    //         }
    //     }
    // }

    // //SHIFT BUTTON
    // if (inputSystem.isTriggered(InputAction.IA_WALK, PointerEventType.PET_DOWN)) {
    //     setButtonState(InputAction.IA_WALK, PointerEventType.PET_DOWN)
    //     displayHover(false)

    //     const result = inputSystem.getInputCommand(InputAction.IA_WALK, PointerEventType.PET_DOWN)
    //     if (result) {
    //         if (result.hit && result.hit.entityId) {
    //             findTriggerActionForEntity(result.hit.entityId as Entity, Triggers.ON_CLICK, InputAction.IA_WALK)
    //         }
    //     }
    // }

    // //#2 BUTTON
    // if (inputSystem.isTriggered(InputAction.IA_ACTION_4, PointerEventType.PET_DOWN)) {
    //     setButtonState(InputAction.IA_ACTION_4, PointerEventType.PET_DOWN)
    //     displayHover(false)

    //     const result = inputSystem.getInputCommand(InputAction.IA_ACTION_4, PointerEventType.PET_DOWN)
    //     if (result) {
    //         if (result.hit && result.hit.entityId) {
    //             findTriggerActionForEntity(result.hit.entityId as Entity, Triggers.ON_CLICK, InputAction.IA_ACTION_4)
    //         }
    //     }
    // }

    // //#4 BUTTON
    // if (inputSystem.isTriggered(InputAction.IA_ACTION_6, PointerEventType.PET_DOWN)) {
    //     setButtonState(InputAction.IA_ACTION_6, PointerEventType.PET_DOWN)
    //     displayHover(false)

    //     const result = inputSystem.getInputCommand(InputAction.IA_ACTION_6, PointerEventType.PET_DOWN)
    //     if (result) {
    //         if (result.hit && result.hit.entityId) {
    //             findTriggerActionForEntity(result.hit.entityId as Entity, Triggers.ON_CLICK, InputAction.IA_ACTION_6)
    //         }
    //     }
    // }
}