import {Quaternion, Vector3} from "@dcl/sdk/math"
import {getRandomString, log, roundQuaternion, roundVector} from "../../../helpers/functions"
import {items} from "../../catalog"
import {localUserId, players} from "../../player/player"
import {AvatarAnchorPointType, AvatarAttach, engine, Entity, GltfContainer, InputAction, MeshRenderer, PointerEvents, pointerEventsSystem, PointerEventType, Transform} from "@dcl/sdk/ecs"
import {cRoom, sendServerMessage} from "../../messaging";
import {EDIT_MODES, EDIT_MODIFIERS, IWBScene, IWB_MESSAGE_TYPES, Player, SERVER_MESSAGE_TYPES, SceneItem, SelectedItem} from "../../../helpers/types";
import { displayCatalogPanel } from "../../../ui/Panels/CatalogPanel"
import { entitiesFromItemIds, itemIdsFromEntities, sceneBuilds } from "../../scenes"
import { hideAllPanels } from "../../../ui/ui"

export let selectedItem:SelectedItem
export let playerParentEntities:Map<string, Entity> = new Map()//

export function sendServerEdit(axis:string, direction:number){
    sendServerMessage(SERVER_MESSAGE_TYPES.PLAYER_EDIT_ASSET, 
        {   item: selectedItem.entity,
            sceneId: selectedItem.sceneId,
            aid: selectedItem.aid,
            modifier: selectedItem.modifier,
            factor: selectedItem.factor,
            axis: axis, 
            direction: direction,
            editType: EDIT_MODIFIERS.TRANSFORM
        }
    )
}

export function transformObject(sceneId:string, aid:string, edit:EDIT_MODIFIERS, axis:string, value:number){
    let localScene = sceneBuilds.get(sceneId)
    if(localScene){
        let sceneAsset = localScene.ass.find((localasset:any)=> localasset.aid === aid)
        if(sceneAsset){
            log('we found scene asset entity', sceneAsset)
            let entity = entitiesFromItemIds.get(aid)
            if(entity){
                let transform = Transform.getMutable(entity)
                console.log('transform is', transform)
                switch(edit){
                    case EDIT_MODIFIERS.POSITION:
                        let pos:any = transform.position
                        pos[axis] = value
                        break;
            
                    case EDIT_MODIFIERS.ROTATION:
                        let rot:any = Quaternion.toEulerAngles(transform.rotation)
                        rot[axis] = value
                        transform.rotation = Quaternion.fromEulerDegrees(rot.x ,rot.y, rot.z)
                        break;
            
                    case EDIT_MODIFIERS.SCALE:
                        let scale:any = transform.scale
                        scale[axis] = value
                        break;
                }
                console.log('transform is mnow', transform)
            }
        }
    }
}

export function toggleModifier(){
    switch(selectedItem.modifier){
        case EDIT_MODIFIERS.POSITION:
            case EDIT_MODIFIERS.SCALE:
                if(selectedItem.factor === 1){
                    selectedItem.factor = 0.1
                }else if(selectedItem.factor === 0.1){
                    selectedItem.factor = 0.01
                }else if(selectedItem.factor === 0.01){
                    selectedItem.factor = 0.001
                }
                else if(selectedItem.factor === 0.001){
                    selectedItem.factor = 1
                }
            break;


        case EDIT_MODIFIERS.ROTATION:
            if(selectedItem.factor === 90){
                selectedItem.factor = 45
            }else if(selectedItem.factor === 45){
                selectedItem.factor = 15
            }else if(selectedItem.factor === 15){
                selectedItem.factor = 5
            }else if(selectedItem.factor === 5){
                selectedItem.factor = 1
            }
            else if(selectedItem.factor === 1){
                selectedItem.factor = 90
            }
            break;
    }
}

export function toggleEditModifier(modifier?:EDIT_MODIFIERS){
    if(modifier){
        selectedItem.modifier = modifier
    }else{
        if(selectedItem.modifier === EDIT_MODIFIERS.POSITION){
            selectedItem.modifier = EDIT_MODIFIERS.ROTATION
            selectedItem.factor = 90
        }
        else if(selectedItem.modifier === EDIT_MODIFIERS.ROTATION){
            selectedItem.modifier = EDIT_MODIFIERS.SCALE
            selectedItem.factor = 1
        }
        else if(selectedItem.modifier === EDIT_MODIFIERS.SCALE){
            selectedItem.modifier = EDIT_MODIFIERS.POSITION
            selectedItem.factor = 1
        }
    }
    console.log('modifier is now', selectedItem)
}

