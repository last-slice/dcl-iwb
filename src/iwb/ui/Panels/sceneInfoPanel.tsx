import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'
import { localUserId, players } from '../../components/player/player'
import { formatDollarAmount } from '../../helpers/functions'



export let showSceneInfoPanel = false

export function displaySceneInfoPanel(value: boolean) {
    showSceneInfoPanel = value
}

export function createSceneInfoPanel() {
    return (
        <UiEntity
            key={"sceneinfopanel"}
            uiTransform={{
                display: showSceneInfoPanel ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: calculateImageDimensions(30, 345 / 511).width,
                height: calculateImageDimensions(25, 345 / 511).height,
                positionType: 'absolute',
                position: { left: '2%', bottom: '1%' }
            }}
        >
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '100%',
                    height: '80%',
                    positionType: 'absolute'
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
            />
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '90%',
                    height: '70%',
                    positionType: 'absolute',
                    margin: { right: '1%', left: '1%' }
                }}
                uiBackground={{ color: Color4.Gray() }}
            />
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '30%',
                    height: '55%',
                    positionType: 'absolute',
                    position: { left: '8%', bottom: '33%' }
                }}
                uiBackground={{ color: Color4.White() }}
            />
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '52%',
                    height: '55%',
                    positionType: 'absolute',
                    position: { left: '40%', bottom: '33%' }
                }}
                uiBackground={{ color: Color4.White() }}
            />


            {/* header row */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                }}
                // uiBackground={{color:Color4.Blue()}}
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
                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '30%',
                        height: '100%',
                    }}
                    // uiBackground={{color:Color4.Green()}}
                    uiText={{ value: "Build Name", fontSize: sizeFont(25, 25), textAlign: 'middle-left', color: Color4.Black() }}
                />
                  <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                        width: calculateImageDimensions(1, getAspect(uiSizes.xButtonBlack)).width,
                        height: calculateImageDimensions(1, getAspect(uiSizes.xButtonBlack)).height,
                        position: {left: '30%'},
                        
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.xButtonBlack)
                    }}
                    onMouseDown={() => {
                        displaySceneInfoPanel(false)


                    }}
                />
            </UiEntity>

            {/* header row */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    width: '30%',
                    height: '5%',
                    position: { right: '27%', top: '1%' }
                }}
                // uiBackground={{color:Color4.Blue()}}
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
                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '30%',
                        height: '100%',
                    }}
                    // uiBackground={{color:Color4.Green()}}
                    uiText={{ value: "Build Details", fontSize: sizeFont(25, 15), textAlign: 'middle-center', color: Color4.Black() }}
                />
            </UiEntity>

            {/* header row */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '52%',
                    height: '5%',
                    position: { left: '16%', bottom: `4%` }
                }}
                // uiBackground={{color:Color4.Blue()}}
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

                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        width: '30%',
                        height: '100%',
                    }}
                    // uiBackground={{color:Color4.Green()}}
                    uiText={{ value: "Asset Name", fontSize: sizeFont(25, 15), textAlign: 'middle-left', color: Color4.Black() }}
                />
                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '30%',
                        height: '100%',
                    }}
                    // uiBackground={{color:Color4.Green()}}
                    uiText={{ value: "      Tris", fontSize: sizeFont(25, 15), textAlign: 'middle-center', color: Color4.Black() }}
                />
                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                        width: '30%',
                        height: '100%',
                    }}
                    // uiBackground={{color:Color4.Green()}}
                    uiText={{ value: "Size", fontSize: sizeFont(25, 15), textAlign: 'middle-right', color: Color4.Black() }}
                />
            </UiEntity>

            {/* builds row */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '100%',
                    height: '60%',
                }}
            // uiBackground={{color:Color4.Yellow()}}
            >


                {generateBuildRows()}



            </UiEntity>

            {/* buttons row */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '80%',
                    height: '20%',
                    position: { bottom: '15%' }
                }}
            // uiBackground={{color:Color4.Black()}}
            >
                   {/* scroll up button */}
                   <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(2, getAspect(uiSizes.rightArrowBlack)).width,
                        height: calculateImageDimensions(2, getAspect(uiSizes.rightArrowBlack)).height,
                        margin: { right: "3%" },
                        position: {right : '2%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.rightArrowBlack)
                    }}
                    onMouseDown={() => {
                        // pressed.Load = true

                    }}
                    onMouseUp={() => {
                        // pressed.Load = false
                    }}
                
                />

                {/*asset button */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(12, getAspect(uiSizes.rectangleButton)).width,
                        height: calculateImageDimensions(12, getAspect(uiSizes.rectangleButton)).height,
                        margin: { right: "2%" },
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.normalLighterButton)
                    }}
                    onMouseDown={() => {
                        // pressed.Save = true
                    }}
                    onMouseUp={() => {
                        // pressed.Save = false
                    }}
                    uiText={{ value: "Asset Details", color: Color4.Black(), fontSize: sizeFont(30, 18) }}
                />

                {/* save button */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(6, getAspect(uiSizes.rectangleButton)).width,
                        height: calculateImageDimensions(12, getAspect(uiSizes.rectangleButton)).height,
                        margin: { right: "1%" },
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.positiveButton)
                    }}
                    onMouseDown={() => {
                        // pressed.Save = true
                    }}
                    onMouseUp={() => {
                        // pressed.Save = false
                    }}
                    uiText={{ value: "Edit", color: Color4.Black(), fontSize: sizeFont(30, 20) }}
                />

                {/* delete button */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(10, getAspect(uiSizes.rectangleButton)).width,
                        height: calculateImageDimensions(12, getAspect(uiSizes.rectangleButton)).height,
                        margin: { right: "1%" },
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.dangerButton)
                    }}
                    onMouseDown={() => {
                        // pressed.Load = true

                    }}
                    onMouseUp={() => {
                        // pressed.Load = false
                    }}
                    uiText={{ value: "Delete", color: Color4.Black(), fontSize: sizeFont(30, 20) }}
                />
                 {/* scroll up button */}
                 <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(2, getAspect(uiSizes.upArrowBlack)).width,
                        height: calculateImageDimensions(2, getAspect(uiSizes.upArrowBlack)).height,
                        margin: { left: "5%" },
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.upArrowBlack)
                    }}
                    onMouseDown={() => {
                        // pressed.Load = true

                    }}
                    onMouseUp={() => {
                        // pressed.Load = false
                    }}
                
                />
                 {/* scroll down button */}
                 <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(2, getAspect(uiSizes.downArrowBlack)).width,
                        height: calculateImageDimensions(2, getAspect(uiSizes.downArrowBlack)).height,
                        margin: { right: "1%" },
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.downArrowBlack)
                    }}
                    onMouseDown={() => {
                        // pressed.Load = true

                    }}
                    onMouseUp={() => {
                        // pressed.Load = false
                    }}
                
                />

            </UiEntity>



        </UiEntity>
    )
}



