import {Color4, Quaternion, Vector3} from "@dcl/sdk/math"
import {getRandomString, log, roundVector} from "../../../helpers/functions"
import {items} from "../../catalog"
import {iwbConfig, localPlayer, localUserId, players, settings} from "../../player/player"
import {
    AudioSource,
    AudioStream,
    AvatarAnchorPointType,
    AvatarAttach,
    ColliderLayer,
    engine,
    Entity,
    GltfContainer,
    InputAction,
    Material,
    MeshCollider,
    MeshRenderer,
    NftShape,
    PointerEvents,
    PointerEventType,
    TextShape,
    Transform,
    VideoPlayer,
    VisibilityComponent
} from "@dcl/sdk/ecs"
import {sendServerMessage} from "../../messaging";
import {COLLISION_LAYERS, EDIT_MODES, EDIT_MODIFIERS, IWBScene, Player, SceneItem, SelectedItem, SERVER_MESSAGE_TYPES, SOUND_TYPES} from "../../../helpers/types";
import {displayCatalogPanel, selectedSetting} from "../../../ui/Panels/CatalogPanel"
import {entitiesFromItemIds, itemIdsFromEntities, realm, sceneBuilds} from "../../scenes"
import {hideAllPanels} from "../../../ui/ui"
import { displaySceneAssetInfoPanel, showSceneInfoPanel } from "../../../ui/Panels/sceneInfoPanel"
import { openEditComponent } from "../../../ui/Panels/edit/EditObjectDataPanel"
import {addTriggerArea, updateAudioComponent, updateImageUrl, updateNFTFrame, updateTextComponent} from "../../scenes/components"
import { displaySceneInfoPanel } from "../../../ui/Panels/builds/buildsIndex"
import { playSound } from "../../sounds"
import { utils } from "../../../helpers/libraries"
import { checkAnimation, disableAnimations } from "../play"
import { displayHover, updateContextEvents } from "../../../ui/contextMenu"
import { displayConfirmDeletePanel } from "../../../ui/Panels/confirmDeleteItemPanel"

export let editAssets:Map<string, Entity> = new Map()
export let grabbedAssets:Map<string, Entity> = new Map()
export let selectedItem: SelectedItem
export let playerParentEntities: Map<string, Entity> = new Map()

let ITEM_DEPTH_DEFAULT = 4
let ITEM_HEIGHT_DEFAULT = -.88

function getFactor(mod:EDIT_MODIFIERS){
    switch(mod){
        case EDIT_MODIFIERS.POSITION:
            return selectedItem.pFactor

        case EDIT_MODIFIERS.ROTATION:
            return selectedItem.rFactor

        case EDIT_MODIFIERS.SCALE:
            return selectedItem.sFactor
    }
}

export function sendServerEdit(modifier:EDIT_MODIFIERS, axis: string, direction: number, manual:boolean, manualMod?:EDIT_MODIFIERS, value?:number) {
    sendServerMessage(SERVER_MESSAGE_TYPES.PLAYER_EDIT_ASSET,
        {
            item: selectedItem.entity,
            sceneId: selectedItem.sceneId,
            aid: selectedItem.aid,
            modifier: manual ? manualMod : modifier,
            factor: getFactor(modifier),
            axis: axis,
            direction: direction,
            editType: EDIT_MODIFIERS.TRANSFORM,
            manual:manual,
            value: value ? value : 0,
            // ugc: selectedItem.hasOwnProperty("ugc") ? selectedItem.ugc : false
        }
    )
}

export function transformObject(sceneId: string, aid: string, edit: EDIT_MODIFIERS, axis: string, value: number) {
    let localScene = sceneBuilds.get(sceneId)
    if (localScene) {
        let sceneAsset = localScene.ass.find((localasset: any) => localasset.aid === aid)
        if (sceneAsset) {
            log('we found scene asset entity', sceneAsset)
            let entity = entitiesFromItemIds.get(aid)
            if (entity) {
                let transform = Transform.getMutable(entity)
                console.log('transform is', transform)
                switch (edit) {
                    case EDIT_MODIFIERS.POSITION:
                        let pos: any = transform.position
                        pos[axis] = value
                        break;

                    case EDIT_MODIFIERS.ROTATION:
                        let rot: any = Quaternion.toEulerAngles(transform.rotation)
                        rot[axis] = value
                        transform.rotation = Quaternion.fromEulerDegrees(rot.x, rot.y, rot.z)
                        break;

                    case EDIT_MODIFIERS.SCALE:
                        let scale: any = transform.scale
                        scale[axis] = value
                        break;
                }
                console.log('transform is mnow', transform)
            }
        }
    }
}

