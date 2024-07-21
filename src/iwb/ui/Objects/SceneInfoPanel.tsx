import { Billboard, BillboardMode, Entity, GltfContainer, Material, MeshRenderer, Transform, VisibilityComponent, engine } from '@dcl/sdk/ecs'
import { Vector3, Color4 } from '@dcl/sdk/math'
import players from '@dcl/sdk/players'
import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
import { items } from '../../components/Catalog'
import { colyseusRoom, sendServerMessage } from '../../components/Colyseus'
import { localPlayer, localUserId, settings } from '../../components/Player'
import { formatDollarAmount, formatSize, log, paginateArray } from '../../helpers/functions'
import { SceneItem, NOTIFICATION_TYPES, SERVER_MESSAGE_TYPES, EDIT_MODES, COMPONENT_TYPES } from '../../helpers/types'
import { duplicateItem, duplicateItemInPlace, editItem, deleteSelectedItem, updateSelectedAssetId, selectedAssetId } from '../../modes/Build'
import { calculateImageDimensions, getImageAtlasMapping, sizeFont, calculateSquareImageDimensions, getAspect } from '../helpers'
import { uiSizes } from '../uiConfig'
import { showNotification } from './NotificationPanel'
import resources from '../../helpers/resources'
import { getView } from '../uiViews'
import { displaySkinnyVerticalPanel } from '../Reuse/SkinnyVerticalPanel'
import { getEntity } from '../../components/IWB'
import { setUIClicked } from '../ui'
import { displaySceneDetailsPanel } from './SceneMainDetailPanel'

export let visibleIndex = 1
export let visibleRows = 7
export let visibleItems: any[] = []
export let selectedRow = -1
export let localScene = false
export let sceneAssetSearchFilter:string = ""
export let showSceneInfoPanel = false
export let sceneInfoEntitySelector: Entity

let assetTypeIndex:number = 0

export function displaySceneAssetInfoPanel(value: boolean) {
    showSceneInfoPanel = value

    if (value) {
        deselectRow()
        assetTypeIndex = 0
        visibleIndex = 1
        visibleItems.length = 0
        if (!showSceneInfoPanel || !localPlayer || !localPlayer.activeScene) return null

        localScene = true//

        if(localPlayer.activeScene){
            let assets:any[] = []
            localPlayer.activeScene[COMPONENT_TYPES.PARENTING_COMPONENT].forEach((parentingInfo:any, i:number)=>{
                if(i > 2){
                    let itemInfo = localPlayer.activeScene[COMPONENT_TYPES.IWB_COMPONENT].get(parentingInfo.aid)
                    if(itemInfo){
                        assets.push({aid:parentingInfo.aid, id:itemInfo.id, name:localPlayer.activeScene[COMPONENT_TYPES.NAMES_COMPONENT].get(parentingInfo.aid).value})
                    }
                }
            })

            assets.sort((a, b) => a.name.localeCompare(b.name))
            visibleItems = paginateArray([...assets], visibleIndex, visibleRows)
    
            sceneInfoEntitySelector = engine.addEntity()
            VisibilityComponent.create(sceneInfoEntitySelector, {visible: false})
        }
    } else {
        localScene = false
        engine.removeEntity(sceneInfoEntitySelector)
    }
}

export function updateAssetSearchFilter(s:string){
    sceneAssetSearchFilter = s
    updateRows()
}

export function updateVisibleIndex(amt: number) {
    visibleIndex += amt
}

