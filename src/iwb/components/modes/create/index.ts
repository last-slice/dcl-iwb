import {engine, GltfContainer, Material, MeshRenderer, Transform, VisibilityComponent} from "@dcl/sdk/ecs"
import {localUserId, players, setPlayMode} from "../../player/player"
import {Color4, Quaternion, Vector3} from "@dcl/sdk/math"
import {SCENE_MODES, SERVER_MESSAGE_TYPES} from "../../../helpers/types"
import {displayCreateScenePanel} from "../../../ui/Panels/CreateScenePanel"
import { log } from "../../../helpers/functions"
import { sendServerMessage } from "../../messaging"
import { displaySceneSavedPanel } from "../../../ui/Panels/sceneSavedPanel"

export let scenesToCreate: Map<string, any> = new Map()
export let greenBeam = "assets/53726fe8-1d24-4fd8-8cee-0ac10fcd8644.glb"
export let redBeam = "assets/d8b8c385-8044-4bef-abcb-0530b2ebd6c7.glb"

export const SelectedFloor = engine.defineComponent("iwb::selected::FloorComponent", {})
export const BuildModeVisibilty = engine.defineComponent("iwb::buildmode::visibility", {})
export const ParcelFloor = engine.defineComponent("iwb::floor::component", {})

export function validateScene(){
    let scene = scenesToCreate.get(localUserId)
    if(scene && scene.parcels.length > 0){
        log('we have valid scene, send to server')
        setPlayMode(localUserId, SCENE_MODES.BUILD_MODE)
        sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_SAVE_NEW, {name: scene.name, desc:scene.description})
    }
}

export function createTempScene(name:string, desc:string){
    let data: any = {
        parcels: [],
        name: name,
        description:desc,
        size: [1, 1],
    }
    scenesToCreate.set(localUserId, data)
}

export function selectParcel(info: any) {
    let scene = scenesToCreate.get(info.player)
    if (scene) {
        /**
         * TODO
         * check if selected parcel is adjacent to at least 1 other parcel in the scene
         * check which direction the selected parcel is and update the size accordingly (1x1, 2x1, etc)
         *
         *///
        if (!scene.parcels.find((p: string) => p === info.parcel)) {
            scene.parcels.push({parcel: info.parcel, entities: []})
            addSelectedBoundaries(info)
        }
    } else {
        let data: any = {
            parcels: [{parcel: info.parcel, entities: []}],
            name: "test",
            size: [1, 1],
        }
        scenesToCreate.set(info.player, data)
        addSelectedBoundaries(info)
    }
}

