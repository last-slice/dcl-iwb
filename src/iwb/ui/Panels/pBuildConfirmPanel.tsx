import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { addLineBreak, calculateImageDimensions, calculateSquareImageDimensions, dimensions, getImageAtlasMapping, sizeFont } from '../helpers'

export let showPBuildConfirmPanel = false

export function displayPBuildConfirmPanel(value: boolean) {
    showPBuildConfirmPanel = value
}

export function createPBuildConfirmPanel() {
    return (
        <UiEntity
            key={"BuildConfirmpanel"}
            uiTransform={{
                display: showPBuildConfirmPanel ? 'flex' : 'none',
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
                        position: {left: (dimensions.width - calculateImageDimensions(105, 580 / 403).width) / 2, top: (dimensions.height - calculateImageDimensions(70, 580 / 403).height) / 2}
                    }}
                // uiBackground={{color:Color4.Green()}}
                >

                    <Label
                        value={addLineBreak("Public Build", true, 50)}
                        color={Color4.Black()}
                        fontSize={29}
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
                            position: { left: (dimensions.width - calculateImageDimensions(100, 580 / 403).width) / 2, top: (dimensions.height - calculateImageDimensions(65, 580 / 403).height) / 2 }
                        }}
                    // uiBackground={{color:Color4.Green()}}
                    >

                        <Label
                            value={addLineBreak("Are you sure you want to give everyone builder rights to your Build?", true, 50)}
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
                        position: { left: (dimensions.width - calculateImageDimensions(132, 580 / 403).width) / 2, top: (dimensions.height - calculateImageDimensions(82, 580 / 403).height) / 2 }
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
                        displayPBuildConfirmPanel(false)
                    }}
                >
                </UiEntity>
                </UiEntity>
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(13, 223 / 41).width,
                        height: calculateImageDimensions(13, 223 / 41).height,
                        margin: { right: "2%" },
                        position: { left: (dimensions.width - calculateImageDimensions(105, 580 / 403).width) / 2, top: (dimensions.height - calculateImageDimensions(60, 580 / 403).height) / 2 }
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
                        value="Public Build"
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
                        width: calculateImageDimensions(13, 223 / 41).width,
                        height: calculateImageDimensions(13, 223 / 41).height,
                        margin: { right: "2%" },
                        position: { left: (dimensions.width - calculateImageDimensions(105, 580 / 403).width) / 2, top: (dimensions.height - calculateImageDimensions(55, 580 / 403).height) / 2 }
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
                        value="Save Build"
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
                        width: calculateImageDimensions(13, 223 / 41).width,
                        height: calculateImageDimensions(13, 223 / 41).height,
                        margin: { right: "2%" },
                        position: { left: (dimensions.width - calculateImageDimensions(105, 580 / 403).width) / 2, top: (dimensions.height - calculateImageDimensions(50, 580 / 403).height) / 2 }
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
                        displayPBuildConfirmPanel(false)
                    
                    }}
                >
                    <Label
                        value="Cancel"
                        color={Color4.Black()}
                        fontSize={sizeFont(30, 20)}
                        font="serif"
                        textAlign="middle-center"
                    />

                </UiEntity>
              
            </UiEntity>

        </UiEntity>
    )
}