export function updateRows() {
    console.log('updating scene asset rows')
    let scene = localPlayer.activeScene
    if(scene){
        let assets:any[] = []
        scene[COMPONENT_TYPES.PARENTING_COMPONENT].forEach((parentingInfo:any, i:number)=>{
            if(i > 2){
                let itemInfo = scene[COMPONENT_TYPES.IWB_COMPONENT].get(parentingInfo.aid)
                if(itemInfo){
                    switch(assetTypeIndex){
                        //all
                        case 0:
                            assets.push({aid:parentingInfo.aid, id:itemInfo.id, name:scene[COMPONENT_TYPES.NAMES_COMPONENT].get(parentingInfo.aid).value})
                            break;

                            //gaming
                        case 1:
                            let gameAsset = scene[COMPONENT_TYPES.GAME_COMPONENT].get(parentingInfo.aid)
                            let levelAsset = scene[COMPONENT_TYPES.LEVEL_COMPONENT].get(parentingInfo.aid)
                            if(gameAsset || levelAsset){
                                assets.push({aid:parentingInfo.aid, id:itemInfo.id, name:scene[COMPONENT_TYPES.NAMES_COMPONENT].get(parentingInfo.aid).value})
                            }
                            break;

                            //triggers
                        case 2:
                            let triggerAsset = scene[COMPONENT_TYPES.TRIGGER_COMPONENT].get(parentingInfo.aid)
                            if(triggerAsset){
                                assets.push({aid:parentingInfo.aid, id:itemInfo.id, name:scene[COMPONENT_TYPES.NAMES_COMPONENT].get(parentingInfo.aid).value})
                            }
                            break;

                            //assets
                        case 3:
                            let actionAsset = scene[COMPONENT_TYPES.ACTION_COMPONENT].get(parentingInfo.aid)
                            if(actionAsset){
                                assets.push({aid:parentingInfo.aid, id:itemInfo.id, name:scene[COMPONENT_TYPES.NAMES_COMPONENT].get(parentingInfo.aid).value})
                            }
                            break;

                            //smart items
                        case 4:
                            // let actionAsset = scene[COMPONENT_TYPES.ACTION_COMPONENT].get(parentingInfo.aid)
                            // if(actionAsset){
                            //     assets.push({aid:parentingInfo.aid, id:itemInfo.id, name:scene[COMPONENT_TYPES.NAMES_COMPONENT].get(parentingInfo.aid).value})
                            // }
                            break;
                    }
                    
                }
            }
        })

        assets.sort((a, b) => a.name.localeCompare(b.name))

        if(sceneAssetSearchFilter !== ""){
            assets = assets.filter(item => item.name.toLowerCase().includes(sceneAssetSearchFilter.toLowerCase()))
        }

        visibleItems = paginateArray(assets, visibleIndex, visibleRows)
    }
}

