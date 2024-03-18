import {log} from "../../helpers/functions"
import {NOTIFICATION_TYPES, SERVER_MESSAGE_TYPES} from "../../helpers/types"
import {showNotification} from "../../ui/Panels/notificationUI"
import {addPendingAsset, addPlayerScenes, localPlayer, setSettings} from "../player/player"
import {Room} from "colyseus.js"
import {iwbEvents} from "."
import {refreshSortedItems, updateItem} from "../catalog/items";
import { displayDownloadPendingPanel } from "../../ui/Panels/downloadPendingPanel"
import { displayWelcomeScreen } from "../../ui/Panels/welcomeScreen"
import { displayPendingPanel } from "../../ui/Panels/pendingStatusPanel"


export function createPlayerListeners(room: Room) {
    log('creating player listeners for room', room.roomId)
    room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_ASSET_UPLOADED, (info: any) => {
        log(SERVER_MESSAGE_TYPES.PLAYER_ASSET_UPLOADED + ' received', info)
        showNotification({
            type: NOTIFICATION_TYPES.IMAGE,
            image: info.im,
            message: "Your asset " + info.n + " is uploading and pending deployment. A placeholder object is temporarily available.",
            animate: {enabled: true, return: true, time: 10}
        })
        if (info) {
            updateItem(info.id, info)
            addPendingAsset(info)
            refreshSortedItems()
            displayPendingPanel(true, 'assetsready')
        }
    })

    room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_ASSET_CATALOG, (info: any) => {
        log(SERVER_MESSAGE_TYPES.PLAYER_ASSET_CATALOG + ' received', info)
        if(info){
            if(info.pending){
                addPendingAsset(info)
                delete info.pending
            }
            updateItem(info.id, info)
        }
    })

    room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_SCENES_CATALOG, (info: any) => {
        log(SERVER_MESSAGE_TYPES.PLAYER_SCENES_CATALOG + ' received', info)
        addPlayerScenes(info.user, info.scenes)
    })

    room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_CATALOG_DEPLOYED, (info: any) => {
        log(SERVER_MESSAGE_TYPES.PLAYER_CATALOG_DEPLOYED + ' received', info)
        showNotification({
            type: NOTIFICATION_TYPES.MESSAGE,
            message: "Your latest asset uploads have been deployed. Refresh to use them.",
            animate: {enabled: true, return: true, time: 10}
        })
        displayPendingPanel(true, 'ready')
    })

    room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_RECEIVED_MESSAGE, (info: any) => {
        log(SERVER_MESSAGE_TYPES.PLAYER_RECEIVED_MESSAGE + ' received', info)
        showNotification({type:NOTIFICATION_TYPES.MESSAGE, message: "" + info, animate:{enabled:true, return:true, time:5}})
    })

    room.onMessage(SERVER_MESSAGE_TYPES.PLAY_MODE_CHANGED, (info: any) => {
        log(SERVER_MESSAGE_TYPES.PLAY_MODE_CHANGED + ' received', info)
        localPlayer.mode = info.mode
        iwbEvents.emit(SERVER_MESSAGE_TYPES.PLAY_MODE_CHANGED, {mode: info.mode})
    })

    room.onMessage(SERVER_MESSAGE_TYPES.SCENE_DOWNLOAD, (info: any) => {
        log(SERVER_MESSAGE_TYPES.SCENE_DOWNLOAD + ' received', info)
        displayDownloadPendingPanel(true, info.link)
    })

    room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_SETTINGS, (info: any) => {
        log(SERVER_MESSAGE_TYPES.PLAYER_SETTINGS + ' received', info)
        switch(info.action){
            case 'load':
                console.log('load player settings')
                setSettings(info.value)

                if(!info.value.firstTime){
                    displayWelcomeScreen(true)
                }

                //play music to start

                //show notifications

                //other settings
                break;
        }
    })
}