import { Billboard, BillboardMode, ColliderLayer, engine, Entity, GltfContainer, Transform } from "@dcl/sdk/ecs"
import { Quaternion, Vector3 } from "@dcl/sdk/math"
import { sendServerMessage } from "../iwb/components/Colyseus"
import { SERVER_MESSAGE_TYPES } from "../iwb/helpers/types"
import { addLocalTrigger, warehouseItems, warehouseTriggerCount, warehouseTriggers } from "../iwb/warehouse/Warehouse"
import { getWorldPosition } from "@dcl-sdk/utils"
import { utils } from "../iwb/helpers/libraries"
import { items } from "../iwb/components/Catalog"

export interface SelectedItem {
  modifier: EDIT_MODIFIERS
  factor: number
  entity:Entity
  enabled:boolean
  index:number
  label:string
  id:string
  style:string
  category?:boolean
  trigger?:boolean
}

export enum EDIT_MODES {
  GRAB,
  EDIT
}

export enum EDIT_MODIFIERS {
  POSITION,
  ROTATION,
  SCALE
}

export let selectedItem:SelectedItem
export let builderHUDEntities:any[] = []
export let categoryTriggers:any[] = [{label:"Select Triggers", id:0, entity:-1}]
export let warehouseCategories:any[] = [{label:"Warehouse Categories", id:0, entity:-1}]
export let warehouseIndex = 0

export let selectionPointer:Entity = engine.addEntity()

export function addBuilderHUDAsset(entity:Entity, label:string, id:string, style:string, placed:boolean){
  if(Transform.has(entity) && !builderHUDEntities.find((e) => e.entity === entity)){
    builderHUDEntities.push({entity:entity, label:label, id:id, style:style, placed:placed})
    // console.log('added object to builder hud', builderHUDEntities)
  }
}

export function addPlacedAsset(entity:Entity, label:string, id:string, style:string){
  if(Transform.has(entity) && !builderHUDEntities.find((e) => e.entity === entity)){
    let e = builderHUDEntities.find((e) => e.entity === entity)
    e.placed = true
  }
}

export function addBuilderHUDAssetCategory(entity:Entity, label:string){
  if(Transform.has(entity) && !warehouseCategories.find((e) => e.entity === entity)){
    warehouseCategories.push({entity:entity, label:label})
  }
}

export function selectTrigger(index:number){
  if(index > 0){
    let triggerItems = [...warehouseTriggers.values()].filter((item:any)=> item.sty === warehouseCategories[warehouseIndex].label)

    console.log('trigger items are', triggerItems)
    
    let trigger = triggerItems[index-1]
    console.log('selected trigger is', trigger)
    if(trigger){
    selectedItem = {
      modifier:EDIT_MODIFIERS.POSITION,
      factor:1,
      entity:trigger.entity,
      enabled:true,
      index:index,
      label:trigger.label,
      id: trigger.id,
      style: trigger.sty,
      trigger:true
    }
  }
    }
}

export function selectAsset(index:number){
  if(index > 0){
    selectedItem = {
      modifier:EDIT_MODIFIERS.POSITION,
      factor:1,
      entity: builderHUDEntities[index].entity,
      enabled:true,
      index:index,
      label:builderHUDEntities[index].label,
      id: builderHUDEntities[index].id,
      style: builderHUDEntities[index].style,
    }

    GltfContainer.createOrReplace(selectionPointer, {
      src: "assets/40e64954-b84f-40e1-ac58-438a39441c3e.glb"
    })

  Billboard.createOrReplace(selectionPointer, {billboardMode: BillboardMode.BM_Y})

  Transform.createOrReplace(selectionPointer, {
      position: Vector3.create(0, Transform.get(builderHUDEntities[index].entity).position.y + 1, 0),
      parent: selectedItem.entity
  })
  }else{
    selectedItem.enabled = false
  }
}

export function selectPlacedAsset(index:number){
  if(index > 0){
    let items:any[] = [{label:"Select Placed Entity", id:0, entity:-1, placed:true}]
      let categoryItems = [...warehouseItems.values()].filter((item:any)=> item.sty === warehouseCategories[warehouseIndex].label && item.placed)
      .map(item => {
        return{
          entity: item.entity,
          label: item.n,
          style: item.sty,
          id: item.id,
          placed: item.placed
        }
      })
  
      categoryItems.forEach((item)=>{
          items.push(item)
      })

    let it = items.find((e) => e.label === items[index].label)
    console.log('selected placed asset is', it)

    // selectedItem = it

    selectedItem = {
      modifier:EDIT_MODIFIERS.POSITION,
      factor:1,
      entity:it.entity,
      enabled:true,
      index:index,
      label:it.label,
      id: it.id,
      style: it.style,
    }

    GltfContainer.createOrReplace(selectionPointer, {
      src: "assets/40e64954-b84f-40e1-ac58-438a39441c3e.glb"
    })

  Billboard.createOrReplace(selectionPointer, {billboardMode: BillboardMode.BM_Y})

  Transform.createOrReplace(selectionPointer, {
      position: Vector3.create(0, Transform.get(builderHUDEntities[index].entity).position.y + 1, 0),
      parent: selectedItem.entity
  })
  }else{
  }
}

