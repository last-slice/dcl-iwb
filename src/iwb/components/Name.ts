import { TextShape } from "@dcl/sdk/ecs";
import { colyseusRoom } from "./Colyseus";
import { getEntity } from "./IWB";
import { updateAudioTextLabel } from "./Sounds";

export function nameListener(scene:any){
    scene.names.onAdd((name:any, aid:any)=>{
        name.listen("value", (current:any, previous:any)=>{

            //update sound text display
            updateAudioTextLabel(scene, aid, current)
        })
    })
}

export function getAssetName(sceneId:string, aid:string){
    let scene = colyseusRoom.state.scenes.get(sceneId)
    if(!scene){
        return ""
    }

    let name = scene.names.get(aid)
    if(!name){
        return ""
    }
    return name.value
}
