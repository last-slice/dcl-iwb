import {engine, Transform} from "@dcl/sdk/ecs"
import { Quaternion } from "@dcl/sdk/math"
import { localPlayer } from "../components/Player"
import { checkScenePermissions } from "../components/Scene"
import { refreshMap } from "../ui/Objects/Map"
import { getPlayerPosition, getWorldPosition } from "@dcl-sdk/utils"
import { island } from "../components/Config"
import { showAdminToolbar } from "../ui/Objects/SceneAdminPanel"

export function PlayerTrackingSystem(dt: number) {
    // let playerPos = island === "world" ? Transform.get(engine.PlayerEntity).position : getPlayerPosition()
    let playerPos = Transform.get(engine.PlayerEntity).position

    // console.log('player position is', playerPos)
    localPlayer.rotation = Quaternion.toEulerAngles(Transform.get(engine.CameraEntity).rotation).y
    localPlayer.previousParcel = localPlayer.currentParcel
    localPlayer.currentParcel = "" + Math.floor(playerPos.x / 16).toFixed(0) + "," + "" + Math.floor(playerPos.z / 16).toFixed(0)
    // console.log('local player parcel is', localPlayer.currentParcel)
    checkScenePermissions()

    if(localPlayer.previousParcel && localPlayer.previousParcel !== localPlayer.currentParcel){
        refreshMap()
        showAdminToolbar(false)
    }
}