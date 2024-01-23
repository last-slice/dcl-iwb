import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
import {Color4} from '@dcl/sdk/math'
import {calculateSquareImageDimensions, getImageAtlasMapping, sizeFont} from '../../helpers'
import {visibleComponent} from './EditObjectDataPanel'
import {COMPONENT_TYPES, EDIT_MODES, SERVER_MESSAGE_TYPES} from '../../../helpers/types'
import {sendServerMessage} from '../../../components/messaging'
import {selectedItem} from '../../../components/modes/build'
import {sceneBuilds} from '../../../components/scenes'
import {uiSizes} from '../../uiConfig'
import {playAudioFile, stopAudioFile} from '../../../components/scenes/components'

let value = ""

export function AudioComponentPanel() {
    return (
        <UiEntity
            key={"editaudiocomponentpanel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.AUDIO_COMPONENT ? 'flex' : 'none',
            }}
        >

            {/* `url row` */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '20%',
                    margin: {top: "2%"},
                    display: selectedItem && selectedItem.itemData.ugc ? 'none' : 'flex'
                }}
            >

                {/* url label */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '20%',
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
                        height: '60%',
                        margin: {top: "5%"},
                    }}
                >

                    <Input
                        onSubmit={(value) => {
                            console.log('submitted value: ' + value)
                        }}
                        onChange={(input) => {
                            value = input
                        }}
                        disabled={selectedItem && selectedItem.itemData.ugc ? true : false}
                        color={Color4.White()}
                        fontSize={sizeFont(25, 15)}
                        placeholder={'new audio link'}
                        placeholderColor={Color4.White()}
                        uiTransform={{
                            width: '100%',
                            height: '120%',
                        }}
                        value={"" + (visibleComponent === COMPONENT_TYPES.AUDIO_COMPONENT ? getAudioUrl() : "")}
                        onMouseDown={() => {
                            console.log('clicked')
                        }}
                    ></Input>

                    <UiEntity
                        uiTransform={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '20%',
                            height: '100%',
                        }}
                        uiBackground={{color: Color4.Green()}}
                        uiText={{
                            value: "Save",
                            fontSize: sizeFont(25, 15),
                            color: Color4.White(),
                            textAlign: 'middle-center'
                        }}
                        onMouseDown={() => {
                            sendServerMessage(SERVER_MESSAGE_TYPES.UPDATE_ITEM_COMPONENT, {
                                component: COMPONENT_TYPES.AUDIO_COMPONENT,
                                action: "update",
                                data: {type: "url", aid: selectedItem.aid, sceneId: selectedItem.sceneId, value: value}
                            })
                        }}
                    />
                </UiEntity>

            </UiEntity>

            {/* attach player row */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '100%',
                    height: '15%',
                    margin: {top: "1%"}
                }}
            >

                {/* attach audio to player toggle */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '15%',
                        height: '100%',
                    }}
                    uiText={{
                        value: "Attached to Player",
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
                            margin: {top: "1%", bottom: '1%'},
                        }}
                        uiBackground={{
                            textureMode: 'stretch',
                            texture: {
                                src: 'assets/atlas2.png'
                            },
                            uvs: selectedItem && selectedItem.enabled && selectedItem.mode === EDIT_MODES.EDIT && selectedItem.itemData.audComp ? (selectedItem.itemData.audComp.attachedPlayer ? getImageAtlasMapping(uiSizes.toggleOffNoBlack) : getImageAtlasMapping(uiSizes.toggleOnNoBlack)) : getImageAtlasMapping(uiSizes.toggleOnNoBlack)
                        }}
                        onMouseDown={() => {
                            sendServerMessage(SERVER_MESSAGE_TYPES.UPDATE_ITEM_COMPONENT, {
                                component: COMPONENT_TYPES.AUDIO_COMPONENT,
                                action: "update",
                                data: {type: "attach", aid: selectedItem.aid, sceneId: selectedItem.sceneId, value: ""}
                            })
                        }}
                    />


                </UiEntity>


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
                        key={"audio-loop-type-dropdown"}
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
                        key={"audio-start-type-dropdown"}
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
                        key={"audio-volume-input"}
                        uiTransform={{
                            width: '100%',
                            height: '120%',
                        }}
                        // uiBackground={{color:Color4.Purple()}}
                        color={Color4.White()}
                        fontSize={sizeFont(20, 15)}

                        onChange={(input) => {
                            updateAudio("volume", parseFloat(input))
                        }}
                        value={"" + (visibleComponent === COMPONENT_TYPES.AUDIO_COMPONENT ? getVolume() : "")}

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
                        width: '30%',
                        height: '100%',
                        margin: {left: "1%", right: "1%"}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.blueButton)
                    }}
                    uiText={{value: "Play", fontSize: sizeFont(20, 16)}}
                    onMouseDown={() => {
                        playAudioFile()
                    }}
                />

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
                        uvs: getImageAtlasMapping(uiSizes.dangerButton)
                    }}
                    uiText={{value: "Stop", fontSize: sizeFont(20, 16)}}
                    onMouseDown={() => {
                        stopAudioFile()
                    }}
                />

            </UiEntity>

        </UiEntity>
    )
}

function getAudioUrl() {
    if (selectedItem && selectedItem.itemData.audComp) {
        return selectedItem.itemData.audComp.url
    }
}

function getLoop() {
    return selectedItem && selectedItem.enabled && selectedItem.itemData.audComp ? selectedItem.itemData.audComp.loop ? 0 : 1 : 0
}

function selectLoop(index: number) {
    if (index !== getLoop()) {
        updateAudio("loop", index === 0)
    }
}

function getVolume(){
    return selectedItem && selectedItem.enabled && selectedItem.itemData.audComp ? selectedItem.itemData.audComp.volume : 1
}


function getAutostart() {
    return selectedItem && selectedItem.enabled && selectedItem.itemData.audComp ? selectedItem.itemData.audComp.autostart ? 0 : 1 : 0
}

function selectStart(index: number) {
    if (index !== getAutostart()) {
        updateAudio("autostart", index === 0 ? true : false)
    }
}

function updateAudio(type: string, value: any) {
    sendServerMessage(SERVER_MESSAGE_TYPES.UPDATE_ITEM_COMPONENT, {
        component: COMPONENT_TYPES.AUDIO_COMPONENT,
        action: "update",
        data: {aid: selectedItem.aid, sceneId: selectedItem.sceneId, type: type, value: value}
    })
}