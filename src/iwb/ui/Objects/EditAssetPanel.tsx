import ReactEcs, {Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Dropdown} from '@dcl/sdk/react-ecs'
import resources from '../../helpers/resources'
import { localPlayer, settings } from '../../components/Player'
import { EDIT_MODES, COMPONENT_TYPES, SERVER_MESSAGE_TYPES, Actions } from '../../helpers/types'
import { selectedItem, saveItem, deleteSelectedItem, cancelEditingItem, updateSelectedAssetId, selectedAssetId, disableTweenPlacementEntity, resetAdditionalAssetFeatures, addAllBuildModePointers, sceneEdit } from '../../modes/Build'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'
import { displaySkinnyVerticalPanel } from '../Reuse/SkinnyVerticalPanel'
import { getView } from '../uiViews'
import { items } from '../../components/Catalog'
import { colyseusRoom, sendServerMessage } from '../../components/Colyseus'
import { Color4 } from '@dcl/sdk/math'
import { setUIClicked } from '../ui'
import { EditTransform } from './Edit/EditTransform'
import { EditVisibility } from './Edit/EditVisibility'
import { EditName } from './Edit/EditName'
// import { EditAudio, updateAudioComponent } from './Edit/EditAudio'
import { EditText } from './Edit/EditText'
import { EditNftShape } from './Edit/EditNftShape'
import { EditGltf } from './Edit/EditGltf'
import { EditVideo } from './Edit/EditVideo'
import { EditMeshCollider } from './Edit/EditMeshCollider'
import { EditMeshRender } from './Edit/EditMeshRender'
import { EditMaterial, materialView, updateMaterialComponent } from './Edit/EditMaterial'
import { EditTexture } from './Edit/EditTexture'
import { EditParenting, updateChildrenAssets } from './Edit/EditParenting'
import { EditCounter } from './Edit/EditCounter'
import { EditTrigger, enableTriggerEdit, resetTriggerPanels, triggerInfoView, triggerView, updateTriggerInfoView, updateTriggerView } from './Edit/EditTrigger'
import { EditAction, actionView, currentAddActionPanel, updateActionView } from './Edit/EditAction'
import { EditPointer, pointerView, updatePointerView } from './Edit/EditPointer'
import { resetSetPositionEntity } from './Edit/ActionPanels/AddSetPositionPanel'
import { EditState } from './Edit/EditState'
import { EditUiText, hideUIText, showUIText } from './Edit/EditUiText'
import { UiTexts } from '../../components/UIText'
import { EditUIImage, hideUIImage, showUIImage } from './Edit/EditUIImage'
import { EditGaming, gameView, removeGameTeamEntities, resetGamePanel, updateEditGameView, updateGamingInfo } from './Edit/EditGaming'
import { EditLevel, levelView, resetLevelSpawnEntity, updateEditLevelView, updateLevelInfo } from './Edit/EditLevel'
import { EditLive, liveView, resetCurrentBouncerSpawns, resetLiveSpawnEntity, updateEditLiveView, updateLiveBouncerPositions } from './Edit/EditLive'
import { resetTweenActionPanel } from './Edit/ActionPanels/AddTweenPanel'
import { EditGameItem, updateGameItemInfo } from './Edit/EditGameItem'
import { dialogView, EditDialog, updateDialog, updateDialogView } from './Edit/EditDialog'
import { animationEntity, EditAnimation, updateAssetAnimations } from './Edit/EditAnimation'
import { Animator, ComponentType } from '@dcl/sdk/ecs'
import { releaseBatchActions } from './Edit/ActionPanels/AddBatchActionsPanel'
import { releaseRandomActions } from './Edit/ActionPanels/AddRandomAction'
import { EditRewards, updateRewardInfo } from './Edit/EditRewards'
import { EditPlaylist, playlistView, updatePlaylistComponent } from './Edit/EditPlaylist'
import { updatePopupPanelView } from './Edit/ActionPanels/AddPopupPanel'
import { EditNPC, npcComponentView, updateNPCView } from './Edit/EditNPC'
import { EditPath, editPathView, resetPathEntities, updateEditPathPanel, updateEditPathView } from './Edit/EditPath'
import { releaseQuestAction } from './Edit/ActionPanels/AddQuestAction'
import { EditAudioComponent, updateAudioComponent } from './Edit/EditAudios'
import { EditVLMComponent, updateVLM } from './Edit/EditVLM'