export function toggleModifier(mod:EDIT_MODIFIERS) {
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
// }

export function selectCatalogItem(id: any, mode: EDIT_MODES, already: boolean, duplicate?:any) {
    if (selectedItem && selectedItem.enabled && selectedItem.entity && selectedItem.mode === EDIT_MODES.GRAB) {
        log("Already holding item")
        return
    }

    displayCatalogPanel(false)
    playSound(SOUND_TYPES.SELECT_3)

    let itemData = items.get(id)
    if (itemData) {
        selectedItem = {
            n: itemData.n,
            mode: mode,
            modifier: EDIT_MODIFIERS.POSITION,
            pFactor: 1,
            sFactor:1,
            rFactor:90,
            entity: engine.addEntity(),
            aid: getRandomString(6),
            catalogId: id,
            sceneId: "",
            itemData: itemData,
            enabled: true,
            already: already,
            initialHeight: ITEM_HEIGHT_DEFAULT,
            duplicate: duplicate ? duplicate : false,
            ugc: itemData.hasOwnProperty("ugc") ? itemData.ugc : false,
            isCatalogSelect: true
        }

        if (already) {
            addUseItemPointers(selectedItem.entity)
        } else {
            addUseCatalogItemPointers(selectedItem.entity)
        }

        displayHover(true)

        let scale: any
        scale = Vector3.One()

        // TODO use configurable parameters for item height and depth
        let itemHeight = ITEM_HEIGHT_DEFAULT
        let itemDepth = ITEM_DEPTH_DEFAULT

        let itemPosition = {x: 0, y: itemHeight, z: itemDepth}

        if ((selectedItem.ugc && selectedItem.itemData.v && selectedItem.itemData.v > localPlayer.worlds.find((w:any)=> w.ens === realm).cv) || (selectedItem.itemData.v && selectedItem.itemData.v > localPlayer.version)){
            log('this asset is not ready for viewing, need to add temporary asset')
            MeshRenderer.setBox(selectedItem.entity)

            if (selectedItem.itemData.bb) {
                scale = Vector3.create(selectedItem.itemData.bb.x, selectedItem.itemData.bb.z, selectedItem.itemData.bb.y)
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
                TextShape.create(selectedItem.entity, {text: "Text", fontSize:1})
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
            } 
            else if (selectedItem.itemData.ty === "SM") {
                MeshRenderer.setBox(selectedItem.entity)
                itemPosition = {x: 0, y: .5, z: itemDepth}
                selectedItem.initialHeight = .88
                scale = Vector3.create(1,1,1)
                MeshCollider.setBox(selectedItem.entity, ColliderLayer.CL_POINTER)
            }  
            else if (selectedItem.itemData.ty === "Audio"){
                MeshRenderer.setBox(selectedItem.entity)
                itemPosition = {x: 0, y: .5, z: itemDepth}
                selectedItem.initialHeight = .88
                scale = Vector3.create(.5, .5, .5)
                MeshCollider.setBox(selectedItem.entity, ColliderLayer.CL_POINTER)    
            }
            else {
                if(selectedItem.itemData.pending){
                    MeshRenderer.setBox(selectedItem.entity)
                }else{
                    GltfContainer.create(selectedItem.entity, {src: 'assets/' + selectedItem.catalogId + ".glb",
                        invisibleMeshesCollisionMask: ColliderLayer.CL_POINTER,
                        visibleMeshesCollisionMask: ColliderLayer.CL_POINTER,
                    })

                }
            }
        }

        if(duplicate){
            Transform.createOrReplace(selectedItem.entity, {position: itemPosition, scale:duplicate.s, parent: engine.PlayerEntity})
        }
        else{
            Transform.createOrReplace(selectedItem.entity, {position: itemPosition, scale, parent: engine.PlayerEntity})
        }

        sendServerMessage(SERVER_MESSAGE_TYPES.SELECT_CATALOG_ASSET, {
            user: localUserId,
            catalogId: id,
            assetId: selectedItem.aid,
            ugc: selectedItem.ugc
        })
    }
}

export function otherUserPlaceditem(info: any) {
    let parent = playerParentEntities.get(info.user)
    if (parent) {
        engine.removeEntity(parent)
    }
    playerParentEntities.delete(info.user)
    // let transform = Transform.getMutable(ent)//
    // transform.position = info.position
    // transform.scale = info.scale
    // transform.rotation = Quaternion.fromEulerDegrees(info.rotation.x, info.rotation.y, info.rotation.z)
    // player.selectedEntity = null
}

export function otherUserSelectedItem(info: any, catalog?: boolean) {
    log('other user selected item', info, catalog)
    try{
        let parent = engine.addEntity()
        Transform.createOrReplace(parent, {position: Vector3.create(0, 2, 0)})
        AvatarAttach.createOrReplace(parent, {
            avatarId: info.user,
            anchorPointId: AvatarAnchorPointType.AAPT_POSITION,
        })

    
        let itemData = items.get(info.catalogId)
        if (itemData) {
            let entity = engine.addEntity()
            let scale: any
            scale = Vector3.create(2,2,1)

            if (itemData.v && itemData.v > players.get(localUserId)!.version) {
                log('this asset is not ready for viewing, need to add temporary asset')
                MeshRenderer.setBox(entity)
    
                if (itemData.bb) {
                    scale = Vector3.create(itemData.bb.x, itemData.bb.y, itemData.bb.z)
                }
    
            } else {
                log('this asset is ready for viewing, place object in scene', info.catalogId)
                addGrabbedComponent(entity, info.catalogId, !info.catalogAsset ? info.componentData : undefined)
                !info.catalogAsset ? scale = info.componentData.s : null
            }
    
            Transform.createOrReplace(entity, {position: {x: 0, y: .25, z: 4}, scale: scale, parent: parent})
    
            playerParentEntities.set(info.user, parent)
            grabbedAssets.set(info.assetId, entity)
        }
    }
    catch(e){
        log('error attaching other user item', e)
    }
}

export function otherUserRemovedSeletedItem(player: any) {
    let parent = playerParentEntities.get(player)
    if (parent) {
        engine.removeEntityWithChildren(parent)
    }
}

export function updateGrabbedYAxis(info:any){
    let ent = grabbedAssets.get(info.aid)
    log('entity is', ent)
    if(ent){
        log('updating entity position', info)
        Transform.getMutable(ent).position.y = info.y + 1.25
    }
}

export function editItem(entity: Entity, mode: EDIT_MODES, already?: boolean) {
    hideAllPanels()

    let assetId = itemIdsFromEntities.get(entity)
    console.log('found asset id', assetId)
    if (assetId) {
        sceneBuilds.forEach((scene: IWBScene) => {
            let sceneItem = scene.ass.find((asset) => asset.aid === assetId)
            console.log('scene item is', sceneItem)
            if (sceneItem) {

                if(sceneItem.locked){
                    playSound(SOUND_TYPES.ERROR_2)
                    return 
                }

                hideAllOtherPointers()

                PointerEvents.deleteFrom(entity)
                log('clicked entity is', entity)
                log('scene for asset is', scene)

                let transform = Transform.get(entity)
                let transPos = Vector3.clone(transform.position)
                let transScal = Vector3.clone(transform.scale)
                let transRot = Quaternion.toEulerAngles(transform.rotation)

                selectedItem = {
                    duplicate:false,
                    mode: mode,
                    n: sceneItem.n,
                    modifier: EDIT_MODIFIERS.POSITION,
                    pFactor:1,
                    sFactor:1,
                    rFactor:90,
                    entity: entity,
                    aid: assetId,
                    catalogId: sceneItem.id,
                    sceneId: scene.id,
                    itemData: sceneItem,
                    enabled: true,
                    already: already ? already : false,
                    initialHeight: transPos.y,
                    transform: {
                        position: transPos,
                        rotation: Quaternion.fromEulerDegrees(transRot.x, transRot.y, transRot.z),
                        scale: transScal
                    },
                    ugc: sceneItem.ugc
                }
                log('selected item is', selectedItem)

                let itemdata = items.get(selectedItem.catalogId)
                log('selected item data is', itemdata)

                addSelectionPointer(itemdata)

                sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, {user:localUserId, item:{catalogId: sceneItem.id, aid:assetId, sceneId: selectedItem.sceneId}})
                return
            }
        })
    }
}

