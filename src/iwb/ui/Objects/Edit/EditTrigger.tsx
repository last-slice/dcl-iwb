
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import resources from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { COMPONENT_TYPES, ENTITY_POINTER_LABELS, SERVER_MESSAGE_TYPES, Triggers } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
import { visibleComponent } from '../EditAssetPanel'
import { setUIClicked } from '../../ui'
import { uiSizes } from '../../uiConfig'
import { utils } from '../../../helpers/libraries'

export let triggerView = "main"
export let triggerInfoView = "main"

let newTriggerIndex:number = 0
let entityIndex:number = 0
let entityActionIndex:number = 0
let entitiesWithActions:any[] = []
let newTriggerData:any = {}

export function updateTriggerView(value:string, triggerId?:string){
    triggerView = value

    if(value === "info"){
        triggerInfoView = "main"

        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(scene){
            if(triggerId){
                let triggers = scene.triggers.get(selectedItem.aid)
                let trigger = triggers.triggers.find((event:any) => event.id === triggerId)
                if(trigger){
                    console.log('set trigger data to', trigger)
                    newTriggerData = {...trigger}
                }
            }else{
                utils.timers.setTimeout(()=>{
                    let triggers = scene.triggers.get(selectedItem.aid)
                    if(triggers){
                        console.log('triggers are', triggers.triggers)
                        newTriggerData = {...triggers.triggers[triggers.triggers.length-1]}
                    }
                }, 500)
            }
        }   
    }
}

export function updateTriggerInfoView(value:string){
    triggerInfoView = value
}

export function updateEntitiesWithActionsList(){
    if(selectedItem && selectedItem.enabled){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(scene){
            scene.names.forEach((name:any, aid:string)=>{
                let actions = scene.actions.get(aid)
                if(actions && actions.actions.length > 0){
                    entitiesWithActions.push({name:name.value, aid:aid, actions:actions.actions})
                }
            })
        }
    }
    console.log(entitiesWithActions)
}

