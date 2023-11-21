import {log} from "../../helpers/functions"
import {SERVER_MESSAGE_TYPES} from "../../helpers/types"
import {items} from "../catalog"
import {localUserId, players, removePlayer} from "../player/player"
import {addBoundariesForParcel} from "../modes/create";
import { setScenes, setWorlds } from "../scenes";
import { Room } from "colyseus.js";
import { displayWorldReadyPanel } from "../../ui/Panels/worldReadyPanel";


export function initiateMessageListeners(room: Room) {

    room.onMessage(SERVER_MESSAGE_TYPES.INIT, (info: any) => {
        log(SERVER_MESSAGE_TYPES.INIT + ' received', info)

        //set initial catalog
        let catalog = info.catalog
        for (const key in catalog) {
            if (catalog.hasOwnProperty(key)) {
                const value = catalog[key];
                items.set(key, value)
            }
        }
        log('catalog size is', items.size)

        //set deployed iwb version
        players.get(localUserId)!.version = info.iwb.v

        //set scene list
        // setScenes(info.scenes)
        setWorlds(info.worlds)

        //set occupied parcels
        // for (const p of info.occupiedParcels) {
        //     //log('occupied parcel', p)
        //     addBoundariesForParcel(p, false)
        // }

    })

    room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_JOINED_USER_WORLD, (info: any) => {
        log(SERVER_MESSAGE_TYPES.PLAYER_JOINED_USER_WORLD + ' received', info)
        if(info){
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
        if(info.owner === localUserId){
            displayWorldReadyPanel(true, info)
        }

        setWorlds([info])
    })
}