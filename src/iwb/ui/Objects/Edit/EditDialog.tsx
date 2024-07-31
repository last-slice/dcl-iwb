
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { log } from '../../../helpers/functions'
import resources, { colors, colorsLabels } from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { COMPONENT_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
import { visibleComponent } from '../EditAssetPanel'
import { generateButtons, setUIClicked, setupUI } from '../../ui'
import { uiSizes } from '../../uiConfig'
import { utils } from '../../../helpers/libraries'

//

let dialogData:any = {}
let newDialogData:any = {
    text:""
}
let editDialogData:any = {}
let newButton:any = {}
let newAction:any = {}

let entities:any[] = []
let entitiesWithActions:any[] = []

let selectedEntityIndex:number = 0
let selectedActionIndex:number = 0
let buttonActions:any[] = []

export let dialogView:string = "main"

export function updateTriggerActionsPanel(){
    buttonActions.length = 0
    entities.length = 0
    entities = getAllAssetNames(selectedItem.sceneId)
}

export function getAllAssetNames(sceneId:string, sort?:boolean){
    let scene = colyseusRoom.state.scenes.get(sceneId)
    if(!scene){
        return []
    }

    let names:any[] = []
    scene[COMPONENT_TYPES.NAMES_COMPONENT].forEach((nameComponent:any, aid:string) => {
        names.push({name:nameComponent.value, aid:aid})
    });

    if(sort){
        names.sort((a:any, b:any)=> a.name.localeCompare(b.name))
    }
    return names
}

export function updateEntityActions(aid:string){
    entitiesWithActions.length = 0
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }
    
    let actions = scene[COMPONENT_TYPES.ACTION_COMPONENT].get(aid)
    if(actions && actions.actions.length > 0){
        actions.actions.forEach((action:any)=>{
            entitiesWithActions.push(action)
        })
    }
    console.log('entity actions are ', entitiesWithActions)
}

export function updateDialog(main?:boolean){
    if(main){
        dialogView = "main"
    }
    
    dialogData = {}
    newButton = {}
        newDialogData = {
            text:""
        }

    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }

    dialogData = scene[COMPONENT_TYPES.DIALOG_COMPONENT].get(selectedItem.aid)

    if(dialogView === "edit"){
        let currentDialog = {...dialogData.dialogs[editDialogData.index]}
        editDialogData.text = currentDialog.text
        editDialogData.buttons = []
        currentDialog.buttons && currentDialog.buttons.forEach((button:any)=>{
            editDialogData.buttons.push(button)
        })
        buttonActions.length = 0
        console.log('edidi', editDialogData.buttons)
    }
}

export function updateDialogView(view:string, currentDialogIndex?:any){
    dialogView = view

    if(view === "add"){
        dialogData = {}
        dialogData.text = ""
    }

    if(view === "edit"){
        let currentDialog = {...dialogData.dialogs[currentDialogIndex]}
        //
        editDialogData.index = currentDialogIndex
        editDialogData.text = currentDialog.text
        editDialogData.buttons = []
        currentDialog.buttons && currentDialog.buttons.forEach((button:any)=>{
            editDialogData.buttons.push(button)
        })
    }
}

export function EditDialog() {
    return (
        <UiEntity
            key={resources.slug + "edit::dialog::panel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.DIALOG_COMPONENT ? 'flex' : 'none',
            }}
        >

            <MainView/>
            <AddDialogView/>
            <AddButtonView/>
            <EditView/>
            
        
        </UiEntity>
    )
}