export function selectWarehouseCategory(index:number){
  if(index > 0){
    warehouseIndex = index
    let categoryItems = [...warehouseItems.values()].filter((item:any)=> item.sty === warehouseCategories[index].label)
    
    builderHUDEntities = categoryItems.map(item => {
      return{
        entity: item.entity,
        label: item.n,
        style: item.sty,
        id: item.id,
        placed: item.placed
      }
    })

    let triggerItems = [...warehouseTriggers.values()].filter((item:any)=> item.sty === warehouseCategories[index].label)
    
    console.log("triggers are ", [...warehouseTriggers.values()])
    categoryTriggers = triggerItems.map(item => {
      return{
        entity: item.entity,
        label: item.label,
        style: warehouseCategories[index].label,
        id: item.id,
        trigger:true
      }
    })
    categoryTriggers.unshift({label:"Select Trigger",style:warehouseCategories[index].label, trigger:true, id:0, entity:-1, placed:false})

    console.log('category triggers are ', categoryTriggers)

    selectedItem = {
      modifier:EDIT_MODIFIERS.POSITION,
      factor:1,
      entity: warehouseCategories[index].entity,
      enabled:true,
      index:index,
      label:warehouseCategories[index].label,
      id: warehouseCategories[index].label,
      style: warehouseCategories[index].label,
      category:true
    }
    builderHUDEntities.unshift({label:"Select Entity", id:0, entity:-1, placed:false})
  }
}

export function createBuilderHud(admins?:string[]){
}

export function transformObject(axis:string, direction:number){
  if(selectedItem.enabled){
    let transform = Transform.getMutable(selectedItem.entity)

    switch(selectedItem.modifier){
        case EDIT_MODIFIERS.POSITION:
            let pos:any = transform.position
            pos[axis] = pos[axis] + (direction * selectedItem.factor)
            break;
  
        case EDIT_MODIFIERS.ROTATION:
            let rot:any = Quaternion.toEulerAngles(transform.rotation)
            rot[axis] = rot[axis] + (direction * selectedItem.factor)
            transform.rotation = Quaternion.fromEulerDegrees(rot.x ,rot.y, rot.z)
            break;
  
        case EDIT_MODIFIERS.SCALE:
            let scale:any = transform.scale
            scale[axis] =  scale[axis] + (direction * selectedItem.factor)
            break;
    }

    if(selectedItem.trigger){
      console.log('need to adjust trigger area')
      utils.triggers.setAreas(selectedItem.entity, [{type:'box', scale:transform.scale}])
    }

    sendServerMessage(SERVER_MESSAGE_TYPES.WAREHOUSE_ITEM_TRANSFORM,
      {
          id:selectedItem.id,
          modifier: selectedItem.modifier,
          factor: selectedItem.factor,
          axis: axis,
          direction: direction,
          style:selectedItem.style,
          category:selectedItem.category,
          trigger:selectedItem.trigger
      }
  )
  }
}

export function saveWarehousePositions(){
  if(selectedItem.category){}
  else{
    let e = builderHUDEntities[selectedItem.index]
    e.placed = true
    // builderHUDEntities.splice(selectedItem.index,1)//

    let item = warehouseItems.get(selectedItem.id)
    if(item){
      item.placed = true

      if(item.ty === "3D"){
        let gltf = GltfContainer.getMutable(selectedItem.entity)
        gltf.invisibleMeshesCollisionMask = ColliderLayer.CL_PHYSICS
        gltf.visibleMeshesCollisionMask = ColliderLayer.CL_POINTER
      }
    }
  }
  sendServerMessage(SERVER_MESSAGE_TYPES.SAVE_WAREHOUSE, {category: selectedItem.category, style:selectedItem.style, id:selectedItem.id, trigger:selectedItem.trigger})
}

