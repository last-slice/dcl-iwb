import {log} from "../../helpers/functions"
import {PlayerScene, SERVER_MESSAGE_TYPES} from "../../helpers/types"
import {deleteParcelEntities, saveNewScene, selectParcel} from "../modes/create"
import { loadScene, setScenes } from "../scenes"

export function createSceneListeners(room: any) {
        log('creating scene listeners for room', room.roomId)
        room.onMessage(SERVER_MESSAGE_TYPES.SELECT_PARCEL, (info: any) => {
            log(SERVER_MESSAGE_TYPES.SELECT_PARCEL + ' received', info)
            selectParcel(info)
        })
    
        room.onMessage(SERVER_MESSAGE_TYPES.REMOVE_PARCEL, (info: any) => {
            log(SERVER_MESSAGE_TYPES.REMOVE_PARCEL + ' received', info)
            deleteParcelEntities(info)
        })
    
        room.onMessage(SERVER_MESSAGE_TYPES.SCENE_SAVE_NEW, ({userId, scene}: { userId: string, scene: PlayerScene }) => {
            log(SERVER_MESSAGE_TYPES.SCENE_SAVE_NEW + ' received', userId, scene)
            saveNewScene(userId, scene)
        })
    
        room.onMessage(SERVER_MESSAGE_TYPES.SCENE_ADDED_NEW, (info:any) => {
            log(SERVER_MESSAGE_TYPES.SCENE_ADDED_NEW + ' received', info)
            setScenes(info)
        })
    
        room.onMessage(SERVER_MESSAGE_TYPES.SCENE_LOAD, (info:any) => {
            log(SERVER_MESSAGE_TYPES.SCENE_LOAD + ' received', info)
            loadScene(info)
        })
    
        room.state.scenes.onAdd((scene:any, key:any) =>{
            log(SERVER_MESSAGE_TYPES.SCENE_LOAD + ' received', key, scene)
            // loadScene(scene)
        })
        
}