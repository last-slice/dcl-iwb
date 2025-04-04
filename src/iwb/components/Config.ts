import { getRealm } from "~system/Runtime"
import { colyseusRoom, connected, sendServerMessage, setLocalColyseus } from "./Colyseus"
import { localPlayer, localUserId, setPlayMode, settings } from "./Player"
import { COLLIDER_LAYERS, COMPONENT_TYPES, PLAYER_GAME_STATUSES, SCENE_MODES, SERVER_MESSAGE_TYPES, VIEW_MODES } from "../helpers/types"
import { AvatarModifierArea, AvatarModifierType, ColliderLayer, Entity, GltfContainer, Material, MeshRenderer, Transform, engine } from "@dcl/sdk/ecs"
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math"
import { utils } from "../helpers/libraries"
import { resetEntityForBuildMode, addAllBuildModePointers, resetEntitiesForBuildMode } from "../modes/Build"
import { addInputSystem, removeInputSystem } from "../systems/InputSystem"
import { hideAllPanels } from "../ui/ui"
import { getEntity } from "./iwb"
import { removePlayModSystem, addPlayModeSystem } from "../systems/PlayModeSystem"
import { displayHover } from "../ui/Objects/ContextMenu"
import { clearShowTexts } from "../ui/Objects/ShowText"
import { updateIWBTable } from "../ui/Reuse/IWBTable"
import { getWorldBans, getWorldPermissions } from "../ui/Objects/IWBViews/InfoView"
import { addPlayTriggerSystem, removePlayTriggerSystem } from "./Triggers"
import { createTimerSystem, stopAllIntervals } from "./Timer"
// import { displayLiveControl, displayLivePanel } from "../ui/Objects/LiveShowPanel"
import { displayGrabContextMenu } from "../ui/Objects/GrabContextMenu"
import { resetDialog, showDialogPanel } from "../ui/Objects/DialogPanel"
import { disableGameAsset, killAllGameplay, updatePendingGameCleanup } from "./Game"
import { handleRemoveVirtualCamera, handleUnlockPlayer } from "./Actions"
import { displaySkinnyVerticalPanel } from "../ui/Reuse/SkinnyVerticalPanel"
import { stopAllPlaylists } from "./Playlist"
import { handleSceneEntitiesOnLeave, handleSceneEntitiesOnUnload, removeForceCamera, setGlobalEmitter } from "../modes/Play"
import { disableLevelAssets } from "./Level"
import { displayQuestPanel } from "../ui/Objects/QuestPanel"
import { removeLocaPlayerWeapons, unequipUserWeapon } from "./Weapon"
import { removeLoadingScreen } from "../systems/LoadingSystem"
import { iwbScene } from "../scene"
import { checkGLTFComponent } from "./Gltf"
import { findAssetParent } from "./Parenting"
import { closeSceneQuests } from "./Quests"
import { displayPlayerPositionPanel } from "../ui/Objects/PlayerPositionPanel"

export let realm: string = ""
export let island: string = "world"
export let scenes: any[] = []
export let worlds: any[] = []
export let realmActions: any[] = []
export let iwbConfig: any = {}

export let buildModeCheckedAssets: any[] = []
export let playModeCheckedAssets: any[] = []
export let sceneRoofAssets:any[] = []
export let excludeHidingUsers:any[] = []

export let lastScene: any

export let playerMode:SCENE_MODES = SCENE_MODES.PLAYMODE
export let playerViewMode:VIEW_MODES = VIEW_MODES.AVATAR

export let scenesLoaded: boolean = false
export let isClient:boolean = false
export let sceneCount: number = 0
export let scenesLoadedCount: number = 0
export let emptyParcels:any[] = []

export let hideOthersEntity:Entity

export let localConfig:any = {
    parcels:[],
    base:"",
    id:"",
    gcScene:false
}

export function initOfflineScene(){
    console.log('running offline scene')
    setLocalColyseus()
    engine.addSystem(createTimerSystem())
    setPlayerMode(SCENE_MODES.PLAYMODE)
    removeLoadingScreen()
    setGlobalEmitter()
}

