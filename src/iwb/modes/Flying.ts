import {Color4, Quaternion, Vector3} from "@dcl/sdk/math";
import {
    CameraModeArea,
    CameraType,
    ColliderLayer,
    engine,
    Entity,
    Material,
    MeshCollider,
    MeshRenderer,
    Transform
} from "@dcl/sdk/ecs";
import { localPlayer } from "../components/Player";
import { log } from "../helpers/functions";
import { VIEW_MODES } from "../helpers/types";
import { playerViewMode, setPlayerViewMode } from "../components/Config";

export let isFlyModeEnabled = false

export function toggleFlyMode() {
    isFlyModeEnabled = !isFlyModeEnabled
    if(playerViewMode === VIEW_MODES.GOD){
        setPlayerViewMode(VIEW_MODES.AVATAR)
    }else{
        setPlayerViewMode(VIEW_MODES.GOD)
    }

    if (isFlyModeEnabled) {
        log('God Mode Enabled')
        flyBox = createFlyBox()
    } else {
        removeFlyBox()
    }

}

export let flyBox: Entity

function createFlyBox() {
    const invisibleBox = engine.addEntity()

    let pos = Transform.get(engine.PlayerEntity).position

    const floor = engine.addEntity()
    MeshCollider.setPlane(floor, ColliderLayer.CL_PHYSICS)
    Material.setPbrMaterial(floor, {albedoColor: Color4.create(0, 0, 0, .1)})
    Transform.createOrReplace(floor, {
        position: Vector3.create(0, 0, 0),
        scale: Vector3.create(300, 300, 1),
        rotation: Quaternion.fromEulerDegrees(90, 0, 0),
        parent: invisibleBox
    })
    //
    // const wall1 = engine.addEntity()
    // MeshCollider.setPlane(wall1)
    // Transform.create(wall1, {
    //     position: Vector3.create(0, .4, 1),
    //     rotation: Quaternion.fromEulerDegrees(0, 0, 0),
    //     scale: Vector3.create(2, .7, 1),
    //     parent: invisibleBox
    // })
    //
    // const wall2 = engine.addEntity()
    // MeshCollider.setPlane(wall2)
    // Transform.create(wall2, {
    //     position: Vector3.create(1, .4, 0),
    //     rotation: Quaternion.fromEulerDegrees(0, 90, 0),
    //     scale: Vector3.create(2, .7, 1),
    //     parent: invisibleBox
    // })
    //
    // const wall3 = engine.addEntity()
    // MeshCollider.setPlane(wall3)
    // Transform.create(wall3, {
    //     position: Vector3.create(-1, .4, 0),
    //     rotation: Quaternion.fromEulerDegrees(0, 90, 0),
    //     scale: Vector3.create(2, .7, 1),
    //     parent: invisibleBox
    // })
    //
    // const wall4 = engine.addEntity()
    // MeshCollider.setPlane(wall4)
    // Transform.create(wall4, {
    //     position: Vector3.create(0, .4, -1),
    //     rotation: Quaternion.fromEulerDegrees(0, 0, 0),
    //     scale: Vector3.create(2, .7, 1),
    //     parent: invisibleBox
    // })

    Transform.createOrReplace(invisibleBox, {
        position: Vector3.create(pos.x, pos.y - .88, pos.z)
    })

    const cameraModeE = engine.addEntity()
    Transform.createOrReplace(cameraModeE, {
        scale: Vector3.create(300, 300, 300),
        parent: invisibleBox
    })
    // CameraModeArea.create(cameraModeE, {
    //     area: Vector3.create(300, 300, 300),
    //     mode: CameraType.CT_FIRST_PERSON,
    // })

    //MeshRenderer.setBox(cameraModeE)
    //MeshRenderer.setPlane(floor)
    // MeshRenderer.setPlane(wall1)
    // MeshRenderer.setPlane(wall2)
    // MeshRenderer.setPlane(wall3)
    // MeshRenderer.setPlane(wall4)

    return invisibleBox
}

function removeFlyBox() {
    if (flyBox) {
        engine.removeEntityWithChildren(flyBox)
    }
}