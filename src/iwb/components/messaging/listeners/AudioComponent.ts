import {log} from "../../../helpers/functions";
import {updateAudio, updateAudioAttach, updateAudioComponent, updateAudioLoop, updateAudioUrl} from "../../scenes/components";//


export function audioComponentListener(asset: any) {
    if (asset.audComp) {
        asset.audComp.listen("url", (currentValue: any, previousValue: any) => {
            log("asset audio url changed", previousValue, currentValue)
            updateAudioUrl(asset.aid, asset.matComp, currentValue)
        });

        asset.audComp.listen("attachedPlayer", (currentValue: any, previousValue: any) => {
            log("attachedPlayer audio changed", previousValue, currentValue)
            updateAudioAttach(asset.aid, asset.audComp)
        });

        asset.audComp.listen("loop", (currentValue: any, previousValue: any) => {
            log("loop audio changed", previousValue, currentValue)
            updateAudioLoop(asset.aid, asset.audComp)
        });

        asset.audComp.listen("volume", (currentValue: any, previousValue: any) => {
            log("volume audio changed", previousValue, currentValue)
            updateAudio('volume', asset.aid, asset.audComp)
        });

        asset.audComp.listen("autostart", (currentValue: any, previousValue: any) => {
            log("autostart audio changed", previousValue, currentValue)
            updateAudio('autostart', asset.aid, asset.audComp)
        });
    }
}