export let visibleComponent: string = ""
let componentViewType:string = "basic"
let newAdvancedComponentIndex:number = 0

export function openEditComponent(value: string, resetToBasic?:boolean) {
    let scene:any

    if(resetToBasic){
        componentViewType = "basic"
    }else{
        scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    }


    switch(value){
        case COMPONENT_TYPES.PATH_COMPONENT:
            updateEditPathPanel()
            break;
        case COMPONENT_TYPES.AVATAR_SHAPE_COMPONENT:
            updateNPCView("main")
            break;
        case COMPONENT_TYPES.PLAYLIST_COMPONENT:
            updatePlaylistComponent()
            break;
        case COMPONENT_TYPES.REWARD_COMPONENT:
            updateRewardInfo()
            break;
        case COMPONENT_TYPES.ANIMATION_COMPONENT:
            updateAssetAnimations()
            break;
        case COMPONENT_TYPES.DIALOG_COMPONENT:
            updateDialog(true)
            break;
        case COMPONENT_TYPES.LIVE_COMPONENT:
            updateLiveBouncerPositions()
            break;
        case COMPONENT_TYPES.LEVEL_COMPONENT:
            updateLevelInfo()
            break;

        case COMPONENT_TYPES.GAME_ITEM_COMPONENT:
            updateGameItemInfo()
            break;

        case COMPONENT_TYPES.GAME_COMPONENT:
            updateGamingInfo()
            break;
        case COMPONENT_TYPES.UI_TEXT_COMPONENT:
            if(scene){
                showUIText()
            }
            break;

        case COMPONENT_TYPES.UI_IMAGE_COMPONENT:
            showUIImage()
            break;

        case COMPONENT_TYPES.ADVANCED_COMPONENT:
            componentViewType = "advanced"
            openEditComponent("")
            break;

            case COMPONENT_TYPES.AUDIO_COMPONENT:
                updateAudioComponent()
            break;

        case COMPONENT_TYPES.TRIGGER_COMPONENT:
            enableTriggerEdit(true)
            break;

        case COMPONENT_TYPES.POINTER_COMPONENT:
            updatePointerView("info")
            updatePointerView("main")
            break;

        case COMPONENT_TYPES.MATERIAL_COMPONENT:
            updateMaterialComponent()
            break;

        case COMPONENT_TYPES.PARENTING_COMPONENT:
            updateChildrenAssets()
            break;

        case COMPONENT_TYPES.VLM_COMPONENT:
            updateVLM()
            break;
            
        // case COMPONENT_TYPES.NPC_COMPONENT:
        //     updateNPCView('main')
        //     break;

        // case COMPONENT_TYPES.TRIGGER_AREA_COMPONENT:
        //     updateTriggerAreaActionView("main")//
        //     break;

        // case COMPONENT_TYPES.TRIGGER_COMPONENT:
        //     updateTriggerActions()
        //     break;

        // case COMPONENT_TYPES.DIALOG_COMPONENT:
        //     updateDialogView("list")
        //     break;

        // case COMPONENT_TYPES.REWARD_COMPONENT:
        //     updateRewardInfo(selectedItem.itemData.rComp)
        //     break;

        // case COMPONENT_TYPES.ADVANCED_COMPONENT:
        //     updateAdvancedEditPanel(true)
        //     break;
    }

    visibleComponent = value
    console.log('visible component is', visibleComponent)
}

