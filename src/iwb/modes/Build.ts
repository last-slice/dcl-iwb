import { AudioSource, AudioStream, AvatarAnchorPointType, AvatarAttach, Billboard, BillboardMode, ColliderLayer, Entity, GltfContainer, InputAction, Material, MeshCollider, MeshRenderer, NftShape, PointerEventType, PointerEvents, RaycastQueryType, TextShape, Transform, Tween, TweenSequence, VideoPlayer, VisibilityComponent, engine, raycastSystem } from "@dcl/sdk/ecs"
import { Actions, COMPONENT_TYPES, EDIT_MODES, EDIT_MODIFIERS, IWBScene, NOTIFICATION_TYPES, SERVER_MESSAGE_TYPES, SOUND_TYPES, SceneItem, SelectedItem } from "../helpers/types"
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math"
import players from "@dcl/sdk/players"
import { items } from "../components/Catalog"
import { localPlayer, localUserId } from "../components/Player"
import { getDistance, getRandomString, log, roundVector } from "../helpers/functions"
import { getWorldPosition, getWorldRotation } from "@dcl-sdk/utils"
import { colyseusRoom, sendServerMessage } from "../components/Colyseus"
import { realm } from "../components/Config"
import { checkBuildPermissionsForScene, afterLoadActions } from "../components/Scene"
import { utils } from "../helpers/libraries"
import { displayCatalogPanel } from "../ui/Objects/CatalogPanel"
import { playSound, setAudioBuildMode } from "../components/Sounds"
import { displayHover, updateContextEvents } from "../ui/Objects/ContextMenu"
import { bbE, findSceneByParcel, getCenterOfParcels, isEntityInScene } from "../helpers/build"
import { isSnapEnabled } from "../systems/SelectedItemSystem"
import { showNotification } from "../ui/Objects/NotificationPanel"
import { displayCatalogInfoPanel } from "../ui/Objects/CatalogInfoPanel"
import { setGLTFCollisionBuildMode } from "../components/Gltf"
import { getEntity } from "../components/IWB"
import { setVisibilityBuildMode } from "../components/Visibility"
import { setVideoBuildMode } from "../components/Videos"
import { hideAllPanels, setUIClicked } from "../ui/ui"
import { findAssetParent, getAssetIdByEntity } from "../components/Parenting"
import { openEditComponent } from "../ui/Objects/EditAssetPanel"
import { setMeshColliderBuildMode, setMeshRenderBuildMode } from "../components/Meshes"
import { setSmartItemBuildMode } from "../components/SmartItems"
import { setAnimationBuildMode } from "../components/Animator"
import { checkTransformComponent } from "../components/Transform"
import { setTextShapeForBuildMode } from "../components/TextShape"
import { disableTriggers } from "../components/Triggers"
import { hideUIText } from "../ui/Objects/Edit/EditUiText"
import { setUiTextBuildMode } from "../components/UIText"
import { setUiImageBuildMode } from "../components/UIImage"
import { hideUIImage } from "../ui/Objects/Edit/EditUIImage"
import { displaySceneAssetInfoPanel, showSceneInfoPanel, updateRows } from "../ui/Objects/SceneInfoPanel"
import { resetCloneEntity } from "../ui/Objects/Edit/ActionPanels/AddClonePanel"
import { resetLevelSpawnEntity } from "../ui/Objects/Edit/EditLevel"
import { resetCurrentBouncerSpawns, resetLiveSpawnEntity } from "../ui/Objects/Edit/EditLive"
import { resetTweenActionPanel } from "../ui/Objects/Edit/ActionPanels/AddTweenPanel"
import { resetTween } from "./Play"
import { removeGameTeamEntities, resetGamePanel } from "../ui/Objects/Edit/EditGaming"
import { displayGrabContextMenu } from "../ui/Objects/GrabContextMenu"
import { resetSetPositionEntity } from "../ui/Objects/Edit/ActionPanels/AddSetPositionPanel"
import { resetSetRotationEntity } from "../ui/Objects/Edit/ActionPanels/AddSetRotationPanel"
import { resetSetScaleEntity } from "../ui/Objects/Edit/ActionPanels/AddSetScalePanel"
import { releaseBatchActions } from "../ui/Objects/Edit/ActionPanels/AddBatchActionsPanel"
import { releaseRandomActions } from "../ui/Objects/Edit/ActionPanels/AddRandomAction"

export let editAssets: Map<string, Entity> = new Map()
export let grabbedAssets: Map<string, Entity> = new Map()
export let selectedItem: SelectedItem
export let selectedAssetId:any
export let playerParentEntities: Map<string, Entity> = new Map()
export let tweenPlacementEntity: Entity = engine.addEntity()

let ITEM_DEPTH_DEFAULT = 4
let ITEM_HEIGHT_DEFAULT = -.88

export function updateSelectedAssetId(value:any){
    selectedAssetId = value

    let iwbInfo = localPlayer.activeScene[COMPONENT_TYPES.IWB_COMPONENT].get(value)
    let entityInfo = getEntity(localPlayer.activeScene, value)
    console.log('entity is', entityInfo.entity)

    let fake = {x:0,y:0,z:0}

    selectedItem = {
        duplicate: false,
        mode: EDIT_MODES.EDIT,
        n: iwbInfo.n,
        modifier: EDIT_MODIFIERS.POSITION,
        pFactor: 1,
        sFactor: 1,
        rFactor: 90,
        entity: entityInfo.entity,
        aid: value,//
        catalogId: iwbInfo.id,
        sceneId: localPlayer.activeScene.id,
        itemData: iwbInfo,
        enabled: false,
        already: false,
        initialHeight: 0,
        transform: {
            position: fake,
            rotation:{...fake, ...{w:0}},
            scale: fake
        },
        distance:4,
        ugc: false,
        rotation: 0,
        scale:1
    }
}

export function getFactor(mod: EDIT_MODIFIERS) {
    switch (mod) {
        case EDIT_MODIFIERS.POSITION:
            return selectedItem.pFactor

        case EDIT_MODIFIERS.ROTATION:
            return selectedItem.rFactor

        case EDIT_MODIFIERS.SCALE:
            return selectedItem.sFactor
    }
}

export function sendServerEdit(modifier: EDIT_MODIFIERS, axis: string, direction: number, manual: boolean, manualMod?: EDIT_MODIFIERS, value?: number) {
    console.log('sending server endit')
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET,
        {
            component: COMPONENT_TYPES.TRANSFORM_COMPONENT,
            item: selectedItem.entity,
            sceneId: selectedItem.sceneId,
            aid: selectedItem.aid,
            modifier: manual ? manualMod : modifier,
            factor: getFactor(modifier),
            axis: axis,
            direction: direction,
            editType: EDIT_MODIFIERS.TRANSFORM,
            manual: manual,
            value: value ? value : 0,
            // ugc: selectedItem.hasOwnProperty("ugc") ? selectedItem.ugc : false
        }
    )
}

export function transformObject(sceneId: string, aid: string, edit: EDIT_MODIFIERS, axis: string, value: number) {
    // let localScene = sceneBuilds.get(sceneId)
    // if (localScene) {
    //     let sceneAsset = localScene.ass.find((localasset: any) => localasset.aid === aid)
    //     if (sceneAsset) {
    //         log('we found scene asset entity', sceneAsset)
    //         let entity = entitiesFromItemIds.get(aid)
    //         if (entity) {
    //             let transform = Transform.getMutable(entity)
    //             console.log('transform is', transform)
    //             switch (edit) {
    //                 case EDIT_MODIFIERS.POSITION:
    //                     let pos: any = transform.position
    //                     pos[axis] = value
    //                     break;

    //                 case EDIT_MODIFIERS.ROTATION:
    //                     let rot: any = Quaternion.toEulerAngles(transform.rotation)
    //                     rot[axis] = value
    //                     transform.rotation = Quaternion.fromEulerDegrees(rot.x, rot.y, rot.z)
    //                     break;

    //                 case EDIT_MODIFIERS.SCALE:
    //                     let scale: any = transform.scale
    //                     scale[axis] = value
    //                     break;
    //             }
    //             console.log('transform is mnow', transform)
    //         }
    //     }
    // }
}

