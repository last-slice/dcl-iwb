import { TextShape } from "@dcl/sdk/ecs";
import { colyseusRoom } from "./Colyseus";
import { getEntity } from "./IWB";
import { updateAudioTextLabel } from "./Sounds";
import { playerMode } from "./Config";
import { SCENE_MODES } from "../helpers/types";
import { updateClickAreaTextLabel } from "./SmartItems";

export function nameListener(scene:any){
    scene.names.onAdd((name:any, aid:any)=>{
        name.listen("value", (current:any, previous:any)=>{
            let entityInfo = getEntity(scene, aid)
            if(!entityInfo){
                return
            }

            if(previous !== undefined && playerMode === SCENE_MODES.BUILD_MODE){
                updateAudioTextLabel(scene, aid, current)
                updateClickAreaTextLabel(scene, entityInfo, current)
            }
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
