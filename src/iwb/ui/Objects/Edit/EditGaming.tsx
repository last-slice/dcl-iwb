
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { log, paginateArray } from '../../../helpers/functions'
import resources, { colors, colorsLabels } from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { COMPONENT_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { cancelEditingItem, selectedItem } from '../../../modes/Build'
import { openEditComponent, visibleComponent } from '../EditAssetPanel'
import { localPlayer } from '../../../components/Player'
import { setUIClicked } from '../../ui'
import { uiSizes } from '../../uiConfig'
import { visibleIndex } from '../SceneInfoPanel'
import { utils } from '../../../helpers/libraries'

let gamingInfo:any = {}
let startScreen:string = ""
let levels:any[] = []
let visibleItems:any[] = []
let levelsIndex:number = 1

export let gameView:string = "main"

export function updateEditGameView(view:string){
    gameView = view

    if(gameView === "levels"){
        levels.length = 0
        visibleItems.length = 0
        levelsIndex = 1
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
}

export function EditGaming(){
    return (
        <UiEntity
        key={resources.slug + "advanced::gaming:panel::ui"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.GAME_COMPONENT ? 'flex' : 'none',
            }}
        >

             {/* main level view */}
             <UiEntity
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
            // gamingInfo.name = value.trim()
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
        // value={selectedItem && selectedItem.enabled  ? getDefaultCounterValue() : ""}
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
            startScreen = value.trim()
        }}
        fontSize={sizeFont(20,15)}
        placeholder={'' + (gamingInfo && gamingInfo.startScreen)}
        placeholderColor={Color4.White()}
        color={Color4.White()}
        uiTransform={{
            width: '100%',
            height: '100%',
        }}
        // value={selectedItem && selectedItem.enabled  ? getDefaultCounterValue() : ""}
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

            </UiEntity>

            {/* levels view */}
            <UiEntity
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
            // uiBackground={{color:Color4.Blue()}}
        >
            </UiEntity>

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