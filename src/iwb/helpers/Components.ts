import { Animator, VisibilityComponent, engine } from "@dcl/sdk/ecs";

export const RealmEntityComponent = engine.defineComponent("iwb::realm::entity::component", {})

// export const AnimatorComponent = engine.defineComponent("iwb::asset::animator::component", {})
// export const VisiblityComponent = engine.defineComponent("iwb::asset::animator::component", {})
// export const AnimatorComponent = engine.defineComponent("iwb::asset::animator::component", {})
export const CollisionComponent = engine.defineComponent("iwb::asset::collision::component", {})



export let AssetComponentList:any = {
    Animator: Animator,
    Visibility: VisibilityComponent,
    Collision: CollisionComponent
}
