import { getUserData } from "~system/UserIdentity";
import { setupUi } from "./ui/ui";
import { colyseusConnect } from "./components/messaging";
import { createHQ } from "./components/hq";
import { player } from "./components/player/player";
import { getPreview, log } from "./helpers/functions";


export function initIWB(){
    setupUi()

    getPreview().then(()=>{
        getUserData({}).then((data)=>{
            log("getuserdata is", data)
            player.dclData = data.data

            //build IWB HQ
            createHQ()

            colyseusConnect(data.data)
        })
    })
}
  