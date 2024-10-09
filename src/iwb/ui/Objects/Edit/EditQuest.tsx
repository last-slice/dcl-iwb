import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import resources from '../../../helpers/resources'
import { COMPONENT_TYPES, NOTIFICATION_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { visibleComponent } from '../EditAssetPanel'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { selectedItem } from '../../../modes/Build'
import { setUIClicked } from '../../ui'
import { Color4 } from '@dcl/sdk/math'
import { utils } from '../../../helpers/libraries'
import { uiSizes } from '../../uiConfig'
import { getAssetPhysicsData } from './EditPhysics'
import { showNotification } from '../NotificationPanel'


export let questEditView = "main"
let loading = false//

let editQuest:any = {
    name:"",
    description:"",
    steps:[],
    prerequisites:[],
    enabled:false
}

let tempStep:any = {
    id:"",
    description:"",
    prerequisites:[],
    order:true
}

export function updateQuestLoading(value:boolean){
    loading = value
}

export function updateQuestEditView(view:string){
    questEditView = view
}

export function updateEditQuestInfo(info:any){
    editQuest.steps = info.steps
    editQuest.prerequisities = info.prerequisities
    updateQuestLoading(false)

    console.log('edit quest update is', editQuest)
}

export function getQuestDefinition(skipFetch?:boolean){
    loading = true
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }

    tempStep = {
        id:"",
        description:"",
        prerequisites:[]
    }
    
    let questInfo:any = scene[COMPONENT_TYPES.QUEST_COMPONENT].get(selectedItem.aid)
    if(!questInfo){
        return
    }
    editQuest = {...questInfo}
    editQuest.prerequisites = []
    editQuest.steps = []

    console.log("edit quest is", editQuest)

    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET,
        {
            component:COMPONENT_TYPES.QUEST_COMPONENT,
            aid:selectedItem.aid,
            sceneId:selectedItem.sceneId,
            action:'definition',
        }
    )
}

export function EditQuest() {
    return (
        <UiEntity
            key={resources.slug + "edit::quest::panel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.QUEST_COMPONENT ? 'flex' : 'none',
            }}
        >

            <Loading/>
            <MainView/>
            <Details/>
            <Steps/>
            <AddStep/>

        </UiEntity>
    )
}

function MainView(){
    return(
        <UiEntity
        key={resources.slug + "edit::quest::main::panel"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display: !loading && questEditView === "main" ? 'flex' : 'none',
        }}
    >
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:'1%', bottom:'1%'}
            }}
            uiBackground={{color: Color4.Black()}}
            uiText={{value: "Details", fontSize: sizeFont(30, 20)}}
            onMouseDown={() => {
                setUIClicked(true)
                questEditView = "details"
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
                height: '10%',
                margin:{top:'1%', bottom:'1%'}
            }}
            uiBackground={{color: Color4.Black()}}
            uiText={{value: "Analytics", fontSize: sizeFont(30, 20)}}
            onMouseDown={() => {
                setUIClicked(true)
                questEditView = "Analytics"
                setUIClicked(false)
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
        />
         {/* <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:'1%', bottom:'1%'}
            }}
            uiBackground={{color: Color4.Black()}}
            uiText={{value: "Conditions", fontSize: sizeFont(30, 20)}}
            onMouseDown={() => {
                setUIClicked(true)
                questEditView = "conditions"
                setUIClicked(false)
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
        /> */}
         <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:'1%', bottom:'1%'}
            }}
            uiBackground={{color: Color4.Black()}}
            uiText={{value: "Steps", fontSize: sizeFont(30, 20)}}
            onMouseDown={() => {
                setUIClicked(true)
                questEditView = "steps"
                setUIClicked(false)
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
        />
    </UiEntity>
    )
}

function Details(){
    return(
        <UiEntity
        key={resources.slug + "edit::quest::details::panel"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display: !loading && questEditView === "details" ? 'flex' : 'none',
        }}
    >
                <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
            uiText={{value:"Quest Name", fontSize:sizeFont(25, 20), textAlign:'middle-left'}}
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
            onChange={(input) => {
                editQuest.name = input.trim()
            }}
            onSubmit={(input) => {
                editQuest.name = input.trim()
           }}
            color={Color4.White()}
            fontSize={sizeFont(25, 15)}
            placeholder={"" + (editQuest && editQuest.name)}
            placeholderColor={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
            />
        </UiEntity>

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
            uiText={{value:"Quest Description", fontSize:sizeFont(25, 20), textAlign:'middle-left'}}
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
            onChange={(input) => {
                editQuest.description = input.trim()
            }}
            onSubmit={(input) => {
                editQuest.description = input.trim()
           }}
            color={Color4.White()}
            fontSize={sizeFont(25, 15)}
            placeholder={"" + (editQuest && editQuest.description)}
            placeholderColor={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
            />
        </UiEntity>


        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
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
            uiText={{value:"Quest Enabled", fontSize:sizeFont(25, 20), textAlign:'middle-left'}}
        />

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
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
            width: calculateSquareImageDimensions(4).width,
            height: calculateSquareImageDimensions(4).height,
            margin:{top:"1%", bottom:'1%'},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: editQuest.enabled ? 
            getImageAtlasMapping(uiSizes.toggleOnTrans) : 
            getImageAtlasMapping(uiSizes.toggleOffTrans)
        }}
        onMouseDown={() => {
            setUIClicked(true)
            if(editQuest.steps.length > 0){
                editQuest.enabled = !editQuest.enabled
                utils.timers.setTimeout(()=>{
                }, 200)
            }else{
                showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Create at least one(1) step for your quest before enabling.", animate:{enabled:true, return:true, time:3}})
            }
            setUIClicked(false)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
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
        height: '10%',
    }}
    >
            <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20%',
            height: '100%',
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
        }}
        uiText={{value: "Update", fontSize: sizeFont(20, 16)}}
        onMouseDown={() => {
            setUIClicked(true)
            update("edit", "metadata", {name:editQuest.name, description:editQuest.description, enabled:editQuest.enabled})
            utils.timers.setTimeout(()=>{
                updateQuestEditView("main")
            }, 200)
            setUIClicked(false)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
    />
        </UiEntity>

    </UiEntity>
    )
}

