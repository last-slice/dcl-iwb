import {getPlayer} from "@dcl/sdk/players";
import {NOTIFICATION_TYPES, Player, PLAYER_GAME_STATUSES, SCENE_MODES, SERVER_MESSAGE_TYPES, VIEW_MODES} from "../helpers/types";
// import {iwbEvents, sendServerMessage} from "../messaging";
import {AvatarAnchorPointType, AvatarAttach, CameraModeArea, ColliderLayer, engine, Entity, InputAction, Material, MeshCollider, MeshRenderer, pointerEventsSystem, Transform, VideoPlayer} from "@dcl/sdk/ecs";
import resources, { colors } from "../helpers/resources";
import {Color3, Color4, Quaternion, Vector3} from "@dcl/sdk/math";
import { colyseusRoom, sendServerMessage } from "./Colyseus";
import { eth, utils } from "../helpers/libraries";
import { isGCScene, iwbConfig, realm, removePlayerFromHideArray, setPlayerMode, worlds } from "./Config";
import { getAssetUploadToken, log } from "../helpers/functions";
import { otherUserRemovedSeletedItem, otherUserSelectedItem } from "../modes/Build";
import { BuildModeVisibiltyComponents } from "../systems/BuildModeVisibilitySystem";
import { FlyModeSystem } from "../systems/FlyModeSystem";
import { createInputListeners } from "../systems/InputSystem";
import { SelectedItemSystem } from "../systems/SelectedItemSystem";
import { changeRealm, movePlayerTo } from "~system/RestrictedActions";
import { displaySkinnyVerticalPanel } from "../ui/Reuse/SkinnyVerticalPanel";
import { displayMainView, updateMainView } from "../ui/Objects/IWBView";
import { showTutorials, updateInfoView } from "../ui/Objects/IWBViews/InfoView";
import { setUIClicked } from "../ui/ui";
import { addScene, pendingSceneLoad } from "./Scene";
import { showNotification } from "../ui/Objects/NotificationPanel";
import { displayTutorialVideoButton } from "../ui/Objects/TutorialVideo";
import { AudioFinishedSystem, createSounds } from "./Sounds";
import { createCannonBody, createPhysics } from "../physics";
import { LAYER_1, LAYER_8, NO_LAYERS } from "@dcl-sdk/utils";
import { initQuestClients } from "./Quests";
import { addTestVehicle } from "./Vehicle";
// import VLM from "vlm-dcl";//
import CANNON, { Vec3 } from "cannon"
import { cannonMaterials } from "./Physics";
import { showBannedScreen } from "../ui/Objects/BannedScreen";

export let localUserId: string
export let localPlayer:any
export let tutorialVideo:Entity
export let settings:any = {
    triggerDebug: false,
    sceneCheck:false,
    loadRadius:10
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

    createSounds()
    createInputListeners()
    // engine.addSystem(BuildModeVisibiltyComponents)
    engine.addSystem(FlyModeSystem)
    engine.addSystem(SelectedItemSystem)
    // engine.addSystem(AudioFinishedSystem)
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
    await createPhysics()

    await setPlayerDefaults(player)

    player.cameraParent = engine.addEntity()
    Transform.createOrReplace( player.cameraParent, {position: Vector3.create(0, 0, 6), parent: engine.CameraEntity})

    await setLocalPlayer(player)
    await getPlayerNames(player)
    await getPlayerLand()
    await checkPlayerHomeWorld(player)
    await checkWorldPermissions()
   
    await addPlayerTrigger()
    await initQuestClients()

    // addTestVehicle()
    
    engine.addSystem(PendingSceneLoadSystem)
    getAssetUploadToken()


    if ((localPlayer!.homeWorld || localPlayer.worldPermissions) && !isGCScene()) {
        let config = localPlayer!.worlds.find((w:any) => w.ens === realm)
        if (config) {
            if (config.v < iwbConfig.v) {
                showNotification({
                    type: NOTIFICATION_TYPES.MESSAGE,
                    message: "There's a newer version of the IWB! Visit the Settings panel to view the updates and deploy.",//
                    animate: {enabled: true, time: 10, return: true}
                })
            }
        }
        sendServerMessage(SERVER_MESSAGE_TYPES.GET_QUEST_DEFINITIONS, {})
    }
    // VLM.init({});
}

export function updatePlayerLoadRadius(value:number){
    utils.triggers.setAreas(engine.PlayerEntity,
        [{type:'sphere',
            radius:value
        }]
    )
    sendServerMessage(SERVER_MESSAGE_TYPES.PLAYER_SETTINGS, {action:"update", key:'loadRadius', value:value})
}

function addPlayerTrigger(){
    Transform.createOrReplace(localPlayer.loadRadiusEntity, {parent: engine.PlayerEntity})
    utils.triggers.addTrigger(localPlayer.loadRadiusEntity, LAYER_8, NO_LAYERS,
        [{type:'sphere',
            radius:20
        }],
        ()=>{
        },
        ()=>{
        },
        Color3.create(236/255,209/255,92/255)
      )
}

function checkWorldPermissions(){
    let worldPermissions = worlds.find(($:any)=> $.ens === realm)
    // console.log('worlds to search for permissions', worldPermissions)
    if(worldPermissions && worldPermissions.bps.includes(localUserId)){
        localPlayer.worldPermissions = true
    }
}