export function saveItem() {
    PointerEvents.deleteFrom(selectedItem.entity)
    addBuildModePointers(selectedItem.entity)
    addAllBuildModePointers()

    selectedItem.enabled = false
    selectedItem.mode === EDIT_MODES.EDIT ? engine.removeEntity(selectedItem.pointer!) : null

    // let scene = sceneBuilds.get(selectedItem.sceneId)
    // let t = Transform.get(selectedItem.entity)
    // if(scene){
    //     PointerEvents.deleteFrom(selectedItem.entity)
    //     addBuildModePointers(selectedItem.entity)

    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET_DONE, 
        {
            user:localUserId, 
            item:{
                catalogId: selectedItem.catalogId, 
                aid: selectedItem.aid, 
                sceneId: selectedItem.sceneId
            }
        })

    //     selectedItem.enabled = false
    // }

    hideAllPanels()
    openEditComponent("")

    //check Trigger Area Items
    if(selectedItem.itemData.trigArComp){
        utils.triggers.removeTrigger(selectedItem.entity)
        let scene = sceneBuilds.get(selectedItem.sceneId)
        if(scene){
            addTriggerArea(scene, selectedItem.entity, selectedItem.itemData, items.get(selectedItem.catalogId)!.n)
        }
    }
}

export function dropSelectedItem(canceled?: boolean, editing?:boolean) {

    if(editing){
        selectedItem.enabled = false
        PointerEvents.deleteFrom(selectedItem.entity)
        addBuildModePointers(selectedItem.entity)

        addAllBuildModePointers()

        if(selectedItem.pointer)
            engine.removeEntity(selectedItem.pointer)

        return
    }

    const {position: playerPosition, rotation: playerRotation} = Transform.get(engine.PlayerEntity)
    const forwardVector = Vector3.rotate(Vector3.scale(Vector3.Forward(), 4), playerRotation)
    const finalPosition = Vector3.add(playerPosition, forwardVector)

    console.log('final position is', finalPosition)

    let parcel = "" + Math.floor(finalPosition.x / 16) + "," + Math.floor(finalPosition.z / 16)

    let canDrop = false
    sceneBuilds.forEach((scene, key) => {
        if (scene.pcls.find((sc: string) => sc === parcel) && localPlayer.canBuild) {
            log('we can drop item here')
            canDrop = true
            playSound(SOUND_TYPES.DROP_1_STEREO)

            if(PointerEvents.has(selectedItem.entity)) PointerEvents.deleteFrom(selectedItem.entity)
            // addBuildModePointers(selectedItem.entity)

            addAllBuildModePointers()

            localPlayer.activeScene = scene

            const curSceneParent = scene.parentEntity
            const curSceneParentPosition = Transform.get(curSceneParent).position

            // adjust position to parent offset
            finalPosition.x = finalPosition.x - curSceneParentPosition.x
            finalPosition.z = finalPosition.z - curSceneParentPosition.z

            // update object transform
            let t = Transform.getMutable(selectedItem.entity)
            if (canceled) {
                t = selectedItem.transform!
            } else {
                t.position.x = finalPosition.x
                t.position.y = t.position.y + playerPosition.y
                t.position.z = finalPosition.z

                if(selectedItem.isCatalogSelect){
                    t.rotation.y = playerRotation.y
                    t.rotation.w = playerRotation.w

                } else {

                    let eulRot = Quaternion.toEulerAngles(t.rotation)
                    let pEulRot = Quaternion.toEulerAngles(playerRotation)

                    t.rotation = Quaternion.fromEulerDegrees(
                        eulRot.x,
                        eulRot.y + pEulRot.y,
                        eulRot.z
                    )
                }
            }

            t.parent = curSceneParent

            log('new transform is', t)
            log('new rot is', Quaternion.toEulerAngles(t.rotation))

            // if(selectedItem.already){
            //     log('dropping already selected item')
            //     // Transform.createOrReplace(selectedItem.entity, t)
            // }else{//
            engine.removeEntity(selectedItem.entity)
            // }

            grabbedAssets.delete(selectedItem.aid)

            sendServerMessage(
                SERVER_MESSAGE_TYPES.SCENE_ADD_ITEM,
                {
                    baseParcel: scene.bpcl,
                    item: {
                        entity: selectedItem.entity,
                        sceneId: scene.id,
                        aid: selectedItem.aid,
                        id: selectedItem.catalogId,
                        position: roundVector(t.position, 2),
                        rotation: roundVector(Quaternion.toEulerAngles(t.rotation), 2),
                        scale: roundVector(t.scale, 2),
                        duplicate: selectedItem.duplicate,
                        ugc: selectedItem.ugc
                    }
                }
            )
            selectedItem.enabled = false
            return
        }
    })

    if(!canDrop){
        console.log('player cant build here')
        playSound(SOUND_TYPES.ERROR_2)
    }
}

