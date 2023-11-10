import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { addLineBreak, calculateImageDimensions, calculateSquareImageDimensions, dimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'
import { colyseusConnect, joinWorld } from '../../components/messaging'
import { localUserId, players } from '../../components/player/player'

export let showFTPPanel = false

export function displayFTPPanel(value: boolean) {
    showFTPPanel = value
}

export function createFTPPanel() {
    return (
        <UiEntity
            key={"ftppanel"}
            uiTransform={{
                display: showFTPPanel ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(35, getAspect(uiSizes.vertRectangle)).width,
                height: calculateImageDimensions(35,getAspect(uiSizes.vertRectangle)).height,
                positionType: 'absolute',
                position: { left: (dimensions.width - calculateImageDimensions(35, getAspect(uiSizes.vertRectangle)).width) / 2, top: (dimensions.height - calculateImageDimensions(35, getAspect(uiSizes.vertRectangle)).height) / 2 }
            }}
        // uiBackground={{ color: Color4.Red() }}//
        >
           <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    display:'flex',
                    justifyContent:'flex-start'
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.vertRectangle)
                }}
            >
                
                {/* header label */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '15%',
                        display:'flex',
                        margin:{top:'10%'}
                    }}
                // uiBackground={{color:Color4.Green()}}
                uiText={{value:"First Time User", fontSize: sizeFont(45,30), color: Color4.Black()}}
                />

                    {/* popup text */}
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '30%',
                        }}
                        uiText={{fontSize:sizeFont(25,20), color:Color4.Black(), value: addLineBreak("Welcome to the In-World Builder! The Tutorial is recommended for first time users. It only takes a couple minutes to go through it all.", true, 40)}}
                    />

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(8, getAspect(uiSizes.rectangleButton)).width,
                height: calculateImageDimensions(15,getAspect(uiSizes.rectangleButton)).height,
                margin:{top:"1%", bottom:'1%'},
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.normalButton)
            }}
            onMouseDown={() => {
                displayFTPPanel(false)
                joinWorld({world:localUserId, label:players.get(localUserId)?.dclData.displayName})
            }}
            uiText={{value: "New Build", color:Color4.Black(), fontSize:sizeFont(30,20)}}
            />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(8, getAspect(uiSizes.rectangleButton)).width,
                height: calculateImageDimensions(15,getAspect(uiSizes.rectangleButton)).height,
                margin:{top:"1%", bottom:'1%'},
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.normalButton)
            }}
            onMouseDown={() => {
                displayFTPPanel(false)
            }}
            uiText={{value: "Tutorial", color:Color4.Black(), fontSize:sizeFont(30,20)}}//
            />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(8, getAspect(uiSizes.rectangleButton)).width,
                height: calculateImageDimensions(15,getAspect(uiSizes.rectangleButton)).height,
                margin:{top:"1%", bottom:'1%'},
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.normalButton)
            }}
            onMouseDown={() => {
                displayFTPPanel(false)
            }}
            uiText={{value: "Explore", color:Color4.Black(), fontSize:sizeFont(30,20)}}
            />

        </UiEntity>

        </UiEntity>
    )
}


