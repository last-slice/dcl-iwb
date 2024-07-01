// import { IWBCatalogComponent, IWBComponent } from "./Components"

import { engine } from "@dcl/sdk/ecs"
import { PointersLoadedComponent, RealmEntityComponent } from "../helpers/Components"
import { COMPONENT_TYPES, SCENE_MODES } from "../helpers/types"
import { addBuildModePointers, removeItem, resetEntityForBuildMode } from "../modes/Build"
import { checkBillboardComponent } from "./Billboard"
import { iwbConfig, playerMode } from "./Config"
import { checkCounterComponent } from "./Counter"
import { checkGLTFComponent } from "./Gltf"
import { checkMaterialComponent } from "./Materials"
import { checkMeshRenderComponent, checkMeshColliderComponent } from "./Meshes"
import { checkNftShapeComponent } from "./NftShape"
import { checkPointerComponent } from "./Pointers"
import { afterLoadActions } from "./Scene"
import { checkAudioSourceComponent, checkAudioStreamComponent } from "./Sounds"
import { checkTextShapeComponent } from "./TextShape"
import { checkTextureComponent } from "./Textures"
import { checkTransformComponent } from "./Transform"
import { checkTriggerComponent } from "./Triggers"
import { checkUIImage } from "./UIImage"
import { checkUIText } from "./UIText"
import { checkVideoComponent } from "./Videos"
import { updateAssetBuildVisibility } from "./Visibility"

// export function checkIWBComponent(scene:any, entityInfo:any){
//   let iwbInfo = scene[COMPONENT_TYPES.IWB_COMPONENT].get(entityInfo.aid)
//   if(iwbInfo){
//     iwbInfo.components = []
//   }
// }

export function getEntity(scene:any, aid:string){
  return scene[COMPONENT_TYPES.IWB_COMPONENT].get(aid)
  // let entityInfo = scene[COMPONENT_TYPES.IWB_COMPONENT].get(aid)
  // if(entityInfo){
  //   return entityInfo.entity
  // }
  // return undefined
  // return scene[COMPONENT_TYPES.PARENTING_COMPONENT].find((entity:any)=> entity.aid === aid)
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

export function createEntity(item:any){
  let ent = engine.addEntity()
  item.entity = ent
  // item.components = []//

  console.log('creating entity', ent)
  RealmEntityComponent.create(ent)

  if (playerMode === SCENE_MODES.BUILD_MODE) {
      addBuildModePointers(ent)
  }
  console.log('finished creating entity')
}

export async function iwbInfoListener(scene:any){
  scene[COMPONENT_TYPES.IWB_COMPONENT].onAdd(async (iwbInfo:any, aid:any)=>{
    console.log('iwb component added', aid, iwbInfo)
    if(aid){
      
      iwbInfo.aid = aid
      if(!["0","1","2"].includes(aid)){
          await createEntity(iwbInfo)
      }

      PointersLoadedComponent.createOrReplace(iwbInfo.entity, {init: false, sceneId: scene.id})

      await checkTransformComponent(scene, iwbInfo)  
      await checkGLTFComponent(scene, iwbInfo)
      await checkTextureComponent(scene, iwbInfo)
      await checkPointerComponent(scene, iwbInfo)
      await checkMeshRenderComponent(scene, iwbInfo)
      await checkMeshColliderComponent(scene, iwbInfo)
      await checkMaterialComponent(scene, iwbInfo)
      await checkAudioSourceComponent(scene, iwbInfo)
      await checkAudioStreamComponent(scene, iwbInfo)
      await checkTextShapeComponent(scene, iwbInfo)
      await checkVideoComponent(scene, iwbInfo)
      await checkNftShapeComponent(scene, iwbInfo)
      await checkCounterComponent(scene, iwbInfo)
      await checkUIText(scene, iwbInfo)
      await checkUIImage(scene, iwbInfo)
      await checkTriggerComponent(scene, iwbInfo)
      await checkBillboardComponent(scene, iwbInfo)
      
      // await checkSmartItemComponent()


      if(playerMode === SCENE_MODES.BUILD_MODE){
          resetEntityForBuildMode(scene, iwbInfo)
      }

      let fn = afterLoadActions.pop()
      if (fn) fn(scene.id, iwbInfo.entity)
  }

  iwbInfo.listen("buildVis", (c:any, p:any)=>{
          if(p !== undefined){
              let entityInfo = getEntity(scene, aid)
              if(entityInfo && playerMode === SCENE_MODES.BUILD_MODE){
                updateAssetBuildVisibility(scene, c, entityInfo)
              }
          }
      })
  })

  scene[COMPONENT_TYPES.IWB_COMPONENT].onRemove((iwbInfo:any, aid:string)=>{
    console.log('removing iwb info', aid, iwbInfo)
    removeItem(iwbInfo.entity)
  })
}