export function duplicateItem(entity: Entity) {
    let assetId = itemIdsFromEntities.get(entity)
    console.log('found asset id', assetId)
    if (assetId) {
        sceneBuilds.forEach((scene: IWBScene) => {
            let sceneItem = scene.ass.find((asset) => asset.aid === assetId)
            console.log('scene item is', sceneItem)
            if (sceneItem) {
                selectCatalogItem(sceneItem.id, EDIT_MODES.GRAB, false, sceneItem)
                return
            }
        })
    }
}


export function confirmGrabItem(asset:SceneItem){
    console.log('confirming grabbed item', asset.aid)
    let entity = entitiesFromItemIds.get(asset.aid)
    if(entity){
        console.log("confirmed grabbed item entity exists")
        let transform = Transform.get(entity!)
        let transPos = Vector3.clone(transform.position)
        let transScal = Vector3.clone(transform.scale)
        let transRot = Quaternion.toEulerAngles(transform.rotation)
    
        selectedItem = {
            n:asset.n,//
            duplicate:false,
            mode: EDIT_MODES.GRAB,
            modifier: EDIT_MODIFIERS.POSITION,
            pFactor:1,
            sFactor:1,
            rFactor:90,
            entity: engine.addEntity(),
            aid: asset.aid,
            catalogId: asset.id,
            sceneId: asset.id,
            itemData: asset,
            enabled: true,
            already: true,
            transform: {
                position: transPos,
                rotation: Quaternion.fromEulerDegrees(transRot.x, transRot.y, transRot.z),
                scale: transScal
            },
            initialHeight: transPos.y - .88,
            ugc: asset.ugc
        }
        addUseItemPointers(selectedItem.entity)
    
        let scale: any
        scale = transScal
        log('grabbed scale is', scale)
    
        let config = players.get(localUserId)!.worlds.find((w)=> w.ens === realm)
    
        if (selectedItem.itemData.v && selectedItem.itemData.v > config.v) {
            // log('this asset is not ready for viewing, need to add temporary asset')
            MeshRenderer.setBox(selectedItem.entity)
    
            if (selectedItem.itemData.bb) {
                scale = Vector3.create(selectedItem.itemData.bb.x, selectedItem.itemData.bb.y, selectedItem.itemData.bb.z)
            }
    
        } else {
            // log('this asset is ready for viewing, place object in scene', selectedItem.catalogId)
            addGrabbedComponent(selectedItem.entity, selectedItem.itemData.id, selectedItem.itemData)
        }
    
        if(GltfContainer.has(selectedItem.entity)){
            GltfContainer.getMutable(selectedItem.entity).invisibleMeshesCollisionMask = ColliderLayer.CL_POINTER
            GltfContainer.getMutable(selectedItem.entity).visibleMeshesCollisionMask = ColliderLayer.CL_POINTER
        }
    
        addUseItemPointers(entity!)
    
        const {rotation:playerRot} = Transform.get(engine.PlayerEntity)
        const euler = Quaternion.toEulerAngles(playerRot)
    
        Transform.createOrReplace(
            selectedItem.entity,
            {
                position: {x: 0, y: -.88, z: 4},
                scale: scale,
                rotation:Quaternion.fromEulerDegrees(euler.x - transRot.x, transRot.y - euler.y , euler.z - transRot.z) ,
                parent: engine.PlayerEntity
            })
    
        grabbedAssets.set(selectedItem.itemData.aid, entity!)
    }else{
        console.log('confirm grab item that doesnt exist', asset)
    }
}