export function selectCatalogItem(id:any, mode:EDIT_MODES, already:boolean){
    displayCatalogPanel(false)

    let itemData = items.get(id)
    if(itemData){
        selectedItem ={
            mode:mode,
            modifier:EDIT_MODIFIERS.POSITION,
            factor:1,
            entity: engine.addEntity(),
            aid: getRandomString(6),
            catalogId:id,
            sceneId:"",
            itemData: itemData,
            enabled:true,
            already: already
        }

        if(already){
            addUseItemPointers(selectedItem.entity)
        }else{
            addUseCatalogItemPointers(selectedItem.entity)
        }

        let scale:any
        scale = Vector3.One()
    
        if(selectedItem.itemData.v && selectedItem.itemData.v > players.get(localUserId)!.version){
            log('this asset is not ready for viewing, need to add temporary asset')
            MeshRenderer.setBox(selectedItem.entity)

            if(selectedItem.itemData.bb){
                scale = Vector3.create(selectedItem.itemData.bb.x, selectedItem.itemData.bb.y, selectedItem.itemData.bb.z)
            }

        }else{
            log('this asset is ready for viewing, place object in scene', selectedItem.catalogId)
    
            //to do
            //add different asset types here//
    
            GltfContainer.create(selectedItem.entity, {src: 'assets/' + selectedItem.catalogId + ".glb"})
        }
        Transform.create(selectedItem.entity, {position: {x: 0, y: -.88, z: 4}, parent: engine.PlayerEntity})

        cRoom.send(SERVER_MESSAGE_TYPES.SELECT_CATALOG_ASSET, {user:localUserId, catalogId:id, assetId:selectedItem.aid})
    }
}

export function otherUserPlaceditem(info:any){
    let parent = playerParentEntities.get(info.user)
    if(parent){
        engine.removeEntity(parent)
    }
    // let transform = Transform.getMutable(ent)
    // transform.position = info.position
    // transform.scale = info.scale
    // transform.rotation = Quaternion.fromEulerDegrees(info.rotation.x, info.rotation.y, info.rotation.z)
    // player.selectedEntity = null
}

export function otherUserSelectedItem(info:any, catalog?:boolean){
    let parent = engine.addEntity()
    Transform.create(parent, {position:Vector3.create(0,2,0)})
    AvatarAttach.createOrReplace(parent, {
        avatarId: info.user,
        anchorPointId: AvatarAnchorPointType.AAPT_POSITION,
    })

    if(catalog){
        let itemData = items.get(info.catalogId)
        if(itemData){
            let entity = engine.addEntity()
            Transform.createOrReplace(entity, {position: {x: 0, y: .25, z: 4}, parent: parent})
            let scale:any
            scale = Vector3.One()
        
            if(itemData.v && itemData.v > players.get(localUserId)!.version){
                log('this asset is not ready for viewing, need to add temporary asset')
                MeshRenderer.setBox(entity)

                if(itemData.bb){
                    scale = Vector3.create(itemData.bb.x, itemData.bb.y, itemData.bb.z)
                }

            }else{
                log('this asset is ready for viewing, place object in scene', info.catalogId)
        
                //to do
                //add different asset types here//
        
                GltfContainer.create(entity, {src: 'assets/' + info.catalogId + ".glb"})
            }
            playerParentEntities.set(info.user, parent)
        }

    }else{
        let entity = entitiesFromItemIds.get(info.assetId)
        if(entity){
            Transform.createOrReplace(entity, {position: {x: 0, y: .25, z: 4}, parent: parent})
            playerParentEntities.set(info.user, parent)
        }
    }

    
    
}

export function otherUserRemovedSeletedItem(player:any){
    let parent = playerParentEntities.get(player)
    if(parent){
        engine.removeEntityWithChildren(parent)
    }
}

