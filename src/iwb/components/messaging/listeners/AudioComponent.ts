import {log} from "../../../helpers/functions";
import {updateAudioUrl} from "../../scenes/components";


export function audioComponentListener(asset: any) {
    if (asset.audComp) {
        asset.audComp.listen("url", (currentValue: any, previousValue: any) => {
            log("asset audio url changed", previousValue, currentValue)
            updateAudioUrl(asset.aid, asset.matComp, currentValue)
        });
    }
}