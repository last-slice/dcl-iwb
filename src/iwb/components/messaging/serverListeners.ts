import {log} from "../../helpers/functions"
import {NOTIFICATION_TYPES, SERVER_MESSAGE_TYPES, SOUND_TYPES} from "../../helpers/types"
import {updateStyles} from "../catalog"
import {iwbConfig, localUserId, players, removePlayer} from "../player/player"
import {setWorlds} from "../scenes";
import {Room} from "colyseus.js";
import {displayWorldReadyPanel} from "../../ui/Panels/worldReadyPanel";
import {showNotification} from "../../ui/Panels/notificationUI";
import {addSceneStateListeners} from "./sceneListeners";
import {refreshSortedItems, setNewItems, updateItem} from "../catalog/items";
import { createSounds, playSound } from "../sounds";


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

        addSceneStateListeners(room)
        await createSounds()
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
        if (info.owner.toLowerCase() === localUserId && info.init) {
            displayWorldReadyPanel(true, info)
        } else {
            log('should display something else')
            showNotification({
                type: NOTIFICATION_TYPES.MESSAGE,
                message: " New world deployed !\n " + info.ens + "!",
                animate: {enabled: true, return: true, time: 5}
            })
        }

        setWorlds([info])
    })
}