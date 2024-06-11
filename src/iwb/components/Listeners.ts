import { Room } from "colyseus.js";
import { addInputSystem, createInputListeners } from "../systems/InputSystem";
import { addPlayerScenes, createPlayer, localPlayer, localUserId, removePlayer, setPlayMode, setPlayerSelectedAsset, setPlayerVersion, setSettings } from './Player'
import { EDIT_MODES, IWBScene, NOTIFICATION_TYPES, SCENE_MODES, SERVER_MESSAGE_TYPES, SOUND_TYPES, Triggers } from "../helpers/types";
import { log } from "../helpers/functions";
import { items, refreshSortedItems, setCatalog, setNewItems, setRealmAssets, updateItem, updateStyles } from "./Catalog";
import { utils } from "../helpers/libraries";
import { addLocalWorldPermissionsUser, addTutorial, iwbConfig, realm, removeLocalWorldPermissionsUser, removeTutorial, setConfig, setPlayerMode, setWorlds, updateTutorialCID } from "./Config";
import { playSound } from "@dcl-sdk/utils";
import { checkPlayerBuildRights, otherUserPlaceditem, otherUserRemovedSeletedItem, selectedItem } from "../modes/Build";
import { checkSceneCount, enablePrivateModeForScene, loadScene, loadSceneAsset, removeEmptyParcels, unloadScene, updateSceneCount, updateSceneEdits } from "./Scene";
import { engine } from "@dcl/sdk/ecs";
import { selectParcel, deleteParcelEntities, saveNewScene, isParcelInScene, addBoundariesForParcel, deleteCreationEntities } from "../modes/Create";
import { getEntity } from "./IWB";
import { refreshMap } from "../ui/Objects/Map";
import { displaySkinnyVerticalPanel } from "../ui/Reuse/SkinnyVerticalPanel";
import { getView } from "../ui/uiViews";
import { showNotification } from "../ui/Objects/NotificationPanel";
import { BuildModeVisibiltyComponents } from "../systems/BuildModeVisibilitySystem";
import { FlyModeSystem } from "../systems/FlyModeSystem";
import { PlayerTrackingSystem } from "../systems/PlayerTrackingSystem";
import { SelectedItemSystem } from "../systems/SelectedItemSystem";

// import { addIWBCatalogComponent, addIWBComponent } from "./IWB";
// import { addNameComponent } from "./Name";

