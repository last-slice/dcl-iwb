import ReactEcs, {UiEntity} from '@dcl/sdk/react-ecs'
import {Color4, Vector3} from '@dcl/sdk/math'
import {
    calculateImageDimensions,
    calculateSquareImageDimensions,
    getAspect,
    getImageAtlasMapping,
    sizeFont
} from '../helpers'
import {uiSizes} from '../uiConfig'
import {localPlayer, localUserId, players, settings} from '../../components/player/player'
import SceneAssetList from "./scenes/SceneAssetsList.ui";
import {paginateArray} from '../../helpers/functions'
import {
    Billboard,
    BillboardMode,
    engine,
    Entity,
    GltfContainer,
    Material,
    MeshRenderer,
    Transform,
    VisibilityComponent
} from '@dcl/sdk/ecs'
import {items} from '../../components/catalog'
import {deleteSelectedItem, duplicateItem, duplicateItemInPlace, editItem} from '../../components/modes/build'
import {entitiesFromItemIds, sceneBuilds} from '../../components/scenes'
import {displaySceneInfoPanel, displaySceneSetting} from './builds/buildsIndex'
import {sendServerMessage} from '../../components/messaging'
import {EDIT_MODES, NOTIFICATION_TYPES, SceneItem, SERVER_MESSAGE_TYPES} from '../../helpers/types'
import {showNotification} from './notificationUI'
import {displayClearScenePanel} from './clearScenePanel'
import { displayConfirmDeletePanel } from './confirmDeleteItemPanel'

export let showSceneInfoPanel = false

export let sceneInfoEntitySelector: Entity

export function displaySceneAssetInfoPanel(value: boolean) {
    showSceneInfoPanel = value

    if (value) {
        deselectRow()
        visibleIndex = 1
        visibleItems.length = 0
        if (!showSceneInfoPanel || !localPlayer || !localPlayer.activeScene) return null

        localScene = true
        visibleItems = paginateArray([...sceneBuilds.get(localPlayer.activeScene!.id).ass], visibleIndex, visibleRows)

        sceneInfoEntitySelector = engine.addEntity()
        VisibilityComponent.create(sceneInfoEntitySelector, {visible: false})
    } else {
        localScene = false
        engine.removeEntity(sceneInfoEntitySelector)
    }
}

export let visibleIndex = 1
export let visibleRows = 6
export let visibleItems: any[] = []
export let selectedRow = -1
export let selectedEntity: number = -1
export let localScene = false

export function updateVisibleIndex(amt: number) {
    visibleIndex += amt
}

export function updateRows() {
    visibleItems = paginateArray([...sceneBuilds.get(localPlayer.activeScene!.id).ass], visibleIndex, visibleRows)
}

export function selectRow(row: number, pointer?: boolean) {
    selectedRow = row
    // log('item selected is', visibleItems[selectedRow])

    let item = items.get(visibleItems[selectedRow].id)
    if (item) {
        // log('scene is', localPlayer.activeScene)
        selectedEntity = entitiesFromItemIds.get(visibleItems[selectedRow].aid)!

        if (pointer) {
            GltfContainer.createOrReplace(sceneInfoEntitySelector, {
                src: "assets/40e64954-b84f-40e1-ac58-438a39441c3e.glb"
            })

            Billboard.createOrReplace(sceneInfoEntitySelector, {billboardMode: BillboardMode.BM_Y})

            Transform.createOrReplace(sceneInfoEntitySelector, {
                position: Vector3.create(visibleItems[selectedRow].p.x, item.bb.z + 1.5, visibleItems[selectedRow].p.z),
                parent: localPlayer.activeScene?.parentEntity
            })
        } else {
            VisibilityComponent.getMutable(sceneInfoEntitySelector).visible = false
        }
    }
}

export function deselectRow() {
    selectedRow = -1
    let vis = VisibilityComponent.getMutableOrNull(sceneInfoEntitySelector)
    if (vis) {
        vis.visible = false
    }

}