export function grabItem(entity: Entity) {
    hideAllPanels()

    let assetId = itemIdsFromEntities.get(entity)
    if (assetId) {
        sceneBuilds.forEach((scene: IWBScene) => {
            let sceneItem:SceneItem | undefined = scene.ass.find((asset) => asset.aid === assetId)
            console.log('scene item is', sceneItem)
            if(sceneItem && !sceneItem.editing) {
                if(sceneItem.locked){
                    playSound(SOUND_TYPES.ERROR_2)
                    return
                }

                hideAllOtherPointers()

                if(PointerEvents.has(entity)) PointerEvents.deleteFrom(entity)
                sendServerMessage(SERVER_MESSAGE_TYPES.SELECTED_SCENE_ASSET, {
                    user: localUserId,
                    catalogId: sceneItem.id,
                    assetId: assetId,
                    sceneId: scene.id,
                })
                playSound(SOUND_TYPES.SELECT_3)
                return
            }
        })
    }
    // addUseItemPointers(entity)
    // let transform = Transform.getMutable(entity)
    // let rot = Quaternion.toEulerAngles(transform.rotation)
    // rot.y += 180
    // transform.rotation = Quaternion.fromEulerDegrees(rot.x, rot.y, rot.z)
    // Transform.createOrReplace(selectedItem.entity, {position: {x: 0, y: -.88, z: 4}, parent: engine.PlayerEntity})
}

