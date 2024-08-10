import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import resources from '../../../../helpers/resources'
import { selectedItem } from '../../../../modes/Build'
import { sizeFont, calculateImageDimensions, getAspect, getImageAtlasMapping } from '../../../helpers'
import { setUIClicked } from '../../../ui'
import { uiSizes } from '../../../uiConfig'
import { editingTrigger, triggerInfoView, triggerView, update } from '../EditTrigger'
import { getAllAssetNames } from '../../../../components/Name'
import { colyseusRoom } from '../../../../components/Colyseus'
import { COMPONENT_TYPES } from '../../../../helpers/types'
import { selectedTrigger } from './TriggerInfoPanel'

let entities:any[] = []
let entitiesWithActions:any[] = []

let selectedEntityIndex:number = 0
let selectedActionIndex:number = 0

let newAction:any = {}

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

export function TriggerActionsPanel(){
    return(
    <UiEntity
    key={resources.slug + "trigger::action::panel"}
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
        let info:any = {...newAction}
        info.tid = selectedTrigger.id
        update("addaction", info)
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

    {selectedItem && 
    selectedItem.enabled && 
    editingTrigger && 
    triggerView === "info" && 
    triggerInfoView === "actions" && 
    
    getTriggerActions()
    }
    
</UiEntity>
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