import {getPlayer} from "@dcl/sdk/players";
import { executeTask} from "@dcl/sdk/ecs";
import { getSceneInformation } from '~system/Runtime'
import { joinWorld } from "./components/Colyseus";
import { realm, setRealm } from "./components/Config";
import { setupUI } from "./ui/ui";
import { getPreview } from "./helpers/functions";
import { setLocalUserId } from "./components/Player";
import { getExplorerConfiguration } from "~system/EnvironmentApi"
import { utils } from "./helpers/libraries";

export function initIWB() {
    setupUI()

    getPreview().then(()=>{
        let data:any
        try{
            getExplorerConfiguration({}).then((hardware:any) => {
                data = hardware
                console.log('hardware data is', data)

                checkPlayer(data)
            })
        }
        catch(e){
            console.log('cannot run deprecated function get explorer configuration', e)
        }
    })
}

function checkPlayer(hardwareData:any){
    let player = getPlayer()
    console.log('player is', player)
    if(!player){
        console.log('player data not set, backing off and trying again')
        utils.timers.setTimeout(()=>{
            checkPlayer(hardwareData)
        }, 100)
    }
    else{
        createPlayer(hardwareData, player)
    }
}

function createPlayer(hardwareData:any, player:any){
    const playerData = setLocalUserId(player)
    if (playerData) {
        executeTask(async () => {

            const sceneInfo = await getSceneInformation({})
            if (!sceneInfo) return

            const sceneJson = JSON.parse(sceneInfo.metadataJson)
            console.log("scene json is", sceneJson)

            if(!sceneJson.iwb) return
            await setRealm(sceneJson, hardwareData.clientUri)

            joinWorld(realm)

            // await createPhysics()
            // addTestVehicle()////
        })
    }
}

//npm run start -- --explorer-alpha   