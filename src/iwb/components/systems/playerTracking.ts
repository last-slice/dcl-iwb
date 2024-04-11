import {engine, Transform} from "@dcl/sdk/ecs"
import {localPlayer} from "../player/player"
import {checkScenePermissions} from "../scenes";
import { Quaternion } from "@dcl/sdk/math";
import { refreshMap } from "../../ui/map";


export function PlayerTrackingSystem(dt: number) {
    let playerPos = Transform.get(engine.PlayerEntity).position
    localPlayer.rotation = Quaternion.toEulerAngles(Transform.get(engine.CameraEntity).rotation).y
    localPlayer.previousParcel = localPlayer.currentParcel
    localPlayer.currentParcel = "" + Math.floor(playerPos.x / 16).toFixed(0) + "," + "" + Math.floor(playerPos.z / 16).toFixed(0)
    checkScenePermissions(localPlayer)

    if(localPlayer.previousParcel && localPlayer.previousParcel !== localPlayer.currentParcel){
        refreshMap()
    }
}
