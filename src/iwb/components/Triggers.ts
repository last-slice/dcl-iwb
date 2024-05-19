import { Entity } from "@dcl/sdk/ecs";

// const actionQueue: { entity: Entity; action: Action }[] = []
const actionQueue:any[] = []

export function addTriggerComponent(scene:any){
    scene.triggers.forEach((visibility:any, aid:string)=>{
        let info = scene.parenting.find((entity:any)=> entity.aid === aid)
        if(info.entity){
            // VisibilityComponent.create(info.entity, {visible: visibility.visible})
        }
    })
}


export function PlayTriggerSystem(dt:number){
    while (actionQueue.length > 0) {
        const { entity, action } = actionQueue.shift()!
        // const actionEvents = getActionEvents(entity)
        // actionEvents.emit(action.name, getPayload(action))
      }
}
