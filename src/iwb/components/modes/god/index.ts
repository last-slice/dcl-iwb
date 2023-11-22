import {localPlayer, localUserId, players} from "../../player/player";
import {VIEW_MODES} from "../../../helpers/types";
import {log} from "../../../helpers/functions";
import {Color4, Quaternion, Vector3} from "@dcl/sdk/math";
import {
    engine,
    Entity,
    InputAction,
    inputSystem, Material,
    MeshCollider,
    MeshRenderer,
    PointerEventType,
    Transform
} from "@dcl/sdk/ecs";
import {setButtonState} from "../../listeners/inputListeners";
import {checkShortCuts} from "../../listeners/shortcuts";
import {getEntitiesWithParent} from "@dcl-sdk/utils";

export let isGodModeEnabled = false

export function toggleGodMode(){
    isGodModeEnabled = !isGodModeEnabled
    localPlayer.viewMode = isGodModeEnabled ? VIEW_MODES.GOD : VIEW_MODES.AVATAR

    if(isGodModeEnabled){
        log('God Mode Enabled')
        godBox = createGodBox()


        // engine.addSystem(() => {
        //
        //
        //
        //     // if (inputSystem.isTriggered(InputAction.IA_FORWARD, PointerEventType.PET_DOWN)){
        //     //     //setButtonState(InputAction.IA_FORWARD, PointerEventType.PET_DOWN)
        //     //     console.log('forward')
        //     //
        //     //     //Transform.getMutable(godBox).position = Vector3.add(Transform.get(godBox).position, Vector3.create(0,0,-.1))
        //     //
        //     //
        //     //
        //     // }
        //
        // })

    } else {
        removeGodBox()
    }

}

export let godBox:Entity

function createGodBox(){
    const invisibleBox = engine.addEntity()

    let pos = Transform.get(engine.PlayerEntity).position

    const floor = engine.addEntity()
    MeshCollider.setPlane(floor)
    Material.setPbrMaterial(floor, { albedoColor: Color4.Red() })
    Transform.create(floor, {position: Vector3.create(0,0,0), scale: Vector3.create(5,5,5), rotation:Quaternion.fromEulerDegrees(90,0,0), parent: invisibleBox})

    const wall1 = engine.addEntity()
    MeshCollider.setPlane(wall1)
    Transform.create(wall1, {position: Vector3.create(0, .4,1), rotation:Quaternion.fromEulerDegrees(0,0,0), scale: Vector3.create(2,.7,1), parent: invisibleBox})

    const wall2 = engine.addEntity()
    MeshCollider.setPlane(wall2)
    Transform.create(wall2, {position: Vector3.create(1, .4,0), rotation:Quaternion.fromEulerDegrees(0,90,0), scale: Vector3.create(2,.7,1), parent: invisibleBox})

    const wall3 = engine.addEntity()
    MeshCollider.setPlane(wall3)
    Transform.create(wall3, {position: Vector3.create(-1, .4,0), rotation:Quaternion.fromEulerDegrees(0,90,0), scale: Vector3.create(2,.7,1), parent: invisibleBox})

    const wall4 = engine.addEntity()
    MeshCollider.setPlane(wall4)
    Transform.create(wall4, {position: Vector3.create(0, .4,-1), rotation:Quaternion.fromEulerDegrees(0,0,0), scale: Vector3.create(2,.7,1), parent: invisibleBox})

    Transform.createOrReplace(invisibleBox, {
        position: Vector3.create(pos.x-2.5, pos.y+1, pos.z-2.5),
    })


    // MeshRenderer.setPlane(floor)
    // MeshRenderer.setPlane(wall1)
    // MeshRenderer.setPlane(wall2)
    // MeshRenderer.setPlane(wall3)
    // MeshRenderer.setPlane(wall4)

    return invisibleBox
}

function removeGodBox(){
    if(godBox){

        getEntitiesWithParent(godBox).forEach((entity)=>{
            engine.removeEntity(entity)
        })

        engine.removeEntity(godBox)
    }
}