export function setHidPlayersArea(){
    excludeHidingUsers.length = 0
    addPlayerToHideArray(localUserId)

    engine.removeEntity(hideOthersEntity)
    // hideOthersEntity = engine.addEntity()

    // AvatarModifierArea.create(hideOthersEntity, {
    //     area: Vector3.create(800,100,800),
    //     modifiers: [AvatarModifierType.AMT_HIDE_AVATARS],
    //     excludeIds: excludeHidingUsers.sort()
    // })
    // Transform.create(hideOthersEntity, {position:Vector3.create(0,0,0)})//
}

export function setExcludePlayersToSoloGame(excluded:string[]){
    excludeHidingUsers = excluded
}

export function addPlayerToHideArray(userId:string){
    console.log('adding player to hide exclude array', userId)
    excludeHidingUsers.find(($:any)=> $ !== userId) ? excludeHidingUsers.push(userId) : null
}

export function removePlayerFromHideArray(userId:string){
    console.log('removing playing from hide exxclue array', userId)
    let playerIndex = excludeHidingUsers.findIndex(($:any)=> $ === userId)
    if(playerIndex >= 0){
        excludeHidingUsers.splice(playerIndex,1)
    }
}

export function setPlayerViewMode(view:VIEW_MODES){
    playerViewMode = view
}

export async function setRealm(sceneJSON:any, url:any){
    realm = sceneJSON.iwb.name

    localConfig.base = sceneJSON.scene.base
    localConfig.parcels = sceneJSON.scene.parcels
    localConfig.id = sceneJSON.iwb.scene
    localConfig.gcScene = sceneJSON.iwb.hasOwnProperty("gcScene") ? sceneJSON.iwb.gcScene : false
    localConfig.online = sceneJSON.iwb.hasOwnProperty("online") ? sceneJSON.iwb.online : false
    localConfig.scene = sceneJSON.iwb.scene
    localConfig.scenePool =  sceneJSON.iwb.hasOwnProperty("scenePool") ? true : false
    localConfig.sceneId = sceneJSON.iwb.sceneId

    let realmData = await getRealm({})
    console.log('realm data is', realmData)
    // realm = realmData.realmInfo ? 
    //     realmData.realmInfo.realmName === "LocalPreview" ? 
    //     "dclbuilder.dcl.eth" : 
    //     realmData.realmInfo.realmName : 
    //     ""

    if(getURLParameter(url, "realm") === ""){
        island = "client"
        isClient = true
    }
    else{
        if(getURLParameter(url, "realm") === "main"){
            island = getURLParameter(url, "island")
        }
    }

    if(localConfig.gcScene){
        island = "gc"
    }

    if(localConfig.scenePool){
        island = localConfig.sceneId + "-" + localConfig.base
    }

    console.log('gc scene is', localConfig.gcScene)
}

export function setConfig(version:any, updates:any, videos:any, tutorialCID:any){
    iwbConfig.v = version
    iwbConfig.updates = updates
    iwbConfig.tutorials = videos
    iwbConfig.CID = tutorialCID

    // console.log('tutorials are', iwbConfig.tutorials)
}

export function setWorlds(config: any) {
    console.log('worlds are ', config)

    for(let i = 0; i < config.length; i++){
        let world = config[i]
        worlds.push({
            name: world.worldName,
            v: world.v,
            owner: world.owner,
            ens: world.ens,
            builds: world.builds,
            updated: world.updated,
            bps:world.bps,
            bans:world.bans,
            init: true,
            backedUp:world.backedUp
        })
    }
}

export function addTutorial(info:any){
    iwbConfig.tutorials.push(info) 
}

export function removeTutorial(info:any){
    iwbConfig.tutorials.splice(info, 1)
}

export function updateTutorialCID(info:any){
    iwbConfig.CID = info
}

