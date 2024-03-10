import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { addLineBreak, calculateImageDimensions, calculateSquareImageDimensions, dimensions, getImageAtlasMapping, sizeFont } from '../helpers'

export let showSaveBuildPanel = false

export function displaySaveBuildPanel(value: boolean) {
    showSaveBuildPanel = value
}

export function createSaveBuildPanel() {
    return (
        <UiEntity
            key={"savebuildpanel"}
            uiTransform={{
                display: showSaveBuildPanel ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(45, 580 / 403).width,
                height: calculateImageDimensions(45, 580 / 403).height,
                positionType: 'absolute',
                position: { left: (dimensions.width - calculateImageDimensions(45, 580 / 403).width) / 2, top: (dimensions.height - calculateImageDimensions(45, 580 / 403).height) / 2 }
            }}
        // uiBackground={{ color: Color4.Red() }}//
        >
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: getImageAtlasMapping({
                        atlasHeight: 1024,
                        atlasWidth: 1024,
                        sourceTop: 495,
                        sourceLeft: 2,
                        sourceWidth: 570,
                        sourceHeight: 403
                    })
                }}
            >

                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '90%',
                        height: '30%',
                    }}
                // uiBackground={{color:Color4.Green()}}
                >
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            width: '80%',
                            height: '200%',
                            positionType: 'absolute',
                            position: { left: (dimensions.width - calculateImageDimensions(92, 580 / 403).width) / 2, top: (dimensions.height - calculateImageDimensions(60, 580 / 403).height) / 2 }
                        }}
                        uiBackground={{ color: Color4.Gray() }}
                    />

                    <Label
                        value={addLineBreak("Save Build", true, 50)}
                        color={Color4.Black()}
                        fontSize={35}
                        font="serif"//
                        textAlign="middle-center"
                    />
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '90%',
                            height: '30%',
                            position: { left: (dimensions.width - calculateImageDimensions(100, 90 / 30).width) / 2, top: (dimensions.height - calculateImageDimensions(140, 90 / 30).height) / 2 }
                        }}
                    // uiBackground={{color:Color4.Green()}}
                    >

                        <Label
                            value={addLineBreak("Build Name", true, 50)}
                            color={Color4.Black()}
                            fontSize={15}
                            font="serif"//
                            textAlign="middle-center"
                        />
                    </UiEntity>
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: calculateImageDimensions(3, 111 / 41).width,
                            height: calculateImageDimensions(4, 111 / 41).height,
                            margin: { right: "2%" },
                            position: { left: (dimensions.width - calculateImageDimensions(138, 30 / 30).width) / 2, top: (dimensions.height - calculateImageDimensions(55, 30 / 30).height) / 2 }
                        }}
                        uiBackground={{
                            textureMode: 'stretch',
                            texture: {
                                src: 'assets/atlas2.png'
                            },
                            uvs: getImageAtlasMapping({
                                atlasHeight: 1024,
                                atlasWidth: 1024,
                                sourceTop: 60,
                                sourceLeft: 844,
                                sourceWidth: 30,
                                sourceHeight: 30
                            })
                        }}
                        onMouseDown={() => {
                            displaySaveBuildPanel(false)
                        }}
                    >
                    </UiEntity>
                </UiEntity>
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(7, 223 / 41).width,
                        height: calculateImageDimensions(13, 223 / 41).height,
                        margin: { right: "2%" },
                        position: { left: (dimensions.width - calculateImageDimensions(120, 223 / 41).width) / 2, top: (dimensions.height - calculateImageDimensions(110, 223 / 41).height) / 2 }
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping({
                            atlasHeight: 1024,
                            atlasWidth: 1024,
                            sourceTop: 882,
                            sourceLeft: 579,
                            sourceWidth: 223,
                            sourceHeight: 41
                        })
                    }}
                    onMouseDown={() => {

                    }}
                >
                    <Label
                        value="Accept"
                        color={Color4.Black()}
                        fontSize={sizeFont(30, 20)}
                        font="serif"
                        textAlign="middle-center"
                    />
                </UiEntity>
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(7, 223 / 41).width,
                        height: calculateImageDimensions(13, 223 / 41).height,
                        margin: { right: "2%" },
                        position: { left: (dimensions.width - calculateImageDimensions(100, 223 / 41).width) / 2, top: (dimensions.height - calculateImageDimensions(135, 223 / 41).height) / 2 }
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping({
                            atlasHeight: 1024,
                            atlasWidth: 1024,
                            sourceTop: 841,
                            sourceLeft: 579,
                            sourceWidth: 223,
                            sourceHeight: 41
                        })
                    }}
                    onMouseDown={() => {

                    }}
                >
                    <Label
                        value="Delete"
                        color={Color4.Black()}
                        fontSize={sizeFont(30, 20)}
                        font="serif"
                        textAlign="middle-center"
                    />
                </UiEntity>
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(7, 223 / 41).width,
                        height: calculateImageDimensions(13, 223 / 41).height,
                        margin: { right: "2%" },
                        position: { left: (dimensions.width - calculateImageDimensions(80, 223 / 41).width) / 2, top: (dimensions.height - calculateImageDimensions(160, 223 / 41).height) / 2}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping({
                            atlasHeight: 1024,
                            atlasWidth: 1024,
                            sourceTop: 801,
                            sourceLeft: 802,
                            sourceWidth: 223,
                            sourceHeight: 41
                        })
                    }}
                    onMouseDown={() => {

                    }}
                >
                    <Label
                        value="Browse"
                        color={Color4.White()}
                        fontSize={sizeFont(30, 20)}
                        font="serif"
                        textAlign="middle-center"
                    />

                </UiEntity>

            </UiEntity>

        </UiEntity>
    )
}