export function EditTrigger(){
    return (
        <UiEntity
        key={resources.slug + "advanced::trigger:panel::ui"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.TRIGGER_COMPONENT ? 'flex' : 'none',
            }}
        >

        {/* main trigger panel view */}
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent:'center',
            width: '100%',
            height: '100%',
            display: triggerView === "main" ? "flex" : "none"
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
                value: "Add Trigger",
                fontSize: sizeFont(25, 15),
                color: Color4.White(),
                textAlign: 'middle-center'
            }}
            onMouseDown={() => {
                setUIClicked(true)
                updateTriggerView("add")
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
            uiText={{value:"Current Triggers", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
        // uiBackground={{color:Color4.Blue()}}
        />

        {/* current trigger list container */}
            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            alignContent:'center',
            width: '100%',
            height: '70%',
        }}
        // uiBackground={{color:Color4.Green()}}
        > 
    
        {selectedItem && selectedItem.enabled && getTriggerEvents()}

        </UiEntity>

        </UiEntity>

                {/* add trigger panel view */}
                <UiEntity
            uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            alignContent:'center',
            width: '100%',
            height: '100%',
            display: triggerView === "add" ? "flex" : "none"
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
                uiText={{value:"Add Trigger", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
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
                        options={getTriggerList()}
                        selectedIndex={newTriggerIndex}
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

                 {/* add trigger button */}
                 <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf:'flex-start',
                display: newTriggerIndex !== 0 ? "flex" : "none",
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
                value: "Add Trigger",
                fontSize: sizeFont(25, 15),
                color: Color4.White(),
                textAlign: 'middle-center'
            }}
            onMouseDown={() => {
                setUIClicked(true)
                
                newTriggerData.actions = []
                newTriggerData.conditions = []

                update('add', newTriggerData)
                updateTriggerView("info")
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
            />

            </UiEntity>

            {/* trigger info panel view */}
             <UiEntity
            uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            alignContent:'center',
            width: '100%',
            height: '100%',
            display: triggerView === "info" ? "flex" : "none"
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
            }}//
                uiText={{value:"Trigger Type: " + (newTriggerData.type ? newTriggerData.type.replace(/_/g, ' ').replace(/\b\w/g, (char:any) => char.toUpperCase()): ""), textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
            />

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent:'center',
                    width: '100%',
                    height: '10%',
                    display: newTriggerData && newTriggerData.type && newTriggerData.type === Triggers.ON_INPUT_ACTION ? "flex" : "none"
                }}//
                    uiText={{value:"Input Button Type", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
                />

                        {/* trigger pointer button dropdown */}
                        <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin:{bottom:'1%'},
                    display: newTriggerData && newTriggerData.type && newTriggerData.type === Triggers.ON_INPUT_ACTION ? "flex" : "none"
                }}
                >

                    <Dropdown
                        options={[...ENTITY_POINTER_LABELS]}
                        selectedIndex={newTriggerData && newTriggerData.input ? newTriggerData.input : ENTITY_POINTER_LABELS[0]}
                        onChange={selectTriggerButton}
                        uiTransform={{
                            width: '100%',
                            height: '120%',
                        }}
                        // uiBackground={{color:Color4.Purple()}}
                        color={Color4.White()}
                        fontSize={sizeFont(20, 15)}
                    />

                </UiEntity>


    {/* trigger info main panel view */}
         <UiEntity
            uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            alignContent:'center',
            width: '100%',
            height: '100%',
            display: triggerInfoView === "main" ? "flex" : "none"
            }}
        >
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin: {top: "2%"}
                }}
                uiBackground={{color: Color4.Black()}}
                uiText={{value: "Conditions", fontSize: sizeFont(30, 20)}}
                onMouseDown={() => {
                    setUIClicked(true)
                    updateTriggerInfoView("conditions")
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
                    margin: {top: "2%"}
                }}
                uiBackground={{color: Color4.Black()}}
                uiText={{value: "Actions", fontSize: sizeFont(30, 20)}}
                onMouseDown={() => {
                    setUIClicked(true)
                    updateTriggerInfoView("actions")
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
            />
            </UiEntity>

         {/* trigger info conditions panel view */}
         <UiEntity
            uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            alignContent:'center',
            width: '100%',
            height: '100%',
            display: triggerInfoView === "conditions" ? "flex" : "none"
            }}
        >
            </UiEntity>

        
         {/* trigger info actions panel view */}
         <UiEntity
            uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            alignContent:'center',
            width: '100%',
            height: '100%',
            display: triggerInfoView === "actions" ? "flex" : "none"
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
                uiText={{value:"Add Trigger Action", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
            />
                        {/* trigger action entity row */}
                        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent:'center',
                width: '100%',
                height: '10%',
                display: newTriggerIndex !== 0 ? "flex" : "none",
                margin:{bottom:'5%'}
            }}
            >

       {/* action entity dropdown */}
        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent:'center',
                width: '50%',
                height: '100%',
            }}
            >

            <Dropdown
                // options={[...["Select Entity"], ...getEntityList()]}
                options={[...["Select Entity"], ...entitiesWithActions.map(item => item.name).sort((a,b)=> a.localeCompare(b))]}
                selectedIndex={entityIndex}
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
                width: '50%',
                height: '100%',
            }}
            >

            <Dropdown
                options={[...["Select Action"], ...getEntityActionList()]}
                // options={entitiesWithActions.length > 0 ? [...["Select Action"], ...entitiesWithActions[entityIndex].actions.map((item:any) => item.name).sort((a:any,b:any)=> a.localeCompare(b))] : []}
                selectedIndex={entityActionIndex}
                onChange={selectEntityActionIndex}
                uiTransform={{
                    width: '100%',
                    height: '100%',
                }}
                color={Color4.White()}
                fontSize={sizeFont(20, 15)}
            />

            </UiEntity>


                </UiEntity>

                {/* add action button */}
                <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf:'flex-start',
                display: newTriggerIndex !== 0 ? "flex" : "none",
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
                newTriggerData.actions.push(entitiesWithActions[entityIndex-1].actions[entityActionIndex-1].id)
                update("addaction", newTriggerData)
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

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            alignContent:'center',
            width: '100%',
            height: '45%',
        }}
        >

            {selectedItem && selectedItem.enabled && triggerView === "info" && triggerInfoView === "actions" && getTriggerActions()}
            
        </UiEntity>
            </UiEntity>


            </UiEntity>

        </UiEntity>
    )
}

