import ReactEcs, {Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps} from '@dcl/sdk/react-ecs'
import resources from '../../helpers/resources'
import { localPlayer, settings } from '../../components/Player'
import { EDIT_MODES, COMPONENT_TYPES } from '../../helpers/types'
import { selectedItem, saveItem, deleteSelectedItem, cancelEditingItem, updateSelectedAssetId, selectedAssetId, disableTweenPlacementEntity } from '../../modes/Build'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'
import { displaySkinnyVerticalPanel } from '../Reuse/SkinnyVerticalPanel'
import { getView } from '../uiViews'
import { items } from '../../components/Catalog'
import { colyseusRoom } from '../../components/Colyseus'
import { Color4 } from '@dcl/sdk/math'
import { setUIClicked } from '../ui'
import { EditTransform } from './Edit/EditTransform'
import { EditVisibility } from './Edit/EditVisibility'
import { EditName } from './Edit/EditName'
import { EditAudio, updateAudioComponent } from './Edit/EditAudio'
import { EditText } from './Edit/EditText'
import { EditNftShape } from './Edit/EditNftShape'
import { EditGltf } from './Edit/EditGltf'

export let visibleComponent: string = ""

export function openEditComponent(value: string, subMenu?:string) {
    switch(value){
        case COMPONENT_TYPES.AUDIO_COMPONENT:
            let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
            if(scene && scene.sounds.has(selectedItem.aid)){
                updateAudioComponent(scene.sounds.get(selectedItem.aid))
            }
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
}

export function createEditAssetPanel() {
    return (
        <UiEntity
            key={resources.slug + "editobjectpanel"}
            uiTransform={{
                display: selectedItem && selectedItem.enabled && selectedItem.mode === EDIT_MODES.EDIT /*&& visibleComponent !== COMPONENT_TYPES.ADVANCED_COMPONENT*/ ? 'flex' : 'none',
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
                        uiText={{value: "Save", fontSize: sizeFont(20, 16)}}
                        onMouseDown={() => {
                            setUIClicked(false)
                            saveItem()
                        }}
                        onMouseUp={()=>{
                            setUIClicked(false)
                        }}
                    />

                    {/* delete button */}
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
                        uiText={{value: "Delete", fontSize: sizeFont(20, 16)}}
                        onMouseDown={() => {
                            setUIClicked(true)
                            if(settings.confirms){
                                updateSelectedAssetId(selectedItem.aid)
                                displaySkinnyVerticalPanel(true, getView("Confirm Delete Entity"), localPlayer.activeScene.names.get(selectedAssetId).value)
                            }else{
                                deleteSelectedItem(selectedItem.aid)
                            }
                        }}
                        onMouseUp={()=>{
                            setUIClicked(false)
                        }}
                    />

                    {/* cancel button */}
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
                        uiText={{value: "Cancel", fontSize: sizeFont(20, 16)}}
                        onMouseDown={() => {
                            setUIClicked(true)
                            cancelEditingItem()
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

function EditObjectDetails() {
    return (
        <UiEntity
            key={resources.slug + "editobjectdetailsinfo"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '95%',
                height: '20%',
                margin:{top:'5%'}
            }}
        // uiBackground={{color:Color4.Teal()}}
        >


            {/* top image row */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection:'row',
                    justifyContent: 'center',
                    width: '90%',
                    height: '80%',
                }}
                // uiBackground={{color:Color4.Green()}}
            >

                {/* image column */}
                <UiEntity
                uiTransform={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection:'row',
                    justifyContent: 'center',
                    width: '40%',
                    height: '100%',
                }}
                // uiBackground={{color:Color4.Blue()}}
            >

                 <UiEntity
                uiTransform={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateSquareImageDimensions(10).width,
                    height: calculateSquareImageDimensions(10).height,
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

                   
                {/* buttons column */}
                <UiEntity
                uiTransform={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection:'column',
                    justifyContent: 'center',
                    width: '40%',
                    height: '100%',
                }}
                // uiBackground={{color:Color4.Green()}}
            >


                </UiEntity>

                 {/* back button column */}
                 <UiEntity
                uiTransform={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection:'column',
                    justifyContent: 'flex-start',
                    width: '20%',
                    height: '100%',
                    margin:{top:"5%"}
                }}
                // uiBackground={{color:Color4.Teal()}}
            >
                 {/* <UiEntity
                uiTransform={{
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
                    displayCatalogInfoPanel(false)
                    displayCatalogPanel(true)
                }}
            /> */}
                </UiEntity>

            </UiEntity>

            {/* header and description row */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection:'column',
                    justifyContent: 'center',
                    width: '90%',
                    height: '20%',
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
                    uiText={{ value: "" + (selectedItem && selectedItem.enabled ? getAssetName() : ""), fontSize: sizeFont(40, 30), textAlign:'middle-left'}}
                     />
                     
                     
            </UiEntity>
            
        </UiEntity>
    )
}

function getAssetName(){
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(scene){
        let itemInfo = scene.names.get(selectedItem.aid)
        if(itemInfo){
            return itemInfo.value
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
                height: '65%',
            }}
            // uiBackground={{color:Color4.Blue()}}
        >

            {/* details label */}
            {/* <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '90%',
                    height: '10%',
                    margin: {top: "2%"},
                }}
                // uiBackground={{color:Color4.Blue()}}
                uiText={{
                    value: "Asset Details",
                    fontSize: sizeFont(25, 15),
                    color: Color4.White(),
                    textAlign: 'middle-left'
                }}
            /> */}

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
                // uiBackground={{color:Color4.Blue()}}
            >
                {selectedItem && selectedItem.enabled && generateComponentViews()}

            </UiEntity>


            {/* specific component panel container */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '100%',
                    height: '100%',
                    display: visibleComponent !== "" ? 'flex' : 'none'
                }}
                // uiBackground={{color:Color4.Teal()}}
            >

                {/* component details label */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '90%',
                        height: '10%',
                        margin: {top: "2%"}
                    }}
                >

                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '80%',
                            height: '100%',
                        }}
                        uiText={{
                            value: "" + visibleComponent + " Component Details",
                            fontSize: sizeFont(25, 15),
                            color: Color4.White(),
                            textAlign: 'middle-left'
                        }}
                    />

                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '20%',
                            height: '100%',
                        }}
                    >
                    <UiEntity
                    uiTransform={{
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
                        switch(visibleComponent){
                            // case COMPONENT_TYPES.NPC_COMPONENT:
                            //     if(npcComponentView === "wAdd"){
                            //         updateNPCView('wMain')
                            //     }
                        
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
                        // updateActionView("list")
                    }}
                    onMouseUp={()=>{
                        setUIClicked(false)
                    }}
                />

                    </UiEntity>

                </UiEntity>


                {/* edit component panel */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: '95%',
                        height: '90%',
                        margin: {top: "2%"}
                    }}
                >

                    <EditTransform/>
                    <EditVisibility/>
                    <EditName/>
                    <EditAudio/>
                    <EditText/>
                    <EditNftShape/>
                    <EditGltf/>

                    {/* <ImageComponentPanel/>
                    <VideoComponentPanel/>
                    
                    <ActionComponent/>
                    <MaterialComponentPanel/>
                    <TriggerComponent/>
                    <TriggerAreaComponent/>
                    <AnimationComponent/>
                    <NPCComponent/>
                    <DialogComponent/>
                    <RewardComponentPanel/> */}

                </UiEntity>
            </UiEntity>
        </UiEntity>
    )
}

