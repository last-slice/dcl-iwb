import {getPlayer} from "@dcl/sdk/players";
import { PointerLock, engine, executeTask} from "@dcl/sdk/ecs";
import { joinWorld } from "./components/Colyseus";
import { realm, setRealm } from "./components/Config";
import { setupUI } from "./ui/ui";
import { getPreview } from "./helpers/functions";
import { setLocalUserId } from "./components/Player";

export function initIWB() {
    setupUI()

    getPreview().then(()=>{
        const playerData = setLocalUserId(getPlayer())
        if (playerData) {
            executeTask(async () => {
                await setRealm()
    
                // getAssetUploadToken()
    
                joinWorld(realm)
            })
        }
    })
}