import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { calculateSquareImageDimensions, getImageAtlasMapping, sizeFont } from '../../../helpers'
import { currentAddActionPanel, newActionData, updateActionData } from '../EditAction'
import resources from '../../../../helpers/resources'
import { displaySkinnyVerticalPanel } from '../../../Reuse/SkinnyVerticalPanel'
import { setUIClicked } from '../../../ui'
import { uiSizes } from '../../../uiConfig'
import { getAllAssetNames } from '../EditDialog'
import { selectedItem } from '../../../../modes/Build'
import { colyseusRoom } from '../../../../components/Colyseus'
import { COMPONENT_TYPES } from '../../../../helpers/types'

export let popupPanelview = "main"
let init = false
let data:any = {}


let entities:any[] = []
let entitiesWithActions:any[] = []
let entitiesWithActions2:any[] = []

let selectedEntityIndex:number = 0
let selectedEntity2Index:number = 0
let selectedActionIndex:number = 0

let newAction:any = {}
let newAction2:any = {}

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
    entitiesWithActions.sort((a:any, b:any)=> a.name.localeCompare(b.name))
}

export function updateEntityActions2(aid:string){
    entitiesWithActions2.length = 0
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }
    
    let actions = scene[COMPONENT_TYPES.ACTION_COMPONENT].get(aid)
    if(actions && actions.actions.length > 0){
        actions.actions.forEach((action:any)=>{
            entitiesWithActions2.push(action)
        })
    }
    entitiesWithActions2.sort((a:any, b:any)=> a.name.localeCompare(b.name))
}

export function updatePopupPanelView(view:string){
    popupPanelview = view
}

export function updateTriggerActionsPanel(){
    entities.length = 0
    entities = getAllAssetNames(selectedItem.sceneId, true)
}

export function updatePopupPanel(){
    data = {...newActionData}
    data.buttons = [
        {label:"" + data.button1.label, enabled:data.button1.enabled},
        {label:"" + data.button2.label, enabled:data.button2.enabled},
    ]

    displaySkinnyVerticalPanel(true, data, data.variableText || data.variableText !== "" ? data.variableText : undefined)
}

export function showPopupPanel(){
    if(init){
        return
    }
    init = true
    updatePopupPanel()
    updateTriggerActionsPanel()
}

export function AddPopupPanel(){
    return(
        <UiEntity
        key={resources.slug + "action::popup::panel"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
        }}
    >

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: '100%',
        display: popupPanelview === "main" ? "flex" : "none"
    }}
    >

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '15%',
        }}
        uiBackground={{color: Color4.Black()}}
        uiText={{value: "Labels", fontSize: sizeFont(30, 20)}}
        onMouseDown={() => {
            setUIClicked(true)
            popupPanelview = "Labels"
            updatePopupPanel()
            setUIClicked(false)
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
            height: '15%',
            margin:{top:"2%"}
        }}
        uiBackground={{color: Color4.Black()}}
        uiText={{value: "Buttons", fontSize: sizeFont(30, 20)}}
        onMouseDown={() => {
            setUIClicked(true)
            popupPanelview = "Buttons"
            updatePopupPanel()
            setUIClicked(false)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
        />

</UiEntity>


<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: '100%',
        display: popupPanelview === "Labels" ? "flex" : "none"
    }}
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
        uiText={{value:"Popup Label", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
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
            onChange={(value) => {
                updateActionData({label: value.trim()}, true)
                updatePopupPanel()
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'popup label'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100',
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
            margin:{bottom:'5%'}
        }}
        uiText={{value:"Popup Variable Text (optional)", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
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
            onChange={(value) => {
                updateActionData({variableText: value.trim()}, true)
                updatePopupPanel()
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'popup variable text'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100',
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
            margin:{bottom:'5%'}
        }}
        uiText={{value:"Popup Description", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
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
            onChange={(value) => {
                updateActionData({text: value.trim()}, true)
                updatePopupPanel()
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'popup description'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
            ></Input>
        </UiEntity>

    </UiEntity>

    <UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: '100%',
        display: popupPanelview === "Buttons" ? "flex" : "none"
    }}
    >

        {/* button 1 column */}
        <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '50%',
        height: '100%',
        margin:{right:'1%'}
    }}
    >

        <UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: '10%',
    }}
    >

<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '50%',
        height: '100%',
    }}
    uiText={{textWrap:'nowrap', value:"Button 1", fontSize:sizeFont(20,15), textAlign:"middle-left"}}
    />