function generateComponentViews() {
    let arr: any[] = []
    // let components = getComponents()
    let components:COMPONENT_TYPES[] = getBasicComponents(selectedItem.aid)
    components.push(COMPONENT_TYPES.ADVANCED_COMPONENT)

    components.forEach((component: any, i:number) => {
        arr.push(
            <UiEntity
                key={resources.slug + "asset-component-" + component+i}
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin: {top: "2%"}
                }}
                uiBackground={{color: Color4.Black()}}
                uiText={{value: "" + component, fontSize: sizeFont(30, 20)}}
                onMouseDown={() => {
                    setUIClicked(true)
                    openEditComponent(component)
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
            />
        )
    });
    return arr
}

function getBasicComponents(aid:string){
    let components:COMPONENT_TYPES[] = [
        COMPONENT_TYPES.TRANSFORM_COMPONENT,
        COMPONENT_TYPES.VISBILITY_COMPONENT,
    ]

    localPlayer.activeScene.names.has(aid) ? components.push(COMPONENT_TYPES.NAMES_COMPONENT) : null
    localPlayer.activeScene.textShapes.has(aid) ? components.push(COMPONENT_TYPES.TEXT_COMPONENT) : null
    localPlayer.activeScene.meshes.has(aid) ? components.push(COMPONENT_TYPES.MESH_COMPONENT) : null
    localPlayer.activeScene.materials.has(aid) ? components.push(COMPONENT_TYPES.MATERIAL_COMPONENT) : null
    localPlayer.activeScene.videos.has(aid) ? components.push(COMPONENT_TYPES.VIDEO_COMPONENT) : null
    localPlayer.activeScene.animators.has(aid) ? components.push(COMPONENT_TYPES.ANIMATION_COMPONENT) : null
    localPlayer.activeScene.sounds.has(aid) ? components.push(COMPONENT_TYPES.AUDIO_COMPONENT) : null
    localPlayer.activeScene.gltfs.has(aid) ? components.push(COMPONENT_TYPES.GLTF_COMPONENT) : null
    localPlayer.activeScene.nftShapes.has(aid) ? components.push(COMPONENT_TYPES.NFT_COMPONENT) : null
    return components
}