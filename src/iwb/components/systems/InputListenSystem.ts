import {engine, Entity, InputAction, inputSystem, PointerEvents, PointerEventType} from "@dcl/sdk/ecs"
import {setButtonState} from "../listeners/inputListeners"
import {
    addEditSelectionPointer,
    cancelCatalogItem,
    cancelEditingItem,
    cancelSelectedItem,
    deleteSelectedItem,
    dropSelectedItem,
    duplicateItem,
    duplicateItemInPlace,
    editItem,
    grabItem,
    saveItem,
    selectedItem,
    sendServerDelete
} from "../modes/build"
import {checkShortCuts} from "../listeners/shortcuts"
import {log} from "../../helpers/functions"
import {localPlayer, localUserId, players, settings} from "../player/player"
import {EDIT_MODES, SCENE_MODES} from "../../helpers/types"
import {displayHover, updateContextEvents} from "../../ui/contextMenu"
import { displayConfirmDeletePanel } from "../../ui/Panels/confirmDeleteItemPanel"
import { itemIdsFromEntities } from "../scenes"
import { items } from "../catalog"


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

export let hoveredEntity:Entity

export function InputListenSystem(dt: number) {

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
    if (hover && hover.hit && hover.hit.entityId) {
        if(selectedItem && !selectedItem.enabled){
            displayHover(false)
            hoveredEntity = -500 as Entity
        }
    }


    //DOWN BUTTON ACTIONS
    //POINTER
    if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN)) {
        setButtonState(InputAction.IA_POINTER, PointerEventType.PET_DOWN)
        selectedItem && !selectedItem.enabled ? displayHover(false) : null
    }


    //#1
    if (inputSystem.isTriggered(InputAction.IA_ACTION_3, PointerEventType.PET_DOWN)) {
        displayHover(false)

        const result = inputSystem.getInputCommand(InputAction.IA_ACTION_3, PointerEventType.PET_DOWN)
        if (result) {
            if (result.hit && result.hit.entityId) {
                log('player pressed #1 on an object')
                if (players.get(localUserId)?.mode === SCENE_MODES.BUILD_MODE) {
                    if (selectedItem && selectedItem.enabled) {
                        if(selectedItem.mode === EDIT_MODES.GRAB){
                            log('player wants to cancel grabbing selected item')//
                            cancelSelectedItem()
                        }
                    } else {
                        log('player does not have item selected, just edit it')
                        editItem(result.hit.entityId as Entity, EDIT_MODES.EDIT)
                    }
                }
            } else {
                if (players.get(localUserId)?.mode === SCENE_MODES.BUILD_MODE) {
                    if (selectedItem && selectedItem.enabled && selectedItem.mode === EDIT_MODES.GRAB) {
                        log('player wants to delete selected item')
                        // deleteSelectedItem(selectedItem.entity)
                        cancelSelectedItem()
                    } else {
                        log('player pressed #1 on nothing in Build mode, need to grab')
                    }
                }
            }
        }
    }

    //#2//
    if (inputSystem.isTriggered(InputAction.IA_ACTION_4, PointerEventType.PET_DOWN)) {
        displayHover(false)

        // Logic in response to button press
        const result = inputSystem.getInputCommand(InputAction.IA_ACTION_4, PointerEventType.PET_DOWN)
        if (result) {
            if (result.hit && result.hit.entityId) {
                log('player pressed #2 on an object')
                if (players.get(localUserId)?.mode === SCENE_MODES.BUILD_MODE) {
                    log('player pressed #2 on an object in Build mode, need to duplicate')
                    duplicateItem(result.hit.entityId as Entity)
                }
            }
        }
    }

    //#3
    if (inputSystem.isTriggered(InputAction.IA_ACTION_5, PointerEventType.PET_DOWN)) {
        // Logic in response to button press
        displayHover(false)

        // Logic in response to button press
        const result = inputSystem.getInputCommand(InputAction.IA_ACTION_5, PointerEventType.PET_DOWN)
        if (result) {
            if (result.hit && result.hit.entityId) {
                log('player pressed #3 on an object')
                if (players.get(localUserId)?.mode === SCENE_MODES.BUILD_MODE) {
                    log('player pressed #3 on an object in Build mode, need to duplicate in place')
                    duplicateItemInPlace(result.hit.entityId as Entity)
                }
            }
        }
    }

    //#4
    if (inputSystem.isTriggered(InputAction.IA_ACTION_6, PointerEventType.PET_DOWN)) {
        // Logic in response to button press
        displayHover(false)
    }

    //Shift
    if (inputSystem.isTriggered(InputAction.IA_WALK, PointerEventType.PET_DOWN)) {
        displayHover(false)
        setButtonState(InputAction.IA_WALK, PointerEventType.PET_DOWN)
        checkShortCuts()
    }

    //E
    if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)) {
        displayHover(false)
        setButtonState(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)
        const result = inputSystem.getInputCommand(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)
        if (result) {
            if (result.hit && result.hit.entityId) {
                if (players.get(localUserId)!.mode === SCENE_MODES.BUILD_MODE) {
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
                }
            } else {
                if (players.get(localUserId)!.mode === SCENE_MODES.BUILD_MODE) {
                    log('player pressed #E in Build mode')
                    if (selectedItem && selectedItem.enabled) {
                        if (selectedItem.mode === EDIT_MODES.GRAB) {
                            dropSelectedItem()
                        } else {
                            // saveItem()
                        }
                    } else {
                        log('player pressed #E on in build mode without selecting item or hitting asset')
                    }
                }
            }
        } else {
            checkShortCuts()
        }
    }

    //F
    if (inputSystem.isTriggered(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN)) {
        displayHover(false)
        setButtonState(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN)
        const result = inputSystem.getInputCommand(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN)
        if (result) {
            if (result.hit && result.hit.entityId) {
                log('player pressed #F on an object')
                if (players.get(localUserId)!.mode === SCENE_MODES.BUILD_MODE) {
                    log('player pressed #F on an object in Build mode, need to edit')
                    if (selectedItem && selectedItem.enabled) {
                        log('player has selected item, need to delete')
                        if (selectedItem.mode === EDIT_MODES.GRAB) {
                            deleteSelectedItem(selectedItem.entity)
                        } else {
                            console.log('pressed F while editing asset, do nothing')
                        }
                    } else {
                        log('player pressed #E on an object taht isnt selected need to delete')
                        if(settings.confirms){
                            displayConfirmDeletePanel(true, result.hit.entityId as Entity)
                        }else{
                            deleteSelectedItem(result.hit.entityId as Entity)
                        }
                    }
                }
            } else {
                if (players.get(localUserId)!.mode === SCENE_MODES.BUILD_MODE) {
                    log('player pressed #F on an object with no result in Build mode, need to delete', hoveredEntity)
                    if (selectedItem && selectedItem.enabled) {
                        log('player has selected item, need to delete')
                        if (selectedItem.mode === EDIT_MODES.GRAB) {
                            deleteSelectedItem(selectedItem.entity)
                        } else {
                            // saveItem()
                        }
                    } else {
                        log('player does not have item selected')
                        sendServerDelete(hoveredEntity)
                    }
                } else {
                    //didnt hit an object and not in build mode
                    checkShortCuts()
                }
            }
        } else {
            log('pressed F key but no result')
        }
    }

    //W
    if (inputSystem.isTriggered(InputAction.IA_FORWARD, PointerEventType.PET_DOWN)) {
        setButtonState(InputAction.IA_FORWARD, PointerEventType.PET_DOWN)
    }
    //A
    if (inputSystem.isTriggered(InputAction.IA_LEFT, PointerEventType.PET_DOWN)) {
        setButtonState(InputAction.IA_LEFT, PointerEventType.PET_DOWN)
    }
    //S
    if (inputSystem.isTriggered(InputAction.IA_BACKWARD, PointerEventType.PET_DOWN)) {
        setButtonState(InputAction.IA_BACKWARD, PointerEventType.PET_DOWN)
    }
    //D
    if (inputSystem.isTriggered(InputAction.IA_RIGHT, PointerEventType.PET_DOWN)) {
        setButtonState(InputAction.IA_RIGHT, PointerEventType.PET_DOWN)
    }

    // JUMP
    if (inputSystem.isTriggered(InputAction.IA_JUMP, PointerEventType.PET_DOWN)) {
        setButtonState(InputAction.IA_JUMP, PointerEventType.PET_DOWN)
    }


    //BUTTONS UP
    if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_UP)) {
        setButtonState(InputAction.IA_POINTER, PointerEventType.PET_UP)
    }

    //#1
    if (inputSystem.isTriggered(InputAction.IA_ACTION_3, PointerEventType.PET_UP)) {
        setButtonState(InputAction.IA_ACTION_3, PointerEventType.PET_UP)
    }

    //#2
    if (inputSystem.isTriggered(InputAction.IA_ACTION_4, PointerEventType.PET_UP)) {
        setButtonState(InputAction.IA_ACTION_4, PointerEventType.PET_UP)
    }

    //#3
    if (inputSystem.isTriggered(InputAction.IA_ACTION_5, PointerEventType.PET_UP)) {
        setButtonState(InputAction.IA_ACTION_5, PointerEventType.PET_UP)
    }

    //#4
    if (inputSystem.isTriggered(InputAction.IA_ACTION_6, PointerEventType.PET_UP)) {
        setButtonState(InputAction.IA_ACTION_6, PointerEventType.PET_UP)
    }

    //Shift
    if (inputSystem.isTriggered(InputAction.IA_WALK, PointerEventType.PET_UP)) {
        setButtonState(InputAction.IA_WALK, PointerEventType.PET_UP)
    }

    //E
    if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_UP)) {
        setButtonState(InputAction.IA_PRIMARY, PointerEventType.PET_UP)
    }

    //F
    if (inputSystem.isTriggered(InputAction.IA_SECONDARY, PointerEventType.PET_UP)) {
        setButtonState(InputAction.IA_SECONDARY, PointerEventType.PET_UP)
    }

    //W
    if (inputSystem.isTriggered(InputAction.IA_FORWARD, PointerEventType.PET_UP)) {
        //log('W button up')
        setButtonState(InputAction.IA_FORWARD, PointerEventType.PET_UP)
    }
    //A
    if (inputSystem.isTriggered(InputAction.IA_LEFT, PointerEventType.PET_UP)) {
        //console.log('A button up')
        setButtonState(InputAction.IA_LEFT, PointerEventType.PET_UP)
    }
    //S
    if (inputSystem.isTriggered(InputAction.IA_BACKWARD, PointerEventType.PET_UP)) {
        //console.log('S button up')
        setButtonState(InputAction.IA_BACKWARD, PointerEventType.PET_UP)
    }
    //D
    if (inputSystem.isTriggered(InputAction.IA_RIGHT, PointerEventType.PET_UP)) {
        //console.log('D button up')
        setButtonState(InputAction.IA_RIGHT, PointerEventType.PET_UP)
    }
    // JUMP
    if (inputSystem.isTriggered(InputAction.IA_JUMP, PointerEventType.PET_UP)) {
        //console.log('jump button up')
        setButtonState(InputAction.IA_JUMP, PointerEventType.PET_UP)
    }
}