import { engine } from "@dcl/sdk/ecs"
import { isLocalPlayer } from "./Player"

export async function addParenting(scene:any){
    scene.parenting.forEach((item:any, i:number)=>{
        if(i > 2){

            console.log('adding real entities', item)
            let ent = engine.addEntity()
            item.entity = ent

            // pointerEventsSystem.onPointerDown({entity:ent, opts:{button:InputAction.IA_POINTER, maxDistance:10, hoverText:"Click Here"}}, ()=>{

            //     //TESTING SERVER LISTENERS
            //     // sendServerMessage('move',/// {sceneId:scene.id, aid:item.aid, mode:'p', axis:'x', direction:1, factor:1})//
               
            //     // sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET,
            //     //     {sceneId:scene.id, aid:item.aid, component:COMPONENT_TYPES.VISBILITY_COMPONENT, data:{}}
            //     // )

            //     sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET,
            //         {sceneId:scene.id, aid:item.aid, component:COMPONENT_TYPES.TEXT_COMPONENT, data:{text:"Awesome"}}
            //     )

            //     console.log(getAssetName(scene.id, item.aid))

            //     console.log(getCounterValue(scene.id, item.aid, "lives"))
            // })
        }
    })
}