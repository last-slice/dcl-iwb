import {engine, Entity, GltfContainer, Material, MeshRenderer, Transform, VisibilityComponent} from "@dcl/sdk/ecs"
import {localUserId, setPlayMode} from "../../player/player"
import {Color4, Quaternion, Vector3} from "@dcl/sdk/math"
import {SCENE_MODES, SERVER_MESSAGE_TYPES} from "../../../helpers/types"
import {displayCreateScenePanel, editCurrentSceneParcels} from "../../../ui/Panels/CreateScenePanel"
import { log } from "../../../helpers/functions"
import { sendServerMessage } from "../../messaging"
import { displaySceneSavedPanel } from "../../../ui/Panels/sceneSavedPanel"
import { sceneBuilds } from "../../scenes"
import { scene } from "../../../ui/Panels/builds/buildsIndex"

export let tempScene:any ={}
export let tempParcels:Map<string, any> = new Map()

export let greenBeam = "assets/53726fe8-1d24-4fd8-8cee-0ac10fcd8644.glb"
export let redBeam = "assets/d8b8c385-8044-4bef-abcb-0530b2ebd6c7.glb"

export const SelectedFloor = engine.defineComponent("iwb::selected::FloorComponent", {})
export const BuildModeVisibilty = engine.defineComponent("iwb::buildmode::visibility", {})
export const ParcelFloor = engine.defineComponent("iwb::floor::component", {})

export function validateScene(){
    displayCreateScenePanel(false)

    //to do//
    //check other validations//

    if(tempParcels.size > 0){
        log('we have valid scene, send to server')
        editCurrentSceneParcels ? 

        sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_UPDATE_PARCELS, {sceneId: scene!.id})

        : 
        
        sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_SAVE_NEW, {name: tempScene.name, desc:tempScene.description, enabled:tempScene.enabled, private:tempScene.priv, image: tempScene.image})
    }    
}

export function editCurrentParcels(id:string){
    sceneBuilds.forEach((scene)=>{
        scene.pcls.forEach((parcel:string)=>{
            scene.id === id ? addBoundariesForParcel(parcel, true,false) : addBoundariesForParcel(parcel, false, false)
        })
    })
}

export function createTempScene(name:string, desc:string, image:string, enabled:boolean, priv:boolean){
    tempScene.name = name
    tempScene.description = desc
    tempScene.enabled = enabled
    tempScene.priv = priv
    tempScene.image = image
    tempParcels.clear()
    setPlayMode(localUserId, SCENE_MODES.CREATE_SCENE_MODE)
}

export function selectParcel(parcel: any) {
    if(!tempParcels.has(parcel)){
        addBoundariesForParcel(parcel, true, false)
    }
    // let scene = scenesToCreate.get(info.player)
    // if (scene) {
    //     log('scene exists locally')
    //     /**
    //      * TODO
    //      * check if selected parcel is adjacent to at least 1 other parcel in the scene
    //      * check which direction the selected parcel is and update the size accordingly (1x1, 2x1, etc)
    //      *
    //      *///
    //     if (!scene.parcels.find((p: string) => p === info.parcel)) {
    //         scene.parcels.push({parcel: info.parcel, entities: []})
    //         addSelectedBoundaries(info)
    //     }
    // } else {
    //     log('scene doesnt exist locally ')
    //     let data: any = {
    //         parcels: [{parcel: info.parcel, entities: []}],
    //         name: "test",
    //         size: [1, 1],
    //     }
    //     scenesToCreate.set(info.player, data)
    //     addSelectedBoundaries(info)
    // }//
}

