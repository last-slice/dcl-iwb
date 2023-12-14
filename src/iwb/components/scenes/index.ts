import { Entity, GltfContainer, Material, MeshCollider, MeshRenderer, RaycastResult, Transform, VisibilityComponent, engine } from "@dcl/sdk/ecs"
import { log } from "../../helpers/functions"
import { COMPONENT_TYPES, EDIT_MODES, IWBScene, NOTIFICATION_TYPES, SCENE_MODES, SceneItem, VIEW_MODES } from "../../helpers/types"
import { SelectedFloor, addBoundariesForParcel } from "../modes/create"
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math"
import { items } from "../catalog"
import { RealmEntityComponent } from "../../helpers/Components"
import { hasBuildPermissions, iwbConfig, localUserId, players } from "../player/player"
import { addBuildModePointers, updateImageUrl } from "../modes/build"
import { showNotification } from "../../ui/Panels/notificationUI"

export let realm:string = ""
export let scenes:any[] = []
export let worlds:any[] = []

export let sceneBuilds:Map<string, any> = new Map()
export let itemIdsFromEntities:Map<number,any> = new Map()
export let entitiesFromItemIds:Map<string,Entity> = new Map()

export function updateRealm(value:string){
    realm = value

    if(value !== "BuilderWorld"){
        let player = players.get(localUserId)
        if(player){
            player.worlds.forEach((world)=>{
                log('world is', world)
                if((world.ens === value)){
                    player!.homeWorld = true
                    log('player is in home world')
                    return
                }
            })
        }
    }
}

export function setWorlds(config:any){
    let player = players.get(localUserId)

    config.forEach((world:any)=>{
        worlds.push({name: world.worldName, v:world.v, owner:world.owner, ens:world.ens, builds: world.builds, updated: world.updated})

        let playerWorld = player?.worlds.find((w) => w.name === world.worldName)
        if(playerWorld){
            playerWorld.v = world.v
            playerWorld.updated = world.updated
            playerWorld.builds = world.builds            
            playerWorld.init = true   
        }
    })

    if(player!.homeWorld){
        let config = player!.worlds.find((w)=> w.ens === realm)
        if(config){
            if(config.v < iwbConfig.v){
                log('world version behind deployed version, show notification to update')
                showNotification({type:NOTIFICATION_TYPES.MESSAGE, message: "There's a newer version of the IWB! Visit the Settings panel to view the updates and deploy.", animate:{enabled:true, time:10, return:true}})
            }
        }
    }
}

export function setScenes(info:any){
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
    sceneBuilds.set(info.id, {...info})

    if(info.bps.includes(localUserId)){
        players.get(localUserId)!.buildingAllowed = true
    }

    loadSceneBoundaries(info.id)
}

export function unloadScene(sceneId:any){
    let localScene = sceneBuilds.get(sceneId)
    if(localScene){
        engine.removeEntityWithChildren(localScene.parentEntity)
        localScene.entities.forEach((entity:Entity)=>{
            let aid= itemIdsFromEntities.get(entity)
            itemIdsFromEntities.delete(entity)
            entitiesFromItemIds.delete(aid)
        })
    }
}

function loadSceneBoundaries(id:any){
    let info = sceneBuilds.get(id)
    info.entities = []

    if(info.n !== "Realm Lobby"){
        info.pcls.forEach((parcel:string)=>{
            addBoundariesForParcel(parcel, true, true)
        })
    }   

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
    // loadSceneAssets(id)
    log('new local scene is', info)
}

export function loadSceneAsset(sceneId:string, item:SceneItem){
    let localScene = sceneBuilds.get(sceneId)
    if(localScene){
        let parent = localScene.parentEntity

        let entity = engine.addEntity()
        RealmEntityComponent.create(entity)

        if(players.get(localUserId)!.mode === SCENE_MODES.BUILD_MODE){
            addBuildModePointers(entity)
        }

        localScene.entities.push(entity)
    
        let itemConfig = items.get(item.id)
        log('loading item config for item', item, itemConfig)
    
        if(itemConfig){
            itemIdsFromEntities.set(entity, item.aid)
            entitiesFromItemIds.set(item.aid, entity)
    
            Transform.create(entity, {parent:parent, position:item.p, rotation:Quaternion.fromEulerDegrees(item.r.x, item.r.y, item.r.z), scale:item.s})
            
            addAssetComponents(localScene, entity, item, itemConfig.ty, itemConfig.n)
        }
        localScene.ass.push(item)
    }
}

export function deleteAllRealmObjects(){
    for (const [entity] of engine.getEntitiesWith(RealmEntityComponent)) {    
        engine.removeEntity(entity)
    }
}

function addAssetComponents(scene:IWBScene, entity:Entity, item:SceneItem, type:string, name:string){
    if(item.comps.includes(COMPONENT_TYPES.VISBILITY_COMPONENT)){
        let visible = false

        let mode = players.get(localUserId)?.mode
        if(mode === SCENE_MODES.PLAYMODE){
            if(scene.o === localUserId){
                if(scene.e){
                    visible = true
                }
            }else{
                if(scene.e && !scene.priv){
                    visible = true
                }
            }
        }
        else{
            if(scene.o === localUserId || scene.bps.includes(localUserId)){
                if(scene.e){
                    visible = true
                }
            }
        }

        VisibilityComponent.create(entity, {
            visible:  visible
        })
    }

    switch(type){
        case '3D':
            let gltf:any = {
                src:"assets/" + item.id + ".glb",
                invisibleMeshesCollisionMask: item.colComp && item.colComp.iMask ? item.colComp && item.colComp.iMask : undefined,
                visibleMeshesCollisionMask: item.colComp && item.colComp.vMask ? item.colComp && item.colComp.vMask : undefined
            }
            GltfContainer.create(entity, gltf)
            break;

        case '2D':
            MeshRenderer.setPlane(entity)
            MeshCollider.setPlane(entity)
            
            switch(name){
                case 'Image':
                    updateImageUrl(item.aid, item.matComp, item.imgComp.url)
                    break;

                case 'Video':
                    break;
            }
            break;

        case 'Audio':
            break;
    }
}

export function checkSceneVisibility(scene:IWBScene){
    
}

export function updateSceneEdits(info:any){
    console.log('updating scene edits', info)
    let scene:IWBScene = sceneBuilds.get(info.sceneId ? info.sceneId : "")
    if(scene){
        scene.d = info.desc ? info.desc : ""
        scene.n = info.name ? info.name : ""
        scene.im = info.image ? info.image : ""
        scene.e = info.enabled
        scene.priv = info.priv

        checkSceneVisibility(scene)
    }
}

//