import { Animator, Schemas, VisibilityComponent, engine } from "@dcl/sdk/ecs";

export const LevelAssetGLTF = engine.defineComponent("iwb::level::asset::gltf::component", {})
export const RealmEntityComponent = engine.defineComponent("iwb::realm::entity::component", {})

// export const AnimatorComponent = engine.defineComponent("iwb::asset::animator::component", {})
// export const VisiblityComponent = engine.defineComponent("iwb::asset::animator::component", {})
// export const AnimatorComponent = engine.defineComponent("iwb::asset::animator::component", {})
export const CollisionComponent = engine.defineComponent("iwb::asset::collision::component", {})

export const VideoLoadedComponent = engine.defineComponent("iwb::asset::video::loaded::component", {
    init:Schemas.Boolean,
    sceneId:Schemas.String
})

export const AudioLoadedComponent = engine.defineComponent("iwb::asset::audio::loaded::component", {
    init:Schemas.Boolean,
    sceneId:Schemas.String
})

export const VisibleLoadedComponent = engine.defineComponent("iwb::asset::visibl3::loaded::component", {
    init:Schemas.Boolean,
    sceneId:Schemas.String
})

export const MeshRenderLoadedComponent = engine.defineComponent("iwb::asset::mesh::render::loaded::component", {
    init:Schemas.Boolean,
    sceneId:Schemas.String
})

export const MeshColliderLoadedComponent = engine.defineComponent("iwb::asset::mesh::collider::loaded::component", {
    init:Schemas.Boolean,
    sceneId:Schemas.String
})

export const PointersLoadedComponent = engine.defineComponent("iwb::asset::pointers::loaded::component", {
    init:Schemas.Boolean,
    sceneId:Schemas.String
})

export const GLTFLoadedComponent = engine.defineComponent("iwb::asset::gltf::loaded::component", {
    init:Schemas.Boolean,
    sceneId:Schemas.String
})

export const SmartItemLoadedComponent = engine.defineComponent("iwb::asset::smartitem::loaded::component", {
    init:Schemas.Boolean,
    sceneId:Schemas.String
})

export const BillboardLoadedComponent = engine.defineComponent("iwb::asset::billboard::loaded::component", {
    init:Schemas.Boolean,
    sceneId:Schemas.String
})

export let AssetComponentList:any = {
    Animator: Animator,
    Visibility: VisibilityComponent,
    Collision: CollisionComponent
}

export const GunDataComponent = engine.defineComponent("iwb::GunDataComponent", {
    active: Schemas.Boolean,
    recoilPosition: Schemas.Vector3,
    restPosition: Schemas.Vector3,
    recoilRotation: Schemas.Quaternion,
    restRotation: Schemas.Quaternion,
    recoilFactor: Schemas.Number,
    recoilSpeed:Schemas.Number
})
  