export function editItem(entity:Entity, mode:EDIT_MODES, already?:boolean){
    hideAllPanels()

    hideAllOtherPointers()
    PointerEvents.deleteFrom(entity)

    let assetId = itemIdsFromEntities.get(entity)
    console.log('found asset id', assetId)
    if(assetId){
        sceneBuilds.forEach((scene:IWBScene)=>{
            let sceneItem = scene.ass.find((asset)=> asset.aid === assetId)
            console.log('scene item is', sceneItem)
            if(sceneItem){

                log('clicked entity is', entity)
                log('scene for asset is', scene)

                let transform = Transform.get(entity)
                let transPos = Vector3.clone(transform.position)
                let transScal = Vector3.clone(transform.scale)
                let transRot = Quaternion.toEulerAngles(transform.rotation)

                selectedItem = {
                    mode: mode,
                    modifier:EDIT_MODIFIERS.POSITION,
                    factor:1,
                    entity: entity,
                    aid: assetId,
                    catalogId: sceneItem.id,
                    sceneId: scene.id,
                    itemData: sceneItem,
                    enabled:true,
                    already: already ? already : false,
                    transform: {position: transPos, rotation: Quaternion.fromEulerDegrees(transRot.x, transRot.y, transRot.z), scale: transScal}
                }
                log('selected item is', selectedItem)

                let itemdata = items.get(selectedItem.catalogId)
                log('selected item data is', itemdata)
                selectedItem.pointer = engine.addEntity()
                MeshRenderer.setBox(selectedItem.pointer)
                Transform.createOrReplace(selectedItem.pointer, {position: Vector3.create(0, itemdata!.bb.z + 1, 0), parent: selectedItem.entity})
                // cRoom.send(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, {user:localUserId, catalogId: sceneItem.id, assetId:assetId})
                return
            }
        })
    }
}

export function saveItem(){
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

    //     // sendServerMessage(
    //     //     SERVER_MESSAGE_TYPES.SCENE_UPDATE_ITEM,
    //     //     {baseParcel: scene.bpcl, item: {sceneId:scene.id, id: selectedItem.catalogId, position: roundVector(t.position, 2), rotation: roundVector(Quaternion.toEulerAngles(t.rotation), 2), scale: roundVector(t.scale, 2)}})
        
    //     selectedItem.enabled = false
    // }
}

export function dropSelectedItem(canceled?:boolean){
    const {position, rotation} = Transform.get(engine.PlayerEntity)
    const forwardVector = Vector3.rotate(Vector3.scale(Vector3.Forward(), 4), rotation)
    const finalPosition = Vector3.add(position, forwardVector)

    console.log('final position is', finalPosition)

    let parcel = "" + Math.floor(finalPosition.x/16) + "," + Math.floor(finalPosition.z/16)

    sceneBuilds.forEach((scene,key)=>{
        if(scene.pcls.find((sc:string)=> sc === parcel) && players.get(localUserId)?.canBuild){
            log('we can drop item here')

            PointerEvents.deleteFrom(selectedItem.entity)
            addBuildModePointers(selectedItem.entity)

            addAllBuildModePointers()

            players.get(localUserId)!.activeScene = scene

            const curSceneParent = scene.parentEntity
            const curSceneParentPosition = Transform.get(curSceneParent).position
        
            // adjust position to parent offset
            finalPosition.x = finalPosition.x - curSceneParentPosition.x
            finalPosition.z = finalPosition.z - curSceneParentPosition.z
        
            // update object transform
            let t = Transform.getMutable(selectedItem.entity)
            if(canceled){
                t = selectedItem.transform!
            }else{
                t.position.x = finalPosition.x
                t.position.z = finalPosition.z
                
                t.rotation.y =  rotation.y
                t.rotation.w = rotation.w
            }

            t.parent = curSceneParent

            log('new transform is', t)

            // if(selectedItem.already){
            //     log('dropping already selected item')
            //     // Transform.createOrReplace(selectedItem.entity, t)
            // }else{
                engine.removeEntity(selectedItem.entity)
            // }
        
            sendServerMessage(
                SERVER_MESSAGE_TYPES.SCENE_ADD_ITEM,
                {baseParcel: scene.bpcl, 
                    item: {
                        entity:selectedItem.entity,
                        sceneId:scene.id, 
                        aid: selectedItem.aid,
                        id: selectedItem.catalogId, 
                        position: roundVector(t.position, 2), 
                        rotation: roundVector(Quaternion.toEulerAngles(t.rotation), 2), 
                        scale: roundVector(t.scale, 2)
                    }
                }
            )
            selectedItem.enabled = false
            return
        }
    })
}

