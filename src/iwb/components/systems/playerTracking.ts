import { Transform, engine } from "@dcl/sdk/ecs"
import { localUserId, players } from "../player/player"


export function PlayerTrackingSystem(dt:number){
    if(localUserId && players.has(localUserId)){
        let pos = Transform.get(engine.PlayerEntity).position
        let player = players.get(localUserId)
        player!.currentParcel = "" + Math.floor(pos.x / 16).toFixed(0) + "," + "" + Math.floor(pos.z / 16).toFixed(0)
    }
}