import {engine, GltfContainer, InputAction, pointerEventsSystem, Transform} from "@dcl/sdk/ecs";
import {Vector3} from "@dcl/sdk/math";

export function createObject(model: string, pos: Vector3, scale: Vector3) {
    const entity = engine.addEntity()
    Transform.create(entity, {position: pos, scale: scale, parent: engine.PlayerEntity})
    GltfContainer.create(entity, {src: 'assets/' + model + ".glb"})

    pointerEventsSystem.onPointerDown(
        {
            entity: entity,
            opts: {button: InputAction.IA_PRIMARY, hoverText: 'Drop'},
        },
        function () {
            console.log('clicked entity')

            const t = Transform.getMutable(entity)

            const {position: pp, rotation: pr} = Transform.get(engine.PlayerEntity)
            //const {rotation: cr, position: cp} = Transform.get(engine.CameraEntity)

            const forwardVector = Vector3.rotate(Vector3.scale(Vector3.Forward(), 4), pr)
            t.position = Vector3.add(pp, forwardVector)
            t.position.y = t.position.y - .88

            // t.position.x = t.position.x + ptp.x
            // t.position.y = t.position.y + ptp.y
            // t.position.z = t.position.z + ptp.z
            t.parent = undefined

            //t.rotation.x = t.rotation.x + ptr.x
            t.rotation.y = pr.y
            //t.rotation.z = t.rotation.z + ptr.z
            t.rotation.w = pr.w

            pointerEventsSystem.removeOnPointerDown(entity)
        }
    )

    return entity
}