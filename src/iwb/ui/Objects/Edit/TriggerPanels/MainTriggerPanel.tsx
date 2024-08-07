import { Color4 } from "@dcl/sdk/math"
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import resources from "../../../../helpers/resources"
import { selectedItem } from "../../../../modes/Build"
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from "../../../helpers"
import { setUIClicked } from "../../../ui"
import { uiSizes } from "../../../uiConfig"
import { editingTrigger, triggerView, update, updateTriggerInfoView, updateTriggerView } from "../EditTrigger"
import { colyseusRoom } from "../../../../components/Colyseus"
import { COMPONENT_TYPES, ENTITY_POINTER_LABELS, Triggers } from "../../../../helpers/types"


export function MainTriggerPanel(){
    return(        
    <UiEntity
    key={resources.slug + "main::trigger::panel"}
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
        // uiBackground={{color:Color4.Green()}}//
        > 
    
        {selectedItem && selectedItem.enabled && editingTrigger && triggerView === "main" && getTriggerEvents()}

        </UiEntity>

        </UiEntity>)
}

function getTriggerEvents(){
    let arr:any[] = []
    let count = 0
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(scene){
        let triggers = scene[COMPONENT_TYPES.TRIGGER_COMPONENT].get(selectedItem.aid)
        if(triggers){
            triggers.triggers.forEach((trigger:any, i:number)=>{
                arr.push(<TriggerRow data={trigger} rowCount={count} />)
                count++
            })
        }
    }
    return arr
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
                display: data.type === Triggers.ON_INPUT_ACTION ? "flex" : "none"//
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
            uiText={{textWrap:'nowrap', value:"Conditions", fontSize:sizeFont(20,15), color:Color4.White()}}
            />

             <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '25%',
            }}
            uiText={{textWrap:'nowrap', value:"" + data.caid.length, fontSize:sizeFont(20,15), color:Color4.White()}}
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
                updateTriggerInfoView("main")
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