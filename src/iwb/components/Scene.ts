import {engine, Entity, GltfContainer, Material, MeshCollider, MeshRenderer, Transform, VisibilityComponent} from "@dcl/sdk/ecs"
import { getSceneInformation } from '~system/Runtime'
import {IWBScene, NOTIFICATION_TYPES, SCENE_MODES, SceneItem, SERVER_MESSAGE_TYPES} from "../helpers/types"
import {addBoundariesForParcel, deleteParcelEntities, SelectedFloor} from "../modes/Create"
import {Color4, Quaternion, Vector3} from "@dcl/sdk/math"
import { RealmEntityComponent, PointersLoadedComponent } from "../helpers/Components"
import { log } from "../helpers/functions"
import { colyseusRoom } from "./Colyseus"
import { gltfListener } from "./Gltf"
import { parentingListener } from "./Parenting"
import { localUserId, localPlayer } from "./Player"
import { transformListener } from "./Transform"
import { getCenterOfParcels } from "../helpers/build"
import { meshListener } from "./Meshes"
import { disableSceneEntities, enableSceneEntities } from "../modes/Play"
import { playModeReset } from "../modes/Play"
import { iwbInfoListener } from "./IWB"
import { nameListener } from "./Name"
import { soundsListener } from "./Sounds"
import { textShapeListener } from "./TextShape"
import { visibilityListener } from "./Visibility"
import { nftShapeListener } from "./NftShape"

export let realmActions: any[] = []

export let buildModeCheckedAssets: any[] = []
export let playModeCheckedAssets: any[] = []
export let lastScene: any


export let scenesLoaded: boolean = false
export let sceneCount: number = 0
export let scenesLoadedCount: number = 0
export let emptyParcels:any[] = []
export const afterLoadActions: Function[] = []

export function enablePrivateModeForScene(scene:any){
    scene.parenting.forEach((item:any, i:number)=>{
        if(i > 2){
            console.log('removing real entities', item)
            engine.removeEntity(item.entity)
        }
    })
}

export async function loadScene(scene:any) {
    if (scene.bps.includes(localUserId)) {
        localPlayer.buildingAllowed = true
        localPlayer.canBuild = true
    }

    loadSceneBoundaries(scene)
    loadSceneComponents(scene)

    scenesLoadedCount++
    checkAllScenesLoaded()
}

async function loadSceneComponents(scene:any){
    // await addParenting(scene)
    parentingListener(scene)

    // await addGltfComponent(scene)
    gltfListener(scene)

    // await addVisibilityComponent(scene)
    visibilityListener(scene)

    // await addTransformComponent(scene)
    transformListener(scene)
    meshListener(scene)
    iwbInfoListener(scene)
    nameListener(scene)
    soundsListener(scene)
    textShapeListener(scene)
    nftShapeListener(scene)

    // await addTextShapeComponent(scene)
    

    // await addSoundComponent(scene)

    // await addPointerComponent(scene)

    // await addTriggerComponent(scene)

    // await addActionComponent(scene)

    // await addCounterComponent(scene)
    // counterListener(scene)

    // await addStateComponent(scene)
    // stateListener(scene)

    //todo
    //we might not need these since these are only metadata changes and can be pulled auto from colyseus room state
    // await addIWBComponent(scene)
    // await addIWBCatalogComponent(scene)
    // await addNameComponent(scene)
}

export function unloadScene(sceneId:any) {
    // let localScene = colyseusRoom.state.scenes.get(sceneId)
    // if (localScene) {
    //     engine.removeEntityWithChildren(localScene.parentEntity)
    //     localScene.entities.forEach((entity: Entity) => {
    //         let aid = itemIdsFromEntities.get(entity)
    //         itemIdsFromEntities.delete(entity)
    //         entitiesFromItemIds.delete(aid)
    //     })
    //     localScene.pcls.forEach((parcel: string) => {
    //         deleteParcelEntities(parcel)
    //     })

    //     addBlankParcels(localScene.pcls)
    // }
}

