import {log} from "../../helpers/functions"
import {NOTIFICATION_TYPES, SERVER_MESSAGE_TYPES, SOUND_TYPES} from "../../helpers/types"
import {updateStyles} from "../catalog"
import {iwbConfig, localUserId, players, removePlayer} from "../player/player"
import {setWorlds, updateSceneCount} from "../scenes";
import {Room} from "colyseus.js";
import {displayWorldReadyPanel} from "../../ui/Panels/worldReadyPanel";
import {showNotification} from "../../ui/Panels/notificationUI";
import {refreshSortedItems, setNewItems, updateItem} from "../catalog/items";
import { createSounds, playSound } from "../sounds";
import { displayPendingPanel } from "../../ui/Panels/pendingStatusPanel";
import { displayDCLWorldPopup } from "../../ui/Panels/visitDCLWorldPopup";
import { refreshMap } from "../../ui/map";
import { utils } from "../../helpers/libraries";
import { addSceneStateListeners } from "./sceneListeners";


export function initiateMessageListeners(room: Room) {

    room.onMessage(SERVER_MESSAGE_TYPES.INIT, async (info: any) => {
        log(SERVER_MESSAGE_TYPES.INIT + ' received', info)

        //set initial catalog
        let catalog = info.catalog
        for (const key in catalog) {
            if (catalog.hasOwnProperty(key)) {
                const value = catalog[key];
                updateItem(key, value)
            }
        }

        //set realm assets
        let realmAssets = info.realmAssets
        for (const key in realmAssets) {
            if (realmAssets.hasOwnProperty(key)) {
                const value = realmAssets[key];
                updateItem(key, value)
            }
        }

        refreshSortedItems()

        //set catalog styles
        updateStyles(info.styles)

        //set deployed iwb version
        players.get(localUserId)!.version = info.iwb.v
        iwbConfig.v = info.iwb.v
        iwbConfig.updates = info.iwb.updates

        setWorlds(info.worlds)
        setNewItems()

        //set occupied parcels
        // for (const p of info.occupiedParcels) {
        //     //log('occupied parcel', p)
        //     addBoundariesForParcel(p, false)
        // }

        //set tutorials
        iwbConfig.tutorials = info.tutorials.videos
        iwbConfig.CID = info.tutorials.cid
        console.log("iwb config is", iwbConfig)

        addSceneStateListeners(room)

        utils.timers.setTimeout(()=>{
            refreshMap()
        }, 1000 * 5)
    })

    room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_JOINED_USER_WORLD, (info: any) => {
        log(SERVER_MESSAGE_TYPES.PLAYER_JOINED_USER_WORLD + ' received', info)
        if (info) {
            // updateWorld(info)
        }
    })

    room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_LEAVE, (info: any) => {
        log(SERVER_MESSAGE_TYPES.PLAYER_LEAVE + ' received', info)
        removePlayer(info.player)
    })

    room.onMessage(SERVER_MESSAGE_TYPES.CATALOG_UPDATED, (info: any) => {
        log(SERVER_MESSAGE_TYPES.CATALOG_UPDATED + ' received', info)
    })

    room.onMessage(SERVER_MESSAGE_TYPES.NEW_WORLD_CREATED, (info: any) => {
        log(SERVER_MESSAGE_TYPES.NEW_WORLD_CREATED + ' received', info)
        if (info.owner.toLowerCase() === localUserId) {
            if(info.init){
                displayWorldReadyPanel(true, info)
                displayPendingPanel(false, "ready")
            }
            else{
                displayPendingPanel(true, "ready")
            }
        } else {
            log('should display something else')
            showNotification({
                type: NOTIFICATION_TYPES.MESSAGE,
                message: (info.init? "New world deployed!\n" : "World Updated!\n") + info.ens + "!",
                animate: {enabled: true, return: true, time: 5}
            })
        }
        setWorlds([info])
    })

    room.onMessage(SERVER_MESSAGE_TYPES.ADDED_TUTORIAL, (info: any) => {
        log(SERVER_MESSAGE_TYPES.ADDED_TUTORIAL + ' received', info)
        iwbConfig.tutorials.push(info)
    })

    room.onMessage(SERVER_MESSAGE_TYPES.REMOVED_TUTORIAL, (info: any) => {
        log(SERVER_MESSAGE_TYPES.REMOVED_TUTORIAL + ' received', info)
        iwbConfig.tutorials.splice(info, 1)
    })

    room.onMessage(SERVER_MESSAGE_TYPES.UPDATED_TUTORIAL_CID, (info: any) => {
        log(SERVER_MESSAGE_TYPES.UPDATED_TUTORIAL_CID + ' received', info)
        iwbConfig.CID = info
    })

    room.onMessage(SERVER_MESSAGE_TYPES.SCENE_DEPLOY_FINISHED, (info: any) => {
        log(SERVER_MESSAGE_TYPES.SCENE_DEPLOY_FINISHED + ' received', info)
        displayPendingPanel(false, "")

        if(info.valid){
            displayDCLWorldPopup(true, info.world)
            showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Your DCL World Deployed!", animate:{enabled:true, return:true, time:10}})
        }
        else{
            showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Error deploying to your DCL World", animate:{enabled:true, return:true, time:10}})
        }
    })
}