export function deleteSelectedItem() {
    sendServerDelete(selectedItem.entity)
    removeSelectedItem()
}

export function cancelSelectedItem() {
    log('canceled selected item is', selectedItem)
    dropSelectedItem(true)
    // let scene = sceneBuilds.get(selectedItem.sceneId)
    // if(scene){
    //     Transform.createOrReplace(selectedItem.entity, {parent:scene.parentEntity, position:selectedItem.transform!.position, rotation:selectedItem.transform!.rotation, scale: selectedItem.transform!.scale})

    //     PointerEvents.deleteFrom(selectedItem.entity)
    //     addBuildModePointers(selectedItem.entity)
    //     addAllBuildModePointers()

    //     selectedItem.enabled = false
    //     selectedItem.mode === EDIT_MODES.EDIT ? engine.removeEntity(selectedItem.pointer!) : null
    // }else{
    //     log('no scene found to cancel selected item')
    // }
}

export function cancelEditingItem() {
    log('canceled editing item is', selectedItem)
    openEditComponent("")
    dropSelectedItem(true, true)
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET_CANCEL,//
        {
            user:localUserId, 
            item:{
                catalogId: selectedItem.catalogId, 
                aid: selectedItem.aid, 
                sceneId: selectedItem.sceneId
            }
        })
}

function addGrabbedComponent(entity:Entity, catalogId:string, itemData:any) {
    let catalogItem = items.get(catalogId)
    if (catalogItem) {
        switch (catalogItem.ty) {
            case '3D':
                GltfContainer.create(entity, {src: "assets/" + catalogId + ".glb"})
                break;

            case '2D':
                switch (catalogItem!.n) {
                    case 'Image':
                    case 'Video':
                        MeshRenderer.setPlane(entity)
                        MeshCollider.setPlane(entity)
                        if (itemData) {
                            updateImageUrl(itemData.aid, itemData.matComp, itemData.imgComp.url, entity)
                        }
                        break;

                    case 'NFT Frame':
                        if (itemData) {
                            log('we have nft data to update!', itemData.nftComp)
                            NftShape.createOrReplace(entity, {
                                urn: 'urn:decentraland:ethereum:erc721:' + itemData.nftComp.contract + ':' + itemData.nftComp.tokenId,
                                style: itemData.nftComp.style
                            })
                            updateNFTFrame(itemData.aid, itemData.matComp, itemData.nftComp, entity)
                        } else {
                            MeshRenderer.setPlane(entity)
                            MeshCollider.setPlane(entity)
                        }
                        break;

                    case 'Text':
                        if (itemData) {
                            updateTextComponent(itemData.aid, itemData.matComp, itemData.textComp, entity)
                        } else {
                            TextShape.createOrReplace(entity, {
                                text: "Text",
                            })
                        }
                        break;

                }
                break;

            case 'Audio':
                if(itemData && itemData.audComp) {
                    updateAudioComponent(itemData.aid, itemData.id, itemData.audComp)
                }
                MeshRenderer.setBox(selectedItem.entity)
                MeshCollider.setBox(selectedItem.entity)
                break;
        }
    }
}



export function removeSelectedItem() {
    PointerEvents.deleteFrom(selectedItem.entity)
    engine.removeEntity(selectedItem.entity)
    selectedItem.enabled = false
    selectedItem.mode === EDIT_MODES.EDIT ? engine.removeEntity(selectedItem.pointer!) : null

    addAllBuildModePointers()
}