export function toggleModifier(mod: EDIT_MODIFIERS) {
    switch (mod) {
        case EDIT_MODIFIERS.POSITION:
            if (selectedItem.pFactor === 1) {
                selectedItem.pFactor = 0.1
            } else if (selectedItem.pFactor === 0.1) {
                selectedItem.pFactor = 0.01
            } else if (selectedItem.pFactor === 0.01) {
                selectedItem.pFactor = 0.001
            } else if (selectedItem.pFactor === 0.001) {
                selectedItem.pFactor = 1
            }
            console.log('mod is', selectedItem.pFactor)
            break;
        case EDIT_MODIFIERS.SCALE:
            if (selectedItem.sFactor === 1) {
                selectedItem.sFactor = 0.1
            } else if (selectedItem.sFactor === 0.1) {
                selectedItem.sFactor = 0.01
            } else if (selectedItem.sFactor === 0.01) {
                selectedItem.sFactor = 0.001
            } else if (selectedItem.sFactor === 0.001) {
                selectedItem.sFactor = 1
            }
            console.log('mod is', selectedItem.sFactor)
            break;

        case EDIT_MODIFIERS.ROTATION:
            if (selectedItem.rFactor === 90) {
                selectedItem.rFactor = 45
            } else if (selectedItem.rFactor === 45) {
                selectedItem.rFactor = 15
            } else if (selectedItem.rFactor === 15) {
                selectedItem.rFactor = 5
            } else if (selectedItem.rFactor === 5) {
                selectedItem.rFactor = 1
            } else if (selectedItem.rFactor === 1) {
                selectedItem.rFactor = 90
            }
            console.log('mod is', selectedItem.rFactor)
            break;
    }
}

// export function toggleEditModifier(modifier?: EDIT_MODIFIERS) {
//     if (modifier) {
//         selectedItem.modifier = modifier
//     } else {
//         if (selectedItem.modifier === EDIT_MODIFIERS.POSITION) {
//             selectedItem.modifier = EDIT_MODIFIERS.ROTATION
//             selectedItem.factor = 90
//         } else if (selectedItem.modifier === EDIT_MODIFIERS.ROTATION) {
//             selectedItem.modifier = EDIT_MODIFIERS.SCALE
//             selectedItem.factor = 1
//         } else if (selectedItem.modifier === EDIT_MODIFIERS.SCALE) {
//             selectedItem.modifier = EDIT_MODIFIERS.POSITION
//             selectedItem.factor = 1
//         }
//     }
//     console.log('modifier is now', selectedItem)
// }//

export function selectCatalogItem(id: any, mode: EDIT_MODES, already: boolean, duplicate?: any) {
    if (selectedItem && selectedItem.enabled && selectedItem.entity && selectedItem.mode === EDIT_MODES.GRAB) {
        log("Already holding item")
        return
    }

    displayCatalogPanel(false)
    displayGrabContextMenu(true)
    playSound(SOUND_TYPES.SELECT_3)

    let itemData = items.get(id)
    if (itemData) {
        console.log('we have item data', localPlayer)

        selectedItem = {
            n: itemData.n,
            mode: mode,
            modifier: EDIT_MODIFIERS.POSITION,
            pFactor: 1,
            sFactor: 1,
            rFactor: 90,
            entity: engine.addEntity(),
            aid: getRandomString(6),
            catalogId: id,
            sceneId: localPlayer.activeScene.id,
            itemData: itemData,
            enabled: true,
            already: already,
            initialHeight: ITEM_HEIGHT_DEFAULT,
            duplicate: duplicate ? duplicate : false,
            ugc: itemData.hasOwnProperty("ugc") ? itemData.ugc : false,
            isCatalogSelect: true,
            distance:4,
            rotation:0,
            scale: 1
        }

        console.log('selected item is', selectedItem)

        if (already) {
            addUseItemPointers(selectedItem.entity)
        } else {
            addUseCatalogItemPointers(selectedItem.entity)
        }

        displayHover(true)

        let scale: any
        scale = Vector3.One()

        // TODO use configurable parameters for item height and depth//
        let itemHeight = ITEM_HEIGHT_DEFAULT//
        let itemDepth = ITEM_DEPTH_DEFAULT

        let itemPosition = {x: 0, y: itemHeight, z: itemDepth}

        if ((selectedItem.itemData.v && selectedItem.itemData.v > colyseusRoom.state.cv)) {
            log('this asset is not ready for viewing, need to add temporary asset')
            MeshRenderer.setBox(selectedItem.entity)

            if (selectedItem.itemData.bb) {
                if (typeof selectedItem.itemData.bb === "string") {
                    console.log('bb is a string')
                    selectedItem.itemData.bb = JSON.parse(selectedItem.itemData.bb)
                }
                console.log('item bb is', selectedItem.itemData.bb)
                scale = Vector3.create(selectedItem.itemData.bb.x, selectedItem.itemData.bb.z, selectedItem.itemData.bb.y)//
            }

        } else {
            log('this asset is ready for viewing, place object in scene', selectedItem.catalogId)

            //add different asset types here
            if (selectedItem.itemData.n === "Image" || selectedItem.itemData.n === "NFT Frame") {
                MeshRenderer.setPlane(selectedItem.entity)
                itemPosition = {x: 0, y: .5, z: itemDepth}
                selectedItem.initialHeight = .88
                scale = Vector3.create(2, 2, 1)
                MeshCollider.setPlane(selectedItem.entity, ColliderLayer.CL_POINTER)
            } else if (selectedItem.itemData.n === "Text") {
                log('dropping text item')
                TextShape.create(selectedItem.entity, {text: "Text", fontSize: 3})
                itemPosition = {x: 0, y: .5, z: itemDepth}
                selectedItem.initialHeight = .88
                scale = Vector3.create(2, 2, 1)
            } else if (selectedItem.itemData.n === "Video") {
                MeshRenderer.setPlane(selectedItem.entity)
                itemPosition = {x: 0, y: .5, z: itemDepth}
                selectedItem.initialHeight = .88
                scale = Vector3.create(2, 2, 1)
                MeshCollider.setPlane(selectedItem.entity, ColliderLayer.CL_POINTER)
            } else if (selectedItem.itemData.n === "Custom Sound") {
                MeshRenderer.setBox(selectedItem.entity)
                itemPosition = {x: 0, y: .5, z: itemDepth}
                selectedItem.initialHeight = .88
                scale = Vector3.create(.5, .5, .5)
                MeshCollider.setBox(selectedItem.entity, ColliderLayer.CL_POINTER)
            } else if (selectedItem.itemData.ty === "SM") {
                MeshRenderer.setBox(selectedItem.entity)
                itemPosition = {x: 0, y: .5, z: itemDepth}
                selectedItem.initialHeight = .88
                scale = Vector3.create(1, 1, 1)
                MeshCollider.setBox(selectedItem.entity, ColliderLayer.CL_POINTER)
            } else if (selectedItem.itemData.ty === "Audio") {
                MeshRenderer.setBox(selectedItem.entity)
                itemPosition = {x: 0, y: .5, z: itemDepth}
                selectedItem.initialHeight = .88
                scale = Vector3.create(1,1,1)
                MeshCollider.setBox(selectedItem.entity, ColliderLayer.CL_POINTER)
            } else if (selectedItem.itemData.n === "UI Text") {
                MeshRenderer.setBox(selectedItem.entity)
                itemPosition = {x: 0, y: .5, z: itemDepth}
                selectedItem.initialHeight = .88
                scale = Vector3.create(1,1,1)//
                MeshCollider.setBox(selectedItem.entity, ColliderLayer.CL_POINTER)
            } else if (selectedItem.itemData.n === "UI Image") {
                MeshRenderer.setBox(selectedItem.entity)
                itemPosition = {x: 0, y: .5, z: itemDepth}
                selectedItem.initialHeight = .88
                scale = Vector3.create(1, 1, 1)
                MeshCollider.setBox(selectedItem.entity, ColliderLayer.CL_POINTER)
            } else if (selectedItem.itemData.n === "Trigger Area") {
                MeshRenderer.setBox(selectedItem.entity)
                itemPosition = {x: 0, y: .5, z: itemDepth}
                selectedItem.initialHeight = .88
                scale = Vector3.create(1,1,1)
                MeshCollider.setBox(selectedItem.entity, ColliderLayer.CL_POINTER)
            } 
            else if (selectedItem.itemData.n === "Dialog") {
                MeshRenderer.setBox(selectedItem.entity)
                itemPosition = {x: 0, y: .5, z: itemDepth}
                selectedItem.initialHeight = .88
                scale = Vector3.create(1,1,1)
                MeshCollider.setBox(selectedItem.entity, ColliderLayer.CL_POINTER)
            } 
            else {
                // if (selectedItem.itemData.pending)  {
                    // MeshRenderer.setBox(selectedItem.entity)
                // } else {
                    GltfContainer.create(selectedItem.entity, {
                        src: 'assets/' + selectedItem.catalogId + ".glb",//
                        invisibleMeshesCollisionMask: ColliderLayer.CL_NONE,
                        visibleMeshesCollisionMask: ColliderLayer.CL_POINTER,
                    })

                // }
            }
        }

        if (duplicate) {
            Transform.createOrReplace(selectedItem.entity, {
                position: itemPosition,
                scale: duplicate.s,
                parent: engine.PlayerEntity
            })
        } else {
            Transform.createOrReplace(selectedItem.entity, {position: itemPosition, scale, parent: engine.PlayerEntity})
        }

        // if(!already){
            sendServerMessage(SERVER_MESSAGE_TYPES.SELECT_CATALOG_ASSET, {
                user: localUserId,
                catalogId: id,
                assetId: selectedItem.aid,
                ugc: selectedItem.ugc,
                sceneId: selectedItem.sceneId,
                isCatalogSelect:true
            })
        // }
    } else {
        console.log('item does not exist')
    }

    setUIClicked(false)
}

