import { Entity } from "@dcl/sdk/ecs";
import { COMPONENT_TYPES, Triggers } from "../helpers/types";
import { getEntity } from "./IWB";
import { updateMaterial } from "./Materials";
import { getTriggerEvents } from "./Triggers";
import { stopVideoComponent, playVideoComponent } from "./Videos";

export function playlistListener(scene:any){
    scene[COMPONENT_TYPES.PLAYLIST_COMPONENT].onAdd((playlist:any, aid:any)=>{
        let entityInfo = getEntity(scene, aid)
        if(!entityInfo){
            return
        }

        playlist.listen("current", (c:any, p:any)=>{
            // console.log('playlist current frame changed', p, c, playlist.playlist[c])
            let texture:any
            if(c !== undefined){
                texture = playlist.playlist[c]
            }
            if(texture){
                scene[COMPONENT_TYPES.MATERIAL_COMPONENT].forEach((material:any, aid:string)=>{
                    if(material.textureType === 'PLAYLIST'){
                        let meshEntity = getEntity(scene, aid)
                        if(meshEntity){
                            material.texture = texture
                            material.emissiveType = material.textureType
                            material.emissiveTexture = texture
                            switch(playlist.type){
                                case 0:
                                    updateMaterial(scene, material, meshEntity)
                                    break;
        
                                case 1:
                                    // stopVideoComponent(materialInfo)//
                                    // updateMaterial(materialInfo, meshEntity)
                                    // playVideoComponent(meshEntity, playlist.currentKeyframe)
                                    break;
        
                                case 2:
                                    break;
                            }
        
                            let triggerEvents = getTriggerEvents(meshEntity)
                            triggerEvents.emit(Triggers.ON_PLAYLIST_CHANGE, {pointer:0, input:0, entity:meshEntity.entity})
                        }
                    }
                })
            }



            // playlist.meshAids.forEach((aid:string, i:number)=>{
            //     let meshEntity = getEntity(scene, aid)
            //     if(meshEntity){
            //         let materialInfo = scene[COMPONENT_TYPES.MATERIAL_COMPONENT].get(aid)
            //         if(materialInfo){
            //             materialInfo.texture = texture

            //             switch(playlist.type){
            //                 case 0:
            //                     updateMaterial(materialInfo, meshEntity)
            //                     break;

            //                 case 1:
            //                     stopVideoComponent(materialInfo)
            //                     updateMaterial(materialInfo, meshEntity)
            //                     playVideoComponent(meshEntity, playlist.currentKeyframe)
            //                     break;

            //                 case 2:
            //                     break;
            //             }

            //             let triggerEvents = getTriggerEvents(meshEntity)
            //             triggerEvents.emit(Triggers.ON_PLAYLIST_CHANGE, {pointer:0, input:0, entity:meshEntity.entity})
            //         }
            //     }
            // })//
        })
    })

    scene[COMPONENT_TYPES.TEXTURE_COMPONENT].onRemove((texture:any, aid:any)=>{
        let entityInfo = getEntity(scene, aid)
        if(!entityInfo){
            return
        }
    })
}