export function addBoundariesForParcel(parcel:string, local:boolean, playMode?:boolean) {
    let entities: any[] = []

    let parent = engine.addEntity()
    let left = engine.addEntity()
    let right = engine.addEntity()
    let front = engine.addEntity()
    let back = engine.addEntity()

    // let leftFloor = engine.addEntity()
    // let rightFloor = engine.addEntity()
    // let frontFloor = engine.addEntity()
    // let backFloor = engine.addEntity()

    let floor = engine.addEntity()

    entities.push(left)
    // entities.push(leftFloor)
    entities.push(right)
    // entities.push(rightFloor)
    entities.push(front)
    // entities.push(frontFloor)
    entities.push(back)
    // entities.push(backFloor)
    entities.push(floor)

    let [x1, y1] = parcel.split(",")
    let x = parseInt(x1)
    let y = parseInt(y1)
    let centerx = (x * 16) + 8
    let centery = (y * 16) + 8

    Transform.create(parent)

    Transform.create(floor, {
        position: Vector3.create(centerx, 0, centery),
        rotation: Quaternion.fromEulerDegrees(90, 0, 0),
        scale: Vector3.create(16, 16, 1),
        parent:parent
    })
    MeshRenderer.setPlane(floor)
    Material.setPbrMaterial(floor, {
        albedoColor: local ? Color4.create(0, 1, 0, .5) : Color4.Red()
    })
    if(local) SelectedFloor.create(floor, {})
    ParcelFloor.create(floor)

    //left
    Transform.create(left, {
        position: Vector3.create(x * 16, 0, y * 16),
        rotation: Quaternion.fromEulerDegrees(0, 0, 0),
        scale: Vector3.create(1, 20, 1),
        parent:parent
    })
    GltfContainer.create(left, {src: local ? greenBeam : redBeam})
    // Transform.create(leftFloor, {
    //     position: Vector3.create(x * 16, 0, y * 16),
    //     rotation: Quaternion.fromEulerDegrees(90, 0, 0),
    //     scale: Vector3.create(1, 9, 1),
    //     parent:parent
    // })
    // GltfContainer.create(leftFloor, {src: local ? greenBeam : redBeam})

    //right
    Transform.create(right, {
        position: Vector3.create(x * 16 + 16, 0, y * 16),
        rotation: Quaternion.fromEulerDegrees(0, 0, 0),
        scale: Vector3.create(1, 20, 1),
        parent:parent
    })
    GltfContainer.create(right, {src: local ? greenBeam : redBeam})
    // Transform.create(rightFloor, {
    //     position: Vector3.create(x * 16 + 16, 0, y * 16),
    //     rotation: Quaternion.fromEulerDegrees(90, 0, 0),
    //     scale: Vector3.create(1, 9, 1),
    //     parent:parent
    // })
    // GltfContainer.create(rightFloor, {src: local ? greenBeam : redBeam})

    // front
    Transform.create(front, {
        position: Vector3.create(x * 16, 0, y * 16 + 16),
        rotation: Quaternion.fromEulerDegrees(0, 0, 0),
        scale: Vector3.create(1, 20, 1),
        parent:parent
    })
    GltfContainer.create(front, {src: local ? greenBeam : redBeam})
    // Transform.create(frontFloor, {
    //     position: Vector3.create(x * 16, 0, y * 16 + 16),
    //     rotation: Quaternion.fromEulerDegrees(90, 90, 0),
    //     scale: Vector3.create(1, 9, 1),
    //     parent:parent
    // })
    // GltfContainer.create(frontFloor, {src: local ? greenBeam : redBeam})

    // back
    Transform.create(back, {
        position: Vector3.create(x * 16 + 16, 0, y * 16 + 16),
        rotation: Quaternion.fromEulerDegrees(0, 0, 0),
        scale: Vector3.create(1, 20, 1),
        parent:parent
    })
    GltfContainer.create(back, {src: local ? greenBeam : redBeam})
    // Transform.create(backFloor, {
    //     position: Vector3.create(x * 16, 0, y * 16),
    //     rotation: Quaternion.fromEulerDegrees(90, 90, 0),
    //     scale: Vector3.create(1, 9, 1),
    //     parent:parent
    // })
    // GltfContainer.create(backFloor, {src: local ? greenBeam : redBeam})

    VisibilityComponent.create(floor, {visible:playMode ? false : true})
    VisibilityComponent.create(left, {visible:playMode ? false : true})
    VisibilityComponent.create(front, {visible:playMode ? false : true})
    VisibilityComponent.create(right, {visible:playMode ? false : true})
    VisibilityComponent.create(back, {visible:playMode ? false : true})

    BuildModeVisibilty.create(floor)
    BuildModeVisibilty.create(left)
    BuildModeVisibilty.create(front)
    BuildModeVisibilty.create(right)
    BuildModeVisibilty.create(back)

    return entities
}

export function addSelectedBoundaries(info: any) {
    let scene = scenesToCreate.get(info.player)
    let parcel = scene.parcels.find((p: any) => p.parcel === info.parcel)


    let local = true
    if (info.player !== localUserId) {
        local = false
    }

    parcel.entities = addBoundariesForParcel(info.parcel, local)
}

export function deleteParcelEntities(info: any) {
    let scene = scenesToCreate.get(info.player)
    if (scene) {
        let parcel = scene.parcels.find((p: any) => p.parcel === info.parcel)
        if (parcel) {
            parcel.entities.forEach((entity: any) => {
                engine.removeEntity(entity)
            });
            let index = scene.parcels.findIndex((p: any) => p.parcel === info.parcel)
            scene.parcels.splice(index, 1)
        }
    }
}

export function deleteCreationEntities(player: string) {
    let scene = scenesToCreate.get(player)
    if (scene) {
        scene.parcels.forEach((parcel: any) => {
            deleteParcelEntities({player: player, parcel: parcel})
        })
        scenesToCreate.delete(player)
    }
}

export function saveNewScene(userId:string) {
    // only save if local user saved
    if(userId !== localUserId) return

    displaySceneSavedPanel(true)
    displayCreateScenePanel(false)
    setPlayMode(localUserId, SCENE_MODES.BUILD_MODE)

    scenesToCreate.delete(localUserId)
    

    // let player = players.get(localUserId)

    // // allow building for each parcel
    // scene.pcls.forEach((parcel: any) => {
    //     player!.buildingAllowed.push(parcel)
    // })
    // scenesToCreate.delete(localUserId)

    // // create parent entity for scene//
    // const [x1, y1] = scene.bpcl.split(",")
    // let x = parseInt(x1)
    // let y = parseInt(y1)
    // const sceneParent = engine.addEntity()
    // Transform.create(sceneParent, {
    //     position: Vector3.create(x*16, 0, y*16)
    // })
    // MeshRenderer.setPlane(sceneParent)
    // scene.parentEntity = sceneParent

    // // add to player scenes
    // player!.scenes.push(scene)
    // player!.activeScene = scene

    // // change floor color
    // for (const [entity] of engine.getEntitiesWith(Material, SelectedFloor)){
    //     Material.setPbrMaterial(entity, {
    //         albedoColor: Color4.create(.2, .9, .1, 1)
    //     })
    // }


}