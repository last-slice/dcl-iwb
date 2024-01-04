import { log } from "../../../helpers/functions";
import { updateNFTFrame } from "../../scenes/components";


export function nftComponentListener(asset:any){
    if(asset.nftComp){
    asset.nftComp.listen("style", (currentValue:any, previousValue:any) => {
        log("asset image url changed", previousValue, currentValue)
        updateNFTFrame(asset.aid, asset.matComp, asset.nftComp)
    });
}
}