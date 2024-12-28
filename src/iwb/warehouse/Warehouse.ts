import { Animator, AvatarAnchorPointType, AvatarAttach, ColliderLayer, engine, Entity, GltfContainer, InputAction, MeshRenderer, pointerEventsSystem, Transform, VisibilityComponent } from "@dcl/sdk/ecs";
import { createAudioRoom } from "./Audio";
import { utils } from "../helpers/libraries";
import { Quaternion, Vector2, Vector3 } from "@dcl/sdk/math";
import { addBuilderHUDAsset, addBuilderHUDAssetCategory, addPlacedAsset, builderHUDEntities, categoryTriggers, updateCategoryTriggers } from "../../dcl-builder-hud";
import { localPlayer, localUserId } from "../components/Player";
import { enableBuilderHUD } from "../../dcl-builder-hud/ui/builderpanel";
import { LAYER_1, NO_LAYERS } from "@dcl-sdk/utils";
import { items } from "../components/Catalog";
import { Actions, COMPONENT_TYPES, SceneItem, Triggers } from "../helpers/types";
import { globalEmitter } from "../modes/Play";
import { colyseusRoom } from "../components/Colyseus";
import { showWarehouseUI } from "../ui/Objects/WarehouseUI";

export let admins:any[]= [
    "0x3edfae1ce7aeb54ed6e171c4b13e343ba81669b6",
    "0x87b895f37a93e76cf1c27ed68b38d77fee0f7867",
    "0x56d947fa1ae6d6293b307b489540c156af628f0f",
    "0x6d873a14a470dd969d7c76a2e088169ab2a1d7ae",
    "0x54e93609eb454a1f152edefdf022480794ce2130",
    "0xa23aA5fcE659a828Ab52d62a708E29e3347B9Eb7"
]

export let warehouseScene:string = "MzCw-"
export let warehouseLocation:string = "Lobby"
export let warehouseLocationType:string = " AlphaProta Yellow"

export let inWarehouse = false
export let warehouseHoverFn:any
export let warehouseHoverExitFn:any
export let warehouseClickFn:any

export let warehouseItems:Map<string, any> = new Map()
export let warehouseTriggers:Map<string, any> = new Map()
export let warehouseTriggerCount:any = {}
export let enteredArea:string = "Lobby"
export let previousArea:any
export let selectedWarehouseItem:SceneItem
export let warehouseHUDParent:Entity

export let warehouseAnimations:any[] = []
export let warehouseAnimationIndex = 0


export let pendingWarehouseAssets:any[] = []
export function updateUnplacedWarehouseItems(assets:any[]){
    pendingWarehouseAssets = assets
}

