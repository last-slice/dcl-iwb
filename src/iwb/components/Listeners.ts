import { Room } from "colyseus.js";
import { addParenting } from "./Parenting";
import { addTransformComponent, transformListener } from "./Transform";
import { addVisibilityComponent, visibilityListener } from "./Visibility";
import { addTextShapeComponent, textShapeListener } from "./TextShape";
import { addCounterComponent, counterListener } from "./Counter";
import { addTriggerComponent } from "./Triggers";
import { addActionComponent } from "./Actions";
import { addPointerComponent } from "./Pointers";
import { addInputSystem } from "../systems/InputSystem";
import { addGltfComponent, gltfListener } from "./Gltf";
import { addStateComponent, stateListener } from "./States";
import { addSoundComponent } from "./Sounds";
import { createPlayer, setPlayerSelectedAsset, setPlayerVersion } from './Player'
import { SERVER_MESSAGE_TYPES } from "../helpers/types";
import { log } from "../helpers/functions";
import { refreshSortedItems, setCatalog, setNewItems, setRealmAssets, updateItem, updateStyles } from "./Catalog";
import { utils } from "../helpers/libraries";
import { addTutorial, removeTutorial, setConfig, setWorlds, updateTutorialCID } from "./Config";

// import { addIWBCatalogComponent, addIWBComponent } from "./IWB";
// import { addNameComponent } from "./Name";

export async function createColyseusListeners(room:Room){
    createConfigurationListeners(room)

    addInputSystem()
    await addSceneStateListeners(room)
    await createPlayerListeners(room)
}

function addSceneStateListeners(room:Room){
    room.state.scenes.onAdd(async(scene:any, key:string)=>{
        console.log('scene added', key, scene)
        await addParenting(scene)

        await addGltfComponent(scene)
        gltfListener(scene)

        await addVisibilityComponent(scene)
        visibilityListener(scene)

        await addTransformComponent(scene)
        transformListener(scene)

        await addTextShapeComponent(scene)
        textShapeListener(scene)

        await addSoundComponent(scene)

        await addPointerComponent(scene)

        await addTriggerComponent(scene)

        await addActionComponent(scene)

        await addCounterComponent(scene)
        counterListener(scene)

        await addStateComponent(scene)
        stateListener(scene)

        //todo
        //we might not need these since these are only metadata changes and can be pulled auto from colyseus room state
        // await addIWBComponent(scene)
        // await addIWBCatalogComponent(scene)
        // await addNameComponent(scene)

    })
}

