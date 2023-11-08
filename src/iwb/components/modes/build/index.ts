import {Quaternion, Vector3} from "@dcl/sdk/math"
import {log} from "../../../helpers/functions"
import {items} from "../../catalog"
import {localUserId, players} from "../../player/player"
import {engine, Entity, GltfContainer, InputAction, MeshRenderer, PointerEvents, pointerEventsSystem, PointerEventType, Transform} from "@dcl/sdk/ecs"
import {sceneMessageBus, sendServerMessage} from "../../messaging";
import {IWBScene, IWB_MESSAGE_TYPES, Player, SERVER_MESSAGE_TYPES} from "../../../helpers/types";
import { displayCatalogPanel } from "../../../ui/Panels/CatalogPanel"
import { sceneBuilds } from "../../scenes"


export let selectedCatalogItem:any = null
export let selectedEntity:Entity

export function selectCatalogItem(item:any){
    selectedCatalogItem = items.get(item)
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

    PointerEvents.createOrReplace(selectedEntity, {
        pointerEvents: [
            {
                eventType: PointerEventType.PET_DOWN,
                eventInfo: {
                    button: InputAction.IA_PRIMARY,
                    hoverText: "Drop",
                }
            },
            {
                eventType: PointerEventType.PET_DOWN,
                eventInfo: {
                    button: InputAction.IA_SECONDARY,
                    hoverText: "Cancel",
                }
            }
        ]
    })

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
        //add different asset types here

        GltfContainer.create(selectedEntity, {src: 'assets/' + selectedCatalogItem.id + ".glb"})
    }
    Transform.create(selectedEntity, {position: {x: 0, y: -.88, z: 4}, parent: engine.PlayerEntity})
    // addBuildAttachHandler(ent)
    sceneMessageBus.emit(IWB_MESSAGE_TYPES.USE_SELECTED_ASSET, {user:localUserId, item:selectedCatalogItem})
}

export function dropSelectedItem(){
    // get front of player position
    const {position, rotation} = Transform.get(engine.PlayerEntity)
    const forwardVector = Vector3.rotate(Vector3.scale(Vector3.Forward(), 4), rotation)
    const finalPosition = Vector3.add(position, forwardVector)

    // get current scene parent entity
    const curScene = players.get(localUserId)!.activeScene
    const curSceneParent = curScene.parentEntity
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

    sendServerMessage(
        SERVER_MESSAGE_TYPES.SCENE_ADD_ITEM,
        {baseParcel: curScene.bpcl, item: {id: selectedCatalogItem.id, position: t.position, rotation: t.rotation, scale: t.scale}})

    sceneMessageBus.emit(IWB_MESSAGE_TYPES.PLACE_SELECTED_ASSET, {user:localUserId, position: t.position, rotation: t.rotation, scale: t.scale})
    selectedCatalogItem = null
}

export function removeSelectedItem(){
    engine.removeEntity(selectedEntity)
    selectedCatalogItem = null
    sceneMessageBus.emit(IWB_MESSAGE_TYPES.REMOVE_SELECTED_ASSET, {user:localUserId})
}

export function checkBuildPermissions(player:Player){
    let canbuild = false
    sceneBuilds.forEach((scene:IWBScene, key:string)=>{
        if(scene.pcls.find((parcel) => parcel === player!.currentParcel && (scene.o === localUserId || scene.bps.find((permission)=> permission === localUserId)))){
            console.log('player is on current owned parcel')
            player.activeScene = scene
            canbuild = true
        }
    })

    if(canbuild){
        player.canBuild = true
    }else{
        player.canBuild = false
    }
}