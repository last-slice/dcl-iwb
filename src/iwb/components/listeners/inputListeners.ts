import { InputAction, PointerEventType, engine, inputSystem } from "@dcl/sdk/ecs";

export function createInputListeners(){
    engine.addSystem(() => {

        //POINTER
        if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN)){
          // Logic in response to button press
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

        //#Shift
        if (inputSystem.isTriggered(InputAction.IA_WALK, PointerEventType.PET_DOWN)){
            // Logic in response to button press
        }


    })

}