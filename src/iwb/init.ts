import {getPlayer} from "@dcl/sdk/players";
import { executeTask} from "@dcl/sdk/ecs";
import { joinWorld } from "./components/Colyseus";
import { realm, setRealm } from "./components/Config";
import { setLocalUserId } from "./components/Player";
import { setupUI } from "./ui/ui";
import { getPreview } from "./helpers/functions";

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