import {Quaternion, Vector3} from "@dcl/sdk/math"
import {log, roundQuaternion, roundVector} from "../../../helpers/functions"
import {items} from "../../catalog"
import {localUserId, players} from "../../player/player"
import {engine, Entity, GltfContainer, InputAction, MeshRenderer, PointerEvents, pointerEventsSystem, PointerEventType, Transform} from "@dcl/sdk/ecs"
import {sceneMessageBus, sendServerMessage} from "../../messaging";
import {IWBScene, IWB_MESSAGE_TYPES, Player, SERVER_MESSAGE_TYPES} from "../../../helpers/types";
import { displayCatalogPanel } from "../../../ui/Panels/CatalogPanel"
import { itemIdsFromEntities, sceneBuilds } from "../../scenes"


export let selectedCatalogItem:any = null
export let selectedEntity:Entity

export function selectCatalogItem(id:any, already?:boolean){
    selectedCatalogItem = items.get(id)
    if(already){
        selectedCatalogItem.already = true
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

export function useSelectedItem(){
    displayCatalogPanel(false)
    console.log(selectedCatalogItem)
    console.log(players.get(localUserId))

    selectedEntity = engine.addEntity()

    addUseItemPointers(selectedEntity)

    let scale:any
    if(selectedCatalogItem.si){
        scale = Vector3.create(selectedCatalogItem.si.x, selectedCatalogItem.si.y, selectedCatalogItem.si.z)
    }else{
        scale = Vector3.One()
    }

    if(selectedCatalogItem.v && selectedCatalogItem.v > players.get(localUserId)!.version){
        log('this asset is not ready for viewing, need to add temporary asset')
        MeshRenderer.setBox(selectedEntity)
    }else{
        log('this asset is ready for viewing, place object in scene')

        //to do
        //add different asset types here//


        GltfContainer.create(selectedEntity, {src: 'assets/' + selectedCatalogItem.id + ".glb"})
    }
    Transform.create(selectedEntity, {position: {x: 0, y: -.88, z: 4}, parent: engine.PlayerEntity})
    sceneMessageBus.emit(IWB_MESSAGE_TYPES.USE_SELECTED_ASSET, {user:localUserId, item:selectedCatalogItem})
}

export function dropSelectedItem(){
    
        // get front of player position
        const {position, rotation} = Transform.get(engine.PlayerEntity)
        const forwardVector = Vector3.rotate(Vector3.scale(Vector3.Forward(), 4), rotation)
        const finalPosition = Vector3.add(position, forwardVector)

        console.log('final position is', finalPosition)

        let parcel = "" + Math.floor(finalPosition.x/16) + "," + Math.floor(finalPosition.z/16)

        sceneBuilds.forEach((scene,key)=>{
            if(scene.pcls.find((sc)=> sc === parcel)){
                log('we can drop item here')

                PointerEvents.deleteFrom(selectedEntity)
                addBuildModePointers(selectedEntity)

                players.get(localUserId)!.activeScene = scene

                const curSceneParent = scene.parentEntity
                const curSceneParentPosition = Transform.get(curSceneParent).position
            
                // adjust position to parent offset
                finalPosition.x = finalPosition.x - curSceneParentPosition.x
                finalPosition.z = finalPosition.z - curSceneParentPosition.z
            
                // update object transform
                const t = Transform.getMutable(selectedEntity)
                t.position = finalPosition
                t.position.y = t.position.y - .88
                t.rotation.y =  rotation.y
                t.rotation.w = rotation.w
                t.parent = curSceneParent
            
                if(selectedCatalogItem.already){
                    sendServerMessage(
                        SERVER_MESSAGE_TYPES.SCENE_UPDATE_ITEM,
                        {baseParcel: scene.bpcl, item: {sceneId:scene.id, id: selectedCatalogItem.id, position: roundVector(t.position, 2), rotation: roundVector(Quaternion.toEulerAngles(t.rotation), 2), scale: roundVector(t.scale, 2)}})
    
                }else{
                    sendServerMessage(
                        SERVER_MESSAGE_TYPES.SCENE_ADD_ITEM,
                        {baseParcel: scene.bpcl, item: {sceneId:scene.id, id: selectedCatalogItem.id, position: roundVector(t.position, 2), rotation: roundVector(Quaternion.toEulerAngles(t.rotation), 2), scale: roundVector(t.scale, 2)}})
    
                }

                scene.sceneEntities.push(selectedEntity)
                itemIdsFromEntities.set(selectedEntity, selectedCatalogItem.id)
                selectedCatalogItem = null

                return
            }
        })
}

export function grabItem(entity:Entity){
    PointerEvents.deleteFrom(entity)
    addUseItemPointers(entity)

    let itemId = itemIdsFromEntities.get(entity)
    if(itemId){
        selectCatalogItem(itemId, true)
        selectedEntity = entity

        Transform.createOrReplace(selectedEntity, {position: {x: 0, y: -.88, z: 4}, parent: engine.PlayerEntity})
        sceneMessageBus.emit(IWB_MESSAGE_TYPES.USE_SELECTED_ASSET, {user:localUserId, item:selectedCatalogItem})
        //convert message bus to server message
    }
}


export function removeSelectedItem(){
    PointerEvents.deleteFrom(selectedEntity)
    engine.removeEntity(selectedEntity)
    selectedCatalogItem = null

    sceneMessageBus.emit(IWB_MESSAGE_TYPES.REMOVE_SELECTED_ASSET, {user:localUserId})
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

    if(canbuild){
        player.canBuild = true
        player.activeScene = activeScene
    }else{
        player.canBuild = false
        player.activeScene = null
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
                    hoverText: "Edit",
                }
            },
            {
                eventType: PointerEventType.PET_DOWN,
                eventInfo: {
                    button: InputAction.IA_SECONDARY,
                    hoverText: "Delete",
                }
            },
            {
                eventType: PointerEventType.PET_DOWN,
                eventInfo: {
                    button: InputAction.IA_ACTION_3,
                    hoverText: "Grab",
                }
            }
        ]
    })
}