function Steps(){
    return(
        <UiEntity
        key={resources.slug + "edit::quest::steps::panel"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display: !loading && questEditView === "steps" ? 'flex' : 'none',
        }}
    >

<UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
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
            uiText={{value:"Quest Steps", fontSize:sizeFont(25, 20), textAlign:'middle-left'}}
        />

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30%',
                height: '100%',
            }}
        >
             <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '70%',
            height: '100%',
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
            setUIClicked(true)
            updateQuestEditView("add-step")
            setUIClicked(false)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
    />
        </UiEntity>

</UiEntity>

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '90%',
            }}
        >
            {
                visibleComponent === COMPONENT_TYPES.QUEST_COMPONENT &&
                questEditView === "steps" &&
                generateStepsRows()
            }
        </UiEntity>


    </UiEntity>
    )
}

function AddStep(){
    return(
        <UiEntity
        key={resources.slug + "edit::quest::steps::add::panel"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display: !loading && questEditView === "add-step" ? 'flex' : 'none',
        }}
    >
         <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
            uiText={{value:"New Quest Step", fontSize:sizeFont(25, 20), textAlign:'middle-left'}}
        />

<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
            uiText={{value:"Step Description", fontSize:sizeFont(25, 20), textAlign:'middle-left'}}
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
            onChange={(input) => {
                tempStep.description = input.trim()
            }}
            onSubmit={(input) => {
                tempStep.description = input.trim()
           }}
            color={Color4.White()}
            fontSize={sizeFont(25, 15)}
            placeholder={"Enter description"}
            placeholderColor={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
            />
        </UiEntity>


        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
            uiText={{value:"Step Condition", fontSize:sizeFont(25, 20), textAlign:'middle-left'}}
        />


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
<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent:'center',
        width: '80%',
        height: '100%',
    }}
>
<Dropdown
        options={["Select Condition",...editQuest.prerequisites]}
        selectedIndex={0}
        onChange={(index:number)=>{
            if(index !== 0){
                tempStep.prerequisites.push()
            }
        }}
        uiTransform={{
            width: '100%',
            height: '100%',
        }}
        // uiBackground={{color:Color4.Purple()}}//
        color={Color4.White()}
        fontSize={sizeFont(20, 15)}
    />
    </UiEntity>

    <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent:'center',
        width: '20%',
        height: '100%',
    }}
>
             <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
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
            setUIClicked(true)
            setUIClicked(false)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
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
                height: '10%',
            }}
            uiText={{value:"Current Conditions", fontSize:sizeFont(25, 20), textAlign:'middle-left'}}
        />

    <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent:'center',
        width: '100%',
        height: '30%',
    }}
></UiEntity>


{/* add step button row */}
<UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
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
        >
             <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
        }}
        uiText={{value: "Add Step", fontSize: sizeFont(20, 16)}}
        onMouseDown={() => {
            setUIClicked(true)
            update("add-step", "step", tempStep)
            utils.timers.setTimeout(()=>{
                updateQuestEditView("steps")
                getQuestDefinition()
            }, 200)
            setUIClicked(false)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
    />
        </UiEntity>

</UiEntity>


        </UiEntity>
    )
}

function generateStepsRows(){
    let arr:any[] = []
    let count:number = 0//

    editQuest.steps.forEach((step:any, i:number)=>{
            arr.push(<StepRow count={count} step={step}/>)
            count++
    })
    return arr
}

function StepRow(data:any){
    return(
        <UiEntity
                key={resources.slug + "quest::step::row" + data.count}
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    height: '10%',
                    margin:{top:"1%", bottom:"1%"}
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas1.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.vertRectangleOpaque)
                }}
            >
                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '80%',
                    height: '100%',
                    margin:{left:'5%'}
                }}
                >
                    <UiEntity
                        uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                    }}
                    uiText={{value:"" + data.step.description, fontSize:sizeFont(20,15), textAlign:'middle-left'}}
                    />

                </UiEntity>

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent:'center',
                    width: '20%',
                    height: '100%',
                    margin:{right:'5%'}
                }}
            >
                 <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).width,
                    height: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).height,
                    positionType:'absolute',
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
                    setUIClicked(false)
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
                />  

            </UiEntity>

            </UiEntity>
    )
}

function Loading(){
    return(
        <UiEntity
        key={resources.slug + "edit::quest::loading::panel"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display: loading ? 'flex' : 'none',
        }}
        uiText={{value:"LOADING...", fontSize:sizeFont(25,20), textAlign:'middle-center'}}
    >
    </UiEntity>
    )
}

function update(action:string, type:string, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
        {
            component:COMPONENT_TYPES.QUEST_COMPONENT, 
            aid:selectedItem.aid, 
            sceneId:selectedItem.sceneId,
            action:action,
            [type]:value,
        }
    )
}