export function selectRow(row: number, pointer?: boolean) {
    selectedRow = row
    updateSelectedAssetId(visibleItems[selectedRow].aid)

    let item = items.get(visibleItems[selectedRow].id)
    if (item) {
        let transform = localPlayer.activeScene[COMPONENT_TYPES.TRANSFORM_COMPONENT].get(selectedAssetId)
        if(transform){
            if (pointer) {
                GltfContainer.createOrReplace(sceneInfoEntitySelector, {
                    src: "assets/40e64954-b84f-40e1-ac58-438a39441c3e.glb"
                })
    
                Billboard.createOrReplace(sceneInfoEntitySelector, {billboardMode: BillboardMode.BM_Y})
    
                Transform.createOrReplace(sceneInfoEntitySelector, {
                    position: Vector3.create(transform.p.x, item.bb.z + 1.5, transform.p.z),
                    parent: localPlayer.activeScene?.parentEntity
                })
            } else {
                VisibilityComponent.getMutable(sceneInfoEntitySelector).visible = false
            }
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
    // const sceneItems = sceneBuilds.get(localPlayer.activeScene!.id)!.ass as SceneItem[]

    // sceneItems.forEach((sceneItem) => {
    //     let item = items.get(sceneItem.id)
    //     if (item) {

    //         const itemE = entitiesFromItemIds.get(sceneItem.aid)

    //         // create bounding box entity from item bb and current position\
    //         const bbE = engine.addEntity()
    //         Transform.createOrReplace(bbE, {
    //             //position: Vector3.One(),
    //             // position: {
    //             //     ...sceneItem.p,
    //             //     y: sceneItem.p.y + (item.bb.y /2)
    //             // },
    //             // rotation: Quaternion.fromEulerDegrees(
    //             //     sceneItem.r.x,
    //             //     sceneItem.r.y,
    //             //     sceneItem.r.z
    //             // ),
    //             scale: {
    //                 x: sceneItem.s.x * item.bb.x,
    //                 y: sceneItem.s.y * item.bb.y,
    //                 z: sceneItem.s.z * item.bb.z,
    //             },
    //             parent: itemE
    //         })

    //         MeshRenderer.setBox(bbE)
    //         Material.setPbrMaterial(bbE, {
    //             albedoColor: Color4.create(0, 0, 0, .2)
    //         })
    //     }
    // })
}

export function createSceneInfoPanel() {
    return (
        <UiEntity
            key={resources.slug + "scenespecificinfopanel"}
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
            onMouseDown={()=>{
                setUIClicked(true)
            }}
            onMouseUp={()=>{
                setUIClicked(false)
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
                // uiBackground={{color:Color4.Green()}}
            >

                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '55%',
                        height: '100%',
                    }}
                    // uiBackground={{color:Color4.Blue()}}
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

                    <UiEntity
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '45%',
                        height: '100%',
                    }}
                    // uiBackground={{color:Color4.Teal()}}
                    >            
                    
                    {/* scene info buttons */}
                        <UiEntity
                            uiTransform={{
                                flexDirection: 'column',
                                width: calculateSquareImageDimensions(3.5).width,
                                height: calculateSquareImageDimensions(3.5).height,
                                alignItems: 'center',
                                justifyContent: 'center',
                                display: localUserId && localPlayer && (localPlayer.homeWorld || localPlayer.worldPermissions) ? 'flex' : 'none',
                            }}
                            uiBackground={{
                                textureMode: 'stretch',
                                texture: {
                                    src: 'assets/atlas1.png'
                                },
                                uvs: getImageAtlasMapping(uiSizes.infoButtonTrans)
                            }}
                            onMouseDown={() => {
                                setUIClicked(true)
                                displaySceneAssetInfoPanel(false)
                                displaySceneDetailsPanel(true, localPlayer.activeScene)
        
                            }}
                            onMouseUp={()=>{
                                setUIClicked(false)
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
                                display: localUserId && localPlayer && localPlayer.homeWorld ? 'flex' : 'none',
                            }}
                            uiBackground={{
                                textureMode: 'stretch',
                                texture: {
                                    src: 'assets/atlas1.png'
                                },
                                uvs: getImageAtlasMapping(uiSizes.saveButton)
                            }}
                            onMouseDown={() => {
                                setUIClicked(true)
                                displaySceneAssetInfoPanel(false)
                                showNotification({
                                    type: NOTIFICATION_TYPES.MESSAGE,
                                    message: "Your download is pending. Please wait for a popup with the download link.",
                                    animate: {enabled: true, return: true, time: 10}
                                })
                                sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_DOWNLOAD, {sceneId: localPlayer.activeScene!.id})
                            }}
                            onMouseUp={()=>{
                                setUIClicked(false)
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
                                display: localUserId && localPlayer && localPlayer.canBuild ? 'flex' : 'none',
                            }}
                            uiBackground={{
                                textureMode: 'stretch',
                                texture: {
                                    src: 'assets/atlas1.png'
                                },
                                uvs: getImageAtlasMapping(uiSizes.trashButtonTrans)
                            }}
                            onMouseDown={() => {
                                setUIClicked(true)
                                displaySceneAssetInfoPanel(false)
                                displaySkinnyVerticalPanel(true, getView("Clear Scene"))
                            }}
                            onMouseUp={()=>{
                                setUIClicked(false)
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

                
            </UiEntity>

            {/* search filter row */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '80%',
                    height: '8%',
                }}
                // uiBackground={{color:Color4.Green()}}
            >
                 <UiEntity
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '50%',
                        height: '100%',
                        margin:{right:'1%'}
                    }}
                    > 

                    <Dropdown
                        options={["All Assets", "Gaming", "Triggers", "Actions",  "Smart Items", "Audio"]}
                        selectedIndex={assetTypeIndex}
                        onChange={selectAssetFilter}
                        uiTransform={{
                            width: '100%',
                            height: '100%',
                        }}
                        color={Color4.White()}
                        fontSize={sizeFont(20, 15)}
                    />
                    
                    </UiEntity>

                    <UiEntity
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '50%',
                        height: '100%',
                        margin:{left:'1%'}
                    }}
                    > 

                    <Input
                        onChange={(value) => {
                            updateAssetSearchFilter(value.trim())
                        }}
                        fontSize={sizeFont(20, 15)}
                        placeholder={'Search Assets'}
                        placeholderColor={Color4.White()}
                        uiTransform={{
                            width: '100%',
                            height: '100%',
                        }}
                        color={Color4.White()}
                    ></Input>
                    </UiEntity>
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
                        setUIClicked(true)
                        // VisibilityComponent.getMutable(sceneInfoEntitySelector).visible = false
                        displaySceneAssetInfoPanel(false)
                        deselectRow()
                        duplicateItem(selectedAssetId)
                    }}
                    onMouseUp={() => {
                        setUIClicked(false)
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
                        setUIClicked(true)
                        // VisibilityComponent.getMutable(sceneInfoEntitySelector).visible = false
                        displaySceneAssetInfoPanel(false)
                        deselectRow()
                        duplicateItemInPlace(selectedAssetId)
                    }}
                    onMouseUp={() => {
                        setUIClicked(true)
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
                        setUIClicked(true)
                        editItem(selectedAssetId, EDIT_MODES.EDIT)
                        deselectRow()
                    }}
                    onMouseUp={() => {
                        setUIClicked(true)
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
                        setUIClicked(true)
                        if(settings.confirms){
                            displaySkinnyVerticalPanel(true, getView("Confirm Delete Entity"), localPlayer.activeScene[COMPONENT_TYPES.NAMES_COMPONENT].get(selectedAssetId).value)
                        }else{
                            deleteSelectedItem(selectedAssetId)

                            updateSelectedAssetId(undefined)
                            
                            VisibilityComponent.getMutable(sceneInfoEntitySelector).visible = false
                            deselectRow()
                        }
                    }}
                    onMouseUp={() => {
                        setUIClicked(false)
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
                    setUIClicked(true)
                    displaySceneAssetInfoPanel(false)
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
            />


        </UiEntity>
    )
}

