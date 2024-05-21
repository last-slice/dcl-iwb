import {engine, InputAction, PointerEventType, Transform} from "@dcl/sdk/ecs"
import { Vector3 } from "@dcl/sdk/math";
import { localPlayer } from "../components/Player";
import { VIEW_MODES } from "../helpers/types";
import { flyBox } from "../modes/Flying";
import { buttonsPressed } from "./InputSystem";
import { playerViewMode } from "../components/Config";

let lastPlayerPos: Vector3 | undefined = undefined

export function FlyModeSystem(dt: number) {

    let playerPos = Transform.get(engine.PlayerEntity).position

    // FLY MODE
    if (playerViewMode === VIEW_MODES.AVATAR) return;

    const moved = playerPos != lastPlayerPos
    if (!moved) return

    lastPlayerPos = playerPos

    let buttonPressed = false
    let jumped = false
    let shift = false
    const flyBoxtransform = Transform.getMutable(flyBox)
    buttonsPressed.forEach((value, key) => {
        if (value.id === PointerEventType.PET_DOWN && key !== InputAction.IA_POINTER) {
            buttonPressed = true
            console.log('button pressed', key)

            if (key === InputAction.IA_JUMP) {
                jumped = true
                //console.log('jumped')

                if (!shift) {
                    flyBoxtransform.position = {...flyBoxtransform.position, y: playerPos.y - .5}
                }
            }

            if (key === InputAction.IA_WALK) {
                shift = true
                //console.log('shift')
            }

            if (shift && jumped) {
                flyBoxtransform.position = {...flyBoxtransform.position, y: playerPos.y - 1.5}
            }
        }
    })

    // if (!buttonPressed) return
    //
    // //
    //  console.log('moved')
    // //const flyBoxtransform = Transform.getMutable(flyBox)
    //
    // if (cameraWorldHeight < playerPos.y - 4) {
    //     console.log('looking down')
    //    flyBoxtransform.position.y = Math.max(playerPos.y - .88 - .1, 0)
    // } else if (cameraWorldHeight > playerPos.y + 4) {
    //
    //     console.log('looking up')
    //    // flyBoxtransform.position.y = playerPos.y - .88 + .1
    // } else {
    //
    //     // console.log('looking straight')//
    //    // flyBoxtransform.position = {...playerPos, y: playerPos.y - .8801}
    // }


}