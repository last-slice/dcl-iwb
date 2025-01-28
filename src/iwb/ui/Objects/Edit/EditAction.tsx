
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { log } from '../../../helpers/functions'
import resources, { colors, colorsLabels } from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { Actions, COMPONENT_TYPES, SERVER_MESSAGE_TYPES, Triggers } from '../../../helpers/types'
import { resetAdditionalAssetFeatures, selectedItem } from '../../../modes/Build'
import { visibleComponent } from '../EditAssetPanel'
import { setUIClicked } from '../../ui'
import { uiSizes } from '../../uiConfig'
import { AddNumberActionPanel } from './ActionPanels/AddNumberPanel'
import { AddLinkActionPanel } from './ActionPanels/AddLinkPanel'
import { AddEmoteActionPanel } from './ActionPanels/AddEmotePanel'
import { AddVisibilityActionPanel } from './ActionPanels/AddVisibilityPanel'
import { AddAnimationActionPanel, updateAssetAnimations } from './ActionPanels/AddAnimationPanel'
import { AddShowTextPanel } from './ActionPanels/AddShowTextPanel'
import { AvatarAnchorPointType } from '@dcl/sdk/ecs'
import { addActionAttachEntity, AddAttachPlayerPanel } from './ActionPanels/AddAttachPlayerPanel'
import { AddBatchActionPanel, updateEntitiesWithActions, updateEntityActions } from './ActionPanels/AddBatchActionsPanel'
import { AddSetPositionPanel, addSetPositionEntity, resetSetPositionEntity } from './ActionPanels/AddSetPositionPanel'
import { AddSetScalePanel, addSetScaleEntity, resetSetScaleEntity } from './ActionPanels/AddSetScalePanel'
import { AddSetRotationPanel, addsetRotationEntity, resetSetRotationEntity } from './ActionPanels/AddSetRotationPanel'
import { AddSetStatePanel, updateEntityStates } from './ActionPanels/AddStatePanel'
import { AddSetNumberActionPanel } from './ActionPanels/AddSetNumberPanel'
import { AddSubtractNumberActionPanel } from './ActionPanels/AddSubtractNumberPanel'
import { AddShowNotificationPanel } from './ActionPanels/AddShowNotificationPanel'
import { AddMovePlayerPanel, addMovePlayerEntity, resetMovePlayerEntity } from './ActionPanels/AddMovePlayerPanel'
import { AddClonePanel, addCloneEntity, resetCloneEntity } from './ActionPanels/AddClonePanel'
import { AddRandomActionPanel, updateEntitiesWithRandomActions } from './ActionPanels/AddRandomAction'
import { AddLoopPanel, updateAssetActionsLoopPanel } from './ActionPanels/AddLoop'
import { addTweenActionEntity, AddTweenActionPanel } from './ActionPanels/AddTweenPanel'
import { AddTeleport } from './ActionPanels/AddTeleportPanel'
import { AddDelayActionPanel, updateDelayEntitiesWithActions } from './ActionPanels/AddDelay'
import { AddPopupPanel, showPopupPanel } from './ActionPanels/AddPopupPanel'
import { AddRandomNumberPanel } from './ActionPanels/AddRandomNumberPanel'
import { AddVolumeUpPanel } from './ActionPanels/AddVolumeUpPanel'
import { AddFollowPathPanel } from './ActionPanels/AddFollowPathPanel'
import { AddQuestActionPanel, updateQuests } from './ActionPanels/AddQuestAction'
import { AddCameraChangelPanel } from './ActionPanels/AddChangeCameraPanel'
import { AddCameraForcePanel } from './ActionPanels/AddForceCameraPanel'
import { AddPlayerEquipWeaponPanel } from './ActionPanels/AddPlayerEquipWeaponPanel'
import { AddQuestStartPanel, updateQuestsList } from './ActionPanels/AddQuestStart'
import { quests } from '../../../components/Quests'
import { AddVerifyAccessPanel, resetVerify } from './ActionPanels/AddVerifyPanel'
import { AddSetText, resetAddSetText } from './ActionPanels/AddSetText'
import { AddInputModifierActionPanel, resetInputModifierActionPanel } from './ActionPanels/AddInputFreezePanel'
import { AddSetGravityPanel } from './ActionPanels/AddSetGravityPanel'
import { AddUpdatePhysicsMaterial, updateAllContactMaterials } from './ActionPanels/AddUpdatePhysicsMaterial'
import { AddUpdatePhysicsMass } from './ActionPanels/AddUpdatePhysicsMass'

