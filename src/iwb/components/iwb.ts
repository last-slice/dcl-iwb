// import { IWBCatalogComponent, IWBComponent } from "./Components"

import { COMPONENT_TYPES, SCENE_MODES } from "../helpers/types"
import { playerMode } from "./Config"
import { updateAssetBuildVisibility } from "./Visibility"

// export function checkIWBComponent(scene:any, entityInfo:any){
//   let iwbInfo = scene[COMPONENT_TYPES.IWB_COMPONENT].get(entityInfo.aid)
//   if(iwbInfo){
//     iwbInfo.components = []
//   }
// }

export function getEntity(scene:any, aid:string){
  return scene[COMPONENT_TYPES.PARENTING_COMPONENT].find((entity:any)=> entity.aid === aid)
}

// export function addIWBComponent(scene:any){
//     scene[COMPONENT_TYPES.IWB_COMPONENT].forEach((itemInfo:any, aid:string)=>{
//         let entity = scene[COMPONENT_TYPES.PARENTING_COMPONENT].find((entity:any)=> entity.aid === aid)
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
//       let entity = scene[COMPONENT_TYPES.PARENTING_COMPONENT].find((entity:any)=> entity.aid === aid)
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
  scene[COMPONENT_TYPES.IWB_COMPONENT].onAdd((item:any, aid:any)=>{
    // let iwbInfo = scene[COMPONENT_TYPES.PARENTING_COMPONENT].find(($:any)=> $.aid === aid)
    // if(!iwbInfo.components.includes(COMPONENT_TYPES.PARENTING_COMPONENT)){
    //   iwbInfo.components.push(COMPONENT_TYPES.PARENTING_COMPONENT)
    // }

    item.listen("buildVis", (c:any, p:any)=>{
          if(p !== undefined){
              let entityInfo = getEntity(scene, aid)
              if(entityInfo && playerMode === SCENE_MODES.BUILD_MODE){
                updateAssetBuildVisibility(scene, c, entityInfo)
              }
          }
      })
  })
}