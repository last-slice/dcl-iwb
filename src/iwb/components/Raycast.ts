import { ColliderLayer, engine, GltfContainer, Material, MeshCollider, MeshRenderer, RaycastQueryType, raycastSystem, Transform } from "@dcl/sdk/ecs"
import { getEntity } from "./iwb"
import { COMPONENT_TYPES } from "../helpers/types"
import { Vector3 } from "@dcl/sdk/math"

export function checkRaycastComponent(scene:any, entityInfo:any){
    let itemInfo = scene[COMPONENT_TYPES.RAYCAST_COMPONENT].get(entityInfo.aid)
    if(!itemInfo){
        return
    }
}

export function raycastListener(scene:any){
    scene[COMPONENT_TYPES.RAYCAST_COMPONENT].onAdd((raycast:any, aid:any)=>{
        let entityInfo = getEntity(scene, aid)
        if(!entityInfo){
            return
        }

        raycast.listen("type", (c:any, p:any)=>{
            resetRaycast(scene, entityInfo, raycast)
        })
    })
}

export function disableRaycast(scene:any, entityInfo:any){
    raycastSystem.removeRaycasterEntity(entityInfo.entity)

    let raycastInfo = scene[COMPONENT_TYPES.RAYCAST_COMPONENT].get(entityInfo.aid)
    if(!raycastInfo){
        return
    }

    raycastInfo.laserEntity = engine.addEntity()
    let transform:any = {
        scale: Vector3.create(0.1,0.1, raycastInfo.maxD)
    }
    
    let rotation:any

    switch(raycastInfo.type){
        case 0:
            transform.parent = entityInfo.entity
            break;

        case 1:
            break;

        case 2:
            break;

        case 3:
            break;
    }

    transform.rotation = rotation

    Transform.create(raycastInfo.laserEntity, transform)
    MeshRenderer.setBox(raycastInfo.laserEntity)
}

function resetRaycast(scene:any, entityInfo:any, raycast:any){
    raycastSystem.removeRaycasterEntity(entityInfo.entity)
    switch(raycast.type){
        case 0:
            console.log('creating local raycast', raycast)
            raycastSystem.registerLocalDirectionRaycast(
                {
                  entity: entityInfo.entity,
                  opts: {
                    queryType: raycast.hit,
                    direction: raycast.direction,
                    maxDistance: raycast.maxD,
                    continuous: raycast.cont,
                  },
                },
                function (raycastResult) {
                  console.log(raycastResult.hits)
                }
              )
            break;

        case 1:
            console.log('creating global direction raycast', raycast)
            raycastSystem.registerGlobalDirectionRaycast(
                {
                  entity: entityInfo.entity,
                  opts: {
                    queryType: raycast.hit,
                    direction: raycast.direction,
                    maxDistance: raycast.maxD,
                    continuous: raycast.cont,
                  },
                },
                function (raycastResult) {
                  console.log(raycastResult.hits)
                }
              )
            break;

        case 2:
            console.log('creating global target raycast', raycast)
            raycastSystem.registerGlobalTargetRaycast(
                {
                  entity: entityInfo.entity,
                  opts: {
                    queryType: raycast.hit,
                    target: raycast.targetV,
                    maxDistance: raycast.maxD,
                    continuous: raycast.cont,
                  },
                },
                (raycastResult) => {
                  console.log(raycastResult.hits)
                }
              )
            break;

        case 3:
            console.log('creating target entity raycast', raycast)
            let targetEntityInfo = getEntity(scene, raycast.targetAid)
            if(!targetEntityInfo){
                return
            }

            raycastSystem.registerTargetEntityRaycast(
                {
                    entity:entityInfo.entity,
                    opts:{
                        queryType: raycast.hit,
                        targetEntity: targetEntityInfo.entity,
                        maxDistance:raycast.maxD
                    }
                    },
                (raycastResult)=>{
                  console.log(raycastResult.hits)
                }
              )
            break;
    }
}