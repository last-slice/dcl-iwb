
import { Entity } from "@dcl/sdk/ecs"
import { utils } from "../helpers/libraries"
import { COMPONENT_TYPES } from "../helpers/types"
import { entitiesWithPathingEnabled } from "../modes/Play"
import { updateTransform } from "./Transform"

export function checkPathComponent(scene:any, entityInfo:any, data?:any){
    let itemInfo = scene[COMPONENT_TYPES.PATH_COMPONENT].get(entityInfo.aid)
    if(itemInfo){
    }
}

export function disablePathingForEntity(scene:any, entityInfo:any){
    entitiesWithPathingEnabled.get(entityInfo.entity)
    // entitiesWithPathingEnabled.forEach((entity:Entity, aid:any)=>{
        utils.paths.stopPath(entityInfo.entity)
        let transform = scene[COMPONENT_TYPES.TRANSFORM_COMPONENT].get(entityInfo.aid)
        updateTransform(scene, entityInfo.aid, transform)
    // })
    // entitiesWithPathingEnabled.clear()
}

export function walkPath(scene:any, info:any, action:any, backToStart?:boolean){
    let pathInfo = scene[COMPONENT_TYPES.PATH_COMPONENT].get(action.pathAid)
    if(!pathInfo){
        console.log('no path info')
        return
    }

    let paths = [...pathInfo.paths]

    if(pathInfo.start === 2){
        paths.unshift(scene[COMPONENT_TYPES.TRANSFORM_COMPONENT].get(info.aid).p)
    }

    if(pathInfo.backToStart){
        console.log('wanting to go back to start')
        paths.push(paths[0])
    }

    console.log('paths are ', paths)

    if(pathInfo.smooth){
        utils.paths.startSmoothPath(
            info.entity, 
            paths, 
            pathInfo.duration, 
            30, 
            pathInfo.lookPoint, 
            ()=>{
                console.log("finished path")
                disablePathingForEntity(scene, info)

                if(pathInfo.loop){
                    walkPath(scene, info, action)
                }
            },
            ()=>{
                console.log("finished point calledback")
            }
        )
        entitiesWithPathingEnabled.set(info.entity, {})
    }else{
        utils.paths.startStraightPath(
            info.entity, 
            paths, 
            pathInfo.duration, 
            pathInfo.lookPoint, 
            ()=>{
                console.log("finished path")
                disablePathingForEntity(scene, info)

                if(pathInfo.loop){
                    walkPath(scene, info, action)
                }
            },
            ()=>{
                console.log("finished point calledback")
            }
        )
        entitiesWithPathingEnabled.set(info.entity, {})
    }
}