import ReactEcs, {Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps} from '@dcl/sdk/react-ecs'
import {Color4, Vector3} from '@dcl/sdk/math'
import {calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont} from '../helpers'
import {uiSizes} from '../uiConfig'
import {localPlayer, localUserId, players} from '../../components/player/player'
import SceneAssetList from "./scenes/SceneAssetsList.ui";
import { showCatalogInfoPanel } from './CatalogInfoPanel'
import { log, paginateArray } from '../../helpers/functions'
import { Entity, MeshRenderer, Transform, VisibilityComponent, engine } from '@dcl/sdk/ecs'
import { items } from '../../components/catalog'
import { editItem, sendServerDelete } from '../../components/modes/build'
import { entitiesFromItemIds, sceneBuilds } from '../../components/scenes'
import { displaySceneInfoPanel, displaySceneSetting } from './builds/buildsIndex'
import { sendServerMessage } from '../../components/messaging'
import { EDIT_MODES, NOTIFICATION_TYPES, SERVER_MESSAGE_TYPES } from '../../helpers/types'
import { showNotification } from './notificationUI'

export let showSceneInfoPanel = false

export let sceneInfoEntitySelector:Entity

export function displaySceneAssetInfoPanel(value: boolean) {
    showSceneInfoPanel = value

    if(value){
        visibleIndex = 1
        visibleItems.length = 0
        if (!showSceneInfoPanel || !localPlayer || !localPlayer.activeScene) return null

        localScene = true
        visibleItems = paginateArray([...sceneBuilds.get(localPlayer.activeScene!.id).ass], visibleIndex, visibleRows)

        sceneInfoEntitySelector = engine.addEntity()
        MeshRenderer.setBox(sceneInfoEntitySelector)
        VisibilityComponent.create(sceneInfoEntitySelector, {visible:false})
    }else{
        localScene = false
        engine.removeEntity(sceneInfoEntitySelector)
    }
}

export let visibleIndex = 1
export let visibleRows = 10
export let visibleItems:any[] = []
export let selectedRow = -1
export let selectedEntity:number = -1
export let localScene = false

export function selectRow(row:number){
    selectedRow = row
    log('item selected is', visibleItems[selectedRow])

    let item = items.get(visibleItems[selectedRow].id)
    if(item){
        log('scene is', localPlayer.activeScene)
        selectedEntity = entitiesFromItemIds.get(visibleItems[selectedRow].aid)!

        Transform.createOrReplace(sceneInfoEntitySelector, {
            position: Vector3.create(visibleItems[selectedRow].p.x, item.bb.z + 1.5, visibleItems[selectedRow].p.z),
            parent: localPlayer.activeScene?.parentEntity
        })
        VisibilityComponent.getMutable(sceneInfoEntitySelector).visible = true
    }
}

export function deselectRow(){
    selectedRow = -1
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
                    margin:{top:"5%"}
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
                    color: Color4.Black()
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
                alignContent:'flex-start',
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
                uvs: getImageAtlasMapping(uiSizes.infoButtonBlack)
            }}
            onMouseDown={()=>{
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
                margin:{left:'2%'},
                display: localUserId && players.get(localUserId) && players.get(localUserId)?.homeWorld ? 'flex' : 'none',
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas1.png'
                },
                uvs: getImageAtlasMapping(uiSizes.saveButton)
            }}
            onMouseDown={()=>{
                displaySceneAssetInfoPanel(false)
                showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Your download is pending. Please wait for a popup with the download link.", animate:{enabled:true, return:true, time:10}})
                sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_DOWNLOAD, {sceneId: localPlayer.activeScene!.id})
            }}
            />

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
            <SceneAssetList />

            </UiEntity>

            {/* buttons row */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    width: '80%',
                    height: '10%',
                }}
                // uiBackground={{color:Color4.Black()}}
            >

                {/* edit button */}
                <UiEntity
                    uiTransform={{
                        display: selectedRow !== -1 ? 'flex' : 'none',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(6, getAspect(uiSizes.rectangleButton)).width,
                        height: calculateImageDimensions(12, getAspect(uiSizes.rectangleButton)).height,
                        margin: {right: "1%"},
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.positiveButton)
                    }}
                    onMouseDown={() => {
                        // pressed.Save = true
                    }}
                    onMouseUp={() => {
                        // pressed.Save = false
                        editItem(selectedEntity as Entity, EDIT_MODES.EDIT)
                    }}
                    uiText={{value: "Edit", color: Color4.Black(), fontSize: sizeFont(30, 20)}}
                />

                {/* delete button */}
                <UiEntity
                    uiTransform={{
                        display: selectedRow !== -1 ? 'flex' : 'none',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(6, getAspect(uiSizes.rectangleButton)).width,
                        height: calculateImageDimensions(12, getAspect(uiSizes.rectangleButton)).height,
                        margin: {right: "1%"},
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.dangerButton)
                    }}
                    onMouseDown={() => {
                        // pressed.Load = true

                    }}
                    onMouseUp={() => {
                        // pressed.Load = false
                        sendServerDelete(selectedEntity as Entity)
                        VisibilityComponent.getMutable(sceneInfoEntitySelector).visible = false
                        deselectRow()
                    }}
                    uiText={{value: "Delete", color: Color4.Black(), fontSize: sizeFont(30, 20)}}
                />
                {/* scroll up button */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(2, getAspect(uiSizes.leftArrowBlack)).width,
                        height: calculateImageDimensions(2, getAspect(uiSizes.leftArrowBlack)).height,
                        margin: {left: "5%"},
                    }}
                    // uiBackground={{color:Color4.Black()}}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.leftArrowBlack)
                    }}
                    onMouseDown={() => {
                        log('here')
                        // pressed.Load = true
                        if(visibleIndex -1 >= 1){
                            deselectRow()
                            visibleIndex--
                            log('visible index is now ', visibleIndex)
                            visibleItems = paginateArray([...sceneBuilds.get(localPlayer.activeScene!.id).ass], visibleIndex, visibleRows)
                        }
                    }}
                />


                {/* scroll down button */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(2, getAspect(uiSizes.rightArrowBlack)).width,
                        height: calculateImageDimensions(2, getAspect(uiSizes.rightArrowBlack)).height,
                        margin: {right: "1%"},
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.rightArrowBlack)
                    }}
                    onMouseDown={() => {
                        // pressed.Load = true
                        deselectRow()
                        visibleIndex++
                        visibleItems = paginateArray([...sceneBuilds.get(localPlayer.activeScene!.id).ass], visibleIndex, visibleRows)
                    }}

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
                        positionType:'absolute',
                        position: {right: '10%', top:"7%"},

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
