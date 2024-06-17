import { Schemas, engine } from "@dcl/sdk/ecs"
import { colyseusRoom } from "./Colyseus"
import { getEntity } from "./IWB"
import resources from "../helpers/resources"
import { COMPONENT_TYPES } from "../helpers/types"

export const Numbers = engine.defineComponent(resources.slug + "counter::component", {
    defaultValue:Schemas.Int,
    currentValue:Schemas.Int,
    previousValue:Schemas.Int
})

export function checkCounterComponent(scene:any, entityInfo:any){
    let itemInfo = scene[COMPONENT_TYPES.COUNTER_COMPONENT].get(entityInfo.aid)
    if(itemInfo){
        console.log('counter component is', itemInfo)//
        Numbers.createOrReplace(entityInfo.entity, {
            defaultValue: itemInfo.defaultValue,
            currentValue: itemInfo.currentValue,
            previousValue: itemInfo.previousValue
        })
    }
}

export function disableCounterForPlayMode(scene:any, entityInfo:any){
    let itemInfo = scene[COMPONENT_TYPES.COUNTER_COMPONENT].get(entityInfo.aid)
    if(itemInfo){
        Numbers.createOrReplace(entityInfo.entity, {
            defaultValue: itemInfo.defaultValue,
            currentValue: itemInfo.currentValue,
            previousValue: itemInfo.previousValue
        })
    }
}


export function getCounterValue(sceneId:string, aid:string, type:string, current:number){
    let scene = colyseusRoom.state.scenes.get(sceneId)
    if(!scene){ 
        return ""
    }

    let counters = scene[COMPONENT_TYPES.COUNTER_COMPONENT].get(aid)
    if(!counters){
        return ""
    }

    let value = counters.values.get(type)
    if(!value){
        return 0
    }

    return current ? value.currentValue : value.previousValue
}


// export function addCounterComponent(scene:any){//
//     scene[COMPONENT_TYPES.COUNTER_COMPONENT].forEach((counter:any, aid:string)=>{
//         let info = scene[COMPONENT_TYPES.PARENTING_COMPONENT].find((entity:any)=> entity.aid === aid)
//         if(info){
//             let counterSchemas:any[] = []
//             counter.values.forEach((counter:any, name:string)=>{
//                 console.log('counter is', name, counter)
//                 counterSchemas.push({
//                     name:name,
//                     currentValue:counter.currentValue,
//                     previousValue:counter.previousValue
//                 })
//             })

//             Numbers.create(info.entity, {
//                 values:counterSchemas
//             })
//         }
//     })
// }

export function getCounterComponentByAssetId(scene:string, aid:string, counter:any){
    let entityInfo = getEntity(scene, aid)
    if(entityInfo){
        return Numbers.getMutableOrNull(entityInfo.entity)
    }
    return null
}

export function updateCounter(counter:any, value:any){
    counter.previousValue = counter.currentValue
    counter.currentValue += value
    console.log('counter component is now', counter)
}

export function setCounter(counter:any, value:any){
    counter.previousValue = counter.currentValue
    counter.currentValue = value
    console.log('counter component is now', counter)
}


export function counterListener(scene:any){
    scene[COMPONENT_TYPES.COUNTER_COMPONENT].onAdd((counter:any, aid:any)=>{
        // let iwbInfo = scene[COMPONENT_TYPES.PARENTING_COMPONENT].find(($:any)=> $.aid === aid)
        // if(!iwbInfo.components.includes(COMPONENT_TYPES.COUNTER_COMPONENT)){
        //   iwbInfo.components.push(COMPONENT_TYPES.COUNTER_COMPONENT)
        // }

        let info = getEntity(scene, aid)
        if(!info){
            return
        }

        counter.listen("currentValue", (c:any, p:any)=>{
            // console.log('counter current value changed', key, p, c)

            // let counter = getCounterComponentByAssetId(scene, info.aid, action)
            // if(counter){
            //     updateCounter(counter, action.value)
            // }//
        })

        counter.listen("previousValue", (c:any, p:any)=>{
            // console.log('counter previous value changed', key, p, c)
        })
    })
}