import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import resources from '../../../../helpers/resources'
import { selectedItem } from '../../../../modes/Build'
import { sizeFont, calculateImageDimensions, getAspect, getImageAtlasMapping } from '../../../helpers'
import { setUIClicked } from '../../../ui'
import { uiSizes } from '../../../uiConfig'
import { editingTrigger, triggerInfoView, triggerView, update, updateTriggerInfoView } from '../EditTrigger'
import { getAllAssetNames } from '../../../../components/Name'
import { colyseusRoom } from '../../../../components/Colyseus'
import { COMPONENT_TYPES } from '../../../../helpers/types'
import { selectedTrigger } from './TriggerInfoPanel'
import { getRandomString } from '../../../../helpers/functions'

let entities:any[] = []
let entitiesWithActions:any[] = []

let selectedEntityIndex:number = 0
let selectedActionIndex:number = 0

let newAction:any = {}

export let newDecision:any = {}

export function updateTriggerDecisionPanel(data?:any, newDecisions?:boolean){
    console.log('decision data now is', data)
    if(data){
        newDecision = {...data}
        return
    }
    
    if(newDecisions){
        newDecision.id = getRandomString(6)
        newDecision.conditions = []
        newDecision.actions = []
        newDecision.name = newDecision.id
    
        console.log('new decision is', newDecision)
    }
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
    entitiesWithActions.sort((a:any, b:any)=> a.name.localeCompare(b.name))
}

export function updateTriggerActionsPanel(){
    entities.length = 0
    entities = getAllAssetNames(selectedItem.sceneId, true)
}

export function resetTriggerActionsPanel(){
    entities.length = 0
    entitiesWithActions.length = 0
    selectedEntityIndex = 0
    selectedActionIndex = 0
    newAction = {}
    console.log('reset trigger action panel')
}

export function TriggerDecisionPanel(){
    return(
    <UiEntity
    key={resources.slug + "trigger::decision::panel"}
    uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignContent:'center',
    width: '100%',
    height: '100%',
    display: triggerInfoView === "decisions" ? "flex" : "none"
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
        uiText={{value:"Current Decision: " + (newDecision && newDecision.name), textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
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
                newDecision.name = value.trim()
                update('decisionname', {tid:selectedTrigger.id, did:newDecision.id, name:newDecision.name})//
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'Edit decision name'}
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
    )
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
            uiText={{textWrap:'nowrap', value:"" + data.entity, textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
            />

             <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40%', 
                height: '100%',
            }}
            uiText={{textWrap:'nowrap', value:"" + data.name, fontSize:sizeFont(20,15), color:Color4.White()}}
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
                    update("deleteaction", {tid:selectedTrigger.id, actionId: data.actionId})
                }}
            />
                </UiEntity>

            </UiEntity>
    )
}

function selectEntityIndex(index:number){
    console.log('select entity index', index)//
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
        console.log('new action is', newAction)
    }
}

function getTriggerActions(){
    let arr:any[] = []
    let count = 0
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(scene){
        let triggerData = scene[COMPONENT_TYPES.TRIGGER_COMPONENT].get(selectedItem.aid)
        if(triggerData){
            let trigger = triggerData.triggers.find((trigger:any) => trigger.id === selectedTrigger.id)
            if(trigger){
                trigger.actions.forEach((actionId:string)=>{
                    scene[COMPONENT_TYPES.ACTION_COMPONENT].forEach((sceneAction:any, aid:string)=>{
                        let action = sceneAction.actions.find((act:any) => act.id === actionId)
                        if(action){
                            let itemInfo = scene[COMPONENT_TYPES.NAMES_COMPONENT].get(aid)
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