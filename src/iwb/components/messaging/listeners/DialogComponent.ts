import { log } from "../../../helpers/functions";
import { refreshDialogs } from "../../../ui/Panels/edit/DialogComponent";
import { selectedItem } from "../../modes/build";

export function dialogComponentListener(scene:any, asset:any){
    if(asset.dialComp){
        asset.dialComp.dialogs.onAdd((dialog:any, key:any) => {
            if(selectedItem && selectedItem.enabled){
                refreshDialogs()
            }
        });

        asset.dialComp.dialogs.onRemove((action:any, key:any) => {
            if(selectedItem && selectedItem.enabled){
                refreshDialogs()
            }
        });
    }
}