export function createEditAssetPanel() {
    return (
        <UiEntity
            key={resources.slug + "editobjectpanel"}
            uiTransform={{
                display: selectedItem && selectedItem.enabled && selectedItem.mode === EDIT_MODES.EDIT ? 'flex' : 'none',
                // display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(25, 345 / 511).width,
                height: calculateImageDimensions(27, 345 / 511).height,
                positionType: 'absolute',
                position: {right: '4%', bottom: '3%'}
            }}
            // uiBackground={{ color: Color4.Red() }}
        >
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas1.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.vertRectangleOpaque)
                }}
                onMouseDown={()=>{
                    setUIClicked(true)
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
                >
                
                <EditObjectDetails/>
                <EditObjectData/> 

                {/* button rows */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '90%',
                        height: '5%',
                        margin: {top: '1%'}
                    }}
                    // uiBackground={{color:Color4.Green()}}// 
                >

                     {/* save button */}
                     <UiEntity
                        uiTransform={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '30%',
                            height: '100%',
                            margin: {left: "1%", right: "1%"}
                        }}
                        uiBackground={{
                            textureMode: 'stretch',
                            texture: {
                                src: 'assets/atlas2.png'
                            },
                            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                        }}
                        uiText={{value: "Close", fontSize: sizeFont(20, 16)}}
                        onMouseDown={() => {
                            setUIClicked(true)
                            saveItem()
                        }}
                        onMouseUp={()=>{
                            setUIClicked(false)
                        }}
                    />

                    {/* delete button */}
                    {/* <UiEntity
                        uiTransform={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '30%',
                            height: '100%',
                            margin: {left: "1%", right: "1%"}
                        }}
                        uiBackground={{
                            textureMode: 'stretch',
                            texture: {
                                src: 'assets/atlas2.png'
                            },
                            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                        }}
                        uiText={{value: "Delete", fontSize: sizeFont(20, 16)}}
                        onMouseDown={() => {
                            setUIClicked(true)
                            if(settings.confirms){
                                updateSelectedAssetId(selectedItem.aid)
                                displaySkinnyVerticalPanel(true, getView("Confirm Delete Entity"), localPlayer.activeScene[COMPONENT_TYPES.NAMES_COMPONENT].get(selectedAssetId).value)
                            }else{
                                deleteSelectedItem(selectedItem.aid)
                            }
                            resetAdditionalAssetFeatures()
                            addAllBuildModePointers()
                        }}
                        onMouseUp={()=>{
                            setUIClicked(false)
                        }}
                    /> */}

            

                    {/* cancel button */}
                    {/* <UiEntity
                        uiTransform={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '30%',
                            height: '100%',
                            margin: {left: "1%", right: "1%"}
                        }}
                        uiBackground={{
                            textureMode: 'stretch',
                            texture: {
                                src: 'assets/atlas2.png'
                            },
                            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                        }}
                        uiText={{value: "Cancel", fontSize: sizeFont(20, 16)}}
                        onMouseDown={() => {
                            setUIClicked(true)
                            cancelEditingItem()
                                componentViewType = "basic"
                                openEditComponent("")
                                resetAdditionalAssetFeatures()
                                addAllBuildModePointers()
                        }}
                        onMouseUp={()=>{
                            setUIClicked(false)
                        }}
                    /> */}
                </UiEntity>
            </UiEntity>
        </UiEntity>
    )
}

function EditObjectDetails() {
    return (
        <UiEntity
            key={resources.slug + "editobjectdetailsinfo"}
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '95%',
                height: '15%',
                margin:{top:'1%'}
            }}
        // uiBackground={{color:Color4.Teal()}}
        >

            {/* image column */}
            <UiEntity
            uiTransform={{
                display: 'flex',
                alignItems: 'center',
                flexDirection:'column',
                justifyContent: 'center',
                width: '20%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Blue()}}
        >

                <UiEntity
            uiTransform={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateSquareImageDimensions(8).width,
                height: calculateSquareImageDimensions(8).height,
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: "" + (selectedItem && selectedItem.enabled ? items.get(selectedItem.catalogId)!.im : "")
                },
                uvs: getImageAtlasMapping({
                    atlasHeight: 256,
                    atlasWidth: 256,
                    sourceTop: 0,
                    sourceLeft: 0,
                    sourceWidth: 256,
                    sourceHeight: 256
                })
            }}
            />

            </UiEntity>

            {/* header and description row */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection:'column',
                    justifyContent: 'center',
                    width: '65%',
                    height: '100%',
                    margin:{top:"1%"}
                }}
                // uiBackground={{color:Color4.Yellow()}}
            >

                    {/* item name */}
                    <UiEntity
                    uiTransform={{
                        display: 'flex',//
                        flexDirection: 'column',
                        width: '100%',
                        height: '100%',
                        justifyContent:'center',
                    }}
                    uiText={{ value: "" + (selectedItem && selectedItem.enabled ? getAssetName() : ""), fontSize: sizeFont(30, 25), textAlign:'middle-left'}}
                     />
                     
                     
            </UiEntity>

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '15%',
                    height: '100%',
                }}
            >

                {/* back button */}
            <UiEntity
                    uiTransform={{
                        display: visibleComponent !== "" ? "flex" : "none",
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(2, getAspect(uiSizes.backButton)).width,
                        height: calculateImageDimensions(2, getAspect(uiSizes.backButton)).height,
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.backButton)
                    }}
                    onMouseDown={() => {
                        setUIClicked(true)
                        getBackButtonLogic()
                        // updateActionView("list")
                    }}
                    onMouseUp={()=>{
                        setUIClicked(false)
                    }}
                />

            </UiEntity>

            
        </UiEntity>
    )
}

