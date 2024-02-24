import {setupUi} from "./ui/ui";
import {joinWorld} from "./components/messaging";
import {getAssetUploadToken, getPreview, log} from "./helpers/functions";
import {createInputListeners} from "./components/listeners/inputListeners";
import {addPlayer, getPlayerNames} from "./components/player/player";
import {
    engine,
    executeTask,
    InputAction,
    MeshCollider,
    MeshRenderer,
    pointerEventsSystem,
    Transform
} from "@dcl/sdk/ecs";
import {PlayerTrackingSystem} from "./components/systems/playerTracking";
import {BuildModeVisibiltyComponents} from "./components/systems/BuildModeVisibilty";
import {getRealm} from "~system/Runtime";
import {realm, updateRealm} from "./components/scenes";
import {getPlayer} from "@dcl/sdk/players";
import {Vector3} from "@dcl/sdk/math";
import {triggerEmote} from "~system/RestrictedActions";

export function initIWB() {
    setupUi()

    getPreview().then(() => {

        const playerData = getPlayer()

        log("getuserdata is", playerData)
        if (playerData) {

            executeTask(async () => {
                await addPlayer(playerData.userId, true, [{dclData: playerData}])
                await getPlayerNames()

                let realmData = await getRealm({})
                updateRealm(realmData.realmInfo ? realmData.realmInfo.realmName === "LocalPreview" ? "BuilderWorld.dcl.eth" : realmData.realmInfo.realmName : "")

                engine.addSystem(BuildModeVisibiltyComponents)

                getAssetUploadToken()

                engine.addSystem(PlayerTrackingSystem)
            })

            //add input listeners
            createInputListeners()

            // // Login with dcl auth and retrieve jwt
            // const {body, status} = await signedFetch({
            //     url: resources.endpoints.validateTest + "/login",
            //     init: {
            //         method: "POST",
            //         headers: {}
            //     }
            // })
            // let json = JSON.parse(body)
            // //console.log('login response', status, json)

            // connect with userData and token
            // colyseusConnect(data, json.data.token)
            joinWorld(realm)
            // colyseusConnect(data, "")

        }
    })
}