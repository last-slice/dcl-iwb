import { openExternalUrl } from "~system/RestrictedActions";
import { iwbEvents } from ".";
import { log } from "../../helpers/functions";
import { IWB_MESSAGE_TYPES, SCENE_MODES, SERVER_MESSAGE_TYPES } from "../../helpers/types";
import resources from "../../helpers/resources";
import { localUserId, players } from "../player/player";//
import { Entity, GltfContainer, Material, engine } from "@dcl/sdk/ecs";
import { BuildModeVisibilty, ParcelFloor, greenBeam, redBeam } from "../modes/create";
import { Color4 } from "@dcl/sdk/math";
import { sceneBuilds, updatePlayModeReset } from "../scenes";
import { addBuildModePointers, hideAllOtherPointers, resetEntityForBuildMode } from "../modes/build";
import { InputListenSystem, addInputSystem, removeInputSystem } from "../systems/InputListenSystem";
import { PlayModeInputSystem, addPlayModeSystem, removePlayModSystem } from "../systems/PlayModeInputSystem";
import { hideAllPanels } from "../../ui/ui";
import { disableEntityForPlayMode } from "../modes/play";
import { utils } from "../../helpers/libraries";

let created = false
export function createIWBEventListeners(){
    if(!created){
        created = true
        iwbEvents.on(SERVER_MESSAGE_TYPES.PLAY_MODE_CHANGED, (info)=>{
            for (const [entity] of engine.getEntitiesWith(BuildModeVisibilty)) {
                if(players.get(localUserId)?.mode === SCENE_MODES.CREATE_SCENE_MODE){
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

            hideAllOtherPointers()
            hideAllPanels()

            sceneBuilds.forEach((scene,key)=>{
                scene.entities.forEach((entity:Entity)=>{
                    if(players.get(localUserId)?.mode === SCENE_MODES.BUILD_MODE){
                        addBuildModePointers(entity)
                        resetEntityForBuildMode(scene, entity)
                    }else{
                        // resetEntityForPlayMode(scene, entity)
                        disableEntityForPlayMode(scene.id, entity)
                    }
                })
            })

            updatePlayModeReset(true)

            if(players.get(localUserId)?.mode === SCENE_MODES.BUILD_MODE){
                removePlayModSystem()
                addInputSystem()
                updatePlayModeReset(false)
                // utils.triggers.enableDebugDraw(true)
            }else if(players.get(localUserId)?.mode === SCENE_MODES.PLAYMODE){
                removeInputSystem()
                addPlayModeSystem()
                utils.triggers.enableDebugDraw(false)
            }else{
                removeInputSystem()
                removePlayModSystem()
                utils.triggers.enableDebugDraw(false)
            }
        })
    }
}
