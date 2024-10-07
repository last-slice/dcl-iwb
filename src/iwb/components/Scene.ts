import {engine, Entity, GltfContainer, Material, MeshCollider, MeshRenderer, Transform, VisibilityComponent} from "@dcl/sdk/ecs"
import { getSceneInformation } from '~system/Runtime'
import {CATALOG_IDS, COMPONENT_TYPES, IWBScene, NOTIFICATION_TYPES, SCENE_MODES, SceneItem, SERVER_MESSAGE_TYPES, Triggers} from "../helpers/types"
import {addBoundariesForParcel, deleteCreationEntities, deleteParcelEntities, SelectedFloor} from "../modes/Create"
import {Color3, Color4, Quaternion, Vector3} from "@dcl/sdk/math"
import { RealmEntityComponent } from "../helpers/Components"
import { getDistance, log } from "../helpers/functions"
import { colyseusRoom, sendServerMessage } from "./Colyseus"
import { gltfListener } from "./Gltf"
import { parentingListener } from "./Parenting"
import { localUserId, localPlayer } from "./Player"
import { transformListener } from "./Transform"
import { getCenterOfParcels } from "../helpers/build"
import { meshListener } from "./Meshes"
import { handleSceneEntitiesOnEnter, handleSceneEntitiesOnLeave, handleSceneEntitiesOnLoad, handleSceneEntitiesOnUnload, } from "../modes/Play"
import { iwbInfoListener } from "./IWB"
import { nameListener } from "./Name"
import { textShapeListener } from "./TextShape"
import { visibilityListener } from "./Visibility"
import { nftShapeListener } from "./NftShape"
import { videoListener } from "./Videos"
import { textureListener } from "./Textures"
import { counterListener } from "./Counter"
import { actionListener } from "./Actions"
import { runGlobalTrigger, triggerListener } from "./Triggers"
import { pointerListener } from "./Pointers"
import { stateListener } from "./States"
import { isGCScene, realm, worlds } from "./Config"
import { soundsListener } from "./Sounds"
import { uiTextListener } from "./UIText"
import { billboardListener } from "./Billboard"
import { levelListener } from "./Level"
import { materialListener } from "./Materials"
import { gameListener } from "./Game"
import { refreshMap } from "../ui/Objects/Map"
import { playlistListener } from "./Playlist"
import { PlayerTrackingSystem } from "../systems/PlayerTrackingSystem"
import { avatarShapeListener } from "./AvatarShape"
import { utils } from "../helpers/libraries"
import { LAYER_8, NO_LAYERS } from "@dcl-sdk/utils"
import { mutiplayerListener } from "./Multiplayer"
import { leaderboardListener } from "./Leaderboard"
import { vehicleListener } from "./Vehicle"
import { physicsListener } from "./Physics"
import { questListener } from "./Quests"

export let realmActions: any[] = []

export let buildModeCheckedAssets: any[] = []
export let playModeCheckedAssets: any[] = []
export let pendingSceneLoad:any[] = []
export const afterLoadActions: Function[] = []
export let removedEntities:Map<string, any> = new Map()
export let lastScene: any


export let scenesLoaded: boolean = false
export let sceneCount: number = 0
export let scenesLoadedCount: number = 0
export let emptyParcels:any[] = []

export let sceneAttachedParents:any[] = []

export function isPrivateScene(scene:any){
    return scene.priv
}

export async function addScene(scene:any, loadPending?:boolean){
    scene.checkedEntered = false
    scene.checkedLeave = false
    scene.checkedLoaded = false
    scene.checkedUnloaded = false
    scene.loaded = false
    
    if(scene.e){
        if(isPrivateScene(scene) && loadPending === undefined){
            pendingSceneLoad.push(scene)
            scenesLoadedCount++
            checkAllScenesLoaded()
        }
        else{
            if(!isGCScene()){
                deleteCreationEntities(localUserId)
                await removeEmptyParcels(scene.pcls)
                refreshMap()
            }
            await loadScene(scene)
            scenesLoadedCount++
            checkAllScenesLoaded()
        }
    }else{
        scenesLoadedCount++
        checkAllScenesLoaded()
    }
}

