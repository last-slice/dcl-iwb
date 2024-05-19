// import { IWBCatalogComponent, IWBComponent, NameComponent } from "./Components"
// import { getEntity } from "./IWB"

import { colyseusRoom } from "./Colyseus";

// export function addNameComponent(scene:any){
//     scene.names.forEach((name:any, aid:string)=>{
//         let entity = scene.parenting.find((entity:any)=> entity.aid === aid)
//         if(entity){
//           NameComponent.create(entity,{
//             value:name
//           })
//         }
//     })
// }

// export function nameListener(scene:any){
//     scene.names.onAdd((name:any, aid:any)=>{
//         name.p.listen("value", (c:any, p:any)=>{
//             // console.log('name change', p, c)
//             if(p !== undefined){
//                 let entity = getEntity(scene, aid)
//                 if(entity){
//                     NameComponent.createOrReplace(entity.entity, 
//                         {
//                             position:transform.p, 
//                             rotation:Quaternion.fromEulerDegrees(transform.r.x, transform.r.y, transform.r.z),
//                             scale:transform.s, 
//                         }
//                     )
//                 }
//             }
//         })
//     })
// }//

export function getAssetName(sceneId:string, aid:string){
    let scene = colyseusRoom.state.scenes.get(sceneId)
    if(!scene){
        return ""
    }

    let name = scene.names.get(aid)
    if(!name){
        return ""
    }
    return name.value
}