export let actionView = "main"
export let currentAddActionPanel:string = ""
export let newActionData:any = {}

export let newActionIndex:number = 0
export let newActionPipelineIndex:number = 0

let actionPipelines:any[] = ["Individual", "Everyone"]

export function updateActionView(value:string){
    actionView = value

    if(actionView === "main"){
        newActionData = {}
    }

    if(actionView === "add"){
        newActionIndex = 0
        newActionPipelineIndex = 0
    }
}

export function updateActionData(value:any, clear?:boolean){
    for(let key in value){
        newActionData[key] = value[key]
    }
    console.log('newactiondata is', newActionData)
}

export function refreshActionPanel(){
    let scene:any = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }

    actionPipelines = ["Individual", "Everyone"]
    let count = 0
    scene[COMPONENT_TYPES.GAME_COMPONENT].forEach((game:any)=>{
        count++
    })
    
    if(count > 0){
        console.log('have game')
        actionPipelines.push("Team")
    }
}

export function EditAction(){
    return (
        <UiEntity
        key={resources.slug + "advanced::action:panel::ui"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.ACTION_COMPONENT ? 'flex' : 'none',
            }}
        >

            {/* main action panel view */}
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent:'center',
            width: '100%',
            height: '100%',
            display: actionView === "main" ? "flex" : "none"
        }}
        >
                    <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf:'flex-start',
                width: calculateImageDimensions(7, getAspect(uiSizes.buttonPillBlack)).width,
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
                value: "Add Action",
                fontSize: sizeFont(25, 15),
                color: Color4.White(),
                textAlign: 'middle-center',
                textWrap:'nowrap'
            }}
            onMouseDown={() => {
                setUIClicked(true)
                updateActionView("add")
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
            alignContent:'center',
            width: '100%',
            height: '10%',
        }}
            uiText={{value:"Current Actions", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
        />

        {/* current action list container */}
            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            alignContent:'center',
            width: '100%',
            height: '70%',
        }}
        > 
    
        {selectedItem && selectedItem.enabled && getActions()}

        </UiEntity>

        </UiEntity>

        {/* add action panel view */}
        <UiEntity
            uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            alignContent:'center',
            width: '100%',
            height: '100%',
            display: actionView === "add" ? "flex" : "none"
            }}
        >


            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{bottom:'1%'}
            }}
            >

                <Dropdown
                    options={getActionList()}
                    selectedIndex={0}
                    onChange={selectNewActionIndex}
                    uiTransform={{
                        width: '100%',
                        height: '100%',
                    }}
                    // uiBackground={{color:Color4.Purple()}}
                    color={Color4.White()}
                    fontSize={sizeFont(20, 15)}
                />

            </UiEntity>

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                display: newActionIndex !== 0 ? "flex": "none"
            }}
        >

        <Input
            onChange={(value) => {
                newActionData.name = value.trim()
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'Enter Action Name'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
            ></Input>

        </UiEntity>


        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent:'center',
                width: '100%',
                height: '10%',
                display: newActionIndex !== 0 ? "flex" : "none"
            }}
                uiText={{value:"Choose Message Pipeline", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
            />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{bottom:'1%'},
                display: newActionIndex !== 0 ? "flex" : "none"
            }}
            >

                <Dropdown
                    options={actionPipelines}
                    selectedIndex={0}
                    onChange={selectActionPipeline}
                    uiTransform={{
                        width: '100%',
                        height: '100%',
                    }}
                    // uiBackground={{color:Color4.Purple()}}
                    color={Color4.White()}
                    fontSize={sizeFont(20, 15)}
                />

            </UiEntity>

        {/* action subpanel container */}
            <UiEntity
            uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            alignContent:'center',
            width: '100%',
            height: '60%',
            margin:{top:"5%"},
            display: newActionIndex !== 0 ? "flex": "none"
            }}
        >
            {actionView === "add" && getActionDataPanel()}
            </UiEntity>


            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin: {left: "1%", right: "1%"}
            }}
            >

            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40%',
                height: '100%',
                margin: {left: "1%", right: "1%"},
                display: newActionIndex !== 0 ? "flex" : "none"
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            uiText={{value: "Add Action", fontSize: sizeFont(20, 16)}}
            onMouseDown={() => {
                setUIClicked(true)
                buildAction()
                setUIClicked(false)
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

function getActions(){
    let arr:any[] = []
    let count = 0
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(scene){
        let actions = scene[COMPONENT_TYPES.ACTION_COMPONENT].get(selectedItem.aid)
        if(actions){
            actions.actions.forEach((action:any, i:number)=>{
                arr.push(<ActionRow data={action} rowCount={count} />)
                count++
            })
        }
    }
    return arr
}

export function ActionRow(info:any){
    let data:any = info.data
    return(
        <UiEntity
        key={resources.slug + "action-row-"+ info.rowCount}
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:"1%", bottom:'1%', left:"2%", right:'2%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.rowPillDark)}}
                >

            {/* action name column */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80%',
                height: '100%',
                margin:{left:'2%'}
            }}
            uiText={{value:"" + data.name + " - " + data.id, textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
            />
{/* 
             <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40%', 
                height: '100%',
            }}
            uiText={{value:"" + (data.type && data.type.replace(/_/g, ' ').replace(/\b\w/g, (char:any) => char.toUpperCase())), fontSize:sizeFont(20,15), color:Color4.White()}}
            /> */}

            {/* action edit buttons column */}
            <UiEntity
            uiTransform={{
                flexDirection: 'row',
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
                    width: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).width,
                    height: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).height,
                    margin:{left:"1%"}
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas1.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.trashButton)
                }}
                onMouseDown={() => {
                    // updateTrigger('delete', 'remove', trigger.rowCount)
                    update("delete", {id:data.id})
                }}
            />
                </UiEntity>

            </UiEntity>
    )
}