const SceneAssetList = () => {

    {/* Assets data columns */
    }
    return (
        <UiEntity
        key={resources.slug + "scene-asset-list-ui"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '80%',
                height: '90%',
            }}
        >

    {/* labels row */}
    <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '7%',
            display: 'flex'
        }}
    >
        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '40%',
                height: '100%',
                margin: {left: "2%"}
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{
                value: "Asset Name",
                fontSize: sizeFont(25, 15),
                textAlign: 'middle-left',
                color: Color4.White()
            }}

        />

        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{
                value: "Polys",
                fontSize: sizeFont(25, 15),
                textAlign: 'middle-center',
                color: Color4.White()
            }}

        />

        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{
                value: "Size",
                fontSize: sizeFont(25, 15),
                textAlign: 'middle-center',
                color: Color4.White()
            }}
        />


        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{
                value: "View",
                fontSize: sizeFont(25, 15),
                textAlign: 'middle-center',
                color: Color4.White()
            }}
        />

<UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{
                value: "Lock",
                fontSize: sizeFont(25, 15),
                textAlign: 'middle-center',
                color: Color4.White()
            }}
        />
{/* 
        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '10%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{
                value: "Del",
                fontSize: sizeFont(25, 20),
                textAlign: 'middle-center',
                color: Color4.White()
            }}
        /> */}

    </UiEntity>

    <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '86%',
            display: 'flex'
        }}
    >

        {generateSceneAssetRows()}
        </UiEntity>

       

    {/* totals row */}
    <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            alignContent:'flex-start',
            justifyContent: 'flex-start',
            width: '100%',
            height: '7%',
            display: 'flex',
            margin:{top:'5%'}
        }}
    >
        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '40%',
                height: '100%',
                margin: {left: "2%"}
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{
                value: "Totals: " + (localScene ? localPlayer.activeScene[COMPONENT_TYPES.PARENTING_COMPONENT].length - 3 : ""),
                fontSize: sizeFont(25, 15),
                textAlign: 'middle-left',
                color: Color4.White()
            }}
        />

        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '15%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{
                value: "" + (localScene ? formatDollarAmount(localPlayer.activeScene!.pc)  : ""),
                fontSize: sizeFont(25, 15),
                textAlign: 'middle-center',
                color: Color4.White()
            }}
        />

        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '15%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{
                value: "" + (localScene ? formatSize(localPlayer.activeScene?.si) + "MB" : ""),
                fontSize: sizeFont(25, 15),
                textAlign: 'middle-center',
                color: Color4.White()
            }}
        />


            {/* paginate buttons column */}
            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'center',
                width: '30%',
                height: '100%',
            }}
            >

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
                    // uiBackground={{color:Color4.White()}}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.leftArrowBlack)
                    }}
                    onMouseDown={() => {
                        setUIClicked(true)
                        if(visibleIndex -1 >= 1){
                            deselectRow()
                            updateVisibleIndex(-1)
                            updateRows()
                        }
                    }}
                    onMouseUp={()=>{
                        setUIClicked(false)
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
                        setUIClicked(true)
                        // pressed.Load = true
                        deselectRow()
                        updateVisibleIndex(1)
                        updateRows()
                    }}
                    onMouseUp={()=>{
                        setUIClicked(false)
                    }}
                />


            </UiEntity>

    </UiEntity>

        </UiEntity>
    )
}

