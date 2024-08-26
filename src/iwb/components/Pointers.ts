import { InputAction, PBPointerEvents_Entry, PointerEventType, PointerEvents } from "@dcl/sdk/ecs"
// import { PointersLoadedComponent } from "../helpers/Components"
import { getEntitiesWithParent } from "@dcl-sdk/utils"
import { getEntity } from "./IWB"
import { COMPONENT_TYPES, SCENE_MODES } from "../helpers/types"
import { playerMode } from "./Config"

export function checkPointerComponent(scene:any, entityInfo:any, dontInit?:boolean){
    // let itemInfo = scene[COMPONENT_TYPES.POINTER_COMPONENT].get(entityInfo.aid)
    // if(itemInfo){
    //     let pointerEvents:any[] = []
    //     itemInfo.events.forEach((info:any)=>{
    //         let event:any = {
    //             eventType:info.eventType,
    //             eventInfo:{
    //                 button:info.button,
    //                 hoverText:"" + info.hoverText,
    //                 showFeedback:info.showFeedback,
    //                 maxDistance: info.maxDistance
    //             }
    //         }
    //         pointerEvents.push(event)
    //     })
    //     console.log('pointer events are', pointerEvents)
    //     PointerEvents.create(itemInfo.entity, {pointerEvents:pointerEvents})

    //     // if(dontInit){
    //     //     return
    //     // }
        // PointersLoadedComponent.createOrReplace(entityInfo.entity, {init:false, sceneId:scene.id})
    // }
}

function updatePointer(pointerInfo:any, pointer:any){
    if(playerMode === SCENE_MODES.PLAYMODE){
        PointerEvents.deleteFrom(pointerInfo.entity)

        let pointerEvents:any[] = []
        pointer.events.forEach((info:any)=>{
            console.log('new pointer event is', info)
            let event:any = {
                eventType: info.eventType,
                eventInfo:{
                    button: info.button,
                    hoverText:"" + info.hoverText,
                    showFeedback: info.showFeedback,
                    maxDistance: info.maxDistance
                }
            }
            pointerEvents.push(event)
        })
        PointerEvents.createOrReplace(pointerInfo.entity, {pointerEvents:pointerEvents})   
    }
}

export function pointerListener(scene:any){
    scene[COMPONENT_TYPES.POINTER_COMPONENT].onAdd((pointer:any, aid:any)=>{
        let pointerInfo = getEntity(scene, aid)
        if(!pointerInfo){
            return
        }

        pointer.events.onAdd((event:any, index:any)=>{
            updatePointer(pointerInfo, pointer)

            event.listen("tick", (c:any, p:any)=>{
                if(c > 0){
                    updatePointer(pointerInfo, pointer)
                }
              })
        })

        pointer.events.onRemove((event:any, index:any)=>{
            updatePointer(pointerInfo, pointer)
        })
    })
}

export function setPointersPlayMode(scene:any, entityInfo:any){
    // if (PointersLoadedComponent.has(entityInfo.entity) && !PointersLoadedComponent.get(entityInfo.entity).init){
        let pointerInfo = scene[COMPONENT_TYPES.POINTER_COMPONENT].get(entityInfo.aid)
        if(pointerInfo && pointerInfo.events.length > 0){
            let pointers:any[] = []
            pointerInfo.events.forEach((pointerEvent:any)=>{            
                pointers.push(
                {
                    eventType: pointerEvent.eventType,
                    eventInfo: {
                        button: pointerEvent.button,
                        hoverText: "" + pointerEvent.hoverText,
                        maxDistance: pointerEvent.distance,
                        showFeedback: pointerEvent.showFeedback
                    }
                }
                )
            })

            PointerEvents.createOrReplace(entityInfo.entity,{
                pointerEvents:pointers
            })

        }
    //     PointersLoadedComponent.getMutable(entityInfo.entity).init = true
    // } 
}