function getBackButtonLogic(){
    switch(visibleComponent){
        case COMPONENT_TYPES.REWARD_COMPONENT:
            openEditComponent(COMPONENT_TYPES.ADVANCED_COMPONENT)
            break;
        case COMPONENT_TYPES.MATERIAL_COMPONENT:
            if(materialView === "main"){
                openEditComponent(COMPONENT_TYPES.ADVANCED_COMPONENT)
            }else{
                updateMaterialComponent()
            }
            break;
        case COMPONENT_TYPES.PLAYLIST_COMPONENT:
            if(playlistView === "main"){
                openEditComponent(COMPONENT_TYPES.ADVANCED_COMPONENT)
            }else{
                updatePlaylistComponent()
            }
            break;
        case COMPONENT_TYPES.ANIMATION_COMPONENT:
            Animator.stopAllAnimations(animationEntity)
            openEditComponent("")
            break;
        case COMPONENT_TYPES.DIALOG_COMPONENT:
            if(dialogView === "main"){
                openEditComponent(COMPONENT_TYPES.ADVANCED_COMPONENT)
            }
            else if(dialogView === "add"){
                updateDialogView("main")
            }
            else if(dialogView === "addbutton"){
                updateDialogView('edit')
            }else if(dialogView === "edit"){
                updateDialogView('main')
            }else{
                openEditComponent(COMPONENT_TYPES.ADVANCED_COMPONENT)
            }
            break;
        case COMPONENT_TYPES.GAME_ITEM_COMPONENT:
            openEditComponent(COMPONENT_TYPES.ADVANCED_COMPONENT)
            break;
        case COMPONENT_TYPES.LIVE_COMPONENT:
            if(liveView === "main"){
                openEditComponent(COMPONENT_TYPES.ADVANCED_COMPONENT)
            }else if(liveView === "add-bounce-spawn"){
                resetLiveSpawnEntity()
                updateEditLiveView("bouncer")
            }else if(liveView === "bouncer"){
                resetCurrentBouncerSpawns()
                updateEditLiveView("main")
            }
            break;
        case COMPONENT_TYPES.LEVEL_COMPONENT:
            if(levelView === "main"){
                openEditComponent(COMPONENT_TYPES.ADVANCED_COMPONENT)
            }else if(levelView === "spawn"){
                resetLevelSpawnEntity()
                updateEditLevelView("main")
            }else if(levelView === "loading"){
                updateEditLevelView("main")
            }
            break;

        case COMPONENT_TYPES.PATH_COMPONENT:
            if(editPathView === "main"){
                resetPathEntities(true)
                openEditComponent(COMPONENT_TYPES.ADVANCED_COMPONENT)
            }else{
                updateEditPathView("main")
            }
            break;

        case COMPONENT_TYPES.GAME_COMPONENT:
            if(gameView === "main"){
                updateGamingInfo(true)
                openEditComponent(COMPONENT_TYPES.ADVANCED_COMPONENT)
            }
            else if(gameView === "teams-edit"){
                updateEditGameView("teams")
            }
            else if(gameView === "teams-edit-spawns"){
                updateEditGameView("teams-edit")
            }
            else{
                resetGamePanel()
                updateEditGameView("main")
            }
            // else if(gameView === "levels" || gameView === "metadata"){
            //     updateEditGameView("main")
            // }
            break;

        case COMPONENT_TYPES.UI_TEXT_COMPONENT:
            hideUIText()
            openEditComponent(COMPONENT_TYPES.ADVANCED_COMPONENT)
        break;

        case COMPONENT_TYPES.UI_IMAGE_COMPONENT:
            hideUIImage()
            openEditComponent(COMPONENT_TYPES.ADVANCED_COMPONENT)
        break;

        case COMPONENT_TYPES.ADVANCED_COMPONENT:
            componentViewType = "basic"
            openEditComponent("")
            break;

        case COMPONENT_TYPES.ACTION_COMPONENT:
            resetAdditionalAssetFeatures()
            if(actionView === "add"){
                if(currentAddActionPanel === Actions.POPUP_SHOW){
                    updatePopupPanelView("main")
                }else{
                    releaseBatchActions()
                    releaseRandomActions()
                    releaseQuestAction()
                    updateActionView("main")
                }
            }else{
                openEditComponent(COMPONENT_TYPES.ADVANCED_COMPONENT)
            }
        break;

        case COMPONENT_TYPES.AVATAR_SHAPE_COMPONENT:
            if(npcComponentView === "wMain"){
                updateNPCView("main")
            }else{
                openEditComponent(COMPONENT_TYPES.ADVANCED_COMPONENT)
            }
            
        break;

        case COMPONENT_TYPES.TRIGGER_COMPONENT:
            if(triggerView === "add"){
                updateTriggerView("main")
            }else if(triggerView === "info"){
                switch(triggerInfoView){
                    case 'main':
                        updateTriggerView("main")
                        break

                    case 'conditions':
                        resetTriggerPanels()
                        updateTriggerInfoView("decisions")
                        break;

                    case 'actions':
                        updateTriggerInfoView("decisions")
                        break;

                    default:
                        updateTriggerInfoView("main")
                        break;
                }
            }else{
                openEditComponent(COMPONENT_TYPES.ADVANCED_COMPONENT)
            }
            break;

        case COMPONENT_TYPES.POINTER_COMPONENT:
            if(pointerView === "info"){
                updatePointerView("main")
            }else{
                openEditComponent(COMPONENT_TYPES.ADVANCED_COMPONENT)
            }
        break;

        case COMPONENT_TYPES.STATE_COMPONENT:
        case COMPONENT_TYPES.COUNTER_COMPONENT:
        case COMPONENT_TYPES.PARENTING_COMPONENT:
            openEditComponent(COMPONENT_TYPES.ADVANCED_COMPONENT)
            break;

        // case COMPONENT_TYPES.NPC_COMPONENT:
        //     if(npcComponentView === "wAdd"){
        //         updateNPCView('wMain')
        //     }//
    
        //     else if(npcComponentView === "wMain"){
        //         updateNPCView('main')
        //     }
        //     else{
        //         openEditComponent("")
        //     }
        //     break;

        // case COMPONENT_TYPES.TRIGGER_COMPONENT:
        //     if(triggerView === "actions" || triggerView == "add"){
        //         updateActionView("list")
        //     }

        //     else{
        //         openEditComponent("")
        //     }
            
        //     break;

        // case COMPONENT_TYPES.DIALOG_COMPONENT:
        //     if(dialogView === "addbutton"){
        //         updateDialogView("add")
        //     }else if(dialogView === "add"){
        //         updateDialogView("list")
        //     }else{
        //         openEditComponent("")
        //     }
        //     break;

        // case COMPONENT_TYPES.ACTION_COMPONENT:
        //     console.log("pressing back on action component", selectedActionIndex, actionTweenView, acionMainview)
        //     disableTweenPlacementEntity()
        //     if(acionMainview === "list"){
        //         openEditComponent("")
        //     }else{
        //         switch(selectedActionIndex){
        //             case 14:
        //                 switch(actionTweenView){
        //                     case 'main':
        //                         updateActionComponentView("list")
        //                         break;

        //                     case 'end':
        //                         updateActionTweenView("main")
        //                 }
        //                 break;

        //             default:
        //                 updateActionComponentView('list')
        //                 break;
        //         }
        //     }
        //     break;
        
            default:
            openEditComponent("")
    }
}

