
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { visibleComponent } from './EditObjectDataPanel'
import { COMPONENT_TYPES, EDIT_MODES, ENTITY_ACTIONS_LABELS, ENTITY_ACTIONS_SLUGS, ENTITY_POINTER_LABELS, ENTITY_TRIGGER_LABELS, ENTITY_TRIGGER_SLUGS, IWBScene, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { sendServerMessage } from '../../../components/messaging'
import { selectedItem } from '../../../components/modes/build'
import { uiSizes } from '../../uiConfig'
import { sceneBuilds } from '../../../components/scenes'
import { log } from '../../../helpers/functions'
import { localPlayer } from '../../../components/player/player'

export let triggerView = "list"
let selectedTriggerIndex:number = 0
let selectedActionIndex:number = 0
let selectedPointerIndex:number = 0

let actionNames:string[] = []
let actionIds:string[] = []
let actionLabels:any[] = []

let selectedTrigger:any

export function updateActionView(v:string){
    triggerView = v
}

export function TriggerComponent() {
    return (
        <UiEntity
            key={"edittriggercomponentpanel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.TRIGGER_COMPONENT ? 'flex' : 'none',
            }}
        >

              {/* enabled row */}
              <UiEntity
            uiTransform={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
                margin:{top:"1%"},
                display: triggerView === "list" ? "flex" : "none"
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
        uiText={{value:"Enabled", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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
            width: calculateSquareImageDimensions(4).width,
            height: calculateSquareImageDimensions(4).height,
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: selectedItem && selectedItem.enabled && selectedItem.itemData.trigComp ? (selectedItem.itemData.trigComp.enabled ? getImageAtlasMapping(uiSizes.toggleOnTrans) : getImageAtlasMapping(uiSizes.toggleOffTrans)) : getImageAtlasMapping(uiSizes.toggleOnTrans)
        }}
        onMouseDown={() => {
            updateTrigger('toggle', "enabled", !selectedItem.itemData.trigComp.enabled)
        }}
        />


        </UiEntity>
        </UiEntity>

                {/* add Trigger button row */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{bottom:"2%"},
                display: triggerView === "list" ? "flex" : "none"
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
        uiText={{value: "Add Trigger", fontSize: sizeFont(20, 16)}}
        onMouseDown={() => {
            updateActionView("add")
        }}
    />

        </UiEntity>

                    {/* add new trigger panel */}
                    <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '80%',
                display: triggerView === "add" ? "flex" : "none"
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
            margin:{top:"1%"}
        }}
        uiText={{value: "Add New Trigger", fontSize: sizeFont(20, 16), textAlign:'middle-left'}}
    />

             {/* trigger event row */}
    <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '30%',
                margin:{top:"5%"}
            }}
        >

        {/* trigger event dropdown */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '48%',
                height: '100%',
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
        uiText={{value:"Trigger Event", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '45%',
            }}
        >

            <Dropdown
        key={"trigger-event-dropdown-dropdown"}
        options={ENTITY_TRIGGER_LABELS}
        selectedIndex={selectedTriggerIndex}
        onChange={selectTriggerIndex}
        uiTransform={{
            width: '100%',
            height: '120%',
        }}
        // uiBackground={{color:Color4.Purple()}}
        color={Color4.White()}
        fontSize={sizeFont(20, 15)}
    />

        </UiEntity>



        </UiEntity>

         {/* trigger event type dropdown */}
         <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '48%',
                height: '100%',
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
        uiText={{value:"Trigger Event Type", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '45%',
            }}
        >

            <Dropdown
        key={"trigger-event-type-dropdown-dropdown"}
        options={ENTITY_POINTER_LABELS}
        selectedIndex={selectedPointerIndex}
        onChange={selectPointer}
        uiTransform={{
            width: '100%',
            height: '120%',
        }}
        // uiBackground={{color:Color4.Purple()}}
        color={Color4.White()}
        fontSize={sizeFont(20, 15)}
    />

        </UiEntity>



        </UiEntity>

            </UiEntity>

        
     {/* add trigger confirm buttons */}
            <UiEntity
            uiTransform={{
                flexDirection: 'row',
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
            updateActionView("list")
            buildTrigger()
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
                updateActionView("list")
            }}
        />

        </UiEntity>


            </UiEntity>


            {/* view trigger actions panel */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '95%',
                height: '100%',
                display: triggerView === "actions" ? "flex" : "none"
            }}
            // uiBackground={{color:Color4.Green()}}
            >

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
            uiText={{textAlign:"middle-left", value:"Trigger: " + (selectedTrigger && ENTITY_TRIGGER_LABELS[ENTITY_TRIGGER_SLUGS.findIndex((es)=> es === selectedTrigger.type)] + ", " + ENTITY_POINTER_LABELS[selectedTrigger.pointer]), fontSize:sizeFont(25,15), color:Color4.White()}}
            />


            {/* hover text & distance row */}
            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                height: '20%',
                margin:{top:"2%"}
            }}
            >

                <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '45%',
                height: '100%',
            }}
            > 
            
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '30%',
            }}
            uiText={{textAlign:"middle-left", value:"Hover Text", fontSize:sizeFont(25,15), color:Color4.White()}}
            />

        <Input
        onChange={(value)=>{
            selectedTrigger.hoverText = value
            updateTrigger("action", "text", {type:selectedTrigger.type, text:value})
        }}
        fontSize={sizeFont(20,12)}
        value={"" + (selectedTrigger && selectedTrigger.hoverText)}
        placeholder={'hover text'}
        placeholderColor={Color4.White()}
        color={Color4.White()}
        uiTransform={{
            width: '100%',
            height: '70%',
        }}
        />
                 </UiEntity>

                 <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '45%',
                height: '100%',
            }}
            > 
                 <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '30%',
            }}
            uiText={{textAlign:"middle-left", value:"Trigger Distance", fontSize:sizeFont(25,15), color:Color4.White()}}
            />

        <Input
        onChange={(value)=>{
            selectedTrigger.distance = parseInt(value)
            updateTrigger("action", "distance", {type:selectedTrigger.type, distance:parseInt(value)})
        }}
        fontSize={sizeFont(20,12)}
        value={"" + (selectedTrigger && selectedTrigger.distance)}
        placeholder={'enter click distance'}
        placeholderColor={Color4.White()}
        color={Color4.White()}
        uiTransform={{
            width: '100%',
            height: '70%',
        }}
        />
                 </UiEntity>


            </UiEntity>


            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
                margin:{top:"2%"}
            }}
            >

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '70%',
                height: '100%',
            }}
            >
                <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '30%',
            }}
            uiText={{textAlign:"middle-left", value:"Actions", fontSize:sizeFont(25,15), color:Color4.White()}}
            />
                        
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '70%',
            }}
            >
            <Dropdown
        key={"trigger-action-dropdown-dropdown"}
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

            </UiEntity>

                        {/* add action button */}
                        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                alignContent:'center',
                justifyContent: 'center',
                width: '30%',
                height: '100%',
            }}
            >
                                <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '30%',
            }}
            />
                     <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent:'center',
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
                updateTrigger("action", "add", {type:selectedTrigger.type, action:actionIds[selectedActionIndex], pointer: selectedTrigger.pointer})
            }}
        />
                </UiEntity>

            </UiEntity>



            {/* actions list label */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                alignContent:'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:"5%"}
            }}
            uiText={{textAlign:"middle-left", value:"Current Trigger Actions", fontSize:sizeFont(25,15), color:Color4.White()}}
            />

            {/* actions list panel */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '40%',
            }}
            // uiBackground={{color:Color4.Purple()}}
            >
                {generateActionRows(selectedTrigger ? selectedTrigger.actions : [])}
            </UiEntity>

                 {/* add trigger confirm buttons */}
                 <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
            }}
            >

                </UiEntity>

                </UiEntity>


            {/* trigger rows */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '80%',
                display: triggerView === "list" ? "flex" : "none"
            }}
            >   
            {generateRows()}
            </UiEntity>
     
        </UiEntity>
    )
}

