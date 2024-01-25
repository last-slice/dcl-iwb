
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateSquareImageDimensions, getImageAtlasMapping, sizeFont } from '../../helpers'
import { visibleComponent } from './EditObjectDataPanel'
import { COMPONENT_TYPES, EDIT_MODES, ENTITY_ACTIONS_LABELS, ENTITY_ACTIONS_SLUGS, ENTITY_TRIGGER_LABELS, ENTITY_TRIGGER_SLUGS, IWBScene, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { sendServerMessage } from '../../../components/messaging'
import { selectedItem } from '../../../components/modes/build'
import { uiSizes } from '../../uiConfig'
import { sceneBuilds } from '../../../components/scenes'
import { TriggerAreaActionComponent } from './TriggerAreaActionComponentPanel'
import { localPlayer } from '../../../components/player/player'

export let triggerAreaView = "main"
export let actionView:string = ""
let selectedIndex:number = 0

let actionNames:string[] = []
let actionIds:string[] = []

let currentActions:any[] = []

export function updateTriggerAreaActionView(v:string, type?:boolean){
    triggerAreaView = v
    if(type){
        actionView = v
        updateCurrentActions()
    }

}

export function TriggerAreaComponent() {
    return (
        <UiEntity
            key={"edittriggerareacomponentpanel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.TRIGGER_AREA_COMPONENT ? 'flex' : 'none',
            }}
        >

            {/* main view */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: triggerAreaView === "main" ? 'flex' : 'none',
            }}
        >

              {/* enabled row */}
              <UiEntity
            uiTransform={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:"1%", bottom:'2%'}
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
            height: calculateSquareImageDimensions(6).height,
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: selectedItem && selectedItem.enabled && selectedItem.itemData.trigArComp ? (selectedItem.itemData.trigArComp.enabled ? getImageAtlasMapping(uiSizes.toggleOffNoBlack) : getImageAtlasMapping(uiSizes.toggleOnNoBlack)) : getImageAtlasMapping(uiSizes.toggleOnNoBlack)
        }}
        onMouseDown={() => {
            updateTrigger('toggle', "enabled", !selectedItem.itemData.trigArComp.enabled)
        }}
        />


        </UiEntity>
        </UiEntity>

        {/* enter triggers button panel */}
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
            uiText={{value: "Enter Trigger Actions", fontSize: sizeFont(30, 20)}}
            onMouseDown={() => {
                // openEditComponent(component)
                updateTriggerAreaActionView("eActions", true)
            }}
            />

        {/* leave triggers button panel */}
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
            uiText={{value: "Leave Trigger Actions", fontSize: sizeFont(30, 20)}}
            onMouseDown={() => {
                // openEditComponent(component)
                updateTriggerAreaActionView("lActions", true)
            }}
            />
     
        </UiEntity>


        {/* enter actions panel  */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '80%',
                display: actionView === "eActions" && triggerAreaView === "eActions" ? "flex" : "none"
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
                margin:{bottom:'5%'}
            }}
        uiText={{value:"Enter Trigger Actions", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

                {/* add Trigger button row */}
                <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{bottom:"2%"},
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
            uvs: getImageAtlasMapping(uiSizes.positiveButton)
        }}
        uiText={{value: "Add Enter Action", fontSize: sizeFont(20, 16)}}
        onMouseDown={() => {
            updateTriggerActions()
            updateTriggerAreaActionView("add")
        }}
    />

        </UiEntity>

        {/* trigger actions row */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '80%',
            }}
            // uiBackground={{color:Color4.Green()}}
            >
                {generateActionRows()}
                </UiEntity>


            </UiEntity>

                {/* select new enter action panel */}
                <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '80%',
                display: triggerAreaView === "add" ? "flex" : "none"
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
        uiText={{value:"Choose Enter Action", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

            {/* action dropdown panel */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
            }}
        >

            <Dropdown
        key={"trigger-area-action-dropdown-dropdown"}
        options={[...actionNames]}
        selectedIndex={selectedIndex}
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

             {/* add trigger confirm buttons */}
             <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
                margin:{top:"2%"}
            }}
            >

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30%',
            height: '100%'
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.positiveButton)
        }}
        uiText={{value: "Add", fontSize: sizeFont(20, 16)}}
        onMouseDown={() => {
            buildTrigger()
            updateTriggerAreaActionView("main", true)
        }}
    />

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30%',
                height: '100%',
                margin:{left:"5%"}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.dangerButton)
            }}
            uiText={{value: "Cancel", fontSize: sizeFont(20, 16)}}
            onMouseDown={() => {
                updateTriggerAreaActionView("main",)
            }}
        />

        </UiEntity>

                </UiEntity>

        </UiEntity>

    )
}

function updateTrigger(action:string, type:string, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.UPDATE_ITEM_COMPONENT, {component:COMPONENT_TYPES.TRIGGER_AREA_COMPONENT, action:action, data:{aid:selectedItem.aid, sceneId:selectedItem.sceneId, type:type, value:value}})
}

function buildTrigger(){
    console.log(actionIds[selectedIndex], actionView)
    updateTrigger("add", "new", {type:actionView, action:actionIds[selectedIndex]})
}

function selectAction(index:number){
    selectedIndex = index
}

function updateCurrentActions(){
    currentActions.length = 0

    if(actionView === "eActions"){
        if(localPlayer.activeScene){
            let triggerAreaActions:any[] = selectedItem.itemData.trigArComp.eActions
            let sceneActions:any[] = []

            localPlayer.activeScene.ass.forEach((asset)=>{
                if(asset.actComp){
                    asset.actComp.actions.forEach((action:any, key:any)=>{
                        console.log('action is', key, action)
                        sceneActions.push({id:key, action:action})
                    })
                }
            })     

            triggerAreaActions.forEach((taction)=>{
                console.log('t action is', taction)
                let assetAction = sceneActions.find((act)=> act.id === taction)
                console.log('asset action is', assetAction)
                if(assetAction){
                    currentActions.push(assetAction.action.name)
                }
            })
        }
    }

    if(actionView === "lActions"){
        
    }

    console.log('current actions are ', currentActions)
}

function generateActionRows(){
    let arr:any[] = []
    currentActions.forEach((action:any, i:number)=>{
        arr.push(
            <UiEntity
            key={"trigger-area-action-row" + i}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '15%',
                margin:{top:"1", bottom:'1%'}
            }}
             uiBackground={{color:Color4.Black()}}
            uiText={{value:"" + action, fontSize:sizeFont(20,15), color:Color4.White()}}
            />
        )
    })
    return arr
}

export function updateTriggerActions(){
    actionNames.length = 0
    actionIds.length = 0
    if(localPlayer.activeScene){
        localPlayer.activeScene.ass.forEach((asset)=>{
            if(asset.actComp){
                asset.actComp.actions.forEach((action:any, key:any)=>{
                    actionNames.push(action.name)
                    actionIds.push(key)
                })
            }
        })
    }
}

