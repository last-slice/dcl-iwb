
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
let gameTypes:any[] = []

let gameTypeIndex:number = 0

let newVariable:string = ""

export let gameView:string = "main"


export function updateEditGameView(view:string){
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

export function updateGamingInfo(reset?:boolean){
    if(reset){
        gamingInfo = undefined
        return
    }
    gamingInfo = {...localPlayer.activeScene[COMPONENT_TYPES.GAME_COMPONENT].get(selectedItem.aid)}
    gameTypes.length = 0

    gameTypes = Object.keys(GAME_TYPES).filter($ => isNaN(parseInt($)))
    gameTypes.unshift("Select Game Type")

    if(gamingInfo.type){
        let typeIndex = gameTypes.findIndex($ => $ === gamingInfo.type)
        if(typeIndex >= 0){
            gameTypeIndex = typeIndex
        }
    }
    newVariable = ""
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
            {/* <GameMainView/>
            <GameMetadataView/>
            <GameVariablesView/>
            <GameLevelsView/> */}

        </UiEntity>
    )
}

function GameMainView(){
    return(
        <UiEntity
        key={resources.slug + "game::main:view"}
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
                }}
                    uiText={{value:"Game Type", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
                />

            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent:'center',
                    width: '100%',
                    height: '8%',
                }}
            >

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent:'center',
                    width: '70%',
                    height: '100%',
                }}
            >
                <Dropdown
                    options={gameTypes.map($ => $.replace("_", " "))}
                    selectedIndex={gameTypeIndex}
                    onChange={(index:number)=>{gameTypeIndex = index}}
                    uiTransform={{
                        width: '100%',
                        height: '120%',
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
                    width: '30%',
                    height: '100%',
                }}
            >
                    <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '90%',
                    height: '100%',
                    margin: {left: "1%", right: "1%"}
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
                    if(gameTypeIndex > 0){
                        // gamingInfo.type = gameTypes[gameTypeIndex]
                        update("edit-type", "gameType", gameTypes[gameTypeIndex])
                        utils.timers.setTimeout(()=>{
                            updateGamingInfo()
                        }, 200)
                    }
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
                    margin:{top:'1%', bottom:'1%'}
                }}
                uiBackground={{color: Color4.Black()}}
                uiText={{value: "Details", fontSize: sizeFont(30, 20)}}
                onMouseDown={() => {
                    setUIClicked(true)
                    updateEditGameView("metadata")
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
                    margin:{top:'1%', bottom:'1%'},
                }}
                uiBackground={{color: Color4.Black()}}
                uiText={{value: "Variables", fontSize: sizeFont(30, 20)}}
                onMouseDown={() => {
                    setUIClicked(true)
                    updateEditGameView("variables")
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
                    margin:{top:'1%', bottom:'1%'},
                    display: gamingInfo && gamingInfo.type === "SOLO" ? "flex" : "none"
                }}
                uiBackground={{color: Color4.Black()}}
                uiText={{value: "Levels", fontSize: sizeFont(30, 20)}}
                onMouseDown={() => {
                    setUIClicked(true)
                    updateEditGameView("levels")
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
                    margin:{top:'1%', bottom:'1%'},
                    display: gamingInfo && gamingInfo.type === "TEAM_COMPETITION" ? "flex" : "none"
                }}
                uiBackground={{color: Color4.Black()}}
                uiText={{value: "Teams", fontSize: sizeFont(30, 20)}}
                onMouseDown={() => {
                    setUIClicked(true)
                    updateEditGameView("teams")
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
            />

        </UiEntity>
    )
}

