// import { IWBCatalogComponent, IWBComponent } from "./Components"

import { engine } from "@dcl/sdk/ecs"
import { RealmEntityComponent } from "../helpers/Components"
import { COMPONENT_TYPES, SCENE_MODES } from "../helpers/types"
import { addBuildModePointers, confirmGrabItem, removeItem, resetEntityForBuildMode } from "../modes/Build"
import { checkBillboardComponent } from "./Billboard"
import { playerMode } from "./Config"
import { checkCounterComponent } from "./Counter"
import { checkGLTFComponent } from "./Gltf"
import { checkMaterialComponent } from "./Materials"
import { checkMeshRenderComponent, checkMeshColliderComponent } from "./Meshes"
import { checkNftShapeComponent } from "./NftShape"
import { checkPointerComponent } from "./Pointers"
import { afterLoadActions } from "./Scene"
import { checkAudioComponent, checkAudioSourceComponent, checkAudioStreamComponent } from "./Sounds"
import { checkTextShapeComponent } from "./TextShape"
import { checkTextureComponent } from "./Textures"
import { checkTransformComponent } from "./Transform"
import { checkTriggerComponent } from "./Triggers"
import { checkUIImage } from "./UIImage"
import { checkUIText } from "./UIText"
import { checkVideoComponent } from "./Videos"
import { updateAssetBuildVisibility } from "./Visibility"
import { colyseusRoom } from "./Colyseus"
import { localUserId } from "./Player"
import { disableGameAsset } from "./Game"
import { checkAvatarShape } from "./AvatarShape"
import { checkPathComponent } from "./Path"
import { checkQuestComponent } from "./Quests"
import { checkVirtualCameraComponent } from "./VirtualCamera"
import { checkRaycastComponent } from "./Raycast"
import { removePendingBody } from "./Physics"

export function getEntity(scene:any, aid:string){
  return scene[COMPONENT_TYPES.IWB_COMPONENT].get(aid)
}

export function createEntity(item:any){
  let ent = engine.addEntity()
  item.entity = ent

  // console.log('creating entity', ent)
  RealmEntityComponent.create(ent)

  if (playerMode === SCENE_MODES.BUILD_MODE) {
      addBuildModePointers(ent)
  }
}

export async function iwbInfoListener(scene:any){
  scene[COMPONENT_TYPES.IWB_COMPONENT].onAdd(async (iwbInfo:any, aid:any)=>{
    // console.log('iwb component added', aid, iwbInfo)
    if(aid){
      
      iwbInfo.aid = aid
      if(!["0","1","2"].includes(aid)){
          await createEntity(iwbInfo)//
      }

      // if(isLevelAsset(scene, aid) || isGameAsset(scene, aid)){}
      // else{
        createAsset(scene, iwbInfo)
      // }
    }

    iwbInfo.listen("buildVis", (c:any, p:any)=>{
            let entityInfo = getEntity(scene, aid)
            if(entityInfo && playerMode === SCENE_MODES.BUILD_MODE){
              updateAssetBuildVisibility(scene, c, entityInfo)
            }
        })
    })

  scene[COMPONENT_TYPES.IWB_COMPONENT].onRemove((iwbInfo:any, aid:string)=>{
    console.log('removing iwb info', aid, iwbInfo)

    let selected = false
    colyseusRoom.state.players.forEach(async (player:any, address:string)=>{
      if(player.selectedAsset && player.selectedAsset.assetId === aid && player.address === localUserId && !selected){
        selected = true
          await confirmGrabItem(scene, iwbInfo.entity, player.selectedAsset)
      }
    })

    let physicsInfo = scene[COMPONENT_TYPES.PHYSICS_COMPONENT].get(aid)
    if(physicsInfo && physicsInfo.type === 1){
      removePendingBody(aid)
    }
    
    removeItem(iwbInfo.entity)
  })
}

export async function createAsset(scene:any, iwbInfo:any, isLevelAsset?:boolean){
  // PointersLoadedComponent.createOrReplace(iwbInfo.entity, {init: false, sceneId: scene.id})

  await checkTransformComponent(scene, iwbInfo)  
  await checkGLTFComponent(scene, iwbInfo,isLevelAsset)
  await checkVideoComponent(scene, iwbInfo)
  await checkTextureComponent(scene, iwbInfo)
  await checkPointerComponent(scene, iwbInfo)
  await checkMeshRenderComponent(scene, iwbInfo)
  await checkMeshColliderComponent(scene, iwbInfo)
  await checkMaterialComponent(scene, iwbInfo)
  // await checkAudioSourceComponent(scene, iwbInfo)
  // await checkAudioStreamComponent(scene, iwbInfo)
  await checkAudioComponent(scene, iwbInfo)
  await checkTextShapeComponent(scene, iwbInfo)
  await checkNftShapeComponent(scene, iwbInfo)
  await checkCounterComponent(scene, iwbInfo)
  await checkUIText(scene, iwbInfo)
  await checkUIImage(scene, iwbInfo)
  await checkTriggerComponent(scene, iwbInfo)
  await checkBillboardComponent(scene, iwbInfo)
  await checkAvatarShape(scene, iwbInfo)
  await checkPathComponent(scene, iwbInfo)
  await checkQuestComponent(scene, iwbInfo)
  await checkVirtualCameraComponent(scene, iwbInfo)
  await checkRaycastComponent(scene, iwbInfo)
  await disableGameAsset(scene, iwbInfo)

  if(playerMode === SCENE_MODES.BUILD_MODE){
      resetEntityForBuildMode(scene, iwbInfo)
  } 

  let fn = afterLoadActions.pop()
  if (fn) fn(scene.id, iwbInfo.entity)
}