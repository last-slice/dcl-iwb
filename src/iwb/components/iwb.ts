// import { IWBCatalogComponent, IWBComponent } from "./Components"

import { VisibilityComponent } from "@dcl/sdk/ecs"

export function getEntity(scene:any, aid:string){
  return scene.parenting.find((entity:any)=> entity.aid === aid)
}

// export function addIWBComponent(scene:any){
//     scene.itemInfo.forEach((itemInfo:any, aid:string)=>{
//         let entity = scene.parenting.find((entity:any)=> entity.aid === aid)
//         if(entity){
//           IWBComponent.create(entity,{
//             aid:aid,
//             editing:itemInfo.editing,
//             buildVisibility:itemInfo.buildVis,
//             locked:itemInfo.locked
//           })
//         }
//     })
// }

// export function addIWBCatalogComponent(scene:any){
//   scene.catalogInfo.forEach((catalogInfo:any, aid:string)=>{
//       let entity = scene.parenting.find((entity:any)=> entity.aid === aid)
//       if(entity){
//         IWBCatalogComponent.create(entity,{
//           id:catalogInfo.id,
//           name:catalogInfo.name,
//           description:catalogInfo.description,
//           owner:catalogInfo.owner,
//           ownerAddress:catalogInfo.ownerAddress,
//           category:catalogInfo.category,
//           type:catalogInfo.type,
//           style:catalogInfo.style,
//           ugc:catalogInfo.ugc,
//           pending:catalogInfo.pending
//         })
//       }
//   })
// }

export function iwbInfoListener(scene:any){
  scene.itemInfo.onAdd((item:any, aid:any)=>{
    item.listen("buildVis", (c:any, p:any)=>{
          if(p !== undefined){
              let entityInfo = getEntity(scene, aid)
              if(entityInfo){
                VisibilityComponent.createOrReplace(entityInfo.entity, {visible: c})
              }
          }
      })
  })
}