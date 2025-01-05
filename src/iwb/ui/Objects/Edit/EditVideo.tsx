import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
import {Color4} from '@dcl/sdk/math'
import {calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont} from '../../helpers'
import resources from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { COMPONENT_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
import { uiSizes } from '../../uiConfig'
import { visibleComponent } from '../EditAssetPanel'
import { setUIClicked } from '../../ui'
import { playVideoFile, stopVideoFile } from '../../../components/Videos'

let videoPlayers:any[] = []
let videoType:any = -500
let videoTexture:string = ""
let volume:number = 1
let videoPlayer:string = ""
let scene:any
let videoComponent:any
let editVideoUVs:any = getImageAtlasMapping({
    atlasHeight: 1024,
    atlasWidth: 1024,
    sourceTop: 240,
    sourceLeft: 873,
    sourceWidth: 30,
    sourceHeight: 30
})
let autoStartUVs:any = getImageAtlasMapping({
    atlasHeight: 1024,
    atlasWidth: 1024,
    sourceTop: 240,
    sourceLeft: 873,
    sourceWidth: 30,
    sourceHeight: 30
})

export function updateEditVideoPanel(){
    if(selectedItem && selectedItem.enabled){
        scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(!scene){
            return
        }

        videoComponent = scene[COMPONENT_TYPES.VIDEO_COMPONENT].get(selectedItem.aid)
    }

    videoPlayers.length = 0
    videoType = getVideoType()
    videoTexture = getVideoTexture()
    volume = getVolume()
    videoPlayer = getVideoPlayer()
    videoPlayers = getVideoPlayers()

    updateUVs()
}

function updateUVs(){
    if(videoComponent.loop){
        editVideoUVs = getImageAtlasMapping(uiSizes.toggleOnTrans)
    }else{
        editVideoUVs = getImageAtlasMapping(uiSizes.toggleOffTrans)
    }

    if(videoComponent.autostart){
        autoStartUVs = getImageAtlasMapping(uiSizes.toggleOnTrans)
    }else{
        autoStartUVs = getImageAtlasMapping(uiSizes.toggleOffTrans)
    }
}

export function EditVideo() {
    return (
        <UiEntity
            key={resources.slug + "editvideocomponentpanel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.VIDEO_COMPONENT ? 'flex' : 'none',
            }}
        >

{/* select video type container */}
<UiEntity
uiTransform={{
    display: videoType === -1 ? "flex" : "none",
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    height: '100%',
}}
>
<Dropdown
    options={['Select Video Type', 'Player', "Screen"]}
    selectedIndex={0}
    onChange={selectVideoType}
    uiTransform={{
        width: '100%',
        height: '10%',
    }}
    // uiBackground={{color:Color4.Purple()}}
    color={Color4.White()}
    fontSize={sizeFont(20, 15)}
/>

</UiEntity>

{/* edit video player container */}
<UiEntity
uiTransform={{
    display: videoType === 0 ? "flex" : "none",
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
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
            }}
            uiText={{value: "Current Texture: " + videoTexture, fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
        />


<Input
    uiTransform={{
        width: '100%',
        height: '10%',
    }}
    // uiBackground={{color:Color4.Purple()}}
    placeholderColor={Color4.White()}
    color={Color4.White()}
    fontSize={sizeFont(20, 15)}

    onChange={(input) => {
        updateVideo("link", input.trim())
    }}
    onSubmit={(input) => {
        updateVideo("link", input.trim())
    }}
    placeholder={"Enter Video Link"}

/>

{/* loop setting */}
<UiEntity
            uiTransform={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:"5%"}
            }}
        >

                    {/* url label// */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
                height: '100%',
            }}
        uiText={{textWrap:'nowrap',value:"Loop", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '85%',
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
            uvs: editVideoUVs
        }}
        onMouseDown={() => {
            setUIClicked(true)
            updateVideo("loop", !videoComponent.loop)
            videoComponent.loop = !videoComponent.loop
            updateUVs()
            setUIClicked(false)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
        />


        </UiEntity>


</UiEntity>

{/* autostart setting */}
<UiEntity
            uiTransform={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:"5%"}
            }}
        >

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
                height: '100%',
            }}
        uiText={{textWrap:'nowrap',value:"Autostart", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '85%',
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
            uvs: autoStartUVs
        }}
        onMouseDown={() => {
            setUIClicked(true)
            updateVideo("autostart", !videoComponent.autostart)
            videoComponent.autostart = !videoComponent.autostart
            updateUVs()
            setUIClicked(false)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
        />


        </UiEntity>


</UiEntity>

{/* volume setting */}
<UiEntity
    uiTransform={{
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
        margin: {top: "1%", bottom:"3%"}
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
        uiText={{
            value: "Volume: (0 - 1)",
            fontSize: sizeFont(25, 15),
            color: Color4.White(),
            textAlign: 'middle-left'
        }}
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

        <Input
            uiTransform={{
                width: '50%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Purple()}}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            fontSize={sizeFont(20, 15)}

            onChange={(input) => {
                updateVideo("volume", parseFloat(input))
            }}
            placeholder={"" + volume}

        />

    </UiEntity>

</UiEntity>

{/* play button row */}
<UiEntity
    uiTransform={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
        height: '10%',
        margin: {top: "1%"}
    }}
>

    <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
            height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
            margin: {left: "1%", right: "1%"}
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
        }}
        uiText={{value: "Play", fontSize: sizeFont(20, 16)}}
        onMouseDown={() => {
            setUIClicked(true)
            playVideoFile()
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
    />

    <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
            height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
            margin: {left: "1%", right: "1%"}
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
        }}
        uiText={{value: "Stop", fontSize: sizeFont(20, 16)}}
        onMouseDown={() => {
            setUIClicked(true)
            stopVideoFile()
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
    />

</UiEntity>


</UiEntity>

{/* edit video screen container */}
<UiEntity
uiTransform={{
    display: videoType === 1 ? "flex" : "none",
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
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
    }}
    uiText={{value: "Current Video Player: " + videoPlayer, fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
/>

<Dropdown
    options={[...videoPlayers].map((vp:any)=> vp.name)}
    selectedIndex={0}
    onChange={selectVideoPlayer}
    uiTransform={{
        width: '100%',
        height: '10%',
    }}
    // uiBackground={{color:Color4.Purple()}}
    color={Color4.White()}
    fontSize={sizeFont(20, 15)}
/>

</UiEntity>
    </UiEntity>
    )
}

function getVolume(){
    if(selectedItem && selectedItem.enabled){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(scene){
            let itemInfo = scene[COMPONENT_TYPES.VIDEO_COMPONENT].get(selectedItem.aid)
            if(itemInfo){
                return itemInfo.volume
            }
            return 1
        }
        return 1
    }
    return 1
}

function updateVideo(type:string, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
        {
            component:COMPONENT_TYPES.VIDEO_COMPONENT, 
            aid:selectedItem.aid, 
            sceneId:selectedItem.sceneId,
            [type]:value
        }
    )
}

function selectVideoType(index:number){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
        {
            component:COMPONENT_TYPES.VIDEO_COMPONENT, 
            aid:selectedItem.aid, 
            sceneId:selectedItem.sceneId,
            type:index - 1
        }
    )
}

function selectVideoPlayer(index:number){
    let videoPlayer:any
    videoPlayer = videoPlayers[index]

    if(videoPlayer){
        sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
            {
                component:COMPONENT_TYPES.VIDEO_COMPONENT, 
                aid:selectedItem.aid, 
                sceneId:selectedItem.sceneId,
                player:videoPlayer.aid
            }
        )
    }
}

function getVideoType(){
    if(selectedItem && selectedItem.enabled){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(!scene){
            return -500
        }

        let itemInfo = scene[COMPONENT_TYPES.VIDEO_COMPONENT].get(selectedItem.aid)
        if(!itemInfo){
            return -500
        }
        return itemInfo.type
    }
    return -500
}

function getVideoPlayers(){
    let textures:any[] =[{name:"Select Video Screen", aid:""}]
    if(selectedItem && selectedItem.enabled){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(!scene){
            return textures
        }

        scene[COMPONENT_TYPES.VIDEO_COMPONENT].forEach((video:any, aid:string)=>{
            if(video.type === 0){
                textures.push({name:scene[COMPONENT_TYPES.NAMES_COMPONENT].get(aid).value, aid:aid})
            }
        })
    }
    return textures
}

function getVideoPlayer(){
    if(selectedItem && selectedItem.enabled){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(!scene){
            return ""
        }

        let videoScreen = scene[COMPONENT_TYPES.MATERIAL_COMPONENT].get(selectedItem.aid)
        if(!videoScreen){
            return ""
        }
        return videoScreen.texture
    }
    return ""
}

function getVideoTexture(){
    if(selectedItem && selectedItem.enabled){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(!scene){
            return ""
        }

        let itemInfo = scene[COMPONENT_TYPES.VIDEO_COMPONENT].get(selectedItem.aid)
        if(!itemInfo || itemInfo.type !== 0){
            return ""
        }
        return itemInfo.link
    }
    return ""
}
