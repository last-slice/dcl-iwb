import {engine, Entity, GltfContainer, Material, MeshRenderer, Transform, VisibilityComponent} from "@dcl/sdk/ecs"
import { Vector3, Quaternion, Color4 } from "@dcl/sdk/math"
import { sendServerMessage, colyseusRoom } from "../components/Colyseus"
import { localUserId, localPlayer, setPlayMode } from "../components/Player"
import { SCENE_MODES, SERVER_MESSAGE_TYPES } from "../helpers/types"
import { playerMode } from "../components/Config"
import { displayExpandedMap, editCurrentSceneParcels } from "../ui/Objects/ExpandedMapView"
import { scene } from "../ui/Objects/SceneMainDetailPanel"
import { addBlankParcels } from "../components/Scene"

export let tempScene:any ={}
export let tempParcels:Map<string, any> = new Map()
export let otherTempParcels:Map<string, any> = new Map()
export let greenBeam = "assets/53726fe8-1d24-4fd8-8cee-0ac10fcd8644.glb"
export let redBeam = "assets/d8b8c385-8044-4bef-abcb-0530b2ebd6c7.glb"

export const SelectedFloor = engine.defineComponent("iwb::selected::FloorComponent", {})
export const ParcelFloor = engine.defineComponent("iwb::floor::component", {})

export function validateScene(){
    if(tempParcels.size > 0){
        if(editCurrentSceneParcels){
            // sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_UPDATE_PARCELS, {sceneId: scene!.id})

            let degrees = parseInt(Math.ceil(Quaternion.toEulerAngles(Transform.get(scene!.parentEntity).rotation).y).toFixed(0))
            let transform = Transform.get(scene!.parentEntity).position
            sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_UPDATE_PARCELS,
                {
                    sceneId: scene!.id,
                    direction: degrees,
                    offsets: [transform.x, transform.z]
                })
        }else{
            console.log('sending to server')
            sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_SAVE_NEW, tempScene)
        }
    }    
}

export function editCurrentParcels(id:string){
    colyseusRoom.state.scenes.forEach((scene:any)=>{
        scene.pcls.forEach((parcel:string)=>{
            scene.id === id ? addBoundariesForParcel(parcel, true,false) : addBoundariesForParcel(parcel, false, false)
        })
    })
}

export function createTempScene(name:string, desc:string, image:string, enabled:boolean, priv:boolean, category:string, rating:any, dPx:boolean, dv:boolean){
    tempScene.name = name
    tempScene.description = desc
    tempScene.enabled = enabled
    tempScene.priv = priv
    tempScene.image = image
    tempScene.cat = category
    tempScene.rating = rating
    tempScene.dPx = dPx
    tempScene.dv = dv
    tempParcels.clear()//
    setPlayMode(localUserId, SCENE_MODES.CREATE_SCENE_MODE)
}

export function selectParcel(parcel: any) {
    console.log('selecting parcel', parcel)
    addBoundariesForParcel(parcel, true, false)
}

