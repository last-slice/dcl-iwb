import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Dropdown, Input } from '@dcl/sdk/react-ecs'
import resources from '../../helpers/resources'
import { calculateImageDimensions, calculateSquareImageDimensions, dimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'
import { setUIClicked } from '../ui'
import { Color4 } from '@dcl/sdk/math'
import { COMPONENT_TYPES, EDIT_MODES, SERVER_MESSAGE_TYPES } from '../../helpers/types'
import { colyseusRoom, sendServerMessage } from '../../components/Colyseus'
import { localPlayer, localUserId } from '../../components/Player'

// let showLiveControl = true
// let showLiveButton = false
// let showLivePanel = false
// let liveView = "main"

let players:any[] = []
let bounceLocations:any[] = []

let adminIndex:number = 0
let playerIndex:number = 0
let bounceLocationIndex:number = 0
let sceneActionIndex:number = 0


// let aid:string = ""

// export function displayLiveControl(value:boolean){
//     showLiveControl = value

//     if(!value){
//         resetPanel()
//     }else{
//         let scene =localPlayer.activeScene
//         if(scene){
//             sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_ACTION, 
//                 {
//                     type:"live-players-get", 
//                     sceneId: scene.id,
//                 }
//             )

//             let live = scene[COMPONENT_TYPES.LIVE_COMPONENT].get(aid)
//             console.log('live panel is', live)
//             if(live && live.p.length > 0){
//                 live.p.forEach((position:any, i:number)=>{
//                     bounceLocations.push({name: live.n[i], position:position, look:live.l[i]})
//                 })
//             }
//         }
//         else{
//             console.log('not on active scene')
//         }
//     }
// }

export function updatePlayers(users:any){
    players = users
}

function resetPanel(){
    forceScene = true
    message = ""
    activeTool = ""
    newAdmin = ""
    adminIndex = 0
    players.length = 0
    bounceLocations.length = 0
    playerIndex = 0
    bounceLocationIndex = 0
}

// export function displayLiveButton(value:boolean, assetId?:string){
//     showLiveButton = value
//     aid = assetId ? assetId : ""
// }

// export function displayLivePanel(value:boolean){
//     showLivePanel = value
// }

// export function toggle(){
//     showLiveButton = !showLiveButton
//     showLivePanel = !showLivePanel
// }








let forceScene = true
let showToolbar = false

let activeTool = ""
let message = ""
let newAdmin = ""

export function showAdminToolbar(value:boolean){
    showToolbar = value
    resetPanel()
}

function selectAdminTool(tool:string){
    if(activeTool === tool){
        activeTool = ""
        return
    }
    activeTool = tool
}

export function createAdminPanel() {
    return (
        <UiEntity
        key={"" + resources.slug + "admin-ui"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                positionType: 'absolute',
                position: { left: 0, top:0},
                display: isSceneAdmin() ? "flex" : "none"
            }}
        >

            {/* admin icon */}
        <UiEntity
            uiTransform={{
                // display: showLiveButton ? "flex" : "none",
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(2, getAspect(uiSizes.settingsButton)).width,
                height: calculateImageDimensions(2, getAspect(uiSizes.settingsButton)).height,
                positionType:'absolute',
                position:{right:'4%', top:"1%"}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas1.png'
                },
                uvs: getImageAtlasMapping(uiSizes.settingsButton)
            }}
            onMouseDown={() => {
                setUIClicked(true)
                showToolbar = !showToolbar
                selectAdminTool("")
                setUIClicked(false)
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
        />

        <AdminToolbar/>
        <AdminMessagePanel/>
        <AdminBouncePanel/>
        <AdminSettingsPanel/>
        <AdminActionsPanel/>

    </UiEntity>
    )
}

function AdminToolbar(){
    return(
        <UiEntity
        key={resources.slug + "admin::toolbar::panel"}
            uiTransform={{
                display: showToolbar ? "flex" : "none",
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: dimensions.width * 0.15,
                height: dimensions.height * 0.05,
                positionType:'absolute',
                position:{right:'6%', top:"1%"}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs:getImageAtlasMapping({
                            atlasHeight:1024,
                            atlasWidth:1024,
                            sourceTop:0,
                            sourceLeft:0,
                            sourceWidth:824,
                            sourceHeight:263
                        })
            }}
            >

<UiEntity
            uiTransform={{
                // display: showLiveButton ? "flex" : "none",
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40%',
                height: '100%',
            }}
            uiText={{textWrap:'nowrap', value:"" + activeTool === "" ? "Admin" : activeTool, fontSize:sizeFont(25,15)}}
            />

{/* settings admin button */}
<UiEntity
            uiTransform={{
                // display: showLiveButton ? "flex" : "none",
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '10%',
                height: '100%',
                margin:{left:'1%', right:'1%'}
            }}
            >

<UiEntity
            uiTransform={{
                // display: showLiveButton ? "flex" : "none",
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(1.5, getAspect(uiSizes.settingsButton)).width,
                height: calculateImageDimensions(1.5, getAspect(uiSizes.settingsButton)).height,
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas1.png'
                },
                uvs: activeTool === "Settings" ?  getImageAtlasMapping(uiSizes.settingsButtonTrans):  getImageAtlasMapping(uiSizes.settingsButton)
            }}
            onMouseDown={() => {
                setUIClicked(true)
                selectAdminTool('Settings')
                setUIClicked(false)
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
        />

</UiEntity>

            {/* bounce player button */}
{/* 
<UiEntity
            uiTransform={{
                // display: showLiveButton ? "flex" : "none",
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '10%',
                height: '100%',
                margin:{left:'1%', right:'1%'}
            }}
            >

<UiEntity
            uiTransform={{
                // display: showLiveButton ? "flex" : "none",
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(1.5, getAspect(uiSizes.shareButton)).width,
                height: calculateImageDimensions(1.5, getAspect(uiSizes.shareButton)).height,
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas1.png'
                },
                uvs: activeTool === "Bounce" ?  getImageAtlasMapping(uiSizes.shareButtonTrans):  getImageAtlasMapping(uiSizes.shareButton)
            }}
            onMouseDown={() => {
                setUIClicked(true)
                selectAdminTool('Bounce')
                setUIClicked(false)
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
        />

</UiEntity> */}

{/* video admin button */}
{/* <UiEntity
            uiTransform={{
                // display: showLiveButton ? "flex" : "none",
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '10%',
                height: '100%',
                margin:{left:'1%', right:'1%'}
            }}
            >

<UiEntity
            uiTransform={{
                // display: showLiveButton ? "flex" : "none",
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(1.5, getAspect(uiSizes.image1Button)).width,
                height: calculateImageDimensions(1.5, getAspect(uiSizes.image1Button)).height,
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas1.png'
                },
                uvs: activeTool === "Video" ?  getImageAtlasMapping(uiSizes.image1ButtonTrans):  getImageAtlasMapping(uiSizes.image1Button)
            }}
            onMouseDown={() => {
                setUIClicked(true)
                selectAdminTool('Video')
                setUIClicked(false)
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
        />

</UiEntity> */}

<UiEntity
            uiTransform={{
                // display: showLiveButton ? "flex" : "none",
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '10%',
                height: '100%',
                margin:{left:'1%', right:'1%'}
            }}
            >

<UiEntity
            uiTransform={{
                // display: showLiveButton ? "flex" : "none",
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(1.5, getAspect(uiSizes.transformButton)).width,
                height: calculateImageDimensions(1.5, getAspect(uiSizes.transformButton)).height,
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas1.png'
                },
                uvs: activeTool === "Actions" ?  getImageAtlasMapping(uiSizes.transformButtonTrans):  getImageAtlasMapping(uiSizes.transformButton)
            }}
            onMouseDown={() => {
                setUIClicked(true)
                selectAdminTool('Actions')
                setUIClicked(false)
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
        />

</UiEntity>

<UiEntity
            uiTransform={{
                // display: showLiveButton ? "flex" : "none",
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '10%',
                height: '100%',
                margin:{left:'1%', right:'1%'}
            }}
            >

<UiEntity
            uiTransform={{
                // display: showLiveButton ? "flex" : "none",
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(1.5, getAspect(uiSizes.pencilEditIcon)).width,
                height: calculateImageDimensions(1.5, getAspect(uiSizes.pencilEditIcon)).height,
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas1.png'
                },
                uvs: activeTool === "Message" ?  getImageAtlasMapping(uiSizes.pencilEditIconTrans):  getImageAtlasMapping(uiSizes.pencilEditIcon)
            }}
            onMouseDown={() => {
                setUIClicked(true)
                selectAdminTool('Message')
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

function AdminMessagePanel(){
    return(
        <UiEntity
        key={resources.slug + "admin::message::panel"}
        uiTransform={{
            display: activeTool === "Message" ? "flex" : "none",
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: dimensions.width * 0.25,
            height: dimensions.height * 0.2,
            positionType:'absolute',
            position:{right:'6%', top:"6%"}
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs:getImageAtlasMapping(uiSizes.horizRectangle)}}
        >
            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '95%',
            height: '10%',
            margin:{left:'5%', top:'5%'}
        }}
        uiText={{value:"Send Scene Message", fontSize:sizeFont(25,20), textWrap:'nowrap', textAlign:'middle-left'}}
            />

        <Input
            onSubmit={(value) => {
                message = value.trim()
                sendSceneMessage()
            }}
            onChange={(value) => {
                message = value.trim()
            }}
            fontSize={sizeFont(20, 10)}
            placeholder={'Enter Message'}
            placeholderColor={Color4.White()}
            uiTransform={{
                width: '80%',
                height: '20%',
                margin:{top:'5%'}
            }}
            color={Color4.White()}
        />

<UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'center',
            width: '80%',
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
        >
                    <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateSquareImageDimensions(8).width,
                    height: calculateSquareImageDimensions(4).width,
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
                    sendSceneMessage()
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

function AdminBouncePanel(){
    return(
        <UiEntity
        key={resources.slug + "admin::bounce::panel"}
        uiTransform={{
            display: activeTool === "Bounce" ? "flex" : "none",
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: dimensions.width * 0.25,
            height: dimensions.height * 0.2,
            positionType:'absolute',
            position:{right:'6%', top:"6%"}
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs:getImageAtlasMapping(uiSizes.horizRectangle)}}
        >
            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '95%',
            height: '10%',
            margin:{left:'5%', top:'5%'}
        }}
        uiText={{value:"Bounce Player", fontSize:sizeFont(25,20), textWrap:'nowrap', textAlign:'middle-left'}}
            />

<UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'center',
                width: '80%',
                height: '20%',
                margin:{top:'5%'}
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
                    width: '80%',
                    height: '20%',
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
                        sendBouncePlayer()
                    }else{
                        resetPanel()
                    }
                    setUIClicked(false)
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
            />

        </UiEntity>
    )
}

function AdminSettingsPanel(){
    return(
        <UiEntity
        key={resources.slug + "admin::settings::panel"}
        uiTransform={{
            display: activeTool === "Settings" ? "flex" : "none",
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: dimensions.width * 0.25,
            height: dimensions.height * 0.2,
            positionType:'absolute',
            position:{right:'6%', top:"6%"}
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs:getImageAtlasMapping(uiSizes.horizRectangle)}}
        >
            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '95%',
            height: '10%',
            margin:{left:'5%', top:'5%'}
        }}
        uiText={{value:"Admin Settings", fontSize:sizeFont(25,20), textWrap:'nowrap', textAlign:'middle-left'}}
            />

<UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'center',
                width: '80%',
                height: '20%',
                margin:{top:'5%'}
            }}
        >
            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignContent: 'center',
                width: '80%',
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
            options={getSceneAdmins()}
            selectedIndex={0}
            onChange={(index:number)=> {adminIndex = index}}
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
                width: '20%',
                height: '100%',
            }}
        >
             <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateSquareImageDimensions(8).width,
                    height: calculateSquareImageDimensions(4).height,
                    margin: {left: "5%", right: "1%", top:'1%'}
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                }}
                uiText={{value: "Remove", fontSize: sizeFont(20, 16)}}
                onMouseDown={() => {
                    setUIClicked(true)
                    removeSelectedAdmin()
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
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'center',
                width: '80%',
                height: '20%',
                margin:{top:'5%'}
            }}
        >
            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignContent: 'center',
                width: '80%',
                height: '100%',
            }}
        >
