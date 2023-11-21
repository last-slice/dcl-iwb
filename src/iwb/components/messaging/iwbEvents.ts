import { openExternalUrl } from "~system/RestrictedActions";
import { iwbEvents } from ".";
import { log } from "../../helpers/functions";
import { IWB_MESSAGE_TYPES, SCENE_MODES, SERVER_MESSAGE_TYPES } from "../../helpers/types";
import resources from "../../helpers/resources";
import { localUserId, players } from "../player/player";//
import { Entity, GltfContainer, Material, engine } from "@dcl/sdk/ecs";
import { BuildModeVisibilty, ParcelFloor, greenBeam, redBeam } from "../modes/create";
import { Color4 } from "@dcl/sdk/math";
import { sceneBuilds } from "../scenes";
import { addBuildModePointers } from "../modes/build";

let created = false
export function createIWBEventListeners(){
    if(!created){
        created = true
        iwbEvents.on(SERVER_MESSAGE_TYPES.PLAY_MODE_CHANGED, (info)=>{
            for (const [entity] of engine.getEntitiesWith(BuildModeVisibilty)) {
                if(players.get(localUserId)?.mode === 1){
                    if(ParcelFloor.has(entity)){
                        Material.setPbrMaterial(entity, {
                            albedoColor: Color4.Red()
                        })
                    }else{
                        GltfContainer.createOrReplace(entity, {src: redBeam})
                    }
                }else{
                    if(ParcelFloor.has(entity)){
                        Material.setPbrMaterial(entity, {
                            albedoColor: Color4.create(0, 1, 0, .5)
                        })
                    }else{
                        GltfContainer.createOrReplace(entity, {src: greenBeam})
                    }
                }
            }

            if(players.get(localUserId)?.mode === SCENE_MODES.BUILD_MODE){
                sceneBuilds.forEach((scene,key)=>{
                    scene.entities.forEach((entity:Entity)=>{
                        addBuildModePointers(entity)
                    })
                })
            }
        })
    }
}
