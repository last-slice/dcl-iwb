import {getPlayer} from "@dcl/sdk/players";
import {Player, SCENE_MODES, SERVER_MESSAGE_TYPES, VIEW_MODES} from "../helpers/types";
// import {iwbEvents, sendServerMessage} from "../messaging";
import {AvatarAnchorPointType, AvatarAttach, engine, Entity, Material, MeshRenderer, Transform, VideoPlayer} from "@dcl/sdk/ecs";
import resources from "../helpers/resources";
import {Color4, Vector3} from "@dcl/sdk/math";
import { Room } from "colyseus.js";
import { colyseusRoom } from "./Colyseus";
import { utils } from "../helpers/libraries";
import { realm } from "./Config";
import { log } from "../helpers/functions";
import { otherUserRemovedSeletedItem, otherUserSelectedItem } from "../modes/Build";

export let localUserId: string
export let localPlayer:any
export let tutorialVideo:Entity
export let settings:any

export function setLocalPlayer(player:any){
    localPlayer = player
}

export function setPlayerSelectedAsset(player:any, current:any, previous:any){
    log('player selected asset', previous, current)
    if(player.address !== localUserId){
        if(current === null){
            otherUserRemovedSeletedItem(player.address)
        }else{
            current.user = player.address
            if(current.grabbed){
                otherUserSelectedItem(current)
            }
        }
    }
}

export function setPlayerVersion(version:any){
    let player = colyseusRoom.state.players.get(localUserId)
    if(player){
        player.version = version
    }
}

export async function createPlayer(userId:string, player:any){
    await setPlayerDefaults(player)

    if(userId == localUserId){
        player.cameraParent = engine.addEntity()
        Transform.createOrReplace( player.cameraParent, {position: Vector3.create(0, 0, 6), parent: engine.CameraEntity})
    
        await getPlayerNames(player)
        await checkPlayerHomeWorld(player)
    }else{
        player.parentEntity = engine.addEntity()
        AvatarAttach.create(player.parentEntity,{
            avatarId:userId,
            anchorPointId:AvatarAnchorPointType.AAPT_SPINE
        })
    }
}

function checkPlayerHomeWorld(player:any){
    if (realm !== "BuilderWorld") {
        player.worlds.forEach(async (world:any) => {
            if ((world.ens === realm)) {
                player!.homeWorld = true
                // await getPlayerLand()
                return
            }
        })
    }
}

function setPlayerDefaults(player:any){
    player.dclData = null
    player.viewMode = VIEW_MODES.AVATAR
    player.scenes = []
    player.worlds = []
    player.objects = []
    player.uploads = []
    player.worldsAvailable =  []
    player.landsAvailable = []
    player.buildingAllowed = false
    player.canBuild = false
    player.homeWorld = true
    player.selectedEntity = null
    player.activeSceneId = ""
}

export async function getPlayerNames(player:any) {
    let res = await fetch(resources.endpoints.dclNamesGraph, {
        headers: {"content-type": "application/json"},
        method: "POST",
        body: JSON.stringify({
            variables: {offset: 0, owner: localUserId},
            query: "query getUserNames($owner: String, $offset: Int) {\n  nfts(first: 1000, skip: $offset, where: {owner: $owner, category: ens}) {\n    ens {\n      subdomain\n    }\n  }\n}\n"
        })
    })

    let json = await res.json()
    if (json.data) {
        json.data.nfts.forEach((nft: any) => {
            player.worlds.push({
                name: nft.ens.subdomain,
                owner: localUserId,
                ens: nft.ens.subdomain + ".dcl.eth",
                builds: 0,
                updated: 0,
                init: false,
                version: 0
            })
        })
    }

    // console.log('player worlds are ', player.worlds)
}

// export async function getPlayerLand(){
//     let res = await fetch(resources.endpoints.dclLandGraph, {
//         headers: {"content-type": "application/json"},
//         method: "POST",
//         body: JSON.stringify({
//             "operationName": "Land",
//             "variables": {
//               "address": "0xaabe0ecfaf9e028d63cf7ea7e772cf52d662691a",
//               "tenantTokenIds": [],
//               "lessorTokenIds": []
//             },
//             "query": "query Land($address: Bytes, $tenantTokenIds: [String!], $lessorTokenIds: [String!]) {\n  tenantParcels: parcels(\n    first: 1000\n    skip: 0\n    where: {tokenId_in: $tenantTokenIds}\n  ) {\n    ...parcelFields\n  }\n  tenantEstates: estates(first: 1000, skip: 0, where: {id_in: $tenantTokenIds}) {\n    ...estateFields\n  }\n  lessorParcels: parcels(\n    first: 1000\n    skip: 0\n    where: {tokenId_in: $lessorTokenIds}\n  ) {\n    ...parcelFields\n  }\n  lessorEstates: estates(first: 1000, skip: 0, where: {id_in: $lessorTokenIds}) {\n    ...estateFields\n  }\n  ownerParcels: parcels(\n    first: 1000\n    skip: 0\n    where: {estate: null, owner: $address}\n  ) {\n    ...parcelFields\n  }\n  ownerEstates: estates(first: 1000, skip: 0, where: {owner: $address}) {\n    ...estateFields\n  }\n  updateOperatorParcels: parcels(\n    first: 1000\n    skip: 0\n    where: {updateOperator: $address}\n  ) {\n    ...parcelFields\n  }\n  updateOperatorEstates: estates(\n    first: 1000\n    skip: 0\n    where: {updateOperator: $address}\n  ) {\n    ...estateFields\n  }\n  ownerAuthorizations: authorizations(\n    first: 1000\n    skip: 0\n    where: {owner: $address, type: \"UpdateManager\"}\n  ) {\n    operator\n    isApproved\n    tokenAddress\n  }\n  operatorAuthorizations: authorizations(\n    first: 1000\n    skip: 0\n    where: {operator: $address, type: \"UpdateManager\"}\n  ) {\n    owner {\n      address\n      parcels(first: 1000, skip: 0, where: {estate: null}) {\n        ...parcelFields\n      }\n      estates(first: 1000) {\n        ...estateFields\n      }\n    }\n    isApproved\n    tokenAddress\n  }\n}\n\nfragment parcelFields on Parcel {\n  x\n  y\n  tokenId\n  owner {\n    address\n  }\n  updateOperator\n  data {\n    name\n    description\n  }\n}\n\nfragment estateFields on Estate {\n  id\n  owner {\n    address\n  }\n  updateOperator\n  size\n  parcels(first: 1000) {\n    x\n    y\n    tokenId\n  }\n  data {\n    name\n    description\n  }\n}\n"
//           })
//     })

