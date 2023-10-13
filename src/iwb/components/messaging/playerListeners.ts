import { GltfContainer, MeshCollider, MeshRenderer, Transform, engine } from "@dcl/sdk/ecs"
import { log } from "../../helpers/functions"
import { NOTIFICATION_TYPES, SERVER_MESSAGE_TYPES } from "../../helpers/types"
import { showNotification } from "../../ui/Panels/notificationUI"
import { Vector3 } from "@dcl/sdk/math"
import { localUserId, players } from "../player/player"

export function createrPlayerListeners(room:any){
    room.onMessage(SERVER_MESSAGE_TYPES.PLAYER_ASSET_UPLOADED, (info:any)=>{
        log(SERVER_MESSAGE_TYPES.PLAYER_ASSET_UPLOADED +' received', info)
        showNotification({type:NOTIFICATION_TYPES.IMAGE, image:info.image, message:"Your asset " + info.name + " is ready to use!\nRefresh the Browser.", animate:{enabled:true, return:true, time:10}})

        if(info.v && info.v > players.get(localUserId).version){
            log('this asset is not ready for viewing, need to add temporary asset')
        
            let scale:any
            if(info.si){
                scale = Vector3.create(info.si.x, info.si.y, info.si.z)
            }else{
                scale = Vector3.One()
            }
            let ent = engine.addEntity()
            MeshRenderer.setBox(ent)
            Transform.create(ent, {position: Vector3.create(8,0,8), scale: scale})
        }
    })

    let ent2 = engine.addEntity()
    Transform.create(ent2, {position: Vector3.create(8,0,8)})
    GltfContainer.create(ent2, {src:"assets/angzaar_logo.glb"})
}
//