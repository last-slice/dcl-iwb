import { TextShape } from "@dcl/sdk/ecs";
import { colyseusRoom } from "./Colyseus";
import { getEntity } from "./IWB";
// import { updateAudioTextLabel } from "./Sounds";
import { playerMode } from "./Config";
import { COMPONENT_TYPES, SCENE_MODES } from "../helpers/types";
import { checkTextShapeComponent, updateTextComponent } from "./TextShape";
// import { updateClickAreaTextLabel } from "./SmartItems";

export function nameListener(scene:any){
    scene[COMPONENT_TYPES.NAMES_COMPONENT].onAdd((name:any, aid:any)=>{
        // let iwbInfo = scene[COMPONENT_TYPES.PARENTING_COMPONENT].find(($:any)=> $.aid === aid)
        // if(!iwbInfo.components.includes(COMPONENT_TYPES.NAMES_COMPONENT)){
        //   iwbInfo.components.push(COMPONENT_TYPES.NAMES_COMPONENT)
        // }

        let entityInfo = getEntity(scene, aid)
        if(!entityInfo){
            return
        }

        name.listen("value", (current:any, previous:any)=>{
            console.log('name value changed')
            if(previous !== undefined && playerMode === SCENE_MODES.BUILD_MODE){
                // console.log('updating tet omponetn')
                // updateAudioTextLabel(scene, aid, current)
                // updateClickAreaTextLabel(scene, entityInfo, current)
                updateTextComponent(scene, entityInfo, current)
            }
        })
    })
}

export function getAssetName(sceneId:string, aid:string){
    let scene = colyseusRoom.state.scenes.get(sceneId)
    if(!scene){
        return ""
    }

    let name = scene[COMPONENT_TYPES.NAMES_COMPONENT].get(aid)
    if(!name){
        return ""
    }
    return name.value
}

export function getAllAssetNames(sceneId:string, sort?:boolean, includeQuests?:boolean){
    let scene = colyseusRoom.state.scenes.get(sceneId)
    if(!scene){
        return []
    }

    let names:any[] = []

    scene[COMPONENT_TYPES.ACTION_COMPONENT].forEach((actionComponent:any, aid:string) => {
        let name = scene[COMPONENT_TYPES.NAMES_COMPONENT].get(aid)
        names.push({name:name.value, aid:aid})
    });

    if(includeQuests){
        scene[COMPONENT_TYPES.QUEST_COMPONENT].forEach((actionComponent:any, aid:string) => {
            let name = scene[COMPONENT_TYPES.NAMES_COMPONENT].get(aid)
            names.push({name:name.value, aid:aid})
        });
    }

    // scene[COMPONENT_TYPES.NAMES_COMPONENT].forEach((nameComponent:any, aid:string) => {
    //     names.push({name:nameComponent.value, aid:aid})
    // });

    if(sort){
        names.sort((a:any, b:any)=> a.name.localeCompare(b.name))
    }
    return names
}