function MainView(){
    return(
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display: dialogView === "main" ? "flex" : "none"
        }}
    >
        <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin:{bottom:'1%'}
                }}
                >
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
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                        }}
                    uiText={{value:"Add Dialog", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
                    />

                    </UiEntity>

                    <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '25%',
                    height: '100%',
                    margin:{left:'1%'}
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
                        value: "Add",
                        fontSize: sizeFont(25, 15),
                        color: Color4.White(),
                        textAlign: 'middle-center'
                    }}
                    onMouseDown={() => {
                        setUIClicked(true)
                        dialogView = "add"
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
        justifyContent: 'center',
        width: '100%',
        height: '10%',
        margin:{bottom:'2%'}
    }}
    uiText={{value:"Current Dialogs", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
    />

        {selectedItem && selectedItem.enabled && visibleComponent === COMPONENT_TYPES.DIALOG_COMPONENT && getDialogs()}

    </UiEntity>
    )
}

function AddDialogView(){
    return(
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: dialogView === "add" ? "flex" : "none"
            }}
        >
             <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '10%',
                        margin:{bottom:'1%'}
                    }}
                    >
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
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '100%',
                            }}
                        uiText={{value:"Add Dialog Text", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
                        />

                        </UiEntity>

                        <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '25%',
                        height: '100%',
                        margin:{left:'1%'}
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
                            value: "Add",
                            fontSize: sizeFont(25, 15),
                            color: Color4.White(),
                            textAlign: 'middle-center'
                        }}
                        onMouseDown={() => {
                            setUIClicked(true)
                            addDialog(newDialogData)
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
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
            >

            <Input
                onChange={(value) => {
                    newDialogData.text = value.trim()
                }}
                onSubmit={(value) => {
                    newDialogData.text = value.trim()
                }}
                fontSize={sizeFont(20,15)}
                placeholder={'enter dialog text'}
                placeholderColor={Color4.White()}
                color={Color4.White()}
                uiTransform={{
                    width: '100%',
                    height: '100%',
                }}
                ></Input>

        </UiEntity>

        </UiEntity>
    )
}

function AddButtonView(){
    return(
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
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
                }}
                uiText={{value:"Dialog: " + (editDialogData && editDialogData.text), fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
                />
        <UiEntity
                            uiTransform={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '10%',
                                margin:{bottom:'1%'}
                            }}
                            >
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
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '100%',
                                        height: '100%',
                                    }}
                                uiText={{value:"Button Config", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
                                />

                                </UiEntity>

                                <UiEntity
                            uiTransform={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '25%',
                                height: '100%',
                                margin:{left:'1%'}
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
                                    textWrap:'nowrap',
                                    value: "Add",
                                    fontSize: sizeFont(25, 15),
                                    color: Color4.White(),
                                    textAlign: 'middle-center'
                                }}
                                onMouseDown={() => {
                                    setUIClicked(true)
                                    // editDialogData.buttons.push(newButton)
                                    // newDialogData.buttons ? newDialogData.buttons.push(button) : newDialogData.buttons = [button]
                                    updateDialogView("edit", editDialogData.index)
                                    update('addbutton', {index: editDialogData.index, button:newButton, actions:buttonActions.map(($:any)=> $.id)})
                                    utils.timers.setTimeout(()=>{
                                        updateDialog()
                                    }, 200)
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
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
            >

            <Input
                onChange={(value) => {
                    newButton.label = value.trim()
                }}
                onSubmit={(value) => {
                    newButton.label = value.trim()
                }}
                fontSize={sizeFont(20,15)}
                placeholder={'button label'}
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
    justifyContent: 'flex-start',
    alignContent:'center',
    width: '100%',
    height: '70%',
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

{/* action entity dropdown */}
<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent:'center',
        width: '100%',
        height: '10%',
    }}
    >

    <Dropdown
        // options={[...["Select Entity"], ...getEntityList()]}
        options={[...["Select Entity"], ...entities.map($=> $.name)]}
        selectedIndex={0}
        onChange={selectEntityIndex}
        uiTransform={{
            width: '100%',
            height: '100%',
        }}
        color={Color4.White()}
        fontSize={sizeFont(20, 15)}
    />

    </UiEntity>

            {/* action entity actions dropdown */}
<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent:'center',
        width: '100%',
        height: '10%',
        margin:{top:"1%"}
    }}
    >

    <Dropdown
        options={[...["Select Action"], ...entitiesWithActions.map(($:any)=> $.name)]}
        // options={entitiesWithActions.length > 0 ? [...["Select Action"], ...entitiesWithActions[entityIndex].actions.map((item:any) => item.name).sort((a:any,b:any)=> a.localeCompare(b))] : []}
        selectedIndex={0}
        onChange={selectActionIndex}
        uiTransform={{
            width: '100%',
            height: '100%',
            display: selectedEntityIndex !== 0 ? "flex" : "none"
        }}
        color={Color4.White()}
        fontSize={sizeFont(20, 15)}
    />

    </UiEntity>

        {/* add action button */}
        <UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf:'flex-start',
        margin:{top:"1%"},
        display: selectedEntityIndex !== 0 ? "flex" : "none",
        width: calculateImageDimensions(10, getAspect(uiSizes.buttonPillBlack)).width,
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
        buttonActions.push({...newAction})
        // let info:any = {...newAction}
        // info.tid = selectedTrigger.id
        // update("addaction", info)
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
            width: '100%',
            height: '10%',
            }}
            uiText={{value:"Current Actions", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
            />

            <UiEntity
                uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '70%',
                }}
                >
                    {dialogView === "addbutton" && getActions()}

                </UiEntity>

    </UiEntity>

        </UiEntity>
    )
}

