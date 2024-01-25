import { Entity, Material, MeshCollider, MeshRenderer, RaycastResult, Transform, VisibilityComponent, engine } from "@dcl/sdk/ecs"
import { log } from "../../helpers/functions"
import { COMPONENT_TYPES, EDIT_MODES, IWBScene, NOTIFICATION_TYPES, Player, SCENE_MODES, SceneItem, VIEW_MODES } from "../../helpers/types"
import { SelectedFloor, addBoundariesForParcel, deleteParcelEntities } from "../modes/create"
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math"
import { items } from "../catalog"
import { AudioLoadedComponent, PointersLoadedComponent, RealmEntityComponent, SmartItemLoadedComponent, VideoLoadedComponent } from "../../helpers/Components"
import { getPlayerLand, hasBuildPermissions, iwbConfig, localPlayer, localUserId, players } from "../player/player"
import { addBuildModePointers } from "../modes/build"
import { showNotification } from "../../ui/Panels/notificationUI"
import {
    createAudioComponent,
    createGltfComponent,
    createSmartItemComponent,
    createVideoComponent,
    createVisibilityComponent,
    updateImageUrl,
    updateMaterialComponent,
    updateNFTFrame,
    updateTextComponent
} from "./components"
import { hideAllPanels } from "../../ui/ui"
import { check2DCollision, checkAudio, checkPointers, checkSmartItem, checkVideo, disableEntityForPlayMode, getSceneItem } from "../modes/play"
import { displaySceneAssetInfoPanel } from "../../ui/Panels/sceneInfoPanel"

export let realm:string = ""
export let scenes:any[] = []
export let worlds:any[] = []
export let sceneBuilds:Map<string, any> = new Map()
export let itemIdsFromEntities:Map<number,any> = new Map()
export let entitiesFromItemIds:Map<string,Entity> = new Map()
export let realmActions:any[] = []

export let buildModeCheckedAssets:any[] = []
export let playModeCheckedAssets:any[] = []
export let lastScene:any

export let playModeReset:boolean = true
export let disabledEntities:boolean = false

export function updatePlayModeReset(value:boolean){
    log('updating playmode reset', value)
    playModeReset = value
}

export function updateRealm(value:string){
    realm = value

    if(value !== "BuilderWorld"){
        let player = players.get(localUserId)
        if(player){
            player.worlds.forEach(async (world)=>{
                log('world is', world)
                if((world.ens === value)){
                    player!.homeWorld = true
                    await getPlayerLand()
                    return
                }
            })
        }
    }
}

