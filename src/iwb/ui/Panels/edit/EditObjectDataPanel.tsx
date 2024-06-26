import ReactEcs, {UiEntity} from '@dcl/sdk/react-ecs'
import {Color4} from '@dcl/sdk/math'
import {calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont} from '../../helpers'
import {disableTweenPlacementEntity, selectedItem} from '../../../components/modes/build'
import {sceneBuilds} from '../../../components/scenes'
import {COMPONENT_TYPES, EDIT_MODES, IWBScene} from '../../../helpers/types'
import {ImageComponentPanel} from './ImageComponentPanel'
import {EditTransform} from './EditTransform'
import {VisibilityComponentPanel} from './VisibiltyComponentPanel'
import {VideoComponentPanel} from "./VideoComponentPanel";
import {uiSizes} from '../../uiConfig'
import {log} from '../../../helpers/functions'
import {CollisionComponentPanel} from './CollisionComponentPanel'
import {NFTComponentPanel} from './NFTComponentPanel'
import {TextComponentPanel} from './TextComponentPanel'
import {ActionComponent, acionMainview, selectedActionIndex, updateActionComponentView} from './ActionComponent'
import {TriggerComponent, triggerView, updateActionView, updateTriggerActions} from './TriggerComponent'
import {AudioComponentPanel} from "./AudioComponentPanel";
import { MaterialComponentPanel } from './MaterialComponentPanel'
import { TriggerAreaComponent, updateTriggerAreaActionView } from './TriggerAreaComponentPanel'
import { AnimationComponent } from './AnimationComponentPanel'
import { NPCComponent, npcComponentView, updateNPCView } from './NPCComponent'
import { DialogComponent, dialogView, updateDialogView } from './DialogComponent'
import { actionTweenView, updateActionTweenView } from './Actions/ActionTweenComponent'
import { RewardComponentPanel, updateRewardInfo } from './RewardComponentPanel'
import { updateAdvancedEditPanel } from './Advanced'

export let visibleComponent: string = ""

export function openEditComponent(value: string, subMenu?:string) {
    switch(value){
        case COMPONENT_TYPES.NPC_COMPONENT:
            updateNPCView('main')
            break;

        case COMPONENT_TYPES.TRIGGER_AREA_COMPONENT:
            updateTriggerAreaActionView("main")//
            break;

        case COMPONENT_TYPES.TRIGGER_COMPONENT:
            updateTriggerActions()
            break;

        case COMPONENT_TYPES.DIALOG_COMPONENT:
            updateDialogView("list")
            break;

        case COMPONENT_TYPES.REWARD_COMPONENT:
            updateRewardInfo(selectedItem.itemData.rComp)
            break;

        case COMPONENT_TYPES.ADVANCED_COMPONENT:
            updateAdvancedEditPanel(true)
            break;
    }

    visibleComponent = value
}


export function EditObjectData() {
    return (
        <UiEntity
            key={"editobjectdatainfo"}
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
            <UiEntity
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
            />

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
                {generateComponentViews()}

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
                        switch(visibleComponent){
                            case COMPONENT_TYPES.NPC_COMPONENT:
                                if(npcComponentView === "wAdd"){
                                    updateNPCView('wMain')
                                }
                        
                                else if(npcComponentView === "wMain"){
                                    updateNPCView('main')
                                }
                                else{
                                    openEditComponent("")
                                }
                                break;

                            case COMPONENT_TYPES.TRIGGER_COMPONENT:
                                if(triggerView === "actions" || triggerView == "add"){
                                    updateActionView("list")
                                }

                                else{
                                    openEditComponent("")
                                }
                                
                                break;

                            case COMPONENT_TYPES.DIALOG_COMPONENT:
                                if(dialogView === "addbutton"){
                                    updateDialogView("add")
                                }else if(dialogView === "add"){
                                    updateDialogView("list")
                                }else{
                                    openEditComponent("")
                                }
                                break;

                            case COMPONENT_TYPES.ACTION_COMPONENT:
                                console.log("pressing back on action component", selectedActionIndex, actionTweenView, acionMainview)
                                disableTweenPlacementEntity()
                                if(acionMainview === "list"){
                                    openEditComponent("")
                                }else{
                                    switch(selectedActionIndex){
                                        case 14:
                                            switch(actionTweenView){
                                                case 'main':
                                                    updateActionComponentView("list")
                                                    break;
    
                                                case 'end':
                                                    updateActionTweenView("main")
                                            }
                                            break;
    
                                        default:
                                            updateActionComponentView('list')
                                            break;
                                    }
                                }
                                break;
                            default:
                                openEditComponent("")
                        }
                        updateActionView("list")
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
                    <VisibilityComponentPanel/>
                    <CollisionComponentPanel/>

                    {/* <ImageComponentPanel/>
                    <VideoComponentPanel/>
                    <AudioComponentPanel/>
                 
                    
                    <NFTComponentPanel/>
                    <TextComponentPanel/>
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

    let components:COMPONENT_TYPES[] = [
        COMPONENT_TYPES.TRANSFORM_COMPONENT,
        COMPONENT_TYPES.VISBILITY_COMPONENT,
        COMPONENT_TYPES.COLLISION_COMPONENT,
        COMPONENT_TYPES.ADVANCED_COMPONENT
    ]

    components.forEach((component: any, i:number) => {
        arr.push(
            <UiEntity
                key={"asset-component-" + component+i}
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
                    openEditComponent(component)
                }}
            />
        )
    });
    return arr
}

function getComponents() {
    let components: any[] = []
    if (selectedItem && selectedItem.enabled && selectedItem.mode === EDIT_MODES.EDIT) {
        // log('get comp is here', selectedItem)
        let scene: IWBScene = sceneBuilds.get(selectedItem.sceneId)
        // log('scene is', scene)
        let asset = scene.ass.find((as) => as.aid === selectedItem.aid)
        // log('asset is ', asset)
        if (asset) {
            components = asset.comps ? asset.comps : []
        }
    }
    return components
}

//