import { InputAction, PointerEventType, inputSystem } from "@dcl/sdk/ecs"
import { setButtonState } from "../listeners/inputListeners"
import { dropSelectedItem, removeSelectedItem, selectedCatalogItem } from "../modes/build"
import { checkShortCuts } from "../listeners/shortcuts"
import { log } from "../../helpers/functions"


export function InputListenSystem(dt:number){
 //DOWN BUTTON ACTIONS
        //POINTER
        if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN)){
            setButtonState(InputAction.IA_POINTER, PointerEventType.PET_DOWN)
          }
  
          //#1
          if (inputSystem.isTriggered(InputAction.IA_ACTION_3, PointerEventType.PET_DOWN)){
              // Logic in response to button press
          }
  
          //#2
          if (inputSystem.isTriggered(InputAction.IA_ACTION_4, PointerEventType.PET_DOWN)){
              // Logic in response to button press
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
              if(selectedCatalogItem !== null){
                log('player has selected item, need to delete')
                removeSelectedItem()
            }else{
                checkShortCuts()
            }
          }//
  
          //F
          if (inputSystem.isTriggered(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN)){
              setButtonState(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN)
              if(selectedCatalogItem !== null){
                log('player has selected item, need to drop')
                dropSelectedItem()
            }else{
                checkShortCuts()
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