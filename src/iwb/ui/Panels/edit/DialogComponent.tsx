
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
import { localPlayer } from '../../../components/player/player'

export let dialogView = "list"

export let dArray:any[] = []
export let visibleItems:any[] = []
export let visibleIndex:number = 1

let selectedActionIndex:number = 0
let newButton:any = {
    actions:[],
    label:"",
}

let actionNames:string[] = []
let actionIds:string[] = []
let actionLabels:any[] = []

let dialog:any = {
    name:"",
    dialogs:[]
}

let newDialog:any = {
    text:"",
    name:"",
    buttons:[]
}

export function updateDialogView(v:string){
    dialogView = v

    if(v === "list"){
        visibleIndex = 1
        refreshDialogs()
    }

    if(v === "addbutton"){
        newButton.actions.length = 0
        updateTriggerActions()
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

        {/* add dialog button row */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{bottom:"2%"},
                display: dialogView === "list" ? "flex" : "none"
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
            newDialog.buttons.length = 0
            newDialog.text = ""
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
                display: dialogView === "add" ? "flex" : "none"
            }}
            // uiBackground={{color:Color4.Green()}}
            >

             {/* action data panel */}
             <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '85%',
                margin:{top:"5%", bottom:'1%'}
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
    uiText={{value:"New Dialog Sentence", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
    />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '20%',
        }}
    >
    <Input
        onChange={(value)=>{
            newDialog.text = value
        }}
        fontSize={sizeFont(20,12)}
        placeholder={'Enter dialog sentence'}
        placeholderColor={Color4.White()}
        color={Color4.White()}
        uiTransform={{
            width: '100%',
            height: '100%',
        }}
        ></Input>
    </UiEntity>


    {/* dialog buttons */}
    <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '15%',
            margin:{top:'1%'}
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
    uiText={{value:"Dialog buttons", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
    />

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
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '70%',
            height: '100%',
            display: newDialog.buttons && (newDialog.buttons.length === 0 || newDialog.buttons.length < 4) ? 'flex' : 'none'
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
        }}
        uiText={{value: "Add Button", fontSize: sizeFont(20, 16)}}
        onMouseDown={() => {
            updateDialogView("addbutton")
        }}
    />

    </UiEntity>

    </UiEntity>

    <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '50%',
            margin:{top:'1%'}
        }}
    >
        {generateButtonRows()}

        </UiEntity>

            </UiEntity>

        
                    {/* add dialog confirm buttons */}
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


            {/* dialog rows */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '80%',
                display: dialogView === "list" ? "flex" : "none"
            }}
            >   
            {generateActionRows()}
            </UiEntity>


            {/* add new dialog panel */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '95%',
                display: dialogView === "addbutton" ? "flex" : "none"
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
            uiText={{value:"Button Label", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
            />

                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '12%',
                }}
            >
            <Input
                onChange={(value)=>{
                    newButton.label = value
                }}
                fontSize={sizeFont(20,12)}
                placeholder={'Enter button label'}
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
                    width: '100%',
                    height: '10%',
                    margin:{top:'1%', bottom:"1%"}
                }}
            uiText={{value:"Button Actions List", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
            />


                <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '12%',
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
        key={"button-action-list-dropdown"}
        options={[...actionNames]}
        selectedIndex={selectedActionIndex}
        onChange={selectAction}
        uiTransform={{
            width: '100%',
            height: '120%',
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
                width: '50%',
                height: '100%',
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
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
        }}
        uiText={{value: "Add Action", fontSize: sizeFont(20, 16)}}
        onMouseDown={() => {
            newButton.actions.push({id:actionIds[selectedActionIndex], name:actionNames[selectedActionIndex]})
        }}
    />
                </UiEntity>

            </UiEntity>



            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '40%',
        }}
    >

        {generateButtonActionRows()}


    </UiEntity>

            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '15%',
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
        uiText={{value: "Add Button", fontSize: sizeFont(20, 16)}}
        onMouseDown={() => {
            newDialog.buttons ? newDialog.buttons.push({...newButton}) : newDialog.buttons = [{...newButton}]
            updateDialogView("add")
            newButton = {
                actions:[],
                label:"",
            }
        }}
    />

    </UiEntity>

            </UiEntity>
     
        </UiEntity>
    )
}



function generateButtonRows(){
    let arr:any[] = []
    let count = 0

    if(newDialog.buttons){
        newDialog.buttons.forEach((button:any, i:number)=>{
            arr.push(<ButtonRow button={button} rowCount={count} />)
            count++
        })
    }

    return arr
}

function ButtonRow(dialog:any){
    let button = dialog.button

    return(
        <UiEntity
        key={"dialog-button-row-"+ dialog.rowCount}
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
                width: '75%',
                height: '100%',
            }}
            >

            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
            }}
            uiText={{value:"" + button.label, fontSize:sizeFont(20,15), color:Color4.White()}}
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
            newDialog.buttons.splice(dialog.rowCount, 1)
        }}
    />


        </UiEntity>


            </UiEntity>
    )
}

function generateButtonActionRows(){
    let arr:any[] = []
    let count = 0

    if(newButton.actions){
        newButton.actions.forEach((action:any, i:number)=>{
            arr.push(<ButtonActionRow action={action} rowCount={count} />)
            count++
        })
    }

    return arr
}

function ButtonActionRow(dialog:any){
    let action = dialog.action
    return(
        <UiEntity
        key={"dialog-button-action-row-"+ dialog.rowCount}
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
                width: '75%',
                height: '100%',
            }}
            >

            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
            }}
            uiText={{value:"" + action.name, fontSize:sizeFont(20,15), color:Color4.White()}}
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
            newButton.actions.splice(dialog.rowCount, 1)
        }}
    />


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


            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80%',
                height: '100%',
                margin:{left:'2%'}
            }}
            uiText={{value:"" + data.text.substring(0, 35) + "...", fontSize:sizeFont(20,15), color:Color4.White(), textAlign:'middle-left'}}
        />

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
    selectedActionIndex = index
}

function buildAction(){
    // refreshItems()
    updateDialogView("list")
    updateAction("add", "new", {dialog: newDialog})
}

function updateAction(action:any, type:string, value:any){
    console.log()
    sendServerMessage(SERVER_MESSAGE_TYPES.UPDATE_ITEM_COMPONENT, {component:COMPONENT_TYPES.DIALOG_COMPONENT, action:action, type:type, data:{aid:selectedItem.aid, sceneId:selectedItem.sceneId, value:value}})
}

export function updateTriggerActions(){
    actionNames.length = 0
    actionIds.length = 0
    actionLabels.length = 0
    if(localPlayer.activeScene){
        localPlayer.activeScene.ass.forEach((asset)=>{
            if(asset.actComp){
                asset.actComp.actions.forEach((action:any, key:any)=>{
                    actionNames.push(action.name)
                    actionIds.push(key)
                    actionLabels.push(action.type)
                })
            }
        })
    }
}