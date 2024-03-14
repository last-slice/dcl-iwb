
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { visibleComponent } from './EditObjectDataPanel'
import { Actions, COMPONENT_TYPES, EDIT_MODES, ENTITY_ACTIONS_LABELS, ENTITY_ACTIONS_SLUGS, ENTITY_EMOTES_SLUGS, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { sendServerMessage } from '../../../components/messaging'
import { selectedItem } from '../../../components/modes/build'
import { uiSizes } from '../../uiConfig'
import { ActionLinkComponent, url } from './Actions/ActionLinkData'
import { ActionPlayAudioComponent, audioAssetIds, getSceneAudioComponents, selectedAudioIndex } from './Actions/ActionPlayAudioComponent'
import { log, paginateArray } from '../../../helpers/functions'
import { ActionAnimationComponent, selectedAnimationIndex, selectedAnimationLoop } from './Actions/ActionAnimationComponent'
import { ActionTeleportPlayerCompoent, teleportPosition } from './Actions/ActionTeleportPlayerComponent'
import { ActionPlayEmoteComponent, selectedEmoteIndex } from './Actions/ActionEmoteComponent'
import { ActionVisibilityComponent, actionVisibilityColliderVMask, actionVisibilityCollideriMask, actionVisibilityIndex } from './Actions/ActionVisibilityComponent'
import { ActionShowTextComponent, showText } from './Actions/ActionShowTextComponent'
import { ActionStartDelayComponent, startDelayAction, updateDelayActions } from './Actions/ActionStartDelayComponent'

let view = "list"
let newName:string = ""
let selectedIndex:number = 0

export let dArray:any[] = []
export let visibleItems:any[] = []
export let visibleIndex:number = 1

let dialog:any = {
    name:"",
    dialogs:[]
}

let newDialog:any = {
    text:"",
    name:""
}

export function updateDialogView(v:string){
    view = v

    if(v === "list"){
        visibleIndex = 1
        refreshDialogs()
    }
}

export function refreshDialogs(){
    visibleItems.length = 0
    let d:any = selectedItem && selectedItem.enabled && selectedItem.itemData.dialComp

    if(d){
        console.log('dialog is', d)
        dialog.name = d.name
        dialog.dialogs = d.dialogs
    }
    visibleItems = paginateArray([...d.dialogs], visibleIndex, 4)
}

export function DialogComponent() {
    return (
        <UiEntity
            key={"editdialogcomponentpanel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.DIALOG_COMPONENT ? 'flex' : 'none',
            }}
        >

        {/* add action button row */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{bottom:"2%"},
                display: view === "list" ? "flex" : "none"
            }}
            >
        
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30%',
            height: '100%',
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
        }}
        uiText={{value: "Add Dialog", fontSize: sizeFont(20, 16)}}
        onMouseDown={() => {
            updateDialogView("add")
        }}
    />

        </UiEntity>

                    {/* add new dialog panel */}
                    <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '95%',
                display: view === "add" ? "flex" : "none"
            }}
            // uiBackground={{color:Color4.Green()}}
            >

                {/* action header */}
         <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
        }}
        uiText={{value: "Add New Action", fontSize: sizeFont(20, 16), textAlign:'middle-left'}}
    />

             {/* action data panel */}
             <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '55%',
                margin:{top:"5%", bottom:'5%'}
            }}
            // uiBackground={{color:Color4.Blue()}}
        >

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            margin:{bottom:'5%'}
        }}
    uiText={{value:"New Dialog Sentence", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
    />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '25%',
        }}
    >
    <Input
        onChange={(value)=>{
            newDialog.text = value
        }}
        fontSize={sizeFont(20,12)}
        value={url}
        placeholder={'Enter dialog sentence'}
        placeholderColor={Color4.White()}
        color={Color4.White()}
        uiTransform={{
            width: '100%',
            height: '100%',
        }}
        ></Input>


    </UiEntity>

            </UiEntity>

        
                    {/* add action confirm buttons */}
            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
            // uiBackground={{color:Color4.Teal()}}
            >

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
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
        uiText={{value: "Add", fontSize: sizeFont(20, 16)}}
        onMouseDown={() => {
            updateDialogView("list")
            buildAction()
        }}
    />

