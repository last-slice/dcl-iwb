import { AvatarAnchorPointType, AvatarAttach, Entity, MeshRenderer, Transform, engine } from "@dcl/sdk/ecs"
import { SelectedItem } from "../helpers/types"
import { Vector3 } from "@dcl/sdk/math"
import players from "@dcl/sdk/players"
import { items } from "../components/Catalog"
import { localPlayer, localUserId } from "../components/Player"
import { log } from "../helpers/functions"

export let editAssets: Map<string, Entity> = new Map()
export let grabbedAssets: Map<string, Entity> = new Map()
export let selectedItem: SelectedItem
export let playerParentEntities: Map<string, Entity> = new Map()
export let tweenPlacementEntity: Entity = engine.addEntity()

let ITEM_DEPTH_DEFAULT = 4
let ITEM_HEIGHT_DEFAULT = -.88

export function otherUserRemovedSeletedItem(player: any) {
    let parent = playerParentEntities.get(player)
    if (parent) {
        engine.removeEntityWithChildren(parent)
    }
}

export function otherUserSelectedItem(info: any, catalog?: boolean) {
    log('other user selected item', info, catalog)
    try {
        let parent = engine.addEntity()
        Transform.createOrReplace(parent, {position: Vector3.create(0, 2, 0)})
        AvatarAttach.createOrReplace(parent, {
            avatarId: info.user,
            anchorPointId: AvatarAnchorPointType.AAPT_POSITION,
        })


        let itemData = items.get(info.catalogId)
        if (itemData) {
            let entity = engine.addEntity()
            let scale: any
            scale = Vector3.create(2, 2, 1)

            if (itemData.v && itemData.v > localPlayer.version) {
                log('this asset is not ready for viewing, need to add temporary asset')
                MeshRenderer.setBox(entity)

                if (itemData.bb) {
                    scale = Vector3.create(itemData.bb.x, itemData.bb.y, itemData.bb.z)
                }

            } else {
                log('this asset is ready for viewing, place object in scene', info.catalogId)
                // addGrabbedComponent(entity, info.catalogId, !info.catalogAsset ? info.componentData : undefined)
                !info.catalogAsset ? scale = info.componentData.s : null
            }

            Transform.createOrReplace(entity, {position: {x: 0, y: .25, z: 4}, scale: scale, parent: parent})

            playerParentEntities.set(info.user, parent)
            grabbedAssets.set(info.assetId, entity)
        }
    } catch (e) {
        log('error attaching other user item', e)
    }
}