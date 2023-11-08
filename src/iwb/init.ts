import {getUserData} from "~system/UserIdentity";
import {setupUi} from "./ui/ui";
import {joinWorld} from "./components/messaging";
import {createHQ} from "./components/hq";
import {getAssetUploadToken, getPreview, log} from "./helpers/functions";
import {createInputListeners} from "./components/listeners/inputListeners";
import {addPlayer, localUserId, players} from "./components/player/player";
import {engine} from "@dcl/sdk/ecs";
import {PlayerTrackingSystem} from "./components/systems/playerTracking";
import resources from "./helpers/resources";
import {signedFetch} from "~system/SignedFetch";
import { BuildModeVisibiltyComponents } from "./components/systems/BuildModeVisibilty";

export function initIWB() {
    setupUi()

    getPreview().then(()=>{
        getUserData({}).then(async ({data})=>{
            log("getuserdata is", data)
            if(data){
                const curPlayer = await addPlayer(data.userId, [{dclData:data}], true)
                engine.addSystem(PlayerTrackingSystem)
                engine.addSystem(BuildModeVisibiltyComponents)

                getAssetUploadToken()

                // // Login with dcl auth and retrieve jwt
                const {body, status} = await signedFetch({
                    url: resources.endpoints.validateTest + "/login",
                    init: {
                        method: "POST",
                        headers: {}
                    }
                })
                let json = JSON.parse(body)
                if(curPlayer)
                    curPlayer.wsToken = json.data.token
                //console.log('login response', status, json)
            }

            //build IWB HQ
            createHQ()

            //add input listeners
            createInputListeners()


            // connect with userData and token
            // colyseusConnect(data, json.data.token)
            joinWorld()
            // colyseusConnect(data, "")
        })
    })
}
  