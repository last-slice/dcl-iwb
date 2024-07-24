import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { sendServerMessage } from '../../../../components/Colyseus'
import resources from '../../../../helpers/resources'
import { SERVER_MESSAGE_TYPES, COMPONENT_TYPES, Triggers } from '../../../../helpers/types'
import { selectedItem } from '../../../../modes/Build'
import { sizeFont, calculateImageDimensions, getAspect, getImageAtlasMapping } from '../../../helpers'
import { setUIClicked } from '../../../ui'
import { uiSizes } from '../../../uiConfig'
import { triggerView, updateTriggerView } from '../EditTrigger'
import { resetTriggerActionsPanel } from './TriggerActionsPanel'

let selectedIndex = 0

export function AddTriggerPanel(){
    return(
        <UiEntity
        key={resources.slug + "trigger::add::panel"}
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
                    selectedIndex={0}
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
            display: selectedIndex !== 0 ? "flex" : "none",
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

            addTrigger()
            updateTriggerView("info")
            resetTriggerActionsPanel()
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
        />
        </UiEntity>
    )
}

function addTrigger(){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET,
    {
        component:COMPONENT_TYPES.TRIGGER_COMPONENT,
        aid:selectedItem.aid,
        sceneId:selectedItem.sceneId,
        action: 'add',
        data:{
            type:getTriggerList()[selectedIndex].replace(/ /g, "_").toLowerCase()
        }
    })
    return
}

function getTriggerList(){
    return [...["Select New Trigger"],...Object.values(Triggers).map(str => str.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())).sort((a,b)=> a.localeCompare(b))]
}

function selectTriggerIndex(index:number){
    selectedIndex = index
}