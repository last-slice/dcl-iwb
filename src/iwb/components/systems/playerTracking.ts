import {engine, InputAction, PointerEventType, Transform} from "@dcl/sdk/ecs"
import {localPlayer} from "../player/player"
import {EDIT_MODES, SCENE_MODES, SERVER_MESSAGE_TYPES, VIEW_MODES} from "../../helpers/types"
import {selectedItem} from "../modes/build"
import {Vector3} from "@dcl/sdk/math";
import {flyBox} from "../modes/flying";
import {getWorldPosition} from "@dcl-sdk/utils";
import {buttonsPressed} from "../listeners/inputListeners";
import {sendServerMessage} from "../messaging";
import {checkScenePermissions} from "../scenes";
import {log} from "../../helpers/functions";
import {findSceneByParcel, getParcelForPosition, isItemInScene} from "../../helpers/build";
import {items} from "../catalog";

let lastPlayerPos: Vector3 | undefined = undefined

let time = 1
let movetime = 5


export let isSnapEnabled = false

export function toggleSnapMode() {
    log('snap mode', isSnapEnabled)
    isSnapEnabled = !isSnapEnabled
}


// get the nearest number value closest to the number at the given precision
function nearest(value: number, precision: number) {
    //console.log('value', value, 'precision', precision, Math.trunc(value), Math.trunc(value) + precision, clamp(value, Math.trunc(value), Math.trunc(value) + precision))
    //log('near', Math.round(value / precision) * precision)

    return Math.round(value / precision) * precision
}


function getSnapPosition() {

    const {position: playerPosition, rotation: playerRotation} = Transform.get(engine.PlayerEntity)
    const forwardVector = Vector3.rotate(Vector3.scale(Vector3.Forward(), 4), playerRotation)
    const finalPosition = Vector3.add(playerPosition, forwardVector)

    //log('position is', finalPosition)

    const worldX = finalPosition.x
    const worldZ = finalPosition.z

    // const playerT = Transform.get(engine.PlayerEntity).position
    //const palyerX = playerPosition.x
    //const playerZ = playerPosition.z

    //console.log('world pos', palyerX, playerZ)

    const newXPos = nearest(worldX, 1) - worldX
    const newZPos = nearest(worldZ, 1) - worldZ + 4

    //console.log('new pos', newXPos, newZPos)

    return [newXPos, newZPos]
}


export function PlayerTrackingSystem(dt: number) {
    if (time > 0) {
        time -= dt
    }

    let playerPos = Transform.get(engine.PlayerEntity).position
    localPlayer.currentParcel = "" + Math.floor(playerPos.x / 16).toFixed(0) + "," + "" + Math.floor(playerPos.z / 16).toFixed(0)

    checkScenePermissions(localPlayer)

    // Selected Item Height Control
    if (selectedItem && selectedItem.enabled && selectedItem.entity && localPlayer.mode === SCENE_MODES.BUILD_MODE && selectedItem.mode === EDIT_MODES.GRAB) {
        // console.log('selected item', selectedItem.entity)
        let selEntityTransform = Transform.getMutable(selectedItem.entity)

        if (!selEntityTransform) return

        const newYPos = getWorldPosition(localPlayer.cameraParent).y - playerPos.y //+ selectedItem.initialHeight

        // Set new item position w. snap
        if (isSnapEnabled) {

            const cameraT = Transform.get(localPlayer.cameraParent).position
            const snapPos = getSnapPosition()
            const playerT = Transform.get(engine.PlayerEntity).position

            //log('selected item pos', playerT.x + snapPos[0], playerT.z + snapPos[1])
            selEntityTransform.position = {
                x: snapPos[0],
                y: newYPos,
                z: snapPos[1]
            }

            // Set new item position w.o snap
        } else {
            selEntityTransform.position = {
                ...selEntityTransform.position,
                y: newYPos //+ selectedItem.initialHeight
            }
        }

        // check if object inside scene boundaries
        const itemWorldPositon = getWorldPosition(selectedItem.entity)
        const curParcel = getParcelForPosition(itemWorldPositon.x, itemWorldPositon.z)
        //log('cur parcel', curParcel)
        const curScene = findSceneByParcel(curParcel)
        //log('cur scene', curScene)

        if (curScene) {

            let itemData = items.get(selectedItem.catalogId)

            const isInside = isItemInScene({
                    position: itemWorldPositon,
                    scale: selEntityTransform.scale,
                    rotation: selEntityTransform.rotation
                },
                itemData?.bb ?? {x: 1, z: 1},
                curScene.pcls)

            log('is inside', isInside)

        } else {
            log('item is outside of scene')
        }

        if (time <= 0) {
            sendServerMessage(SERVER_MESSAGE_TYPES.UPDATE_GRAB_Y_AXIS, {
                y: getWorldPosition(localPlayer.cameraParent).y - playerPos.y,
                aid: selectedItem.aid
            })
            time = 1
        }
    }

    // FLY MODE
    if (localPlayer.viewMode === VIEW_MODES.AVATAR) return;

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