export function duplicateItem(entity:Entity){
    let assetId = itemIdsFromEntities.get(entity)
    console.log('found asset id', assetId)
    if(assetId){
        sceneBuilds.forEach((scene:IWBScene)=>{
            let sceneItem = scene.ass.find((asset)=> asset.aid === assetId)
            console.log('scene item is', sceneItem)
            if(sceneItem){
                selectCatalogItem(sceneItem.id, EDIT_MODES.GRAB, false)
                return
            }
        })
    }
}

export function grabItem(entity:Entity){
    hideAllPanels()

    hideAllOtherPointers()
    PointerEvents.deleteFrom(entity)

    let assetId = itemIdsFromEntities.get(entity)
    console.log('found asset id', assetId)
    if(assetId){
        sceneBuilds.forEach((scene:IWBScene)=>{
            let sceneItem = scene.ass.find((asset)=> asset.aid === assetId)
            console.log('scene item is', sceneItem)
            if(sceneItem){
                cRoom.send(SERVER_MESSAGE_TYPES.SELECTED_SCENE_ASSET, {user:localUserId, catalogId: sceneItem.id, assetId:assetId, sceneId: scene.id})

                let transform = Transform.get(entity)
                let transPos = Vector3.clone(transform.position)
                let transScal = Vector3.clone(transform.scale)
                let transRot = Quaternion.toEulerAngles(transform.rotation)

                selectedItem = {
                    mode: EDIT_MODES.GRAB,
                    modifier:EDIT_MODIFIERS.POSITION,
                    factor:1,
                    entity: engine.addEntity(),//
                    aid: getRandomString(6),
                    catalogId: sceneItem.id,
                    sceneId: scene.id,
                    itemData: sceneItem,
                    enabled:true,
                    already: true,
                    transform: {position: transPos, rotation: Quaternion.fromEulerDegrees(transRot.x, transRot.y, transRot.z), scale: transScal}
                }
                addUseItemPointers(selectedItem.entity)
        
                let scale:any
                scale = Vector3.One()
            
                if(selectedItem.itemData.v && selectedItem.itemData.v > players.get(localUserId)!.version){
                    log('this asset is not ready for viewing, need to add temporary asset')
                    MeshRenderer.setBox(selectedItem.entity)
        
                    if(selectedItem.itemData.bb){
                        scale = Vector3.create(selectedItem.itemData.bb.x, selectedItem.itemData.bb.y, selectedItem.itemData.bb.z)
                    }
        
                }else{
                    log('this asset is ready for viewing, place object in scene', selectedItem.catalogId)
            
                    //to do
                    //add different asset types here//
            
                    GltfContainer.create(selectedItem.entity, {src: 'assets/' + selectedItem.catalogId + ".glb"})
                }
                Transform.create(selectedItem.entity, {position: {x: 0, y: -.88, z: 4}, parent: engine.PlayerEntity})        
            }
        })
    }
    addUseItemPointers(entity)
    // let transform = Transform.getMutable(entity)
    // let rot = Quaternion.toEulerAngles(transform.rotation)
    // rot.y += 180
    // transform.rotation = Quaternion.fromEulerDegrees(rot.x, rot.y, rot.z)
    Transform.createOrReplace(selectedItem.entity, {position: {x: 0, y: -.88, z: 4}, parent: engine.PlayerEntity})
}

export function deleteSelectedItem(){
    sendServerDelete(selectedItem.entity)
    removeSelectedItem()
}