function addUseCatalogItemPointers(ent: Entity) {
    PointerEvents.createOrReplace(ent, {
        pointerEvents: [
            {
                eventType: PointerEventType.PET_DOWN,
                eventInfo: {
                    button: InputAction.IA_ACTION_3,
                    hoverText: "Cancel",
                    showFeedback:false
                }
            },
            {
                eventType: PointerEventType.PET_DOWN,
                eventInfo: {
                    button: InputAction.IA_PRIMARY,
                    hoverText: "Place",
                    showFeedback:false
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
                    showFeedback:false
                }
            },
            {
                eventType: PointerEventType.PET_HOVER_LEAVE,
                eventInfo: {
                    showFeedback:false
                }
            },
            {
                eventType: PointerEventType.PET_DOWN,
                eventInfo: {
                    button: InputAction.IA_ACTION_3,
                    hoverText: "Cancel",
                    showFeedback:false
                }
            },
            {
                eventType: PointerEventType.PET_DOWN,
                eventInfo: {
                    button: InputAction.IA_PRIMARY,
                    hoverText: "Place",
                    showFeedback:false
                }
            },
            {
                eventType: PointerEventType.PET_DOWN,
                eventInfo: {
                    button: InputAction.IA_SECONDARY,
                    hoverText: "Delete",
                    showFeedback:false
                }
            },
        ]
    })
}


export function addBuildModePointers(ent: Entity) {
    PointerEvents.createOrReplace(ent, {
        pointerEvents: [
            {
                eventType: PointerEventType.PET_HOVER_ENTER,
                eventInfo: {
                    showFeedback:false,
                    maxDistance:500
                }
            },
            {
                eventType: PointerEventType.PET_HOVER_LEAVE,
                eventInfo: {
                    showFeedback:false
                }
            },
            {
                eventType: PointerEventType.PET_DOWN,
                eventInfo: {
                    button: InputAction.IA_ACTION_3,
                    hoverText: "Edit",
                    showFeedback:false
                }
            },
            {
                eventType: PointerEventType.PET_DOWN,
                eventInfo: {
                    button: InputAction.IA_PRIMARY,
                    hoverText: "Grab",
                    showFeedback:false
                }
            },
            {
                eventType: PointerEventType.PET_DOWN,
                eventInfo: {
                    button: InputAction.IA_ACTION_4,
                    hoverText: "Duplicate",
                    showFeedback:false
                }
            },
            {
                eventType: PointerEventType.PET_DOWN,
                eventInfo: {
                    button: InputAction.IA_SECONDARY,
                    hoverText: "Delete",
                    showFeedback:false
                }
            },
        ]
    })
}

export function cancelCatalogItem() {
    sendServerMessage(SERVER_MESSAGE_TYPES.PLAYER_CANCELED_CATALOG_ASSET, {
        aid: selectedItem.aid,
        sceneId: selectedItem.sceneId
    })
    removeSelectedItem()
}

export function sendServerDelete(entity: Entity) {
    let assetId = itemIdsFromEntities.get(entity)
    console.log('found asset id', assetId)
    if (assetId) {
        sceneBuilds.forEach((scene: IWBScene) => {
            log('this scene to find items to delete is', scene)
            let sceneItem = scene.ass.find((asset) => asset.aid === assetId)
            console.log('scene item to delete is', sceneItem)
            if (sceneItem) {
                sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_DELETE_ITEM, {
                    assetId: assetId,
                    sceneId: scene.id,
                    entity: entity
                })
                return
            }
        })
    }
}

export function removeItem(sceneId: string, info: any) {
    let scene = sceneBuilds.get(sceneId)
    console.log('scene is', scene)
    if (scene) {
        let entity = entitiesFromItemIds.get(info.aid)
        if (entity) {
            engine.removeEntity(entity)
            itemIdsFromEntities.delete(entity)
            entitiesFromItemIds.delete(info.aid)
        
            let assetIndex = scene.entities.findIndex((ent: Entity) => ent === entity)
            if (assetIndex >= 0) {
                scene.entities.splice(assetIndex, 1)
            }
        
            if(showSceneInfoPanel){
                displaySceneAssetInfoPanel(true)
            }
        }
    }
}

export function hideAllOtherPointers() {
    sceneBuilds.forEach((scene, key) => {
        scene.entities.forEach((entity: Entity) => {
            PointerEvents.deleteFrom(entity)
        })
    })
}

export function addAllBuildModePointers() {
    sceneBuilds.forEach((scene, key) => {
        log('scene for poijnters is', scene)
        scene.entities.forEach((entity: Entity) => {
            addBuildModePointers(entity)
        })
    })
}


