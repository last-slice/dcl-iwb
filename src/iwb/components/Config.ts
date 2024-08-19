import { getRealm } from "~system/Runtime"
import { colyseusRoom } from "./Colyseus"
import { localPlayer, localUserId, settings } from "./Player"
import { COMPONENT_TYPES, SCENE_MODES, VIEW_MODES } from "../helpers/types"
import { AvatarModifierArea, AvatarModifierType, Entity, GltfContainer, Material, MeshRenderer, Transform, engine } from "@dcl/sdk/ecs"
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math"
import { utils } from "../helpers/libraries"
import { resetEntityForBuildMode, addAllBuildModePointers } from "../modes/Build"
import { BuildModeVisibilty, ParcelFloor, redBeam, greenBeam } from "../modes/Create"
import { addInputSystem, removeInputSystem } from "../systems/InputSystem"
import { hideAllPanels } from "../ui/ui"
import { updatePlayModeReset } from "../modes/Play"
import { getEntity } from "./IWB"
import { removePlayModSystem, addPlayModeSystem } from "../systems/PlayModeSystem"
import { disableEntityForPlayMode } from "../modes/Play"
import { displayHover } from "../ui/Objects/ContextMenu"
import { clearShowTexts } from "../ui/Objects/ShowText"
import { updateIWBTable } from "../ui/Reuse/IWBTable"
import { getWorldPermissions } from "../ui/Objects/IWBViews/InfoView"
import { addPlayTriggerSystem, removePlayTriggerSystem } from "./Triggers"
import { stopAllIntervals } from "./Timer"
import { displayLiveControl } from "../ui/Objects/LiveShowPanel"
import { displayGrabContextMenu } from "../ui/Objects/GrabContextMenu"
import { resetDialog, showDialogPanel } from "../ui/Objects/DialogPanel"
import { disableGameAsset, killAllGameplay, updatePendingGameCleanup } from "./Game"
import { handleUnlockPlayer } from "./Actions"
import { displaySkinnyVerticalPanel } from "../ui/Reuse/SkinnyVerticalPanel"

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
export let sceneCount: number = 0
export let scenesLoadedCount: number = 0
export let emptyParcels:any[] = []

export let hideOthersEntity:Entity

export let localConfig:any = {
    parcels:[],
    base:"",
    id:""
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
    // Transform.create(hideOthersEntity, {position:Vector3.create(0,0,0)})
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

    let realmData = await getRealm({})
    console.log('realm data is', realmData)
    // realm = realmData.realmInfo ? 
    //     realmData.realmInfo.realmName === "LocalPreview" ? 
    //     "dclbuilder.dcl.eth" : 
    //     realmData.realmInfo.realmName : 
    //     ""

    if(getURLParameter(url, "realm") === "main"){
        island = getURLParameter(url, "island")
    }
}

export function setConfig(version:any, updates:any, videos:any, tutorialCID:any){
    iwbConfig.v = version
    iwbConfig.updates = updates
    iwbConfig.tutorials = videos
    iwbConfig.CID = tutorialCID

    console.log('tutorials are', iwbConfig.tutorials)
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

    for (const [entity] of engine.getEntitiesWith(BuildModeVisibilty)) {
        if(playerMode === SCENE_MODES.CREATE_SCENE_MODE){
            if(ParcelFloor.has(entity)){
                Material.setPbrMaterial(entity, {
                    albedoColor: Color4.Red()
                })
            }else{
                GltfContainer.createOrReplace(entity, {src: redBeam})
            }
        }else{
            if(ParcelFloor.has(entity)){
                Material.setPbrMaterial(entity, {
                    albedoColor: Color4.create(0, 1, 0, .5)
                })
            }else{
                GltfContainer.createOrReplace(entity, {src: greenBeam})
            }
        }
    }

    // hideAllOtherPointers()
    hideAllPanels()

    if(playerMode === SCENE_MODES.BUILD_MODE){
        settings.triggerDebug ? utils.triggers.enableDebugDraw(true) :null 
        stopAllIntervals(true)
        resetDialog()
        showDialogPanel(false)
        clearShowTexts()
        removePlayModSystem()
        addInputSystem()
        updatePlayModeReset(false)
        removePlayTriggerSystem()
        displayLiveControl(false)
        displaySkinnyVerticalPanel(false)
        await killAllGameplay()
        handleUnlockPlayer(null, null, null)
    }else if(playerMode === SCENE_MODES.PLAYMODE){
        // utils.triggers.enableDebugDraw(false)//
        hideAllPanels()
        displayHover(false)
        removeInputSystem()
        addPlayModeSystem()
        addPlayTriggerSystem()
        handleUnlockPlayer(null, null, null)
    }else{
        await killAllGameplay()
        utils.triggers.enableDebugDraw(false)
        removeInputSystem()
        removePlayModSystem()
    }

    colyseusRoom.state.scenes.forEach((scene:any)=>{
        scene[COMPONENT_TYPES.PARENTING_COMPONENT].forEach(async (item:any, i:number)=>{
            if(i > 2){
                let entityInfo = getEntity(scene, item.aid)
                if(entityInfo){
                    if(mode === SCENE_MODES.BUILD_MODE){
                        // if(isLevelAsset(scene, item.aid) || isGameAsset(scene, item.aid)){
                        //     await createAsset(scene, scene[COMPONENT_TYPES.IWB_COMPONENT].get(item.aid))
                        // }
                        resetEntityForBuildMode(scene, entityInfo)
                    }else{
                        // if(isLevelAsset(scene, item.aid) || isGameAsset(scene, item.aid)){
                        //     engine.removeEntity(entityInfo.entity)
                        // }
                        // else{
                        //     disableEntityForPlayMode(scene, entityInfo)
                        // }
                        disableEntityForPlayMode(scene, entityInfo)
                        disableGameAsset(scene, entityInfo)
                    }
                }
            }
        })
    })

    if(mode === SCENE_MODES.BUILD_MODE){
        addAllBuildModePointers()
    }

    updatePendingGameCleanup(false)
    updatePlayModeReset(true)
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
        console.log('user index is', userIndex)
        if(userIndex >= 0){
            world.bps.splice(userIndex, 1)
        }
        updateIWBTable(getWorldPermissions())
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
    return island !== "world"
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