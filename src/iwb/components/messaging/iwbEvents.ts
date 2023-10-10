import { openExternalUrl } from "~system/RestrictedActions";
import { iwbEvents } from ".";
import { log } from "../../helpers/functions";
import { IWB_MESSAGE_TYPES } from "../../helpers/types";
import resources from "../../helpers/resources";
import { localUserId } from "../player/player";//


export function createIWBEventListeners(){
    // iwbEvents.on(IWB_MESSAGE_TYPES.OPEN_ASSET_UPLOAD_URL, async(info)=>{
    //     log(IWB_MESSAGE_TYPES.OPEN_ASSET_UPLOAD_URL + " received", info)
    //     if(json.valid){
    //       log('json is valid')
    //     //  openExternalUrl({url:(resources.DEBUG ? resources.endpoints.toolsetTest : resources.endpoints.toolsetProd) + "/" + localUserId + "/" + json.token  })
    //       openExternalUrl({url:"https://google.com"})
    //     }
    // })
}