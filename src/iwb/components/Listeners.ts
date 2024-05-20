import { Room } from "colyseus.js";
import { addParenting } from "./Parenting";
import { addTransformComponent, transformListener } from "./Transform";
import { addVisibilityComponent, visibilityListener } from "./Visibility";
import { addTextShapeComponent, textShapeListener } from "./TextShape";
import { addCounterComponent, counterListener } from "./Counter";
import { addTriggerComponent } from "./Triggers";
import { addActionComponent } from "./Actions";
import { addPointerComponent } from "./Pointers";
import { addInputSystem } from "../systems/InputSystem";
import { addGltfComponent, gltfListener } from "./Gltf";
import { addStateComponent, stateListener } from "./States";
// import { addIWBCatalogComponent, addIWBComponent } from "./IWB";
// import { addNameComponent } from "./Name";

export async function createSceneListeners(room:Room){
    addInputSystem()
    await addSceneStateListeners(room)
}

export function addSceneStateListeners(room:Room){
    room.state.scenes.onAdd(async(scene:any, key:string)=>{
        console.log('scene added', key, scene)
        await addParenting(scene)

        await addGltfComponent(scene)
        gltfListener(scene)

        await addVisibilityComponent(scene)
        visibilityListener(scene)

        await addTransformComponent(scene)
        transformListener(scene)

        await addTextShapeComponent(scene)
        textShapeListener(scene)

        await addPointerComponent(scene)

        await addTriggerComponent(scene)

        await addActionComponent(scene)

        await addCounterComponent(scene)
        counterListener(scene)

        await addStateComponent(scene)
        stateListener(scene)

        //todo
        //we might not need these since these are only metadata changes and can be pulled auto from colyseus room state
        // await addIWBComponent(scene)
        // await addIWBCatalogComponent(scene)
        // await addNameComponent(scene)

    })
}