import {getPlayer} from "@dcl/sdk/players";
import { executeTask} from "@dcl/sdk/ecs";
import { getSceneInformation } from '~system/Runtime'
import { joinWorld } from "./components/Colyseus";
import { realm, setRealm } from "./components/Config";
import { setupUI } from "./ui/ui";
import { getPreview } from "./helpers/functions";
import { setLocalUserId } from "./components/Player";
import { getExplorerConfiguration } from "~system/EnvironmentApi"
import { createPhysics } from "./physics";
import { addTestVehicle } from "./components/Vehicle";

export function initIWB() {
    setupUI()

    getPreview().then(()=>{
        getExplorerConfiguration({}).then((data) => {
            console.log('hardware data is', data)
            const playerData = setLocalUserId(getPlayer())
            if (playerData) {
                executeTask(async () => {

                    const sceneInfo = await getSceneInformation({})
                    if (!sceneInfo) return

                    const sceneJson = JSON.parse(sceneInfo.metadataJson)
                    console.log("scene json is", sceneJson)

                    if(!sceneJson.iwb) return
                    await setRealm(sceneJson, data.clientUri)
        
                    joinWorld(realm)

                    // await createPhysics()
                    // addTestVehicle()//
                })
            }
        })
    })
}