<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
                height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
                margin:{left:"5%"}
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
                updateDialogView("list")
            }}
        />

        </UiEntity>


            </UiEntity>


            {/* action rows */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '80%',
                display: view === "list" ? "flex" : "none"
            }}
            >   
            {generateActionRows()}
            </UiEntity>
     
        </UiEntity>
    )
}

function generateActionRows(){
    let arr:any[] = []
    let count = 0

    visibleItems.forEach((dialog, i:number)=>{
        arr.push(<DialogRow data={dialog} rowCount={count} />)
        count++
    })
    return arr
}

function DialogRow(dialog:any){
    let data = dialog.data
    return(
        <UiEntity
        key={"dialog-row-"+ dialog.rowCount}
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
                margin:{top:"1%", bottom:'1%'}
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
                width: '40%',
                height: '85%',
            }}
            >

            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '50%',
            }}
            uiText={{value:"" + data.text.substring(0, 25) + "...", fontSize:sizeFont(20,15), color:Color4.White()}}
        />


            </UiEntity>

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
                height: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).height
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas1.png'
            },
            uvs: getImageAtlasMapping(uiSizes.trashButton)
        }}
        onMouseDown={() => {
            updateAction('delete', 'remove', {index:dialog.rowCount})
        }}
    />


        </UiEntity>


            </UiEntity>
    )
}

function selectAction(index:number){
    selectedIndex = index
}

function buildAction(){
    // refreshItems()//
    updateDialogView("list")
    updateAction("add", "new", {dialog: newDialog})
}

function updateAction(action:any, type:string, value:any){
    console.log()
    sendServerMessage(SERVER_MESSAGE_TYPES.UPDATE_ITEM_COMPONENT, {component:COMPONENT_TYPES.DIALOG_COMPONENT, action:action, type:type, data:{aid:selectedItem.aid, sceneId:selectedItem.sceneId, value:value}})
}

function getActionData(){
    switch(selectedIndex){
        case 0://
            return {aid:selectedItem.aid, url: url, type:Actions.OPEN_LINK}

        case 1:
            return {aid:audioAssetIds[selectedAudioIndex], type:Actions.PLAY_AUDIO}

        case 2:
            return {aid:selectedItem.aid, type:Actions.STOP_AUDIO}

        case 3:
            return {aid:selectedItem.aid, type:Actions.PLAY_VIDEO}

        case 4:
            return {aid:selectedItem.aid, type:Actions.TOGGLE_VIDEO}

        case 5:
            return {aid:selectedItem.aid, animLoop:selectedAnimationLoop === 0 ? false : true, animName: selectedItem.itemData.animComp.animations[selectedAnimationIndex], type:Actions.PLAY_ANIMATION}

        case 6:
            return {aid:selectedItem.aid, type:Actions.STOP_ANIMATION}

        case 7:
            return {aid:selectedItem.aid, type:Actions.TELEPORT_PLAYER, location: "" + teleportPosition.x + "," + teleportPosition.y + "," + teleportPosition.z}

        case 8:
            return {aid:selectedItem.aid, type:Actions.EMOTE, emote:ENTITY_EMOTES_SLUGS[selectedEmoteIndex]}

        case 9:
                return {aid:selectedItem.aid, type:Actions.SET_VISIBILITY, vis: actionVisibilityIndex, vMask:actionVisibilityColliderVMask, iMask:actionVisibilityCollideriMask}

        case 10:
            return {aid:selectedItem.aid, type:Actions.SHOW_TEXT, text: showText}

        case 11:
            return {aid:selectedItem.aid, type:Actions.HIDE_TEXT, text: showText}

        case 12:
            return {aid:selectedItem.aid, type:Actions.START_DELAY, delay: startDelayAction}
    }
}

function getActionDataPanel(){
    switch(selectedIndex){
        case 0:
        return <ActionLinkComponent/>

        case 1:
        case 2:
            getSceneAudioComponents()
            return <ActionPlayAudioComponent/>

        case 5:
        case 6:
            return <ActionAnimationComponent/>

        case 7:
            return <ActionTeleportPlayerCompoent/>

        case 8:
            return <ActionPlayEmoteComponent/>

        case 9:
            return <ActionVisibilityComponent/>

        case 10:
            return <ActionShowTextComponent/>

        case 11:
            return
        
        case 12:
            updateDelayActions()
            return <ActionStartDelayComponent/>
    }
}