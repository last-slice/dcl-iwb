import {engine, Material, Transform, VisibilityComponent} from "@dcl/sdk/ecs"
import {localPlayer} from "../player/player"
import {EDIT_MODES, SCENE_MODES, SERVER_MESSAGE_TYPES} from "../../helpers/types"
import {selectedItem} from "../modes/build"
import {Color4, Quaternion, Vector3} from "@dcl/sdk/math";
import {getWorldPosition, getWorldRotation} from "@dcl-sdk/utils";
import {sendServerMessage} from "../messaging";
import {log} from "../../helpers/functions";
import {bbE, createBBForEntity, isEntityInScene} from "../../helpers/build";
import {items} from "../catalog";

let lastPlayerPos: Vector3 | undefined = undefined

let time = 1
let movetime = 5

export let isSnapEnabled = false

let userRotationY = 0

export function rotateSelectedItem() {
    userRotationY = (userRotationY + 90) % 360
}

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


function getSnapPosition(playerPosition: Vector3, playerRotation: Quaternion, forwardVectorDistance: number) {

    //const {position: playerPosition, rotation: playerRotation} = Transform.get(engine.PlayerEntity)
    const forwardVector = Vector3.rotate(Vector3.scale(Vector3.Forward(), forwardVectorDistance), playerRotation)
    const finalPosition = Vector3.add(playerPosition, forwardVector)

    //log('position is', finalPosition)

    const worldX = finalPosition.x
    const worldZ = finalPosition.z

    //log('world pos', palyerX, playerZ)

    const newXPos = nearest(worldX, 1) //- worldX
    const newZPos = nearest(worldZ, 1) // - worldZ + 4

    //log('new pos', newXPos, newZPos)

    return [newXPos, newZPos]
}

function getSnapYRotation(playerRotation: Quaternion, itemRotation: Quaternion) {
    const eulerP = Quaternion.toEulerAngles(playerRotation)
    const eulerI = Quaternion.toEulerAngles(itemRotation)
    return nearest(eulerI.y, 90)  //+ userRotationY //- eulerP.y
}

export function SelectedItemSystem(dt: number) {
    if (time > 0) {
        time -= dt
    }

    if (selectedItem && selectedItem.enabled && selectedItem.entity && localPlayer.mode === SCENE_MODES.BUILD_MODE && selectedItem.mode === EDIT_MODES.GRAB) {
        // console.log('selected item', selectedItem.entity)
        let selEntityTransform = Transform.getMutable(selectedItem.entity)

        if (!selEntityTransform) return

        const {position: playerPos, rotation: playerRotation} = Transform.get(engine.PlayerEntity)

        // Selected Item Height Control
        let newYPos = getWorldPosition(localPlayer.cameraParent).y - playerPos.y //+ selectedItem.initialHeight

        let itemData = items.get(selectedItem.catalogId)
        newYPos = Math.max(newYPos, -playerPos.y)//(itemData?.bb.y * selEntityTransform.scale.y / 2) - (playerPos.y))


        // Set new item position w. snap
        if (isSnapEnabled) {

            const cameraT = Transform.get(localPlayer.cameraParent).position
            const snapPos = getSnapPosition(playerPos, playerRotation, 4)

            //log('selected item pos', playerT.x + snapPos[0], playerT.z + snapPos[1])
            selEntityTransform.position = {
                x: snapPos[0],
                y: newYPos + playerPos.y,
                z: snapPos[1]
            }

            const selEul = Quaternion.toEulerAngles(selEntityTransform.rotation)

            selEntityTransform.rotation =
                Quaternion.fromEulerDegrees(
                    selEul.x,
                    getSnapYRotation(playerRotation, getWorldRotation(selectedItem.entity)),
                    selEul.z
                )

            selEntityTransform.parent = undefined

        } else {

            // Set new item position w.o snap
            selEntityTransform.position = {
                x: 0, z: 4,
                y: newYPos //+ selectedItem.initialHeight
            }

            selEntityTransform.parent = engine.PlayerEntity
        }


        const isInside = isEntityInScene(selectedItem.entity, selectedItem.catalogId)
        if (!isInside) {
            createBBForEntity(selectedItem.entity, selectedItem.catalogId)
            Material.setPbrMaterial(bbE, {albedoColor: Color4.create(1, 0, 0, 0.25)})
            VisibilityComponent.createOrReplace(bbE, {visible: true})
        } else {
            Material.setPbrMaterial(bbE, {albedoColor: Color4.create(0, 1, 0, 0.25)})
            VisibilityComponent.createOrReplace(bbE, {visible: false})
        }

        if (time <= 0) {
            sendServerMessage(SERVER_MESSAGE_TYPES.UPDATE_GRAB_Y_AXIS, {
                y: getWorldPosition(localPlayer.cameraParent).y - playerPos.y,
                aid: selectedItem.aid
            })
            time = 1
        }
    }
}