function getAssetName(){
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(scene){
        let itemInfo = scene[COMPONENT_TYPES.NAMES_COMPONENT].get(selectedItem.aid)
        if(itemInfo){
            return itemInfo.value //.length > 20 ? itemInfo.value.substring(0,20) + "..." : itemInfo.value
        }
        return ""
    }
    return ""
}

function EditObjectData(){
    return (
        <UiEntity
            key={resources.slug + "editobjectdatainfo"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '95%',
                height: '75%',
            }}
            // uiBackground={{color:Color4.Blue()}}////
        >


            {/* basic components container */}
            <UiEntity
                uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                display:componentViewType === "basic" ? "flex" : "none"
                }}
                // uiBackground={{color:Color4.Red()}}
            >

                {/* add component row */}
            {/* <UiEntity
                uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent:'center',
                width: '90%',
                height: '10%',
                display: "none"
                }}
            >

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '50%',
                    height: '100%',
                }}
                >
            <Dropdown
                options={getComponents(true)}
                selectedIndex={0}
                onChange={selectNewAdvancedcComponentIndex}
                uiTransform={{
                    width: '100%',
                    height: '120%',
                }}
                // uiBackground={{color:Color4.Purple()}}//
                color={Color4.White()}
                fontSize={sizeFont(20, 15)}
            />
                </UiEntity>

                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '50%',
                        height: '100%',
                    }}
                >


                <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(8, getAspect(uiSizes.buttonPillBlack)).width,
                        height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                    }}
                    uiText={{
                        value: "Add Component",
                        fontSize: sizeFont(25, 15),
                        color: Color4.White(),
                        textAlign: 'middle-center'
                    }}
                    onMouseDown={() => {
                        setUIClicked(true)
                        if(newAdvancedComponentIndex !== 0){
                            addComponent()
                        }
                    }}
                    onMouseUp={()=>{
                        setUIClicked(false)
                    }}
                />
                </UiEntity>

            </UiEntity> */}

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '90%',
                    height: '90%',
                    margin: {top: "2%"},
                    display: visibleComponent === "" ? 'flex' : 'none'
                }}
                // uiBackground={{color:Color4.Green()}}
            >
                {selectedItem && selectedItem.enabled && generateComponentViews()}
            </UiEntity>

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '90%',
                    height: '100%',
                    margin: {top: "2%"},
                    display: visibleComponent !== "" ? 'flex' : 'none'
                }}
                // uiBackground={{color:Color4.Blue()}}
            >
                <EditTransform/>
                <EditVisibility/>
                <EditName/>
                {/* <EditAudio/> */}
                <EditAudioComponent/>
                <EditText/>
                <EditNftShape/>
                <EditGltf/>
                <EditVideo/>
                <EditMeshCollider/>
                <EditMeshRender/>
                <EditMaterial/>
                <EditTexture/>
                <EditAnimation/>
            </UiEntity>

                </UiEntity>

                {/* advanced components container */}
                <UiEntity
                uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                display:componentViewType !== "basic" ? "flex" : "none"
                }}
            >

                {/* add component row */}
            <UiEntity
                uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent:'center',
                width: '90%',
                height: '10%',
                display:visibleComponent === COMPONENT_TYPES.ADVANCED_COMPONENT ? "flex" : "none"
                }}
            >

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '50%',
                    height: '100%',
                }}
                >
            <Dropdown
                options={getComponents(true)}
                selectedIndex={0}
                onChange={selectNewAdvancedcComponentIndex}
                uiTransform={{
                    width: '100%',
                    height: '120%',
                }}
                // uiBackground={{color:Color4.Purple()}}//
                color={Color4.White()}
                fontSize={sizeFont(20, 15)}
            />
                </UiEntity>

                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '50%',
                        height: '100%',
                    }}
                >


                <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(8, getAspect(uiSizes.buttonPillBlack)).width,
                        height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                    }}
                    uiText={{
                        textWrap:'nowrap',
                        value: "Add Component",
                        fontSize: sizeFont(25, 15),
                        color: Color4.White(),
                        textAlign: 'middle-center'
                    }}
                    onMouseDown={() => {
                        setUIClicked(true)
                        if(newAdvancedComponentIndex !== 0){
                            addComponent()
                        }
                    }}
                    onMouseUp={()=>{
                        setUIClicked(false)
                    }}
                />
                </UiEntity>

            </UiEntity>

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '90%',
                    height: '90%',
                    margin: {top: "2%"},
                    display: visibleComponent === "Advanced" ? 'flex' : 'none'
                }}
                // uiBackground={{color:Color4.Green()}}//
            >

                {selectedItem && selectedItem.enabled && generateComponentViews()}
            </UiEntity>

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '90%',
                    height: '100%',
                    margin: {top: "2%"},
                    display: visibleComponent !== COMPONENT_TYPES.ADVANCED_COMPONENT ? 'flex' : 'none'
                }}
                // uiBackground={{color:Color4.Blue()}}//
            >
                <EditParenting/>
                <EditCounter/>
                <EditTrigger/>
                <EditAction/>
                <EditPointer/>
                <EditState/>
                <EditUiText/>
                <EditUIImage/>
                <EditGaming/>
                <EditGameItem/>
                <EditLevel/>
                <EditLive/>
                <EditDialog/>
                <EditRewards/>
                <EditPlaylist/>
                <EditNPC/>
                <EditPath/>
                <EditAudioComponent/>
                <EditVLMComponent/>

            </UiEntity>

                </UiEntity>




        </UiEntity>
    )
}

