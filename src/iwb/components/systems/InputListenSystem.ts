import { Entity, InputAction, PointerEventType, inputSystem } from "@dcl/sdk/ecs"
import { setButtonState } from "../listeners/inputListeners"
import { cancelSelectedItem, deleteSelectedItem, dropSelectedItem, duplicateItem, editItem, grabItem, removeSelectedItem, saveItem, selectedItem, sendServerDelete } from "../modes/build"
import { checkShortCuts } from "../listeners/shortcuts"
import { log } from "../../helpers/functions"
import { localUserId, players } from "../player/player"
import { EDIT_MODES, SCENE_MODES } from "../../helpers/types"


export function InputListenSystem(dt:number){
 //DOWN BUTTON ACTIONS
        //POINTER
        if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN)){
            setButtonState(InputAction.IA_POINTER, PointerEventType.PET_DOWN)
          }
  
          //#1
          if (inputSystem.isTriggered(InputAction.IA_ACTION_3, PointerEventType.PET_DOWN)){
              const result = inputSystem.getInputCommand(InputAction.IA_ACTION_3, PointerEventType.PET_DOWN)
              if(result){
                if(result.hit && result.hit.entityId){
                    log('player pressed #1 on an object')
                    if(players.get(localUserId)?.mode === SCENE_MODES.BUILD_MODE){
                        if(selectedItem && selectedItem.enabled){
                            log('player wants to delete selected item')
                            deleteSelectedItem()
                        }else{
                            log('player pressed #1 on an object in Build mode, need to grab')
                            grabItem(result.hit.entityId as Entity)
                        }
                    }
                }else{
                    if(players.get(localUserId)?.mode === SCENE_MODES.BUILD_MODE){
                        if(selectedItem && selectedItem.enabled){
                            log('player wants to delete selected item')
                            deleteSelectedItem()
                        }else{
                            log('player pressed #1 on nothing in Build mode, need to grab')
                        }
                    }
                }
            }
          }//
  
          //#2//
          if (inputSystem.isTriggered(InputAction.IA_ACTION_4, PointerEventType.PET_DOWN)){
              // Logic in response to button press
              const result = inputSystem.getInputCommand(InputAction.IA_ACTION_4, PointerEventType.PET_DOWN)
              if(result){
                if(result.hit && result.hit.entityId){
                    log('player pressed #2 on an object')
                    if(players.get(localUserId)?.mode === SCENE_MODES.BUILD_MODE){
                        log('player pressed #2 on an object in Build mode, need to duplicate')
                        duplicateItem(result.hit.entityId as Entity)
                    }
                }
            }
          }
  
          //#3
          if (inputSystem.isTriggered(InputAction.IA_ACTION_5, PointerEventType.PET_DOWN)){
              // Logic in response to button press
          }
  
          //#4
          if (inputSystem.isTriggered(InputAction.IA_ACTION_6, PointerEventType.PET_DOWN)){
              // Logic in response to button press
          }
  
          //Shift
          if (inputSystem.isTriggered(InputAction.IA_WALK, PointerEventType.PET_DOWN)){
              setButtonState(InputAction.IA_WALK, PointerEventType.PET_DOWN)
              checkShortCuts()
          }
  
          //E
          if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)){
              setButtonState(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)
              const result = inputSystem.getInputCommand(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)
              if(result){
                if(result.hit && result.hit.entityId){
                    log('player pressed #E on an object')
                    if(players.get(localUserId)!.mode === SCENE_MODES.BUILD_MODE){
                        log('player pressed #E on an object in Build mode')
                        if(selectedItem && selectedItem.enabled){
                            log('player wants to cancel selected item')
                            cancelSelectedItem()
                        }else{
                            log('player pressed #E on an object taht isnt selected need to delete')
                            sendServerDelete(result.hit.entityId as Entity)
                        }
                    }//
                 }else{
                    if(players.get(localUserId)!.mode === SCENE_MODES.BUILD_MODE){
                        log('player pressed #E in Build mode')
                        if(selectedItem && selectedItem.enabled){
                            log('player wants to cancel selected item')
                            cancelSelectedItem()
                        }else{
                            log('player pressed #E on in build mode without selecting item or hitting asset')
                        }
                    }
                 }
              }
              else{
                checkShortCuts()
              }
          }
  
          //F
          if (inputSystem.isTriggered(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN)){
              setButtonState(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN)
              const result = inputSystem.getInputCommand(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN)
              if(result){
                if(result.hit && result.hit.entityId){
                    log('player pressed #F on an object')
                    if(players.get(localUserId)!.mode === SCENE_MODES.BUILD_MODE){
                        log('player pressed #F on an object in Build mode, need to edit')
                        if(selectedItem && selectedItem.enabled){
                            log('player has selected item, need to delete')
                            if(selectedItem.mode === EDIT_MODES.GRAB){
                                dropSelectedItem()
                            }else{
                                saveItem()
                            }
                        }else{
                            log('player does not have item selected, just edit it')
                            editItem(result.hit.entityId as Entity, EDIT_MODES.EDIT)
                        }
                    }
                 }else{               
                    if(players.get(localUserId)!.mode === SCENE_MODES.BUILD_MODE){
                    log('player pressed #F on an object in Build mode, need to edit')
                    if(selectedItem && selectedItem.enabled){
                        log('player has selected item, need to delete')
                        if(selectedItem.mode === EDIT_MODES.GRAB){
                            dropSelectedItem()
                        }else{
                            saveItem()
                        }
                    }else{
                        log('player does not have item selected')
                    }
                }else{
                    //didnt hit an object and not in build mode
                    checkShortCuts()
                }
                 }
              }
              else{
                log('pressed F key but no result')
              }
          }
  
          
  
  
  
          //BUTTONS UP
          if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_UP)){
              setButtonState(InputAction.IA_POINTER, PointerEventType.PET_UP)
          }
    
          //#1
          if (inputSystem.isTriggered(InputAction.IA_ACTION_3, PointerEventType.PET_UP)){
              setButtonState(InputAction.IA_ACTION_3, PointerEventType.PET_UP)
          }
  
          //#2
          if (inputSystem.isTriggered(InputAction.IA_ACTION_4, PointerEventType.PET_UP)){
              setButtonState(InputAction.IA_ACTION_4, PointerEventType.PET_UP)
          }
  
          //#3
          if (inputSystem.isTriggered(InputAction.IA_ACTION_5, PointerEventType.PET_UP)){
              setButtonState(InputAction.IA_ACTION_5, PointerEventType.PET_UP)
          }
  
          //#4
          if (inputSystem.isTriggered(InputAction.IA_ACTION_6, PointerEventType.PET_UP)){
              setButtonState(InputAction.IA_ACTION_6, PointerEventType.PET_UP)
          }
  
          //Shift
          if (inputSystem.isTriggered(InputAction.IA_WALK, PointerEventType.PET_UP)){
              setButtonState(InputAction.IA_WALK, PointerEventType.PET_UP)
          }
  
          //E
          if (inputSystem.isTriggered(InputAction.IA_SECONDARY, PointerEventType.PET_UP)){
              setButtonState(InputAction.IA_PRIMARY, PointerEventType.PET_UP)
          }
  
          //F
          if (inputSystem.isTriggered(InputAction.IA_SECONDARY, PointerEventType.PET_UP)){
              setButtonState(InputAction.IA_SECONDARY, PointerEventType.PET_UP)
          }
}