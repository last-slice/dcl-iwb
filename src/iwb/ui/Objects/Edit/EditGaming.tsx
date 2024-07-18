
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, getRandomColor4, sizeFont } from '../../helpers'
import { log, paginateArray } from '../../../helpers/functions'
import resources, { colors, colorsLabels } from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { COMPONENT_TYPES, EDIT_MODIFIERS, GAME_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { cancelEditingItem, editItem, selectedItem } from '../../../modes/Build'
import { openEditComponent, visibleComponent } from '../EditAssetPanel'
import { localPlayer } from '../../../components/Player'
import { setUIClicked } from '../../ui'
import { uiSizes } from '../../uiConfig'
import { visibleIndex } from '../SceneInfoPanel'
import { utils } from '../../../helpers/libraries'
import { Billboard, BillboardMode, engine, Entity, Material, MeshRenderer, TextShape, Transform } from '@dcl/sdk/ecs'
import { getRandomHexColor } from '../../../../ui_components/utilities'
import { TransformInputModifiers } from './EditTransform'//

let gamingInfo:any = {}
let levels:any[] = []
let visibleItems:any[] = []
let gameTypes:any[] = []
let teamEntities:any[] = []

let gameTypeIndex:number = 0

let newVariable:string = ""
let newVariableValue:string = ""

let editTeam:any

export let gameView:string = "main"

export function updateEditGameView(view:string){
    gameView = view

    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(!scene){
            return
        }

    if(gameView === "levels"){
        levels.length = 0
        visibleItems.length = 0

        scene[COMPONENT_TYPES.LEVEL_COMPONENT].forEach((levelComponent:any, aid:string)=>{
            let nameInfo = scene[COMPONENT_TYPES.NAMES_COMPONENT].get(aid)
            levels.push({name:nameInfo.value, aid:aid, number:levelComponent.number})
        })
        visibleItems = paginateArray([...levels], visibleIndex, 7)
        console.log('level visible items are a', visibleItems)
    }

    if(gameView === "teams"){
        addTeamEntities(scene)
    }

    if(gameView === "lobby-edit-spawns"){
        addLobbySpawnEntity(scene)
    }
    return scene
}

function addTeamEntities(scene:any){
    gamingInfo.teams.forEach((team:any, id:string)=>{
        addTeamEntity(scene, id, team)
    })
}

function addTeamEntity(scene:any, id:string, team:any){
    console.log('team is', team)
    if(teamEntities.find(($:any)=> $.id === id)){
        return 
    }

    let entity = engine.addEntity()
    Transform.create(entity, {position: team.sp, parent:scene.parentEntity})

    let plane = engine.addEntity()
    MeshRenderer.setPlane(plane)
    Material.setPbrMaterial(plane, {albedoColor: getRandomColor4(0.5)})
    Transform.create(plane, {scale:team.ss, parent:entity, rotation:Quaternion.fromEulerDegrees(90,0,0)})

    let text = engine.addEntity()
    TextShape.create(text, {text: "Team " + team.id, fontSize:5})
    Transform.create(text, {position: Vector3.create(0,1,0), parent:entity})
    Billboard.create(text, {billboardMode:BillboardMode.BM_Y})

    teamEntities.push({id:id, entity:entity, plane:plane, text:text})
}

function addLobbySpawnEntity(scene:any){
    let entity = engine.addEntity()
    Transform.create(entity, {position: gamingInfo.sp, parent:scene.parentEntity})

    let plane = engine.addEntity()
    MeshRenderer.setPlane(plane)
    Material.setPbrMaterial(plane, {albedoColor: getRandomColor4(0.5)})
    Transform.create(plane, {scale:gamingInfo.ss, parent:entity, rotation:Quaternion.fromEulerDegrees(90,0,0)})

    let text = engine.addEntity()
    TextShape.create(text, {text: "Lobby Spawn", fontSize:5})
    Transform.create(text, {position: Vector3.create(0,1,0), parent:entity})
    Billboard.create(text, {billboardMode:BillboardMode.BM_Y})
    teamEntities.push({id:gamingInfo.id + "-lobby", entity:entity, plane:plane, text:text})
}

function updateTeamSpawnPosition(direction:string, factor:number, manual?:boolean){
        let transform:any = Transform.getMutable(teamEntities.find($ => $.id === editTeam.id).entity).position
        transform[direction] = manual ? factor : transform[direction] + (factor * selectedItem.pFactor)
        update("edit-team-spawn-p", "value",  {id:editTeam.id, transform:transform})
}

function updateTeamSpawnScale(direction:string, factor:number, manual?:boolean){
    let transform:any = Transform.getMutable(teamEntities.find($ => $.id === editTeam.id).plane).scale
    transform[direction] = manual ? factor : transform[direction] + (factor * selectedItem.sFactor)
    update("edit-team-spawn-s", "value",  {id:editTeam.id, transform:transform})
}

function updateLobbySpawnPosition(direction:string, factor:number, manual?:boolean){
    let transform:any = Transform.getMutable(teamEntities.find($ => $.id === "" + gamingInfo.id + "-lobby").entity).position
    transform[direction] = manual ? factor : transform[direction] + (factor * selectedItem.pFactor)
    update("edit-lobby-spawn-p", "value", transform)
}

function updateLobbySpawnScale(direction:string, factor:number, manual?:boolean){
let transform:any = Transform.getMutable(teamEntities.find($ => $.id === "" + gamingInfo.id + "-lobby").plane).scale
transform[direction] = manual ? factor : transform[direction] + (factor * selectedItem.sFactor)
    update("edit-lobby-spawn-s", "value", transform)
}

export function removeGameTeamEntities(id?:string){
    if(id){
        let teamIndex = teamEntities.findIndex($ => $.id === id)
        if(teamIndex >= 0){
            engine.removeEntityWithChildren(teamEntities[teamIndex].entity)
            teamEntities.splice(teamIndex,1)
        }
        return
    }

    teamEntities.forEach((team:any)=>{
        engine.removeEntityWithChildren(team.entity)
    })

    teamEntities.length = 0
}

export function resetGamePanel(){
    removeGameTeamEntities()
    updateEditGameView("main")
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
    newVariableValue = ""
    console.log('gaming info', gamingInfo)
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
            <GameMainView/>
            <GameMetadataView/>
            <GameConfigurationView/>
            <GameVariablesView/>
            <GamePlayerVariablesView/>
            <GameLevelsView/>
            <GameTeamsView/>

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
                    justifyContent: 'flex-start',
                    width: '100%',
                    height: '100%',
                    display: gameView === "main" && gamingInfo && gamingInfo.type ? "flex" : "none"
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
                uiText={{value: "Game Configuration", fontSize: sizeFont(30, 20)}}
                onMouseDown={() => {
                    setUIClicked(true)
                    updateEditGameView("configuration")
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
                uiText={{value: "Game Variables", fontSize: sizeFont(30, 20)}}
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
                }}
                uiBackground={{color: Color4.Black()}}
                uiText={{value: "Player Variables", fontSize: sizeFont(30, 20)}}
                onMouseDown={() => {
                    setUIClicked(true)
                    updateEditGameView("player-variables")
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
                    display: gamingInfo && gamingInfo.type === "MULTIPLAYER" ? "flex" : "none"
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

function GameConfigurationView(){
    return(
        <UiEntity
        key={resources.slug + "game::configuration:view"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display: gameView === "configuration" || gameView === "lobby-edit-spawns" ? "flex" : "none"
        }}
        >

              {/* teams main view */}
              <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: '100%',
        display: gameView === "configuration" ? "flex" : "none"
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
        uiText={{value:"Game Configuration", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
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
            uiText={{value: "Lobby Spawn Region", fontSize: sizeFont(30, 20)}}
            onMouseDown={() => {
                setUIClicked(true)
                updateEditGameView("lobby-edit-spawns")
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
        />
        </UiEntity>

        <GameLobbyEditSpawnView/>
            

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

function GamePlayerVariablesView(){
    return(
        <UiEntity
        key={resources.slug + "game::player::variables:view"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display: gameView === "player-variables" ? "flex" : "none"
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
        uiText={{value:"Add Player Variable", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
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
            <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent:'center',
        width: '100%',
        height: '10%',
    }}
        uiText={{value:"Enable Player Timer", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
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
                uvs: selectedItem && selectedItem.enabled && gamingInfo && gamingInfo.playerTimers && gameView === "player-variables" ? getImageAtlasMapping(uiSizes.toggleOnTrans)  : getImageAtlasMapping(uiSizes.toggleOffTrans)
            }}
            onMouseDown={() => {
                update("edit", "playerTimers", gamingInfo.playerTimers ? false : true)
                utils.timers.setTimeout(()=>{
                    updateGamingInfo()
                }, 200)
            }}
            />
        </UiEntity>

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
        width: '60%',
        height: '100%',
    }}
    >

    <Input
        onChange={(value) => {
            newVariable = value.trim()
        }}
        onSubmit={(value) => {
            newVariable = value.trim()
        }}
        fontSize={sizeFont(20,15)}
        placeholder={'enter variable name'}
        placeholderColor={Color4.White()}
        color={Color4.White()}
        uiTransform={{
            width: '95%',
            height: '100%',
        }}
        />

    </UiEntity>

    <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '20%',
        height: '100%',
    }}
    >
            <Input
        onChange={(value) => {
            newVariableValue = value.trim()
        }}
        onSubmit={(value) => {
            newVariableValue = value.trim()
        }}
        fontSize={sizeFont(20,15)}
        placeholder={'value'}
        placeholderColor={Color4.White()}
        color={Color4.White()}
        uiTransform={{
            width: '95%',
            height: '100%',
        }}
        />

        </UiEntity>

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
            update("edit", "pvariables", {id:newVariable, value:newVariableValue})
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
        {selectedItem && selectedItem.enabled && gameView === "player-variables" && generatePlayerVariableRows()}
    </UiEntity>

        </UiEntity>
    )
}

function GameTeamsView(){
    return(
        <UiEntity
        key={resources.slug + "game::teams:view"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display: gameView === "teams-edit" || gameView === "teams" || gameView === "teams-edit-spawns" ? "flex" : "none"
        }}
        >

            {/* teams main view */}
            <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: '100%',
        display: gameView === "teams" ? "flex" : "none"
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
        uiText={{value:"Minimum Teams", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
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
        update("edit", "minTeams", parseInt(value.trim()))
    }}
    onSubmit={(value) => {
        update("edit", "minTeams", parseInt(value.trim()))
    }}
    fontSize={sizeFont(20,15)}
    placeholder={'' + (gamingInfo && gamingInfo.minTeams)}
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
        uiText={{value:"Add Team", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
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
                        src: 'assets/atlas2.png'//
                    },
                    uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                }}
                uiText={{value: "Add", fontSize: sizeFont(20, 16)}}
                onMouseDown={() => {
                    setUIClicked(true)
                    update("add-team", "team", {})
                    utils.timers.setTimeout(()=>{
                        updateGamingInfo()
                        addTeamEntities(localPlayer.activeScene)
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
        {selectedItem && selectedItem.enabled && gameView === "teams" && generateTeamRows()}
    </UiEntity>
        </UiEntity>

        <GameTeamsEditView/>
        <GameTeamsEditSpawnView/>

        </UiEntity>
    )
}

function GameTeamsEditView(){
    return(
        <UiEntity
        key={resources.slug + "game::teams:edit:view"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display: gameView === "teams-edit" ? "flex" : "none"
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
                uiText={{value:"Edit Team " + (editTeam && (editTeam.number + 1)), textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
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
            uiText={{value: "Spawn Region", fontSize: sizeFont(30, 20)}}
            onMouseDown={() => {
                setUIClicked(true)
                updateEditGameView("teams-edit-spawns")
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
        />

        </UiEntity>
    )
}

function GameTeamsEditSpawnView(){
    return(
        <UiEntity
        key={resources.slug + "game::teams:edit::spawns:view"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display: gameView === "teams-edit-spawns" ? "flex" : "none"
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
                uiText={{value:"Edit Team " + (editTeam && (editTeam.number + 1)) + " Spawn Region", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
            />

             {/* position row */}
             {gameView === "teams-edit-spawns" &&
               <TransformInputModifiers modifier={EDIT_MODIFIERS.POSITION}
                    override={updateTeamSpawnPosition}
                    rowHeight={'25%'}
                    factor={selectedItem && selectedItem.pFactor}
                    valueFn={(type:string)=>{
                        let transform = Transform.get(teamEntities.find($ => $.id === editTeam.id).entity)
                        if(!transform){
                            return
                        }
                        switch (type) {
                            case 'x':
                                return transform.position.x.toFixed(3)
                            case 'y':
                                return transform.position.y.toFixed(3)
                            case 'z':
                                return (transform.position.z).toFixed(3)
                        }
                    }}
                />
                }

            {/* scale row */}
             {gameView === "teams-edit-spawns" &&
               <TransformInputModifiers modifier={EDIT_MODIFIERS.SCALE}
                    override={updateTeamSpawnScale}
                    rowHeight={'25%'}
                    factor={selectedItem && selectedItem.sFactor}
                    valueFn={(type:string)=>{
                        let transform = Transform.get(teamEntities.find($ => $.id === editTeam.id).plane)
                        if(!transform){
                            return
                        }
                        switch (type) {
                            case 'x':
                                return transform.scale.x.toFixed(3)
                            case 'y':
                                return transform.scale.y.toFixed(3)
                            case 'z':
                                return (transform.scale.z).toFixed(3)
                        }
                    }}
                />
                }

        </UiEntity>
    )
}


function GameLobbyEditSpawnView(){
    return(
        <UiEntity
        key={resources.slug + "game::lobby:edit::spawns:view"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display: gameView === "lobby-edit-spawns" ? "flex" : "none"
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
                uiText={{value:"Edit Team " + (editTeam && (editTeam.number + 1)) + " Spawn Region", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
            />

             {/* position row */}
             {gameView === "lobby-edit-spawns" &&
               <TransformInputModifiers modifier={EDIT_MODIFIERS.POSITION}
                    override={updateLobbySpawnPosition}
                    rowHeight={'25%'}
                    factor={selectedItem && selectedItem.pFactor}
                    valueFn={(type:string)=>{
                        let transform = Transform.get(teamEntities.find($ => $.id === "" + gamingInfo.id + "-lobby").entity)
                        if(!transform){
                            return
                        }
                        switch (type) {
                            case 'x':
                                return transform.position.x.toFixed(3)
                            case 'y':
                                return transform.position.y.toFixed(3)
                            case 'z':
                                return (transform.position.z).toFixed(3)
                        }
                    }}
                />
                }

            {/* scale row */}
             {gameView === "lobby-edit-spawns" &&
               <TransformInputModifiers modifier={EDIT_MODIFIERS.SCALE}
                    override={updateLobbySpawnScale}
                    rowHeight={'25%'}
                    factor={selectedItem && selectedItem.sFactor}
                    valueFn={(type:string)=>{
                        let transform = Transform.get(teamEntities.find($ => $.id === "" + gamingInfo.id + "-lobby").plane)
                        if(!transform){
                            return
                        }
                        switch (type) {
                            case 'x':
                                return transform.scale.x.toFixed(3)
                            case 'y':
                                return transform.scale.y.toFixed(3)
                            case 'z':
                                return (transform.scale.z).toFixed(3)
                        }
                    }}
                />
                }

        </UiEntity>
    )
}

function update(action:string, type:string, value:any, team?:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
        {
            component:team ? COMPONENT_TYPES.TEAM_COMPONENT : COMPONENT_TYPES.GAME_COMPONENT, 
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
        count++
    })
    return arr
}

function generatePlayerVariableRows(){
    let arr:any[] = []
    let count:number = 0
    if(!gamingInfo){
        return arr
    }

    gamingInfo && gamingInfo.pvariables.forEach((value:any, variable:string)=>{
        arr.push(<PRow count={count} variable={value} id={variable} />)
        count++
    })
    return arr
}

function generateTeamRows(){
    let arr:any[] = []
    let count:number = 0
    gamingInfo && gamingInfo.teams.forEach((team:any, i:number)=>{
        arr.push(<TeamRow count={count} team={team} />)
        count++
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

function PRow(data:any){
    return(
        <UiEntity
                key={resources.slug + "gaming::pvariable::row" + data.count}
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
                uiText={{value:"" + data.id, fontSize:sizeFont(20,15), textAlign:'middle-left'}}
                />

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '20%',
                    height: '100%',
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
                        src: 'assets/atlas1.png'//
                    },
                    uvs: getImageAtlasMapping(uiSizes.trashButton)
                }}
                onMouseDown={() => {
                    setUIClicked(true)
                    update("delete-pvariable", "variables", data.id)
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

function TeamRow(data:any){
    return(
        <UiEntity
                key={resources.slug + "gaming::team::row" + data.count}
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
                uiText={{value:"Team " + (data.count + 1), fontSize:sizeFont(20,15), textAlign:'middle-left'}}
                />

                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent:'center',
                    width: '20%',
                    height: '100%',
                    margin:{right:'1%'}
                }}
            >
                 <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateImageDimensions(1.5, getAspect(uiSizes.pencilEditIcon)).width,
                    height: calculateImageDimensions(1.5, getAspect(uiSizes.pencilEditIcon)).height,
                    positionType:'absolute',
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas1.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.pencilEditIcon)
                }}
                onMouseDown={() => {
                    setUIClicked(true)
                    editTeam = {...data.team, number:data.count}
                    updateEditGameView('teams-edit')
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
                />  

            </UiEntity>

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '20%',
                    height: '100%',
                    justifyContent:'center',
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
                    removeGameTeamEntities(data.team.id)
                    update("delete-team", "team", data.team.id)
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


//