function generateComponentViews() {
    let arr: any[] = []
    let components:COMPONENT_TYPES[] = componentViewType === "basic" ? getBasicComponents() : getAdvancedComponents()

    components.sort((a:any, b:any)=> a.localeCompare(b)).forEach((component: any, i:number) => {
        arr.push(
            <UiEntity
            key={resources.slug + "asset-component-" + component+i}
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin: {top: "2%"}
            }}
        >

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '90%',
                    height: '100%',
                }}
                uiBackground={{color: Color4.Black()}}
                uiText={{value: "" + component.replace(/_/g, " "), fontSize: sizeFont(30, 20)}}
                onMouseDown={() => {
                    setUIClicked(true)
                    openEditComponent(component)
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
            />

                <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '10%',
                height: '100%',
            }}
            uiBackground={{color: Color4.Black()}}
            >
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).width,
                    height: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).height,
                    positionType:'absolute',
                    position:{right: '2%'},
                    display: getNoDeletes().includes(component) ? "none" : "flex"
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas1.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.trashButton)
                }}
                onMouseDown={() => {
                    setUIClicked(true)
                    openEditComponent(COMPONENT_TYPES.ADVANCED_COMPONENT)

                    if(component === COMPONENT_TYPES.GAME_COMPONENT){
                        displaySkinnyVerticalPanel(true, getView("Delete_Game"), undefined, ()=>{
                            sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET,
                                {
                                    component:"Delete",
                                    aid:selectedItem.aid,
                                    sceneId:selectedItem.sceneId,
                                    type: component,
                                })
                        })
                    }else{
                        sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET,
                            {
                                component:"Delete",
                                aid:selectedItem.aid,
                                sceneId:selectedItem.sceneId,
                                type: component,
                            })
                    }

                    
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
                />  
            </UiEntity>

        </UiEntity>
        )
    });
    return arr
}