export function setWorlds(config:any){
    let player = players.get(localUserId)

    config.forEach((world:any)=>{

        if(world.init){
            worlds.push({name: world.worldName, v:world.v, owner:world.owner, ens:world.ens, builds: world.builds, updated: world.updated})
        }else{
            let w = worlds.find((wo:any)=> wo.ens === world.ens)
            if(w){
                w.updated = world.updated
                w.v = world.v
            }else{
                worlds.push({name: world.worldName, v:world.v, owner:world.owner, ens:world.ens, builds: world.builds, updated: world.updated})
            }
        }

        let playerWorld = player?.worlds.find((w) => w.name === world.worldName)
        if(playerWorld){
            playerWorld.v = world.v
            playerWorld.cv = world.cv
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
    sceneBuilds.get(info.id).actions = []

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
        localScene.pcls.forEach((parcel:string)=>{
            deleteParcelEntities(parcel)
        })
        
    }
}

function loadSceneBoundaries(id:any){
    let info = sceneBuilds.get(id)
    info.entities = []

    info.pcls.forEach((parcel:string)=>{
        addBoundariesForParcel(parcel, true, info.n === "Realm Lobby" ? true : false, true)
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
    // loadSceneAssets(id)
    log('new local scene is', info)
}

export function loadSceneAsset(sceneId:string, item:SceneItem){
    log('loading new scene asset', sceneId, item)
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

    createVisibilityComponent(scene, entity, item)
    PointersLoadedComponent.create(entity, {init:false, sceneId:scene.id})

    if(item.actComp){
        // let actions = [...item.actComp.actions.values()]
        // console.log('item actions area', actions)

        item.actComp.actions.forEach((action:any, key:any)=>{
            realmActions.push({id:key, sceneId:scene.id, action})
        })
       
    }

    switch(type){
        case '3D':
            createGltfComponent(scene, entity, item)
            break;

        case '2D':
            if(item.colComp.vMask === 1){
                MeshCollider.setPlane(entity)
            }

            switch(name){
                case 'Image':
                    MeshRenderer.setPlane(entity)
                    updateImageUrl(item.aid, item.matComp, item.imgComp.url)
                    break;

                case 'Video':
                    MeshRenderer.setPlane(entity)
                    createVideoComponent(scene.id, entity, item)
                    break;

                case 'NFT Frame':
                    updateNFTFrame(item.aid, item.matComp, item.nftComp)
                    break;

                 case 'Text':
                    updateTextComponent(item.aid, item.matComp, item.textComp)
                    break;
                    
                case 'Plane':
                    updateMaterialComponent(item.aid, item.matComp)
                    break;
            }
            break;

        case 'Audio':
            createAudioComponent(scene, entity, item)
            break;

        case 'SM':
            createSmartItemComponent(scene, entity, item, name)
            break;
            
    }
    console.log('realm actions are', realmActions)
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

export function updateAsset(asset:any){
    //check if NFT component was updated
    if(asset.type === "2D" && asset.nftComp){
        log('we just updated nftasset')
        updateNFTFrame(asset.aid, asset.matComp, asset.nftComp)
    }
}

export async function checkScenePermissions(player: Player) {
    let canbuild = false
    let activeScene:any
    sceneBuilds.forEach((scene: IWBScene, key: string) => {
        if (scene.pcls.find((parcel) => parcel === player!.currentParcel && (scene.o === localUserId || scene.bps.find((permission) => permission === localUserId)))) {
            canbuild = true
        }

        if(scene.pcls.find((parcel) => parcel === player!.currentParcel)){
            activeScene = scene
        }
    })

    player.activeScene = activeScene

    if (canbuild) {
        player.canBuild = true
    } else {
        player.canBuild = false
        // player.activeScene = null//
        displaySceneAssetInfoPanel(false)
    }

    if(localPlayer.mode === SCENE_MODES.BUILD_MODE){
        playModeCheckedAssets.length = 0
    }else{
        if(playModeReset){
            if(activeScene){
                if(lastScene){
                    if(lastScene !== activeScene.id){
                        await disableSceneEntities(lastScene)
                        enableSceneEntities(activeScene.id)
                    }
                }else{
                    enableSceneEntities(activeScene.id)
                }
            }else{
                disableSceneEntities(lastScene)
            }
            lastScene = activeScene ? activeScene.id : undefined
        }
    }
}

async function disableSceneEntities(sceneId:string){
    if(!disabledEntities){
        // for(let i = 0; i < playModeCheckedAssets.length; i++){
        //     let entity = playModeCheckedAssets.shift()
        //     disableEntityForPlayMode(sceneId, entity)
        // }
        // console.log('disabling scene entities for scene', sceneId)

        let scene = sceneBuilds.get(sceneId)
        if(scene){
            for(let i = 0; i < scene.entities.length; i++){
                let entity = scene.entities[i]

                //check video
                if(VideoLoadedComponent.has(entity)){
                    VideoLoadedComponent.getMutable(entity).init = false
                }

                //check audio
                if(AudioLoadedComponent.has(entity)){
                    AudioLoadedComponent.getMutable(entity).init = false
                }

                //check pointers
                if(PointersLoadedComponent.has(entity)){
                    PointersLoadedComponent.getMutable(entity).init = false
                }

                disableEntityForPlayMode(scene.id, entity)
            }
        }
        disabledEntities = true
    }
}

function enableSceneEntities(sceneId:string){
    log('enable scene entities for play mode')
    let scene = sceneBuilds.get(sceneId)
    if(scene){
        for(let i = 0; i < scene.entities.length; i++){
            let entity = scene.entities[i]

            let sceneItem = getSceneItem(scene, entity)
            if(sceneItem){
                //check video
                if(VideoLoadedComponent.has(entity) && !VideoLoadedComponent.get(entity).init){
                    checkVideo(entity, sceneItem)
                    VideoLoadedComponent.getMutable(entity).init = true
                }

                //check audio
                if(AudioLoadedComponent.has(entity) && !AudioLoadedComponent.get(entity).init){
                    checkAudio(entity, sceneItem)
                    AudioLoadedComponent.getMutable(entity).init = true
                }

                playModeCheckedAssets.push(entity)
                // resetEntityForPlayMode(scene, entity)

                //check pointers
                VisibilityComponent.createOrReplace(entity, {
                    visible: sceneItem.visComp.visible
                })

                // check2DCollision(entity, sceneItem)


                //check smart items
                console.log('about to check smart items for play mod')
                if(SmartItemLoadedComponent.has(entity) && !SmartItemLoadedComponent.get(entity).init){
                    console.log('need to check for smart item play mode')
                    checkSmartItem(entity, sceneItem)
                    SmartItemLoadedComponent.getMutable(entity).init = true
                }
                

                if(PointersLoadedComponent.has(entity) && !PointersLoadedComponent.get(entity).init){
                    checkPointers(entity, sceneItem)
                    PointersLoadedComponent.getMutable(entity).init = true
                }
               
                }
        }
        disabledEntities = false
    }
}