<Input
    onSubmit={(value) => {
        newAdmin = value.trim()
        addSceneAdmin()
    }}
    onChange={(value) => {
        newAdmin = value.trim()
    }}
    fontSize={sizeFont(20, 15)}
    placeholder={'Enter wallet'}
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
                flexDirection: 'column',
                justifyContent: 'center',
                alignContent: 'center',
                width: '20%',
                height: '100%',
            }}
        >
             <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateSquareImageDimensions(8).width,
                    height: calculateSquareImageDimensions(4).height,
                    margin: {left: "5%", right: "1%", top:'1%'}
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
                    addSceneAdmin()
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

function AdminActionsPanel(){
    return(
        <UiEntity
        key={resources.slug + "admin::actions::panel"}
        uiTransform={{
            display: activeTool === "Actions" ? "flex" : "none",
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: dimensions.width * 0.25,
            height: dimensions.height * 0.15,
            positionType:'absolute',
            position:{right:'6%', top:"6%"}
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs:getImageAtlasMapping(uiSizes.horizRectangle)}}
        >
            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '95%',
            height: '10%',
            margin:{left:'5%', top:'5%'}
        }}
        uiText={{value:"Admin Actions", fontSize:sizeFont(25,20), textWrap:'nowrap', textAlign:'middle-left'}}
            />

<UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'center',
            width: '80%',
            height: '30%',
            margin:{top:'5%'}
        }}
        >
             <UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center',
            width: '80%',
            height: '100%',
        }}
        >
            <Dropdown
                options={[...["Select Action"], ...getSceneActions()]}
                // options={entitiesWithActions.length > 0 ? [...["Select Action"], ...entitiesWithActions[entityIndex].actions.map((item:any) => item.name).sort((a:any,b:any)=> a.localeCompare(b))] : []}
                selectedIndex={sceneActionIndex}
                onChange={selectActionIndex}
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
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center',
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
                height: '90%',
                margin: {left: "1%", right: "1%"}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            uiText={{value: "Run", fontSize: sizeFont(20, 16)}}
            onMouseDown={() => {
                setUIClicked(true)
                attemptAction()
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

function isSceneAdmin(){
    if(localPlayer && localPlayer.activeScene && colyseusRoom){
        let scene = colyseusRoom.state.scenes.get(localPlayer.activeScene.id)
        if(!scene){
            return false
        }

        let sceneAdmin = scene.metadata.admin.get(scene.id)
        if(!sceneAdmin){
            return false
        }

        if(sceneAdmin.admins.includes(localUserId)){
            return true
        }else{
            return false
        }
    }else{
        return false
    }
}

function addSceneAdmin(){
        try{
            sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_ADMIN_ACTION, 
                {
                    type:"add-admin", 
                    sceneId: localPlayer.activeScene.id,
                    admin: newAdmin
                }
            )
        }
        catch(e:any){
            console.log('error trying to bounce player', e)
        }
    resetPanel()    
}


function getSceneAdmins(){
    let admins:any[] = []
    if(localPlayer && localPlayer.activeScene){
        if(colyseusRoom){
            let scene = colyseusRoom.state.scenes.get(localPlayer.activeScene.id)
            if(scene){
                let adminData = scene.metadata.admin.get(scene.id)
                if(adminData){
                    adminData.admins.forEach((admin:string)=>{
                        admins.push(admin)
                    })
                }
            }
        }
    }

    admins.unshift("Select Admin")
    return admins
}

function removeSelectedAdmin(){
    if(adminIndex >0){
        try{
            sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_ADMIN_ACTION, 
                {
                    type:"remove-admin", 
                    sceneId: localPlayer.activeScene.id,
                    index: adminIndex - 1
                }
            )
        }
        catch(e:any){
            console.log('error trying to remove player', e)
        }
    }
    resetPanel()    
}

