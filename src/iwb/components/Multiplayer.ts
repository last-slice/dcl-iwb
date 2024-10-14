import { AvatarAttach, engine, Transform } from "@dcl/sdk/ecs"
import { COMPONENT_TYPES } from "../helpers/types"
import { localPlayer, localUserId } from "./Player"
import { getEntity } from "./iwb"
import { Quaternion } from "@dcl/sdk/math"
import { actionQueue } from "./Triggers"

export async function mutiplayerListener(scene:any){
    scene[COMPONENT_TYPES.MULTIPLAYER_COMPONENT].onAdd(async (multiplayerInfo:any, aid:any)=>{
      console.log('multiplayer component added', aid, multiplayerInfo)

      multiplayerInfo.actionsToSync.onAdd((actionToSync:string, aid:any)=>{
            console.log('action id to sync added', aid, actionToSync)
      })

      multiplayerInfo && multiplayerInfo.attachedItem && multiplayerInfo.attachedItem.listen("enabled", (current:any, previous:any)=>{
        console.log('attached item changed', previous, current)

        if(!localPlayer.activeScene || localPlayer.activeScene.id !== scene.id){
            console.log('player is not on scene')
            return
        }
        if(current){
            let entityInfo = getEntity(scene, aid)
            if(!entityInfo){
                console.log('no entity for that multiplyaer attachment')
                return
            }
            globalAttachItem(multiplayerInfo, entityInfo)
        }
      })
    })
  }

export function checkMultiplayerSyncOnEnter(scene:any, entityInfo:any){
    let multiplayerInfo = scene[COMPONENT_TYPES.MULTIPLAYER_COMPONENT].get(entityInfo.aid)
    if(!multiplayerInfo){
        return
    }

    console.log('checking multiplayer info for item', entityInfo.aid)

    //check if attached//
    if(multiplayerInfo.attachedItem.enabled){
        globalAttachItem(multiplayerInfo, entityInfo)
    }

    multiplayerInfo.actionsToSync.forEach((actionToSync:any)=>{
        console.log('have action to sync', entityInfo.aid, actionToSync)

        if(actionToSync.userId !== localUserId){
            console.log('run synced action for player')
            let actionInfo = scene[COMPONENT_TYPES.ACTION_COMPONENT].get(entityInfo.aid)
                console.log('action info is', actionInfo)
                if(actionInfo){
                    // let entityInfo = getEntity(scene, entityInfo.aid)
                    // console.log('entity info is', entityInfo, entityInfo.entity)

                    let action = actionInfo.actions.find(($:any)=> $.id === actionToSync.actionId)
                    if(action){
                        console.log('running entity action', action)
                        actionQueue.push({aid:entityInfo.aid, action:action, entity:entityInfo.entity, force:true})
                    }
                }
        }
    })
}

function globalAttachItem(multiplayerInfo:any, entityInfo:any){
    console.log('attaching global item', multiplayerInfo)
    multiplayerInfo.attachedItem.parent = engine.addEntity()
    AvatarAttach.create(multiplayerInfo.attachedItem.parent,
        {
            anchorPointId:multiplayerInfo.attachedItem.anchor,
            avatarId: multiplayerInfo.attachedItem.userId !== localUserId ? multiplayerInfo.attachedItem.userId : undefined
        }
    )

    Transform.createOrReplace(entityInfo.entity, 
        {
            parent: multiplayerInfo.attachedItem.parent,
            position: multiplayerInfo.attachedItem.pOffset,
            rotation: Quaternion.fromEulerDegrees(multiplayerInfo.attachedItem.rOffset.x, multiplayerInfo.attachedItem.rOffset.y, multiplayerInfo.attachedItem.rOffset.z),
            scale: multiplayerInfo.attachedItem.sOffset
        }
    )
}