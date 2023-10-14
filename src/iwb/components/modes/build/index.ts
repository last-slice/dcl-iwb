import { Vector3 } from "@dcl/sdk/math"
import { log } from "../../../helpers/functions"
import { items } from "../../catalog"
import { localUserId, players } from "../../player/player"
import { Entity, GltfContainer, MeshRenderer, Transform, engine } from "@dcl/sdk/ecs"


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

    if(selectedCatalogItem.v && selectedCatalogItem.v > players.get(localUserId).version){
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
    }
}