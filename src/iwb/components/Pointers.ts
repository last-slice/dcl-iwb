import { PBPointerEvents_Entry, PointerEvents } from "@dcl/sdk/ecs"

export function addPointerComponent(scene:any){
    scene.pointers.forEach((pointer:any, aid:string)=>{
        let info = scene.parenting.find((entity:any)=> entity.aid === aid)
        if(info.entity){
            let pointerEvents:any[] = []
            pointer.events.forEach((info:any)=>{
                let event:any = {
                    eventType:info.eventType,
                    eventInfo:{
                        button:info.button,
                        hoverText:"" + info.hoverText,
                        showFeedback:info.showFeedback
                    }
                }
                pointerEvents.push(event)
            })
            PointerEvents.create(info.entity, {pointerEvents:pointerEvents})
        }
    })
}