function selectTriggerButton(index:number){
    newTriggerData.input = index
    update('edit', {id:newTriggerData.id, data:{input:index}})
}

function getEntityActionList(){
    if(entitiesWithActions.length === 0){
        return []
    }
    let actions = entitiesWithActions[entityIndex > 0 ? entityIndex-1 : 0].actions
    return actions.map((item:any) => item.name)
}

function selectEntityIndex(index:number){
    entityIndex = index
}

function selectEntityActionIndex(index:number){
    entityActionIndex = index
}

function getTriggerList(){
    return [...["Select New Trigger"],...Object.values(Triggers).map(str => str.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())).sort((a,b)=> a.localeCompare(b))]
}

function getTriggerEvents(){
    let arr:any[] = []
    let count = 0
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(scene){
        let triggers = scene.triggers.get(selectedItem.aid)
        if(triggers){
            triggers.triggers.forEach((trigger:any, i:number)=>{
                arr.push(<TriggerRow data={trigger} rowCount={count} />)
                count++
            })
        }
    }
    return arr
}

function getTriggerActions(){
    let arr:any[] = []
    let count = 0
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(scene){
        let triggerData = scene.triggers.get(selectedItem.aid)
        if(triggerData){
            let trigger = triggerData.triggers.find((trigger:any) => trigger.id === newTriggerData.id)
            if(trigger){
                trigger.actions.forEach((actionId:string)=>{
                    scene.actions.forEach((sceneAction:any, aid:string)=>{
                        let action = sceneAction.actions.find((act:any) => act.id === actionId)
                        if(action){
                            let itemInfo = scene.names.get(aid)
                            if(itemInfo){
                                arr.push(<TriggerActionRow data={{entity:itemInfo.value, name:action.name, actionId:actionId}} rowCount={count} />)
                                count++
                            }
                        }
                    })
                })
            }
        }
    }
    return arr
}

export function TriggerActionRow(info:any){
    let data:any = info.data
    return(
        <UiEntity
        key={resources.slug + "trigger-action-row-"+ info.rowCount}
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

            {/* action name column */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40%',
                height: '100%',
                margin:{left:'2%'}
            }}
            uiText={{value:"" + data.entity, textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
            />

             <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40%', 
                height: '100%',
            }}
            uiText={{value:"" + data.name, fontSize:sizeFont(20,15), color:Color4.White()}}
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
                    update("deleteaction", {id:newTriggerData.id, actionId: data.actionId})
                }}
            />
                </UiEntity>

            </UiEntity>
    )
}

function TriggerRow(trigger:any){
    let data:any = trigger.data
    return(
        <UiEntity
        key={resources.slug + "trigger-row-"+ trigger.rowCount}
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
            uiText={{value:"" + data.type.replace(/^.*?_/, '').replace(/_/g, ' ').replace(/\b\w/g, (char:any) => char.toUpperCase()), fontSize:sizeFont(20,15), color:Color4.White()}}
            />

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '25%',
                display: data.hasOwnProperty("input") ? "flex" : "none"//
            }}
            uiText={{value:"" + ENTITY_POINTER_LABELS[data.input], fontSize:sizeFont(20,15), color:Color4.White()}}
            />

            </UiEntity>

            {/* trigger condition column */}
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
                width: '100%',
                height: '25%',
            }}
            uiText={{value:"Conditions", fontSize:sizeFont(20,15), color:Color4.White()}}
            />

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

            {/* trigger action column */}
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

            {/* trigger edit buttons column */}
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
                updateTriggerView("info", data.id)
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
                update("delete", {id:data.id})
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
        />
                </UiEntity>

            </UiEntity>
    )
}

function selectTriggerIndex(index:number){
    newTriggerIndex = index
    newTriggerData.type = getTriggerList()[index].replace(/ /g, "_").toLowerCase()
}

function update(action:string, triggerData:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET,
        {
            component:COMPONENT_TYPES.TRIGGER_COMPONENT,
            aid:selectedItem.aid,
            sceneId:selectedItem.sceneId,
            action:action,
            data:triggerData,
        }
    )
}