function GameMetadataView(){
    return(
        <UiEntity
        key={resources.slug + "game::metadata:view"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display: gameView === "metadata" ? "flex" : "none"
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
        uiText={{value:"Game Name", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
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
        update("edit", "name", value.trim())
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

        <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent:'center',
        width: '100%',
        height: '10%',
    }}
        uiText={{value:"Game Description", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
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
        // gamingInfo.description = value.trim()//
        update("edit", "description", value.trim())
    }}
    fontSize={sizeFont(20,15)}
    placeholder={'' + (gamingInfo && gamingInfo.description)}
    placeholderColor={Color4.White()}
    color={Color4.White()}
    uiTransform={{
        width: '100%',
        height: '100%',
    }}
    // value={selectedItem && selectedItem.enabled  ? getDefaultCounterValue() : ""}
    />

    </UiEntity>

    {/* disable teleport options */}
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
                    uiText={{value:"Disable Teleporting", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
                />
        </UiEntity>

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
                uvs: gamingInfo && gamingInfo.disableTeleport ? getImageAtlasMapping(uiSizes.toggleOnTrans) : getImageAtlasMapping(uiSizes.toggleOffTrans)
            }}
            onMouseDown={() => {
                gamingInfo.disableTeleport = !gamingInfo.disableTeleport
                update("edit", "disableTeleport", gamingInfo.disableTeleport)
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
    display: gamingInfo && gamingInfo.startScreen !== "iwb" ? "flex" : "none"
}}
>
<Input
    onChange={(value) => {
        // startScreen = value.trim()
    }}
    fontSize={sizeFont(20,15)}
    placeholder={'' + (gamingInfo && gamingInfo.startScreen)}
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

function GameLevelsView(){
    return(
        <UiEntity
        key={resources.slug + "game::levels:view"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display: gameView === "levels" ? "flex" : "none"
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
                    width: '50%',
                    height: '100%',
                }}
            >
                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin:{bottom:'1%'}
                }}
            uiText={{value:"Levels", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
            />

            </UiEntity>

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
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf:'flex-start',
                        width: calculateImageDimensions(7, getAspect(uiSizes.buttonPillBlack)).width,
                        height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
                        margin:{left:'1%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                    }}
                    uiText={{
                        value: "Add Level",
                        fontSize: sizeFont(25, 15),
                        color: Color4.White(),
                        textAlign: 'middle-center'
                    }}
                    onMouseDown={() => {
                        setUIClicked(true)
                        update("addlevel", "", {})
                        utils.timers.setTimeout(()=>{
                            updateEditGameView('levels')
                        }, 200)
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
                alignSelf:'flex-start',
                width: '100%',
                height: '80%',
            }}
            // uiBackground={{color:Color4.Green()}}
        >

            {gameView === "levels" && generateLevels()}
            
        </UiEntity>

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf:'flex-start',
                width: '100%',
                height: '10%',
            }}
            // uiBackground={{color:Color4.Blue()}}//
        >
            </UiEntity>

            </UiEntity>
    )
}

function GameVariablesView(){
    return(
        <UiEntity
        key={resources.slug + "game::variables:view"}
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
        uiText={{value:"Add Game Variable", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
    />

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
    >

    <Input
        onChange={(value) => {
            newVariable = value.trim()
        }}
        fontSize={sizeFont(20,15)}
        placeholder={'enter variable name'}
        placeholderColor={Color4.White()}
        color={Color4.White()}
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
        width: '30%',
        height: '100%',
    }}
    >
        <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '90%',
                    height: '100%',
                    margin: {left: "1%", right: "1%"}
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
                    update("edit", "variables", newVariable)
                    utils.timers.setTimeout(()=>{
                        updateGamingInfo()
                    }, 200)
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
        alignContent:'center',
        width: '100%',
        height: '70%',
        margin:{top:"5%"}
    }}
    // uiBackground={{color:Color4.Green()}}
    >
        {selectedItem && selectedItem.enabled && gameView === "variables" && generateVariableRows()}
    </UiEntity>

        </UiEntity>
    )
}

function update(action:string, type:string, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
        {
            component:COMPONENT_TYPES.GAME_COMPONENT, 
            aid:selectedItem.aid, 
            sceneId:selectedItem.sceneId,
            action:action,
            [type]:value
        }
    )
}

function generateLevels(){
    let arr:any[] = []
    let count:number = 0
    visibleItems.forEach((levelItem:any, i:number)=>{
        arr.push(<LevelRow count={count} data={levelItem} />)
        count++
    })
    return arr
}

function LevelRow(data:any){
    let levelInfo = data.data
    return(
        <UiEntity
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
                    width: '60%',
                    height: '100%',
                    margin:{left:'5%'}
                }}
                uiText={{value:"" + levelInfo.name, fontSize:sizeFont(20,15), textAlign:'middle-left'}}
                />

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '20%',
                    height: '100%',
                }}
                uiText={{value:"" + levelInfo.number, fontSize:sizeFont(20,15), textAlign:'middle-center'}}
                />

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '20%',
                    height: '100%',
                }}
                />

            </UiEntity>
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
                key={resources.slug + "gaming::variable::row" + data.count}
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
                uiText={{value:"" + data.variable, fontSize:sizeFont(20,15), textAlign:'middle-left'}}
                />

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
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
                    update("delete-variable", "variables", data.variable)
                    utils.timers.setTimeout(()=>{
                        updateGamingInfo()
                    }, 200)
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
                />  

            </UiEntity>

            </UiEntity>
    )
}