export function getActionList(){
    return [...["Select New Action"],...Object.values(Actions).map(str => str.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())).sort((a,b)=> a.localeCompare(b))]
}


function selectNewActionIndex(index:number){
    newActionIndex = index
    console.log('new action index is ', index)
    resetActionData()
}

function selectActionPipeline(index:number){
    newActionPipelineIndex = index
}

function getActionDataPanel(){
    switch(getActionList()[newActionIndex]){
        case Actions.ADD_NUMBER.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddNumberActionPanel/>

        case Actions.SET_NUMBER.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddSetNumberActionPanel/>

        case Actions.SUBTRACT_NUMBER.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddSubtractNumberActionPanel/>

        case Actions.OPEN_LINK.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddLinkActionPanel/>

        case Actions.EMOTE.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddEmoteActionPanel/>

        case Actions.SET_VISIBILITY.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddVisibilityActionPanel/>

        case Actions.SHOW_TEXT.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddShowTextPanel/>

        case Actions.PLAY_ANIMATION.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddAnimationActionPanel/>

        case Actions.ATTACH_PLAYER.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddAttachPlayerPanel/>

        case Actions.BATCH_ACTIONS.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddBatchActionPanel/>

        case Actions.SET_POSITION.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddSetPositionPanel/>

        case Actions.SET_ROTATION.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddSetRotationPanel/>

        case Actions.SET_SCALE.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddSetScalePanel/>

        case Actions.MOVE_PLAYER.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddMovePlayerPanel/>

        case Actions.CLONE.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddClonePanel/>

        case Actions.SET_STATE.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddSetStatePanel/>

        case Actions.SHOW_NOTIFICATION.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddShowNotificationPanel/>

        case Actions.RANDOM_ACTION.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddRandomActionPanel/>

        case Actions.START_LOOP.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddLoopPanel/>

        case Actions.START_TWEEN.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddTweenActionPanel/>

        case Actions.TELEPORT_PLAYER.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddTeleport/>

         case Actions.START_DELAY.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddDelayActionPanel/>

        case Actions.POPUP_SHOW.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddPopupPanel/>

        case Actions.RANDOM_NUMBER.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddRandomNumberPanel/>


        case Actions.VOLUME_UP.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddVolumeUpPanel/>

        case Actions.VOLUME_DOWN.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddVolumeUpPanel/>

        case Actions.VOLUME_SET.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddVolumeUpPanel/>

        case Actions.FOLLOW_PATH.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddFollowPathPanel/>

          case Actions.QUEST_ACTION.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddQuestActionPanel/>

        case Actions.FORCE_CAMERA.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddCameraForcePanel/>

         case Actions.PLAYER_EQUIP_WEAPON.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddPlayerEquipWeaponPanel/>

        case Actions.QUEST_ACTION.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddQuestActionPanel/>

         case Actions.QUEST_START.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddQuestStartPanel/>

        case Actions.VERIFY_ACCESS.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddVerifyAccessPanel/>

        case Actions.SET_TEXT.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddSetText/>

        case Actions.FREEZE_PLAYER.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddInputModifierActionPanel/>

        case Actions.SET_GRAVITY.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddSetGravityPanel/>

        case Actions.UPDATE_PHSYICS_MATERIAL.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddUpdatePhysicsMaterial/>

        case Actions.UPDATE_PHYSICS_MASS.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddUpdatePhysicsMass/>
    }
}

