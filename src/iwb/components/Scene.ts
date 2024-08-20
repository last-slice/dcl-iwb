import {engine, Entity, GltfContainer, Material, MeshCollider, MeshRenderer, Transform, VisibilityComponent} from "@dcl/sdk/ecs"
import { getSceneInformation } from '~system/Runtime'
import {CATALOG_IDS, COMPONENT_TYPES, IWBScene, NOTIFICATION_TYPES, SCENE_MODES, SceneItem, SERVER_MESSAGE_TYPES} from "../helpers/types"
import {addBoundariesForParcel, deleteCreationEntities, deleteParcelEntities, SelectedFloor} from "../modes/Create"
import {Color4, Quaternion, Vector3} from "@dcl/sdk/math"
import { RealmEntityComponent, PointersLoadedComponent } from "../helpers/Components"
import { log } from "../helpers/functions"
import { colyseusRoom, sendServerMessage } from "./Colyseus"
import { gltfListener } from "./Gltf"
import { parentingListener } from "./Parenting"
import { localUserId, localPlayer } from "./Player"
import { transformListener } from "./Transform"
import { getCenterOfParcels } from "../helpers/build"
import { meshListener } from "./Meshes"
import { disableSceneEntities, enableSceneEntities, updateDisabledEntities } from "../modes/Play"
import { playModeReset } from "../modes/Play"
import { iwbInfoListener } from "./IWB"
import { nameListener } from "./Name"
import { textShapeListener } from "./TextShape"
import { visibilityListener } from "./Visibility"
import { nftShapeListener } from "./NftShape"
import { videoListener } from "./Videos"
import { textureListener } from "./Textures"
import { counterListener } from "./Counter"
import { actionListener } from "./Actions"
import { triggerListener } from "./Triggers"
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


export function isPrivateScene(scene:any){
    return scene.priv
}

export async function addScene(scene:any, loadPending?:boolean){
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
            updateDisabledEntities(true)
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
    
    scene.loaded = true
    console.log('scene loaded', scene.id)
    await disableSceneEntities(scene.id)

    //todo
    //we might not need these since these are only metadata changes and can be pulled auto from colyseus room state
    // await addIWBComponent(scene)
    // await addIWBCatalogComponent(scene)
    // await addNameComponent(scene)
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

    // create parent entity for scene//
    const [x1, y1] = scene.bpcl.split(",")
    let x = parseInt(x1)
    let y = parseInt(y1)

    const sceneParent = engine.addEntity()
    Transform.createOrReplace(sceneParent, {
        position: isGCScene() ? Vector3.Zero() : Vector3.create(x * 16, 0, y * 16),
        rotation: Quaternion.fromEulerDegrees(0,scene.direction, 0)
    })

    console.log('scene parent is', Transform.get(sceneParent))

    scene.parentEntity = sceneParent

    // change floor color
    for (const [entity] of engine.getEntitiesWith(Material, SelectedFloor)) {
        Material.setPbrMaterial(entity, {
            albedoColor: Color4.create(.2, .9, .1, 1)
        })
    }
    // loadSceneAssets(id)
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
    return scene &&  (scene.o === localUserId || scene.bps.find((permission) => permission === localUserId) || localPlayer.worldPermissions)
}

export async function checkScenePermissions() {
    let canbuild = false
    let activeScene: any
    colyseusRoom.state.scenes.forEach((scene: IWBScene, key: string) => {
        if (scene.pcls.find((parcel) => parcel === localPlayer.currentParcel && (scene.o === localUserId || scene.bps.find((permission) => permission === localUserId)))) {
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
            // console.log('active scene is', activeScene)
        }
    })

    localPlayer.activeScene = activeScene

    if (canbuild) {
        localPlayer.canBuild = true
    } else {
        localPlayer.canBuild = false
        // player.activeScene = null
        // displaySceneAssetInfoPanel(false)
    }

    // console.log('active scene', activeScene)

    if (localPlayer.mode === SCENE_MODES.BUILD_MODE) {
        playModeCheckedAssets.length = 0
    } else {
        if (playModeReset) {
            if (activeScene) {
                // console.log('active scene is', activeScene)//
                if (lastScene) {
                    if (lastScene !== activeScene.id) {
                        await disableSceneEntities(lastScene)

                        //let triggerEvents = getTriggerEvents(entityInfo.entity)
                        //triggerEvents.emit(Triggers.ON_LEAVE_SCENE, {input:0, pointer:0, entity:entityInfo.entity})
                        
                        await enableSceneEntities(activeScene.id)
                    }
                } else {//
                    console.log('last scene is undefined, enable current active scene')//
                    await enableSceneEntities(activeScene.id)
                }
            } else {
                disableSceneEntities(lastScene)
            }
            lastScene = activeScene ? activeScene.id : undefined
        }
    }
}

export function updateSceneCount(count: number) {
    sceneCount = count
}

export function checkAllScenesLoaded() {
    if (scenesLoadedCount >= sceneCount && !scenesLoaded) {
        scenesLoaded = true
        loadBlankParcels()
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

    sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_SAVE_EDITS,
        {
            sceneId: scene!.id,
            name: scene!.n,
            desc: scene!.d,
            image: scene!.im,
            enabled: scene!.e,
            priv: scene!.priv,
            lim: scene!.lim,
            direction: degrees
        })
}