export async function setPlayerMode(mode:SCENE_MODES){
    playerMode = mode

    displayGrabContextMenu(false)

    // for (const [entity] of engine.getEntitiesWith(BuildModeVisibilty)) {
    //     if(playerMode === SCENE_MODES.CREATE_SCENE_MODE){
    //         if(ParcelFloor.has(entity)){
    //             Material.setPbrMaterial(entity, {
    //                 albedoColor: Color4.Red()
    //             })
    //         }else{
    //             GltfContainer.createOrReplace(entity, {src: redBeam})
    //         }
    //     }else{
    //         if(ParcelFloor.has(entity)){
    //             Material.setPbrMaterial(entity, {
    //                 albedoColor: Color4.create(0, 1, 0, .5)
    //             })
    //         }else{
    //             GltfContainer.createOrReplace(entity, {src: greenBeam})
    //         }
    //     }
    // }

    // hideAllOtherPointers()
    hideAllPanels()

    if(playerMode === SCENE_MODES.BUILD_MODE){
        displayPlayerPositionPanel(true)
        closeSceneQuests({})
        settings.triggerDebug ? utils.triggers.enableDebugDraw(true) :null 
        stopAllIntervals(true)
        resetDialog()
        showDialogPanel(false)
        clearShowTexts()
        removePlayModSystem()
        addInputSystem()
        removePlayTriggerSystem()
        // displayLiveControl(false)
        // displayLivePanel(false)
        displaySkinnyVerticalPanel(false)
        displayQuestPanel(false)
        removeForceCamera()
        removeLocaPlayerWeapons()

        localPlayer.hasWeaponEquipped = false
        
        if(localPlayer.gameStatus === PLAYER_GAME_STATUSES.PLAYING){
            sendServerMessage(SERVER_MESSAGE_TYPES.END_GAME, {})
            // attemptGameEnd({sceneId: localPlayer.activeScene.id})
        }else{
            resetEntitiesForBuildMode()
    
            // if(localPlayer.activeScene){
            //     await handleSceneEntitiesOnLeave(localPlayer.activeScene.id)
            //     await handleSceneEntitiesOnUnload(localPlayer.activeScene.id)//
            // }
        }

        handleUnlockPlayer(null, null, null)
        stopAllPlaylists(localPlayer.activeScene.id)


    }else if(playerMode === SCENE_MODES.PLAYMODE){
        displayPlayerPositionPanel(false)
        // utils.triggers.enableDebugDraw(false)
        hideAllPanels()
        displayHover(false)
        removeInputSystem()
        handleUnlockPlayer(null, null, null)

        let scenes:any

        if(localConfig.online){
            scenes = colyseusRoom.state.scenes
        }else{
            scenes = [localConfig.scene]
            colyseusRoom.state.scenes[localConfig.scene.id] = localConfig.scene
        }

        handleRemoveVirtualCamera()

        scenes.forEach(async (scene:any)=>{
            scene.checkedLeave = false
            scene.checkedUnloaded = false

            console.log('restting scene to play mode', scene.id)
            await handleSceneEntitiesOnLeave(scene.id)
            await handleSceneEntitiesOnUnload(scene.id)
            await disableLevelAssets(scene)
        })

        // utils.timers.setTimeout(()=>{
            addPlayModeSystem()
            addPlayTriggerSystem()
        
        //     console.log('here in playmode')
        // }, 1000)

    }else{
        await killAllGameplay()
        utils.triggers.enableDebugDraw(false)
        removeInputSystem()
        removePlayModSystem()
    }

    if(mode === SCENE_MODES.BUILD_MODE){
        addAllBuildModePointers()
    }

    updatePendingGameCleanup(false)
}

export function addLocalWorldPermissionsUser(user:string){
    let world = worlds.find($=> $.ens === realm)
    if(world){
        world.bps.push(user)
        updateIWBTable(getWorldPermissions())
    }
}

export function removeLocalWorldPermissionsUser(user:string){
    let world = worlds.find($=> $.ens === realm)
    if(world){
        let userIndex = world.bps.findIndex(($:any) => $ === user)
        if(userIndex >= 0){
            world.bps.splice(userIndex, 1)
        }
        updateIWBTable(getWorldPermissions())
    }
}
export function addLocalWorldBanUser(user:string){
    let world = worlds.find($=> $.ens === realm)
    if(world){
        world.bans.push(user)
        updateIWBTable(getWorldBans())
    }
}

