import {Quaternion, Vector3} from "@dcl/sdk/math"
import {getRandomString, log, roundQuaternion, roundVector} from "../../../helpers/functions"
import {items} from "../../catalog"
import {localUserId, players} from "../../player/player"
import {engine, Entity, GltfContainer, InputAction, MeshRenderer, PointerEvents, pointerEventsSystem, PointerEventType, Transform} from "@dcl/sdk/ecs"
import {sceneMessageBus, sendServerMessage} from "../../messaging";
import {EDIT_MODES, EDIT_MODIFIERS, IWBScene, IWB_MESSAGE_TYPES, Player, SERVER_MESSAGE_TYPES, SceneItem, SelectedItem} from "../../../helpers/types";
import { displayCatalogPanel } from "../../../ui/Panels/CatalogPanel"
import { entitiesFromItemIds, itemIdsFromEntities, sceneBuilds } from "../../scenes"

export let selectedItem:SelectedItem

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

export function selectCatalogItem(id:any, mode:EDIT_MODES, already?:boolean){
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
            enabled:true
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



}

export function otherUserPlaceditem(player:any, info:any){
    let ent = player.selectedEntity
    let transform = Transform.getMutable(ent)
    transform.position = info.position
    transform.scale = info.scale
    transform.rotation = Quaternion.fromEulerDegrees(info.rotation.x, info.rotation.y, info.rotation.z)
    player.selectedEntity = null
}

export function otherUserSelectedItem(player:any, item:any){
    let ent:Entity
    ent = engine.addEntity()

    player.selectedEntity = ent

    if(item.v && item.v > players.get(localUserId)!.version){
        log('this asset is not ready for viewing, need to add temporary asset')
    
        let scale:any
        if(item.si){
            scale = Vector3.create(item.si.x, item.si.y, item.si.z)
        }else{
            scale = Vector3.One()
        }
        
        MeshRenderer.setBox(ent)
    }else{
        log('this asset is ready for viewing, place object in scene')

        //to do
        //add different asset types here

        GltfContainer.create(ent, {src: 'assets/' + item.id + ".glb"})
    }
    Transform.create(ent, {position: {x: 0, y: -.88, z: 4}, parent: player.parent})
}

export function otherUserRemovedSeletedItem(player:any){
   engine.removeEntity(player.selectedEntity)
   player.selectedEntity = null 
}

export function editItem(entity:Entity, mode:EDIT_MODES, already?:boolean){
    PointerEvents.deleteFrom(entity)

    let assetId = itemIdsFromEntities.get(entity)
    console.log('found asset id', assetId)
    if(assetId){
        sceneBuilds.forEach((scene:IWBScene)=>{
            let sceneItem = scene.ass.find((asset)=> asset.aid === assetId)
            console.log('scene item is', sceneItem)
            if(sceneItem){

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
                    already: false
                }
        
                if(mode === EDIT_MODES.GRAB){
                    addUseItemPointers(selectedItem.entity)
                }
                return
            }
        })
    }
}

export function saveItem(){
    PointerEvents.deleteFrom(selectedItem.entity)
    addBuildModePointers(selectedItem.entity)
    selectedItem.enabled = false

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

export function dropSelectedItem(){
    const {position, rotation} = Transform.get(engine.PlayerEntity)
    const forwardVector = Vector3.rotate(Vector3.scale(Vector3.Forward(), 4), rotation)
    const finalPosition = Vector3.add(position, forwardVector)

    console.log('final position is', finalPosition)

    let parcel = "" + Math.floor(finalPosition.x/16) + "," + Math.floor(finalPosition.z/16)

    sceneBuilds.forEach((scene,key)=>{
        if(scene.pcls.find((sc:string)=> sc === parcel) && players.get(localUserId)?.canBuild){
            log('we can drop item here')

            PointerEvents.deleteFrom(selectedItem.entity)
            // addBuildModePointers(selectedItem.entity)//

            players.get(localUserId)!.activeScene = scene

            const curSceneParent = scene.parentEntity
            const curSceneParentPosition = Transform.get(curSceneParent).position
        
            // adjust position to parent offset
            finalPosition.x = finalPosition.x - curSceneParentPosition.x
            finalPosition.z = finalPosition.z - curSceneParentPosition.z
        
            // update object transform
            const t = Transform.getMutable(selectedItem.entity)
            t.position = finalPosition
            t.position.y = t.position.y - .88
            t.rotation.y =  rotation.y
            t.rotation.w = rotation.w
            t.parent = curSceneParent

            engine.removeEntity(selectedItem.entity)//
        
            sendServerMessage(
                selectedItem.already ? SERVER_MESSAGE_TYPES.SCENE_UPDATE_ITEM : SERVER_MESSAGE_TYPES.SCENE_ADD_ITEM,
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
                selectCatalogItem(sceneItem.id, EDIT_MODES.GRAB)
                return
            }
        })
    }
}

export function grabItem(entity:Entity){
    editItem(entity, EDIT_MODES.GRAB, true)
    addUseItemPointers(entity)
    Transform.createOrReplace(selectedItem.entity, {position: {x: 0, y: -.88, z: 4}, parent: engine.PlayerEntity})
}

export function removeSelectedItem(){
    PointerEvents.deleteFrom(selectedItem.entity)
    engine.removeEntity(selectedItem.entity)
    selectedItem.enabled = false
}

export function checkBuildPermissions(player:Player){
    let canbuild = false
    let activeScene = null
    sceneBuilds.forEach((scene:IWBScene, key:string)=>{
        if(scene.pcls.find((parcel) => parcel === player!.currentParcel && (scene.o === localUserId || scene.bps.find((permission)=> permission === localUserId)))){
            console.log('player is on current owned parcel')
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

export function sendServerDelete(entity:Entity){
    let assetId = itemIdsFromEntities.get(entity)
    console.log('found asset id', assetId)
    if(assetId){
        sceneBuilds.forEach((scene:IWBScene)=>{
            log('this scene to find items to delete is', scene)
            let sceneItem = scene.ass.find((asset)=> asset.aid === assetId)
            console.log('scene item to delete is', sceneItem)//
            if(sceneItem){
                sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_DELETE_ITEM, {aid: assetId, sceneId:scene.id, entity:entity})
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