export function otherUserPlaceditem(info: any) {
    let parent = playerParentEntities.get(info.user)
    if (parent) {
        engine.removeEntity(parent)
    }
    playerParentEntities.delete(info.user)
}

export function otherUserSelectedItem(info: any, catalog?: boolean) {
    log('other user selected item', info, catalog)
    try {
        let parent = engine.addEntity()
        Transform.createOrReplace(parent, {position: Vector3.create(0, 2, 0)})
        AvatarAttach.createOrReplace(parent, {
            avatarId: info.editor,
            anchorPointId: AvatarAnchorPointType.AAPT_POSITION,
        })

        if(info.catalogAsset){
            let itemData = items.get(info.catalogId)
            if (itemData) {
                let entity = engine.addEntity()
                let scale: any
                scale = Vector3.create(1, 1, 1)

                if (itemData.v && itemData.v > localPlayer.version) {
                    log('this asset is not ready for viewing, need to add temporary asset')
                    MeshRenderer.setBox(entity)

                    if (itemData.bb) {
                        scale = Vector3.create(itemData.bb.x, itemData.bb.y, itemData.bb.z)
                    }

                } else {
                    log('this asset is ready for viewing, place object in scene', info.catalogId)
                    addGrabbedComponent(entity, info.catalogId)
                    // !info.catalogAsset ? scale = info.componentData.s : null
                }

                Transform.createOrReplace(entity, {position: {x: 0, y: .25, z: 4}, scale: scale, parent: parent})
                playerParentEntities.set(info.editor, parent)
                grabbedAssets.set(info.assetId, entity)
            }
        }else{
            let scene = colyseusRoom.state.scenes.get(info.sceneId)
            if(!scene){
                return
            }
    
            let itemInfo = scene[COMPONENT_TYPES.IWB_COMPONENT].get(info.assetId)
            if(!itemInfo){
                return
            }

            let transformInfo = scene[COMPONENT_TYPES.TRANSFORM_COMPONENT].get(info.assetId)
            Transform.createOrReplace(itemInfo.entity, {position: {x: 0, y: .25, z: 4}, scale: transformInfo.s, parent: parent})
    
            playerParentEntities.set(info.editor, parent)
            grabbedAssets.set(info.assetId, itemInfo.entity)
        }
        
    } catch (e) {
        log('error attaching other user item', e)
    }
}

export function otherUserRemovedSeletedItem(player: any) {
    let parent = playerParentEntities.get(player)
    if (parent) {
        engine.removeEntityWithChildren(parent)
    }
}

export function updateGrabbedYAxis(info: any) {
    // let ent = grabbedAssets.get(info.aid)
    // log('entity is', ent)
    // if (ent) {
    //     log('updating entity position', info)
    //     Transform.getMutable(ent).position.y = info.y + 1.25
    // }
}

export function editItem(aid:string, mode: EDIT_MODES, already?: boolean) {
    console.log('editing aid', aid)
    hideAllPanels()

    let entityInfo = getEntity(localPlayer.activeScene, aid)
    if(entityInfo){
        let itemInfo = localPlayer.activeScene[COMPONENT_TYPES.IWB_COMPONENT].get(aid)
        if(itemInfo && itemInfo.locked){
            playSound(SOUND_TYPES.ERROR_2)
            return
        }

        console.log('edity entity info is', entityInfo)
    
        hideAllOtherPointers()
        // PointerEvents.deleteFrom(entity)
    
        let transform = Transform.get(entityInfo.entity)
        let transPos = Vector3.clone(transform.position)
        let transScal = Vector3.clone(transform.scale)
        let transRot = Quaternion.toEulerAngles(transform.rotation)
    
        selectedItem = {
            duplicate: false,
            mode: mode,
            n: itemInfo.n,
            modifier: EDIT_MODIFIERS.POSITION,
            pFactor: 1,
            sFactor: 1,
            rFactor: 90,
            entity: entityInfo.entity,
            aid: aid,
            catalogId: itemInfo.id,
            sceneId: localPlayer.activeScene.id,
            itemData: itemInfo,
            enabled: true,
            already: already ? already : false,
            initialHeight: transPos.y,
            transform: {
                position: transPos,
                rotation: Quaternion.fromEulerDegrees(transRot.x, transRot.y, transRot.z),
                scale: transScal
            },
            distance:4,
            ugc: itemInfo.ugc,
            rotation: transRot.y,
            scale:1
        }
    
        let itemdata = items.get(selectedItem.catalogId)
    
        addSelectionPointer(itemdata)
    
        sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, {
            user: localUserId,
            component: COMPONENT_TYPES.IWB_COMPONENT,
            aid: aid,
            sceneId: localPlayer.activeScene.id,
            editing:true,
            editor:localUserId
        })
    }
}

export function saveItem() {
    hideUIText()
    hideUIImage()
    removeSelectionPointer()

    // PointerEvents.deleteFrom(selectedItem.entity)
    addBuildModePointers(selectedItem.entity)
    addAllBuildModePointers()

    selectedItem.enabled = false
    selectedItem.mode === EDIT_MODES.EDIT ? engine.removeEntity(selectedItem.pointer!) : null

    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET_DONE,
        {
            aid: selectedItem.aid,
            sceneId: selectedItem.sceneId
        }
    )

    hideAllPanels()
    openEditComponent("", true)
    setUIClicked(false)

    // //check Trigger Area Items
    // if (selectedItem.itemData.trigArComp) {
    //     utils.triggers.removeTrigger(selectedItem.entity)
    //     let scene = sceneBuilds.get(selectedItem.sceneId)
    //     if (scene) {
    //         addTriggerArea(scene, selectedItem.entity, selectedItem.itemData, items.get(selectedItem.catalogId)!.n)
    //     }
    // }//
    resetAdditionalAssetFeatures()
}