function getBasicComponents(){
    let aid = selectedItem.aid
    let components:COMPONENT_TYPES[] = []
    let omittedComponents:COMPONENT_TYPES[] = [
        COMPONENT_TYPES.ACTION_COMPONENT,
        COMPONENT_TYPES.IWB_COMPONENT,
        COMPONENT_TYPES.POINTER_COMPONENT,
        COMPONENT_TYPES.TRIGGER_COMPONENT,
        COMPONENT_TYPES.COUNTER_COMPONENT,
        COMPONENT_TYPES.STATE_COMPONENT,
        COMPONENT_TYPES.UI_TEXT_COMPONENT,
        COMPONENT_TYPES.UI_IMAGE_COMPONENT,
        COMPONENT_TYPES.GAME_COMPONENT,
        COMPONENT_TYPES.LEVEL_COMPONENT,
        COMPONENT_TYPES.LIVE_COMPONENT,
        COMPONENT_TYPES.GAME_ITEM_COMPONENT,
        COMPONENT_TYPES.DIALOG_COMPONENT,
        COMPONENT_TYPES.REWARD_COMPONENT,
        COMPONENT_TYPES.PLAYLIST_COMPONENT,
        COMPONENT_TYPES.AVATAR_SHAPE_COMPONENT,
        COMPONENT_TYPES.PATH_COMPONENT,
        COMPONENT_TYPES.VLM_COMPONENT
    ]
    Object.values(COMPONENT_TYPES).forEach((component:any)=>{
        if(sceneEdit && sceneEdit[component] && sceneEdit[component][aid] && !omittedComponents.includes(component)){
            components.push(component)
        }
    })

    components.sort((a,b) => a.localeCompare(b))
    components.push(COMPONENT_TYPES.ADVANCED_COMPONENT)

    return components
}