export function enablePrivateModeForScene(scene:any){
    scene[COMPONENT_TYPES.PARENTING_COMPONENT].forEach((item:any, i:number)=>{
        if(i > 2){
            engine.removeEntity(item.entity)
        }
    })
}

export async function loadScene(scene:any) {
    await loadSceneBoundaries(scene)
    loadSceneComponents(scene)

    if (scene.bps.includes(localUserId)) {
        console.log('local player can build')
        localPlayer.canBuild = true
    }
}

async function loadSceneComponents(scene:any){
    scene.components = []

    await levelListener(scene)
    await iwbInfoListener(scene)
    await parentingListener(scene)
    
    await gltfListener(scene)
    await visibilityListener(scene)
    await transformListener(scene)
    await meshListener(scene)
    await nameListener(scene)
    await soundsListener(scene)
    await textShapeListener(scene)
    await nftShapeListener(scene)
    await videoListener(scene)
    await textureListener(scene)
    await counterListener(scene)
    await actionListener(scene)
    await triggerListener(scene)
    await pointerListener(scene)
    await stateListener(scene)
    await uiTextListener(scene)
    await billboardListener(scene)
    await materialListener(scene)
    await gameListener(scene)
    await playlistListener(scene)
    await avatarShapeListener(scene)
    await mutiplayerListener(scene)
    await leaderboardListener(scene)
    await vehicleListener(scene)
    await physicsListener(scene)
    await questListener(scene)
    
    scene.loaded = true
    console.log('scene loaded', scene.id)

    await handleSceneEntitiesOnLeave(scene.id)
    await handleSceneEntitiesOnUnload(scene.id)
}

export function unloadScene(scene:any) {
    engine.removeEntityWithChildren(scene.parentEntity)

    scene.pcls.forEach((parcel: string) => {
        deleteParcelEntities(parcel)
    })

    addBlankParcels(scene.pcls)
}

async function loadSceneBoundaries(scene:any) {
    console.log('loading scene boundaries', scene)
    scene.entities = []

    // scene.pcls.forEach((parcel: string) => {
    //     addBoundariesForParcel(parcel, true, scene.n === "Realm Lobby", true)
    // })

    // create parent entity for scene
    const [x1, y1] = scene.bpcl.split(",")
    let x = parseInt(x1)
    let y = parseInt(y1)

    const sceneParent = engine.addEntity()
    Transform.createOrReplace(sceneParent, {
        position: isGCScene() ? Vector3.Zero() : Vector3.create(x * 16, 0, y * 16),
        // rotation: Quaternion.fromEulerDegrees(0,scene.direction, 0)
    })

    console.log('scene.offsets is', scene.offsets)
    // let xOffset = scene.offsets[0]
    // if(xOffset !== 0){
    //     console.log("scene has offset", scene.offsets)
    // }

    // let transform = Transform.getMutable(sceneParent).position
    // transform.x = scene.offsets[0]
    // transform.z = scene.offsets[1]

    // console.log('scene parent is', Transform.get(sceneParent))

    scene.parentEntity = sceneParent

    // change floor color
    for (const [entity] of engine.getEntitiesWith(Material, SelectedFloor)) {
        Material.setPbrMaterial(entity, {
            albedoColor: Color4.create(.2, .9, .1, 1)
        })
    }
    // loadSceneAssets(id)
}

async function addSceneLoadTrigger(scene:any){
    const center = getCenterOfParcels(scene!.pcls)
    const parentT = Transform.get(scene.parentEntity)

    const xPos = center[0] - parentT.position.x
    const yPos = 0
    const zPos = center[1] - parentT.position.z

    let centerPos = Vector3.create(xPos, yPos, zPos)

    let radius = getDistance(centerPos, parentT.position)

    utils.triggers.addTrigger(scene.parentEntity, NO_LAYERS, LAYER_8,
        [{type:'sphere',
            radius:radius,
            position: centerPos,
        }],
        ()=>{
            console.log("player is close by")
            handleSceneEntitiesOnLoad(scene.id)
        },
        ()=>{
            console.log('player no longer close by')
            handleSceneEntitiesOnUnload(scene.id)
        },
        Color3.create(.2, 1, .2)
      )
}