export default SceneAssetList

function generateSceneAssetRows() {
    let arr: any[] = []
    if (!showSceneInfoPanel || !localPlayer || !localPlayer.activeScene) return null

    let count = 0
    visibleItems.forEach((asset: any, i: number) => {
        const curItem = items.get(asset.id)
        arr.push(<SceneAssetRow curItem={curItem} name={asset.name} aid={asset.aid} rowCount={count}/>)
        count++
    })
    return arr
}

function SceneAssetRow(data:any){
    let curItem = data.curItem
    let name = data.name
    let i = data.rowCount
    let aid = data.aid
    return(
    <UiEntity
    key={resources.slug + "scene-asset-row- " + i}
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '12%',
        display: 'flex',
        margin:{top:"1%", bottom:"1%"}
    }}
    uiBackground={{
        textureMode: 'stretch',
        texture: {
            src: 'assets/atlas2.png'
        },
        uvs:
        
        selectedRow === i ?

        getImageAtlasMapping(uiSizes.rowPillLightest)

        :
        
        i % 2 === 1 ? getImageAtlasMapping(uiSizes.rowPillLight)

            : 

            getImageAtlasMapping(uiSizes.rowPillDark)
    }}
    onMouseDown={() => {
        setUIClicked(true)
        let itemInfo = localPlayer.activeScene[COMPONENT_TYPES.IWB_COMPONENT].get(aid)
        if(itemInfo && !itemInfo.locked){
            if(selectedRow === i){
                deselectRow()
            }else{
                selectRow(i, true)
                VisibilityComponent.getMutable(sceneInfoEntitySelector).visible = true
            }
        }
    }}
    onMouseUp={()=>{
        setUIClicked(false)
    }}
    >
    <UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            width: '50%',
            height: '100%',
            margin: {left: "2%"}
        }}
        // uiBackground={{color:Color4.Green()}}
        uiText={{
            value: curItem ? name.length > 15 ?  name.substring(0,15) + "..." : name : "Name not found",
            fontSize: sizeFont(20, 15),
            textAlign: 'middle-left',
            color: Color4.White()
        }}

    />

<UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '15%',
            height: '100%',
        }}
        // uiBackground={{color:Color4.Green()}}//
        uiText={{
            value: curItem?.pc ? formatDollarAmount(curItem?.pc) : "0",
            fontSize: sizeFont(20, 15),
            textAlign: "middle-left",
            color: Color4.White()
        }}
    />

<UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '15%',
            height: '100%',
        }}
        // uiBackground={{color:Color4.Green()}}
        uiText={{
            value: curItem?.si ? formatSize(curItem?.si) + "MB" : "",
            fontSize: sizeFont(20, 15),
            textAlign: "middle-left",
            color: Color4.White()
        }}
    />

    <UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '15%',
            height: '100%',
        }}
    >
                <UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            width: calculateSquareImageDimensions(3.5).width,
            height: calculateSquareImageDimensions(3.5).height,
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas1.png'
            },
            uvs: getVis(aid)
        }}
        onMouseDown={()=>{
            setUIClicked(true)
            sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, {component:COMPONENT_TYPES.IWB_COMPONENT, sceneId:localPlayer.activeScene.id, aid:aid, buildVis: !localPlayer.activeScene[COMPONENT_TYPES.IWB_COMPONENT].get(aid).buildVis})
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
    />

    </UiEntity>

    <UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '15%',
            height: '100%',
        }}
    >
                <UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            width: calculateSquareImageDimensions(3.5).width,
            height: calculateSquareImageDimensions(3.5).height,
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getLocked(aid)
        }}
        onMouseDown={()=>{
            setUIClicked(true)
            sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, {component:COMPONENT_TYPES.IWB_COMPONENT, sceneId:localPlayer.activeScene.id, aid:selectedAssetId, locked: !localPlayer.activeScene[COMPONENT_TYPES.IWB_COMPONENT].get(aid).locked})
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
    />
    </UiEntity>

{/* <UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            width: '10%',
            height: '100%',
        }}
    >
        <UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            width: calculateSquareImageDimensions(3.5).width,
            height: calculateSquareImageDimensions(3.5).height,
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas1.png'
            },
            uvs: getImageAtlasMapping(uiSizes.trashButtonTrans)
        }}
        onMouseDown={()=>{
            const e = entitiesFromItemIds.get(aid)
            if (e){
                selectRow(i)
                sendServerDelete(selectedEntity as Entity)
                VisibilityComponent.getMutable(sceneInfoEntitySelector).visible = false
                deselectRow()
            }else{
                log('no item to edit', aid)
            }
        }}
    />

    </UiEntity> */}

</UiEntity>
    )
}

function getVis(aid:string){
    let scene = colyseusRoom.state.scenes.get(localPlayer.activeScene.id)
    let entityInfo = getEntity(scene, aid)
    if(entityInfo){
        let itemInfo = scene[COMPONENT_TYPES.IWB_COMPONENT].get(entityInfo.aid)
        if(itemInfo && itemInfo.buildVis){ 
            return getImageAtlasMapping(uiSizes.eyeTrans)
        }
        return getImageAtlasMapping(uiSizes.eyeClosed)
    }
    return getImageAtlasMapping(uiSizes.eyeTrans)
}

function getLocked(aid:string){
    let scene = colyseusRoom.state.scenes.get(localPlayer.activeScene.id)
    let entityInfo = getEntity(scene, aid)
    if(entityInfo){
        let itemInfo = scene[COMPONENT_TYPES.IWB_COMPONENT].get(entityInfo.aid)
        if(itemInfo && itemInfo.locked){ 
            return  getImageAtlasMapping(uiSizes.lockedIcon)
        }
        return getImageAtlasMapping(uiSizes.unlockedIcon)
    }
    return getImageAtlasMapping(uiSizes.unlockedIcon)
}

function selectAssetFilter(index:number){
    assetTypeIndex = index
    updateRows()
}