export function resetAdditionalAssetFeatures(){
    resetCloneEntity()
    resetLevelSpawnEntity()
    resetLiveSpawnEntity()
    resetCurrentBouncerSpawns()
    resetTweenActionPanel()
    resetGamePanel()
    resetSetPositionEntity()
    resetSetRotationEntity()
    resetSetScaleEntity()
    displayGrabContextMenu(false)
    releaseBatchActions()
    releaseRandomActions()
}

export function dropGrabbedItems(){
    console.log('dropping grabbed items')

     // item was not canceled, drop it in the new position
    // get current item position
    const finalPosition: Vector3.MutableVector3 = getWorldPosition(selectedItem.entity);

    // find scene from parcel item is in
    let parcel = "" + Math.floor(finalPosition.x / 16) + "," + Math.floor(finalPosition.z / 16);
    const curScene = findSceneByParcel(parcel);

    // check user build permissions for scene
    const bpsCurScene = checkBuildPermissionsForScene(curScene);

    // if scene found and permissions allowed, add item to scene
    if (curScene && bpsCurScene && isEntityInScene(selectedItem.entity, selectedItem.catalogId)) {
        PointerEvents.deleteFrom(selectedItem.entity);
        VisibilityComponent.createOrReplace(bbE, {visible: false});
        addAllBuildModePointers();
        localPlayer.activeScene = curScene;
        
        let t = Transform.getMutable(selectedItem.entity);

        // set rotation to current rotation//
        if(isSnapEnabled) {
            t.rotation = getWorldRotation(selectedItem.entity)
        } else {
            let eulRot = Quaternion.toEulerAngles(t.rotation);
            let playerRot = Quaternion.toEulerAngles(Transform.get(engine.PlayerEntity).rotation);
            t.rotation =  Quaternion.fromEulerDegrees(eulRot.x + playerRot.x, eulRot.y + playerRot.y, eulRot.z + playerRot.z);
        }

        //
        // find position relative to scene parent
        const curSceneParent = curScene.parentEntity;
        const curSceneParentPosition = Transform.get(curSceneParent).position;
        finalPosition.x = finalPosition.x - curSceneParentPosition.x;
        finalPosition.z = finalPosition.z - curSceneParentPosition.z;
        t.position = finalPosition

        // set parent to scene parent
        t.parent = curSceneParent;
        t.scale = Vector3.One()

        // send message to server to add item to scene//
        sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_DROPPED_GRABBED, {
            entity: selectedItem.entity,
            sceneId: curScene.id,
            aid: selectedItem.aid,
            id: selectedItem.catalogId,
            position: roundVector(t.position, 2),
            rotation: roundVector(Quaternion.toEulerAngles(t.rotation), 2),
        });

        // clean up grabbed entity//
        grabbedAssets.delete(selectedItem.aid);

        selectedItem.enabled = false;
        selectedItem.sceneId = curScene.id;
        return;
    }

    showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Asset out of bounds", animate:{enabled:true, return:true, time:3},  noSound:true})

    playSound(SOUND_TYPES.ERROR_2);
}

export function dropSelectedItem(canceled?: boolean, editing?: boolean) {
    VisibilityComponent.createOrReplace(bbE, {visible: false})
    displayGrabContextMenu(false)

    if (editing || canceled) {
        selectedItem.enabled = false;

        if (selectedItem.pointer) engine.removeEntity(selectedItem.pointer);

        if (canceled && !selectedItem.isCatalogSelect) {
            // item was in existing scene, restore it to previous position
            let t = Transform.getMutable(selectedItem.entity);
            t = selectedItem.transform!;

            if (selectedItem.mode === EDIT_MODES.GRAB) {
                // add back to scene at previous position
                console.log('selection was grab mode')

                let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
                if(scene){
                    let transform = selectedItem.transform
                    if(transform){
                        transform.parent = findAssetParent(scene, selectedItem.aid)
                        Transform.createOrReplace(selectedItem.entity, transform)
                    }
                }

                // sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_ADD_ITEM, {
                //     item: {
                //         entity: selectedItem.entity,
                //         sceneId: selectedItem.sceneId,
                //         aid: selectedItem.aid,
                //         id: selectedItem.catalogId,
                //         position: roundVector(t.position, 2),
                //         rotation: roundVector(Quaternion.toEulerAngles(t.rotation), 2),
                //         scale: roundVector(t.scale, 2),
                //         duplicate: selectedItem.duplicate,
                //         ugc: selectedItem.ugc
                //     }
                // });
                
                

                // engine.removeEntity(selectedItem.entity);
                grabbedAssets.delete(selectedItem.aid);
            }

        } else {
            console.log('item was catalog item, just remove it')
            engine.removeEntity(selectedItem.entity);
            grabbedAssets.delete(selectedItem.aid);
        }
        return;
    }

    console.log('selected item is ', selectedItem)
    console.log('selected entity is', selectedItem.entity)

    // item was not canceled, drop it in the new position
    // get current item position
    const finalPosition: Vector3.MutableVector3 = getWorldPosition(selectedItem.entity);

    // find scene from parcel item is in
    let parcel = "" + Math.floor(finalPosition.x / 16) + "," + Math.floor(finalPosition.z / 16);
    const curScene = findSceneByParcel(parcel);

    // check user build permissions for scene
    const bpsCurScene = checkBuildPermissionsForScene(curScene);

    // if scene found and permissions allowed, add item to scene
    if (curScene && bpsCurScene && isEntityInScene(selectedItem.entity, selectedItem.catalogId)) {
        PointerEvents.deleteFrom(selectedItem.entity);
        VisibilityComponent.createOrReplace(bbE, {visible: false});
        addAllBuildModePointers();
        localPlayer.activeScene = curScene;
        
        let t = Transform.getMutable(selectedItem.entity);

        // set rotation to current rotation//
        if(isSnapEnabled) {
            t.rotation = getWorldRotation(selectedItem.entity)
        } else {
            let eulRot = Quaternion.toEulerAngles(t.rotation);
            let playerRot = Quaternion.toEulerAngles(Transform.get(engine.PlayerEntity).rotation);
            t.rotation =  Quaternion.fromEulerDegrees(eulRot.x + playerRot.x, eulRot.y + playerRot.y, eulRot.z + playerRot.z);
        }

        //
        // find position relative to scene parent
        const curSceneParent = curScene.parentEntity;
        const curSceneParentPosition = Transform.get(curSceneParent).position;
        finalPosition.x = finalPosition.x - curSceneParentPosition.x;
        finalPosition.z = finalPosition.z - curSceneParentPosition.z;
        t.position = finalPosition

        // set parent to scene parent
        t.parent = curSceneParent;
        t.scale = Vector3.One()

        // send message to server to add item to scene
        sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_ADD_ITEM, {
            baseParcel: curScene.bpcl,
            item: {
                entity: selectedItem.entity,
                sceneId: curScene.id,
                aid: selectedItem.aid,
                id: selectedItem.catalogId,
                position: roundVector(t.position, 2),
                rotation: roundVector(Quaternion.toEulerAngles(t.rotation), 2),
                scale: roundVector(t.scale, 2),
                duplicate: selectedItem.duplicate,
                ugc: selectedItem.ugc
            }
        });

        // clean up grabbed entity//
        engine.removeEntity(selectedItem.entity);
        grabbedAssets.delete(selectedItem.aid);

        selectedItem.enabled = false;
        selectedItem.sceneId = curScene.id;

        console.log('selected item aid is', selectedItem.aid)

        return;
    }

    showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Asset out of bounds", animate:{enabled:true, return:true, time:3},  noSound:true})

    playSound(SOUND_TYPES.ERROR_2);
}

