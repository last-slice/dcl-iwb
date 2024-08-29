
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { log, paginateArray } from '../../../helpers/functions'
import resources, { colors, colorsLabels } from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { COMPONENT_TYPES, GAME_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { cancelEditingItem, selectedItem } from '../../../modes/Build'
import { openEditComponent, visibleComponent } from '../EditAssetPanel'
import { localPlayer } from '../../../components/Player'
import { setUIClicked } from '../../ui'
import { uiSizes } from '../../uiConfig'
import { visibleIndex } from '../SceneInfoPanel'
import { utils } from '../../../helpers/libraries'

let gamingInfo:any = {}
let levels:any[] = []
let visibleItems:any[] = []
let gameItemTypes:any[] = [
    "SELECT ITEM TYPE",
    "GUN",
    "ITEM"
]

export let gameView:string = "main"


export function updateEditGameItemView(view:string){
    gameView = view

    if(gameView === "levels"){
        levels.length = 0
        visibleItems.length = 0
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(!scene){
            return
        }
        scene[COMPONENT_TYPES.LEVEL_COMPONENT].forEach((levelComponent:any, aid:string)=>{
            let nameInfo = scene[COMPONENT_TYPES.NAMES_COMPONENT].get(aid)
            levels.push({name:nameInfo.value, aid:aid, number:levelComponent.number})
        })
        visibleItems = paginateArray([...levels], visibleIndex, 7)
        console.log('level visible items are a', visibleItems)
    }
}

export function updateGameItemInfo(reset?:boolean){
    if(reset){
        gamingInfo = {}
        return
    }
    gamingInfo = {...localPlayer.activeScene[COMPONENT_TYPES.GAME_ITEM_COMPONENT].get(selectedItem.aid)}
    console.log('gaming info', gamingInfo)
}

export function EditGameItem(){
    return (
        <UiEntity
        key={resources.slug + "advanced::gaming:item::ui"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.GAME_ITEM_COMPONENT ? 'flex' : 'none',
            }}
        >

            <MainView/>
            {/* <GameVariablesView/> */}
            <GameItemGunView/>

            {/* <GameMainView/>
            <GameMetadataView/>
            
            <GameLevelsView/> */}

        </UiEntity>
    )
}

function MainView(){
    return(
        <UiEntity
        key={resources.slug + "game::item::main:view"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display: gameView === "main" ? "flex" : "none"
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
        display: gamingInfo && gamingInfo.type ? "flex" : "none"
    }}
        uiText={{value:"Type: " + (getItemType()), textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
    />

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent:'center',
        width: '100%',
        height: '10%',
        display: !gamingInfo.type ? "flex" : "none"
    }}
    >
    <Dropdown
        options={gameItemTypes}
        selectedIndex={0}
        onChange={(index:number)=>{
            if(index >0){
                gamingInfo.type = gameItemTypes[index]
                update("edit", "type", index-1)
                utils.timers.setTimeout(()=>{
                    updateEditGameItemView("main")
                }, 200)
            }
        }}
        uiTransform={{
            width: '100%',
            height: '100%',
        }}
        color={Color4.White()}
        fontSize={sizeFont(20, 15)}//
            />
    </UiEntity>

        </UiEntity>
    )
}

function GameVariablesView(){
    return(
        <UiEntity
        key={resources.slug + "game::item::variables:view"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display: gameView === "variables" ? "flex" : "none"
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
        uiText={{value:"Game Variables", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
    />

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignContent:'center',
        width: '100%',
        height: '70%',
        margin:{top:"5%"}
    }}
    // uiBackground={{color:Color4.Green()}}
    >
        {/* {selectedItem && selectedItem.enabled && generateVariableRows()} */}
    </UiEntity>

        </UiEntity>
    )
}

function GameItemGunView(){
    return(
        <UiEntity
        key={resources.slug + "game::item::gun:view"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display: gamingInfo && gamingInfo.type === 9 ? "flex" : "none"
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
        display: gamingInfo && gamingInfo.type ? "flex" : "none"
    }}
        uiText={{value:"Gun Parameters", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
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
                // updateActionData({url: value.trim()}, true)
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'Damage'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100%',
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
        }}
    >
        <Input
            onChange={(value) => {
                // updateActionData({url: value.trim()}, true)
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'Max Ammo'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
            ></Input>
    </UiEntity>

        </UiEntity>
    )
}

function update(action:string, type:string, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
        {
            component:COMPONENT_TYPES.GAME_ITEM_COMPONENT, //
            aid:selectedItem.aid, 
            sceneId:selectedItem.sceneId,
            action:action,
            [type]:value
        }
    )
}

function generateVariableRows(){
    let arr:any[] = []
    let count:number = 0
    gamingInfo && gamingInfo.variables.forEach((variable:string, i:number)=>{
        arr.push(<Row count={count} variable={variable} />)
    })
    return arr
}

function Row(data:any){
    return(
        <UiEntity
                key={resources.slug + "gaming::item::variable::row" + data.count}
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
                    width: '70%',
                    height: '100%',
                    margin:{left:'5%'}
                }}
                uiText={{value:"" + data.variable, fontSize:sizeFont(20,15), textAlign:'middle-left'}}
                />

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '30%',
                    height: '100%',
                    margin:{right:'5%'}
                }}
            > 
            <Input
                onChange={(value) => {
                    // update("edit", "name", value.trim())
                }}
                fontSize={sizeFont(20,15)}
                placeholder={'' + (gamingInfo && gamingInfo.name)}
                placeholderColor={Color4.White()}
                color={Color4.White()}
                uiTransform={{
                    width: '100%',
                    height: '100%',
                }}
                />
            </UiEntity>

            </UiEntity>
    )
}

function getItemType(){
    if(!gamingInfo.type){
        return 0
    }

    switch(gamingInfo.type){
        case 0:
            return "Gun"

        case 1:
            return "Item"

        default:
            return ""
    }
}




//