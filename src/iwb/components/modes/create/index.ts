import { GltfContainer, Material, MeshRenderer, Transform, engine } from "@dcl/sdk/ecs"
import { localUserId, players, setPlayMode } from "../../player/player"
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math"
import { log } from "../../../helpers/functions"
import { SCENE_MODES } from "../../../helpers/types"
import { displayCreateScenePanel } from "../../../ui/Panels/CreateScenePanel"
import { scenes } from "../../scenes"

export let scenesToCreate:Map<string, any> = new Map()
let greenBeam = "assets/53726fe8-1d24-4fd8-8cee-0ac10fcd8644.glb"
let redBeam = "assets/d8b8c385-8044-4bef-abcb-0530b2ebd6c7.glb"

export function selectParcel(info:any){
    let scene = scenesToCreate.get(info.player)
    if(scene){
      /**
       * TODO
       * check if selected parcel is adjacent to at least 1 other parcel in the scene
       * check which direction the selected parcel is and update the size accordingly (1x1, 2x1, etc)
       * 
       */
      if(!scene.parcels.find((p:string)=> p === info.parcel)){
        scene.parcels.push({parcel:info.parcel, entities:[]})
        addSelectedBoundaries(info)
      }
    }
    else{
      let data:any = {
        parcels:[{parcel:info.parcel, entities:[]}],
        name:"test",
        size:[1,1],
      }
      scenesToCreate.set(info.player, data)
      addSelectedBoundaries(info)
    }
  }
  
  function addSelectedBoundaries(info:any){
    let scene = scenesToCreate.get(info.player)
    let parcel = scene.parcels.find((p:any)=> p.parcel === info.parcel)
    let entities:any[] = []
  
    let local = true
    if(info.player !== localUserId){
      local = false
    }
  
    let left = engine.addEntity()
    let right = engine.addEntity()
    let front = engine.addEntity()
    let back = engine.addEntity()
  
    let leftFloor = engine.addEntity()
    let rightFloor = engine.addEntity()
    let frontFloor = engine.addEntity()
    let backFloor = engine.addEntity()
  
    let floor = engine.addEntity()
  
    entities.push(left)
    entities.push(leftFloor)
    entities.push(right)
    entities.push(rightFloor)
    entities.push(front)
    entities.push(frontFloor)
    entities.push(back)
    entities.push(backFloor)
    entities.push(floor)

    parcel.entities = entities
  
    let [x1,y1] = info.parcel.split(",")
    let x = parseInt(x1)
    let y = parseInt(y1)
    let centerx = (x * 16) + 8
    let centery = (y * 16) + 8
  
    Transform.create(floor, {position: Vector3.create(centerx, 0, centery), rotation:Quaternion.fromEulerDegrees(90,0,0), scale: Vector3.create(16,16,1)})
    MeshRenderer.setPlane(floor)
    Material.setPbrMaterial(floor, {
      albedoColor: local ? Color4.Green() : Color4.Red()
    })
  
    //left
    Transform.create(left, {position: Vector3.create(x * 16, 0, y * 16), rotation:Quaternion.fromEulerDegrees(0,0,0), scale: Vector3.create(1,20,1)})
    GltfContainer.create(left, {src:local ? greenBeam : redBeam})
    Transform.create(leftFloor, {position: Vector3.create(x * 16, 0, y * 16), rotation:Quaternion.fromEulerDegrees(90,0,0), scale: Vector3.create(1,9,1)})
    GltfContainer.create(leftFloor, {src:local ? greenBeam : redBeam})
  
    //right
    Transform.create(right, {position: Vector3.create(x * 16 + 16, 0, y * 16), rotation:Quaternion.fromEulerDegrees(0,0,0), scale: Vector3.create(1,20,1)})
    GltfContainer.create(right, {src:local ? greenBeam : redBeam})
    Transform.create(rightFloor, {position: Vector3.create(x * 16 + 16, 0, y * 16), rotation:Quaternion.fromEulerDegrees(90,0,0), scale: Vector3.create(1,9,1)})
    GltfContainer.create(rightFloor, {src:local ? greenBeam : redBeam})
  
    // front
    Transform.create(front, {position: Vector3.create(x * 16, 0, y * 16 + 16), rotation:Quaternion.fromEulerDegrees(0,0,0), scale: Vector3.create(1,20,1)})
    GltfContainer.create(front, {src:local ? greenBeam : redBeam})
    Transform.create(frontFloor, {position: Vector3.create(x * 16, 0, y * 16 + 16), rotation:Quaternion.fromEulerDegrees(90,90,0), scale: Vector3.create(1,9,1)})
    GltfContainer.create(frontFloor, {src:local ? greenBeam : redBeam})
  
    // back
    Transform.create(back, {position: Vector3.create(x * 16 + 16, 0, y * 16 + 16), rotation:Quaternion.fromEulerDegrees(0,0,0), scale: Vector3.create(1,20,1)})
    GltfContainer.create(back, {src:local ? greenBeam : redBeam})
    Transform.create(backFloor, {position: Vector3.create(x * 16, 0, y * 16), rotation:Quaternion.fromEulerDegrees(90,90,0), scale: Vector3.create(1,9,1)})
    GltfContainer.create(backFloor, {src:local ? greenBeam : redBeam})
  }

  export function deleteParcelEntities(info:any){
    let scene = scenesToCreate.get(info.player)
    if(scene){
      let parcel = scene.parcels.find((p:any)=> p.parcel === info.parcel)
      if(parcel){
        parcel.entities.forEach((entity:any) => {
          engine.removeEntity(entity)
        });
        let index = scene.parcels.findIndex((p:any)=> p.parcel === info.parcel)
        scene.parcels.splice(index,1)
      }
    }
  }
  
  export function deleteCreationEntities(player:string){
    let scene = scenesToCreate.get(player)
    if(scene){
      scene.parcels.forEach((parcel:any)=>{
        deleteParcelEntities({player:player, parcel:parcel})
      })
      scenesToCreate.delete(player)
    }
  }

export function saveNewScene(){
  displayCreateScenePanel(false)

  let player = players.get(localUserId)
  let scenes = scenesToCreate.get(localUserId)
  scenes.parcels.forEach((parcel:any)=>{
    player.buildingAllowed.push(parcel)
  })

  player.scenes.push(scenesToCreate.get(localUserId))

  //need to delete scene from scenestoCreate()...either here or round trip server side and back to scene

  setPlayMode(localUserId, SCENE_MODES.PLAYMODE)//
}
