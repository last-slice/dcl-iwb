import {ColliderLayer, engine, Entity, Material, MeshCollider, MeshRenderer, Schemas} from "@dcl/sdk/ecs";

export const EditableImageC = engine.defineComponent("EditableImageComponent", {
    src: Schemas.String
})


export function createImage(entity: Entity, src:string) {

    MeshRenderer.setPlane(entity)
    MeshCollider.setPlane(entity, ColliderLayer.CL_POINTER)

    Material.setBasicMaterial(entity, {
        texture: Material.Texture.Common({
            src: src,
        }),
    })

    EditableImageC.create(entity, {
        src: src
    })
}
