import { InputAction, PointerEventType, engine, inputSystem } from "@dcl/sdk/ecs";
import { checkShortCuts } from "./shortcuts";

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

    engine.addSystem(() => {

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

        //F
        if (inputSystem.isTriggered(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN)){
            setButtonState(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN)
            checkShortCuts()
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

        //F
        if (inputSystem.isTriggered(InputAction.IA_SECONDARY, PointerEventType.PET_UP)){
            setButtonState(InputAction.IA_SECONDARY, PointerEventType.PET_UP)
        }
    })
}

//