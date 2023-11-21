import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { addLineBreak, calculateImageDimensions, calculateSquareImageDimensions, dimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'

export let showWorldReadyPanel = false
export let selectedWorld:any = {}


export function displayWorldReadyPanel(value: boolean, world:any) {
    showWorldReadyPanel = value
    selectedWorld = world
}

export function createWorldReadyPanel() {
    return (
        <UiEntity
            key={"showworldreadypanel"}
            uiTransform={{
                display: showWorldReadyPanel ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(25, getAspect(uiSizes.vertRectangle)).width,
                height: calculateImageDimensions(25,  getAspect(uiSizes.vertRectangle)).height,
                positionType: 'absolute',
                position: { left: (dimensions.width - calculateImageDimensions(25, getAspect(uiSizes.vertRectangle)).width) / 2, top: (dimensions.height - calculateImageDimensions(25,  getAspect(uiSizes.vertRectangle)).height) / 2 }
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
                uiText={{value:"World Ready!", fontSize: sizeFont(45,30), color: Color4.Black()}}
                />

                        {/* world name */}
                        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
            uiText={{fontSize:sizeFont(25,20), color:Color4.Black(), value: addLineBreak("" + selectedWorld.worldName, true, 30)}}
        />


                    {/* popup text */}
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '25%',
                        }}
                        uiText={{fontSize:sizeFont(25,20), color:Color4.Black(), value: addLineBreak("Your world is deployed. Join now to start building!", true, 30)}}
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
                uvs: getImageAtlasMapping(uiSizes.positiveButton)
            }}
            onMouseDown={() => {
                displayWorldReadyPanel(false, {})
            }}
            uiText={{value: "Join World", color:Color4.Black(), fontSize:sizeFont(30,20)}}
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
                displayWorldReadyPanel(false,{})
            }}
            uiText={{value: "Cancel", color:Color4.Black(), fontSize:sizeFont(30,20)}}
            />

        </UiEntity>

        </UiEntity>
    )
}