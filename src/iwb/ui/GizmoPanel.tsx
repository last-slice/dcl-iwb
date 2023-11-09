import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { addLineBreak, calculateImageDimensions, calculateSquareImageDimensions, dimensions, getAspect, getImageAtlasMapping, sizeFont, uiSizer } from './helpers'
import { selectedCatalogItem } from '../components/modes/build'
import { uiSizes } from './uiConfig'

export let showGizmoPanel = true

export function displaySaveBuildPanel(value: boolean) {
    showGizmoPanel = value
}

export function createGizmoPanel() {
    return (
        <UiEntity
            key={"gizmopanel"}
            uiTransform={{
                // display: selectedCatalogItem !== null ? 'flex' : 'none',
                display:"flex",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: dimensions.width * .1,
                height: dimensions.height * .2,
                positionType: 'absolute',
                position: { right: '4%', bottom:'2%' }
            }}
        // uiBackground={{ color: Color4.Red() }}
        >

            {/* top row */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '30%',
                        margin:{top:'2%'}
                    }}
                    // uiBackground={{color:Color4.Green()}}
                >

                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(5).width,
                        height:  calculateSquareImageDimensions(5).height,
                        margin:{right:'2%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.upArrow)
                    }}
                    />

                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(5).width,
                        height:  calculateSquareImageDimensions(5).height,
                        margin:{right:'2%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.upCarot)
                    }}
                    />

                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(5).width,
                        height:  calculateSquareImageDimensions(5).height,
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.downArrow)
                    }}
                    />



                </UiEntity>

           {/* middle row */}
           <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '30%',
                        margin:{top:'2%'}
                    }}
                    // uiBackground={{color:Color4.Green()}}
                >

                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(5).width,
                        height:  calculateSquareImageDimensions(5).height,
                        margin:{right:'2%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.leftCarot)
                    }}
                    />

                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(5).width,
                        height:  calculateSquareImageDimensions(5).height,
                        margin:{right:'2%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas1.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.positionIcon)
                    }}
                    />

                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(5).width,
                        height:  calculateSquareImageDimensions(5).height,
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.rightCarot)
                    }}
                    />



                </UiEntity>         


{/* bottom row */}
           <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '30%',
                        margin:{top:'2%'}
                    }}
                    // uiBackground={{color:Color4.Green()}}
                >

                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(5).width,
                        height:  calculateSquareImageDimensions(5).height,
                        margin:{right:'2%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.upArrow)
                    }}
                    />

                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(5).width,
                        height:  calculateSquareImageDimensions(5).height,
                        margin:{right:'2%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.downCarot)
                    }}
                    />

                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(5).width,
                        height:  calculateSquareImageDimensions(5).height,
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.downArrow)
                    }}
                    />



                </UiEntity>   

        </UiEntity>
    )
}