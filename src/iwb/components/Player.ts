import {getPlayer} from "@dcl/sdk/players";
import {Player, SCENE_MODES, SERVER_MESSAGE_TYPES, VIEW_MODES} from "../helpers/types";
// import {iwbEvents, sendServerMessage} from "../messaging";
import {AvatarAnchorPointType, AvatarAttach, ColliderLayer, engine, Entity, InputAction, Material, MeshCollider, MeshRenderer, pointerEventsSystem, Transform, VideoPlayer} from "@dcl/sdk/ecs";
import resources, { colors } from "../helpers/resources";
import {Color4, Quaternion, Vector3} from "@dcl/sdk/math";
import { Room } from "colyseus.js";
import { colyseusRoom, sendServerMessage } from "./Colyseus";
import { utils } from "../helpers/libraries";
import { playerMode, realm, setPlayerMode, worlds } from "./Config";
import { getAssetUploadToken, log } from "../helpers/functions";
import { otherUserRemovedSeletedItem, otherUserSelectedItem } from "../modes/Build";
import { BuildModeVisibiltyComponents } from "../systems/BuildModeVisibilitySystem";
import { FlyModeSystem } from "../systems/FlyModeSystem";
import { createInputListeners } from "../systems/InputSystem";
import { PlayerTrackingSystem } from "../systems/PlayerTrackingSystem";
import { SelectedItemSystem } from "../systems/SelectedItemSystem";
import { changeRealm } from "~system/RestrictedActions";
import { displaySkinnyVerticalPanel } from "../ui/Reuse/SkinnyVerticalPanel";
import { displayMainView, updateMainView } from "../ui/Objects/IWBView";
import { showTutorials, updateInfoView } from "../ui/Objects/IWBViews/InfoView";
import { setUIClicked } from "../ui/ui";
import { addScene, pendingSceneLoad } from "./Scene";

export let localUserId: string
export let localPlayer:any
export let tutorialVideo:Entity
export let settings:any = {
    triggerDebug: false,
    sceneCheck:false
}

export function isLocalPlayer(userId:string){
    return userId === localUserId
}

export function setLocalUserId(userData:any){
    localUserId = userData.userId
    return userData
}

export function setLocalPlayer(player:any){
    localPlayer = player

    createInputListeners()
    engine.addSystem(BuildModeVisibiltyComponents)
    engine.addSystem(PlayerTrackingSystem)
    engine.addSystem(FlyModeSystem)
    engine.addSystem(SelectedItemSystem)
}

