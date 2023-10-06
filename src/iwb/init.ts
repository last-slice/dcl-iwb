import {getUserData} from "~system/UserIdentity";
import {setupUi} from "./ui/ui";
import {colyseusConnect} from "./components/messaging";
import {createHQ} from "./components/hq";
import {getPreview, log} from "./helpers/functions";
import {createInputListeners} from "./components/listeners/inputListeners";
import {addPlayer} from "./components/player/player";
import {engine} from "@dcl/sdk/ecs";
import {PlayerTrackingSystem} from "./components/systems/playerTracking";
import {signedFetch} from "~system/SignedFetch";
import resources from "./helpers/resources";

export function initIWB() {
    setupUi()

    getPreview().then(() => {
        getUserData({}).then(async (data) => {
            log("getuserdata is", data)
            if (data.data) {
                addPlayer(data.data.userId, [{dclData: data.data}], true)
                engine.addSystem(PlayerTrackingSystem)
            }

            //build IWB HQ
            createHQ()

            //add input listeners
            createInputListeners()

            // Login with dcl auth and retrieve jwt
            const {body, status} = await signedFetch({
                url: resources.endpoints.validateTest + "/login",
                init: {
                    method: "POST",
                    headers: {}
                }
            })
            let json = JSON.parse(body)
            console.log('login response', status, json)

            // connect with userData and token
            colyseusConnect(data.data, json.data.token)
        })
    })
}
  