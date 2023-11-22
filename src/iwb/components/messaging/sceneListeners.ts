import { engine } from "@dcl/sdk/ecs"
import {log} from "../../helpers/functions"
import {EDIT_MODES, EDIT_MODIFIERS, IWBScene, SCENE_MODES, SERVER_MESSAGE_TYPES, SceneItem} from "../../helpers/types"
import { removeItem, transformObject } from "../modes/build"
import {deleteParcelEntities, saveNewScene, selectParcel} from "../modes/create"
import { localUserId, setPlayMode } from "../player/player"
import { itemIdsFromEntities, loadScene, loadSceneAsset, sceneBuilds, setScenes } from "../scenes"

export function createSceneListeners(room: any) {
        log('creating scene listeners for room', room.roomId)

        room.state.temporaryParcels.onAdd(async(parcel:any, key:string)=>{
            log('temp parcel added', key, parcel)
            selectParcel(parcel)
        })

        room.state.temporaryParcels.onRemove(async(parcel:any, key:string)=>{
            log('temp parcel removed', key, parcel)
            deleteParcelEntities(parcel)
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
            // setScenes(info.info)
        })

        // room.onMessage(SERVER_MESSAGE_TYPES.SCENE_DELETE_ITEM, (info:any) => {
        //     log(SERVER_MESSAGE_TYPES.SCENE_DELETE_ITEM + ' received', info)

        //     if(info.userId !== localUserId){//
        //         console.log('need to change transform position of item from other user')
        //     }
        //     removeItem(info)
        // })

        // room.onMessage(SERVER_MESSAGE_TYPES.SCENE_ADD_ITEM, (info:any) => {
        //     log(SERVER_MESSAGE_TYPES.SCENE_ADD_ITEM + ' received', info)

        //     if(info.userId !== localUserId){
        //         console.log('need to change transform position of item from other user')
        //     }

        //     let scene = sceneBuilds.get(info.sceneId)
        //     console.log('scene is', scene)
        //     if(scene){
        //         scene.ass.push(info.item)
        //         itemIdsFromEntities.set(info.entity, info.item.aid)
        //     }
        // })

        room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_EDIT_ASSET, (info:any) => {
            log(SERVER_MESSAGE_TYPES.PLAYER_EDIT_ASSET + ' received', info)

        })
}

export function addSceneStateListeners(room:any){
    room.state.scenes.onAdd(async(scene:any, key:string)=>{
        log('Room Scene Added', key, scene)
        await loadScene(scene)

        scene.ass.onAdd((asset:any, key:any)=>{
            log('added new item to state schema', key, asset)
            loadSceneAsset(scene.id, asset)

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
    })
}