function getAdvancedComponents(){
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return []
    }

    let itemInfo = scene[COMPONENT_TYPES.PARENTING_COMPONENT].find(($:any)=> $.aid === selectedItem.aid)
        if(!itemInfo){
            return []
        }

    let headers:any[] = [
        COMPONENT_TYPES.ADVANCED_COMPONENT,
        COMPONENT_TYPES.CLICK_AREA_COMPONENT
    ]

    let assetComponents:any[] = []
    Object.values(COMPONENT_TYPES).forEach((component)=>{
        if(scene.hasOwnProperty(component) && scene[component][selectedItem.aid]){
            assetComponents.push(component)
        }
    })

    assetComponents.push(COMPONENT_TYPES.PARENTING_COMPONENT)

    let advancedComponents:any[] = []
    advancedComponents = [...Object.values(COMPONENT_TYPES)].splice(-21).filter(item => assetComponents.includes(item))
    advancedComponents = advancedComponents.filter(item => !headers.includes(item))
    return advancedComponents
}

function addComponent(){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET,
        {
            component:"Add",
            aid:selectedItem.aid,
            sceneId:selectedItem.sceneId,
            type: getComponents()[newAdvancedComponentIndex],
        }
    )
}

function selectNewAdvancedcComponentIndex(index:number){
    newAdvancedComponentIndex = index
}

function getComponents(noUnderscore?:boolean){
    if(selectedItem && selectedItem.enabled){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(!scene){
            return []
        }

        let itemInfo = scene[COMPONENT_TYPES.PARENTING_COMPONENT].find(($:any)=> $.aid === selectedItem.aid)
        if(!itemInfo){
            return []
        }

        let omittedAdvancedComponents:any[] = [
            COMPONENT_TYPES.UI_TEXT_COMPONENT,
            COMPONENT_TYPES.UI_IMAGE_COMPONENT,
            COMPONENT_TYPES.CLICK_AREA_COMPONENT,
            COMPONENT_TYPES.PARENTING_COMPONENT,
            COMPONENT_TYPES.DIALOG_COMPONENT,
            COMPONENT_TYPES.REWARD_COMPONENT,
            COMPONENT_TYPES.DIALOG_COMPONENT,
            COMPONENT_TYPES.TRANSFORM_COMPONENT,
            COMPONENT_TYPES.CLICK_AREA_COMPONENT,
            COMPONENT_TYPES.TEXTURE_COMPONENT,
            // COMPONENT_TYPES.AUDIO_SOURCE_COMPONENT,
            // COMPONENT_TYPES.AUDIO_STREAM_COMPONENT,
            COMPONENT_TYPES.IMAGE_COMPONENT,
            COMPONENT_TYPES.IWB_COMPONENT,
            COMPONENT_TYPES.LIVE_COMPONENT,
            COMPONENT_TYPES.NAMES_COMPONENT,
            COMPONENT_TYPES.NFT_COMPONENT,
            COMPONENT_TYPES.PARENTING_COMPONENT,
            COMPONENT_TYPES.PLAYLIST_COMPONENT,
            COMPONENT_TYPES.TEAM_COMPONENT,
            COMPONENT_TYPES.REWARD_COMPONENT,
            COMPONENT_TYPES.LEVEL_COMPONENT,
            COMPONENT_TYPES.PATH_COMPONENT,
            COMPONENT_TYPES.AUDIO_COMPONENT,
            COMPONENT_TYPES.VLM_COMPONENT
        ]

        let components:any[] = []
        Object.values(COMPONENT_TYPES).forEach((component)=>{
            if(scene.hasOwnProperty(component) && scene[component].hasOwnProperty(selectedItem.aid)){
                components.push(component)
            }
        })

        let array:any = [...Object.values(COMPONENT_TYPES)].splice(-21).filter(item => !components.includes(item) && !omittedAdvancedComponents.includes(item))
        array.sort((a:any, b:any)=> a.localeCompare(b))
        noUnderscore ? array = array.map((str:any)=> str.replace(/_/g, " ")) :null
        array.unshift("Component List")

        return array
    }
    return []
}

function getNoDeletes(){
    return [
        COMPONENT_TYPES.NAMES_COMPONENT, 
        COMPONENT_TYPES.PARENTING_COMPONENT, 
        COMPONENT_TYPES.ADVANCED_COMPONENT,
        COMPONENT_TYPES.TRANSFORM_COMPONENT,
        COMPONENT_TYPES.VISBILITY_COMPONENT,
    ]
}
