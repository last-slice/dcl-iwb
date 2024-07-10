import { Entity, GltfContainerLoadingState, LoadingState, engine } from "@dcl/sdk/ecs"
import { COMPONENT_TYPES, Triggers } from "../helpers/types"
import { createAsset, getEntity } from "./IWB"
import { updatePlayModeReset } from "../modes/Play"
import { LevelAssetGLTF } from "../helpers/Components"
import { getTriggerEvents } from "./Triggers"

let levelAssetsToLoad:number = 0
let levelAssetsLoaded:number = 0
let levelToLoad:Entity

export function levelListener(scene:any){
    scene[COMPONENT_TYPES.LEVEL_COMPONENT].onAdd(async(item:any, aid:any)=>{
        console.log('level addded', aid, item)
    })
}

export function isLevelAsset(scene:any, aid:string){
    let isLevelAsset = false
    scene[COMPONENT_TYPES.LEVEL_COMPONENT].forEach((level:any, levelAid:string)=>{
        let levelChildren = scene[COMPONENT_TYPES.PARENTING_COMPONENT].find(($:any) => $.aid === levelAid).children
        if(levelChildren){
            if(levelChildren.find(($:any)=> $ === aid)){
                isLevelAsset = true
            }
        }
    })
    return isLevelAsset
}

export function loadLevelAssets(scene:any, info:any, action:any){
    console.log('loading level assets', info.aid, info.entity, action)
    // engine.addSystem(LevelAssetLoadingSystem)

    let levelParent = scene[COMPONENT_TYPES.PARENTING_COMPONENT].find(($:any)=> $.aid === info.aid)
    if(levelParent){
        levelToLoad = info.entity
        levelAssetsToLoad = levelParent.children.length

        levelParent.children.forEach((aid:string, i:number)=>{
            createAsset(scene, scene[COMPONENT_TYPES.IWB_COMPONENT].get(aid), true)
            levelAssetsLoaded++
            checkLevelLoaded(info.entity)
        })

        checkLevelLoaded(info.entity)
        updatePlayModeReset(true)
    }
}

export function unloadAllSceneGameAssets(scene:any){
    scene[COMPONENT_TYPES.PARENTING_COMPONENT].forEach((item:any, i:number)=>{
        if(i > 2){
            let entityInfo = getEntity(scene, item.aid)
            if(entityInfo){
                if(isLevelAsset(scene, item.aid)){
                    engine.removeEntity(entityInfo.entity)
                }
            }
        }
    })
    levelAssetsLoaded = 0
    levelAssetsToLoad = 0
    levelToLoad = -500 as Entity
}

// export function unloadLevelAssets(scene:any, levelAid:string){
//     if(isLevelAsset(scene, item.aid)){
//         engine.removeEntity(entityInfo.entity)
//     }
// }

export function checkLevelLoaded(level:Entity){
    console.log("checking level loaded", level, levelAssetsLoaded, levelAssetsToLoad)
    if(levelAssetsLoaded >= levelAssetsToLoad){
        console.log('level assets have all loaded')
        engine.removeSystem(LevelAssetLoadingSystem)

        let triggerEvents = getTriggerEvents(level)
        triggerEvents.emit(Triggers.ON_LEVEL_LOADED, {entity:level, pointer:0, input:0})
    }
}

export function LevelAssetLoadingSystem(dt:number){
    for (const [entity] of engine.getEntitiesWith(LevelAssetGLTF)) {
        const loadingState = GltfContainerLoadingState.getOrNull(entity)
        console.log('loading state', entity, loadingState)
        if (!loadingState) return
        switch (loadingState.currentState) {
            case LoadingState.FINISHED_WITH_ERROR:
            case LoadingState.FINISHED:
                LevelAssetGLTF.deleteFrom(entity)
                levelAssetsLoaded++
                checkLevelLoaded(levelToLoad)
            break
    }
    }
}