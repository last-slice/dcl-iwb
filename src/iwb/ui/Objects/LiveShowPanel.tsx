import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Dropdown, Input } from '@dcl/sdk/react-ecs'
import resources from '../../helpers/resources'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'
import { setUIClicked } from '../ui'
import { Color4 } from '@dcl/sdk/math'
import { COMPONENT_TYPES, EDIT_MODES, SERVER_MESSAGE_TYPES } from '../../helpers/types'
import { sendServerMessage } from '../../components/Colyseus'
import { localPlayer } from '../../components/Player'

let showLiveControl = false
let showLiveButton = true
let showLivePanel = false
let forceScene = true
let message = ""
let liveView = "main"

let players:any[] = []
let bounceLocations:any[] = []

let playerIndex:number = 0
let bounceLocationIndex:number = 0

export function displayLiveControl(value:boolean, aid?:string){
    showLiveControl = value

    if(!value){
        resetPanel()
    }else{
        let scene =localPlayer.activeScene
        if(scene){
            sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_ACTION, 
                {
                    type:"live-players-get", 
                    sceneId: scene.id,
                }
            )
    
            let live = scene[COMPONENT_TYPES.LIVE_COMPONENT].get(aid)
            console.log('live panel is', live)
            if(live && live.p.length > 0){
                live.p.forEach((position:any, i:number)=>{
                    bounceLocations.push({name: live.n[i], position:position, look:live.l[i]})
                })
            }
        }
    }
}

export function updatePlayers(users:any){
    players = users
}

function resetPanel(){
    forceScene = true
    message = ""
    liveView = "main"
    players.length = 0
    bounceLocations.length = 0
    playerIndex = 0
    bounceLocationIndex = 0
}

export function displayLiveButton(value:boolean){
    showLiveButton = value
}

export function displayLivePanel(value:boolean){
    showLivePanel = value
}

export function toggle(){
    showLiveButton = !showLiveButton
    showLivePanel = !showLivePanel
}

export function createLiveUI() {
    return (
        <UiEntity
        key={"" + resources.slug + "live-show-ui"}
            uiTransform={{
                display: showLiveControl? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                positionType: 'absolute',
                position: { left: 0, top:0}
            }}
        >

        <UiEntity
            uiTransform={{
                display: showLiveButton ? "flex" : "none",
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
                height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
                positionType:'absolute',
                position:{left:'10%', top:"15%"}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            uiText={{value: "Live Panel", fontSize: sizeFont(20, 16)}}
            onMouseDown={() => {
                setUIClicked(true)
                showLivePanel = !showLivePanel
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
        />

        <LiveControlPanel/>

    </UiEntity>
    )
}

function LiveControlPanel(){
    return(
    <UiEntity
            key={resources.slug + "live::control::panel::ui"}
            uiTransform={{
                display: showLivePanel ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: calculateImageDimensions(20, 345 / 511).width,
                height: calculateImageDimensions(15, 345 / 511).height,
                positionType: 'absolute',
                position: {right: '2%', bottom: '1%'},
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.vertRectangle)
            }}
            onMouseDown={()=>{
                setUIClicked(true)
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
        >
            <MainView/>
            {/* <LiveAdmins/> */}

        </UiEntity>
    )
}

function MainView(){
    return(
        <UiEntity
        key={resources.slug + "live::panel::main"}
    uiTransform={{
        display: liveView === "main" ? 'flex' : 'none',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignContent: 'center',
        width: '80%',
        height: '85%',
        margin:{top:"7%"}
    }}
    >
        <LiveMessage/>
        <LiveBouncer/>
    </UiEntity>
    )
}

function LiveMessage(){
    return(
        <UiEntity
        key={resources.slug + "live::panel::messaging"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '27%',
        }}
        // uiBackground={{color:Color4.Green()}}
        >

         <UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center',
            width: '100%',
            height: '10%',
            margin:{bottom:'2%'}
        }}
        uiText={{value:"Send Notification", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
        />

    <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignContent: 'center',
                width: '100%',
                height: '40%',
            }}
            >
            <Input
                onSubmit={(value) => {
                    message = value.trim()
                }}
                onChange={(value) => {
                    message = value.trim()
                }}
                fontSize={sizeFont(20, 15)}
                placeholder={'Enter Message'}
                placeholderColor={Color4.White()}
                uiTransform={{
                    width: '100%',
                    height: '100%',
                }}
                color={Color4.White()}
            />
        </UiEntity>

        <UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'center',
            width: '100%',
            height: '40%',
            margin:{top:'1%'}
        }}
        >
            <UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'center',
            width: '70%',
            height: '100%',
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
            uiText={{value:"Scene Only", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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
            height: calculateSquareImageDimensions(4).height,
            margin:{top:"1%", bottom:'1%'},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: forceScene ? getImageAtlasMapping(uiSizes.toggleOnTrans) : getImageAtlasMapping(uiSizes.toggleOffTrans)
        }}
        onMouseDown={() => {
            forceScene = !forceScene
        }}
        />
            </UiEntity>

        </UiEntity>

        <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '30%',
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
                uiText={{value: "Send", fontSize: sizeFont(20, 16)}}
                onMouseDown={() => {
                    setUIClicked(true)
                    sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_ACTION, 
                        {
                            type:"live-message", 
                            message:message,
                            sceneId: localPlayer.activeScene.id,
                            forceScene:forceScene ? localPlayer.activeScene.id :undefined
                        })
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
            />

        </UiEntity>

        </UiEntity>
    )
}

function LiveBouncer(){
    return(
    <UiEntity
    key={resources.slug + "live::panel::bouncer"}
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: '25%',
        margin:{top:'2%'}
    }}
    // uiBackground={{color:Color4.Green()}}
    >

    <UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center',
            width: '100%',
            height: '10%',
            margin:{bottom:'2%'}
        }}
        uiText={{value:"Bounce Player", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
        />

        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'center',
                width: '100%',
                height: '40%',
            }}
        >
            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignContent: 'center',
                width: '50%',
                height: '100%',
            }}
        >
            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'center',
                width: '100%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
        >

            <Dropdown
            options={[...["Select Player", "All Players"], ...players.map(player => player.name)]}
            selectedIndex={playerIndex}
            onChange={(index:number)=> {playerIndex = index}}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Purple()}}
            color={Color4.White()}
            fontSize={sizeFont(20, 15)}
            />
