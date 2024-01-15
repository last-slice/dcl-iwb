import {engine, InputAction, PointerEventType, Transform} from "@dcl/sdk/ecs"
import {localPlayer} from "../player/player"
import {EDIT_MODES, SCENE_MODES, SERVER_MESSAGE_TYPES, VIEW_MODES} from "../../helpers/types"
import {selectedItem} from "../modes/build"
import {Vector3} from "@dcl/sdk/math";
import {flyBox} from "../modes/flying";
import {getWorldPosition} from "@dcl-sdk/utils";
import {buttonsPressed} from "../listeners/inputListeners";
import { sendServerMessage } from "../messaging";
import { checkScenePermissions } from "../scenes";

let lastPlayerPos: Vector3 | undefined = undefined

let time = 1

export function PlayerTrackingSystem(dt: number) {
    if(time > 0){
        time -= dt
    }

    let playerTransform = Transform.get(engine.PlayerEntity)
    let playerPos = playerTransform.position
    localPlayer.currentParcel = "" + Math.floor(playerPos.x / 16).toFixed(0) + "," + "" + Math.floor(playerPos.z / 16).toFixed(0)
    
    checkScenePermissions(localPlayer)

    const cameraWorldHeight = getWorldPosition(localPlayer.cameraParent).y

    // Selected Item Height Control
    if (selectedItem && selectedItem.enabled && selectedItem.entity && localPlayer.mode === SCENE_MODES.BUILD_MODE && selectedItem.mode === EDIT_MODES.GRAB) {
        // console.log('selected item', selectedItem.entity)
        let selEntity = Transform.getMutable(selectedItem.entity)

        if (!selEntity) return

        // console.log('selected item pos y', cameraWorldHeight)
        Transform.getMutable(selectedItem.entity).position = {
            ...selEntity.position,
            y: getWorldPosition(localPlayer.cameraParent).y - playerPos.y //+ selectedItem.initialHeight
        }
        if(time <= 0){
            sendServerMessage(SERVER_MESSAGE_TYPES.UPDATE_GRAB_Y_AXIS, {y:getWorldPosition(localPlayer.cameraParent).y - playerPos.y, aid:selectedItem.aid})
            time = 1
        }
    }

    // FLY MODE
    if (localPlayer.viewMode === VIEW_MODES.AVATAR) return;

    const moved = playerPos != lastPlayerPos
    if (!moved) return

    lastPlayerPos = playerPos

    let buttonPressed = false
    buttonsPressed.forEach((value, key) => {
        if (value.id === PointerEventType.PET_DOWN && key !== InputAction.IA_POINTER) {
            buttonPressed = true
            // console.log('button pressed', key)
        }
    })

    if (!buttonPressed) return


    // console.log('moved')
    const otherAvatarTransform = Transform.getMutable(flyBox)

    if (cameraWorldHeight < playerPos.y - .88) {
        // console.log('looking down')
        otherAvatarTransform.position.y = Math.max(cameraWorldHeight - .88 - .01, 0)
    } else if (cameraWorldHeight > playerPos.y + 1) {

        // console.log('looking up')
        otherAvatarTransform.position.y = cameraWorldHeight - .88 + .01
    } else {

        // console.log('looking straight')//
        otherAvatarTransform.position = {...playerPos, y: playerPos.y - .88}
    }


    // otherAvatarTransform.rotation = Transform.get(engine.CameraEntity).rotation


}
