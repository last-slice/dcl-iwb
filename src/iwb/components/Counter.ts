import { colyseusRoom } from "./Colyseus"
import { getEntity } from "./IWB"

export function getCounterValue(sceneId:string, aid:string, type:string){
    let scene = colyseusRoom.state.scenes.get(sceneId)
    if(!scene){
        return ""
    }

    let counters = scene.counters.get(aid)
    if(!counters){
        return ""
    }

    let value = counters.values.get(type)
    if(!value){
        return 0
    }

    return value
}

export function counterListener(scene:any){
    scene.counters.onAdd((counters:any, aid:any)=>{
        let info = getEntity(scene, aid)
        if(!info){
            return
        }

        counters.values.onAdd((counter:any, key:any)=>{
            counter.listen("currentValue", (c:any, p:any)=>{
                // console.log('counter current value changed', key, p, c)
            })

            counter.listen("previousValue", (c:any, p:any)=>{
                // console.log('counter previous value changed', key, p, c)
            })
        })
    })
}