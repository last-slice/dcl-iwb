import { Entity, InputAction, PointerEventType, PointerEvents, engine, inputSystem } from "@dcl/sdk/ecs"
import { handleInputTriggerForEntity } from "../components/Triggers"
import { uiInput } from "../ui/ui"
import { displayHover, updateContextEvents } from "../ui/Objects/ContextMenu"
import { playerMode } from "../components/Config"
import { log } from "../helpers/functions"
import { SCENE_MODES, EDIT_MODES, COMPONENT_TYPES } from "../helpers/types"
import { selectedItem, cancelSelectedItem, dropSelectedItem, deleteSelectedItem, updateSelectedAssetId, editItem, grabItem, deleteGrabbedItem, duplicateItemInPlace, duplicateItem, selectedAssetId, dropGrabbedItems } from "../modes/Build"
import { localPlayer, settings } from "../components/Player"
import { displaySkinnyVerticalPanel } from "../ui/Reuse/SkinnyVerticalPanel"
import { getView } from "../ui/uiViews"
import { getAssetIdByEntity } from "../components/Parenting"
import { getEntity } from "../components/iwb"
import { addNegativeGrabSystem, addPositiveGrabSystem, removeNegativeGrabSystem, removePositiveGrabSystem, updateGrabModifier } from "./GrabChangeSystems"
import { displayGrabContextMenu } from "../ui/Objects/GrabContextMenu"
import { localVehicleEntities } from "../components/Vehicle"


export let added = false

export let buttonsPressed: Map<number, { id: number | null }> = new Map()

export let hoveredEntity:Entity

export function setButtonState(button: number, state: number | null) {
    let b = buttonsPressed.get(button)
    if(b){
        b.id = state
    }
}

export function deleteButtonState(button:number){
    buttonsPressed.delete(button)
}

export function addInputSystem(){
    if(!added){
        added = true
        engine.addSystem(InputListenSystem)
        console.log('adding build mode system')
    }
}

