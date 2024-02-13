
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { visibleComponent } from './EditObjectDataPanel'
import { COMPONENT_TYPES, EDIT_MODES, ENTITY_ACTIONS_LABELS, ENTITY_ACTIONS_SLUGS, ENTITY_TRIGGER_LABELS, ENTITY_TRIGGER_SLUGS, IWBScene, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { sendServerMessage } from '../../../components/messaging'
import { selectedItem } from '../../../components/modes/build'
import { uiSizes } from '../../uiConfig'
import { sceneBuilds } from '../../../components/scenes'
import { localPlayer } from '../../../components/player/player'
import { utils } from '../../../helpers/libraries'
import { getActionLabel } from './TriggerComponent'

export let triggerAreaView = "main"
export let actionView:string = ""
let selectedIndex:number = 0

let actionNames:string[] = []
let actionIds:string[] = []
let actionLabels:any[] = []

let currentActions:any[] = []
let currentActionIds:any[] = []

export function updateTriggerAreaActionView(v:string, type?:boolean){
    triggerAreaView = v
    if(type){
        actionView = v
        updateTriggerActions()
        updateCurrentActions()
    }
    console.log('action view is', triggerAreaView, actionView)
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
            uvs: selectedItem && selectedItem.enabled && selectedItem.itemData.trigArComp ? (selectedItem.itemData.trigArComp.enabled ? getImageAtlasMapping(uiSizes.toggleOnTrans) : getImageAtlasMapping(uiSizes.toggleOffTrans)) : getImageAtlasMapping(uiSizes.toggleOnTrans)
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
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
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

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '10%',
                margin:{top:'1%', bottom:'1%'}
            }}
            uiText={{value:"Current Actions", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
            />

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
                display: triggerAreaView === "add" && actionView === "eActions" ? "flex" : "none"
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
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
        }}
        uiText={{value: "Add", fontSize: sizeFont(20, 16)}}
        onMouseDown={() => {
            buildTrigger()
            updateTriggerAreaActionView(actionView, true)
            utils.timers.setTimeout(()=>{
                updateCurrentActions()
            }, 1000 * 1)
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
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            uiText={{value: "Cancel", fontSize: sizeFont(20, 16)}}
            onMouseDown={() => {
                updateTriggerAreaActionView("main")
            }}
        />

        </UiEntity>

                </UiEntity>

        {/* leave actions */}
                <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '80%',
                display: actionView === "lActions" && triggerAreaView === "lActions" ? "flex" : "none"
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
        uiText={{value:"Leave Trigger Actions", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
        }}
        uiText={{value: "Add Leave Action", fontSize: sizeFont(20, 16)}}
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

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '10%',
                margin:{top:'1%', bottom:'1%'}
            }}
            uiText={{value:"Current Actions", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
            />

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
                display: triggerAreaView === "add" && actionView === "lActions" ? "flex" : "none"
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
        uiText={{value:"Choose Leave Action", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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
        key={"trigger-area-leave-action-dropdown-dropdown"}
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
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
        }}
        uiText={{value: "Add", fontSize: sizeFont(20, 16)}}
        onMouseDown={() => {
            buildTrigger()
            updateTriggerAreaActionView(actionView, true)
            utils.timers.setTimeout(()=>{
                updateCurrentActions()
            }, 1000 * 1)
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
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            uiText={{value: "Cancel", fontSize: sizeFont(20, 16)}}
            onMouseDown={() => {
                updateTriggerAreaActionView("main", true)
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
    currentActionIds.length = 0

    if(actionView === "eActions"){
        if(localPlayer.activeScene){
            let triggerAreaActions:any[] = selectedItem.itemData.trigArComp.eActions

            triggerAreaActions.forEach((taction)=>{
                localPlayer.activeScene!.ass.forEach((asset)=>{
                    if(asset.actComp){
                        let assetActions = asset.actComp.actions
                        if(assetActions[taction.id]){
                            let action = assetActions[taction.id]

                            currentActions.push(action)
                            currentActionIds.push(taction)
                        }
                    }
                })    
            })
        }
    }

    if(actionView === "lActions"){
        if(localPlayer.activeScene){
            let triggerAreaActions:any[] = selectedItem.itemData.trigArComp.lActions

            triggerAreaActions.forEach((taction)=>{

                localPlayer.activeScene!.ass.forEach((asset)=>{
                    if(asset.actComp){
                        let assetActions = asset.actComp.actions
                        if(assetActions[taction.id]){
                            let action = assetActions[taction.id]

                            currentActions.push(action)
                            currentActionIds.push(taction)
                        }
                    }
                })    
            })
        }
    }
}

function generateActionRows(){
    let arr:any[] = []
    currentActions.forEach((action:any, i:number)=>{
        arr.push(
            <UiEntity
            key={"trigger-area-action-row" + i}
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

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '40%',
                height: '100%',
            }}
            uiText={{value:"" + action.name, fontSize:sizeFont(20,15), color:Color4.White()}}
            />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '40%',
                height: '100%',
            }}
            uiText={{value:"" + getActionLabel(action.aid), fontSize:sizeFont(20,15), color:Color4.White(), textAlign:'middle-left'}}
            />


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
                updateTrigger("delete", "", {type:actionView, action:currentActionIds[i]})
                utils.timers.setTimeout(()=>{
                    updateCurrentActions()
                }, 1000 * 1)
            }}
        />

            </UiEntity>







            </UiEntity>
        )
    })
    return arr
}

export function updateTriggerActions(){
    actionNames.length = 0
    actionIds.length = 0
    actionLabels.length = 0
    if(localPlayer.activeScene){
        localPlayer.activeScene.ass.forEach((asset)=>{
            if(asset.actComp){
                asset.actComp.actions.forEach((action:any, key:any)=>{
                    actionNames.push(action.name)
                    actionIds.push(key)
                    actionLabels.push(action.type)
                })
            }
        })
    }
}
