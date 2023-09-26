import { getUserData } from "~system/UserIdentity";
import { getPreview, log } from "./functions";
import { setupUi } from "./ui/ui";
import { colyseusConnect } from "./components/messaging";
import { createHQ } from "./components/hq";
import { player } from "./components/player/player";


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
  