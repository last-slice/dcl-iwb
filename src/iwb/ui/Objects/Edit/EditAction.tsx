
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { log } from '../../../helpers/functions'
import resources, { colors, colorsLabels } from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { Actions, COMPONENT_TYPES, SERVER_MESSAGE_TYPES, Triggers } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
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
import { AddAttachPlayerPanel } from './ActionPanels/AddAttachPlayerPanel'
import { AddBatchActionPanel, updateEntityActions } from './ActionPanels/AddBatchActionsPanel'
import { AddSetPositionPanel, addSetPositionEntity, resetSetPositionEntity } from './ActionPanels/AddSetPositionPanel'
import { AddSetScalePanel, addSetScaleEntity, resetSetScaleEntity } from './ActionPanels/AddSetScalePanel'
import { AddSetRotationPanel, addsetRotationEntity, resetSetRotationEntity } from './ActionPanels/AddSetRotationPanel'
import { AddSetStatePanel, updateEntityStates } from './ActionPanels/AddStatePanel'
import { AddSetNumberActionPanel } from './ActionPanels/AddSetNumberPanel'
import { AddSubtractNumberActionPanel } from './ActionPanels/AddSubtractNumberPanel'
import { AddShowNotificationPanel } from './ActionPanels/AddShowNotificationPanel'
import { AddMovePlayerPanel, addMovePlayerEntity, resetMovePlayerEntity } from './ActionPanels/AddMovePlayerPanel'
import { AddClonePanel, addCloneEntity, resetCloneEntity } from './ActionPanels/AddClonePanel'
import { AddRandomActionPanel } from './ActionPanels/AddRandomAction'
import { AddLoopPanel, updateAssetActionsLoopPanel } from './ActionPanels/AddLoop'
import { resetLevelSpawnEntity } from './EditLevel'

export let actionView = "main"
export let newActionData:any = {}

export let newActionIndex:number = 0

export function updateActionView(value:string){
    actionView = value

    if(actionView === "main"){
        newActionData = {}
    }
}

export function updateActionData(value:any, clear?:boolean){
    for(let key in value){
        newActionData[key] = value[key]
    }
    console.log(newActionData)
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
                width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
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
                textAlign: 'middle-center'
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
                alignContent:'center',
                width: '100%',
                height: '10%',
            }}
                uiText={{value:"Add Action", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
            />

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
                    selectedIndex={newActionIndex}
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
                setUIClicked(false)
                buildAction()
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
            uiText={{value:"" + data.name, textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
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
    resetActionData()
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
            updateAssetAnimations()
            return <AddAnimationActionPanel/>

        case Actions.ATTACH_PLAYER.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddAttachPlayerPanel/>

        case Actions.BATCH_ACTIONS.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            updateEntityActions()
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
            updateEntityStates()
            return <AddSetStatePanel/>

        case Actions.SHOW_NOTIFICATION.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddShowNotificationPanel/>

        case Actions.RANDOM_ACTION.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddRandomActionPanel/>

        case Actions.START_LOOP.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            updateAssetActionsLoopPanel()
            return <AddLoopPanel/>


        //play sound - doesnt need any action metadata//
        //stop sound - doesnt need any action metadata
        //play video - doesnt need any action metadata
        //stop video - doesnt need any action metadata
        //stop animations - doesnt need any action metadata

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
    console.log('final action data is', newActionData)
    await update("add", newActionData)
    updateActionView("main")
    selectNewActionIndex(0)

    //clean up actions
    resetSetPositionEntity()
    resetSetRotationEntity()
    resetSetScaleEntity()
    resetMovePlayerEntity()
    resetCloneEntity()
    resetLevelSpawnEntity()
}

function resetActionData(){
    if(newActionIndex !== 0){
        newActionData.type = getActionList()[newActionIndex].replace(" ", "_").toLowerCase()
        newActionData.name = getActionList()[newActionIndex].replace(" ", "_").toLowerCase()
        let actionTemplate:any = {...ActionDefaults[getActionList()[newActionIndex].replace(" ", "_").toLowerCase()]}//
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
        vMask:0
    },
    [Actions.PLAY_ANIMATION]:{
        loop:0,
        anim:""
    },
    [Actions.SHOW_TEXT]:{
        text:"",
        size:25,
        font:0,
        textAlign:4
    },
    [Actions.ATTACH_PLAYER]:{
        anchor:AvatarAnchorPointType.AAPT_POSITION,
    },
    [Actions.BATCH_ACTIONS]:{
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
    [Actions.SET_STATE]:{
        state:"",
    },
    [Actions.SHOW_NOTIFICATION]:{
        message:"",
        return:true,
        time:5
    },
    [Actions.RANDOM_ACTION]:{
        actions:[]
    },
    [Actions.START_LOOP]:{
        actions:[],
        timer:1
    },
}