export function cancelSelectedItem(){
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


export function removeSelectedItem(){
    PointerEvents.deleteFrom(selectedItem.entity)
    engine.removeEntity(selectedItem.entity)
    selectedItem.enabled = false
    selectedItem.mode === EDIT_MODES.EDIT ? engine.removeEntity(selectedItem.pointer!) : null
    
    addAllBuildModePointers()
}

export function checkBuildPermissions(player:Player){
    let canbuild = false
    let activeScene = null
    sceneBuilds.forEach((scene:IWBScene, key:string)=>{
        if(scene.pcls.find((parcel) => parcel === player!.currentParcel && (scene.o === localUserId || scene.bps.find((permission)=> permission === localUserId)))){
            // console.log('player is on current owned parcel')
            canbuild = true
            activeScene = scene
        }
    })

    player.activeScene = activeScene

    if(canbuild){
        player.canBuild = true
    }else{
        player.canBuild = false
        player.activeScene = null
        if(selectedItem && selectedItem.enabled){
            // selectedItem.enabled = false
        }
    }
}

function addUseCatalogItemPointers(ent:Entity){
    PointerEvents.createOrReplace(ent, {
        pointerEvents: [
            {
                eventType: PointerEventType.PET_DOWN,
                eventInfo: {
                    button: InputAction.IA_SECONDARY,
                    hoverText: "Drop",
                }
            },
            {
                eventType: PointerEventType.PET_DOWN,
                eventInfo: {
                    button: InputAction.IA_ACTION_3,
                    hoverText: "Cancel",
                }
            }
        ]
    })
}

function addUseItemPointers(ent:Entity){
    PointerEvents.createOrReplace(ent, {
        pointerEvents: [
            {
                eventType: PointerEventType.PET_DOWN,
                eventInfo: {
                    button: InputAction.IA_SECONDARY,
                    hoverText: "Drop",
                }
            },
            {
                eventType: PointerEventType.PET_DOWN,
                eventInfo: {
                    button: InputAction.IA_PRIMARY,
                    hoverText: "Cancel",
                }
            },
            {
                eventType: PointerEventType.PET_DOWN,
                eventInfo: {
                    button: InputAction.IA_ACTION_3,
                    hoverText: "Delete",
                }
            }
        ]
    })
}

export function addBuildModePointers(ent:Entity){
    PointerEvents.createOrReplace(ent, {
        pointerEvents: [
            {
                eventType: PointerEventType.PET_DOWN,
                eventInfo: {
                    button: InputAction.IA_PRIMARY,
                    hoverText: "Delete",
                }
            },
            {
                eventType: PointerEventType.PET_DOWN,
                eventInfo: {
                    button: InputAction.IA_SECONDARY,
                    hoverText: "Edit",
                }
            },
            {
                eventType: PointerEventType.PET_DOWN,
                eventInfo: {
                    button: InputAction.IA_ACTION_3,
                    hoverText: "Grab",
                }
            },
            {
                eventType: PointerEventType.PET_DOWN,
                eventInfo: {
                    button: InputAction.IA_ACTION_4,
                    hoverText: "Duplicate",
                }
            }
        ]
    })
}

export function cancelCatalogItem(){
    sendServerMessage(SERVER_MESSAGE_TYPES.PLAYER_CANCELED_CATALOG_ASSET, {aid: selectedItem.aid, sceneId:selectedItem.sceneId})
    removeSelectedItem()
}

export function sendServerDelete(entity:Entity){
    let assetId = itemIdsFromEntities.get(entity)
    console.log('found asset id', assetId)
    if(assetId){
        sceneBuilds.forEach((scene:IWBScene)=>{
            log('this scene to find items to delete is', scene)
            let sceneItem = scene.ass.find((asset)=> asset.aid === assetId)
            console.log('scene item to delete is', sceneItem)
            if(sceneItem){
                sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_DELETE_ITEM, {assetId: assetId, sceneId:scene.id, entity:entity})
                return
            }
        })
    }
}

export function removeItem(sceneId:string, info:any){
    let scene = sceneBuilds.get(sceneId)
    console.log('scene is', scene)
    if(scene){
        let entity = entitiesFromItemIds.get(info.aid)
        if(entity){
            engine.removeEntity(entity)
            itemIdsFromEntities.delete(entity)
            entitiesFromItemIds.delete(info.aid)

            let assetIndex = scene.entities.findIndex((ent:Entity)=> ent === entity)
            if(assetIndex >= 0){
                scene.entities.splice(assetIndex,1)
            }
        }
    }
}

export function hideAllOtherPointers(){
    sceneBuilds.forEach((scene,key)=>{
        scene.entities.forEach((entity:Entity)=>{
            PointerEvents.deleteFrom(entity)
        })
    })
}

export function addAllBuildModePointers(){
    sceneBuilds.forEach((scene,key)=>{
        log('scene for poijnters is', scene)
        scene.entities.forEach((entity:Entity)=>{
            addBuildModePointers(entity)
        })
    })
}