// export function dropSelectedItem2(canceled?: boolean, editing?: boolean) {
//
//     if (editing) {
//         selectedItem.enabled = false
//         PointerEvents.deleteFrom(selectedItem.entity)
//         addBuildModePointers(selectedItem.entity)
//
//         addAllBuildModePointers()
//
//         if (selectedItem.pointer)
//             engine.removeEntity(selectedItem.pointer)
//
//         return
//     }
//
//     if (canceled) {
//         selectedItem.enabled = false
//         PointerEvents.deleteFrom(selectedItem.entity)
//         addBuildModePointers(selectedItem.entity)
//
//         addAllBuildModePointers()
//
//         if (selectedItem.pointer)
//             engine.removeEntity(selectedItem.pointer)
//
//
//         let t = Transform.getMutable(selectedItem.entity)
//         t = selectedItem.transform!
//
//         log("selected scene id", selectedItem.sceneId)
//
//         let curScene = sceneBuilds.get(selectedItem.sceneId)
//
//         log("CURSCENE", curScene)
//
//         sendServerMessage(
//             SERVER_MESSAGE_TYPES.SCENE_ADD_ITEM,
//             {
//                 //baseParcel: curScene.bpcl,
//                 item: {
//                     entity: selectedItem.entity,
//                     sceneId: selectedItem.sceneId,
//                     aid: selectedItem.aid,
//                     id: selectedItem.catalogId,
//                     position: roundVector(t.position, 2),
//                     rotation: roundVector(Quaternion.toEulerAngles(t.rotation), 2),
//                     scale: roundVector(t.scale, 2),
//                     duplicate: selectedItem.duplicate,
//                     ugc: selectedItem.ugc
//                 }
//             }
//         )
//
//
//         return
//     }
//
//
//     const finalPosition: Vector3.MutableVector3 = getWorldPosition(selectedItem.entity)
//     let parcel = "" + Math.floor(finalPosition.x / 16) + "," + Math.floor(finalPosition.z / 16)
//     let canDrop = false
//
//     const curScene = findSceneByParcel(parcel)
//     const bpsCurScene = checkBuildPermissionsForScene(curScene)
//
//     if (curScene && bpsCurScene) {//} && isEntityInScene(selectedItem.entity, selectedItem.catalogId)) {
//         canDrop = true
//         playSound(SOUND_TYPES.DROP_1_STEREO)
//
//         if (PointerEvents.has(selectedItem.entity)) PointerEvents.deleteFrom(selectedItem.entity)
//         VisibilityComponent.createOrReplace(bbE, {visible: false})
//
//         addAllBuildModePointers()
//
//         localPlayer.activeScene = curScene
//
//
//         // update object transform
//         let t = Transform.getMutable(selectedItem.entity)
//         if (canceled) {
//             t = selectedItem.transform!
//         } else {
//
//
//             const curSceneParent = curScene.parentEntity
//             const curSceneParentPosition = Transform.get(curSceneParent).position
//
//             // adjust position to parent offset
//             finalPosition.x = finalPosition.x - curSceneParentPosition.x
//             finalPosition.z = finalPosition.z - curSceneParentPosition.z
//
//             const {position: playerPosition, rotation: playerRotation} = Transform.get(engine.PlayerEntity)
//
//
//             t.position.x = finalPosition.x
//             t.position.y = t.position.y + playerPosition.y
//             t.position.z = finalPosition.z
//
//
//             t.rotation = getWorldRotation(selectedItem.entity)
//
//             // if (selectedItem.isCatalogSelect) {
//             //     t.rotation.y = playerRotation.y
//             //     t.rotation.w = playerRotation.w
//             //
//             // } else {
//             //
//             //     let eulRot = Quaternion.toEulerAngles(t.rotation)
//             //     let pEulRot = Quaternion.toEulerAngles(playerRotation)
//             //
//             //     t.rotation = Quaternion.fromEulerDegrees(
//             //         eulRot.x,
//             //         eulRot.y + pEulRot.y,
//             //         eulRot.z
//             //     )
//             // }
//
//             t.parent = curSceneParent
//         }
//
//
//         // log('new transform is', t)
//         // log('new rot is', Quaternion.toEulerAngles(t.rotation))
//
//         // if(selectedItem.already){
//         //     log('dropping already selected item')
//         //     // Transform.createOrReplace(selectedItem.entity, t)
//         // }else{
//         engine.removeEntity(selectedItem.entity)
//         // }
//
//         grabbedAssets.delete(selectedItem.aid)
//         selectedItem.enabled = false
//         selectedItem.sceneId = curScene.id
//
//         // if no previous transform, this was a catalog asset
//         if (!t) {
//             return;
//         }
//
//         sendServerMessage(
//             SERVER_MESSAGE_TYPES.SCENE_ADD_ITEM,
//             {
//                 baseParcel: curScene.bpcl,
//                 item: {
//                     entity: selectedItem.entity,
//                     sceneId: curScene.id,
//                     aid: selectedItem.aid,
//                     id: selectedItem.catalogId,
//                     position: roundVector(t.position, 2),
//                     rotation: roundVector(Quaternion.toEulerAngles(t.rotation), 2),
//                     scale: roundVector(t.scale, 2),
//                     duplicate: selectedItem.duplicate,
//                     ugc: selectedItem.ugc
//                 }
//             }
//         )
//
//
//         console.log('selected item', selectedItem)
//         return
//     }
//
//     if (!canDrop) {
//         console.log('player cant build here')
//         playSound(SOUND_TYPES.ERROR_2)
//     }
// }

export function placeCenterCurrentScene(id?: string) {

    if (!id) return

    selectCatalogItem(id, EDIT_MODES.GRAB, false)
    displayCatalogInfoPanel(false)
    displayHover(false)

    dropSelectedItem()

    const {position: playerPosition, rotation: playerRotation} = Transform.get(engine.PlayerEntity)
    let parcel = "" + Math.floor(playerPosition.x / 16) + "," + Math.floor(playerPosition.z / 16)

    afterLoadActions.push((sceneId: string) => {

        // get center of scene//
        let scene = colyseusRoom.state.scenes.get(sceneId)
        const center = getCenterOfParcels(scene!.pcls)
        const parentT = Transform.get(scene!.parentEntity)

        const xPos = center[0] - parentT.position.x
        const yPos = 0
        const zPos = center[1] - parentT.position.z

        sendServerEdit(EDIT_MODIFIERS.POSITION, "x", 1, true, EDIT_MODIFIERS.POSITION, xPos)
        sendServerEdit(EDIT_MODIFIERS.POSITION, "y", 1, true, EDIT_MODIFIERS.POSITION, yPos)
        sendServerEdit(EDIT_MODIFIERS.POSITION, "z", 1, true, EDIT_MODIFIERS.POSITION, zPos)
        sendServerEdit(EDIT_MODIFIERS.ROTATION, "y", 1, true, EDIT_MODIFIERS.ROTATION, 0)
    })
}

export function duplicateItem(aid:string) {
    let scene = localPlayer.activeScene
    if(!scene){
        return
    }

    let itemInfo = scene[COMPONENT_TYPES.IWB_COMPONENT].get(aid)
    if(!itemInfo){
        return
    }

    selectCatalogItem(itemInfo.id, EDIT_MODES.GRAB, false)
}

