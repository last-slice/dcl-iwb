import { log } from "../../../helpers/functions";
import { items } from "../../catalog";
import { updateImageUrl, updateMaterialComponent } from "../../scenes/components";

export function materialComponentListener(scene:any, asset:any){
    if(asset.matComp){
        asset.matComp.listen("metallic", (currentValue:any, previousValue:any) => {
            switch(asset.n){
                case 'Image':
                    updateImageUrl(asset.aid, asset.matComp, asset.imgComp.url)
                    break;
            }
        });

        asset.matComp.listen("emissPath", (currentValue:any, previousValue:any) => {
            switch(asset.n){
                case 'Image':
                    updateImageUrl(asset.aid, asset.matComp, asset.imgComp.url)
                    break;
            }
        });

        asset.matComp.listen("type", (currentValue:any, previousValue:any) => {
            log('updating image type', currentValue)
            log('asset n is', asset)
            
            switch(items.get(asset.id)!.n){
                case 'Image':
                    updateImageUrl(asset.aid, asset.matComp, asset.imgComp.url)
                    break;
            }
        });
    }
}