export function removeInputSystem(){
    engine.removeSystem(InputListenSystem)
    added = false
    console.log('removing build mode system')
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
            // console.log('hovered entity is', hoveredEntity)
        }
    }

    const hover = inputSystem.getInputCommand(InputAction.IA_POINTER, PointerEventType.PET_HOVER_LEAVE)
    if(hover){
        if(selectedItem){
            if(selectedItem.mode !== EDIT_MODES.GRAB){
                displayHover(false)
            }
        }
        else{
            displayHover(false)
        }
        hoveredEntity = -500 as Entity
        // console.log('hovered entity is now', hoveredEntity)
    }
    // if (hover && hover.hit && hover.hit.entityId) {
    //     if(selectedItem && !selectedItem.enabled){
    //         displayHover(false)
    //         hoveredEntity = -500 as Entity
    //     }
    // }

    //#1 BUTTON
    if (inputSystem.isTriggered(InputAction.IA_ACTION_3, PointerEventType.PET_DOWN)) {
        displayHover(false)

        if(selectedItem && selectedItem.enabled && selectedItem.mode === EDIT_MODES.GRAB){
            cancelSelectedItem()
            displayGrabContextMenu(false)
            removeNegativeGrabSystem()
            removePositiveGrabSystem()
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
                        let aid:any
                        
                        //check vehicle
                        let vehicle = localVehicleEntities.get(result.hit.entityId as Entity)
                        if(vehicle){
                            aid = getAssetIdByEntity(localPlayer.activeScene, vehicle)
                        }else{
                            aid = getAssetIdByEntity(localPlayer.activeScene, result.hit.entityId as Entity)
                        }
                        
                        if(aid){
                            editItem(aid, EDIT_MODES.EDIT)
                        }
                    }else{
                        // console.log('hit 1 button without hitting object and not in grab mode')
                        // if(hoveredEntity !== -500){//

                        // }
                    }
                }
            // }//
        }
    }

        //#2//
        if (inputSystem.isTriggered(InputAction.IA_ACTION_4, PointerEventType.PET_DOWN)) {
            const result = inputSystem.getInputCommand(InputAction.IA_ACTION_4, PointerEventType.PET_DOWN)
            if (result) {
                if (selectedItem && selectedItem.enabled && selectedItem.mode === EDIT_MODES.GRAB){
                    addPositiveGrabSystem()
                }else{
                    displayHover(false)
                    if (result.hit && result.hit.entityId) {
                        log('player pressed #2 on an object')
                        if (playerMode === SCENE_MODES.BUILD_MODE) {
                            log('player pressed #2 on an object in Build mode, need to duplicate')
                            let aid = getAssetIdByEntity(localPlayer.activeScene, result.hit.entityId as Entity)
                            if(aid){
                                duplicateItem(aid)
                            }
                        }
                    }
                }
            }
        }
        if (inputSystem.isTriggered(InputAction.IA_ACTION_4, PointerEventType.PET_UP)) {
            removePositiveGrabSystem()
        }
    
        //#3
        if (inputSystem.isTriggered(InputAction.IA_ACTION_5, PointerEventType.PET_DOWN)) {
            const result = inputSystem.getInputCommand(InputAction.IA_ACTION_5, PointerEventType.PET_DOWN)
            if (result) {
                if (selectedItem && selectedItem.enabled && selectedItem.mode === EDIT_MODES.GRAB){
                    addNegativeGrabSystem()
                }else{
                    displayHover(false)
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
        }
        if (inputSystem.isTriggered(InputAction.IA_ACTION_5, PointerEventType.PET_UP)) {
            removeNegativeGrabSystem()
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
                        if(selectedItem.already){
                            dropSelectedItem(undefined, selectedItem.already)
                        }else{
                            dropGrabbedItems()
                        }

                        displayGrabContextMenu(false)
                        removeNegativeGrabSystem()
                        removePositiveGrabSystem()
                    } else {
                        console.log('pressed e while editing asset, do nothing')
                    }
                } else {
                    log('player pressed #E on an object in Build mode, need to grab')
                    grabItem(result.hit.entityId as Entity)
                    displayGrabContextMenu(true)
                }
            } else {
                log('player pressed #E in Build mode')
                if (selectedItem && selectedItem.enabled) {
                    if (selectedItem.mode === EDIT_MODES.GRAB) {
                        if(selectedItem.already){
                            dropSelectedItem(undefined, selectedItem.already)
                        }else{
                            dropGrabbedItems()
                        }
                        displayGrabContextMenu(false)
                        removeNegativeGrabSystem()
                        removePositiveGrabSystem()
                    } else {
                        // saveItem()
                    }
                } else {
                    log('player pressed #E on in build mode without selecting item or hitting asset', hoveredEntity)
                }
            }
        }
    }

    //SECONDARY / F button
    if (inputSystem.isTriggered(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN)) {
        displayHover(false)
        setButtonState(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN)

        const result = inputSystem.getInputCommand(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN)
        // if(!uiInput){
            if (result) {
                if(selectedItem && selectedItem.enabled && selectedItem.mode === EDIT_MODES.GRAB){
                    console.log('pressed f while grabbing asset')
                    displayHover(true)
                    removeNegativeGrabSystem()
                    removePositiveGrabSystem()

                    if(settings.confirms){
                        displaySkinnyVerticalPanel(true, getView("Confirm_Delete_Grabbed"), "Grabbed Entity", ()=>{
                            displaySkinnyVerticalPanel(false)
                            displayGrabContextMenu(false)
                            displayHover(false)
                            deleteGrabbedItem()
                        })
                    }else{
                        displayHover(false)
                        displayGrabContextMenu(false)//
                        deleteGrabbedItem()
                    }
                }
                else if(selectedItem && selectedItem.enabled && selectedItem.mode === EDIT_MODES.EDIT){
                    console.log('pressed f while editing asset')
                }
                else{
                    console.log('pressed f while not grabbing or editing asset')
                    let aid = getAssetIdByEntity(localPlayer.activeScene, hoveredEntity)
                    console.log('aid is', aid)
                    if(aid){
                        removeNegativeGrabSystem()
                        removePositiveGrabSystem()
                        displayGrabContextMenu(false)
                        
                        if(settings.confirms){
                            updateSelectedAssetId(aid)
                            displaySkinnyVerticalPanel(true, getView("Confirm Delete Entity"), localPlayer.activeScene[COMPONENT_TYPES.NAMES_COMPONENT].get(aid).value)
                        }else{
                            deleteSelectedItem(aid)
                        }
                    }
                }
            }
        // }
    }

        // //SHIFT BUTTON
    if (inputSystem.isTriggered(InputAction.IA_WALK, PointerEventType.PET_DOWN)) {
        setButtonState(InputAction.IA_WALK, PointerEventType.PET_DOWN)
        console.log('button pressed')//

        const result = inputSystem.getInputCommand(InputAction.IA_WALK, PointerEventType.PET_DOWN)
        if (result) {
            if (selectedItem && selectedItem.enabled && selectedItem.mode === EDIT_MODES.GRAB){
                updateGrabModifier()
            }else{
                displayHover(false)
            }
        }
    }

    if (inputSystem.isTriggered(InputAction.IA_WALK, PointerEventType.PET_UP)) {
        setButtonState(InputAction.IA_WALK, null)

        const result = inputSystem.getInputCommand(InputAction.IA_WALK, PointerEventType.PET_UP)
        if (result) {
        }
    }


    //JUMP BUTTON
    if (inputSystem.isTriggered(InputAction.IA_JUMP, PointerEventType.PET_DOWN)) {
        setButtonState(InputAction.IA_JUMP, PointerEventType.PET_DOWN)
        displayHover(false)

        const result = inputSystem.getInputCommand(InputAction.IA_JUMP, PointerEventType.PET_DOWN)
        if (result) {
        }
    }

    if (inputSystem.isTriggered(InputAction.IA_JUMP, PointerEventType.PET_UP)) {
        setButtonState(InputAction.IA_JUMP, null)

        const result = inputSystem.getInputCommand(InputAction.IA_JUMP, PointerEventType.PET_UP)
        if (result) {
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