import { log } from "../../../helpers/functions";
import { sceneBuilds } from "../../scenes";

export function actionComponentListener(scene:any, asset:any){
    asset.actComp.actions.onAdd((action:any, key:any) => {
        let sceneData = sceneBuilds.get(scene.id)
        sceneData.actions.push(action)
    });

    asset.actComp.actions.onRemove((action:any, key:any) => {
        let sceneData = sceneBuilds.get(scene.id)
        let index = sceneData.actions.findIndex((act:any)=> act.name === action.name)
        if(index >=0){
            sceneData.actions.splice(index,1)
        }
    });
}