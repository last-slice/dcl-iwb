import {Vector3} from "@dcl/sdk/math"
import {log} from "../../../helpers/functions"
import {items} from "../../catalog"
import {localUserId, players} from "../../player/player"
import {engine, Entity, GltfContainer, InputAction, MeshRenderer, pointerEventsSystem, Transform} from "@dcl/sdk/ecs"
import {sendServerMessage} from "../../messaging";
import {SERVER_MESSAGE_TYPES} from "../../../helpers/types";


export let selectedCatalogItem:any = null

export function enableBuildMode(){
}

export function selectCatalogItem(item:any){
    selectedCatalogItem = items.get(item)
}

export function useSelectedItem(){
    console.log(selectedCatalogItem)
    console.log(players.get(localUserId))

    let ent:Entity
    ent = engine.addEntity()

    if(selectedCatalogItem.v && selectedCatalogItem.v > players.get(localUserId)!.version){
        log('this asset is not ready for viewing, need to add temporary asset')
    
        let scale:any
        if(selectedCatalogItem.si){
            scale = Vector3.create(selectedCatalogItem.si.x, selectedCatalogItem.si.y, selectedCatalogItem.si.z)
        }else{
            scale = Vector3.One()
        }
        
        MeshRenderer.setBox(ent)
        Transform.create(ent, {position: Vector3.create(8,0,8), scale: scale})
    }else{
        log('this asset is ready for viewing, place object in scene')

        //to do
        //add different asset types here

        GltfContainer.create(ent, {src: 'assets/' + selectedCatalogItem.id + ".glb"})
        Transform.create(ent, {position: {x: 0, y: -.88, z: 4}, parent: engine.PlayerEntity})
        addBuildAttachHandler(ent)
    }
}

function addBuildAttachHandler(ent:Entity){
    pointerEventsSystem.onPointerDown(
        {
            entity: ent,
            opts: {button: InputAction.IA_PRIMARY, hoverText: 'Drop'},
        },
        function () {
            pointerEventsSystem.removeOnPointerDown(ent)

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
            const t = Transform.getMutable(ent)
            t.position = finalPosition
            t.position.y = t.position.y - .88
            t.rotation.y =  rotation.y
            t.rotation.w = rotation.w
            t.parent = curSceneParent

            sendServerMessage(
                SERVER_MESSAGE_TYPES.SCENE_ADD_ITEM,
                {baseParcel: curScene.baseParcel, item: {id: selectedCatalogItem.id, position: t.position, rotation: t.rotation, scale: t.scale}})

        }
    )
}