import { editCurrentSceneParcels } from "../../ui/Panels/CreateScenePanel"
import { addBoundariesForParcel, deleteParcelEntities } from "../modes/create"
import { sceneBuilds } from "../scenes"


export function sceneListeners(scene:any, key:any){
    scene.pcls.onAdd((parcel:string, parcelKey:any)=>{
        if(editCurrentSceneParcels){
            addBoundariesForParcel(parcel, true)
        }
    })

    scene.pcls.onRemove((parcel:string, parcelKey:any)=>{
        if(editCurrentSceneParcels){
            deleteParcelEntities(parcel)
        }
    })

    scene.listen("si",(current:any, previous:any)=>{
        sceneBuilds.get(key).si = current
    })

    scene.listen("pc",(current:any, previous:any)=>{
        sceneBuilds.get(key).pc = current
    })

}