export function processPendingWarehouseAssets(){
    console.log('procesing pending warehosue assets')
    // createWarehouseHUD()
    createListeners()

    pendingWarehouseAssets.forEach((category:any)=>{
        let parent = engine.addEntity()
        Transform.create(parent, {position: category.p, rotation: Quaternion.fromEulerDegrees(category.r.x, category.r.y, category.r.z), scale: category.s})
        addBuilderHUDAssetCategory(parent, category.style)

        if(category.triggers){
            let count = 0
            category.triggers.forEach((config:any, index:number)=>{
                warehouseTriggerCount[category.style] = count
                count++
                addLocalTrigger(category, index, config, parent)
            })
        }

        if(admins.includes(localUserId)){
            enableBuilderHUD(true)
            let indicator = engine.addEntity()//
            MeshRenderer.setPlane(indicator)
            Transform.create(indicator, {parent: parent, rotation: Quaternion.fromEulerDegrees(90,0,0), scale: Vector3.create(1,1,1)})
        }

        category.items.forEach((item:any)=>{
            let ent = engine.addEntity()
            Transform.createOrReplace(ent, {parent:parent, position: item.p, rotation: Quaternion.fromEulerDegrees(item.r.x, item.r.y, item.r.z), scale: item.s})
            item.placed = item.hasOwnProperty("placed") ? item.placed : false
            warehouseItems.set(item.id, {...item, entity:ent, parent:parent})
            addBuilderHUDAsset(ent, item.n, item.id, category.style, item.placed)

            if(item.placed){
                console.log('need to load glb if necessary')
                let warehouseItem = items.get(item.id)
                if(!warehouseItem){
                    console.log('that item doesnt exist in catalog', item.id)
                    return
                }

                switch(item.ty){
                    case '3D':
                        GltfContainer.create(ent, {src: "assets/" + item.id + ".glb"})
                        if(warehouseItem.anim && warehouseItem.anim.length > 0){
                            let animations:any[] = []
                            warehouseItem.anim.forEach((animation:any, index:number)=>{
                                animations.push({clip:animation.name, playing:index === 0 ? true : false, loop: index === 0 ? true : false})
                            })

                            Animator.create(ent, {
                                states:animations
                            })
                          }
                        break
                }

                pointerEventsSystem.onPointerDown({entity:ent, opts:{
                    button:InputAction.IA_POINTER, maxDistance:10, hoverText:"" + item.n + " Info",
                }}, ()=>{
                    warehouseAnimations = []
                    warehouseAnimationIndex = 0

                    selectedWarehouseItem = warehouseItem
                    selectedWarehouseItem.entity = ent

                    console.log('selected item is', item)
                    if(!warehouseItem){
                      return
                    }
                  
                    if(warehouseItem.anim && warehouseItem.anim.length > 0){
                      console.log('asset has animations')
                      warehouseAnimations = [...warehouseItem.anim.map((it:any) => it.name)]
                      warehouseAnimations.unshift("Animations")
                    }

                    showWarehouseDetailsPanel()
                })
                VisibilityComponent.createOrReplace(ent, {visible:false})
            }
        })

        delete category.items
        warehouseItems.set(category.style, {...category, parent:parent})
    })
}

export function createWarehouse(){
    createAudioRoom()
}

export function setWarehouseHoverFn(fnc:any){
    warehouseHoverFn = (data:any)=>{
        console.log('running warehouse hover function', data)
        fnc(data)
    }
}

export function setWarehouseHoverExitFn(fnc:any){
    warehouseHoverExitFn = (data:any)=>{
        console.log('running warehouse exit hover function', data)
        fnc(data)
    }
}

export function setWarehouseClickFn(fnc:any){
    warehouseClickFn = (data:any)=>{
        console.log('running warehouse clickver function', data)
        fnc(data)
    }
}

function hideAllModels(){
    let items = [...warehouseItems.values()]
    items.forEach((item:any)=>{
        if(item.entity){
            VisibilityComponent.createOrReplace(item.entity, {visible:false})
        }
    })
}

function showAreaModels(){
    let items = [...warehouseItems.values()].filter(it => it.sty === enteredArea)
    items.forEach((item:any)=>{
        VisibilityComponent.createOrReplace(item.entity, {visible:true})
    })
}

function createListeners(){
    console.log('created warehouse global listeners')
    globalEmitter.on(Triggers.ON_ENTER_SCENE, (info:any)=>{
        console.log('warehose on enter scene listener', info)
        let scene = colyseusRoom.state.scenes.get(info.sceneId)
        console.log('scene is', scene)
        if(info.sceneId === warehouseScene){
            console.log('entering warehouse')
            showWarehouseUI(true)
        }
    })

    globalEmitter.on(Triggers.ON_LEAVE_SCENE, (info:any)=>{
        console.log('warehose on leave scene listener', info)
        if(info.sceneId === warehouseScene){
            console.log('leaving warehouse')
            showWarehouseUI(false)
        }
    })
}

function createWarehouseHUD(){
    let parent = engine.addEntity()
    Transform.create(warehouseHUDParent, {parent:engine.CameraEntity})
    // AvatarAttach.create(headParent, {anchorPointId:AvatarAnchorPointType.AAPT_NECK})

    warehouseHUDParent = engine.addEntity()
    // MeshRenderer.setPlane(display)
    Transform.create(warehouseHUDParent, {parent: warehouseHUDParent, position: Vector3.create(-.5,.5,1), rotation:Quaternion.fromEulerDegrees(0,180,0)})

    let letter = engine.addEntity()
    Transform.create(letter, {parent:warehouseHUDParent})
    GltfContainer.create(letter, {src:'assets/e8a9b24a-01d8-4570-8972-c026c660171a.glb', invisibleMeshesCollisionMask:ColliderLayer.CL_NONE, visibleMeshesCollisionMask:ColliderLayer.CL_NONE})

    buildLocation("Lobby")
}

