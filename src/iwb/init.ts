import {getPlayer} from "@dcl/sdk/players";
import {engine, executeTask} from "@dcl/sdk/ecs";
import { joinWorld } from "./components/Colyseus";
import { realm, setRealm } from "./components/Config";
import { getRealm } from "~system/Runtime";

export function initIWB() {
    // setupUi()

    const playerData = getPlayer()
    if (playerData) {
        executeTask(async () => {
            await setRealm()



            // engine.addSystem(BuildModeVisibiltyComponents)
            joinWorld(realm)
        })
    }
}