//     let json = await res.json()
//     console.log("player lands are ", json)

//     let ownedLand:any[] = []
//     json.data.ownerParcels.forEach((parcel:any)=>{
//         ownedLand.push({name:parcel.data.name.substring(0,12), size:1, type:"own", x:parcel.x, y:parcel.y})
//     })

//     let deployLand:any[] = []
//     json.data.updateOperatorParcels.forEach((parcel:any)=>{
//         if(!ownedLand.find((land:any)=> land.x === parcel.x && land.y === parcel.y)){
//             deployLand.push({name:"Operator Land", size:1, type:"deploy", x:parcel.x, y:parcel.y})
//         }
//     })

//     localPlayer.landsAvailable = ownedLand.concat(deployLand)
//     console.log('land ava', localPlayer.landsAvailable)
// }


// export function removePlayer(user: string) {
//     /**
//      * todo
//      * add other garbage collection and entity clean up here
//      */

//     let player = players.get(user)
//     if (player) {

//         /**
//          * maybe move to its own file and function
//          */
//         if (player.mode === SCENE_MODES.CREATE_SCENE_MODE) {
//             deleteCreationEntities(user)
//         }


//         players.delete(user)
//     }
// }

// export function addPlayerScenes(user: string, scenes: any[]) {
//     let player = players.get(user)
//     if (player) {
//         scenes.forEach((scene) => {
//             player!.scenes.push(scene)
//         })
//     }
// }

// export function setPlayMode(user: string, mode: SCENE_MODES) {
//     let player = players.get(user)
//     if (player) {
//         player.mode = mode
//         iwbEvents.emit(SERVER_MESSAGE_TYPES.PLAY_MODE_CHANGED, {mode: mode})
//         sendServerMessage(SERVER_MESSAGE_TYPES.PLAY_MODE_CHANGED, {mode: mode})
//     }
// }

// export function worldTravel(world: any) {
//     log('traveling to world', world)

//     displaySettingsPanel(false)
//     displayRealmTravelPanel(false, {})
//     changeRealm({realm: "https://worlds.dcl-iwb.co/world/" + world.ens})
//     sendServerMessage(SERVER_MESSAGE_TYPES.WORLD_TRAVEL, {from: realm, to:world.ens})
// }

// export function hasBuildPermissions() {
//     return players.get(localUserId)!.canBuild || players.get(localUserId)!.homeWorld
// }

// export function addPendingAsset(info:any){
//     localPlayer.uploads.push({type:info.ty, name: info.n, status:"READY"})
//     refreshVisibleItems()
// }

// export function createTutorialVideo(video:any){
//     engine.removeEntity(tutorialVideo)
//     tutorialVideo = engine.addEntity()

//     Transform.createOrReplace(tutorialVideo, {parent:engine.PlayerEntity, position:Vector3.create(0, .9, 2), scale: Vector3.create(3.5,2,1)})
//     MeshRenderer.setPlane(tutorialVideo)

//     try{
//         VideoPlayer.createOrReplace(tutorialVideo, {
//             src: video.link,
//             playing: true,
//             volume:.3
//         })
    
//         const videoTexture = Material.Texture.Video({ videoPlayerEntity: tutorialVideo })
//         Material.setPbrMaterial(tutorialVideo, {
//             texture: videoTexture,
//             roughness: 1.0,
//             specularIntensity: 0,
//             metallic: 0,
//             emissiveColor:Color4.White(),
//             emissiveIntensity:1,
//             emissiveTexture:videoTexture
//           })
//     }
//     catch(e){
//         console.log('error playing video', e)
//         engine.removeEntity(tutorialVideo)
//         displayTutorialVideoControls(false)
//     }
// }

// export function stopTutorialVideo(){
//     try{
//         VideoPlayer.getMutable(tutorialVideo).playing = false
//         engine.removeEntity(tutorialVideo)
//     }
//     catch(e){
//         console.log('error stopping video')
//     }
// }

// export function setSettings(sets:any){
//     settings = sets
//     settings.sceneCheck = true
// }