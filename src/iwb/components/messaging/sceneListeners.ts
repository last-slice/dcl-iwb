import { GltfContainer, engine } from "@dcl/sdk/ecs"
import {log} from "../../helpers/functions"
import {COLLISION_LAYERS, EDIT_MODES, EDIT_MODIFIERS, IWBScene, NOTIFICATION_TYPES, SCENE_MODES, SERVER_MESSAGE_TYPES, SceneItem} from "../../helpers/types"
import {
    otherUserPlaceditem,
    otherUserRemovedSeletedItem,
    otherUserSelectedItem,
    removeItem,
    transformObject,
} from "../modes/build"
import {addBoundariesForParcel, deleteParcelEntities, isParcelInScene, saveNewScene, selectParcel} from "../modes/create"
import { localUserId, setPlayMode } from "../player/player"
import { entitiesFromItemIds, itemIdsFromEntities, loadScene, loadSceneAsset, sceneBuilds, unloadScene, updateAsset, updateSceneEdits } from "../scenes"
import { showNotification } from "../../ui/Panels/notificationUI"
import { editCurrentSceneParcels } from "../../ui/Panels/CreateScenePanel"
import { updateCollision, updateImageUrl, updateNFTFrame, updateVideoAutostart, updateVideoPlaying, updateVideoUrl, updateVideoVolume } from "../scenes/components"
import { textComponentListener } from "./listeners/TextComponent"
import { collisionComponentListener } from "./listeners/CollisionComponent"
import { imageComponentListener } from "./listeners/ImageComponent"
import { videoComponentListener } from "./listeners/VideoComponent"
import { transformComponentListener } from "./listeners/TransformComponent"
import { nftComponentListener } from "./listeners/NFTComponent"
import { sceneListeners } from "./Scene"
import { assetListener } from "./Asset"

export function createSceneListeners(room: any) {
        log('creating scene listeners for room', room.roomId)

        room.state.temporaryParcels.onAdd(async(parcel:any, key:string)=>{
            log('temp parcel added', key, parcel)
            selectParcel(parcel)
        })

        room.state.temporaryParcels.onRemove(async(parcel:any, key:string)=>{
            log('temp parcel removed', key, parcel)
            if(!isParcelInScene(parcel)){
                deleteParcelEntities(parcel)
            }
        })

        room.onMessage(SERVER_MESSAGE_TYPES.SELECT_PARCEL, (info: any) => {
            log(SERVER_MESSAGE_TYPES.SELECT_PARCEL + ' received', info)
            selectParcel(info)
        })
    
        room.onMessage(SERVER_MESSAGE_TYPES.REMOVE_PARCEL, (info: any) => {
            log(SERVER_MESSAGE_TYPES.REMOVE_PARCEL + ' received', info)
            deleteParcelEntities(info)
        })
    
        room.onMessage(SERVER_MESSAGE_TYPES.SCENE_SAVE_NEW, ({userId, scene}: { userId: string, scene: IWBScene }) => {
            log(SERVER_MESSAGE_TYPES.SCENE_SAVE_NEW + ' received', userId, scene)
            saveNewScene(userId)
        })
    
        room.onMessage(SERVER_MESSAGE_TYPES.SCENE_ADDED_NEW, (info:any) => {
            log(SERVER_MESSAGE_TYPES.SCENE_ADDED_NEW + ' received', info)
            // setScenes(info.info)//
        })

        room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_EDIT_ASSET, (info:any) => {
            log(SERVER_MESSAGE_TYPES.PLAYER_EDIT_ASSET + ' received', info)
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

        // room.onMessage(SERVER_MESSAGE_TYPES.USE_SELECTED_ASSET, (info:any) => {
        //     log(SERVER_MESSAGE_TYPES.USE_SELECTED_ASSET + ' received', info)
        //     if(info.user !== localUserId){
        //         log('need to show pickup asset for other user')
        //             otherUserSelectedItem(info)
        //     }
        // })//

        room.onMessage(SERVER_MESSAGE_TYPES.PLACE_SELECTED_ASSET, (info:any) => {
            log(SERVER_MESSAGE_TYPES.PLACE_SELECTED_ASSET + ' received', info)
            if(info.user !== localUserId){
                otherUserPlaceditem(info)
            }
        })

        room.onMessage(SERVER_MESSAGE_TYPES.SCENE_ADD_BP, (info:any) => {
            log(SERVER_MESSAGE_TYPES.SCENE_ADD_BP + ' received', info)
            if(info.user === localUserId){
                showNotification({type: NOTIFICATION_TYPES.MESSAGE, message: "You were granted build permissions for scene " + (sceneBuilds.has(info.sceneId) ? sceneBuilds.get(info.sceneId).n : ""), animate:{enabled:true, return:true, time:5}})
            }
            else{
                showNotification({type: NOTIFICATION_TYPES.MESSAGE, message: "Build Permissions Granted to user " + info.user + " for your scene " + (sceneBuilds.has(info.sceneId) ? sceneBuilds.get(info.sceneId).n : ""), animate:{enabled:true, return:true, time:5}})
            }
        })

        room.onMessage(SERVER_MESSAGE_TYPES.SCENE_DELETE_BP, (info:any) => {
            log(SERVER_MESSAGE_TYPES.SCENE_DELETE_BP + ' received', info)
            if(info.user === localUserId){
                showNotification({type: NOTIFICATION_TYPES.MESSAGE, message: "Your builde permissions were removed for scene " + (sceneBuilds.has(info.sceneId) ? sceneBuilds.get(info.sceneId).n : ""), animate:{enabled:true, return:true, time:5}})
            }
            else{
                showNotification({type: NOTIFICATION_TYPES.MESSAGE, message: "Removed Build Permissions for " + info.user + " on your scene " + (sceneBuilds.has(info.sceneId) ? sceneBuilds.get(info.sceneId).n : ""), animate:{enabled:true, return:true, time:5}})
            }
        })

        room.onMessage(SERVER_MESSAGE_TYPES.SCENE_SAVE_EDITS, (info:any) => {
            log(SERVER_MESSAGE_TYPES.SCENE_SAVE_EDITS + ' received', info)
            updateSceneEdits(info)
        })
}

export function addSceneStateListeners(room:any){
    room.state.scenes.onAdd(async(scene:any, key:string)=>{
        log('Room Scene Added', key, scene)
        await loadScene(scene)

        sceneListeners(scene,key)
        assetListener(scene)
    })

    room.state.scenes.onRemove((scene:any, key:string)=>{
        log('removing scene from state', key, scene)
        if(scene.o === localUserId){
            showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"You deleted scene " + scene.n, animate:{enabled:true, return:true, time:5}})
        }else{
            showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"" + scene.ona + " just deleted their scene " + scene.n, animate:{enabled:true, return:true, time:5}})
        }
        unloadScene(key)
    })

    room.state.players.onAdd((player:any, key:string)=>{
        log('player is', player)
        player.listen("selectedAsset", (current:any, previous:any)=>{
            log('player selected asset', previous, current)
            if(player.address !== localUserId){
                if(current === null){
                    otherUserRemovedSeletedItem(player.address)
                }else{
                    current.user = player.address
                    otherUserSelectedItem(current, true)
                }
            }
        })
    })
}