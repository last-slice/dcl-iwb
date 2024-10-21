import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import resources from '../../../../helpers/resources'
import { COMPONENT_TYPES, ENTITY_POINTER_LABELS, POINTER_EVENTS, Triggers } from '../../../../helpers/types'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../../helpers'
import { editingTrigger, triggerInfoView, triggerView, update, updateTriggerInfoView, updateTriggerView } from '../EditTrigger'
import { colyseusRoom } from '../../../../components/Colyseus'
import { selectedItem } from '../../../../modes/Build'
import { TriggerConditionsPanel } from './TriggerConditionsPanel'
import { TriggerActionsPanel } from './TriggerActionsPanel'
import { setUIClicked } from '../../../ui'
import { utils } from '../../../../helpers/libraries'
import { newDecision, TriggerDecisionPanel } from './TriggerDecisionPanel'
import { uiSizes } from '../../../uiConfig'
import { visibleComponent } from '../../EditAssetPanel'

export let selectedTrigger:any = {}

export function selectTriggerDetails(id:any){
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        deselectTriggerDetails()
        return
    }

    if(id){
        let triggers = scene[COMPONENT_TYPES.TRIGGER_COMPONENT].get(selectedItem.aid)
        if(!triggers){
            deselectTriggerDetails()
        }
        let trigger = triggers.triggers.find(($:any)=> $.id === id)
        if(!trigger){
            deselectTriggerDetails()
        }
        selectedTrigger = trigger
    }
    else{
        utils.timers.setTimeout(()=>{
            let triggers = scene[COMPONENT_TYPES.TRIGGER_COMPONENT].get(selectedItem.aid)
            if(triggers){
                console.log('triggers are', triggers.triggers)
                selectedTrigger = {...triggers.triggers[triggers.triggers.length-1]}
                console.log('trigger data is', selectedTrigger)
            }
        }, 200)
    }


}

export function deselectTriggerDetails(){
    selectedTrigger = {}
}

export function TriggerInfoPanel(){
    return(
        <UiEntity
        key={resources.slug + "trigger::info:panel"}
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
        }}
            uiText={{value:"Trigger Type: " +  (selectedTrigger.type ? selectedTrigger.type.replace(/_/g, ' ').replace(/\b\w/g, (char:any) => char.toUpperCase()): ""), textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
        />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent:'center',
            width: '100%',
            height: '10%',//
            display: triggerInfoView !== "main" && selectedTrigger.type === Triggers.ON_INPUT_ACTION ? "flex" : "none"
            }}
            uiText={{value:"Input Type: " + (ENTITY_POINTER_LABELS[selectedTrigger.input] + (selectedTrigger.type === Triggers.ON_INPUT_ACTION ? ", Button: " + Object.values(POINTER_EVENTS)[selectedTrigger.pointer] : "")), textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
        />


            {/* trigger summary */}
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            alignContent:'center',
            width: '100%',
            height: '30%',
            display: triggerInfoView === "main" ? "flex" : "none"
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
                margin:{bottom:"5%"},
                display: selectedTrigger.type && selectedTrigger.type === Triggers.ON_INPUT_ACTION ? "flex" : "none"
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
                height: '45%',
                margin:{bottom:'1%'},
                display: selectedTrigger.type && selectedTrigger.type === Triggers.ON_INPUT_ACTION ? "flex" : "none"
            }}
            >

                <Dropdown
                    options={[...ENTITY_POINTER_LABELS]}
                    selectedIndex={selectedTrigger.input ? selectedTrigger.input : 0}
                    onChange={(index:number)=>{
                        console.log('changing input')
                        update("edit", {id:selectedTrigger.id, input:index})
                    }}
                    uiTransform={{
                        width: '100%',
                        height: '120%',
                    }}
                    // uiBackground={{color:Color4.Purple()}}
                    color={Color4.White()}
                    fontSize={sizeFont(20, 15)}
                />

            </UiEntity>

            {/* trigger pointer button dropdown */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '45%',
                margin:{bottom:'1%'},
                display: selectedTrigger.type && selectedTrigger.type === Triggers.ON_INPUT_ACTION ? "flex" : "none"
            }}
            >

                <Dropdown
                    options={[...Object.values(POINTER_EVENTS)]}
                    selectedIndex={selectedTrigger.pointer ? selectedTrigger.pointer : 1}
                    onChange={(index:number)=>{
                        console.log('changing pointer')
                        update("edit", {id:selectedTrigger.id, pointer:index})
                    }}
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


{/* trigger info main panel view */}
    <TriggerMainInfoPanel/>



     {/* trigger info conditions panel view */}
     <TriggerConditionsPanel/>

{/* trigger info actions panel view */}
        <TriggerActionsPanel/>

        <TriggerDecisionPanel/>


        </UiEntity>
    )
}

function TriggerMainInfoPanel(){
    return(
        <UiEntity
        key={resources.slug + "trigger::info::main::panel"}
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

        {/* add decision button */}
        <UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf:'flex-start',
        margin:{top:"1%"},
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
        value: "Add Decision",
        fontSize: sizeFont(25, 15),
        color: Color4.White(),
        textAlign: 'middle-center'
    }}
    onMouseDown={() => {
        setUIClicked(true)
        updateTriggerInfoView("decisions")
        update("adddecision", {tid:selectedTrigger.id, did:newDecision.id})
        
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
    uiText={{value:"Current Decisions", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
/>

<UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignContent:'center',
    width: '100%',
    height: '80%',
}}
>
{selectedItem && 
    selectedItem.enabled && 
    editingTrigger && 
    visibleComponent === COMPONENT_TYPES.TRIGGER_COMPONENT &&
    triggerView === "info" && 
    triggerInfoView === "main" && 

    getDecisions()
    }

</UiEntity>

        </UiEntity>
    )
}

function getDecisions(){
    let arr:any[] = []
    let count = 0
    if(selectedTrigger && selectedTrigger.decisions){
        selectedTrigger.decisions.forEach((decision:any, i:number)=>{
            arr.push(<TriggerDecisionRow data={{triggerId:selectedTrigger.id, decision:decision}} rowCount={count} />)
            count++
        })
    }
    return arr
}

export function TriggerDecisionRow(info:any){
    let data:any = info.data
    let decision = data.decision
    // console.log('decision is', decision)
    return(
        <UiEntity
        key={resources.slug + "trigger-decision-row-"+ info.rowCount}
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

                    {/* decision name column */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
                height: '100%',
                margin:{left:'2%'}
            }}
            uiText={{textWrap:'nowrap', value:"" + (decision.name.length > 20 ? decision.name.substring(0, 20) + "..." : decision.name), textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
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
                    setUIClicked(true)
                    updateTriggerInfoView("decisions", decision)
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
                    console.log('data is', data)
                    update("deletedecision", {tid: data.triggerId, did:decision.id})
                    utils.timers.setTimeout(()=>{selectTriggerDetails(data.triggerId)}, 200)
                }}
            />
                </UiEntity>

            </UiEntity>
    )
}