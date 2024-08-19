import { Room } from "colyseus.js";
import { createPlayer, localPlayer, localUserId, removePlayer, setPlayMode, setPlayerSelectedAsset, setPlayerVersion, setSettings, worldTravel } from './Player'
import { COMPONENT_TYPES, EDIT_MODES, IWBScene, NOTIFICATION_TYPES, PLAYER_GAME_STATUSES, SCENE_MODES, SERVER_MESSAGE_TYPES, SOUND_TYPES, Triggers } from "../helpers/types";
import { getAssetUploadToken, log } from "../helpers/functions";
import { items, marketplaceItems, refreshMarketplaceItems, refreshSortedItems, setCatalog, setNewItems, setRealmAssets, updateItem, updateStyles } from "./Catalog";
import { utils } from "../helpers/libraries";
import { addLocalWorldPermissionsUser, addPlayerToHideArray, addTutorial, excludeHidingUsers, isGCScene, island, iwbConfig, realm, removeLocalWorldPermissionsUser, removePlayerFromHideArray, removeTutorial, setConfig, setHidPlayersArea, setPlayerMode, setWorlds, updateTutorialCID, worlds } from "./Config";
import { playSound } from "@dcl-sdk/utils";
import { cancelSelectedItem, checkPlayerBuildRights, dropSelectedItem, otherUserPlaceditem, otherUserRemovedSeletedItem, selectedItem } from "../modes/Build";
import { addScene, checkAllScenesLoaded, checkSceneCount, enablePrivateModeForScene, isPrivateScene, loadScene, loadSceneAsset, pendingSceneLoad, removeEmptyParcels, unloadScene, updateSceneCount, updateSceneEdits } from "./Scene";
import { engine } from "@dcl/sdk/ecs";
import { selectParcel, deleteParcelEntities, saveNewScene, isParcelInScene, addBoundariesForParcel, deleteCreationEntities } from "../modes/Create";
import { getEntity } from "./IWB";
import { displayIWBMap, refreshMap } from "../ui/Objects/Map";
import { displaySkinnyVerticalPanel } from "../ui/Reuse/SkinnyVerticalPanel";
import { getView } from "../ui/uiViews";
import { hideNotification, showNotification } from "../ui/Objects/NotificationPanel";
import { scene, sceneInfoDetailView } from "../ui/Objects/SceneMainDetailPanel";
import { updateIWBTable } from "../ui/Reuse/IWBTable";
import { colyseusRoom } from "./Colyseus";
import { updateStoreView, updateStoreVisibleItems } from "../ui/Objects/StoreView";
import { actionQueue, getTriggerEvents } from "./Triggers";
import { addGamePlayer, attemptGameEnd, attemptGameStart, playGameShoot, removeGamePlayer } from "./Game";
import { displayPendingPanel } from "../ui/Objects/PendingInfoPanel";
import { displayLiveControl, updatePlayers } from "../ui/Objects/LiveShowPanel";
import { movePlayerTo, openExternalUrl } from "~system/RestrictedActions";
import { disableSceneEntities } from "../modes/Play";

// import { addIWBCatalogComponent, addIWBComponent } from "./IWB";
// import { addNameComponent } from "./Name";

