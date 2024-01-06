import { log } from "../../helpers/functions"
import { EDIT_MODES, SCENE_MODES } from "../../helpers/types"
import { editCurrentSceneParcels } from "../../ui/Panels/CreateScenePanel"
import { cancelSelectedItem, dropSelectedItem, selectedItem } from "../modes/build"
import { addBoundariesForParcel, deleteParcelEntities } from "../modes/create"
import { localPlayer, localUserId, setPlayMode } from "../player/player"
import { sceneBuilds } from "../scenes"


export function sceneListeners(scene:any, key:any){
    scene.bps.onAdd((permission:string, permissionKey:any)=>{
        log('adding new build permissions', permissionKey, permission)
    })

    scene.bps.onRemove((permission:string, permissionKey:any)=>{
        log('removing build permissions', permissionKey, permission)
        if(!scene.bps.includes(localUserId) && localPlayer.mode === SCENE_MODES.BUILD_MODE){
            log('no more build permissions for user, need to kick them to play mode')
            if(selectedItem && selectedItem.enabled){
                if(selectedItem.mode === EDIT_MODES.GRAB){
                    dropSelectedItem()
                }else{
                    cancelSelectedItem()
                }
            }
            setPlayMode(localUserId, SCENE_MODES.PLAYMODE)
        }
    })

    scene.pcls.onAdd((parcel:string, parcelKey:any)=>{
        if(editCurrentSceneParcels){
            addBoundariesForParcel(parcel, true)
        }
    })

    scene.pcls.onRemove((parcel:string, parcelKey:any)=>{
        if(editCurrentSceneParcels){
            deleteParcelEntities(parcel)
        }
    })

    scene.listen("si",(current:any, previous:any)=>{
        sceneBuilds.get(key).si = current
    })

    scene.listen("pc",(current:any, previous:any)=>{
        sceneBuilds.get(key).pc = current
    })

}