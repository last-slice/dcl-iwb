import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { addLineBreak, calculateImageDimensions, calculateSquareImageDimensions, dimensions, getImageAtlasMapping, sizeFont } from '../helpers'

export let showRPPPanel = false

export function displayRPPPanel(value: boolean) {
    showRPPPanel = value
}

export function createRPPPanel() {
    return (
        <UiEntity
            key={"rpppanel"}
            uiTransform={{
                display: showRPPPanel ? 'flex' : 'none',
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
                        position: {left: (dimensions.width - calculateImageDimensions(105, 90 / 30).width) / 2, top: (dimensions.height - calculateImageDimensions(155, 90 / 30).height) / 2}
                    }}
                // uiBackground={{color:Color4.Green()}}
                >

                    <Label
                        value={addLineBreak("BUILDS", true, 50)}
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
                        width: calculateImageDimensions(3, 111 / 41).width,
                        height: calculateImageDimensions(4, 111 / 41).height,
                        margin: { right: "2%" },
                        position: { left: (dimensions.width - calculateImageDimensions(130, 30 / 30).width) / 2, top: (dimensions.height - calculateImageDimensions(50, 30 / 30).height) / 2 }
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
                        displayRPPPanel(false)
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
                        position: { left: (dimensions.width - calculateImageDimensions(105, 223 / 41).width) / 2, top: (dimensions.height - calculateImageDimensions(285, 223 / 41).height) / 2 }
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
                        value="New Build"
                        color={Color4.White()}
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
                        position: {left: (dimensions.width - calculateImageDimensions(105, 223 / 41).width) / 2, top: (dimensions.height - calculateImageDimensions(275, 223 / 41).height) / 2   }
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
                        value="Your Builds"
                        color={Color4.White()}
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
                        position: {left: (dimensions.width - calculateImageDimensions(105, 223 / 41).width) / 2, top: (dimensions.height - calculateImageDimensions(265, 223 / 41).height) / 2   }
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
                        value="Explore Builds"
                        color={Color4.White()}
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
                        position: { left: (dimensions.width - calculateImageDimensions(105, 223 / 41).width) / 2, top: (dimensions.height - calculateImageDimensions(255, 223 / 41).height) / 2  }
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
                        value="Recently Visited"
                        color={Color4.White()}
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
                        position: { left: (dimensions.width - calculateImageDimensions(105, 223 / 41).width) / 2, top: (dimensions.height - calculateImageDimensions(245, 223 / 41).height) / 2  }
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
                        value="Favorite Builds"
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