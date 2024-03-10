import { GltfContainer, InputAction, Material, MeshCollider, MeshRenderer, Transform, engine, pointerEventsSystem } from "@dcl/sdk/ecs";
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math";
export function createHQ(){
  let floor = engine.addEntity()
  MeshRenderer.setPlane(floor)
  Transform.createOrReplace(floor, {position: Vector3.create(16,0,16), scale: Vector3.create(32,32,1), rotation:Quaternion.fromEulerDegrees(90,0,0)})

  let texture = Material.Texture.Common({src: 'assets/iwb-circle-logo.png'})
  Material.setPbrMaterial(floor, {
    texture: texture,
    emissiveColor:Color4.White(),
    emissiveIntensity: 1.2,
    emissiveTexture: texture
  })
}

