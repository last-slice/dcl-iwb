import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { addLineBreak, calculateImageDimensions, calculateSquareImageDimensions, dimensions, getImageAtlasMapping, sizeFont } from '../helpers'

export let showInfoPanel = false

export function displayInfoPanel(value: boolean) {
    showInfoPanel = value
}

export function createInfoPanel() {
    return (
        <UiEntity
            key={"infopanel"}
            uiTransform={{
                display: showInfoPanel ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(45, 580 / 403).width,
                height: calculateImageDimensions(55, 580 / 403).height,
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

                    <Label
                        value={addLineBreak("Information", true, 50)}
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
                            position: { top: 20 }
                        }}
                    // uiBackground={{color:Color4.Green()}}
                    >

                        <Label
                            value={addLineBreak("Keyboard Shortcuts", true, 50)}
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
                            position: { top: -25, left: -225 }
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
                            displayInfoPanel(false)
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
                        position: { top: 60, left: -150 }
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
                        value="Shift + D"
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
                        position: { top: 70, left: -150 }
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
                        value="Shift + 2"
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
                        position: { top: 80, left: -150 }
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
                        value="Shift + 3"
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
                        position: { top: 90, left: -150 }
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
                        value="Shift + 4"
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
                        position: { top: -85, left: 120 }
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
                        value="Control +1"
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
                        position: { top: -75, left: 120 }
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
                        value="Control +2"
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
                        position: { top: -65, left: 120 }
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
                        value="Control +3"
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
                        position: { top: -55, left: 120 }
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
                        value="Control +4"
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
                        width: calculateImageDimensions(30, 223 / 41).width,
                        height: calculateImageDimensions(30, 223 / 41).height,
                        margin: { right: "2%" },
                        position: { top: -25, left: 20 }
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
                >
                    <Label
                        value="Build Limitations"
                        color={Color4.Black()}
                        fontSize={sizeFont(30, 20)}
                        font="serif"
                        textAlign="top-center"
                        uiTransform={{ position: { top: -40 } }}
                    />
                    <Label
                        value="Tri Count"
                        color={Color4.Black()}
                        fontSize={sizeFont(10, 10)}
                        font="serif"
                        textAlign="middle-center"
                        uiTransform={{ position: { bottom: 10, right: 160 } }}
                    />
                    <Label
                        value="Tri Limit"
                        color={Color4.Black()}
                        fontSize={sizeFont(10, 10)}
                        font="serif"
                        textAlign="middle-center"
                        uiTransform={{ position: { top: 10, right: 160 } }}
                    />

                    <Label
                        value="Remaining"
                        color={Color4.Black()}
                        fontSize={sizeFont(10, 10)}
                        font="serif"
                        textAlign="middle-center"
                        uiTransform={{ position: { bottom: 10, right: 80 } }}
                    />
                    <Label
                        value="Parcel Count"
                        color={Color4.Black()}
                        fontSize={sizeFont(10, 10)}
                        font="serif"
                        textAlign="middle-center"
                        uiTransform={{ position: { top: 10, right: 80 } }}
                    />

                    <Label
                        value="File Size"
                        color={Color4.Black()}
                        fontSize={sizeFont(10, 10)}
                        font="serif"
                        textAlign="middle-center"
                        uiTransform={{ position: { bottom: 10, left: 40 } }}
                    />
                    <Label
                        value="Size Limit"
                        color={Color4.Black()}
                        fontSize={sizeFont(10, 10)}
                        font="serif"
                        textAlign="middle-center"
                        uiTransform={{ position: { top: 10, left: 40 } }}
                    />


                    <Label
                        value="Remaining"
                        color={Color4.Black()}
                        fontSize={sizeFont(10, 10)}
                        font="serif"
                        textAlign="middle-center"
                        uiTransform={{ position: { bottom: 10, left: 120 } }}
                    />
                    <Label
                        value="Max Height"
                        color={Color4.Black()}
                        fontSize={sizeFont(10, 10)}
                        font="serif"
                        textAlign="middle-center"
                        uiTransform={{ position: { top: 10, left: 120 } }}
                    />

                </UiEntity>

            </UiEntity>

        </UiEntity>
    )
}