export async function createColyseusListeners(room:Room){
    room.onMessage(SERVER_MESSAGE_TYPES.SCENE_ACTION, (info:any)=>{
        console.log(SERVER_MESSAGE_TYPES.SCENE_ACTION + ' received', info)
        if(!info && !info.type){
            console.log('invalid arguments, do not proceed with scene action')
            return
        }

        let scene = colyseusRoom.state.scenes.get(info.sceneId)
        if(!scene){
            console.log('scene does not exist for requested action to run')
            return
        }

        if(info.forceScene){
            let currentScene = localPlayer.activeScene
            if(!currentScene || currentScene.id !== info.sceneId){
                console.log('forcing scene and player is not in current scene, do not run action')
                return
            }
        }

        switch(info.type){
            case 'live-action':
                if(!scene || !info.aid || !info.actionId){
                    console.log('invalid arguments, cannot run live action')//
                    return
                }

                let actionInfo = scene[COMPONENT_TYPES.ACTION_COMPONENT].get(info.aid)
                console.log('action info is', actionInfo)
                if(actionInfo){
                    let entityInfo = getEntity(scene, info.aid)
                    console.log('entity info is', entityInfo, entityInfo.entity)

                    let action = actionInfo.actions.find(($:any)=> $.id === info.actionId)
                    if(action){
                        console.log('running entity action', action)
                        actionQueue.push({aid:entityInfo.aid, action:action, entity:entityInfo.entity, force:true})
                    }
                }
               
                break;

            case 'live-bounce':
                movePlayerTo({newRelativePosition:info.p, cameraTarget:info.l})
                break;

            case 'live-players-get':
                updatePlayers(info.players)
                break;
        }
    })

    room.onMessage(SERVER_MESSAGE_TYPES.ADD_WORLD_ASSETS, (info:any)=>{
        console.log(SERVER_MESSAGE_TYPES.ADD_WORLD_ASSETS + ' received', info)
        setRealmAssets(info)
    })

    room.onMessage(SERVER_MESSAGE_TYPES.DELETE_WORLD_ASSETS, (info:any)=>{
        console.log(SERVER_MESSAGE_TYPES.DELETE_WORLD_ASSETS + ' received', info)
        setRealmAssets(info)
    })
    
    room.onMessage(SERVER_MESSAGE_TYPES.GET_MARKETPLACE, (info:any)=>{
        console.log(SERVER_MESSAGE_TYPES.GET_MARKETPLACE + ' received', info)
        if(info){
            for(let id in info){
                marketplaceItems.set(id, info[id])
            }
        }
        updateStoreVisibleItems()
        updateStoreView("main")
    })

    room.onMessage(SERVER_MESSAGE_TYPES.INIT, async (info: any) => {
        // log(SERVER_MESSAGE_TYPES.INIT + ' received', info)
        setHidPlayersArea()
        await setRealmAssets(info.realmAssets)

        await refreshSortedItems()

        await updateStyles(info.styles)

        await setPlayerVersion(info.iwb.v)
        await setConfig(info.iwb.v, info.iwb.updates, info.tutorials.videos, info.tutorials.cid)
        await setNewItems()
        await setPlayMode(localUserId, SCENE_MODES.PLAYMODE)

        await setSettings(info.settings)
        if(!isGCScene() && info.settings.firstTime){
            console.log('first time')
            displaySkinnyVerticalPanel(true, getView("Welcome_Screen"))//
        }

        room.state.players.onAdd(async(player:any, userId:any)=>{
            if(userId === localUserId){
                await setWorlds(info.worlds)
                await createPlayer(player)
                setSceneListeners(room)

                if(!isGCScene()){
                    // displayIWBMap(true)//
                    localPlayer.canMap = true
                    utils.timers.setTimeout(()=>{
                        refreshMap()
                    }, 1000 * 10)
                }
            }
    
            if(player.playingGame){
                addGamePlayer(player, userId === localUserId)
            }
    
            player.listen("selectedAsset", (current:any, previous:any)=>{
                setPlayerSelectedAsset(player, current, previous)
            })

            player.listen("gameStatus", (current:any, previous:any)=>{
                if(current === PLAYER_GAME_STATUSES.PLAYING && userId !== localUserId){
                    removePlayerFromHideArray(userId)
                }else{
                    addPlayerToHideArray(userId)
                   
                }
            })
        })
    
        room.state.players.onRemove(async(player:any, userId:any)=>{
            removePlayer(userId, player)
            removeGamePlayer(player)
        })

        utils.timers.setTimeout(()=>{
            checkAllScenesLoaded()
        }, 1000 * 5)
    })

    room.onMessage(SERVER_MESSAGE_TYPES.IWB_VERSION_UPDATE, (info: any) => {
        log(SERVER_MESSAGE_TYPES.IWB_VERSION_UPDATE + ' received', info)
        if(!info){
            return
        }
        iwbConfig.updates = info.updates
        iwbConfig.v = info.version
        showNotification({type:NOTIFICATION_TYPES.MESSAGE, message: "The IWB Platform has an update!", animate:{enabled:true, return:true, time:5}})
    })

    room.onMessage(SERVER_MESSAGE_TYPES.NEW_WORLD_CREATED, async (info: any) => {
        log(SERVER_MESSAGE_TYPES.NEW_WORLD_CREATED + ' received', info)
        await setWorlds([info])

        console.log('worlds are ', worlds)

        let world = worlds.find($=> $.ens === info.ens)
        if(world){
            if (info.owner.toLowerCase() === localUserId || world.bps.includes(localUserId)) {
                if(info.init){
                    displaySkinnyVerticalPanel(true, getView("Init_World_Ready"), info.ens, ()=>{
                      worldTravel(world)  
                    })
                    if(info.ens === realm){
                        displayPendingPanel(false, "ready")
                    }
                }
                else{
                    if(info.ens === realm){
                        displayPendingPanel(true, "ready")
                    }   
                }
            }
            showNotification({
                type: NOTIFICATION_TYPES.MESSAGE,
                message: (info.init? "New world deployed!\n" : "World Updated!\n") + info.ens + "!",
                animate: {enabled: true, return: true, time: 5}
            })
        }
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
            if(info.dest === "gc"){
                showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Your scene " + info.name + " deployed to Genesis City!", animate:{enabled:true, return:true, time:10}})
            }else{
                showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Your DCL World Deployed!", animate:{enabled:true, return:true, time:10}})
            }
        }
        else{
            showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Error deploying to your DCL World", animate:{enabled:true, return:true, time:10}})
        }
    })

    room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_ASSET_UPLOADED, (info: any) => {
        log(SERVER_MESSAGE_TYPES.PLAYER_ASSET_UPLOADED + ' received', info)
        if(localPlayer.homeWorld || localPlayer.worldPermissions){
            showNotification({
                type: NOTIFICATION_TYPES.IMAGE,
                image: info.im,
                message: "" + info.n + " asset is uploaded and pending deployment. A placeholder object is temporarily available.",
                animate: {enabled: true, return: true, time: 10}
            })
            if (info) {
                updateItem(info.id, info)
                // addPendingAsset(info)//
                refreshSortedItems()
                displayPendingPanel(true, 'assetsready')
            }
        }
    })

    room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_RECEIVED_MESSAGE, (info: any) => {
        log(SERVER_MESSAGE_TYPES.PLAYER_RECEIVED_MESSAGE + ' received', info)
        if(info.forceScene){
            if(!localPlayer.activeScene || localPlayer.activeScene.id !== info.forceScene){
                return
            }
        }

        showNotification({type:NOTIFICATION_TYPES.MESSAGE, message: "" + info.message, animate:{enabled:true, return:true, time:5}})
        if(info.sound){
            playSound(info.sound)
        }
    })

    room.onMessage(SERVER_MESSAGE_TYPES.PLAY_MODE_CHANGED, (info: any) => {
        log(SERVER_MESSAGE_TYPES.PLAY_MODE_CHANGED + ' received', info)
        // setPlayerMode(info.mode)
    })

    room.onMessage(SERVER_MESSAGE_TYPES.SCENE_SAVE_EDITS, (info: any) => {
        log(SERVER_MESSAGE_TYPES.SCENE_SAVE_EDITS + ' received', info)
        // setPlayerMode(info.mode)//
        if(!info){
            return
        }

        let scene = colyseusRoom.state.scenes.get(info.sceneId)
        console.log('scene is', scene)
        if(info.eChanged){
            if(scene && scene.e){
                console.log('need to load in scene')
                addScene(scene)
            }else{
                console.log('need to unload scene')
                unloadScene(scene)
                enablePrivateModeForScene(scene)//
            }
        }

        if(info.pChanged){
            if(localPlayer.homeWorld || localPlayer.worldPermissions){
                return
            }

            if(scene && !scene.priv){
                console.log('need to load in scene', scene)
                addScene(scene)
            }else{
                console.log('need to unload scene')
                unloadScene(scene)
                enablePrivateModeForScene(scene)
            }
        }
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
                // setSettings(info.value)

                // if(!info.value.firstTime){
                //     // displayWelcomeScreen(true)
                // }

                // if (ocalPlayer!.homeWorld) {
                //     let config = localPlayer!.worlds.find((w:any) => w.ens === realm)
                //     if (config) {
                //         if (config.v < iwbConfig.v) {
                //             showNotification({
                //                 type: NOTIFICATION_TYPES.MESSAGE,
                //                 message: "There's a newer version of the IWB! Visit the Settings panel to view the updates and deploy.",
                //                 animate: {enabled: true, time: 10, return: true}
                //             })
                //         }
                //     }
                // }

                //play music to start

                //show notifications

                //other settings
                break;
        }
    })

    room.onMessage(SERVER_MESSAGE_TYPES.SCENE_ADDED_NEW, ({name, sceneName}: { name: string, sceneName: string }) => {
        log(SERVER_MESSAGE_TYPES.SCENE_SAVE_NEW + ' received', name, sceneName)
        if(name === localPlayer.name){
            hideNotification()
            showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"You just created a new scene " + sceneName + "!", animate:{enabled:true, return:true, time: 5}})
        }else{
            showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"" + name + " just created a new scene " + sceneName + "!", animate:{enabled:true, return:true, time: 5}})
        }
    })

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

        if(sceneInfoDetailView === "Builders"){
            utils.timers.setTimeout(()=>{
                let scene = colyseusRoom.state.scenes.get(info.sceneId)
                if(scene){
                    updateIWBTable(scene.bps)
                }      
            }, 100)
        }
    })

    room.onMessage(SERVER_MESSAGE_TYPES.SCENE_DELETE_BP, (info:any) => {
        log(SERVER_MESSAGE_TYPES.SCENE_DELETE_BP + ' received', info)
        if(info.user === localUserId){
            checkPlayerBuildRights()
            showNotification({type: NOTIFICATION_TYPES.MESSAGE, message: "Your builder permissions were removed for scene " + info.sceneName, animate:{enabled:true, return:true, time:5}})
            if(selectedItem && selectedItem.enabled){
                if(selectedItem.mode === EDIT_MODES.GRAB){
                    dropSelectedItem()
                }else{
                    cancelSelectedItem()
                }
            }
            setPlayMode(localUserId, SCENE_MODES.PLAYMODE)
        }
        else{
            showNotification({type: NOTIFICATION_TYPES.MESSAGE, message: "Removed Build Permissions for " + info.user + " on your scene " + info.sceneName, animate:{enabled:true, return:true, time:5}})
        }

        if(sceneInfoDetailView === "Builders"){
            utils.timers.setTimeout(()=>{
                let scene = colyseusRoom.state.scenes.get(info.sceneId)
                if(scene){
                    updateIWBTable(scene.bps)
                }      
            }, 100)
        }
    })

    // room.onMessage(SERVER_MESSAGE_TYPES.UPDATE_GRAB_Y_AXIS, (info:any) => {
    //     log(SERVER_MESSAGE_TYPES.UPDATE_GRAB_Y_AXIS + ' received', info)
    //     if(info.user !== localUserId){
    //         updateGrabbedYAxis(info)
    //     }
    // })

    room.onMessage(SERVER_MESSAGE_TYPES.SCENE_DEPLOY, (info:any) => {
        log(SERVER_MESSAGE_TYPES.SCENE_DEPLOY + ' received', info)
        // updateExportPanelView('main')
        // displaySceneSetting("Info")
        // displaySceneInfoPanel(false,null)
        if(!info.valid){
            displayPendingPanel(false, "")
        }
        showNotification({type:NOTIFICATION_TYPES.MESSAGE, message: info.msg, animate:{enabled:true, return:true, time: 5}})
    })

    room.onMessage(SERVER_MESSAGE_TYPES.SCENE_DEPLOY_READY, (info:any) => {
        log(SERVER_MESSAGE_TYPES.SCENE_DEPLOY_READY + ' received', info)
        if(info && info.link){
            displaySkinnyVerticalPanel(true, getView("Deployment_Ready"), undefined, ()=>{
                openExternalUrl({url:info.link.replace(" ", "%20")})
            })
        }
    })

    room.onMessage(SERVER_MESSAGE_TYPES.SCENE_COUNT, (info: any) => {
        log(SERVER_MESSAGE_TYPES.SCENE_COUNT + ' received', info)
        updateSceneCount(info)
    })

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
    // })//

    room.onMessage(SERVER_MESSAGE_TYPES.CLAIM_REWARD, (info: any) => {
        log(SERVER_MESSAGE_TYPES.CLAIM_REWARD + ' received', info)
        utils.timers.setTimeout(()=>{
            hideNotification()
            if(info.valid){
                showNotification({type:NOTIFICATION_TYPES.IMAGE, message:"Item Claimed!\n" + info.name, image:info.image, animate:{enabled:true, return:true, time:7}})
            }else{
                showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Error: Claim Response\n" + info.reason, animate:{enabled:true, return:true, time:5}})
            }
        }, 1000 * 2)
    })

    // room.onMessage(SERVER_MESSAGE_TYPES.VERIFY_ACCESS, (info: any) => {
    //     log(SERVER_MESSAGE_TYPES.VERIFY_ACCESS + ' received', info)
    //     findEntitiesWithTrigger(info.sceneId, info.access ? Triggers.ON_ACCESS_VERIFIED : Triggers.ON_ACCESS_DENIED)
    // })

    room.onMessage(SERVER_MESSAGE_TYPES.START_GAME, (info:any) => {
        log(SERVER_MESSAGE_TYPES.START_GAME + ' received', info)
        attemptGameStart(info)
    })

    room.onMessage(SERVER_MESSAGE_TYPES.END_GAME, (info:any) => {
        log(SERVER_MESSAGE_TYPES.END_GAME + ' received', info)
        attemptGameEnd(info)//
    })

    room.onMessage(SERVER_MESSAGE_TYPES.SHOOT, (info:any) => {
        log(SERVER_MESSAGE_TYPES.SHOOT + ' received', info)
        playGameShoot(info)
    })

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

}