export function resetEntityForBuildMode(scene:IWBScene, entity:Entity){
    let assetId = itemIdsFromEntities.get(entity)
    if(assetId){
        let sceneItem = scene.ass.find((a)=> a.aid === assetId)
        if(sceneItem){
            VisibilityComponent.createOrReplace(entity, {
                visible: sceneItem.buildVis
            })

            check2DCollision(entity, sceneItem)
            checkAudio(entity, sceneItem, scene.parentEntity)
            checkVideo(entity, sceneItem)
            checkSmartItems(entity, sceneItem)
            disableAnimations(entity, sceneItem)
        }
    }
}

export function addSelectionPointer(itemdata:any){
    selectedItem.pointer = engine.addEntity()
    MeshRenderer.setBox(selectedItem.pointer)
    Transform.createOrReplace(selectedItem.pointer, {
        position: Vector3.create(0, itemdata!.bb.z + 1, 0),
        parent: selectedItem.entity
    })
}

export function addEditSelectionPointer(aid:string, itemData:any){
    let ent = entitiesFromItemIds.get(aid)
    if(ent){
        let edit = engine.addEntity()
        MeshRenderer.setBox(edit)
        Transform.createOrReplace(edit, {
            position: Vector3.create(0, itemData.bb.z + 1, 0),
            parent: ent
        })
        editAssets.set(aid, edit)
    }
}

export function removeSelectionPointer(){
    engine.removeEntity(selectedItem.entity)
}

export function removeEditSelectionPointer(aid:string){
    let ent = editAssets.get(aid)
    if(ent){
        engine.removeEntity(ent)
    }
    editAssets.delete(aid)
}


function check2DCollision(entity:Entity, sceneItem: SceneItem){
    if(sceneItem.type === "2D"){
        MeshRenderer.setPlane(entity)
       
        if(sceneItem.colComp.iMask === 2 || sceneItem.colComp.vMask === 2){
            MeshCollider.setPlane(entity)
        }else{
            MeshCollider.setPlane(entity, ColliderLayer.CL_POINTER)
        }
    }
    // if(sceneItem.type === "2D" && sceneItem.textComp){
    //     MeshRenderer.setPlane(entity)
    // }
}

function checkAudio(entity:Entity, sceneItem: SceneItem, parent:Entity){
    if(sceneItem.audComp){
        MeshRenderer.setBox(entity)
        MeshCollider.setBox(entity, ColliderLayer.CL_POINTER)

        let audio:any

        if(sceneItem.id !== "e6991f31-4b1e-4c17-82c2-2e484f53a124"){
            audio = AudioSource.getMutable(entity)
        }else{
            audio = AudioStream.getMutable(entity)
        }

        Transform.createOrReplace(entity, {parent:parent, position:sceneItem.p, rotation:Quaternion.fromEulerDegrees(sceneItem.r.x, sceneItem.r.y, sceneItem.r.z), scale:sceneItem.s})

        Material.setPbrMaterial(entity,{
            albedoColor: Color4.create(0,0,1,.5)
        })

        if(sceneItem.audComp.attachedPlayer){
            TextShape.createOrReplace(entity,{text:"Audio\nAttached", fontSize: 3})

        }else{
            TextShape.createOrReplace(entity,{text:"Audio\nPlaced", fontSize: 3})
        }

        audio.playing = false
    }
}

function checkVideo(entity:Entity, sceneItem: SceneItem){
    if(sceneItem.vidComp){
        VideoPlayer.getMutable(entity).playing = false
    }
}

function checkSmartItems(entity:Entity, sceneItem: SceneItem){
    if(sceneItem.type === "SM"){//
        MeshCollider.setBox(entity, ColliderLayer.CL_POINTER)

        if(sceneItem.id === "78f04fcf-5c50-4001-840c-6ba717ce6037"){
            // Transform.getMutable(entity).scale = Vector3.create(1,3,1)
            // MeshRenderer.setBox(entity)

        }
        else{
            MeshRenderer.setBox(entity)

            if(sceneItem.trigArComp){
                Material.setPbrMaterial(entity,{ 
                    albedoColor: Color4.create(1,1,0,.5)
                })
                utils.triggers.enableTrigger(entity, false)
            }else{
                Material.setPbrMaterial(entity,{
                    albedoColor: Color4.create(54/255,221/255,192/255, .5)
                })
            }
        }
    }
}