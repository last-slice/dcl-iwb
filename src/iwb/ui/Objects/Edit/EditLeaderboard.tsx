
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import resources from '../../../helpers/resources'
import { COMPONENT_TYPES, EDIT_MODES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { visibleComponent } from '../EditAssetPanel'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { selectedItem } from '../../../modes/Build'
import { sizeFont } from '../../helpers'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { utils } from '../../../helpers/libraries'
import { engine, TextAlignMode, TextShape, Transform } from '@dcl/sdk/ecs'
import { addLeaderboardEntities, updateLeadboardRowEnabled, updateLeaderboardInfo } from '../../../components/Leaderboard'

export let leaderboardView = "main"

let yOffset = 3
let padding = 0.3


let leaderboardInfo:any = {}
let topAmounts:any[] = [
    "SELECT AMOUNT TO SHOW",
    "1",
    "3",
    "5",
    "10"
]

let variables:any[] = []
let entities:any[] = []

export function resetLeadboardInfo(){
    // resetTemp()
    updateLeaderboardInfo(leaderboardInfo, leaderboardInfo.data)
}

function populateLeaderboard(){
    // resetTemp()
    console.log('entities are ', leaderboardInfo.entities)
    leaderboardInfo.entities.forEach((entity:any, i:number)=>{
        let nameShape = TextShape.getMutableOrNull(entity.name)
        if(nameShape){
            nameShape.text = entity.enabled ? "User Name " + i : ""
        }

        let valueShape = TextShape.getMutableOrNull(entity.value)
        if(valueShape){
            valueShape.text = entity.enabled ? "DATA" : ""
        }
    })
}

export function refreshLeaderboardInfo(){
    leaderboardInfo = {}
    variables.length = 0

    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        console.log("no scene for leaderboard")
        return
    }

    let leaderboard = scene[COMPONENT_TYPES.LEADERBOARD_COMPONENT].get(selectedItem.aid)
    if(!leaderboard){
        console.log("no leaderboard for scene")
        return
    }

    leaderboardInfo = {...leaderboard}

    console.log('leaderboard info is', leaderboardInfo)

    if(leaderboardInfo.type >= 0 && leaderboardInfo.variableType >= 0){
        switch(leaderboardInfo.variableType){
            case 0: //game variable
            default:
                let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
                if(!scene){
                    return []
                }

                scene[COMPONENT_TYPES.GAME_COMPONENT].forEach((gameComponent:any, aid:string)=>{
                    gameComponent.pvariables.forEach((data:any, variable:string)=>{
                        console.log('pvariable is', variable, data)
                        variables.push(variable)
                    })
                })

                variables.unshift("SELECT VARIABLE")
                break;
        }
        populateLeaderboard()
    }
    console.log('variables are ', variables)
}

export function EditLeaderboard() {
    return (
        <UiEntity
            key={resources.slug + "edit::leaderboard::panel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.LEADERBOARD_COMPONENT ? 'flex' : 'none',
            }}
        >

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
        display: leaderboardInfo.type < 0? "flex" : "none"
    }}
    >
        <Dropdown
            options={["SELECT TYPE", "3D", "UI"]}
            selectedIndex={0}
            onChange={(index:number)=>{
                update("choose", "type", index - 1)
                utils.timers.setTimeout(async ()=>{
                    if(index -1 === 0){
                        await updateLeadboardRowEnabled(selectedItem.sceneId, selectedItem.aid)
                        await refreshLeaderboardInfo()
                        populateLeaderboard()
                    }else{
                        refreshLeaderboardInfo()
                    }
                }, 200)
            }}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
            color={Color4.White()}
            fontSize={sizeFont(20, 15)}
        />
    </UiEntity>

    <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: '100%',
        display: leaderboardInfo.type >= 0 ? "flex" : "none"
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
    uiText={{textWrap:'nowrap', value:"Leaderboard Variable Type: " + getType(), fontSize:sizeFont(25,15), textAlign:'middle-left'}}
    />

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
    }}
    uiText={{textWrap:'nowrap', value:"Leaderboard Variable: GAME", fontSize:sizeFont(25,15), textAlign:'middle-left'}}
    />

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
        display: leaderboardInfo.type >=0 && leaderboardInfo.variableType >= 0 ? "none" : "flex"
    }}
    >
        <Dropdown
            options={["SELECT VARIABLE TYPE", "GAME"]}
            selectedIndex={getVariableTypeIndex()}
            onChange={(index:number)=>{
                update("edit", "variableType", index - 1)
                utils.timers.setTimeout(()=>{
                    refreshLeaderboardInfo()
                }, 200)
            }}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
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
        display: variables.length <= 1 ? "flex" :"none"
    }}
    uiText={{value:"No game variables yet. Make sure to add game variable(s) before a leaderboard.", fontSize:sizeFont(25,15), textAlign:'middle-left'}}
    />


<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
        display: variables.length > 1 ? "flex" :"none"
    }}
    uiText={{value:"Leaderboard Variable", fontSize:sizeFont(25,15), textAlign:'middle-left'}}
    />

    <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
         display: variables.length > 1 ? "flex" :"none"
    }}
    >
        <Dropdown
            options={[...variables]}
            selectedIndex={getVariableIndex()}
            onChange={(index:number)=>{
                update("edit", "variable", variables[index])
                utils.timers.setTimeout(()=>{
                    refreshLeaderboardInfo()
                }, 200)
            }}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
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
        display: variables.length > 1 ? "flex" :"none"
    }}
    uiText={{textWrap:'nowrap', value:"Leaderboard amount to show", fontSize:sizeFont(25,15), textAlign:'middle-left'}}
    />
<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
         display: variables.length > 1 ? "flex" :"none"//
    }}
    >
        <Dropdown
            options={[...topAmounts]}
            selectedIndex={getAmountIndex()}
            onChange={async(index:number)=>{
                update("edit", "topAmount", parseInt(topAmounts[index]))
                utils.timers.setTimeout(async()=>{
                    await updateLeadboardRowEnabled(selectedItem.sceneId, selectedItem.aid)
                    await refreshLeaderboardInfo()
                    populateLeaderboard()
                }, 200)
            }}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
            color={Color4.White()}
            fontSize={sizeFont(20, 15)}
        />
    </UiEntity>

    </UiEntity>

        </UiEntity>
    )
}

function getVariableTypeIndex(){
    if(!leaderboardInfo.variableType){
        return 0
    }else{
        return leaderboardInfo.variableType + 1
    }
}

function getVariableIndex(){
    if(!leaderboardInfo.variable){
        return 0
    }else{
        return variables.findIndex($ => $ === leaderboardInfo.variable)
    }
}

function getAmountIndex(){
    if(!leaderboardInfo.topAmount){
        return 0
    }else{
        return topAmounts.findIndex($ => $ === leaderboardInfo.topAmount.toFixed(0))
    }
}

function getType(){
    switch(leaderboardInfo.type){
        case 0:
            return "3D"

        case 1:
            return "UI"

        default:
            return ""
    }
}

function update(action:string, type:string, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
        {
            component:COMPONENT_TYPES.LEADERBOARD_COMPONENT, 
            aid:selectedItem.aid, 
            sceneId:selectedItem.sceneId,
            action:action,
            type:type,
            data:value
        }
    )
}