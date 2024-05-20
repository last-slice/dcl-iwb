import { Schemas, engine } from "@dcl/sdk/ecs"
import { colyseusRoom } from "./Colyseus"
import { getEntity } from "./IWB"
import resources from "../helpers/resources"

export const Numbers = engine.defineComponent(resources.slug + "counter::component", {
    values:Schemas.Array(Schemas.Map({
        name:Schemas.String,
        currentValue:Schemas.Int,
        previousValue:Schemas.Int
        })
    )
})

export function getCounterValue(sceneId:string, aid:string, type:string, current:number){
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

    return current ? value.currentValue : value.previousValue
}


export function addCounterComponent(scene:any){
    scene.counters.forEach((counter:any, aid:string)=>{
        let info = scene.parenting.find((entity:any)=> entity.aid === aid)
        if(info){
            let counterSchemas:any[] = []
            counter.values.forEach((counter:any, name:string)=>{
                console.log('counter is', name, counter)
                counterSchemas.push({
                    name:name,
                    currentValue:counter.currentValue,
                    previousValue:counter.previousValue
                })
            })

            Numbers.create(info.entity, {
                values:counterSchemas
            })
        }
    })
}

export function getCounterComponentByAssetId(scene:string, aid:string, counter:any){
    let entityInfo = getEntity(scene, aid)
    if(entityInfo){
        let counterComponent = Numbers.getMutable(entityInfo.entity)
        if(counterComponent){
            return counterComponent.values.find($=> $.name === counter)
        }
    }
    return undefined
}

export function updateCounter(counter:any, value:any){
    counter.previousValue = counter.currentValue
    counter.currentValue += value
    console.log('counter component is now', counter)
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

                // let counter = getCounterComponentByAssetId(scene, info.aid, action)
                // if(counter){
                //     updateCounter(counter, action.value)
                // }
            })

            counter.listen("previousValue", (c:any, p:any)=>{
                // console.log('counter previous value changed', key, p, c)
            })
        })
    })
}