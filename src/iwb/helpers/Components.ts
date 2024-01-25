import { Animator, Schemas, VisibilityComponent, engine } from "@dcl/sdk/ecs";

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

export const CollisionLoadedComponent = engine.defineComponent("iwb::asset::twodcollision::loaded::component", {
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


export let AssetComponentList:any = {
    Animator: Animator,
    Visibility: VisibilityComponent,
    Collision: CollisionComponent
}
