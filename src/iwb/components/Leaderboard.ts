import { engine, TextAlignMode, TextShape, Transform } from "@dcl/sdk/ecs";
import { COMPONENT_TYPES } from "../helpers/types";
import { getEntity } from "./IWB";
import { Vector3 } from "@dcl/sdk/math";
import { colyseusRoom } from "./Colyseus";

let yOffset = 4
let padding = 0.3


export function leaderboardListener(scene:any){
    scene[COMPONENT_TYPES.LEADERBOARD_COMPONENT].onAdd((leaderboard:any, aid:any)=>{
        let itemInfo = getEntity(scene, aid)
        if(!itemInfo){
            return
        }

        leaderboard.entities = []
        leaderboard.data = []

        // if(leaderboard.type === 0){
            addLeaderboardEntities(itemInfo, leaderboard)
        // }//
    })
}

export function resetBoardEntities(leaderboard:any){
    if(!leaderboard.entities){
        leaderboard.entities = []
    }

    leaderboard.entities.forEach((ent:any)=>{
        engine.removeEntity(ent.name)
        engine.removeEntity(ent.value)
    })

    leaderboard.entities.length = 0
}

export function updateLeadboardRowEnabled(sceneId:string, aid:string){
    let scene = colyseusRoom.state.scenes.get(sceneId)
    if(!scene){
        return
    }

    let leaderboardInfo = scene[COMPONENT_TYPES.LEADERBOARD_COMPONENT].get(aid)
    if(!leaderboardInfo){
        return
    }

    for(let i = 0; i < 10; i++){
        leaderboardInfo.entities[i].enabled = i < leaderboardInfo.topAmount ? true : false
    }

    console.log('leadinb info is now', leaderboardInfo.entities)
}

export function addLeaderboardEntities(entityInfo:any, leaderboard:any){
    // resetBoardEntities(leaderboard)

    leaderboard.entities = []

    for(let i = 0; i < 10; i++){
     
        let name = engine.addEntity()
        let value = engine.addEntity()
        leaderboard.entities.push({name:name, value:value, enabled: i < leaderboard.topAmount ? true : false})

        switch(leaderboard.fontStyle){
            case 0:
                TextShape.createOrReplace(name, {text:"", fontSize:leaderboard.fontSize, textAlign:TextAlignMode.TAM_MIDDLE_LEFT})
                Transform.createOrReplace(name, {position: Vector3.create(-1.5, yOffset - (padding * i), 0), parent: entityInfo.entity})

                TextShape.createOrReplace(value, {text:"", fontSize:leaderboard.fontSize, textAlign:TextAlignMode.TAM_MIDDLE_CENTER})
                Transform.createOrReplace(value, {position: Vector3.create(1.5, yOffset - (padding * i), 0), parent: entityInfo.entity})
                break;
        }
    }

    console.log('leading board entities', leaderboard.entities)
}

export function updateLeaderboardInfo(leaderboard:any, data:any){
    leaderboard.data = data

    if(leaderboard.entities){
        console.log('we have leaderboard entities to update')
        leaderboard.entities.forEach((entity:any)=>{
            let nameShape = TextShape.getMutableOrNull(entity.name)
            if(nameShape){
                nameShape.text = ""
            }

            let valueShape = TextShape.getMutableOrNull(entity.value)
            if(valueShape){
                valueShape.text = ""
            }
        })

        if(data && data.length > 0){
            data.forEach((item:any, i:number)=>{
                console.log('leaderboard iutem is ', item)
                let entities = leaderboard.entities[i]
                
                let nameShape = TextShape.getMutableOrNull(entities.name)
                if(nameShape){
                    nameShape.text = item.name
                }
    
                let valueShape = TextShape.getMutableOrNull(entities.value)
                if(valueShape){
                    valueShape.text = "" + item.value
                }
            })
        }
    }
}