function sendBouncePlayer(){
    try{
        sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_ACTION, 
            {
                type:"live-bounce", 
                sceneId: localPlayer.activeScene.id,
                player: playerIndex === 1 ? "all" : players[playerIndex-2].userId,
                location:bounceLocations[bounceLocationIndex -1]
            }
        )
    }
    catch(e:any){
        console.log('error trying to bounce player', e)
    }
    resetPanel()
}

function sendSceneMessage(){
    try{
        sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_ACTION, 
            {
                type:"live-message", 
                message:message,
                sceneId: localPlayer.activeScene.id,
                forceScene:forceScene ? localPlayer.activeScene.id :undefined
            }
        )
    }
    catch(e:any){
        console.log('error sending scene message', e)
    }
    resetPanel()//
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
            margin:{bottom:'2%', top:"2%"}
        }}
        uiText={{value:"Run Action", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
        />

    <UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'center',
            width: '100%',
            height: '50%',
        }}
        >
             <UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center',
            width: '80%',
            height: '100%',
        }}
        >
            <Dropdown
                options={[...["Select Action"], ...getSceneActions()]}
                // options={entitiesWithActions.length > 0 ? [...["Select Action"], ...entitiesWithActions[entityIndex].actions.map((item:any) => item.name).sort((a:any,b:any)=> a.localeCompare(b))] : []}
                selectedIndex={sceneActionIndex}
                onChange={selectActionIndex}
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
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center',
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
                height: '90%',
                margin: {left: "1%", right: "1%"}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            uiText={{value: "Run", fontSize: sizeFont(20, 16)}}
            onMouseDown={() => {
                setUIClicked(true)
                attemptAction()
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

function selectActionIndex(index:number){
    sceneActionIndex = index
}

function getSceneActions(){
    if(!localPlayer){
        return []
    }

    let scene = localPlayer.activeScene
    if(!scene){
        console.log('no scene to get actions')
        return [] 
    }
    let actions = getActions(scene)
    return actions.map(($:any)=> $.name).sort((a,b) => a.localeCompare(b))
}

function getActions(scene:any){
    let actions:any[] = []
    scene[COMPONENT_TYPES.ACTION_COMPONENT].forEach((actionComponent:any, aid:string)=>{
        actionComponent.actions.forEach((action:any)=>{
            actions.push({id:action.id, aid:aid, name:action.name})
        })
    })
    return actions.sort((a,b)=> a.name.localeCompare(b.name))
}

function attemptAction(){
    if(sceneActionIndex === 0 || !localPlayer){
        return
    }

    let scene = localPlayer.activeScene
    if(!scene){
        return
    }

    let actions = getActions(scene)
    let action = actions[sceneActionIndex - 1]
    console.log('action attempt run is', action)
    sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_ACTION,
        {
            type:"live-action", 
            actionId: action.id,
            aid: action.aid,
            sceneId: localPlayer.activeScene.id,
            forceScene: localPlayer.activeScene.id
        }
    )
}