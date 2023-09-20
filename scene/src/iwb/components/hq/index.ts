import { MeshRenderer, Transform, engine } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";



export function createHQ(){

  let floor = engine.addEntity()
  MeshRenderer.setPlane(floor)
  Transform.create(floor, {position: Vector3.create(16,0,16), scale: Vector3.create(32,32,1), rotation:Quaternion.fromEulerDegrees(90,0,0)})
//
}