export function loadSceneAsset(sceneId: string, item: SceneItem) {
    // log('loading new scene asset', sceneId, item)
    // let localScene = sceneBuilds.get(sceneId)
    // if (localScene) {
    //     let parent = localScene.parentEntity

    //     let entity = engine.addEntity()
    //     RealmEntityComponent.create(entity)

    //     if (players.get(localUserId)!.mode === SCENE_MODES.BUILD_MODE) {
    //         addBuildModePointers(entity)
    //     }

    //     localScene.entities.push(entity)

    //     let itemConfig = items.get(item.id)
    //     log('loading item config for item', item, itemConfig)

    //     if (itemConfig) {
    //         itemIdsFromEntities.set(entity, item.aid)
    //         entitiesFromItemIds.set(item.aid, entity)

    //         Transform.createOrReplace(entity, {
    //             parent: parent,
    //             position: item.p,
    //             rotation: Quaternion.fromEulerDegrees(item.r.x, item.r.y, item.r.z),
    //             scale: item.s
    //         })

    //         addAssetComponents(localScene, entity, item, itemConfig.ty, itemConfig.n)
    //     }
    //     // localScene.ass.push(item)

    //     let fn = afterLoadActions.pop()
    //     if (fn) fn(sceneId, entity)

    // }//
}

export function deleteAllRealmObjects() {
    for (const [entity] of engine.getEntitiesWith(RealmEntityComponent)) {
        engine.removeEntity(entity)
    }
}

export function checkSceneVisibility(scene: IWBScene, info: any) {
    log('checking visiblity for scene', scene)//
    // if(info.privateChanged){
    //     if(scene.priv){
    //         if(scene.o !== localUserId){
    //             log('scene changed to private for non world owner, need to remove items')
    //             scene.ass.forEach((asset)=>{
    //                 let entity = entitiesFromItemIds.get(asset.aid)
    //                 if(entity){
    //                     engine.removeEntity(entity)
    //                     entitiesFromItemIds.delete(asset.id)
    //                     itemIdsFromEntities.delete(entity)
    //                 }

    //             })
    //         }else{
    //             log('scene changed to private mode and is world owner, do nothing')
    //         }
    //     }
    // }

    if (info.enabledChanged) {

    }

}

export function updateSceneEdits(info: any) {
    console.log('updating scene edits', info)
    let scene: IWBScene = colyseusRoom.state.scenes.get(info.sceneId ? info.sceneId : "")
    if (scene) {
        checkSceneVisibility(scene, info)
    }
}

export function updateAsset(asset: any) {
    // //check if NFT component was updated
    // if (asset.type === "2D" && asset.nftComp) {
    //     log('we just updated nftasset')
    //     updateNFTFrame(asset.aid, asset.matComp, asset.nftComp)
    // }
}

// export function isPositionInScene(scene: IWBScene, position: Vector3) {
//
//     // get parcel for position
//     const itemParcelX = Math.floor(position.x / 16).toFixed(0)
//     const itemParcelZ = Math.floor(position.z / 16).toFixed(0)
//
//
//     let inScene = false
//     scene.pcls.forEach((parcel: string) => {
//         if (parcel === position.x + "," + position.z) {
//             inScene = true
//         }
//     })
//     return inScene
// }

export function checkBuildPermissionsForScene(scene: IWBScene) {
    return scene &&  (scene.metadata.o === localUserId || scene.bps.find((permission) => permission === localUserId) || localPlayer.worldPermissions)
}

