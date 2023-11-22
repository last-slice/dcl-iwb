import {log} from "../../helpers/functions"
import {IWBScene, SCENE_MODES, SERVER_MESSAGE_TYPES} from "../../helpers/types"
import {removeItem, transformObject} from "../modes/build"
import {deleteParcelEntities, saveNewScene, selectParcel} from "../modes/create"
import {localUserId, setPlayMode} from "../player/player"
import {itemIdsFromEntities, loadScene, sceneBuilds} from "../scenes"

export function createSceneListeners(room: any) {//
        log('creating scene listeners for room', room.roomId)
        room.onMessage(SERVER_MESSAGE_TYPES.SELECT_PARCEL, (info: any) => {
            log(SERVER_MESSAGE_TYPES.SELECT_PARCEL + ' received', info)
            selectParcel(info)
        })
    
        room.onMessage(SERVER_MESSAGE_TYPES.REMOVE_PARCEL, (info: any) => {
            log(SERVER_MESSAGE_TYPES.REMOVE_PARCEL + ' received', info)
            deleteParcelEntities(info)
        })
    
        room.onMessage(SERVER_MESSAGE_TYPES.SCENE_SAVE_NEW, ({userId, scene}: { userId: string, scene: IWBScene }) => {
            log(SERVER_MESSAGE_TYPES.SCENE_SAVE_NEW + ' received2', userId, scene)
            saveNewScene(userId)
            loadScene(scene)
        })
    
        room.onMessage(SERVER_MESSAGE_TYPES.SCENE_ADDED_NEW, (info:any) => {
            log(SERVER_MESSAGE_TYPES.SCENE_ADDED_NEW + ' received', info)
            //setScenes(info.info)

            if(info.owner === localUserId){
                setPlayMode(localUserId, SCENE_MODES.BUILD_MODE)
            }
        })

        room.onMessage(SERVER_MESSAGE_TYPES.SCENE_DELETE_ITEM, (info:any) => {
            log(SERVER_MESSAGE_TYPES.SCENE_DELETE_ITEM + ' received', info)

            if(info.userId !== localUserId){
                console.log('need to change transform position of item from other user')
            }
            removeItem(info)
        })

        room.onMessage(SERVER_MESSAGE_TYPES.SCENE_ADD_ITEM, (info:any) => {
            log(SERVER_MESSAGE_TYPES.SCENE_ADD_ITEM + ' received', info)

            if(info.userId !== localUserId){
                console.log('need to change transform position of item from other user')
            }

            let scene = sceneBuilds.get(info.sceneId)
            console.log('scene is', scene)
            if(scene){
                scene.ass.push(info.item)
                itemIdsFromEntities.set(info.entity, info.item.aid)
            }
        })

        room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_EDIT_ASSET, (info:any) => {
            log(SERVER_MESSAGE_TYPES.PLAYER_EDIT_ASSET + ' received', info)
            transformObject(info)
        })

        room.onMessage(SERVER_MESSAGE_TYPES.SCENE_LOAD, (info:IWBScene) => {
            log(SERVER_MESSAGE_TYPES.SCENE_LOAD + ' received', info)
            loadScene(info)
        })
}