</UiEntity>
            </UiEntity>

            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignContent: 'center',
                width: '50%',
                height: '100%',
            }}
        >
            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'center',
                width: '100%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
        >

            <Dropdown
            options={[...["Select Location"], ...bounceLocations.map(loc => loc.name)]}
            selectedIndex={bounceLocationIndex}
            onChange={(index:number)=> {bounceLocationIndex = index}}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Purple()}}
            color={Color4.White()}
            fontSize={sizeFont(20, 15)}
            />
</UiEntity>
            </UiEntity>

        </UiEntity>

        <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '90%',
                    height: '45%',
                    margin: {left: "1%", right: "1%", top:'1%'}
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                }}
                uiText={{value: "Bounce", fontSize: sizeFont(20, 16)}}
                onMouseDown={() => {
                    setUIClicked(true)
                    if(playerIndex > 0 && bounceLocationIndex - 1 >= 0){
                        sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_ACTION, 
                            {
                                type:"live-bounce", 
                                sceneId: localPlayer.activeScene.id,
                                player: playerIndex === 1 ? "all" : players[playerIndex-2].userId,
                                location:bounceLocations[bounceLocationIndex -1]
                            }
                        )
                    }
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
            />

        </UiEntity>
    )
}

function LiveActions(){
    return(
    <UiEntity
    key={resources.slug + "live::panel::actions"}
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: '25%',
        margin:{top:'2%'}
    }}
    // uiBackground={{color:Color4.Green()}}
    >

    <UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center',
            width: '100%',
            height: '10%',
            margin:{bottom:'2%'}
        }}
        uiText={{value:"Choose Action", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
        />

        </UiEntity>
    )
}

function LiveAdmins(){
    return(
        <UiEntity
        key={resources.slug + "live::panel::admins"}
    uiTransform={{
        display: liveView === "admins" ? 'flex' : 'none',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignContent: 'center',
        width: '80%',
        height: '85%',
        margin:{top:"7%"}
    }}
    >
    </UiEntity>
    )
}