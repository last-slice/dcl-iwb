import {engine, Entity, GltfContainer, Material, Transform} from "@dcl/sdk/ecs"
import {log} from "../../helpers/functions"
import {NOTIFICATION_TYPES, SCENE_MODES, SceneItem} from "../../helpers/types"
import {addBoundariesForParcel, SelectedFloor} from "../modes/create"
import {Color4, Quaternion, Vector3} from "@dcl/sdk/math"
import {items} from "../catalog"
import {RealmEntityComponent} from "../../helpers/Components"
import {localUserId, players} from "../player/player"
import {addBuildModePointers} from "../modes/build"
import {showNotification} from "../../ui/Panels/notificationUI"
import {createImage} from "../../catalog/2d/image";
import {EditableItemC} from "../../catalog/2d/EditableItem";
import {generateSettingsInputs} from "../../ui/Panels/EditProperties";

export let realm: string = ""
export let scenes: any[] = []
export let worlds: any[] = []

export let sceneBuilds: Map<string, any> = new Map()
export let itemIdsFromEntities: Map<number, any> = new Map()
export let entitiesFromItemIds: Map<string, Entity> = new Map()


export function updateRealm(value: string) {
    realm = value

    if (value !== "BuilderWorld") {
        let player = players.get(localUserId)
        if (player) {
            player.worlds.forEach((world) => {
                if ((world.ens === value)) {
                    player!.homeWorld = true
                    return
                }
            })
        }
    }
}

export function setWorlds(config: any) {
    let player = players.get(localUserId)

    config.forEach((world: any) => {
        worlds.push({
            name: world.worldName,
            v: world.v,
            owner: world.owner,
            ens: world.ens,
            builds: world.builds,
            updated: world.updated
        })

        let playerWorld = player?.worlds.find((w) => w.name === world.worldName)
        if (playerWorld) {
            playerWorld.v = world.v
            playerWorld.updated = world.updated
            playerWorld.builds = world.builds
            playerWorld.init = true
        }
    })

    if (player!.homeWorld) {
        let config = player!.worlds.find((w) => w.ens === realm)
        if (config) {
            if (config.v < player!.version) {
                log('world version behind deployed version, show notification to update')
                showNotification({
                    type: NOTIFICATION_TYPES.MESSAGE,
                    message: "There's a newer version of the IWB! Visit the Settings panel to view the updates and deploy.",
                    animate: {enabled: true, time: 10, return: true}
                })
            }
        }
    }
}

export function setScenes(info: any) {
    //set creator worlds
    info.forEach((scene: any) => {
        scenes.push({
            owner: scene.owner,
            builds: 1,
            updated: scene.updated,
            scna: scene.scna,
            name: scene.name,
            id: scene.id
        })

        let ownerIndex = worlds.findIndex((sc) => sc.owner === scene.owner)
        if (ownerIndex >= 0) {
            worlds[ownerIndex].builds += 1
            if (scene.updated > scenes[ownerIndex].updated) {
                worlds[ownerIndex].updated = scene.updated
            }
        } else {
            worlds.push({owner: scene.owner, builds: 1, updated: scene.updated, name: scene.name, id: scene.id})
        }
    })

    log('local scenes are now', scenes)
}

export function loadScene(info: any) {
    sceneBuilds.set(info.id, {...info})

    if (info.bps.includes(localUserId)) {
        players.get(localUserId)!.buildingAllowed = true
    }
    loadSceneBoundaries(info.id)
}

export function unloadScene(sceneId: any) {
    let localScene = sceneBuilds.get(sceneId)
    if (localScene) {
        engine.removeEntityWithChildren(localScene.parentEntity)
        localScene.entities.forEach((entity: Entity) => {
            let aid = itemIdsFromEntities.get(entity)
            itemIdsFromEntities.delete(entity)
            entitiesFromItemIds.delete(aid)
        })
    }
}

function loadSceneBoundaries(id: any) {
    let info = sceneBuilds.get(id)
    info.entities = []

    info.pcls.forEach((parcel: string) => {
        addBoundariesForParcel(parcel, true, true)
    })

    // create parent entity for scene//
    const [x1, y1] = info.bpcl.split(",")
    let x = parseInt(x1)
    let y = parseInt(y1)

    const sceneParent = engine.addEntity()
    Transform.create(sceneParent, {
        position: Vector3.create(x * 16, 0, y * 16)
    })

    info.parentEntity = sceneParent

    // change floor color
    for (const [entity] of engine.getEntitiesWith(Material, SelectedFloor)) {
        Material.setPbrMaterial(entity, {
            albedoColor: Color4.create(.2, .9, .1, 1)
        })
    }
    // loadSceneAssets(id)
    log('new local scene is', info)
}

export function loadSceneAsset(sceneId: string, item: SceneItem) {
    let localScene = sceneBuilds.get(sceneId)
    log('local sene is', localScene)
    if (localScene) {
        log("local scene in building asst is", localScene)

        localScene.ass.push(item)
        log("local scene in building asst is", localScene)

        let parent = localScene.parentEntity

        let entity = engine.addEntity()
        RealmEntityComponent.create(entity)

        if (players.get(localUserId)!.mode === SCENE_MODES.BUILD_MODE) {
            addBuildModePointers(entity)
        }

        localScene.entities.push(entity)

        let itemConfig = items.get(item.id)
        log('loading item config for item', item, itemConfig)

        if (itemConfig) {
            itemIdsFromEntities.set(entity, item.aid)
            entitiesFromItemIds.set(item.aid, entity)

            Transform.create(entity, {
                parent: parent,
                position: item.p,
                rotation: Quaternion.fromEulerDegrees(item.r.x, item.r.y, item.r.z),
                scale: item.s
            })
            switch (itemConfig.ty) {
                case '3D':
                    GltfContainer.create(entity, {src: "assets/" + item.id + ".glb"})
                    break;

                case '2D':
                    if (itemConfig.n === "Image") {

                        createImage(entity, "https://gallery-files.s3.amazonaws.com/images/gallery/root-scaled/0.png")
                        EditableItemC.create(entity, {init: true})
                        generateSettingsInputs()
                    }

                    break;

                case 'prim':
                    break;
            }
        }
        log('local scene after asset is', localScene)
    }
}

export function deleteAllRealmObjects() {
    for (const [entity] of engine.getEntitiesWith(RealmEntityComponent)) {
        engine.removeEntity(entity)
    }
}