function generateRows(){
    let arr:any[] = []
    let count = 0
    let trigggers:any[] = selectedItem && selectedItem.enabled && selectedItem.itemData.trigComp ? [...selectedItem.itemData.trigComp.triggers] : []
    trigggers.forEach((triggger, i:number)=>{
        arr.push(<TriggerRow data={triggger} rowCount={count} />)
        count++
    })
    return arr
}

function TriggerRow(trigger:any){
    let data = trigger.data
    return(
        <UiEntity
        key={"trigger-row-"+ trigger.rowCount}
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
                margin:{top:"2%", bottom:'2%', left:"2%", right:'2%'}
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
            }}
            >

            {/* trigger event type column */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '25%',
            }}
            uiText={{value:"" + ENTITY_TRIGGER_LABELS[ENTITY_TRIGGER_SLUGS.findIndex((es)=> es === data.type)], fontSize:sizeFont(20,15), color:Color4.White()}}
            />

             {/* trigger event pointer column */}
             <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '25%',
            }}
            uiText={{value:"" + ENTITY_POINTER_LABELS[data.pointer], fontSize:sizeFont(20,15), color:Color4.White()}}
            />


            </UiEntity>

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40%',
                height: '100%',
            }}
            >

            {/* trigger event type column */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '25%',
            }}
            uiText={{value:"Actions", fontSize:sizeFont(20,15), color:Color4.White()}}
            />

             {/* trigger event pointer column */}
             <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '25%',
            }}
            uiText={{value:"" + data.actions.length, fontSize:sizeFont(20,15), color:Color4.White()}}
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
                width: calculateImageDimensions(1.5, getAspect(uiSizes.pencilEditIcon)).width,
                height: calculateImageDimensions(1.5, getAspect(uiSizes.pencilEditIcon)).height,
                margin:{right:"1%"}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas1.png'
                },
                uvs: getImageAtlasMapping(uiSizes.pencilEditIcon)
            }}
            onMouseDown={() => {
                // updateTrigger('delete', 'remove', trigger.rowCount)
                selectedTrigger = data
                console.log('selected trigger is', selectedTrigger)
                updateActionView("actions")
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
                updateTrigger('delete', 'remove', trigger.rowCount)
            }}
        />
                </UiEntity>

            </UiEntity>
    )
}

