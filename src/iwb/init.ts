import {getPlayer} from "@dcl/sdk/players";
import {engine, executeTask} from "@dcl/sdk/ecs";

import { joinWorld } from "./components/Colyseus";
import { addPlayer } from "./components/Player";
export function initIWB() {
    // setupUi()

    const playerData = getPlayer()
    console.log("getuserdata is", playerData)
    if (playerData) {

        executeTask(async () => {
            await addPlayer(playerData.userId, true, [{dclData: playerData}])
            joinWorld("LocalPreview")
        })
    }
}