function loadSceneBoundaries(scene:any) {
    scene.entities = []

    scene.pcls.forEach((parcel: string) => {
        addBoundariesForParcel(parcel, true, scene.n === "Realm Lobby", true)
    })

    // create parent entity for scene//
    const [x1, y1] = scene.bpcl.split(",")
    let x = parseInt(x1)
    let y = parseInt(y1)

    const sceneParent = engine.addEntity()
    Transform.createOrReplace(sceneParent, {
        position: Vector3.create(x * 16, 0, y * 16)
    })

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

function addAssetComponents(scene: IWBScene, entity: Entity, item: SceneItem, type: string, name: string) {
    // console.log('adding asset components')

    // createVisibilityComponent(scene, entity, item)
    // PointersLoadedComponent.create(entity, {init: false, sceneId: scene.id})

    // if (item.actComp) {
    //     // let actions = [...item.actComp.actions.values()]
    //     // console.log('item actions area', actions)

    //     item.actComp.actions.forEach((action: any, key: any) => {
    //         realmActions.push({id: key, sceneId: scene.id, action})
    //     })

    // }

    // switch (type) {
    //     case '3D':
    //         createGltfComponent(scene, entity, item)
    //         break;

    //     case '2D':
    //         if (item.colComp.vMask === 1) {
    //             MeshCollider.setPlane(entity)
    //         }

    //         switch (name) {
    //             case 'Image':
    //                 MeshRenderer.setPlane(entity)
    //                 updateImageUrl(item.aid, item.matComp, item.imgComp.url)
    //                 break;

    //             case 'Video':
    //                 MeshRenderer.setPlane(entity)
    //                 createVideoComponent(scene.id, entity, item)
    //                 break;

    //             case 'NFT Frame':
    //                 updateNFTFrame(item.aid, item.matComp, item.nftComp)
    //                 break;

    //             case 'Text':
    //                 updateTextComponent(item.aid, item.matComp, item.textComp)
    //                 break;

    //             case 'Plane':
    //                 updateMaterialComponent(item.aid, item.matComp)
    //                 break;
    //         }
    //         break;

    //     case 'Audio':
    //         createAudioComponent(scene, entity, item)
    //         break;

    //     case 'SM':
    //         createSmartItemComponent(scene, entity, item, name)
    //         break;

    // }
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
    return scene &&  (scene.o === localUserId || scene.bps.find((permission) => permission === localUserId))
}

export async function checkScenePermissions() {
    let canbuild = false
    let activeScene: any
    colyseusRoom.state.scenes.forEach((scene: IWBScene, key: string) => {
        if (scene.pcls.find((parcel) => parcel === localPlayer.currentParcel && (scene.o === localUserId || scene.bps.find((permission) => permission === localUserId)))) {
            canbuild = true
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
        // player.activeScene = null
        // displaySceneAssetInfoPanel(false)
    }

    if (localPlayer.mode === SCENE_MODES.BUILD_MODE) {
        playModeCheckedAssets.length = 0
    } else {

        if (playModeReset) {
            if (activeScene) {
                if (lastScene) {
                    if (lastScene !== activeScene.id) {
                        await disableSceneEntities(lastScene)
                        enableSceneEntities(activeScene.id)
                    }
                } else {
                    enableSceneEntities(activeScene.id)
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
    if (scenesLoadedCount >= sceneCount) {
        scenesLoaded = true
        loadBlankParcels()
    }
}

export function findUGCAssetBeforeDeleting(name:string, id:string){
    console.log('finding ugc asset in world before deleting', id)
    // let list:string[] = []

    // colyseusRoom.state.scenes.forEach((scene:IWBScene)=>{
    //     scene.ass.forEach((asset:any)=>{
    //         if(asset.id === id){
    //             list.push(scene.n)
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

function addBlankParcels(parcels:string[]){
    parcels.forEach((parcel:string) => {
        let blank = engine.addEntity()
        GltfContainer.create(blank, {src: 'assets/a20e1fbd-9d55-4536-8a06-db8173c1325e.glb'})

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