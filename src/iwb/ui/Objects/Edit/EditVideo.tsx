import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
import {Color4} from '@dcl/sdk/math'
import {calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont} from '../../helpers'
import resources from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { COMPONENT_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
import { uiSizes } from '../../uiConfig'
import { visibleComponent } from '../EditAssetPanel'
import { setUIClicked } from '../../ui'
import { playVideoFile, stopVideoFile } from '../../../components/Videos'

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
    display: getVideoType() === -1 ? "flex" : "none",
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
    display: getVideoType() === 0 ? "flex" : "none",
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
            uiText={{value: "Current Texture: " + getVideoTexture(), fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
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
                    margin: {top: "1%"}
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
                    uiText={{
                        value: "Loop",
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

                    <Dropdown
                        options={['True', 'False']}
                        selectedIndex={getLoop()}
                        onChange={selectLoop}
                        uiTransform={{
                            width: '100%',
                            height: '120%',
                        }}
                        // uiBackground={{color:Color4.Purple()}}
                        color={Color4.White()}
                        fontSize={sizeFont(20, 15)}
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
                    margin: {top: "1%"}
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
                            width: '100%',
                            height: '120%',
                        }}
                        // uiBackground={{color:Color4.Purple()}}
                        placeholderColor={Color4.White()}
                        color={Color4.White()}
                        fontSize={sizeFont(20, 15)}

                        onChange={(input) => {
                            updateVideo("volume", parseFloat(input))
                        }}
                        placeholder={"" + (visibleComponent === COMPONENT_TYPES.VIDEO_COMPONENT ? getVolume() : "")}

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
    display: getVideoType() === 1 ? "flex" : "none",
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
    uiText={{value: "Current Video Player: " + getVideoPlayer(), fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
/>

<Dropdown
    options={getVideoPlayers()}
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

function getLoop(){
    if(selectedItem && selectedItem.enabled){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(scene){
            let itemInfo = scene[COMPONENT_TYPES.VIDEO_COMPONENT].get(selectedItem.aid)
            if(itemInfo){
                return itemInfo.loop ? 0 : 1
            }
            return 1
        }
        return 1
    }
    return 1
}

function selectLoop(index:number){
    if(index !== getLoop()){
        updateVideo("loop", index === 0)
    }
}

function getAutostart(){
    if(selectedItem && selectedItem.enabled){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(scene){
            let itemInfo = scene[COMPONENT_TYPES.VIDEO_COMPONENT].get(selectedItem.aid)
            if(itemInfo){
                return itemInfo.autostart ? 0 : 1
            }
            return 1
        }
        return 1
    }
    return 1
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

function selectStart(index:number){
    if(index !== getAutostart()){
        updateVideo("autostart", index === 0)
    }
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
    if(selectedItem && selectedItem.enabled){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(!scene){
            return
        }

        let videoPlayer:any
        let count:number = 0
        scene[COMPONENT_TYPES.VIDEO_COMPONENT].forEach((video:any, aid:string)=>{
            if(count === index -1 && video.type === 0){
                videoPlayer = aid
            }
            count++
        })

        console.log('video player selected is', videoPlayer)

        if(videoPlayer){
            sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
                {
                    component:COMPONENT_TYPES.VIDEO_COMPONENT, 
                    aid:selectedItem.aid, 
                    sceneId:selectedItem.sceneId,
                    player:videoPlayer
                }
            )
        }
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
    let textures:any[] =["Select Video Screen"]
    if(selectedItem && selectedItem.enabled){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(!scene){
            return textures
        }

        scene[COMPONENT_TYPES.VIDEO_COMPONENT].forEach((video:any, aid:string)=>{
            if(video.type === 0){
                textures.push(scene[COMPONENT_TYPES.NAMES_COMPONENT].get(aid).value)
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


