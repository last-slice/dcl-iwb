import { COMPONENT_TYPES } from "../helpers/types";
import { displayLiveControl } from "../ui/Objects/LiveShowPanel";
import { localPlayer } from "./Player";


export function setLivePanel(scene:any, entityInfo:any){
    let liveInfo = scene[COMPONENT_TYPES.LIVE_COMPONENT].get(entityInfo.aid)
    if(liveInfo){
        if(localPlayer && (localPlayer.homeWorld || localPlayer.worldPermissions)){
            displayLiveControl(true, entityInfo.aid)
        }
    }
}

export function disableLivePanel(scene:any, entityInfo:any){
    displayLiveControl(false)
}