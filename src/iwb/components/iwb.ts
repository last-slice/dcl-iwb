// import { IWBCatalogComponent, IWBComponent } from "./Components"

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

// export function iwbInfoListener(scene:any){
//     scene.catalogInfo.onAdd((catalogInfo:any, aid:any)=>{
//     })

//     scene.itemInfo.onAdd((itemInfo:any, aid:any)=>{
//     })
// }