function createPlayerListeners(room:Room){
    room.state.players.onAdd(async(player:any, userId:any)=>{
        console.log('player added', userId, player)
        createPlayer(userId, player)

        player.listen("selectedAsset", (current:any, previous:any)=>{
            setPlayerSelectedAsset(player, current, previous)
        })
    })

    log('creating player listeners for room', room.roomId)
    // room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_ASSET_UPLOADED, (info: any) => {
    //     log(SERVER_MESSAGE_TYPES.PLAYER_ASSET_UPLOADED + ' received', info)
    //     showNotification({
    //         type: NOTIFICATION_TYPES.IMAGE,
    //         image: info.im,
    //         message: "Your asset " + info.n + " is uploading and pending deployment. A placeholder object is temporarily available.",
    //         animate: {enabled: true, return: true, time: 10}
    //     })
    //     if (info) {
    //         updateItem(info.id, info)
    //         addPendingAsset(info)
    //         refreshSortedItems()
    //         displayPendingPanel(true, 'assetsready')
    //     }
    // })


    // room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_ASSET_CATALOG, (info: any) => {
    //     log(SERVER_MESSAGE_TYPES.PLAYER_ASSET_CATALOG + ' received', info)
    //     if(info){
    //         if(info.pending){
    //             addPendingAsset(info)
    //             delete info.pending
    //         }
    //         updateItem(info.id, info)
    //     }
    // })

    // room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_SCENES_CATALOG, (info: any) => {
    //     log(SERVER_MESSAGE_TYPES.PLAYER_SCENES_CATALOG + ' received', info)
    //     addPlayerScenes(info.user, info.scenes)
    // })

    // room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_CATALOG_DEPLOYED, (info: any) => {
    //     log(SERVER_MESSAGE_TYPES.PLAYER_CATALOG_DEPLOYED + ' received', info)
    //     showNotification({
    //         type: NOTIFICATION_TYPES.MESSAGE,
    //         message: "Your latest asset uploads have been deployed. Refresh to use them.",
    //         animate: {enabled: true, return: true, time: 10}
    //     })
    //     displayPendingPanel(true, 'ready')
    // })

    // room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_RECEIVED_MESSAGE, (info: any) => {
    //     log(SERVER_MESSAGE_TYPES.PLAYER_RECEIVED_MESSAGE + ' received', info)
    //     showNotification({type:NOTIFICATION_TYPES.MESSAGE, message: "" + info, animate:{enabled:true, return:true, time:5}})
    // })

    // room.onMessage(SERVER_MESSAGE_TYPES.PLAY_MODE_CHANGED, (info: any) => {
    //     log(SERVER_MESSAGE_TYPES.PLAY_MODE_CHANGED + ' received', info)
    //     localPlayer.mode = info.mode
    //     iwbEvents.emit(SERVER_MESSAGE_TYPES.PLAY_MODE_CHANGED, {mode: info.mode})
    // })

    // room.onMessage(SERVER_MESSAGE_TYPES.SCENE_DOWNLOAD, (info: any) => {
    //     log(SERVER_MESSAGE_TYPES.SCENE_DOWNLOAD + ' received', info)
    //     displayDownloadPendingPanel(true, info.link)
    // })

    // room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_SETTINGS, (info: any) => {
    //     log(SERVER_MESSAGE_TYPES.PLAYER_SETTINGS + ' received', info)
    //     switch(info.action){
    //         case 'load':
    //             console.log('load player settings')
    //             setSettings(info.value)

    //             if(!info.value.firstTime){
    //                 displayWelcomeScreen(true)
    //             }

    //             if (localPlayer!.homeWorld) {
    //                 let config = localPlayer!.worlds.find((w) => w.ens === realm)
    //                 console.log("home world config is", config)
    //                 if (config) {
    //                     if (config.v < iwbConfig.v) {
    //                         log('world version behind deployed version, show notification to update')
    //                         showNotification({
    //                             type: NOTIFICATION_TYPES.MESSAGE,
    //                             message: "There's a newer version of the IWB! Visit the Settings panel to view the updates and deploy.",
    //                             animate: {enabled: true, time: 10, return: true}
    //                         })
    //                     }
    //                 }
    //             }

    //             //play music to start

    //             //show notifications

    //             //other settings
    //             break;
    //     }
    // })

}

function createConfigurationListeners(room:Room){
    room.onMessage(SERVER_MESSAGE_TYPES.INIT, async (info: any) => {
        log(SERVER_MESSAGE_TYPES.INIT + ' received', info)

        setCatalog(info.catalog)
        setRealmAssets(info.realmAssets)

        refreshSortedItems()

        updateStyles(info.styles)

        setPlayerVersion(info.iwb.v)
        setConfig(info.iwb.v, info.iwb.updates, info.tutorials.videos, info.tutorials.cid)
        setWorlds(info.worlds)
        setNewItems()

        //set occupied parcels
        // for (const p of info.occupiedParcels) {
        //     //log('occupied parcel', p)
        //     addBoundariesForParcel(p, false)
        // }

        utils.timers.setTimeout(()=>{
            // refreshMap()
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
        addTutorial(info)
    })

    room.onMessage(SERVER_MESSAGE_TYPES.REMOVED_TUTORIAL, (info: any) => {
        log(SERVER_MESSAGE_TYPES.REMOVED_TUTORIAL + ' received', info)
        removeTutorial(info)
    })

    room.onMessage(SERVER_MESSAGE_TYPES.UPDATED_TUTORIAL_CID, (info: any) => {
        log(SERVER_MESSAGE_TYPES.UPDATED_TUTORIAL_CID + ' received', info)
        updateTutorialCID(info)
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