export function duplicateItemInPlace(aid:string) {
    let scene = localPlayer.activeScene
    if(!scene){
        return
    }

    let itemInfo = scene[COMPONENT_TYPES.IWB_COMPONENT].get(aid)
    if(!itemInfo){
        return
    }

    let entityInfo = getEntity(scene, aid)
    if(!entityInfo){
        return
    }

    let newAid:string = getRandomString(6)

    afterLoadActions.push((sceneId: string, entity: Entity) => {
        let scene = colyseusRoom.state.scenes.get(sceneId)
        if(!scene){
            return
        }

        editItem(newAid, EDIT_MODES.EDIT)
        openEditComponent(COMPONENT_TYPES.TRANSFORM_COMPONENT)
    })

    playSound(SOUND_TYPES.DROP_1_STEREO)
    let transform = {...Transform.get(entityInfo.entity)}

    sendServerMessage(
        SERVER_MESSAGE_TYPES.SCENE_ADD_ITEM,
        {
            baseParcel: scene.bpcl,
            item: {
                entity: entityInfo.entity,
                sceneId: scene.id,
                aid: newAid,
                id: itemInfo.id,
                position: roundVector(transform.position, 2),
                rotation: roundVector(Quaternion.toEulerAngles(transform.rotation), 2),
                scale: roundVector(transform.scale, 2),
                duplicate: entityInfo.aid,
                ugc: itemInfo.ugc
            }
        }
    )
}

export function confirmGrabItem(scene:any, entity:Entity, selectedAsset:any) {
    if(entity){
        console.log('confirmed grab item has entity')
        let itemData = items.get(selectedAsset.id)
        console.log('confirmed grab item item data', itemData)
        if(!itemData){
            return
        }

        // console.log('item data is', itemData)

        let transform = Transform.get(entity)
        let transPos = Vector3.clone(transform.position)
        let transScal = Vector3.clone(transform.scale)
        let transRot = Quaternion.toEulerAngles(transform.rotation)

        let grabbedDistance = grabbedItemDistances.get(selectedAsset.aid)
        console.log('confirmed grabbed distance is', grabbedDistance)

        let parentAid:any
        let parentsWithChildren = scene[COMPONENT_TYPES.PARENTING_COMPONENT].filter((obj:any) => obj.children.length > 0);
        for(let i = 0; i < parentsWithChildren.length; i++){
            let parent = parentsWithChildren[i]
            if(parent.children.includes(selectedAsset.aid)){
                console.log('found parent')
                parentAid = parent.aid
                break;
            }
        }

        selectedItem = {
            parent:parentAid,
            n: itemData.n,
            duplicate: false,
            mode: EDIT_MODES.GRAB,
            modifier: EDIT_MODIFIERS.POSITION,
            pFactor: 1,
            sFactor: 1,
            rFactor: 90,
            // entity: engine.addEntity(),
            entity:entity,
            aid: selectedAsset.aid,
            catalogId: selectedAsset.id,
            sceneId: scene.id,
            itemData: itemData,
            enabled: true,
            already: true,
            transform: {
                position: transPos,
                rotation: Quaternion.fromEulerDegrees(transRot.x, transRot.y, transRot.z),
                scale: transScal
            },
            distance: grabbedDistance ?? 4,
            rotation: transRot.y,
            scale:1,
            initialHeight: transPos.y - .88,
            ugc: selectedAsset.ugc
        }
        addUseItemPointers(selectedItem.entity)
        displayHover(true)

        let scale: any
        scale = transScal
        // log('grabbed scale is', scale)

        // let config = localPlayer.worlds.find((w:any) => w.ens === realm)

        // if (selectedItem.itemData.v && selectedItem.itemData.v > config.v) {
        //     // log('this asset is not ready for viewing, need to add temporary asset')//
        //     console.log('grabbed asset not ready for viewing')
        //     MeshRenderer.setBox(selectedItem.entity)

        //     if (selectedItem.itemData.bb) {
        //         scale = Vector3.create(selectedItem.itemData.bb.x, selectedItem.itemData.bb.y, selectedItem.itemData.bb.z)
        //     }

        // } else {
        //     // log('this asset is ready for viewing, place object in scene', selectedItem.catalogId)
        //     addGrabbedComponent(selectedItem.entity, selectedItem.itemData.id)
        // }

        if (GltfContainer.has(selectedItem.entity)) {
            GltfContainer.getMutable(selectedItem.entity).invisibleMeshesCollisionMask = ColliderLayer.CL_NONE
            GltfContainer.getMutable(selectedItem.entity).visibleMeshesCollisionMask = ColliderLayer.CL_POINTER
        }

        const {rotation: playerRot} = Transform.get(engine.PlayerEntity)
        const playereuler = Quaternion.toEulerAngles(playerRot)

        Transform.createOrReplace(
            selectedItem.entity,
            {
                position: {x: 0, y: -.88, z: grabbedDistance ? grabbedDistance : 4},
                scale: scale,
                rotation: Quaternion.fromEulerDegrees(transRot.x - playereuler.x, transRot.y - playereuler.y, transRot.z - playereuler.z),
                parent: engine.PlayerEntity
            })

        grabbedAssets.set(selectedItem.aid, entity)

         sendServerMessage(SERVER_MESSAGE_TYPES.SELECTED_SCENE_ASSET, {
                 user: localUserId,
                 catalogId: selectedItem.catalogId,
                 assetId: selectedItem.aid,
                 sceneId: scene.id,
             }
        )//
    }
}

export function grabItem(entity: Entity) {
    hideAllPanels()
    let aid = getAssetIdByEntity(localPlayer.activeScene, entity)
    let scene = colyseusRoom.state.scenes.get(localPlayer.activeScene.id)
    if(aid && scene){
        let itemInfo = scene[COMPONENT_TYPES.IWB_COMPONENT].get(aid)
        if(itemInfo){
            if(itemInfo.editing){
               playSound(SOUND_TYPES.ERROR_2)
               return
            }


        raycastSystem.registerTargetEntityRaycast(
            {
              entity: engine.PlayerEntity,
              opts: {
                queryType: RaycastQueryType.RQT_QUERY_ALL,
                targetEntity: entity,
                maxDistance:500
              },
            },
            (raycastResult) => {
              console.log(raycastResult)
              let distance = 4
              if(raycastResult.hits.length > 0){
                let hit = raycastResult.hits[0].position
                console.log("distance is ", getDistance(hit, Transform.get(engine.PlayerEntity).position))
                distance = getDistance(hit, Transform.get(engine.PlayerEntity).position)
              }

              grabbedItemDistances.set(aid, distance)

              hideAllOtherPointers()
              displayHover(true)
              if (PointerEvents.has(entity)) PointerEvents.deleteFrom(entity)
            //  sendServerMessage(SERVER_MESSAGE_TYPES.SELECTED_SCENE_ASSET, {
            //      user: localUserId,
            //      catalogId: itemInfo.catalogId,
            //      assetId: aid,
            //      sceneId: scene.id,
            //  })

            confirmGrabItem(scene, entity, itemInfo)

             playSound(SOUND_TYPES.SELECT_3)
            }
          )
        }
    }
}

export let grabbedItemDistances:Map<string, number> = new Map()

export function deleteGrabbedItem(){
    sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_DELETE_GRABBED_ITEM, {sceneId: selectedItem.sceneId, aid:selectedItem.aid})
    removeSelectedItem()
}

export function deleteSelectedItem(aid:string) {
    let itemInfo = localPlayer.activeScene[COMPONENT_TYPES.IWB_COMPONENT].get(aid)
    console.log('found item info to delete', itemInfo)
    if(itemInfo){
        if(!itemInfo.locked && (!itemInfo.editing || (itemInfo.editing && itemInfo.editor === localUserId))){
            console.log('item can be deleted')
            let entityInfo = getEntity(localPlayer.activeScene, aid)
            console.log('found entity info to delte', entityInfo)
            if(entityInfo){
                let data: any = {
                    assetId: aid,
                    sceneId: localPlayer.activeScene.id,
                    entity: entityInfo.entity
                }
                
                sendServerDelete(entityInfo.entity, data)
                removeSelectedItem()

                openEditComponent("", true)
            }
        }else{
            console.log('error deleteing item')
            playSound(SOUND_TYPES.ERROR_2)
        }
    }
}

export function cancelSelectedItem() {
    log('canceled selected item is', selectedItem)
    dropSelectedItem(true)
    // sendServerMessage(SERVER_MESSAGE_TYPES.PLAYER_CANCELED_CATALOG_ASSET,
    //     {
    //         sceneId: selectedItem.sceneId
    //     }
    // )
}