export function removeLocalWorldBanUser(user:string){
    let world = worlds.find($=> $.ens === realm)
    if(world){
        let userIndex = world.bans.findIndex(($:any) => $ === user)
        if(userIndex >= 0){
            world.bans.splice(userIndex, 1)
        }
        updateIWBTable(getWorldBans())
    }
}

function getURLParameter(url: string, urlKey:string) {
    const paramsString = url.split('?')[1];
    if (!paramsString) {
        return "";
    }

    const params = paramsString.split('&');
    for (const param of params) {
        const [key, value] = param.split('=');
        if (key === urlKey) {
            return decodeURIComponent(value);
        }
    }
    return ""
}

export function isGCScene(){
    return localConfig.gcScene
}

export function addSceneRoofs(){
    colyseusRoom.state.scenes.forEach((scene:any)=>{

        // const center = getCenterOfParcels(scene!.pcls)
        // const parentT = Transform.get(scene!.parentEntity)

        scene.pcls.forEach((parcel:any)=>{
            let roof = engine.addEntity()
            sceneRoofAssets.push(roof)
            MeshRenderer.setPlane(roof)

            let xCorner = parseInt(parcel.split(',')[0]) * 16
            let yCorner = parseInt(parcel.split(',')[1]) * 16

            // const xPos = center[0] - parentT.position.x
            const yPos = Math.log2(scene.pcls.length +1) * 20
            // const zPos = center[1] - parentT.position.z
    
            Transform.create(roof, {
                position: Vector3.create(xCorner + 8, yPos, yCorner + 8),
                rotation:Quaternion.fromEulerDegrees(90,0,0), 
                scale: Vector3.create(16,16,1),
                // parent: scene.parentEntity
                }
            )

            Material.setPbrMaterial(roof, {albedoColor: Color4.create(1,0,0,.5)})
        })
    })
}

export function removeSceneRoofs(){
    sceneRoofAssets.forEach((entity)=>{
        engine.removeEntity(entity)
    })
    sceneRoofAssets.length = 0
}


export let initialSceneEntities:Map<string, Entity> = new Map()
export async function showInitialScene(){

    let scene = {...iwbScene}
    const [x1, y1] = scene.bpcl.split(",")
    let x = parseInt(x1)
    let y = parseInt(y1)

    const sceneParent = engine.addEntity()
    Transform.createOrReplace(sceneParent, {
        position: isGCScene() ? Vector3.Zero() : Vector3.create(x * 16, 0, y * 16),
        // rotation: Quaternion.fromEulerDegrees(0,scene.direction, 0)
    })

    initialSceneEntities.set(scene.id, sceneParent)

    for(let aid in scene.Gltf){
        let entity = engine.addEntity()
        initialSceneEntities.set(aid, entity)
    }

    for(let aid in scene.Gltf){
        let gltf = scene.Gltf[aid]

        let entity = initialSceneEntities.get(aid)
        if(entity){
            let transform = scene.Transform[aid]
            GltfContainer.createOrReplace(entity, {
                src:"assets/" + gltf.src + ".glb", 
                visibleMeshesCollisionMask: (gltf.visibleCollision === 3 ? ColliderLayer.CL_PHYSICS | ColliderLayer.CL_POINTER : parseInt(Object.values(COLLIDER_LAYERS).filter(value => typeof value === 'number')[gltf.visibleCollision].toString())), 
                invisibleMeshesCollisionMask: (gltf.invisibleCollision === 3 ? ColliderLayer.CL_PHYSICS | ColliderLayer.CL_POINTER : parseInt(Object.values(COLLIDER_LAYERS).filter(value => typeof value === 'number')[gltf.invisibleCollision].toString()))
            })
            Transform.createOrReplace(entity, 
                {
                    parent:findAssetParent(scene,aid), 
                    position:transform.p, 
                    scale:transform.s, 
                    rotation:Quaternion.fromEulerDegrees(transform.r.x, transform.r.y, transform.r.z)
                })
        
        }
        

    }
}