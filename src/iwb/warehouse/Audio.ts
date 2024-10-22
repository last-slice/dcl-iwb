import { EasingFunction, engine, Entity, InputAction, Material, MeshCollider, MeshRenderer, PointerEvents, pointerEventsSystem, PointerEventType, Schemas, TextShape, Transform, Tween, VisibilityComponent } from "@dcl/sdk/ecs";
import { items, marketplaceItems, marketplaceOriginal } from "../components/Catalog";
import { SceneItem } from "../helpers/types";
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math";
import resources from "../helpers/resources";
import { setWarehouseClickFn, setWarehouseHoverExitFn, setWarehouseHoverFn } from "./Warehouse";
import { utils } from "../helpers/libraries";
import { KeepRotatingComponent } from "../components/Actions";
import { paginateArray } from "../helpers/functions";

export const WarehouseAudioComponent = engine.defineComponent(resources.slug + "warehouse::component::audio", {
    fixed:Schemas.Vector3,
    start:Schemas.Vector3,
    end:Schemas.Vector3
})

export let audioParent:Entity
export let audioEntities:any[] = []
export let audioItems:any[] = []
export let audioIndex:number = 1

let rows:number = 4
let columns:number = 12
let xOffset:number = 2
let yOffset:number = 0
let yTop = 10

let grid:any = []

export function createAudioRoom(){
    audioParent = engine.addEntity()
    Transform.create(audioParent)

    let click = engine.addEntity()
    MeshCollider.setBox(click)
    MeshRenderer.setBox(click)
    Transform.create(click, {position: Vector3.create(15,1,-10), parent: audioParent})
    pointerEventsSystem.onPointerDown({entity:click,
        opts:{
            button:InputAction.IA_POINTER, hoverText:'animate', showFeedback:true, maxDistance:100
        }
    },()=>{
        animateGrid()
    })

    for(let row = 0; row < rows; row++){
        for(let col = 0; col < columns; col++){
            let plane = engine.addEntity()
            let text = engine.addEntity()

            Transform.create(plane, {parent:audioParent, position: Vector3.create(0 + xOffset, yTop + yOffset, 0),scale: Vector3.create(2,2,1)})
            Transform.create(text, {parent:plane, position:Vector3.create(0,0,-.1),scale: Vector3.create(0.5,0.5,0.5)})

            MeshRenderer.setPlane(plane)
            MeshCollider.setPlane(plane)

            Material.setPbrMaterial(plane, {albedoColor:Color4.Red()})

            TextShape.create(text, {text:"Text", fontSize:3, textWrapping:true})

            VisibilityComponent.create(text, {visible:false})
            VisibilityComponent.create(plane, {visible:false})

            KeepRotatingComponent.create(plane)
            WarehouseAudioComponent.create(text)
            WarehouseAudioComponent.create(plane, {
                fixed:Vector3.create(0 + xOffset, rows - yOffset, 0)
            })

            PointerEvents.create(plane, {
                pointerEvents:[
                    {
                        eventType: PointerEventType.PET_HOVER_ENTER,
                        eventInfo: {
                            showFeedback: true
                        }
                    },
                    {
                        eventType: PointerEventType.PET_HOVER_LEAVE,
                        eventInfo: {
                            showFeedback: true
                        }
                    },
                    {
                        eventType: PointerEventType.PET_DOWN,
                        eventInfo: {
                            button: InputAction.IA_POINTER,
                            hoverText: "Play",
                            showFeedback: true,
                            maxDistance:100
                        }
                    },
                ]
            })

            audioEntities.push({plane:plane, text:text})
            // grid[row].push(plane)
            grid.push(plane)
            xOffset += 2.5
        }
        xOffset = 2
        yOffset -= 2.5
    }
    enableAudioRoom()
}

