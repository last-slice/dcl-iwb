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

export function nameListener(scene:any){
    scene.names.onAdd((name:any, aid:any)=>{
        console.log('name added', aid, name)
    })
}

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