export function addBoundariesForParcel(parcel:string, local:boolean, lobby:boolean, playMode?:boolean) {
    if(!tempParcels.has(parcel)){
        let entities: any[] = []

        let parent = engine.addEntity()

        let [x1, y1] = parcel.split(",")
        let x = parseInt(x1)
        let y = parseInt(y1)
        let centerx = (x * 16) + 8
        let centery = (y * 16) + 8

        if(lobby){
            let left = engine.addEntity()
            let right = engine.addEntity()
            let front = engine.addEntity()
            let back = engine.addEntity()

            entities.push(left)
            entities.push(right)
            entities.push(front)
            entities.push(back)

            //left
            Transform.createOrReplace(left, {
                position: Vector3.create(x * 16, 0, y * 16),
                rotation: Quaternion.fromEulerDegrees(0, 0, 0),
                scale: Vector3.create(1, 20, 1),
                parent:parent
            })
            GltfContainer.create(left, {src: local ? greenBeam : redBeam})
    
            //right
            Transform.createOrReplace(right, {
                position: Vector3.create(x * 16 + 16, 0, y * 16),
                rotation: Quaternion.fromEulerDegrees(0, 0, 0),
                scale: Vector3.create(1, 20, 1),
                parent:parent
            })
            GltfContainer.create(right, {src: local ? greenBeam : redBeam})
    
            // front
            Transform.createOrReplace(front, {
                position: Vector3.create(x * 16, 0, y * 16 + 16),
                rotation: Quaternion.fromEulerDegrees(0, 0, 0),
                scale: Vector3.create(1, 20, 1),
                parent:parent
            })
            GltfContainer.create(front, {src: local ? greenBeam : redBeam})
    
            // back
            Transform.createOrReplace(back, {
                position: Vector3.create(x * 16 + 16, 0, y * 16 + 16),
                rotation: Quaternion.fromEulerDegrees(0, 0, 0),
                scale: Vector3.create(1, 20, 1),
                parent:parent
            })
            GltfContainer.createOrReplace(back, {src: local ? greenBeam : redBeam})

            VisibilityComponent.createOrReplace(left, {visible:playMode ? false : true})
            VisibilityComponent.createOrReplace(front, {visible:playMode ? false : true})
            VisibilityComponent.createOrReplace(right, {visible:playMode ? false : true})
            VisibilityComponent.createOrReplace(back, {visible:playMode ? false : true})

                
            BuildModeVisibilty.createOrReplace(left)
            BuildModeVisibilty.createOrReplace(front)
            BuildModeVisibilty.createOrReplace(right)
            BuildModeVisibilty.createOrReplace(back)

        }
        
    
        let floor = engine.addEntity()
        entities.push(floor)
    
        Transform.createOrReplace(parent)
    
        Transform.createOrReplace(floor, {
            position: Vector3.create(centerx, 0, centery),
            rotation: Quaternion.fromEulerDegrees(90, 0, 0),
            scale: Vector3.create(16, 16, 1),
            parent:parent
        })
        MeshRenderer.setPlane(floor)
        Material.setPbrMaterial(floor, {
            albedoColor: local ? Color4.create(0, 1, 0, .5) : Color4.Red()
        })
        if(local) SelectedFloor.create(floor, {})
        ParcelFloor.create(floor)
    
        VisibilityComponent.create(floor, {visible:playMode ? false : true})    
        BuildModeVisibilty.create(floor)
        tempParcels.set(parcel, entities)
    }
    
}

export function isParcelInScene(parcel:string){
    let inScene = false
    sceneBuilds.forEach((scene)=>{
        if(scene.pcls.includes(parcel)){
            inScene = true
            return
        }
    })
    return inScene
}

export function deleteParcelEntities(parcel: any) {
    let entities = tempParcels.get(parcel)

    entities.forEach((entity:Entity)=>{
        engine.removeEntity(entity)
    })
    tempParcels.delete(parcel)

    // let scene = scenesToCreate.get(info.player)
    // if (scene) {
    //     let parcel = scene.parcels.find((p: any) => p.parcel === info.parcel)
    //     if (parcel) {
    //         parcel.entities.forEach((entity: any) => {
    //             engine.removeEntity(entity)
    //         });
    //         let index = scene.parcels.findIndex((p: any) => p.parcel === info.parcel)
    //         scene.parcels.splice(index, 1)
    //     }
    // }
}

export function deleteCreationEntities(player: string) {
    tempParcels.forEach((entities, key)=>{
        deleteParcelEntities(key)
    })


    // let scene = scenesToCreate.get(player)
    // if (scene) {
    //     scene.parcels.forEach((parcel: any) => {
            
    //     })
    //     scenesToCreate.delete(player)
    // }//
}

export function saveNewScene(userId:string) {
    // only save if local user saved
    if(userId !== localUserId) return

    displaySceneSavedPanel(true)
    displayCreateScenePanel(false)


    // scenesToCreate.delete(localUserId)
    //
    

    // let player = players.get(localUserId)

    // // allow building for each parcel
    // scene.pcls.forEach((parcel: any) => {
    //     player!.buildingAllowed.push(parcel)
    // })
    // scenesToCreate.delete(localUserId)

    // // create parent entity for scene//
    // const [x1, y1] = scene.bpcl.split(",")
    // let x = parseInt(x1)
    // let y = parseInt(y1)
    // const sceneParent = engine.addEntity()
    // Transform.create(sceneParent, {
    //     position: Vector3.create(x*16, 0, y*16)
    // })
    // MeshRenderer.setPlane(sceneParent)
    // scene.parentEntity = sceneParent

    // // add to player scenes
    // player!.scenes.push(scene)
    // player!.activeScene = scene

    // // change floor color
    // for (const [entity] of engine.getEntitiesWith(Material, SelectedFloor)){
    //     Material.setPbrMaterial(entity, {
    //         albedoColor: Color4.create(.2, .9, .1, 1)
    //     })
    // }


}