function setSceneListeners(room:any){
    room.state.scenes.onAdd(async(scene:any, key:string)=>{
        console.log('scene added', key, scene)
        scene.checkEnabled = false
        scene.checkDisabled = false
        scene.loaded = false

        await addScene(scene)
        disableSceneEntities(scene.id)
        
        scene.listen("si",(current:any, previous:any)=>{
            scene.si = current
        })
    
        scene.listen("pc",(current:any, previous:any)=>{
            console.log('pc changed', previous, current)
            scene.pc = current
        })
    
        scene.listen("priv",(current:any, previous:any)=>{
            console.log('scene privacy changed', previous, current)
            // if(previous !== undefined){
            //     if(localPlayer.homeWorld || localPlayer.hasWorldPermissions){
            //         return///
            //     }

            //     console.log('scene privacy is', scene.priv)
    
            //     if(current){
            //         console.log('need to load in scene', scene)
            //         addScene(scene)
            //     }else{
            //         console.log('need to unload scene')//
            //         unloadScene(scene)
            //         enablePrivateModeForScene(scene)
            //     }
            // }
        })
    
        scene.listen("e",(current:any, previous:any)=>{
            console.log('scene enabled changed', previous, current)
            // if(previous !== undefined){
            //     console.log('scene enabled changed', previous, current)
            //     if(!current){
            //         enablePrivateModeForScene(scene)
            //     }
            //     else{
            //         scene.ass.forEach((asset:any)=>{
            //             loadSceneAsset(scene.id, asset)
            //         })
            //     }
            // }
        })
    })

    room.state.scenes.onRemove((scene:any, key:string)=>{
        log('removing scene from state', key, scene)
        if(scene.o === localUserId){
            showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"You deleted scene " + scene.n, animate:{enabled:true, return:true, time:5}})
        }else{
            showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"" + scene.ona + " just deleted their scene " + scene.n, animate:{enabled:true, return:true, time:5}})
        }
        unloadScene(scene)
    })
}