async function update(action:string, actionData:any){
    console.log('action daga is', actionData)
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET,
        {
            component:COMPONENT_TYPES.ACTION_COMPONENT,
            aid:selectedItem.aid,
            sceneId:selectedItem.sceneId,
            action:action,
            data:actionData,
        }
    )
}

async function buildAction(){
    console.log('final action data is', {...newActionData})
    newActionData.channel = newActionPipelineIndex
    await update("add", newActionData)
    updateActionView("main")
    // selectNewActionIndex(0)

    //clean up actions////
    resetAdditionalAssetFeatures()
}

function resetActionData(){
    if(newActionIndex !== 0){
        newActionData.type = getActionList()[newActionIndex].replace(/ /g, "_").toLowerCase()
        newActionData.name = getActionList()[newActionIndex].replace(/ /g, "_").toLowerCase()
        console.log('new action index', newActionIndex, newActionData)
        console.log(getActionList()[newActionIndex])
        console.log(getActionList()[newActionIndex].replace(/ /g, "_").toLowerCase())
        let actionTemplate:any = {...ActionDefaults[getActionList()[newActionIndex].replace(/ /g, "_").toLowerCase()]}//
        console.log('action template is', actionTemplate)
        for(let key in actionTemplate){
            if(key === "actions"){
                newActionData[key] = []
            }
            else if(key === "fn"){
                actionTemplate[key]()
            }
            else{
                newActionData[key] = actionTemplate[key]
            }
        }

        if(newActionData.type === Actions.PLAY_PLAYLIST){
            newActionData.playlistAid = selectedItem.aid
        }
    }
}