function checkPlayerHomeWorld(player:any){
    // if (realm !== "BuilderWorld") {
        player.worlds.forEach(async (world:any) => {
            // console.log('player world', world, realm)
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
    player.loadRadiusEntity = engine.addEntity()
    player.scenes = []
    player.worlds = []
    player.objects = []
    player.uploads = []
    player.worldsAvailable =  []
    player.landsAvailable = []
    player.questData = []
    player.buildingAllowed = false
    player.canBuild = false
    player.homeWorld = false
    player.worldPermissions = false
    player.canTeleport = true
    player.canMap = false
    player.selectedEntity = null
    player.activeSceneId = ""
    player.mode = SCENE_MODES.PLAYMODE
    player.gameStatus = PLAYER_GAME_STATUSES.NONE
    player.questClients = new Map<string, any>()
    player.hasWeaponEquipped = false
    player.inVehicle = false
    player.cannonBody = createCannonBody({
        mass:80,
        material: cannonMaterials.get("player") || new CANNON.Material("player"),
        shape: new CANNON.Sphere(1),  //new CANNON.Box(new CANNON.Vec3(0.35, 0.95, 0.35)),
        position: new CANNON.Vec3(0,0,0),
        quaternion: new CANNON.Quaternion(),
    }, true, 2)

    let playerData = getPlayer()
    player.dclData = playerData
}

export async function getPlayerNames(player:any) {
    try{
        let res = await fetch(resources.endpoints.dclNamesGraph, {
            headers: {"content-type": "application/json"},//
            method: "POST",
            body: JSON.stringify({
                variables: {offset: 0, owner: localUserId},
                query: "query getUserNames($owner: String, $offset: Int) {\n  nfts(first: 1000, skip: $offset, where: {owner: $owner, category: ens}) {\n    ens {\n      subdomain\n    }\n  }\n}\n"
            })
        })
    
        let json = await res.json()
        if (json.data) {
            // console.log('worlds are currenlty', worlds)
            json.data.nfts.forEach((nft: any) => {
                // console.log('nft is', nft.ens.subdomain)
                let world = worlds.find(($:any)=> $.name === nft.ens.subdomain)
                // console.log('world is', world)
                if(world){
                    // console.log('found world config')
                    world.init = true
                    player.worlds.push(world)
                }
                else{
                    // console.log('no world config, add blank to table')
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
        console.log('player worlds are ', player.worlds)
    }
    catch(e){
        console.log('error getting player names', e)   
    }
}

export async function getPlayerLand(){
    try{
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
    catch(e){
        console.log('error getting player land', e)
    }
}


export function removePlayer(userId:string, player:any) {
    /**
     * todo
     * add other garbage collection and entity clean up here
     */
    if (player.mode === SCENE_MODES.CREATE_SCENE_MODE) {
        // deleteCreationEntities(player.userId)//
    }
    removePlayerFromHideArray(userId)
}

export function setPlayMode(userId:string, mode:SCENE_MODES) {
    console.log('setging player mode to', mode)
    let player = colyseusRoom.state.players.get(userId)
    if (player) {
        player.mode = mode
        setPlayerMode(mode)
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
    // refreshVisibleItems()//
}

export let showingTutorial:boolean = false

export function updateShowingTutorial(value:boolean){
    showingTutorial = value
}
export function createTutorialVideo(video:any){
    engine.removeEntity(tutorialVideo)

    displayTutorialVideoButton(true)

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
    console.log('setings are ', sets)
    settings = sets

    if(!settings.hasOwnProperty("sceneCheck")){
        settings.sceneCheck = true
    }

    if(!settings.hasOwnProperty("triggerDebug")){
        settings.triggerDebug = false
    }
   
    
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

export function handleGlobalPlayerAttachitem(player:any){
    console.log('attaching item for player', player.address, player.attachedItem)
}

export function handlePlayerDetachItem(info:any){

}

export function banPlayer(){
    showBannedScreen()

    let parent = engine.addEntity()
    let left = engine.addEntity()
    let right = engine.addEntity()
    let front = engine.addEntity()
    let back = engine.addEntity()
    let floor = engine.addEntity()

    Transform.create(parent, {position: Vector3.create(16 * -21, 150,0)})
    Transform.create(left, {parent:parent, position: Vector3.create(-5,0,0),scale: Vector3.create(30,30,1), rotation:Quaternion.fromEulerDegrees(0,90,0)})
    Transform.create(right, {parent:parent, position: Vector3.create(5,0,0),scale: Vector3.create(30,30,1), rotation:Quaternion.fromEulerDegrees(0,90,0)})
    Transform.create(front, {parent:parent, position: Vector3.create(0,0,5), scale: Vector3.create(30,30,1)})
    Transform.create(back, {parent:parent, position: Vector3.create(0,0,-5), scale: Vector3.create(30,30,1)})
    Transform.create(floor, {parent:parent, position: Vector3.create(0,0,0), scale: Vector3.create(30,30,1), rotation:Quaternion.fromEulerDegrees(90,0,0)})

    MeshCollider.setPlane(left)
    MeshCollider.setPlane(front)
    MeshCollider.setPlane(right)
    MeshCollider.setPlane(back)
    MeshCollider.setPlane(floor)

    movePlayerTo({newRelativePosition:{x:16 * -21, y:200, z:0}})
}