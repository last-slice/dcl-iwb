
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { log } from '../../../helpers/functions'
import resources, { colors, colorsLabels } from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { Actions, COMPONENT_TYPES, SERVER_MESSAGE_TYPES, Triggers } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
import { visibleComponent } from '../EditAssetPanel'
import { setUIClicked } from '../../ui'
import { uiSizes } from '../../uiConfig'
import { AddNumberActionPanel } from './ActionPanels/AddNumberPanel'
import { AddLinkActionPanel } from './ActionPanels/AddLinkPanel'
import { AddEmoteActionPanel } from './ActionPanels/AddEmotePanel'
import { AddVisibilityActionPanel } from './ActionPanels/AddVisibilityPanel'

export let actionView = "main"
export let newActionData:any = {}

let newActionIndex:number = 0

export function updateActionView(value:string){
    actionView = value
}

export function updateActionData(value:any, clear?:boolean){
    if(clear){
        newActionData = {}
    }

    for(let key in value){
        newActionData[key] = value[key]
    }
}

export function EditAction(){
    return (
        <UiEntity
        key={resources.slug + "advanced::action:panel::ui"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.ACTION_COMPONENT ? 'flex' : 'none',
            }}
        >

            {/* main action panel view */}
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent:'center',
            width: '100%',
            height: '100%',
            display: actionView === "main" ? "flex" : "none"
        }}
        >
                    <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf:'flex-start',
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
            uiText={{
                value: "Add Action",
                fontSize: sizeFont(25, 15),
                color: Color4.White(),
                textAlign: 'middle-center'
            }}
            onMouseDown={() => {
                setUIClicked(true)
                updateActionView("add")
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

        {/* current action list container */}
            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            alignContent:'center',
            width: '100%',
            height: '70%',
        }}
        > 
    
        {selectedItem && selectedItem.enabled && getActions()}

        </UiEntity>

        </UiEntity>

        {/* add action panel view */}
        <UiEntity
            uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            alignContent:'center',
            width: '100%',
            height: '100%',
            display: actionView === "add" ? "flex" : "none"
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
                uiText={{value:"Add Action", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
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
                    options={getActionList()}
                    selectedIndex={newActionIndex}
                    onChange={selectNewActionIndex}
                    uiTransform={{
                        width: '100%',
                        height: '100%',
                    }}
                    // uiBackground={{color:Color4.Purple()}}
                    color={Color4.White()}
                    fontSize={sizeFont(20, 15)}
                />

            </UiEntity>

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                display: newActionIndex !== 0 ? "flex": "none"
            }}
        >

        <Input
            onChange={(value) => {
                newActionData.name = value.trim()
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'Enter Action Name'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
            ></Input>

        </UiEntity>

        {/* action subpanel container */}
            <UiEntity
            uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            alignContent:'center',
            width: '100%',
            height: '60%',
            margin:{top:"5%"},
            display: newActionIndex !== 0 ? "flex": "none"
            }}
        >
            {getActionDataPanel()}
            </UiEntity>


            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin: {left: "1%", right: "1%"}
            }}
            >

            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40%',
                height: '100%',
                margin: {left: "1%", right: "1%"},
                display: newActionIndex !== 0 ? "flex" : "none"
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            uiText={{value: "Add Action", fontSize: sizeFont(20, 16)}}
            onMouseDown={() => {
                setUIClicked(false)
                buildAction()
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

function getActions(){
    let arr:any[] = []
    let count = 0
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(scene){
        let actions = scene.actions.get(selectedItem.aid)
        if(actions){
            actions.actions.forEach((action:any, i:number)=>{
                arr.push(<ActionRow data={action} rowCount={count} />)
                count++
            })
        }
    }
    return arr
}

export function ActionRow(info:any){
    let data:any = info.data
    return(
        <UiEntity
        key={resources.slug + "action-row-"+ info.rowCount}
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
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
            uiText={{value:"" + data.name, textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
            />

             <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40%', 
                height: '100%',
            }}
            uiText={{value:"" + (data.type && data.type.replace(/_/g, ' ').replace(/\b\w/g, (char:any) => char.toUpperCase())), fontSize:sizeFont(20,15), color:Color4.White()}}
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
                    // updateTrigger('delete', 'remove', trigger.rowCount)
                    update("delete", {id:data.id})
                }}
            />
                </UiEntity>

            </UiEntity>
    )
}

function getActionList(){
    return [...["Select New Action"],...Object.values(Actions).map(str => str.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())).sort((a,b)=> a.localeCompare(b))]
}

function selectNewActionIndex(index:number){
    newActionIndex = index
    if(index !== 0){
        newActionData.type = getActionList()[index].replace(" ", "_").toLowerCase()
        newActionData.name = getActionList()[index].replace(" ", "_").toLowerCase()
        let actionTemplate = ActionDefaults[getActionList()[index].replace(" ", "_").toLowerCase()]
        for(let key in actionTemplate){
            newActionData[key] = actionTemplate[key]
        }
    }
}

function getActionDataPanel(){
    switch(getActionList()[newActionIndex]){
        case Actions.ADD_NUMBER.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddNumberActionPanel/>

        case Actions.OPEN_LINK.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddLinkActionPanel/>

         case Actions.MOVE_PLAYER.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddLinkActionPanel/>

        case Actions.EMOTE.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddEmoteActionPanel/>

        case Actions.SET_VISIBILITY.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()):
            return <AddVisibilityActionPanel/>

        //play sound - doesnt need any action metadata
        //stop sound - doesnt need any action metadata
        //play video - doesnt need any action metadata
        //stop video - doesnt need any action metadata
        //stop animations - doesnt need any action metadata

    }
}

function update(action:string, actionData:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET,
        {
            component:COMPONENT_TYPES.ACTION_COMPONENT,
            aid:selectedItem.aid,
            sceneId:selectedItem.sceneId,
            action:action,
            data:actionData,
        }
    )
}

function buildAction(){
    update("add", newActionData)
    updateActionView("main")
    selectNewActionIndex(0)
}



const ActionDefaults:any = {
    [Actions.ADD_NUMBER]:{
        value:0
    },
    [Actions.OPEN_LINK]:{
        url:""
    },
    [Actions.EMOTE]:{
        emote:"wave"
    },
    [Actions.SET_VISIBILITY]:{
        iMask:0,
        vMask:0
    }
}