
async function disableSceneEntities(sceneId: string) {
    // if (!disabledEntities) {
    //     // for(let i = 0; i < playModeCheckedAssets.length; i++){
    //     //     let entity = playModeCheckedAssets.shift()
    //     //     disableEntityForPlayMode(sceneId, entity)
    //     // }
    //     // console.log('disabling scene entities for scene', sceneId)

    //     let scene = sceneBuilds.get(sceneId)
    //     if (scene) {
    //         for (let i = 0; i < scene.entities.length; i++) {
    //             let entity = scene.entities[i]

    //             //check 3d
    //             if (GLTFLoadedComponent.has(entity)) {
    //                 GLTFLoadedComponent.getMutable(entity).init = false
    //             }

    //             //check video
    //             if (VideoLoadedComponent.has(entity)) {
    //                 VideoLoadedComponent.getMutable(entity).init = false
    //             }

    //             //check audio
    //             if (AudioLoadedComponent.has(entity)) {
    //                 AudioLoadedComponent.getMutable(entity).init = false
    //             }

    //             //check pointers
    //             if (PointersLoadedComponent.has(entity)) {
    //                 PointersLoadedComponent.getMutable(entity).init = false
    //             }

    //             //check smart items
    //             if (SmartItemLoadedComponent.has(entity)) {
    //                 SmartItemLoadedComponent.getMutable(entity).init = false
    //             }

    //             disableEntityForPlayMode(scene.id, entity)
    //         }
    //         disableDelayedActionTimers()
    //         disablePlayUI()
    //     }
    //     disabledEntities = true
    // }
}

function enableSceneEntities(sceneId: string) {
    // log('enable scene entities for play mode')
    // let scene = sceneBuilds.get(sceneId)
    // if (scene) {
    //     findSceneEntryTrigger(scene)
        
    //     for (let i = 0; i < scene.entities.length; i++) {
    //         let entity = scene.entities[i]//

    //         let sceneItem = getSceneItem(scene, entity)
    //         if (sceneItem) {
    //             //check 3d
    //             if (GLTFLoadedComponent.has(entity) && !GLTFLoadedComponent.get(entity).init) {
    //                 checkAnimation(entity, sceneItem)
    //                 check3DCollision(entity, sceneItem)

    //                 GLTFLoadedComponent.getMutable(entity).init = true
    //             }

    //             //check video
    //             if (VideoLoadedComponent.has(entity) && !VideoLoadedComponent.get(entity).init) {
    //                 checkVideo(entity, sceneItem)
    //                 check2DCollision(entity, sceneItem)
    //                 VideoLoadedComponent.getMutable(entity).init = true
    //             }

    //             //check audio
    //             if (AudioLoadedComponent.has(entity) && !AudioLoadedComponent.get(entity).init) {
    //                 checkAudio(entity, sceneItem)
    //                 AudioLoadedComponent.getMutable(entity).init = true
    //             }

    //             playModeCheckedAssets.push(entity)
    //             // resetEntityForPlayMode(scene, entity)

    //             //check pointers
    //             VisibilityComponent.has(entity) && VisibilityComponent.createOrReplace(entity, {
    //                 visible: sceneItem.visComp.visible
    //             })

    //             // check2DCollision(entity, sceneItem)//

    //             //check smart items
    //             console.log('about to check smart items for play mod')
    //             if (SmartItemLoadedComponent.has(entity) && !SmartItemLoadedComponent.get(entity).init) {
    //                 console.log('need to check for smart item play mode')
    //                 checkSmartItem(entity, sceneItem, scene)
    //                 SmartItemLoadedComponent.getMutable(entity).init = true
    //             }

    //             if (PointersLoadedComponent.has(entity) && !PointersLoadedComponent.get(entity).init) {
    //                 checkPointers(entity, sceneItem)
    //                 PointersLoadedComponent.getMutable(entity).init = true
    //             }

    //         }
    //     }
    //     disabledEntities = false
    // }
}