export async function checkScenePermissions() {
    let canbuild = false
    let activeScene: any
    colyseusRoom.state.scenes.forEach((scene: IWBScene, key: string) => {
        if (scene.pcls.find((parcel) => parcel === localPlayer.currentParcel && (scene.metadata.o === localUserId || scene.bps.find((permission) => permission === localUserId)))) {
            canbuild = true
        }

        let world = worlds.find($=> $.ens === realm)
        if(world){
            if (world.bps.includes(localUserId)){
                canbuild = true
            }
        }

        if (scene.pcls.find((parcel) => parcel === localPlayer.currentParcel)) {
            activeScene = scene
        }
    })

    localPlayer.activeScene = activeScene

    if (canbuild) {
        localPlayer.canBuild = true
    } else {
        localPlayer.canBuild = false
    }

    // console.log('active scene', activeScene)

    if (localPlayer.mode === SCENE_MODES.PLAYMODE) {
        if (activeScene) {
            if (lastScene) {
                if (lastScene !== activeScene.id) {
                    await handleSceneEntitiesOnLeave(lastScene)
                    await handleSceneEntitiesOnEnter(activeScene.id)
                }
            } else {//
                console.log('last scene is undefined, enable current active scene')//
                await handleSceneEntitiesOnEnter(activeScene.id)
            }
        } else {
            await handleSceneEntitiesOnLeave(lastScene)
        }
        lastScene = activeScene ? activeScene.id : undefined
    }
}

export function updateSceneCount(count: number) {
    sceneCount = count
}

export function checkAllScenesLoaded() {
    if (scenesLoadedCount >= sceneCount && !scenesLoaded) {
        scenesLoaded = true
        loadBlankParcels()
        
        colyseusRoom.state.scenes.forEach(async (scene:any) => {
            await addSceneLoadTrigger(scene)
        });

        engine.addSystem(PlayerTrackingSystem)
    }
}

export function findUGCAssetBeforeDeleting(name:string, id:string){
    console.log('finding ugc asset in world before deleting', id)
    // let list:string[] = []

    // colyseusRoom.state.scenes.forEach((scene:IWBScene)=>{
    //     scene.ass.forEach((asset:any)=>{
    //         if(asset.id === id){
    //             list.push(scene.n)//
    //         }
    //     })
    // })

    // if(list.length > 0){
    //     console.log("found custom asset in scene, show popup to delete that first")
    //     displayUGCSceneList(true, list)
    // }else{
    //     showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Deleting your UGC Asset from the IWB Servers\n" + name, animate:{enabled:true, return:true, time:5}})
    //     sendServerMessage(SERVER_MESSAGE_TYPES.DELETE_UGC_ASSET, {id:id})
    // }
}

export function checkSceneCount(count:number){
    if(sceneCount !== 0){
        return
    }
    updateSceneCount(count)
}

async function loadBlankParcels(){
    console.log('loading blank parcels')
    const sceneInfo = await getSceneInformation({})

	if (!sceneInfo) return

	const sceneJson = JSON.parse(sceneInfo.metadataJson)

    let occupiedParcels:any[] = []
    colyseusRoom.state.scenes.forEach((scene:IWBScene)=>{
        scene.pcls.forEach((parcel:string)=>{
            occupiedParcels.push(parcel)
        })
    })
	let sceneParcels = sceneJson.scene.parcels
    let blankParcels = sceneParcels.filter((parcel:string) => 
        !occupiedParcels.some(sceneCoord => sceneCoord === parcel)
    );    

    addBlankParcels(blankParcels)
}

export function addBlankParcels(parcels:string[]){
    parcels.forEach((parcel:string) => {
        let blank = engine.addEntity()
        GltfContainer.create(blank, {src: CATALOG_IDS.BLANK_GRASS})

        const center = getCenterOfParcels([parcel])
        Transform.create(blank, {position: Vector3.create(center[0], 0, center[1])})
        emptyParcels.push({parcel:parcel, entity:blank})
    });
}

export async function removeEmptyParcels(parcels:string[]){
    parcels.forEach((parcel:string)=>{
        let index = emptyParcels.findIndex((p:any) => p.parcel === parcel)
        if(index >=0){
            engine.removeEntity(emptyParcels[index].entity)
            emptyParcels.splice(index,1)
        }
    })
}

export function updateSceneParentRotation(scene:any, degrees:number){
    let transform = Transform.getMutableOrNull(scene.parentEntity)
    if(!transform){
        return
    }

    let rotation = Quaternion.toEulerAngles(transform.rotation)
    rotation.y += degrees

    transform.rotation = Quaternion.fromEulerDegrees(rotation.x, rotation.y, rotation.z)

}