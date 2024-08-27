import { Entity, GltfContainerLoadingState, LoadingState, engine } from "@dcl/sdk/ecs"
import { Actions, COMPONENT_TYPES, Triggers } from "../helpers/types"
import { createAsset, getEntity } from "./IWB"
import { LevelAssetGLTF } from "../helpers/Components"
import { actionQueue, getTriggerEvents, runGlobalTrigger, runSingleTrigger, updateTriggerEvents } from "./Triggers"
import { utils } from "../helpers/libraries"
import { displayLoadingScreen } from "../ui/Objects/GameStartUI"
import { disableGameAsset } from "./Game"
import { updateAssetBuildVisibility } from "./Visibility"
import { setUIClicked } from "../ui/ui"

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
            enableLevelAsset(scene, itemInfo)

            // await createAsset(scene, itemInfo, true)
            // PointersLoadedComponent.createOrReplace(itemInfo.entity, {init:false})
            // enableEntityForPlayMode(scene, itemInfo)

            // let triggerInfo = scene[COMPONENT_TYPES.TRIGGER_COMPONENT].get(itemInfo.aid)
            // if(triggerInfo){
            //     updateTriggerEvents(scene, itemInfo, triggerInfo)
            // }
            
            levelAssetsLoaded++
            // checkLevelLoaded(info.entity)
        })

        // checkLevelLoaded(info.entity)

        utils.timers.setTimeout(()=>{
            checkLevelLoaded(scene, levelInfo, info)
        }, levelInfo.loadingMin * 1000)
    }
}

export function enableLevelAsset(scene:any, entityInfo:any){
    updateAssetBuildVisibility(scene, true, entityInfo)
    //update anything else for level asset
}

export function disableLevelAssets(scene:any){
    if(scene){
        scene[COMPONENT_TYPES.PARENTING_COMPONENT].forEach((item:any, i:number)=>{
            if(i > 2){
                let entityInfo = getEntity(scene, item.aid)
                if(entityInfo){
                    // if(isLevelAsset(scene, item.aid) || isGameAsset(scene, item.aid)){
                    //     engine.removeEntity(entityInfo.entity)
                    // }
    
                    disableGameAsset(scene, entityInfo)
                }
            }
        })
        levelAssetsLoaded = 0
        levelAssetsToLoad = 0
        levelToLoad = -500 as Entity
    }
}

export function checkLevelLoaded(scene:any, levelInfo:any, entityInfo:any){
    console.log("checking level loaded", entityInfo.aid, entityInfo.entity, levelAssetsLoaded, levelAssetsToLoad)
    if(levelAssetsLoaded >= levelAssetsToLoad){
        console.log('level assets have all loaded')
        engine.removeSystem(LevelAssetLoadingSystem)//

        displayLoadingScreen(false)

        // let spawnLocation = {...levelInfo.loadingSpawn} //Vector3.add(sceneTransform, {...levelInfo.loadingSpawn})
        // handleMovePlayer(scene, {...spawnLocation, ...{cx:levelInfo.loadingSpawnLook.x, cy:levelInfo.loadingSpawnLook.y, cz:levelInfo.loadingSpawnLook.z}})

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

export function attemptLoadLevel(scene:any, levelCounterAid:string, levelAid:string){
    let entityInfo = getEntity(scene, levelAid)
    if(!entityInfo){
        //todo
        //end game//
        return
    }

    console.log('attempting loading level', levelAid)

    let actionInfo = scene[COMPONENT_TYPES.ACTION_COMPONENT].get(levelAid)
    if(actionInfo){
        if(actionInfo.actions && actionInfo.actions.length > 0){
            let action = actionInfo.actions.find(($:any)=> $.type === Actions.LOAD_LEVEL)
            if(action){
                console.log("found load level action for level")
                let counterActions = scene[COMPONENT_TYPES.ACTION_COMPONENT].get(levelCounterAid)
                console.log('level counter actions are ', counterActions)
                if(counterActions){
                    let setEnableLevelAction = actionInfo.actions.find(($:any)=> $.type === Actions.SET_STATE && $.state === 'enabled')
                    if(setEnableLevelAction){
                        console.log('found set state level action')
                        let advanceLevelAction = counterActions.actions.find(($:any)=> $.type === Actions.ADD_NUMBER)
                        if(advanceLevelAction){
                            console.log('found add level action to counter')
                            let counterInfo = getEntity(scene, levelCounterAid)
                            actionQueue.push({aid:levelAid, action:setEnableLevelAction, entity:entityInfo.entity, force:true})
                            actionQueue.push({aid:levelCounterAid, action:advanceLevelAction, entity:counterInfo.entity, force:true})
                            actionQueue.push({aid:levelAid, action:action, entity:entityInfo.entity, force:true})
                            setUIClicked(false)
                        }
                    }
                }
            }
        }
    } 
}