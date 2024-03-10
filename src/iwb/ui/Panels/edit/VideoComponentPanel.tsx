import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
import {Color4} from '@dcl/sdk/math'
import {calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont} from '../../helpers'
import {visibleComponent} from './EditObjectDataPanel'
import {COMPONENT_TYPES, SERVER_MESSAGE_TYPES} from '../../../helpers/types'
import {sendServerMessage} from '../../../components/messaging'
import {selectedItem} from '../../../components/modes/build'
import {sceneBuilds} from '../../../components/scenes'
import {uiSizes} from "../../uiConfig";
import {playVideoFile, stopVideoFile} from "../../../components/scenes/components";

let value = ""

export function VideoComponentPanel() {
    return (
        <UiEntity
            key={"editvideocomponentpanel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.VIDEO_COMPONENT ? 'flex' : 'none',
            }}
        >

            {/* url label */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin: {top: "2%"}
                }}
                uiText={{value: "URL", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
            />

            {/* url input info */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin: {top: "2%"}
                }}
            >
                <Input
                    onSubmit={(value) => {
                        console.log('submitted value: ' + value)
                    }}
                    onChange={(input) => {
                        value = input
                    }}
                    color={Color4.White()}
                    fontSize={sizeFont(25, 15)}
                    placeholder={'new video link'}
                    placeholderColor={Color4.White()}
                    uiTransform={{
                        width: '100%',
                        height: '120%',
                    }}
                    value={"" + (visibleComponent === COMPONENT_TYPES.VIDEO_COMPONENT ? getVideoUrl() : "")}
                    onMouseDown={() => {
                        console.log('clicked')
                    }}
                ></Input>

                <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
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
                        value: "Save",
                        fontSize: sizeFont(25, 15),
                        color: Color4.White(),
                        textAlign: 'middle-center'
                    }}
                    onMouseDown={() => {
                        updateVideo("url", value)
                    }}
                />
            </UiEntity>

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
                        key={"video-loop-type-dropdown"}
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

            {/* autostart setting */}
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
                        value: "Autostart",
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
                        key={"video-start-type-dropdown"}
                        options={['True', 'False']}
                        selectedIndex={getAutostart()}
                        onChange={selectStart}
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
                        value: "Volume",
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
                        key={"video-volume-input"}
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
                        value={"" + (visibleComponent === COMPONENT_TYPES.VIDEO_COMPONENT ? getVolume() : "")}

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
                        playVideoFile()
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
                        stopVideoFile()
                    }}
                />

            </UiEntity>

        </UiEntity>
    )
}

function getLoop(){
    return selectedItem && selectedItem.enabled && selectedItem.itemData.vidComp ? selectedItem.itemData.vidComp.loop ? 0: 1 : 0
}

function selectLoop(index:number){
    if(index !== getLoop()){
        updateVideo("loop", index === 0)
    }
}

function getAutostart(){
    return selectedItem && selectedItem.enabled && selectedItem.itemData.vidComp ? selectedItem.itemData.vidComp.autostart ? 0: 1 : 0
}

function getVolume(){
    return selectedItem && selectedItem.enabled && selectedItem.itemData.vidComp ? selectedItem.itemData.vidComp.volume : 1
}

function selectStart(index:number){
    if(index !== getAutostart()){
        updateVideo("autostart", index === 0)
    }
}

function updateVideo(type:string, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.UPDATE_ITEM_COMPONENT, {component:COMPONENT_TYPES.VIDEO_COMPONENT, action:"update", data:{aid:selectedItem.aid, sceneId:selectedItem.sceneId, type:type, value:value}})
}

function getVideoUrl() {
    let scene = sceneBuilds.get(selectedItem.sceneId)
    let asset = scene.ass.find((a: any) => a.aid === selectedItem.aid)
    if (asset && asset.vidComp) {
        return asset.vidComp.url
    }
}