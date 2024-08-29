import { Animator, Schemas, VisibilityComponent, engine } from "@dcl/sdk/ecs";

export const LevelAssetGLTF = engine.defineComponent("iwb::level::asset::gltf::component", {})
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

export const GunDataComponent = engine.defineComponent("iwb::GunDataComponent", {
    active: Schemas.Boolean,
    multiplayer:Schemas.Boolean,
    ammo:Schemas.Number,
    magSize:Schemas.Number,
    maxAmmo:Schemas.Number,
    recoilPosition: Schemas.Vector3,
    restPosition: Schemas.Vector3,
    recoilRotation: Schemas.Quaternion,
    restRotation: Schemas.Quaternion,
    recoilFactor: Schemas.Number,
    recoilSpeed:Schemas.Number,
    damage:Schemas.Number,
    range:Schemas.Number,
    fireRate:Schemas.Number,
    projectile:Schemas.String,
    sceneId:Schemas.String
})
  