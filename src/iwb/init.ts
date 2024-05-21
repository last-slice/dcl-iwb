import {getPlayer} from "@dcl/sdk/players";
import {engine, executeTask} from "@dcl/sdk/ecs";
import { joinWorld } from "./components/Colyseus";
import { realm, setRealm } from "./components/Config";
import { getRealm } from "~system/Runtime";
import { PlayerTrackingSystem } from "./systems/PlayerTrackingSystem";
import { BuildModeVisibiltyComponents } from "./systems/BuildModeVisibilitySystem";
import { FlyModeSystem } from "./systems/FlyModeSystem";
import { createInputListeners } from "./systems/InputSystem";
import { SelectedItemSystem } from "./systems/SelectedItemSystem";
import { setLocalUserId } from "./components/Player";

export function initIWB() {
    // setupUi()

    const playerData = setLocalUserId(getPlayer())
    if (playerData) {
        executeTask(async () => {
            await setRealm()

            // getAssetUploadToken()

            joinWorld(realm)
        })
    }
}