function EditView(){
    return(
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: dialogView === "edit" ? "flex" : "none"
            }}
        >

        <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                }}
            uiText={{value:"Edit Dialog", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
            />

<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
            >

            <Input
                onChange={(value) => {
                    editDialogData.text = value.trim()
                    update('update', editDialogData)
                }}
                onSubmit={(value) => {
                    editDialogData.text = value.trim()
                }}
                fontSize={sizeFont(20,15)}
                placeholder={'' + (editDialogData && editDialogData.text)}
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
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '10%',
                        margin:{bottom:'1%'}
                    }}
                    >
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
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '100%',
                            }}
                        uiText={{value:"Add Buttons", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
                        />

                        </UiEntity>

                        <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '25%',
                        height: '100%',
                        margin:{left:'1%'}
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
                            value: "Add",
                            fontSize: sizeFont(25, 15),
                            color: Color4.White(),
                            textAlign: 'middle-center'
                        }}
                        onMouseDown={() => {
                            setUIClicked(true)
                            updateTriggerActionsPanel()
                            updateDialogView("addbutton")
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
            width: '100%',
            height: '70%',
            display: dialogView === "edit" ? "flex" : "none"
        }}
        >
        <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin:{bottom:'2%'}//
                }}
                uiText={{value:"Current Buttons", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
                />

        {selectedItem && selectedItem.enabled && dialogView === "edit" && getButtons()}

        </UiEntity>

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '70%',
            display: dialogView === "addbutton" ? "flex" : "none"
        }}
        >
            <AddButtonView/>
        </UiEntity>

       

        </UiEntity>
    )
}

function getDialogs(){
    let arr:any[] = []
    let count = 0
    dialogData && dialogData.dialogs.forEach((dialog:any, i:number)=>{
        arr.push(<Row dialog={dialog} count={count} />)
        count++
    })
    return arr
}

function getButtons(){
    let arr:any[] = []
    let count = 0
    editDialogData && editDialogData.buttons.forEach((button:any, i:number)=>{
        arr.push(<Row dialog={button} count={count} />)
        count++
    })
    return arr
}