export function setPlayerSelectedAsset(player:any, current:any, previous:any){
    console.log('player selected asset', player.address, previous, current)
    if(player.address !== localUserId){
        if(current === null){
            otherUserRemovedSeletedItem(player.address)
        }else{
            current.editor = player.address
            if(current.sceneId){
                let scene = colyseusRoom.state.scenes.get(current.sceneId)
                if(current.grabbed && scene.e && !scene.priv){
                    otherUserSelectedItem(current)
                }
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

export async function createPlayer(player:any){
    await setPlayerDefaults(player)

    player.cameraParent = engine.addEntity()
    Transform.createOrReplace( player.cameraParent, {position: Vector3.create(0, 0, 6), parent: engine.CameraEntity})

    await setLocalPlayer(player)
    await getPlayerNames(player)
    await getPlayerLand()
    await checkPlayerHomeWorld(player)
    engine.addSystem(PendingSceneLoadSystem)
    getAssetUploadToken()//
}

function checkPlayerHomeWorld(player:any){
    // if (realm !== "BuilderWorld") {
        player.worlds.forEach(async (world:any) => {
            console.log('player world', world, realm)
            if ((world.ens === realm)) {
                player!.homeWorld = true
                // await getPlayerLand()
                return
            }
        })
    // }
}

function setPlayerDefaults(player:any){
    player.dclData = null
    player.scenes = []
    player.worlds = []
    player.objects = []
    player.uploads = []
    player.worldsAvailable =  []
    player.landsAvailable = []
    player.buildingAllowed = false
    player.canBuild = false
    player.homeWorld = false
    player.worldPermissions = false
    player.canTeleport = true
    player.selectedEntity = null
    player.activeSceneId = ""
    player.mode = SCENE_MODES.PLAYMODE

    let playerData = getPlayer()
    player.dclData = playerData
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
            console.log('nft is', nft.ens.subdomain)
            let world = worlds.find(($:any)=> $.name === nft.ens.subdomain)
            if(world){
                console.log('found world config')
                world.init = true
                player.worlds.push(world)
            }
            else{
                console.log('no world config, add blank to table')
                player.worlds.push({
                    name: nft.ens.subdomain,
                    owner: localUserId,
                    ens: nft.ens.subdomain + ".dcl.eth",
                    builds: 0,
                    updated: 0,
                    init: false,
                    version: 0
                })
            }
        })
    }

    // console.log('player worlds are ', player.worlds)
}

export async function getPlayerLand(){
    let res = await fetch(resources.endpoints.dclLandGraph, {
        headers: {"content-type": "application/json"},
        method: "POST",
        body: JSON.stringify({
            "operationName": "Land",
            "variables": {
              "address": localUserId,
              "tenantTokenIds": [],
              "lessorTokenIds": []
            },
            "query": "query Land($address: Bytes, $tenantTokenIds: [String!], $lessorTokenIds: [String!]) {\n  tenantParcels: parcels(\n    first: 1000\n    skip: 0\n    where: {tokenId_in: $tenantTokenIds}\n  ) {\n    ...parcelFields\n  }\n  tenantEstates: estates(first: 1000, skip: 0, where: {id_in: $tenantTokenIds}) {\n    ...estateFields\n  }\n  lessorParcels: parcels(\n    first: 1000\n    skip: 0\n    where: {tokenId_in: $lessorTokenIds}\n  ) {\n    ...parcelFields\n  }\n  lessorEstates: estates(first: 1000, skip: 0, where: {id_in: $lessorTokenIds}) {\n    ...estateFields\n  }\n  ownerParcels: parcels(\n    first: 1000\n    skip: 0\n    where: {estate: null, owner: $address}\n  ) {\n    ...parcelFields\n  }\n  ownerEstates: estates(first: 1000, skip: 0, where: {owner: $address}) {\n    ...estateFields\n  }\n  updateOperatorParcels: parcels(\n    first: 1000\n    skip: 0\n    where: {updateOperator: $address}\n  ) {\n    ...parcelFields\n  }\n  updateOperatorEstates: estates(\n    first: 1000\n    skip: 0\n    where: {updateOperator: $address}\n  ) {\n    ...estateFields\n  }\n  ownerAuthorizations: authorizations(\n    first: 1000\n    skip: 0\n    where: {owner: $address, type: \"UpdateManager\"}\n  ) {\n    operator\n    isApproved\n    tokenAddress\n  }\n  operatorAuthorizations: authorizations(\n    first: 1000\n    skip: 0\n    where: {operator: $address, type: \"UpdateManager\"}\n  ) {\n    owner {\n      address\n      parcels(first: 1000, skip: 0, where: {estate: null}) {\n        ...parcelFields\n      }\n      estates(first: 1000) {\n        ...estateFields\n      }\n    }\n    isApproved\n    tokenAddress\n  }\n}\n\nfragment parcelFields on Parcel {\n  x\n  y\n  tokenId\n  owner {\n    address\n  }\n  updateOperator\n  data {\n    name\n    description\n  }\n}\n\nfragment estateFields on Estate {\n  id\n  owner {\n    address\n  }\n  updateOperator\n  size\n  parcels(first: 1000) {\n    x\n    y\n    tokenId\n  }\n  data {\n    name\n    description\n  }\n}\n"
          })
    })

    let json = await res.json()
    // console.log("player lands are ", json)

    let ownedLand:any[] = []
    json.data && json.data.ownerParcels.forEach((parcel:any)=>{
        ownedLand.push({name:parcel.data.name, size:1, type:parcel.type, x:parcel.x, y:parcel.y})
    })

    // console.log('owned land is', ownedLand)

    let deployLand:any[] = []
    json.data && json.data.updateOperatorParcels.forEach((parcel:any)=>{
        if(!ownedLand.find((owned:any)=> owned.x === parcel.x && owned.y === parcel.y)){
            deployLand.push({name:"Operator Land", size:1, type:parcel.type, x:parcel.x, y:parcel.y})
        }
    })

    // console.log('deployed and is', deployLand)

    localPlayer.landsAvailable = ownedLand.concat(deployLand)
    // console.log('land ava', localPlayer.landsAvailable)
}


export function removePlayer(player:any) {
    /**
     * todo
     * add other garbage collection and entity clean up here
     */
    if (player.mode === SCENE_MODES.CREATE_SCENE_MODE) {
        // deleteCreationEntities(player.userId)//
    }
}

export function setPlayMode(userId:string, mode:SCENE_MODES) {
    console.log('setging player mode to', mode)
    let player = colyseusRoom.state.players.get(userId)
    if (player) {
        player.mode = mode
        setPlayerMode(mode)
        // iwbEvents.emit(SERVER_MESSAGE_TYPES.PLAY_MODE_CHANGED, {mode: mode})//
        sendServerMessage(SERVER_MESSAGE_TYPES.PLAY_MODE_CHANGED, {mode: mode})
    }
}

export function worldTravel(world: any) {
    log('traveling to world', world)
    displaySkinnyVerticalPanel(false)
    changeRealm({realm: "https://worlds.dcl-iwb.co/world/" + world.ens})
    sendServerMessage(SERVER_MESSAGE_TYPES.WORLD_TRAVEL, {from: realm, to:world.ens})
}

export function hasBuildPermissions() {
    return localPlayer.canBuild || localPlayer.homeWorld
}

export function addPendingAsset(info:any){
    localPlayer.uploads.push({type:info.ty, name: info.n, status:"READY"})
    // refreshVisibleItems()
}

export let showingTutorial:boolean = false

export function updateShowingTutorial(value:boolean){
    showingTutorial = value
}
export function createTutorialVideo(video:any){
    engine.removeEntity(tutorialVideo)

    tutorialVideo = engine.addEntity()
    MeshRenderer.setPlane(tutorialVideo)
    MeshCollider.setPlane(tutorialVideo, ColliderLayer.CL_POINTER)
    Transform.create(tutorialVideo, {parent:engine.CameraEntity, rotation:Quaternion.fromEulerDegrees(0,0,0), position: Vector3.create(0,0,2), scale:Vector3.create(4.25,2.25,1)})

    try{
        VideoPlayer.createOrReplace(tutorialVideo, {
            src: video.link,
            playing: true,
            volume:.3
        })

        const videoTexture = Material.Texture.Video({ videoPlayerEntity: tutorialVideo })
        Material.setPbrMaterial(tutorialVideo, {
            texture: videoTexture,
            roughness: 1.0,
            specularIntensity: 0,
            metallic: 0,
            emissiveColor:Color4.White(),
            emissiveIntensity:1,
            emissiveTexture:videoTexture
            }
        )
        showingTutorial = true
        setUIClicked(false)
        utils.timers.setTimeout(()=>{
            setUIClicked(false)
        }, 1000)
    }
    catch(e){
        console.log('error playing video', e)
        engine.removeEntity(tutorialVideo)
        // displayTutorialVideoControls(false)
    }
}

export function stopTutorialVideo(){
try{
    VideoPlayer.getMutable(tutorialVideo).playing = false
    engine.removeEntity(tutorialVideo)
    updateShowingTutorial(false)
    displayMainView(true)
    updateMainView("Info")
    updateInfoView("Tutorials")
    showTutorials()
}
catch(e){
    console.log('error stopping video')
}
}

export function setSettings(sets:any){
    settings = sets
    settings.sceneCheck = true
    settings.triggerDebug = false
}

export function PendingSceneLoadSystem(){
    if(pendingSceneLoad.length > 0){
        if(localPlayer && localPlayer.homeWorld !== undefined && localPlayer.worldPermissions !== undefined){
            if(localPlayer.homeWorld || localPlayer.worldPermissions){
                let scene = pendingSceneLoad.shift()
                console.log('load pending scene', scene)
                addScene(scene, true)
            }
        }
    }
}