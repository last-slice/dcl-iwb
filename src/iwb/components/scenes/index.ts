import { Entity, GltfContainer, Material, MeshRenderer, RaycastResult, Transform, engine } from "@dcl/sdk/ecs"
import { log } from "../../helpers/functions"
import { IWBScene, SceneItem } from "../../helpers/types"
import { SelectedFloor, addBoundariesForParcel } from "../modes/create"
import { Color4, Vector3 } from "@dcl/sdk/math"
import { items } from "../catalog"

export let scenes:any[] = []
export let worlds:any[] = []

export let sceneBuilds:Map<string, IWBScene> = new Map()
export let itemIdsFromEntities:Map<number,any> = new Map()

export function setScenes(info:any){
    log('server scene list', info)

    //set creator worlds
    info.forEach((scene:any)=>{
        scenes.push({owner:scene.owner, builds:1, updated:scene.updated, scna:scene.scna, name:scene.name, id:scene.id})

        let ownerIndex = worlds.findIndex((sc)=> sc.owner === scene.owner)
        if(ownerIndex >= 0){
            worlds[ownerIndex].builds += 1
            if(scene.updated > scenes[ownerIndex].updated){
                worlds[ownerIndex].updated = scene.updated
            }
        }else{
            worlds.push({owner:scene.owner, builds:1, updated:scene.updated, name:scene.name, id:scene.id})
        }
    })

    log('local scenes are now', scenes)
}

export function loadScene(info:any){

    loadSceneBoundaries(info)
    .then((res1)=> loadSceneAssets(res1))
    .then((info)=>{
        log('loaded scene info is', info)
        sceneBuilds.set(info.id, info)
    })
    
}

async function loadSceneBoundaries(info:any){
    info.pcls.forEach((parcel:string)=>{
        addBoundariesForParcel(parcel, true, true)
    })

    // create parent entity for scene//
    const [x1, y1] = info.bpcl.split(",")
    let x = parseInt(x1)
    let y = parseInt(y1)

    const sceneParent = engine.addEntity()
    Transform.create(sceneParent, {
        position: Vector3.create(x*16, 0, y*16)
    })

    info.parentEntity = sceneParent


    // change floor color
    for (const [entity] of engine.getEntitiesWith(Material, SelectedFloor)){
        Material.setPbrMaterial(entity, {
            albedoColor: Color4.create(.2, .9, .1, 1)
        })
    }

    return info
}

async function loadSceneAssets(info:IWBScene){
    info.sceneEntities = []

    info.ass.forEach(async (asset:SceneItem)=>{
        info.sceneEntities.push(await loadSceneAsset(info.parentEntity, asset))
    })
    return info
}

async function loadSceneAsset(parent:Entity, item:SceneItem){
    let ent = engine.addEntity()
    let itemConfig = items.get(item.id)
    log('loading item config for item', item, itemConfig)

    if(itemConfig){
        itemIdsFromEntities.set(ent, item.id)
        Transform.create(ent, {parent:parent, position:item.p, rotation:item.r, scale:item.s})
        switch(itemConfig.ty){
            case '3d':
                GltfContainer.create(ent, {src: "assets/" + item.id + ".glb"})
                break;

            case 'prim':
                break;
        }
    }
    return ent
}

export function deleteAllRealmObjects(){
    itemIdsFromEntities.forEach((id, ent)=>{
        engine.removeEntity(ent as Entity)
    })
}