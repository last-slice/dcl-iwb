import {log} from "../../helpers/functions"
import {SERVER_MESSAGE_TYPES} from "../../helpers/types"
import {deleteParcelEntities, saveNewScene, selectParcel} from "../modes/create"
import {PlayerScene} from "../player/player";

export function createSceneListeners(room: any) {
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
}