export function buildLocation(location:string){
    let chars:any[] = location.split("")
}


export function addLocalTrigger(category:any, index:number, config:any, parent:Entity){
    console.log('triger count is', index)
    let trigger = engine.addEntity()
    warehouseTriggers.set(category.style + index, {entity:trigger, label:category.style + "-" + config.id, sty:category.style, id:config.id})
    Transform.create(trigger, {position: config.p, parent:parent, scale:config.s})

    updateCategoryTriggers(category.style)

//     let scene = localPlayer.activeScene
//     let assetActions = scene[COMPONENT_TYPES.ACTION_COMPONENT].get("ayWkQ5")
//     let randomId = getRandomString(6)
//     assetActions.actions.push({id:randomId, state:enteredArea, type:Actions.SET_STATE})

//     let entityInfo = getEntity(localPlayer.activeScene, "ayWkQ5")
//     if(!entityInfo){
//         return
//     }
// //
//     updateActions(scene, entityInfo, {id:randomId, state:enteredArea, type:Actions.SET_STATE})

    utils.triggers.addTrigger(trigger, NO_LAYERS, LAYER_1, [{type:'box', scale:config.s}],
        ()=>{
            console.log('entered trigger area', category.style, enteredArea)
            hideWarehouseDetailsPanel()
            
            if(previousArea || previousArea === undefined){
                hideAllModels()
            }

            enteredArea = category.style
            if(previousArea !== enteredArea){
                showAreaModels()
            }

            if(previousArea !== enteredArea){
                previousArea = enteredArea
            }else{
                previousArea = undefined
            }

            // let entityInfo = getEntity(localPlayer.activeScene, "ayWkQ5")
            // if(!entityInfo){
            //     return
            // }

            // actionQueue.push({aid:entityInfo.aid, action:{id:randomId, state:enteredArea, type:Actions.SET_STATE}, entity:entityInfo.entity, force:true})            
        
        }
    )
}


////display

let moving = false
export let warehouseDetailsPanelPosition:number = -50
let direction = 1

export function showWarehouseDetailsPanel(){
    console.log('showaing warehose panel', moving)
    if(!moving){
        moving = true
        warehouseDetailsPanelPosition = -50
        direction = 1
        time = 1
        engine.addSystem(AnimateWarehouseDetailsSystem)
    }
}

export function hideWarehouseDetailsPanel(){
    if(!moving){
        moving = true
        direction = 0
        time = 1
        engine.addSystem(AnimateWarehouseDetailsSystem)
    }
}

let time = 1
function AnimateWarehouseDetailsSystem(dt:number){
    if(time > 0){
        time -=dt
        switch(direction){
            case 1:
                if(warehouseDetailsPanelPosition < 20){
                    warehouseDetailsPanelPosition += 20
                }else{
                    warehouseDetailsPanelPosition = 20
                }
                break;

            case 0:
                if(warehouseDetailsPanelPosition > -50){
                    warehouseDetailsPanelPosition -= 20
                }else{
                    warehouseDetailsPanelPosition = -50
                }
                break;
        }
    }else{
        engine.removeSystem(AnimateWarehouseDetailsSystem)
        moving = false
    }
}


export function selectAssetAnimation(index:number){
    warehouseAnimationIndex = index
}

export function playAssetAnimation(){
    console.log('playing asset animation ', warehouseAnimations, warehouseAnimationIndex)
    if(warehouseAnimationIndex === 0){
        return
    }

    let entity = selectedWarehouseItem.entity
    console.log('entity is', entity)
    if(!entity){
        return
    }

    Animator.playSingleAnimation(entity, warehouseAnimations[warehouseAnimationIndex], true)
}