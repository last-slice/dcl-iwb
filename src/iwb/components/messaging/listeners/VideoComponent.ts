import { log } from "../../../helpers/functions";
import { updateVideoAutostart, updateVideoPlaying, updateVideoUrl, updateVideoVolume } from "../../scenes/components";

export function videoComponentListener(asset:any){
    if(asset.vidComp){
        asset.vidComp.listen("url", (currentValue:any, previousValue:any) => {
            log("asset video url changed", previousValue, currentValue)
            updateVideoUrl(asset.aid, asset.matComp, currentValue)
        });

        asset.vidComp.listen("volume", (currentValue:any, previousValue:any) => {
            log("asset video volume changed", previousValue, currentValue)
            updateVideoVolume(asset.aid, currentValue)
        });

        asset.vidComp.listen("loop", (currentValue:any, previousValue:any) => {
            log("asset video loop changed", previousValue, currentValue)
            updateVideoVolume(asset.aid, currentValue)
        });

        asset.vidComp.listen("autostart", (currentValue:any, previousValue:any) => {
            log("asset video loop changed", previousValue, currentValue)
            updateVideoAutostart(asset.aid, currentValue)
        });

        asset.vidComp.listen("playing", (currentValue:any, previousValue:any) => {
            log("asset video playing changed", previousValue, currentValue)
            updateVideoPlaying(asset.aid, currentValue)
        });
    }
}