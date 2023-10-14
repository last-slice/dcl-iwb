import { getUserData } from "~system/UserIdentity";
import { setupUi } from "./ui/ui";
import { colyseusConnect } from "./components/messaging";
import { createHQ } from "./components/hq";
import { getAssetUploadToken, getPreview, log } from "./helpers/functions";
import { createInputListeners } from "./components/listeners/inputListeners";
import { addPlayer } from "./components/player/player";
import { engine } from "@dcl/sdk/ecs";
import { PlayerTrackingSystem } from "./components/systems/playerTracking";


export function initIWB(){
    setupUi()

    getPreview().then(()=>{
        getUserData({}).then((data)=>{
            log("getuserdata is", data)
            if(data.data){
                addPlayer(data.data.userId, [{dclData:data.data}], true)
                engine.addSystem(PlayerTrackingSystem)

                getAssetUploadToken()
            }

            //build IWB HQ//
            createHQ()

            //add input listeners
            createInputListeners()

            colyseusConnect(data.data)
        })
    })
}
  