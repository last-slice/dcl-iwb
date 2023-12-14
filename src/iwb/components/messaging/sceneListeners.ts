import { GltfContainer, engine } from "@dcl/sdk/ecs"
import {log} from "../../helpers/functions"
import {COLLISION_LAYERS, EDIT_MODES, EDIT_MODIFIERS, IWBScene, NOTIFICATION_TYPES, SCENE_MODES, SERVER_MESSAGE_TYPES, SceneItem} from "../../helpers/types"
import {
    otherUserPlaceditem,
    otherUserRemovedSeletedItem,
    otherUserSelectedItem,
    removeItem,
    transformObject,
} from "../modes/build"
import {addBoundariesForParcel, deleteParcelEntities, isParcelInScene, saveNewScene, selectParcel} from "../modes/create"
import { localUserId, setPlayMode } from "../player/player"
import { entitiesFromItemIds, itemIdsFromEntities, loadScene, loadSceneAsset, sceneBuilds, unloadScene, updateSceneEdits } from "../scenes"
import { showNotification } from "../../ui/Panels/notificationUI"
import { editCurrentSceneParcels } from "../../ui/Panels/CreateScenePanel"
import { updateCollision, updateImageUrl, updateVideoAutostart, updateVideoPlaying, updateVideoUrl, updateVideoVolume } from "../scenes/components"

export function createSceneListeners(room: any) {
        log('creating scene listeners for room', room.roomId)

        room.state.temporaryParcels.onAdd(async(parcel:any, key:string)=>{
            log('temp parcel added', key, parcel)
            selectParcel(parcel)
        })

        room.state.temporaryParcels.onRemove(async(parcel:any, key:string)=>{
            log('temp parcel removed', key, parcel)
            if(!isParcelInScene(parcel)){
                deleteParcelEntities(parcel)
            }
        })

        room.onMessage(SERVER_MESSAGE_TYPES.SELECT_PARCEL, (info: any) => {
            log(SERVER_MESSAGE_TYPES.SELECT_PARCEL + ' received', info)
            selectParcel(info)
        })
    
        room.onMessage(SERVER_MESSAGE_TYPES.REMOVE_PARCEL, (info: any) => {
            log(SERVER_MESSAGE_TYPES.REMOVE_PARCEL + ' received', info)
            deleteParcelEntities(info)
        })
    
        room.onMessage(SERVER_MESSAGE_TYPES.SCENE_SAVE_NEW, ({userId, scene}: { userId: string, scene: IWBScene }) => {
            log(SERVER_MESSAGE_TYPES.SCENE_SAVE_NEW + ' received', userId, scene)
            saveNewScene(userId)
        })
    
        room.onMessage(SERVER_MESSAGE_TYPES.SCENE_ADDED_NEW, (info:any) => {
            log(SERVER_MESSAGE_TYPES.SCENE_ADDED_NEW + ' received', info)
            // setScenes(info.info)//
        })

        room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_EDIT_ASSET, (info:any) => {
            log(SERVER_MESSAGE_TYPES.PLAYER_EDIT_ASSET + ' received', info)
        })

        room.onMessage(SERVER_MESSAGE_TYPES.SCENE_ADD_ITEM, (info:any) => {
            log(SERVER_MESSAGE_TYPES.SCENE_ADD_ITEM + ' received', info)
            if(info.user !== localUserId){
                otherUserRemovedSeletedItem(info.user)
            }
        })

        room.onMessage(SERVER_MESSAGE_TYPES.ASSET_OVER_SCENE_LIMIT, (info:any) => {
            log(SERVER_MESSAGE_TYPES.ASSET_OVER_SCENE_LIMIT + ' received', info)
            showNotification({type:NOTIFICATION_TYPES.MESSAGE, message: "This asset puts your scene over the limits", animate:{enabled:true, return:true, time: 5}})
        })

        // room.onMessage(SERVER_MESSAGE_TYPES.USE_SELECTED_ASSET, (info:any) => {
        //     log(SERVER_MESSAGE_TYPES.USE_SELECTED_ASSET + ' received', info)
        //     if(info.user !== localUserId){
        //         log('need to show pickup asset for other user')
        //             otherUserSelectedItem(info)
        //     }
        // })//

        room.onMessage(SERVER_MESSAGE_TYPES.PLACE_SELECTED_ASSET, (info:any) => {
            log(SERVER_MESSAGE_TYPES.PLACE_SELECTED_ASSET + ' received', info)
            if(info.user !== localUserId){
                otherUserPlaceditem(info)
            }
        })

        room.onMessage(SERVER_MESSAGE_TYPES.SCENE_ADD_BP, (info:any) => {
            log(SERVER_MESSAGE_TYPES.SCENE_ADD_BP + ' received', info)
            if(info.user === localUserId){
                showNotification({type: NOTIFICATION_TYPES.MESSAGE, message: "You were granted build permissions for scene " + (sceneBuilds.has(info.sceneId) ? sceneBuilds.get(info.sceneId).n : ""), animate:{enabled:true, return:true, time:5}})
            }
            else{
                showNotification({type: NOTIFICATION_TYPES.MESSAGE, message: "Build Permissions Granted to user " + info.user + " for your scene " + (sceneBuilds.has(info.sceneId) ? sceneBuilds.get(info.sceneId).n : ""), animate:{enabled:true, return:true, time:5}})
            }
        })

        room.onMessage(SERVER_MESSAGE_TYPES.SCENE_DELETE_BP, (info:any) => {
            log(SERVER_MESSAGE_TYPES.SCENE_DELETE_BP + ' received', info)
            if(info.user === localUserId){
                showNotification({type: NOTIFICATION_TYPES.MESSAGE, message: "Your builde permissions were removed for scene " + (sceneBuilds.has(info.sceneId) ? sceneBuilds.get(info.sceneId).n : ""), animate:{enabled:true, return:true, time:5}})
            }
            else{
                showNotification({type: NOTIFICATION_TYPES.MESSAGE, message: "Removed Build Permissions for " + info.user + " on your scene " + (sceneBuilds.has(info.sceneId) ? sceneBuilds.get(info.sceneId).n : ""), animate:{enabled:true, return:true, time:5}})
            }
        })

        room.onMessage(SERVER_MESSAGE_TYPES.SCENE_SAVE_EDITS, (info:any) => {
            log(SERVER_MESSAGE_TYPES.SCENE_SAVE_EDITS + ' received', info)
            updateSceneEdits(info)
        })
}