<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '50%',
        height: '100%',
    }}
    >
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateSquareImageDimensions(4).width,
            height: calculateSquareImageDimensions(4).height,
            margin:{top:"1%", bottom:'1%'},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: popupPanelview === "Buttons" && newActionData.button1.enabled ? getImageAtlasMapping(uiSizes.toggleOnTrans) : getImageAtlasMapping(uiSizes.toggleOffTrans)
        }}
        onMouseDown={() => {
            let button1 ={...newActionData.button1}
            button1.enabled = !button1.enabled

            console.log('button1 is', button1)
            updateActionData({button1: button1})
            console.log('new action data is', newActionData)
            updatePopupPanel()
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
            height: '15%',
            display: newActionData.button1.enabled ? "flex" : "none"
        }}
    >
        <Input
            onChange={(value) => {
                let button1 = {...newActionData.button1}
                button1.label = value.trim()
                updateActionData({button1: button1}, true)
                updatePopupPanel()
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'button 1 label'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
            ></Input>
        </UiEntity>


    {/* action entity actions dropdown */}
    <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent:'center',
            width: '100%',
            height: '15%',
            margin:{top:"1%"},
            display: newActionData.button1.enabled ? "flex" :"none"
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
        height: '15%',
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

        </UiEntity>



 {/* button 2 column */}
 <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '50%',
        height: '100%',
        margin:{right:'1%'}
    }}
    >

        <UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: '10%',
    }}
    >

<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '50%',
        height: '100%',
    }}
    uiText={{textWrap:'nowrap', value:"Button 2", fontSize:sizeFont(20,15), textAlign:"middle-left"}}
    />

<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '50%',
        height: '100%',
    }}
    >
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateSquareImageDimensions(4).width,
            height: calculateSquareImageDimensions(4).height,
            margin:{top:"1%", bottom:'1%'},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: popupPanelview === "Buttons" && newActionData.button2.enabled ? getImageAtlasMapping(uiSizes.toggleOnTrans) : getImageAtlasMapping(uiSizes.toggleOffTrans)
        }}
        onMouseDown={() => {
            let button2 ={...newActionData.button2}
            button2.enabled = !button2.enabled

            console.log('button2 is', button2)
            updateActionData({button2: button2})
            console.log('new action data is', newActionData)
            updatePopupPanel()
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
            height: '15%',
            display: newActionData.button2.enabled ? "flex" : "none"
        }}
    >
        <Input
            onChange={(value) => {
                let button2 = {...newActionData.button2}
                button2.label = value.trim()
                updateActionData({button2: button2}, true)
                updatePopupPanel()
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'button 2 label'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
            ></Input>
        </UiEntity>


    {/* action entity actions dropdown */}
    <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent:'center',
            width: '100%',
            height: '15%',
            margin:{top:"1%"},
            display: newActionData.button2.enabled ? "flex" :"none"
        }}
        >

        <Dropdown
                // options={[...["Select Entity"], ...getEntityList()]}
                options={[...["Select Entity"], ...entities.map($=> $.name)]}
                selectedIndex={0}
                onChange={selectEntity2Index}
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
        height: '15%',
        margin:{top:"1%"}
    }}
    >

    <Dropdown
        options={[...["Select Action"], ...entitiesWithActions2.map(($:any)=> $.name)]}
        // options={entitiesWithActions.length > 0 ? [...["Select Action"], ...entitiesWithActions[entityIndex].actions.map((item:any) => item.name).sort((a:any,b:any)=> a.localeCompare(b))] : []}
        selectedIndex={0}
        onChange={selectAction2Index}
        uiTransform={{
            width: '100%',
            height: '100%',
            display: selectedEntity2Index !== 0 ? "flex" : "none"
        }}
        color={Color4.White()}
        fontSize={sizeFont(20, 15)}
    />

    </UiEntity>

        </UiEntity>

        </UiEntity>

    </UiEntity>
    )
}

function selectEntityIndex(index:number){
    console.log('select entity index', index)
    selectedEntityIndex = index
    if(index !== 0){
        updateEntityActions(entities[index-1].aid)
    }
}


function selectEntity2Index(index:number){
    selectedEntity2Index = index
    if(index !== 0){
        updateEntityActions2(entities[index-1].aid)
    }
}


function selectActionIndex(index:number){
    console.log('select action index', index)
    selectedActionIndex = index
    if(index !== 0){
        newAction = entitiesWithActions[index-1]
        console.log('new action is', newAction)
        let button1 = {...newActionData.button1}
        button1.actionId = newAction.id
        updateActionData({button1:button1})
    }
}

function selectAction2Index(index:number){
    selectedActionIndex = index
    if(index !== 0){
        newAction2 = entitiesWithActions[index-1]
        console.log('new action is', newAction2)
        let button2 = {...newActionData.button2}
        button2.actionId = newAction2.id
        updateActionData({button2:button2})
    }
}