function showBBForAllItems() {
    const sceneItems = sceneBuilds.get(localPlayer.activeScene!.id)!.ass as SceneItem[]

    sceneItems.forEach((sceneItem) => {
        let item = items.get(sceneItem.id)
        if (item) {

            const itemE = entitiesFromItemIds.get(sceneItem.aid)

            // create bounding box entity from item bb and current position\
            const bbE = engine.addEntity()
            Transform.createOrReplace(bbE, {
                //position: Vector3.One(),
                // position: {
                //     ...sceneItem.p,
                //     y: sceneItem.p.y + (item.bb.y /2)
                // },
                // rotation: Quaternion.fromEulerDegrees(
                //     sceneItem.r.x,
                //     sceneItem.r.y,
                //     sceneItem.r.z
                // ),
                scale: {
                    x: sceneItem.s.x * item.bb.x,
                    y: sceneItem.s.y * item.bb.y,
                    z: sceneItem.s.z * item.bb.z,
                },
                parent: itemE
            })

            MeshRenderer.setBox(bbE)
            Material.setPbrMaterial(bbE, {
                albedoColor: Color4.create(0, 0, 0, .2)
            })
        }
    })
}

export function createSceneInfoPanel() {
    return (
        <UiEntity
            key={"scenespecificinfopanel"}
            uiTransform={{
                display: showSceneInfoPanel ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: calculateImageDimensions(30, 345 / 511).width,
                height: calculateImageDimensions(25, 345 / 511).height,
                positionType: 'absolute',
                position: {right: '2%', bottom: '1%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.vertRectangle)
            }}
        >

            {/* scene title row */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '80%',
                    height: '10%',
                    margin: {top: "5%"}
                }}
            >

                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                    }}
                    uiText={{
                        value: localPlayer?.activeScene?.n || "",
                        fontSize: sizeFont(35, 25),
                        textAlign: 'middle-left',
                        color: Color4.White()
                    }}
                />
            </UiEntity>


            {/* scene info buttons */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    width: '80%',
                    height: '5%',
                    alignItems: 'flex-start',
                    alignContent: 'flex-start',
                    justifyContent: 'flex-start',
                }}
            >


                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        width: calculateSquareImageDimensions(3.5).width,
                        height: calculateSquareImageDimensions(3.5).height,
                        alignItems: 'center',
                        justifyContent: 'center',
                        display: localUserId && players.get(localUserId) && players.get(localUserId)?.homeWorld ? 'flex' : 'none',
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas1.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.infoButtonTrans)
                    }}
                    onMouseDown={() => {
                        displaySceneAssetInfoPanel(false)
                        displaySceneSetting("Info")
                        displaySceneInfoPanel(true, sceneBuilds.get(localPlayer.activeScene!.id))
                    }}
                />

                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        width: calculateSquareImageDimensions(3.5).width,
                        height: calculateSquareImageDimensions(3.5).height,
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: {left: '2%'},
                        display: localUserId && players.get(localUserId) && players.get(localUserId)?.homeWorld ? 'flex' : 'none',
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas1.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.saveButton)
                    }}
                    onMouseDown={() => {
                        displaySceneAssetInfoPanel(false)
                        showNotification({
                            type: NOTIFICATION_TYPES.MESSAGE,
                            message: "Your download is pending. Please wait for a popup with the download link.",
                            animate: {enabled: true, return: true, time: 10}
                        })
                        sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_DOWNLOAD, {sceneId: localPlayer.activeScene!.id})
                    }}
                />

                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        width: calculateSquareImageDimensions(3.5).width,
                        height: calculateSquareImageDimensions(3.5).height,
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: {left: '2%'},
                        display: localUserId && players.get(localUserId) && players.get(localUserId)?.canBuild ? 'flex' : 'none',
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas1.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.trashButtonTrans)
                    }}
                    onMouseDown={() => {
                        displaySceneAssetInfoPanel(false)
                        displayClearScenePanel(true)
                    }}
                />

                {/* do not delete*/}
                {/*<UiEntity*/}
                {/*    uiTransform={{*/}
                {/*        flexDirection: 'column',*/}
                {/*        width: calculateSquareImageDimensions(3.5).width,*/}
                {/*        height: calculateSquareImageDimensions(3.5).height,*/}
                {/*        alignItems: 'center',*/}
                {/*        justifyContent: 'center',*/}
                {/*        margin: {left: '2%'},*/}
                {/*        display: localUserId && players.get(localUserId) && players.get(localUserId)?.canBuild ? 'flex' : 'none',*/}
                {/*    }}*/}
                {/*    uiBackground={{*/}
                {/*        textureMode: 'stretch',*/}
                {/*        texture: {*/}
                {/*            src: 'assets/atlas1.png'*/}
                {/*        },*/}
                {/*        uvs: getImageAtlasMapping(uiSizes.inspectorButtonTrans)*/}
                {/*    }}*/}
                {/*    onMouseDown={() => {*/}
                {/*        showBBForAllItems()*/}
                {/*    }}*/}
                {/*/>*/}


            </UiEntity>

            {/* data container */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '60%',
                }}
            >

                {/* Assets data */}
                <SceneAssetList/>

            </UiEntity>

            {/* buttons row */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '80%',
                    height: '10%',
                }}
                // uiBackground={{color:Color4.White()}}
            >

                {/* duplicate button */}
                <UiEntity
                    uiTransform={{
                        display: selectedRow !== -1 ? 'flex' : 'none',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(5.5, getAspect(uiSizes.buttonPillBlack)).width,
                        height: calculateImageDimensions(5.5, getAspect(uiSizes.buttonPillBlack)).height,
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                    }}
                    onMouseDown={() => {
                    }}
                    onMouseUp={() => {
                        // VisibilityComponent.getMutable(sceneInfoEntitySelector).visible = false
                        displaySceneAssetInfoPanel(false)
                        deselectRow()
                        duplicateItem(selectedEntity as Entity)
                    }}
                    uiText={{value: "Copy", color: Color4.White(), fontSize: sizeFont(30, 15)}}
                />

                {/* duplicate in place button */}
                <UiEntity
                    uiTransform={{
                        display: selectedRow !== -1 ? 'flex' : 'none',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(5.5, getAspect(uiSizes.buttonPillBlack)).width,
                        height: calculateImageDimensions(5.5, getAspect(uiSizes.buttonPillBlack)).height,
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                    }}
                    onMouseDown={() => {
                    }}
                    onMouseUp={() => {
                        // VisibilityComponent.getMutable(sceneInfoEntitySelector).visible = false
                        displaySceneAssetInfoPanel(false)
                        deselectRow()
                        duplicateItemInPlace(selectedEntity as Entity)
                    }}
                    uiText={{value: "Copy Place", color: Color4.White(), fontSize: sizeFont(30, 15)}}
                />


                {/* edit button */}
                <UiEntity
                    uiTransform={{
                        display: selectedRow !== -1 ? 'flex' : 'none',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(5.5, getAspect(uiSizes.buttonPillBlack)).width,
                        height: calculateImageDimensions(5.5, getAspect(uiSizes.buttonPillBlack)).height,
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                    }}
                    onMouseDown={() => {
                        // pressed.Save = true
                    }}
                    onMouseUp={() => {
                        // pressed.Save = false
                        editItem(selectedEntity as Entity, EDIT_MODES.EDIT)
                        deselectRow()
                    }}
                    uiText={{value: "Edit", color: Color4.White(), fontSize: sizeFont(30, 15)}}
                />

                {/* delete button */}
                <UiEntity
                    uiTransform={{
                        display: selectedRow !== -1 ? 'flex' : 'none',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(5.5, getAspect(uiSizes.buttonPillBlack)).width,
                        height: calculateImageDimensions(5.5, getAspect(uiSizes.buttonPillBlack)).height,
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                    }}
                    onMouseDown={() => {
                    }}
                    onMouseUp={() => {
                        if(settings.confirms){
                            displayConfirmDeletePanel(true, selectedEntity as Entity)
                        }else{
                            deleteSelectedItem(selectedEntity as Entity)
                            VisibilityComponent.getMutable(sceneInfoEntitySelector).visible = false
                            deselectRow()
                        }

                    }}
                    uiText={{value: "Delete", color: Color4.White(), fontSize: sizeFont(30, 15)}}
                />

            </UiEntity>

            {/* close button */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateImageDimensions(1.5, getAspect(uiSizes.xButtonBlack)).width,
                    height: calculateImageDimensions(1.5, getAspect(uiSizes.xButtonBlack)).height,
                    positionType: 'absolute',
                    position: {right: '10%', top: "7%"},

                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.xButtonBlack)
                }}
                onMouseDown={() => {
                    displaySceneAssetInfoPanel(false)
                }}
            />


        </UiEntity>
    )
}