export function cancelEditingItem() {
    log('canceled editing item is', selectedItem)
    openEditComponent("")
    dropSelectedItem(true, true)
    setUIClicked(false)
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET_CANCEL,
        {
            user: localUserId,
            item: {
                catalogId: selectedItem.catalogId,
                aid: selectedItem.aid,
                sceneId: selectedItem.sceneId
            }
        })
}//

function addGrabbedComponent(entity: Entity, catalogId: string) {
    let catalogItem = items.get(catalogId)
    console.log('grabbed catalog item is', catalogItem)
    if (catalogItem) {
        switch (catalogItem.ty) {
            case '3D':
                GltfContainer.create(entity, {
                    src: "assets/" + catalogId + ".glb",
                    invisibleMeshesCollisionMask: ColliderLayer.CL_NONE,
                    visibleMeshesCollisionMask: ColliderLayer.CL_NONE
                })
                break;

            case '2D':
                MeshRenderer.setPlane(entity)

                switch (catalogItem!.n) {
                    case 'Image':
                    case 'Video':
                        // if (itemData) {
                        //     // updateImageUrl(itemData.aid, itemData.matComp, itemData.imgComp.url, entity)
                        // }
                        break;

                    case 'NFT Frame':
                        // if (itemData) {
                        //     log('we have nft data to update!', itemData.nftComp)
                        //     NftShape.createOrReplace(entity, {
                        //         urn: 'urn:decentraland:ethereum:erc721:' + itemData.nftComp.contract + ':' + itemData.nftComp.tokenId,
                        //         style: itemData.nftComp.style
                        //     })
                        //     updateNFTFrame(itemData.aid, itemData.matComp, itemData.nftComp, entity)
                        // }
                        break;

                    case 'Text':
                        // if (itemData) {
                        //     updateTextComponent(itemData.aid, itemData.matComp, itemData.textComp, entity)
                        // } else {
                        //     TextShape.createOrReplace(entity, {
                        //         text: "Text",
                        //     })
                        // }
                        break;

                }
                break;

            case 'Audio':
                // if (itemData && itemData.audComp) {//
                //     updateAudioComponent(itemData.aid, itemData.id, itemData.audComp)
                // }
                MeshRenderer.setBox(selectedItem.entity)
                break;

            case 'SM':
                MeshRenderer.setBox(selectedItem.entity)
                if (selectedItem.itemData.trigArComp) {
                    Material.setPbrMaterial(entity, {
                        albedoColor: Color4.create(1, 1, 0, .5)
                    })
                } else if (selectedItem.itemData.dialComp) {
                    Material.setPbrMaterial(entity, {
                        albedoColor: Color4.create(1, 0, 1, .5)
                    })
                    TextShape.createOrReplace(entity, {text: "" + selectedItem.itemData.dialComp.name, fontSize: 3})
                } else {
                    Material.setPbrMaterial(entity, {
                        albedoColor: Color4.create(54 / 255, 221 / 255, 192 / 255, .5)
                    })
                }
                break;
        }
    }
}

export function removeSelectedItem() {
    console.log('removing selected entity', selectedItem)
    if (selectedItem && selectedItem.entity) {
        PointerEvents.deleteFrom(selectedItem.entity)
        engine.removeEntity(selectedItem.entity)
        selectedItem.enabled = false
        selectedItem.mode === EDIT_MODES.EDIT ? engine.removeEntity(selectedItem.pointer!) : null
        VisibilityComponent.createOrReplace(bbE, {visible: false})
        addAllBuildModePointers()
    }else{
        console.log('selected item not found')
    }
}

function addUseCatalogItemPointers(ent: Entity) {
    PointerEvents.createOrReplace(ent, {
        pointerEvents: [
            {
                eventType: PointerEventType.PET_DOWN,
                eventInfo: {
                    button: InputAction.IA_ACTION_3,
                    hoverText: "Cancel",
                    showFeedback: false
                }
            },
            {
                eventType: PointerEventType.PET_DOWN,
                eventInfo: {
                    button: InputAction.IA_PRIMARY,
                    hoverText: "Place",
                    showFeedback: false
                }
            }
        ]
    })
    updateContextEvents([...PointerEvents.get(ent).pointerEvents])
}

function addUseItemPointers(ent: Entity) {
    PointerEvents.createOrReplace(ent, {
        pointerEvents: [
            {
                eventType: PointerEventType.PET_HOVER_ENTER,
                eventInfo: {
                    showFeedback: false
                }
            },
            {
                eventType: PointerEventType.PET_HOVER_LEAVE,
                eventInfo: {
                    showFeedback: false
                }
            },
            {
                eventType: PointerEventType.PET_DOWN,
                eventInfo: {
                    button: InputAction.IA_ACTION_3,
                    hoverText: "Cancel",
                    showFeedback: false
                }
            },
            {
                eventType: PointerEventType.PET_DOWN,
                eventInfo: {
                    button: InputAction.IA_PRIMARY,
                    hoverText: "Place",
                    showFeedback: false
                }
            },
            {
                eventType: PointerEventType.PET_DOWN,
                eventInfo: {
                    button: InputAction.IA_SECONDARY,
                    hoverText: "Delete",
                    showFeedback: false//
                }
            },
        ]
    })
    updateContextEvents([...PointerEvents.get(ent).pointerEvents])
}

export function addBuildModePointers(ent: Entity) {
    PointerEvents.deleteFrom(ent)
    PointerEvents.createOrReplace(ent, {
        pointerEvents: [
            {
                eventType: PointerEventType.PET_HOVER_ENTER,
                eventInfo: {
                    showFeedback: false,
                    maxDistance: 500
                }
            },
            {
                eventType: PointerEventType.PET_HOVER_LEAVE,
                eventInfo: {
                    showFeedback: false,
                    maxDistance: 500
                }
            },
            {
                eventType: PointerEventType.PET_DOWN,
                eventInfo: {
                    button: InputAction.IA_ACTION_3,
                    hoverText: "Edit",
                    showFeedback: false,
                    maxDistance: 500
                }
            },
            {
                eventType: PointerEventType.PET_DOWN,
                eventInfo: {
                    button: InputAction.IA_PRIMARY,
                    hoverText: "Grab",
                    showFeedback: false,
                    maxDistance: 500
                }
            },
            {
                eventType: PointerEventType.PET_DOWN,
                eventInfo: {
                    button: InputAction.IA_ACTION_4,
                    hoverText: "Copy",
                    showFeedback: false,
                    maxDistance: 500
                }
            },
            {
                eventType: PointerEventType.PET_DOWN,
                eventInfo: {
                    button: InputAction.IA_SECONDARY,
                    hoverText: "Delete",
                    showFeedback: false,
                    maxDistance: 500
                }
            },
            {
                eventType: PointerEventType.PET_DOWN,
                eventInfo: {
                    button: InputAction.IA_ACTION_5,
                    hoverText: "Copy in Place",
                    showFeedback: false,
                    maxDistance: 500
                }
            },
        ]
    })
}

export function sendServerDelete(entity: Entity, data?: any) {
    if (data) {
        sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_DELETE_ITEM, data)
        return
    }

    // console.log('entity to delete is ', entity)
    // let assetId = itemIdsFromEntities.get(entity)
    // console.log('found asset id', assetId)
    // if (assetId) {
    //     sceneBuilds.forEach((scene: IWBScene) => {
    //         log('this scene to find items to delete is', scene)
    //         let sceneItem = scene.ass.find((asset) => asset.aid === assetId)
    //         if (sceneItem) {
    //             sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_DELETE_ITEM, {
    //                 assetId: assetId,
    //                 sceneId: scene.id,
    //                 entity: entity
    //             })
    //             return
    //         }
    //     })
    // }
}

