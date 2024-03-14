import {engine, Transform} from "@dcl/sdk/ecs"
import {localPlayer} from "../player/player"
import {checkScenePermissions} from "../scenes";


export function PlayerTrackingSystem(dt: number) {

    let playerPos = Transform.get(engine.PlayerEntity).position
    localPlayer.currentParcel = "" + Math.floor(playerPos.x / 16).toFixed(0) + "," + "" + Math.floor(playerPos.z / 16).toFixed(0)

    checkScenePermissions(localPlayer)

}