export function enableAudioRoom(){
    audioItems.length = 0
    audioIndex = 1
    audioItems = paginateArray([...items.values()].filter((it:any)=> !it.ugc).filter($=> $.tag.includes("Audio")).sort((a, b) => a.n.localeCompare(b.n)), audioIndex, rows * columns)
    console.log('audio items are ', audioItems)

    // for(let i = 0; i < audioItems.length; i++){
    //     let entities = audioEntities[i]
    //     TextShape.getMutable(entities.text).text = "" + audioItems[i].n
    // }

    //     for (const [entity] of engine.getEntitiesWith(VisibilityComponent, WarehouseAudioComponent)) {
    //     VisibilityComponent.getMutable(entity).visible = true
    // }//

    updateTiles()


    setWarehouseHoverFn((data:any)=>{
        console.log('audio hover function', data)
        if(data.hit && data.hit.entityId){
            let entity = data.hit.entityId as Entity
            Tween.createOrReplace(entity, {
                mode: Tween.Mode.Scale({
                  start: Vector3.create(2, 2, 2),
                  end: Vector3.create(2.4, 2.4, 2.4),
                }),
                duration: 100,
                easingFunction: EasingFunction.EF_EASEBOUNCE,
              })
        }
    })

    setWarehouseHoverExitFn((data:any)=>{
        console.log('audio hover exit function', data)
        if(data.hit && data.hit.entityId){
            let entity = data.hit.entityId as Entity
            Tween.createOrReplace(entity, {
                mode: Tween.Mode.Scale({
                  start: Vector3.create(2.4, 2.4, 2.4),
                  end: Vector3.create(2, 2, 2),
                }),
                duration: 100,
                easingFunction: EasingFunction.EF_EASEBOUNCE,
              })
        }
    })

    setWarehouseClickFn((data:any)=>{
        console.log('audio click function', data)
        if(data.hit && data.hit.entityId && WarehouseAudioComponent.has(data.hit.entityId as Entity)){
            let entity = data.hit.entityId as Entity
            PointerEvents.deleteFrom(entity)
            // animatePlane(entity)
        }
    })
}

export function disableAudioRoom(){
    for (const [entity] of engine.getEntitiesWith(VisibilityComponent, WarehouseAudioComponent)) {
        VisibilityComponent.getMutable(entity).visible = false
    }
}

export function animateGrid(){
    grid.forEach((plane:Entity)=>{
        PointerEvents.deleteFrom(plane)
        animatePlane(plane, 1)
    })

    utils.timers.setTimeout(()=>{
        audioIndex += 1
        audioItems = paginateArray([...items.values()].filter((it:any)=> !it.ugc).filter($=> $.tag.includes("Audio")).sort((a, b) => a.n.localeCompare(b.n)), audioIndex, rows * columns)
        updateTiles()
    },800)
}


// let time = 0
// let count = (rows * columns) - 1
// let type = 1
// export function AnimateSystem(dt:number){
//     if(time > 0){
//         time -= dt
//     }else{
//         time = 0.1
//         if(type === 1){
//             if(count < (rows * columns)){
//                 animatePlane(grid[count], type)
//                 count++
//             }else{
//                 count = 0
//                 time = 0
//                 type = 0
//                 console.log('got here, now need to wait')
//             }
//         }else{
//             if(count < (rows * columns)){
//                 animatePlane(grid[count], type)
//                 count++
//             }else{
//                 engine.removeSystem(AnimateSystem)
//                 count = 0
//                 time = 0
//                 type = 1
//             }
//         }
//     }
// }//

export function animatePlane(entity:Entity, type:number){
    Tween.createOrReplace(entity, {
        mode: Tween.Mode.Rotate({
          start: Quaternion.fromEulerDegrees(0, 0, 0),
          end: Quaternion.fromEulerDegrees(0, 180, 0),
        }),
        duration: 700,
        easingFunction: EasingFunction.EF_LINEAR,
      })

    utils.timers.setTimeout(()=>{
        Tween.createOrReplace(entity, {
            mode: Tween.Mode.Rotate({
              start: Quaternion.fromEulerDegrees(0,180, 0),
              end: Quaternion.fromEulerDegrees(0, 0, 0),
            }),
            duration: 700,
            easingFunction: EasingFunction.EF_LINEAR,
          })
    }, 800)
}

function updateTiles(){
    console.log('audio items', audioItems)
    for(let i in audioEntities){
        VisibilityComponent.getMutable(audioEntities[i].plane).visible = false
        VisibilityComponent.getMutable(audioEntities[i].text).visible = false
    }

    for(let i in audioItems){
        VisibilityComponent.getMutable(audioEntities[i].plane).visible = true
        VisibilityComponent.getMutable(audioEntities[i].text).visible = true
        TextShape.getMutable(audioEntities[i].text).text = "" + audioItems[i].n
    }
}