export async function createColyseusListeners(room:Room){
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
        setPlayMode(localUserId, SCENE_MODES.BUILD_MODE)

        utils.timers.setTimeout(()=>{
            refreshMap()
        }, 1000 * 5)
    })

    // room.onMessage(SERVER_MESSAGE_TYPES.NEW_WORLD_CREATED, (info: any) => {
    //     log(SERVER_MESSAGE_TYPES.NEW_WORLD_CREATED + ' received', info)
    //     if (info.owner.toLowerCase() === localUserId) {
    //         if(info.init){
    //             displayWorldReadyPanel(true, info)
    //             displayPendingPanel(false, "ready")
    //         }
    //         else{
    //             displayPendingPanel(true, "ready")
    //         }
    //     } else {
    //         log('should display something else')
    //         showNotification({
    //             type: NOTIFICATION_TYPES.MESSAGE,
    //             message: (info.init? "New world deployed!\n" : "World Updated!\n") + info.ens + "!",
    //             animate: {enabled: true, return: true, time: 5}
    //         })
    //     }
    //     setWorlds([info])
    // })

    // room.onMessage(SERVER_MESSAGE_TYPES.ADDED_TUTORIAL, (info: any) => {
    //     log(SERVER_MESSAGE_TYPES.ADDED_TUTORIAL + ' received', info)
    //     addTutorial(info)
    // })

    // room.onMessage(SERVER_MESSAGE_TYPES.REMOVED_TUTORIAL, (info: any) => {
    //     log(SERVER_MESSAGE_TYPES.REMOVED_TUTORIAL + ' received', info)
    //     removeTutorial(info)
    // })

    // room.onMessage(SERVER_MESSAGE_TYPES.UPDATED_TUTORIAL_CID, (info: any) => {
    //     log(SERVER_MESSAGE_TYPES.UPDATED_TUTORIAL_CID + ' received', info)
    //     updateTutorialCID(info)
    // })

    // room.onMessage(SERVER_MESSAGE_TYPES.SCENE_DEPLOY_FINISHED, (info: any) => {
    //     log(SERVER_MESSAGE_TYPES.SCENE_DEPLOY_FINISHED + ' received', info)
    //     displayPendingPanel(false, "")

    //     if(info.valid){
    //         displayDCLWorldPopup(true, info.world)
    //         showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Your DCL World Deployed!", animate:{enabled:true, return:true, time:10}})
    //     }
    //     else{
    //         showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Error deploying to your DCL World", animate:{enabled:true, return:true, time:10}})
    //     }
    // })

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
    // })//


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

    room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_RECEIVED_MESSAGE, (info: any) => {
        log(SERVER_MESSAGE_TYPES.PLAYER_RECEIVED_MESSAGE + ' received', info)
        showNotification({type:NOTIFICATION_TYPES.MESSAGE, message: "" + info, animate:{enabled:true, return:true, time:5}})
    })

    room.onMessage(SERVER_MESSAGE_TYPES.PLAY_MODE_CHANGED, (info: any) => {
        log(SERVER_MESSAGE_TYPES.PLAY_MODE_CHANGED + ' received', info)
        setPlayerMode(info.mode)
    })

    // room.onMessage(SERVER_MESSAGE_TYPES.SCENE_DOWNLOAD, (info: any) => {
    //     log(SERVER_MESSAGE_TYPES.SCENE_DOWNLOAD + ' received', info)
    //     displayDownloadPendingPanel(true, info.link)
    // })

    room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_SETTINGS, (info: any) => {
        log(SERVER_MESSAGE_TYPES.PLAYER_SETTINGS + ' received', info)
        switch(info.action){
            case 'load':
                console.log('load player settings')
                setSettings(info.value)

                if(!info.value.firstTime){
                    // displayWelcomeScreen(true)
                }

                if (localPlayer!.homeWorld) {
                    let config = localPlayer!.worlds.find((w:any) => w.ens === realm)
                    if (config) {
                        if (config.v < iwbConfig.v) {
                            showNotification({
                                type: NOTIFICATION_TYPES.MESSAGE,
                                message: "There's a newer version of the IWB! Visit the Settings panel to view the updates and deploy.",
                                animate: {enabled: true, time: 10, return: true}
                            })
                        }
                    }
                }

                //play music to start

                //show notifications

                //other settings
                break;
        }
    })

    room.onMessage(SERVER_MESSAGE_TYPES.SCENE_ADDED_NEW, ({name, sceneName}: { name: string, sceneName: string }) => {
        log(SERVER_MESSAGE_TYPES.SCENE_SAVE_NEW + ' received', name, sceneName)
        if(name === localPlayer.name){
            showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"You just created a new scene " + sceneName + "!", animate:{enabled:true, return:true, time: 5}})
        }else{
            showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"" + name + " just created a new scene " + sceneName + "!", animate:{enabled:true, return:true, time: 5}})
        }
    })

    // room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_EDIT_ASSET, (info:any) => {
    //     log(SERVER_MESSAGE_TYPES.PLAYER_EDIT_ASSET + ' received', info)
    // })

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

    room.onMessage(SERVER_MESSAGE_TYPES.PLACE_SELECTED_ASSET, (info:any) => {
        log(SERVER_MESSAGE_TYPES.PLACE_SELECTED_ASSET + ' received', info)
        if(info.user !== localUserId){
            otherUserPlaceditem(info)
        }
    })

    room.onMessage(SERVER_MESSAGE_TYPES.WORLD_ADD_BP, (info:any) => {
        log(SERVER_MESSAGE_TYPES.WORLD_ADD_BP + ' received', info)
        if(info.user === localUserId){
            localPlayer.worldPermissions = true
            showNotification({type: NOTIFICATION_TYPES.MESSAGE, message: "You were granted build permissions for this world!", animate:{enabled:true, return:true, time:5}})
        }
        else{
            showNotification({type: NOTIFICATION_TYPES.MESSAGE, message: "Build Permissions Granted to user " + info.user + " on this world", animate:{enabled:true, return:true, time:5}})
        }
        addLocalWorldPermissionsUser(info.user)
    })

    room.onMessage(SERVER_MESSAGE_TYPES.WORLD_DELETE_BP, (info:any) => {
        log(SERVER_MESSAGE_TYPES.WORLD_DELETE_BP + ' received', info)
        if(info.user === localUserId){
            localPlayer.worldPermissions = false
            showNotification({type: NOTIFICATION_TYPES.MESSAGE, message: "Your builder permissions were removed for this world ", animate:{enabled:true, return:true, time:5}})
        }
        else{
            showNotification({type: NOTIFICATION_TYPES.MESSAGE, message: "Removed Build Permissions for " + info.user + " on this world", animate:{enabled:true, return:true, time:5}})
        }
        removeLocalWorldPermissionsUser(info.user)
    })

    room.onMessage(SERVER_MESSAGE_TYPES.SCENE_ADD_BP, (info:any) => {
        log(SERVER_MESSAGE_TYPES.SCENE_ADD_BP + ' received', info)
        if(info.user === localUserId){
            localPlayer.canBuild = true
            showNotification({type: NOTIFICATION_TYPES.MESSAGE, message: "You were granted build permissions for scene " + info.sceneName, animate:{enabled:true, return:true, time:5}})
        }
        else{
            showNotification({type: NOTIFICATION_TYPES.MESSAGE, message: "Build Permissions Granted to user " + info.user + " for your scene " + info.sceneName, animate:{enabled:true, return:true, time:5}})
        }
    })

    room.onMessage(SERVER_MESSAGE_TYPES.SCENE_DELETE_BP, (info:any) => {
        log(SERVER_MESSAGE_TYPES.SCENE_DELETE_BP + ' received', info)
        if(info.user === localUserId){
            checkPlayerBuildRights()
            showNotification({type: NOTIFICATION_TYPES.MESSAGE, message: "Your builder permissions were removed for scene " + info.sceneName, animate:{enabled:true, return:true, time:5}})
        }
        else{
            showNotification({type: NOTIFICATION_TYPES.MESSAGE, message: "Removed Build Permissions for " + info.user + " on your scene " + info.sceneName, animate:{enabled:true, return:true, time:5}})
        }
    })

    // room.onMessage(SERVER_MESSAGE_TYPES.SCENE_SAVE_EDITS, (info:any) => {
    //     log(SERVER_MESSAGE_TYPES.SCENE_SAVE_EDITS + ' received', info)
    //     updateSceneEdits(info)
    // })

    // room.onMessage(SERVER_MESSAGE_TYPES.UPDATE_GRAB_Y_AXIS, (info:any) => {
    //     log(SERVER_MESSAGE_TYPES.UPDATE_GRAB_Y_AXIS + ' received', info)
    //     if(info.user !== localUserId){
    //         updateGrabbedYAxis(info)
    //     }
    // })

    // room.onMessage(SERVER_MESSAGE_TYPES.SCENE_DEPLOY, (info:any) => {
    //     log(SERVER_MESSAGE_TYPES.SCENE_DEPLOY + ' received', info)
    //     updateExportPanelView('main')
    //     displaySceneSetting("Info")
    //     displaySceneInfoPanel(false,null)
    //     showNotification({type:NOTIFICATION_TYPES.MESSAGE, message: info.msg, animate:{enabled:true, return:true, time: 5}})
    // })

    // room.onMessage(SERVER_MESSAGE_TYPES.SCENE_DEPLOY_READY, (info:any) => {
    //     log(SERVER_MESSAGE_TYPES.SCENE_DEPLOY_READY + ' received', info)
    //     if(info && info.link){
    //         localPlayer.deploymentLink = info.link
    //         displayDeployPendingPanel(true)
    //     }
    // })

    // room.onMessage(SERVER_MESSAGE_TYPES.SCENE_COUNT, (info: any) => {
    //     log(SERVER_MESSAGE_TYPES.SCENE_COUNT + ' received', info)
    //     updateSceneCount(info)
    // })

    // room.onMessage(SERVER_MESSAGE_TYPES.SELECTED_SCENE_ASSET, (info: any) => {
    //     log(SERVER_MESSAGE_TYPES.SELECTED_SCENE_ASSET + ' received', info)
    //     if(!info.valid && info.player === localUserId){
    //         playSound(SOUND_TYPES.ERROR_2)
    //     }
    // })

    // room.onMessage(SERVER_MESSAGE_TYPES.DELETE_UGC_ASSET, (info: any) => {
    //     log(SERVER_MESSAGE_TYPES.DELETE_UGC_ASSET + ' received', info)
    //     items.delete(info.id)
    //     refreshSortedItems()
    //     filterCatalog()
    // })

    // room.onMessage(SERVER_MESSAGE_TYPES.CLAIM_REWARD, (info: any) => {
    //     log(SERVER_MESSAGE_TYPES.CLAIM_REWARD + ' received', info)
    //     utils.timers.setTimeout(()=>{
    //         hideNotification()
    //         if(info.valid){
    //             showNotification({type:NOTIFICATION_TYPES.IMAGE, message:"Item Claimed!\n" + info.name, image:info.image, animate:{enabled:true, return:true, time:7}})
    //         }else{
    //             showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Error: Claim Response\n" + info.reason, animate:{enabled:true, return:true, time:5}})
    //         }
    //     }, 1000 * 2)
    // })

    // room.onMessage(SERVER_MESSAGE_TYPES.VERIFY_ACCESS, (info: any) => {
    //     log(SERVER_MESSAGE_TYPES.VERIFY_ACCESS + ' received', info)
    //     findEntitiesWithTrigger(info.sceneId, info.access ? Triggers.ON_ACCESS_VERIFIED : Triggers.ON_ACCESS_DENIED)
    // })

    room.state.listen("sceneCount", (c:any, p:any)=>{
        checkSceneCount(c)
    })

    room.state.temporaryParcels.onAdd(async(parcel:any, key:string)=>{
        selectParcel(parcel)
    })

    room.state.temporaryParcels.onRemove(async(parcel:any, key:string)=>{
        if(!isParcelInScene(parcel)){
            deleteParcelEntities(parcel)
        }
    })

    room.state.scenes.onAdd(async(scene:any, key:string)=>{
        console.log('scene added', key, scene)
        deleteCreationEntities(localUserId)

        await removeEmptyParcels(scene.pcls)
        await loadScene(scene)

        // scene.bps.onAdd((permission:string, permissionKey:any)=>{
        //     log('adding new build permissions', permissionKey, permission)
        // })
    
        // scene.bps.onRemove((permission:string, permissionKey:any)=>{
        //     log('removing build permissions', permissionKey, permission)
        //     if(!scene.bps.includes(localUserId) && localPlayer.mode === SCENE_MODES.BUILD_MODE){
        //         log('no more build permissions for user, need to kick them to play mode')
        //         if(selectedItem && selectedItem.enabled){
        //             if(selectedItem.mode === EDIT_MODES.GRAB){
        //                 dropSelectedItem()
        //             }else{
        //                 cancelSelectedItem()
        //             }
        //         }
        //         setPlayMode(localUserId, SCENE_MODES.PLAYMODE)
        //     }
        // })
    
        // scene.pcls.onAdd((parcel:string, parcelKey:any)=>{
        //     if(editCurrentSceneParcels){
        //         addBoundariesForParcel(parcel, true, scene.name === "Realm Lobby" ? true : false)
        //     }
        // })
    
        // scene.pcls.onRemove((parcel:string, parcelKey:any)=>{
        //     if(editCurrentSceneParcels){
        //         deleteParcelEntities(parcel)
        //     }
        // })
    
        scene.listen("si",(current:any, previous:any)=>{
            scene.si = current
        })
    
        scene.listen("pc",(current:any, previous:any)=>{
            console.log('pc changed', previous, current)
            scene.pc = current
        })
    
        scene.listen("priv",(current:any, previous:any)=>{
            if(previous !== undefined){
                if(current){
                    if(scene.o !== localUserId){
                        enablePrivateModeForScene(scene)
                    }
                }
                else{
                    if(scene.o !== localUserId && scene.e){
                        scene.ass.forEach((asset:any)=>{
                            loadSceneAsset(scene.id, asset)
                        })
                    }
                }
            }
        })
    
        scene.listen("e",(current:any, previous:any)=>{
            if(previous !== undefined){
                if(!current){
                    enablePrivateModeForScene(scene)
                }
                else{
                    scene.ass.forEach((asset:any)=>{
                        loadSceneAsset(scene.id, asset)
                    })
                }
            }
        })
    })

    room.state.scenes.onRemove((scene:any, key:string)=>{
        // log('removing scene from state', key, scene)
        // if(scene.o === localUserId){
        //     showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"You deleted scene " + scene.n, animate:{enabled:true, return:true, time:5}})
        // }else{
        //     showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"" + scene.ona + " just deleted their scene " + scene.n, animate:{enabled:true, return:true, time:5}})
        // }
        // unloadScene(key)
    })

    room.state.players.onAdd(async(player:any, userId:any)=>{
        if(userId === localUserId){
            createPlayer(player)
        }
        player.listen("selectedAsset", (current:any, previous:any)=>{
            setPlayerSelectedAsset(player, current, previous)
        })
    })

    room.state.players.onRemove(async(player:any, userId:any)=>{
        removePlayer(userId)
    })
}