export function hideAllOtherPointers() {
    colyseusRoom.state.scenes.forEach((scene:any)=>{
        scene[COMPONENT_TYPES.IWB_COMPONENT].forEach((pointer:any, aid:string)=>{
            let entityInfo = getEntity(scene, aid)
            if(entityInfo){
                // console.log('deleting pointer events', aid)
                PointerEvents.deleteFrom(entityInfo.entity)
            }
        })
    })
}

export function addAllBuildModePointers() {
    if(localPlayer.activeScene){
        localPlayer.activeScene[COMPONENT_TYPES.PARENTING_COMPONENT].forEach((parentInfo:any, i:number)=>{
            if(i > 2){
                let itemInfo = getEntity(localPlayer.activeScene, parentInfo.aid)
                if(itemInfo && itemInfo.entity){
                    console.log('adding build mode pointers for ', itemInfo)
                    addBuildModePointers(itemInfo.entity)
                }
            }
        })
    }
}

export function resetEntityForBuildMode(scene:any, entityInfo:any) {
    let itemInfo = scene[COMPONENT_TYPES.IWB_COMPONENT].get(entityInfo.aid)
    if(itemInfo){
        disableTriggers(scene, entityInfo)
        setGLTFCollisionBuildMode(scene, entityInfo)
        setMeshRenderBuildMode(scene, entityInfo)
        setMeshColliderBuildMode(scene, entityInfo)
        setAudioBuildMode(scene, entityInfo)
        setVisibilityBuildMode(scene, entityInfo)
        setVideoBuildMode(scene, entityInfo)
        setAnimationBuildMode(scene, entityInfo)
        setSmartItemBuildMode(scene, entityInfo)
        setTextShapeForBuildMode(scene, entityInfo)
        setUiTextBuildMode(scene, entityInfo)
        setUiImageBuildMode(scene, entityInfo)
        checkTransformComponent(scene, entityInfo)
        addBuildModePointers(entityInfo.entity)
        resetTween(scene, entityInfo)
    }
    //         resetTweenPositions(entity, sceneItem, scene)//
}

export function addSelectionPointer(itemdata: any) {
    selectedItem.pointer = engine.addEntity()
    GltfContainer.createOrReplace(selectedItem.pointer, {
        src: "assets/40e64954-b84f-40e1-ac58-438a39441c3e.glb"
    })

    Billboard.createOrReplace(selectedItem.pointer, {billboardMode: BillboardMode.BM_Y})

    Transform.createOrReplace(selectedItem.pointer, {
        position: Vector3.create(0, itemdata!.bb.z + 1, 0),
        parent: selectedItem.entity
    })
}

export function addEditSelectionPointer(aid: string, itemData: any) {
    // let ent = entitiesFromItemIds.get(aid)
    // if (ent) {
    //     let edit = engine.addEntity()
    //     GltfContainer.createOrReplace(edit, {
    //         src: "assets/40e64954-b84f-40e1-ac58-438a39441c3e.glb"
    //     })
    //     Billboard.createOrReplace(edit, {billboardMode: BillboardMode.BM_Y})

    //     Transform.createOrReplace(edit, {
    //         position: Vector3.create(0, itemData.bb.z + 1, 0),
    //         parent: ent
    //     })

    //     console.log('edit pointer transform', Transform.get(edit))
    //     editAssets.set(aid, edit)
    // }
}

export function removeSelectionPointer() {
    selectedItem && selectedItem.pointer ? engine.removeEntity(selectedItem.pointer) : null
}

export function removeEditSelectionPointer(aid: string) {
    // let ent = editAssets.get(aid)
    // if (ent) {
    //     engine.removeEntity(ent)
    // }
    // editAssets.delete(aid)
}

function checkVideo(entity: Entity, sceneItem: SceneItem) {
    // if (sceneItem.vidComp) {
    //     VideoPlayer.getMutable(entity).playing = false
    // }
}

function checkSmartItems(entity: Entity, sceneItem: SceneItem) {//
    // if (sceneItem.type === "SM") {
    //     console.log('checking smart item component for build mode', sceneItem)
    //     MeshCollider.setBox(entity, ColliderLayer.CL_POINTER)

    //     if (sceneItem.id === "78f04fcf-5c50-4001-840c-6ba717ce6037") {
    //         // Transform.getMutable(entity).scale = Vector3.create(1,3,1)
    //         // MeshRenderer.setBox(entity)
    //     } else {
    //         MeshRenderer.setBox(entity)
    //         MeshCollider.setBox(entity, ColliderLayer.CL_POINTER)

    //         if (sceneItem.trigArComp) {
    //             Material.setPbrMaterial(entity, {
    //                 albedoColor: Color4.create(1, 1, 0, .5)
    //             })
    //             utils.triggers.enableTrigger(entity, false)
    //         } else if (sceneItem.dialComp) {
    //             Material.setPbrMaterial(entity, {
    //                 albedoColor: Color4.create(1, 0, 1, .5)
    //             })
    //             TextShape.createOrReplace(entity, {text: "" + sceneItem.dialComp.name, fontSize: 3})
    //         } 
    //         else if (sceneItem.rComp) {
    //             Material.setPbrMaterial(entity, {
    //                 albedoColor: Color4.create(54/255, 209/255, 120/255, .5)
    //             })
    //             TextShape.createOrReplace(entity, {text: "Reward", fontSize: 3})
    //         }
    //         else {
    //             Material.setPbrMaterial(entity, {
    //                 albedoColor: Color4.create(54 / 255, 221 / 255, 192 / 255, .5)
    //             })
    //         }
    //     }
    // }
}

export function resetTweenPositions(entity: Entity, sceneItem: SceneItem, scene: IWBScene) {
    // if (sceneItem.actComp && sceneItem.actComp.actions) {
    //     sceneItem.actComp.actions.forEach((action: any) => {
    //         if (action.type === Actions.START_TWEEN) {
    //             let tweenData = Tween.getMutableOrNull(entity)
    //             tweenData ? tweenData.playing = false : null
    //             TweenSequence.deleteFrom(entity)
    //             Tween.deleteFrom(entity)

    //             Transform.createOrReplace(entity, {
    //                 parent: scene.parentEntity,
    //                 position: Vector3.create(sceneItem.p.x, sceneItem.p.y, sceneItem.p.z),
    //                 rotation: Quaternion.fromEulerDegrees(sceneItem.r.x, sceneItem.r.y, sceneItem.r.z),
    //                 scale: Vector3.create(sceneItem.s.x, sceneItem.s.y, sceneItem.s.z)
    //             })
    //         }
    //     });
    // }
}

export function enableTweenPlacementEntity() {
    // updateTweenEndDefaultAssetPosition()
    // switch (selectedItem.itemData.type) {
    //     case '3D':
    //         GltfContainer.createOrReplace(tweenPlacementEntity as Entity, {
    //             src: "assets/" + selectedItem.itemData.id + ".glb",
    //         })
    //         Transform.createOrReplace(tweenPlacementEntity as Entity, selectedItem.transform)
    //         Transform.getMutable(tweenPlacementEntity as Entity).parent = sceneBuilds.get(selectedItem.sceneId).parentEntity
    //         break;
    // }
}

export function disableTweenPlacementEntity() {
    // GltfContainer.deleteFrom(tweenPlacementEntity)
    // Transform.deleteFrom(tweenPlacementEntity)
    // MeshRenderer.deleteFrom(tweenPlacementEntity)
}

export function checkPlayerBuildRights(){
    let canBuild = false
    colyseusRoom.state.scenes.forEach((scene: IWBScene, key: string) => {
        if (scene.pcls.find((parcel) => parcel === localPlayer!.currentParcel && (scene.o === localUserId || scene.bps.find((permission) => permission === localUserId)))) {
            canBuild = true
        }
    })
    localPlayer.canBuild = canBuild
}

export function removeItem(entity:Entity){
    engine.removeEntity(entity)
    console.log('removing item', entity, showSceneInfoPanel)
    if(showSceneInfoPanel){
        updateRows()
        displaySceneAssetInfoPanel(true)
    }
}
