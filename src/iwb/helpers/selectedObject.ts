import { GltfContainer, Transform, engine } from "@dcl/sdk/ecs";
import { Vector3 } from "@dcl/sdk/math";

export function createObject(model: string, pos: Vector3, scale: Vector3){
    const obj = engine.addEntity()
    Transform.create(obj, {position: pos, scale: scale})
    GltfContainer.create(obj,{src: model})

return obj
}