export function loadGLB(atPlayer?:boolean){
  console.log('loading asset ', selectedItem.id)  
  let category = warehouseItems.get(selectedItem.style)

  if(atPlayer){
    let playerPosition = getWorldPosition(engine.PlayerEntity)
    Transform.createOrReplace(selectedItem.entity, {parent:category.parent, position: Vector3.subtract(playerPosition, category.p)})

    sendServerMessage(SERVER_MESSAGE_TYPES.WAREHOUSE_ITEM_TRANSFORM,
      {
          id:selectedItem.id,
          modifier: EDIT_MODIFIERS.POSITION,
          factor: selectedItem.factor,
          axis: 'ALL',
          x:parseFloat(Vector3.subtract(playerPosition, category.p).x.toFixed(2)),
          y:parseFloat(Vector3.subtract(playerPosition, category.p).y.toFixed(2)),
          z:parseFloat(Vector3.subtract(playerPosition, category.p).z.toFixed(2)),
          style:selectedItem.style,
          category:selectedItem.category,
          trigger:selectedItem.trigger
      }
  )
  }
  else{
    Transform.createOrReplace(category.parent, {position: category.parent, rotation: Quaternion.fromEulerDegrees(category.r.x, category.r.y, category.r.z), scale: category.s})
  }
  GltfContainer.createOrReplace(selectedItem.entity, {src: "assets/" + selectedItem.id + ".glb", visibleMeshesCollisionMask:ColliderLayer.CL_NONE, invisibleMeshesCollisionMask:ColliderLayer.CL_NONE})  
}

export function toggleModifier(){
  switch(selectedItem.modifier){
      case EDIT_MODIFIERS.POSITION:
          case EDIT_MODIFIERS.SCALE:
              if(selectedItem.factor === 1){
                  selectedItem.factor = 0.1
              }else if(selectedItem.factor === 0.1){
                  selectedItem.factor = 0.01
              }else if(selectedItem.factor === 0.01){
                  selectedItem.factor = 0.001
              }
              else if(selectedItem.factor === 0.001){
                  selectedItem.factor = 1
              }
          break;


      case EDIT_MODIFIERS.ROTATION:
          if(selectedItem.factor === 90){
              selectedItem.factor = 45
          }else if(selectedItem.factor === 45){
              selectedItem.factor = 15//
          }else if(selectedItem.factor === 15){
              selectedItem.factor = 5
          }else if(selectedItem.factor === 5){
              selectedItem.factor = 1
          }
          else if(selectedItem.factor === 1){
              selectedItem.factor = 90
          }
          break;
  }
}

export function toggleEditModifier(modifier?:EDIT_MODIFIERS){
  if(modifier){
      selectedItem.modifier = modifier
  }else{
      if(selectedItem.modifier === EDIT_MODIFIERS.POSITION){
          selectedItem.modifier = EDIT_MODIFIERS.ROTATION
          selectedItem.factor = 90
      }
      else if(selectedItem.modifier === EDIT_MODIFIERS.ROTATION){
          selectedItem.modifier = EDIT_MODIFIERS.SCALE
          selectedItem.factor = 1
      }
      else if(selectedItem.modifier === EDIT_MODIFIERS.SCALE){
          selectedItem.modifier = EDIT_MODIFIERS.POSITION
          selectedItem.factor = 1
      }
  }
}

export function getPlacedItems(){
  let items:any[] = [{label:"Select Placed Entity", id:0, entity:-1, placed:true}]
  if(warehouseIndex > 0){
    let categoryItems = [...warehouseItems.values()].filter((item:any)=> item.sty === warehouseCategories[warehouseIndex].label && item.placed)
    .map(item => {
      return{
        entity: item.entity,
        label: item.n,
        style: item.sty,
        id: item.id,
        placed: item.placed
      }
    })

    categoryItems.forEach((item)=>{
      // if(item.placed){
        items.push(item)
      // }
    })
  }
  return items.map(i => i.label)
}

export function getBuilderEntities(){
  let items:any[] = []
  if(warehouseIndex > 0){
    let categoryItems = [...warehouseItems.values()].filter((item:any)=> item.sty === warehouseCategories[warehouseIndex].label)
    categoryItems.forEach((item)=>{
      items.push(item)
    })
  }
  // console.log('placed items', items)
  return items.map((it:any) => it.label)
}

export function addTrigger(){
  let count = 1
  let triggerCount = warehouseTriggerCount.get(warehouseCategories[warehouseIndex].label)
  if(triggerCount){
    count += triggerCount
  }
  sendServerMessage(SERVER_MESSAGE_TYPES.WAREHOUSE_ADD_TRIGGER, {style:warehouseCategories[warehouseIndex].label, count:count })

  let category = warehouseItems.get(warehouseCategories[warehouseIndex].label)
  if(!category){
    return
  }
  addLocalTrigger(category, count,
    {
    "id": count,
    "p": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "s": {
      "x": 1,
      "y": 1,
      "z": 1
    }
  }, category.parent)
}