export function addBoundariesForParcel(parcel:string, local:boolean, lobby:boolean, playMode?:boolean) {
    if(!tempParcels.has(parcel)){
        console.log('adding boundaries for temp parcel')
        let entities: any[] = []

        let parent = engine.addEntity()

        let [x1, y1] = parcel.split(",")
        let x = parseInt(x1)
        let y = parseInt(y1)
        let centerx = (x * 16) + 8
        let centery = (y * 16) + 8

        // if(lobby){
        //     let left = engine.addEntity()
        //     let right = engine.addEntity()
        //     let front = engine.addEntity()
        //     let back = engine.addEntity()

        //     entities.push(left)
        //     entities.push(right)
        //     entities.push(front)
        //     entities.push(back)

        //     //left
        //     Transform.createOrReplace(left, {
        //         position: Vector3.create(x * 16, 0, y * 16),
        //         rotation: Quaternion.fromEulerDegrees(0, 0, 0),
        //         scale: Vector3.create(1, 20, 1),
        //         parent:parent
        //     })
        //     GltfContainer.create(left, {src: local ? greenBeam : redBeam})
    
        //     //right
        //     Transform.createOrReplace(right, {
        //         position: Vector3.create(x * 16 + 16, 0, y * 16),
        //         rotation: Quaternion.fromEulerDegrees(0, 0, 0),
        //         scale: Vector3.create(1, 20, 1),
        //         parent:parent
        //     })
        //     GltfContainer.create(right, {src: local ? greenBeam : redBeam})
    
        //     // front
        //     Transform.createOrReplace(front, {
        //         position: Vector3.create(x * 16, 0, y * 16 + 16),
        //         rotation: Quaternion.fromEulerDegrees(0, 0, 0),
        //         scale: Vector3.create(1, 20, 1),
        //         parent:parent
        //     })
        //     GltfContainer.create(front, {src: local ? greenBeam : redBeam})
    
        //     // back
        //     Transform.createOrReplace(back, {
        //         position: Vector3.create(x * 16 + 16, 0, y * 16 + 16),
        //         rotation: Quaternion.fromEulerDegrees(0, 0, 0),
        //         scale: Vector3.create(1, 20, 1),
        //         parent:parent
        //     })
        //     GltfContainer.createOrReplace(back, {src: local ? greenBeam : redBeam})

        //     VisibilityComponent.createOrReplace(left, {visible:playMode ? false : true})
        //     VisibilityComponent.createOrReplace(front, {visible:playMode ? false : true})
        //     VisibilityComponent.createOrReplace(right, {visible:playMode ? false : true})
        //     VisibilityComponent.createOrReplace(back, {visible:playMode ? false : true})
        // }
        
    
        let floor = engine.addEntity()
        entities.push(floor)
    
        //Transform.createOrReplace(parent)
    
        Transform.createOrReplace(floor, {
            position: Vector3.create(centerx, playerMode === SCENE_MODES.CREATE_SCENE_MODE ? .1 : -.09, centery),
            rotation: Quaternion.fromEulerDegrees(90, 0, 0),
            scale: Vector3.create(16, 16, 0.01),
            parent:parent
        })
        MeshRenderer.setPlane(floor)
        Material.setPbrMaterial(floor, {
            albedoColor: local ? Color4.create(0, 1, 0, .5) : Color4.Red()
        })
        if(local) SelectedFloor.create(floor, {})
        ParcelFloor.create(floor)
    
        VisibilityComponent.create(floor, {visible:playMode ? false : true})    
        // BuildModeVisibilty.create(floor)


        local ? tempParcels.set(parcel, entities) : otherTempParcels.set(parcel, entities)
    }
    
}

export function isParcelInScene(parcel:string){
    let inScene = false
    colyseusRoom.state.scenes.forEach((scene:any)=>{
        if(scene.pcls.includes(parcel)){
            inScene = true
            return
        }
    })
    return inScene
}

export function deleteParcelEntities(parcel: any) {
    let entities = tempParcels.get(parcel)
    if(entities){
        entities.forEach((entity:Entity)=>{
            engine.removeEntity(entity)
        })
    }
    tempParcels.delete(parcel)
}

export function deleteOtherParcelEntities(parcel: any) {
    let otherEntities = otherTempParcels.get(parcel)
    if(otherEntities){
        otherEntities.forEach((entity:Entity)=>{
            engine.removeEntity(entity)
        })
    }
    otherTempParcels.delete(parcel)
}

export function cancelParcelEdits(){
    addBlankParcels([...colyseusRoom.state.temporaryParcels])
          
    deleteCreationEntities(localUserId)
    validateScene()
    displayExpandedMap(false)
}

export function deleteCreationEntities(player: string) {
    tempParcels.forEach((entities, key)=>{
        deleteParcelEntities(key)
    })

    otherTempParcels.forEach((entities, key)=>{
        deleteOtherParcelEntities(key)
    })
}

export function saveNewScene(userId:string) {
    if(userId !== localUserId) return

    // displaySceneSavedPanel(true)
    // displayCreateScenePanel(false)//
}

export function getParcels() {
    return editCurrentSceneParcels ? colyseusRoom.state.scenes.get(scene!.id).pcls.length : tempParcels.size
}