function generateBuildRows() {
    let arr: any[] = []
    if (localUserId) {
        let player = players.get(localUserId)
        player!.scenes.forEach((scene: any, i: number) => {
            arr.push(
                <UiEntity
                    key={"build row - " + scene.id}
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '15%',
                        display: 'flex'
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: i % 2 === 0 ? getImageAtlasMapping(uiSizes.normalButton)

                            : //

                            getImageAtlasMapping(uiSizes.normalLightestButton)
                    }}
                >

                    {/* scene name */}
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignContent: 'flex-start',
                            width: '30%',
                            height: '100%',
                            display: 'flex'
                        }}
                        uiText={{ value: scene.n, fontSize: sizeFont(20, 15), textAlign: 'middle-left', color: Color4.Black() }}
                    />

                    {/* scene parcel count */}
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '20%',
                            height: '100%',
                            display: 'flex'
                        }}
                        uiText={{ value: "" + scene.pcnt, fontSize: sizeFont(20, 15), textAlign: 'middle-center', color: Color4.Black() }}
                    />

                    {/* scene parcel size */}
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '20%',
                            height: '100%',
                            display: 'flex'
                        }}
                        uiText={{ value: "" + scene.si + "MB", fontSize: sizeFont(20, 15), textAlign: 'middle-center', color: Color4.Black() }}
                    />

                    {/* scene poly count */}
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '20%',
                            height: '100%',
                            display: 'flex'
                        }}
                        uiText={{ value: "" + formatDollarAmount(scene.pc), fontSize: sizeFont(20, 15), textAlign: 'middle-center', color: Color4.Black() }}
                    />

                    {/* save button */}
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '10%',
                            height: '80%',
                            margin: { right: "1%" },
                        }}
                        uiBackground={{
                            textureMode: 'stretch',
                            texture: {
                                src: 'assets/atlas2.png'
                            },
                            uvs: getImageAtlasMapping(uiSizes.positiveButton)
                        }}
                        onMouseDown={() => {
                            // pressed.Save = true
                        }}
                        onMouseUp={() => {
                            // pressed.Save = false
                        }}
                        uiText={{ value: "Go", color: Color4.Black(), fontSize: sizeFont(20, 15) }}
                    />



                </UiEntity>
            )
        })
    }

    return arr
}