import { GltfContainer, InputAction, Material, MeshCollider, MeshRenderer, Transform, engine, pointerEventsSystem } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import { log } from "../../helpers/functions";
import { localUserId, setPlayMode } from "../player/player";
import { SCENE_MODES } from "../../helpers/types";

export function createHQ(){
  let floor = engine.addEntity()
  MeshRenderer.setPlane(floor)
  Transform.create(floor, {position: Vector3.create(16,0,16), scale: Vector3.create(32,32,1), rotation:Quaternion.fromEulerDegrees(90,0,0)})


  let createSceneBox = engine.addEntity()
  MeshRenderer.setBox(createSceneBox)
  MeshCollider.setBox(createSceneBox)
  Transform.create(createSceneBox, {position: Vector3.create(16,1,16), scale: Vector3.create(1,1,1), rotation:Quaternion.fromEulerDegrees(0,0,0)})

  pointerEventsSystem.onPointerDown({
    entity: createSceneBox,
    opts:{hoverText: "Create Scene", maxDistance:10, button:InputAction.IA_POINTER},
  },
  function () {
      log('create scene mode')
      setPlayMode(localUserId, SCENE_MODES.CREATE_SCENE_MODE)
  })
}