function generateActionRows(actions:any){
    let arr:any[] = []
    let count = 0
    actions.forEach((action:any)=>{
        arr.push(<TriggerActionRow data={action} rowCount={count}/>)
        count++
    })
    return arr
}

function TriggerActionRow(data:any){
    let actionData = data.data
    return(
        <UiEntity
        key={"trigger-action-row-"+ data.rowCount}
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '25%',
                margin:{top:"1%", bottom:'1%', left:"2%", right:'2%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.rowPillDark)}}
            >  

                 {/* acttion name column */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40%',
                height: '100%',
            }}
            uiText={{value:"" + actionNames[actionIds.findIndex((action:any)=> action === actionData.id)], fontSize:sizeFont(20,15), color:Color4.White(), textAlign:'middle-left'}}
            />

             {/* action action column */}
             <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40%',
                height: '100%',
            }}
            uiText={{value:"" + getActionLabel(actionData.id), fontSize:sizeFont(20,15), color:Color4.White(), textAlign:'middle-left'}}
            />

            {/* action action column */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '10%',
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
                updateTrigger("action", "delete", {type:selectedTrigger.type, action:data.rowCount})
            }}
        />

            </UiEntity>

            </UiEntity>
    )
}

function selectTriggerIndex(index:number){
    selectedTriggerIndex = index
}

function selectAction(index:number){
    selectedActionIndex = index
}

function selectPointer(index:number){
    selectedPointerIndex = index
}

function buildTrigger(){
    let scene:IWBScene = sceneBuilds.get(selectedItem.sceneId)
    if(scene){
        updateTrigger("add", "new", {type:ENTITY_TRIGGER_SLUGS[selectedTriggerIndex], action:actionIds[selectedActionIndex], pointer:selectedPointerIndex})
    }
}

function updateTrigger(action:string, type:string, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.UPDATE_ITEM_COMPONENT, {component:COMPONENT_TYPES.TRIGGER_COMPONENT, action:action, data:{aid:selectedItem.aid, sceneId:selectedItem.sceneId, type:type, value:value}})
}

export function getActionLabel(actionId:string){
    let actionIdIndex = actionIds.findIndex((id)=> id === actionId)
    let actionLabel = actionLabels[actionIdIndex]
    let labelIndex = ENTITY_ACTIONS_SLUGS.findIndex((label)=> label === actionLabel)
    return ENTITY_ACTIONS_LABELS[labelIndex]
}

export function updateTriggerActions(){
    actionNames.length = 0
    actionIds.length = 0
    actionLabels.length = 0

    let actions:any[] = []
    if(localPlayer.activeScene){
        localPlayer.activeScene.ass.forEach((asset)=>{
            if(asset.actComp){
                asset.actComp.actions.forEach((action:any, key:any)=>{
                    actions.push({name:action.name, key:key, type:action.type})
                })
            }
        })
    }

    actions.sort((a, b) => a.name.localeCompare(b.name));
    actions.forEach((action)=>{
        actionNames.push(action.name)
        actionIds.push(action.key)
        actionLabels.push(action.type)
    })
}