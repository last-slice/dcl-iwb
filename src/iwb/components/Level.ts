import { Entity, GltfContainerLoadingState, LoadingState, engine } from "@dcl/sdk/ecs"
import { COMPONENT_TYPES, Triggers } from "../helpers/types"
import { createAsset, getEntity } from "./IWB"
import { enableEntityForPlayMode, enableSceneEntities, updatePlayModeReset } from "../modes/Play"
import { LevelAssetGLTF, PointersLoadedComponent } from "../helpers/Components"
import { getTriggerEvents, runGlobalTrigger, runSingleTrigger, updateTriggerEvents } from "./Triggers"
import { utils } from "../helpers/libraries"
import { displayLoadingScreen } from "../ui/Objects/GameStartUI"
import { handleMovePlayer } from "./Actions"
import { setPointersPlayMode } from "./Pointers"
import { updateTransform } from "./Transform"
import { Vector3 } from "@dcl/sdk/math"

let levelAssetsToLoad:number = 0
let levelAssetsLoaded:number = 0
let levelToLoad:Entity

export function levelListener(scene:any){
    scene[COMPONENT_TYPES.LEVEL_COMPONENT].onAdd(async(level:any, aid:any)=>{
        console.log('level addded', aid, level)
//
        // level.loadingSpawn.listen("x", (c:any, p:any)=>{
        //     if(p !== undefined){
        //         let transform:any = {
        //             p:{
        //                 x:c,
        //                 y:level.loadingSpawn.y,
        //                 z:level.loadingSpawn.z
        //             },
        //             r:Vector3.Zero(),
        //             s:Vector3.One()
        //         }
        //         updateTransform(scene, aid, transform)
        //     }
        // })
        // level.loadingSpawn.listen("y", (c:any, p:any)=>{
        //     if(p !== undefined){
        //         let transform:any = {
        //             p:{
        //                 x:level.loadingSpawn.x,
        //                 y:c,
        //                 z:level.loadingSpawn.z
        //             },
        //             r:Vector3.Zero(),
        //             s:Vector3.One()
        //         }
        //         updateTransform(scene, aid, transform)
        //     }
        // })
        // level.loadingSpawn.listen("z", (c:any, p:any)=>{
        //     if(p !== undefined){
        //         let transform:any = {
        //             p:{
        //                 x:level.loadingSpawn.x,
        //                 y:level.loadingSpawn.y,
        //                 z:c
        //             },
        //             r:Vector3.Zero(),
        //             s:Vector3.One()
        //         }
        //         updateTransform(scene, aid, transform)
        //     }
        // })
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

export function isGameAsset(scene:any, aid:string){
    return scene[COMPONENT_TYPES.GAME_ITEM_COMPONENT].get(aid)
}

export function loadLevelAssets(scene:any, info:any, action:any){
    console.log('loading level assets', info.aid, info.entity, action)
    // engine.addSystem(LevelAssetLoadingSystem)

    let levelParent = scene[COMPONENT_TYPES.PARENTING_COMPONENT].find(($:any)=> $.aid === info.aid)
    if(levelParent){
        let levelInfo = scene[COMPONENT_TYPES.LEVEL_COMPONENT].get(info.aid)

        levelToLoad = info.entity
        levelAssetsToLoad = levelParent.children.length

        levelParent.children.forEach(async (aid:string, i:number)=>{
            let itemInfo = scene[COMPONENT_TYPES.IWB_COMPONENT].get(aid)

            await createAsset(scene, itemInfo, true)
            PointersLoadedComponent.createOrReplace(itemInfo.entity, {init:false})
            enableEntityForPlayMode(scene, itemInfo)

            let triggerInfo = scene[COMPONENT_TYPES.TRIGGER_COMPONENT].get(itemInfo.aid)
            if(triggerInfo){
                updateTriggerEvents(scene, itemInfo, triggerInfo)
            }
            
            levelAssetsLoaded++
            // checkLevelLoaded(info.entity)
        })

        // checkLevelLoaded(info.entity)
        updatePlayModeReset(true)

        utils.timers.setTimeout(()=>{
            checkLevelLoaded(scene, levelInfo, info)
        }, levelInfo.loadingMin * 1000)
    }
}

export function unloadAllSceneGameAssets(scene:any){
    scene[COMPONENT_TYPES.PARENTING_COMPONENT].forEach((item:any, i:number)=>{
        if(i > 2){
            let entityInfo = getEntity(scene, item.aid)
            if(entityInfo){
                if(isLevelAsset(scene, item.aid) || isGameAsset(scene, item.aid)){
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

export function checkLevelLoaded(scene:any, levelInfo:any, entityInfo:any){
    console.log("checking level loaded", entityInfo.aid, entityInfo.entity, levelAssetsLoaded, levelAssetsToLoad)
    if(levelAssetsLoaded >= levelAssetsToLoad){
        console.log('level assets have all loaded')
        engine.removeSystem(LevelAssetLoadingSystem)

        displayLoadingScreen(false)

        let spawnLocation = {...levelInfo.loadingSpawn} //Vector3.add(sceneTransform, {...levelInfo.loadingSpawn})
        handleMovePlayer(scene, {...spawnLocation, ...{cx:levelInfo.loadingSpawnLook.x, cy:levelInfo.loadingSpawnLook.y, cz:levelInfo.loadingSpawnLook.z}})

        // runGlobalTrigger(scene, Triggers.ON_LEVEL_LOADED, {input:0, pointer:0, entity:0})
        runSingleTrigger(entityInfo, Triggers.ON_LEVEL_LOADED, {entity:entityInfo.entity, input:0, pointer:0})
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
                // checkLevelLoaded(levelToLoad)
            break
    }
    }
}