const ActionDefaults:any = {
    [Actions.ADD_NUMBER]:{
        value:0
    },
    [Actions.SET_NUMBER]:{
        value:0
    },
    [Actions.SUBTRACT_NUMBER]:{
        value:0
    },
    [Actions.OPEN_LINK]:{
        url:""
    },
    [Actions.EMOTE]:{
        emote:"wave"
    },
    [Actions.SET_VISIBILITY]:{
        iMask:0,
        vMask:0,
        visible:true
    },
    [Actions.PLAY_ANIMATION]:{
        fn:()=>{updateAssetAnimations()},
        loop:0,
        anim:"",
        speed:1
    },
    [Actions.SHOW_TEXT]:{
        text:"",
        size:25,
        font:0,
        textAlign:4
    },
    [Actions.ATTACH_PLAYER]:{
        fn:()=>{addActionAttachEntity()},
        anchor:AvatarAnchorPointType.AAPT_NAME_TAG,
        x:0,
        y:0,
        z:0,
        xLook:0,
        yLook:0,
        zLook:0,
        sx:1,
        sy:1,
        sz:1,
    },
    [Actions.BATCH_ACTIONS]:{
        fn:()=>{updateEntitiesWithActions()},
        actions:[],
    },
    [Actions.SET_POSITION]:{
        fn:()=>{addSetPositionEntity()},
    },
    [Actions.SET_ROTATION]:{
        fn:()=>{addsetRotationEntity()},
    },
    [Actions.SET_SCALE]:{
        fn:()=>{addSetScaleEntity()},
    },
    [Actions.MOVE_PLAYER]:{
        fn:()=>{addMovePlayerEntity()},
    },
    [Actions.CLONE]:{
        fn:()=>{addCloneEntity()},
    },
    [Actions.SHOW_NOTIFICATION]:{
        message:"",
        return:true,
        time:5
    },
    [Actions.RANDOM_ACTION]:{
        fn:()=>{updateEntitiesWithRandomActions()},
        actions:[]
    },
    [Actions.START_LOOP]:{
        fn:()=>{updateAssetActionsLoopPanel()},
        actions:[],
        timer:1
    },
    [Actions.START_TWEEN]:{
        fn:()=>{addTweenActionEntity()},
        x:0,
        y:0,
        z:0,
        ip:0,
        ttype:0,
        timer:3,
        tloop:0,
        moveRel:true
    },
    [Actions.TELEPORT_PLAYER]:{
        fn:()=>{addTweenActionEntity()},
        x:0,
        y:0,
        ttype:0
    },
    [Actions.START_DELAY]:{
        fn:()=>{updateDelayEntitiesWithActions()},
        actions:[],
        timer:5
    },
    [Actions.POPUP_SHOW]:{
        fn:()=>{
            currentAddActionPanel = Actions.POPUP_SHOW
            showPopupPanel()
        },
        label:"Label",
        variableText:"Variable Text",
        text:"Longer text here",
        buttons:[],
        button1:{enabled:true, label:"Button 1"},
        button2:{enabled:true, label:"Button 2"},
    },
    [Actions.RANDOM_NUMBER]:{
        min:1,
        max:10
    },
    [Actions.VOLUME_UP]:{
        value:0
    },
    [Actions.VOLUME_DOWN]:{
        value:0
    },
    [Actions.VOLUME_SET]:{
        value:0
    },
    [Actions.PLAY_PLAYLIST]:{
        playlistAid:"" + (selectedItem && selectedItem.aid ? selectedItem.aid : "")
    },
    [Actions.FOLLOW_PATH]:{
        pathAid:""
    },
    [Actions.QUEST_START]:{
        fn:()=>{updateQuestsList()},
    },
    [Actions.QUEST_ACTION]:{
        fn:()=>{updateQuests()},
        questId:"",
        actionId:""
    },
    [Actions.SET_STATE]:{
        fn:()=>{updateEntityStates()}
    },
    [Actions.FORCE_CAMERA]:{
        value:0
    },
    [Actions.PLAYER_EQUIP_WEAPON]:{
        game:""
    },
    [Actions.VERIFY_ACCESS]:{
        fn:()=>{
            resetVerify()
        }
    },
    [Actions.SET_TEXT]:{
        fn:()=>{
            resetAddSetText()
        }
    },
    [Actions.FREEZE_PLAYER]:{
        fn:()=>{
            resetInputModifierActionPanel()
        }
    },
    [Actions.UPDATE_PHSYICS_MATERIAL]:{
        fn:()=>{
            updateAllContactMaterials()
        },
        vMask:0,
        iMask:0
    },
    [Actions.UPDATE_PHYSICS_MASS]:{
        value:0,
    },
}