export function addSceneStateListeners(room:any){
    room.state.scenes.onAdd(async(scene:any, key:string)=>{
        log('Room Scene Added', key, scene)
        await loadScene(scene)

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

        scene.ass.onAdd((asset:any, key:any)=>{
            loadSceneAsset(scene.id, asset)

            if(asset.visComp){
                asset.visComp.listen("visible", (currentValue:any, previousValue:any) => {
                    log("asset visibility changed", previousValue, currentValue)
                });
            }

            if(asset.imgComp){
                asset.imgComp.listen("url", (currentValue:any, previousValue:any) => {
                    log("asset image url changed", previousValue, currentValue)
                    updateImageUrl(asset.aid, asset.matComp, currentValue)
                });
            }
            if(asset.vidComp){
                asset.vidComp.listen("url", (currentValue:any, previousValue:any) => {
                    log("asset video url changed", previousValue, currentValue)
                    updateVideoUrl(asset.aid, asset.matComp, currentValue)
                });

                asset.vidComp.listen("volume", (currentValue:any, previousValue:any) => {
                    log("asset video volume changed", previousValue, currentValue)
                    updateVideoVolume(asset.aid, currentValue)
                });

                asset.vidComp.listen("loop", (currentValue:any, previousValue:any) => {
                    log("asset video loop changed", previousValue, currentValue)
                    updateVideoVolume(asset.aid, currentValue)
                });

                asset.vidComp.listen("autostart", (currentValue:any, previousValue:any) => {
                    log("asset video loop changed", previousValue, currentValue)
                    updateVideoAutostart(asset.aid, currentValue)
                });

                asset.vidComp.listen("playing", (currentValue:any, previousValue:any) => {
                    log("asset video playing changed", previousValue, currentValue)
                    updateVideoPlaying(asset.aid, currentValue)
                });
            }

            if(asset.colComp){
                asset.colComp.listen("iMask", (currentValue:any, previousValue:any) => {
                    log("invisible collision mask changed", previousValue, currentValue)
                    updateCollision(asset.aid, COLLISION_LAYERS.INVISIBLE, currentValue)
                });

                asset.colComp.listen("vMask", (currentValue:any, previousValue:any) => {
                    log("visible collision mask changed", previousValue, currentValue)
                    updateCollision(asset.aid, COLLISION_LAYERS.VISIBLE, currentValue)
                });
            }

            //position
            asset.p.listen("x", (currentValue:any, previousValue:any) => {
                if(previousValue !== undefined){
                    transformObject(scene.id,asset.aid, EDIT_MODIFIERS.POSITION, "x", currentValue)
                }
            });
            asset.p.listen("y", (currentValue:any, previousValue:any) => {
                if(previousValue !== undefined){
                    transformObject(scene.id,asset.aid, EDIT_MODIFIERS.POSITION, "y", currentValue)
                }
            });
            asset.p.listen("z", (currentValue:any, previousValue:any) => {
                if(previousValue !== undefined){
                    transformObject(scene.id,asset.aid, EDIT_MODIFIERS.POSITION, "z", currentValue)
                }
            });

            //rotation
            asset.r.listen("x", (currentValue:any, previousValue:any) => {
                if(previousValue !== undefined){
                    transformObject(scene.id,asset.aid, EDIT_MODIFIERS.ROTATION, "x", currentValue)
                }
            });
            asset.r.listen("y", (currentValue:any, previousValue:any) => {
                if(previousValue !== undefined){
                    transformObject(scene.id,asset.aid, EDIT_MODIFIERS.ROTATION, "y", currentValue)
                }
            });
            asset.r.listen("z", (currentValue:any, previousValue:any) => {
                if(previousValue !== undefined){
                    transformObject(scene.id,asset.aid, EDIT_MODIFIERS.ROTATION, "z", currentValue)
                }
            });

            //scale
            asset.s.listen("x", (currentValue:any, previousValue:any) => {
                if(previousValue !== undefined){
                    transformObject(scene.id,asset.aid, EDIT_MODIFIERS.SCALE, "x", currentValue)
                }
            });
            asset.s.listen("y", (currentValue:any, previousValue:any) => {
                if(previousValue !== undefined){
                    transformObject(scene.id,asset.aid, EDIT_MODIFIERS.SCALE, "y", currentValue)
                }
            });
            asset.s.listen("z", (currentValue:any, previousValue:any) => {
                if(previousValue !== undefined){
                    transformObject(scene.id,asset.aid, EDIT_MODIFIERS.SCALE, "z", currentValue)
                }
            });
        })

        scene.ass.onRemove((asset:any, key:any)=>{
            log("scene asset remove", key, asset)
            removeItem(scene.id, asset)
        })

        scene.listen("si",(current:any, previous:any)=>{
            sceneBuilds.get(key).si = current
        })

        scene.listen("pc",(current:any, previous:any)=>{
            sceneBuilds.get(key).pc = current
        })
    })

    room.state.scenes.onRemove((scene:any, key:string)=>{
        log('removing scene from state', key, scene)
        if(scene.o === localUserId){
            showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"You deleted scene " + scene.n, animate:{enabled:true, return:true, time:5}})
        }else{
            showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"" + scene.ona + " just deleted their scene " + scene.n, animate:{enabled:true, return:true, time:5}})
        }
        unloadScene(key)
    })

    room.state.players.onAdd((player:any, key:string)=>{
        log('player is', player)
        player.listen("selectedAsset", (current:any, previous:any)=>{
            log('player selected asset', previous, current)
            if(player.address !== localUserId){
                if(current === null){
                    otherUserRemovedSeletedItem(player.address)
                }else{
                    current.user = player.address
                    otherUserSelectedItem(current, true)
                }
            }
        })
    })
}