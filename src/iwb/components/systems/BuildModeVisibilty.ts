import { Transform, VisibilityComponent, engine } from "@dcl/sdk/ecs"
import { localUserId, players } from "../player/player"
import { BuildModeVisibilty } from "../modes/create"
import { log } from "../../helpers/functions"

let timer = 0
export function BuildModeVisibiltyComponents(dt:number){
    
    if(timer > 0){
        timer -= dt
    }else{
        timer = .2
        for (const [entity] of engine.getEntitiesWith(BuildModeVisibilty)) {
            if(players.get(localUserId)?.mode === 2){
                VisibilityComponent.createOrReplace(entity).visible = true
            }else{
                VisibilityComponent.createOrReplace(entity).visible = false
            }
           }
    }
}