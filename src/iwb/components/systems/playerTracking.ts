import { Transform, engine } from "@dcl/sdk/ecs"
import { localUserId, players } from "../player/player"
import { sceneBuilds } from "../scenes"
import { IWBScene } from "../../helpers/types"


export function PlayerTrackingSystem(dt:number){
    if(localUserId && players.has(localUserId)){
        let pos = Transform.get(engine.PlayerEntity).position
        let player = players.get(localUserId)
        player!.currentParcel = "" + Math.floor(pos.x / 16).toFixed(0) + "," + "" + Math.floor(pos.z / 16).toFixed(0)

        console.log(player!.currentParcel)

        sceneBuilds.forEach((scene:IWBScene, key:string)=>{
            if(scene.pcls.find((parcel) => parcel === player!.currentParcel && (scene.o === localUserId  || scene.bps.find((permission)=> permission === localUserId)))){
                console.log('player is on current owned parcel')
                player!.activeScene = scene
            }
        })
    }
}