import { Room } from "colyseus.js";
import { addParenting } from "./Parenting";
import { addTransformComponent, transformListener } from "./Transform";
import { addVisibilityComponent, visibilityListener } from "./Visibility";
import { addTextShapeComponent, textShapeListener } from "./TextShape";
import { counterListener } from "./Counter";
import { addTriggerComponent } from "./Triggers";
import { addActionComponent } from "./Actions";
// import { addIWBCatalogComponent, addIWBComponent } from "./IWB";
// import { addNameComponent } from "./Name";

export function createSceneListeners(room:Room){
    addSceneStateListeners(room)
}

export function addSceneStateListeners(room:Room){
    room.state.scenes.onAdd(async(scene:any, key:string)=>{
        console.log('scene added', key, scene)
        await addParenting(scene)

        await addVisibilityComponent(scene)
        visibilityListener(scene)

        await addTransformComponent(scene)
        transformListener(scene)

        await addTextShapeComponent(scene)
        textShapeListener(scene)

        await addTriggerComponent(scene)

        await addActionComponent(scene)

        counterListener(scene)

        // await addIWBComponent(scene)
        // await addIWBCatalogComponent(scene)
        // await addNameComponent(scene)

        // await addGltfComponent(scene)
      
    })
}