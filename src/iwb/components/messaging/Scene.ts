import { engine } from "@dcl/sdk/ecs"
import { log } from "../../helpers/functions"
import { EDIT_MODES, SCENE_MODES } from "../../helpers/types"
import { editCurrentSceneParcels } from "../../ui/Panels/CreateScenePanel"
import { cancelSelectedItem, dropSelectedItem, selectedItem } from "../modes/build"
import { addBoundariesForParcel, deleteParcelEntities } from "../modes/create"
import { localPlayer, localUserId, setPlayMode } from "../player/player"
import { entitiesFromItemIds, itemIdsFromEntities, loadSceneAsset, sceneBuilds } from "../scenes"


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
            addBoundariesForParcel(parcel, true, scene.name === "Realm Lobby" ? true : false)
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

    scene.listen("priv",(current:any, previous:any)=>{
        if(previous !== undefined){
            if(current){
                if(scene.o !== localUserId){
                    scene.ass.forEach((asset:any, i:number)=>{
                        let entity = entitiesFromItemIds.get(asset.aid)
                        if(entity){
                            itemIdsFromEntities.delete(entity)
                            entitiesFromItemIds.delete(asset.aid)
                            engine.removeEntity(entity)
                        }
                    })
                }
            }
            else{
                if(scene.o !== localUserId && scene.e){
                    scene.ass.forEach((asset:any)=>{
                        loadSceneAsset(scene.id, asset)
                    })
                }
            }
        }
    })

    scene.listen("e",(current:any, previous:any)=>{
        if(previous !== undefined){
            if(!current){
                scene.ass.forEach((asset:any, i:number)=>{
                    let entity = entitiesFromItemIds.get(asset.aid)
                    if(entity){
                        itemIdsFromEntities.delete(entity)
                        entitiesFromItemIds.delete(asset.aid)
                        engine.removeEntity(entity)
                    }
                })
            }
            else{
                scene.ass.forEach((asset:any)=>{
                    loadSceneAsset(scene.id, asset)
                })
            }
        }
    })
}