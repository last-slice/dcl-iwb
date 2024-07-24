import { COMPONENT_TYPES } from "../helpers/types";
import { displayLiveButton, displayLiveControl } from "../ui/Objects/LiveShowPanel";
import { localPlayer } from "./Player";


export function setLivePanel(scene:any, entityInfo:any){
    let liveInfo = scene[COMPONENT_TYPES.LIVE_COMPONENT].get(entityInfo.aid)
    if(liveInfo){
        console.log('scene has live info', liveInfo)
        if(localPlayer && (localPlayer.homeWorld || localPlayer.worldPermissions)){
            displayLiveControl(true)
            displayLiveButton(true, entityInfo.aid)
        }
    }
}

export function disableLivePanel(scene:any, entityInfo:any){
    displayLiveControl(false)
    displayLiveButton(false)
}