function Row(info:any){
    let data:any = info.dialog
    return(
        <UiEntity
        key={resources.slug + "-dialog-row-"+ info.count}
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '7%',
                margin:{top:"1%", bottom:'1%', left:"2%", right:'2%'}
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
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40%', 
                height: '100%',
                margin:{left:'1%'}
            }}
            uiText={{value:"" + (data.text ? data.text : data.label ? data.label :""), textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
            />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40%', 
                height: '100%',
                margin:{left:'1%'}//
            }}
            uiText={{value:"" + ((data.actions ? data.actions.length + " Actions" : (data.buttons ? data.buttons.length + " buttons" : 0 + " buttons"))), textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
            />

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
        width: calculateImageDimensions(1.5, getAspect(uiSizes.pencilEditIcon)).width,
        height: calculateImageDimensions(1.5, getAspect(uiSizes.pencilEditIcon)).height,
        margin:{left:"1%"},
        display: data.actions ? "none" : "flex"
    }}
    uiBackground={{
        textureMode: 'stretch',
        texture: {
            src: 'assets/atlas1.png'
        },
        uvs: getImageAtlasMapping(uiSizes.pencilEditIcon)
    }}
    onMouseDown={() => {
        setUIClicked(true)
        updateDialogView("edit", info.count)
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
                    setUIClicked(true)
                    if(data.actions){
                        update("deletebutton", {index: editDialogData.index, buttonId: info.count})
                        updateDialogView("edit", editDialogData.index)
                        utils.timers.setTimeout(()=>{
                            updateDialog()
                        }, 200)
                    }else{
                        update("delete", {value:info.count})
                    }
                    
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
            />
                </UiEntity>

            </UiEntity>
    )
}

function ActionRow(info:any){
    let data:any = info.action
    return(
        <UiEntity
        key={resources.slug + "-dialog-action-row-"+ info.count}
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
                margin:{top:"1%", bottom:'1%', left:"2%", right:'2%'}
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
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40%', 
                height: '100%',
                margin:{left:'1%'}
            }}
            uiText={{value:"" + (data.name), textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
            />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40%', 
                height: '100%',
                margin:{left:'1%'}//
            }}
            uiText={{value:"" + (data.type), textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
            />

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

{/* <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: calculateImageDimensions(1.5, getAspect(uiSizes.pencilEditIcon)).width,
        height: calculateImageDimensions(1.5, getAspect(uiSizes.pencilEditIcon)).height,
        margin:{left:"1%"},
        display: data.actions ? "none" : "flex"
    }}
    uiBackground={{
        textureMode: 'stretch',
        texture: {
            src: 'assets/atlas1.png'
        },
        uvs: getImageAtlasMapping(uiSizes.pencilEditIcon)
    }}
    onMouseDown={() => {
        setUIClicked(true)
        updateDialogView("edit", info.count)
    }}
    onMouseUp={()=>{
        setUIClicked(false)
    }}
/> */}

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
                    setUIClicked(true)
                    // update("deleteaction", {index: editDialogData.index, buttonId: info.count})
                    // updateDialogView("edit", editDialogData.index)
                    // utils.timers.setTimeout(()=>{
                    //     updateDialog()
                    // }, 200)
                    buttonActions.splice(info.count, 1)
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
            />
                </UiEntity>

            </UiEntity>
    )
}

function update(action:string, data:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET,
        {
            component:COMPONENT_TYPES.DIALOG_COMPONENT,
            aid:selectedItem.aid,
            sceneId:selectedItem.sceneId,
            action:action,
            data:data,
        }
    )
}

function addDialog(data:any){
    update('add', data)
    updateDialogView("edit")
    utils.timers.setTimeout(()=>{
        updateDialog(true)
    }, 200)
}

function selectEntityIndex(index:number){
    console.log('select entity index', index)
    selectedEntityIndex = index
    if(index !== 0){
        updateEntityActions(entities[index-1].aid)
    }
}

function selectActionIndex(index:number){
    console.log('select action index', index)
    selectedActionIndex = index
    if(index !== 0){
        newAction = entitiesWithActions[index-1]
        console.log('new action is', entitiesWithActions[index-1])
    }
}

function getActions(){
    let arr:any[] = []
    let count = 0
    buttonActions.forEach((action:any, i:number)=>{
        arr.push(<ActionRow action={action} count={count} />)
        count++
    })
    return arr
}