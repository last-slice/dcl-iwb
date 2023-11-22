import ReactEcs, {UiEntity} from '@dcl/sdk/react-ecs'
import {Color4} from '@dcl/sdk/math'
import {showSetting} from './settingsIndex'
import {calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont} from '../../helpers'
import {uiSizes} from '../../uiConfig'
import {localUserId, players, worldTravel} from '../../../components/player/player'
import {world} from '../../../components/messaging'
import {scenes, worlds} from '../../../components/scenes'

let pressed: any = {
    Save: false,
    Load: false
}
//

let exploreView = 'Creators'

export function ExplorePanel() {
    return (
        <UiEntity
            key={"explorepanel"}
            uiTransform={{
                display: showSetting === "Explore" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}
        >

            {/* realm button row */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '11%',
                }}
                // uiBackground={{color:Color4.Blue()}}
            >

                {/* current realm text */}
                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '60%',
                        height: '100%',
                    }}
                    uiText={{
                        value: "Current Realm: " + (world ? world.label : ""),
                        textAlign: 'middle-left',
                        color: Color4.Black(),
                        fontSize: sizeFont(20, 15)
                    }}
                />

                {/* IWB realm jump button */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(6, getAspect(uiSizes.blueButton)).width,
                        height: calculateImageDimensions(10, getAspect(uiSizes.blueButton)).height,
                        margin: {right: "1%"},
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.blueButton)
                    }}
                    onMouseDown={() => {
                        // pressed.Save = true
                        worldTravel({world: 'iwb', label: "IWB Team"})
                    }}
                    uiText={{value: "IWB", color: Color4.Black(), fontSize: sizeFont(25, 15)}}
                />

                {/* Personal realm jump button */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(6, getAspect(uiSizes.rectangleButton)).width,
                        height: calculateImageDimensions(10, getAspect(uiSizes.rectangleButton)).height,
                        margin: {right: "1%"},
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.blueButton)
                    }}
                    onMouseDown={() => {
                        // pressed.Save = true
                        worldTravel({world: localUserId, label: players.get(localUserId)?.dclData.displayName})
                    }}
                    uiText={{value: "My Realm", color: Color4.Black(), fontSize: sizeFont(25, 15)}}
                />


            </UiEntity>

            {/* filter buttons row */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '100%',
                    height: '11%',
                }}
                // uiBackground={{color:Color4.Blue()}}
            >

                {/* Creators filter */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(6, getAspect(uiSizes.normalButton)).width,
                        height: calculateImageDimensions(10, getAspect(uiSizes.normalButton)).height,
                        margin: {right: "1%"},
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getButtonState('Creators')
                    }}
                    onMouseDown={() => {
                        // pressed.Save = true
                        updateView("Creators")
                    }}
                    uiText={{value: "Creators", color: Color4.Black(), fontSize: sizeFont(25, 15)}}
                />

                {/* Builds filter */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(6, getAspect(uiSizes.normalButton)).width,
                        height: calculateImageDimensions(10, getAspect(uiSizes.normalButton)).height,
                        margin: {right: "1%"},
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getButtonState('Builds')
                    }}
                    onMouseDown={() => {
                        // pressed.Save = true
                        updateView("Builds")
                    }}
                    uiText={{value: "Builds", color: Color4.Black(), fontSize: sizeFont(25, 15)}}
                />


            </UiEntity>

            {/* explore creators table */}
            <UiEntity
                uiTransform={{
                    display: exploreView === "Creators" ? 'flex' : 'none',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '100%',
                    height: '90%',
                }}
                // uiBackground={{color:Color4.Gray()}}
            >


                {/* explore table bg */}
                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: '100%',
                        height: '85%',
                        positionType: 'absolute'
                    }}
                    uiBackground={{color: Color4.Gray()}}
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
                            width: '40%',
                            height: '100%',
                        }}
                        // uiBackground={{color:Color4.Green()}}
                        uiText={{
                            value: "Creator Name",
                            fontSize: sizeFont(25, 15),
                            textAlign: 'middle-left',
                            color: Color4.Black()
                        }}
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
                        uiText={{
                            value: "Last Update",
                            fontSize: sizeFont(25, 15),
                            textAlign: 'middle-center',
                            color: Color4.Black()
                        }}
                    />

                    <UiEntity
                        uiTransform={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '10%',
                            height: '100%',
                        }}
                        // uiBackground={{color:Color4.Green()}}
                        uiText={{
                            value: "Builds",
                            fontSize: sizeFont(25, 15),
                            textAlign: 'middle-center',
                            color: Color4.Black()
                        }}
                    />

                    <UiEntity
                        uiTransform={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '10%',
                            height: '100%',
                        }}

                        uiText={{
                            value: "Go",
                            fontSize: sizeFont(25, 15),
                            textAlign: 'middle-center',
                            color: Color4.Black()
                        }}
                    />

                    <UiEntity
                        uiTransform={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '10%',
                            height: '100%',
                        }}
                        // uiBackground={{color:Color4.Green()}}
                        uiText={{
                            value: "<3",
                            fontSize: sizeFont(25, 15),
                            textAlign: 'middle-center',
                            color: Color4.Black()
                        }}
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
                        height: '80%',
                    }}
                    // uiBackground={{color:Color4.Yellow()}}
                >


                    {generateCreatorRows()}


                </UiEntity>

                {/* buttons row */}
                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '15%',
                    }}
                    // uiBackground={{color:Color4.Black()}}
                >
                    <UiEntity
                        uiTransform={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            width: '85%',
                            height: '100%',
                        }}
                        // uiBackground={{color:Color4.Black()}}
                    >
                    </UiEntity>


                    <UiEntity
                        uiTransform={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            width: '15%',
                            height: '100%',
                        }}
                        uiBackground={{color: Color4.Black()}}
                    >
                    </UiEntity>

                </UiEntity>

            </UiEntity>


            {/* explore builds table */}
            <UiEntity
                uiTransform={{
                    display: exploreView === "Builds" ? 'flex' : 'none',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '100%',
                    height: '90%',
                }}
                // uiBackground={{color:Color4.Gray()}}
            >

                {/* explore table bg */}
                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: '100%',
                        height: '85%',
                        positionType: 'absolute'
                    }}
                    uiBackground={{color: Color4.Gray()}}
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
                            width: '40%',
                            height: '100%',
                        }}
                        // uiBackground={{color:Color4.Green()}}
                        uiText={{
                            value: "Scene Name",
                            fontSize: sizeFont(25, 15),
                            textAlign: 'middle-left',
                            color: Color4.Black()
                        }}
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
                        // uiBackground={{color:Color4.Blue()}}
                        uiText={{
                            value: "Creator Name",
                            fontSize: sizeFont(25, 15),
                            textAlign: 'middle-center',
                            color: Color4.Black()
                        }}
                    />

                    <UiEntity
                        uiTransform={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '20%',
                            height: '100%',
                        }}
                        // uiBackground={{color:Color4.Green()}}
                        uiText={{
                            value: "Last Update",
                            fontSize: sizeFont(25, 15),
                            textAlign: 'middle-center',
                            color: Color4.Black()
                        }}
                    />

                    <UiEntity
                        uiTransform={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '10%',
                            height: '100%',
                        }}
                        // uiBackground={{color:Color4.Green()}}

                        uiText={{
                            value: "Go",
                            fontSize: sizeFont(25, 15),
                            textAlign: 'middle-center',
                            color: Color4.Black()
                        }}
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
                        height: '80%',
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
                        width: '100%',
                        height: '15%',
                    }}
                    // uiBackground={{color:Color4.Black()}}
                >
                    <UiEntity
                        uiTransform={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            width: '85%',
                            height: '100%',
                        }}
                        // uiBackground={{color:Color4.Black()}}
                    >
                    </UiEntity>


                    <UiEntity
                        uiTransform={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            width: '15%',
                            height: '100%',
                        }}
                        uiBackground={{color: Color4.Black()}}
                    >
                    </UiEntity>

                </UiEntity>

            </UiEntity>


        </UiEntity>
    )
}

function generateBuildRows() {
    let arr: any[] = []
    if (localUserId && exploreView === "Builds") {
        scenes.forEach((scene: any, i: number) => {
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

                            :

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
                            width: '40%',
                            height: '100%',
                            display: 'flex'
                        }}
                        uiText={{
                            value: "" + scene.scna,
                            fontSize: sizeFont(20, 15),
                            textAlign: 'middle-left',
                            color: Color4.Black()
                        }}
                    />

                    {/* world build counts */}
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '30%',
                            height: '100%',
                            display: 'flex'
                        }}
                        uiText={{
                            value: "" + scene.name,
                            fontSize: sizeFont(20, 15),
                            textAlign: 'middle-center',
                            color: Color4.Black()
                        }}
                    />


                    {/* world last updated */}
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '20%',
                            height: '100%',
                            display: 'flex'
                        }}
                        uiText={{
                            value: "" + Math.floor((Math.floor(Date.now() / 1000) - scene.updated) / 86400) + " days ago",
                            fontSize: sizeFont(20, 15),
                            textAlign: 'middle-center',
                            color: Color4.Black()
                        }}
                    />

                    {/* go button */}
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '10%',
                            height: '100%',
                            display: 'flex'
                        }}
                    >

                        <UiEntity
                            uiTransform={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: calculateImageDimensions(2, getAspect(uiSizes.rectangleButton)).width,
                                height: calculateImageDimensions(10, getAspect(uiSizes.rectangleButton)).height,
                            }}
                            uiBackground={{
                                textureMode: 'stretch',
                                texture: {
                                    src: 'assets/atlas2.png'
                                },
                                uvs: getImageAtlasMapping(uiSizes.blueButton)
                            }}
                            uiText={{
                                value: "GO",
                                fontSize: sizeFont(20, 15),
                                textAlign: 'middle-center',
                                color: Color4.Black()
                            }}
                        />
                    </UiEntity>


                </UiEntity>
            )
        })
    }

    return arr
}


function generateCreatorRows() {
    let arr: any[] = []
    if (localUserId) {
        worlds.forEach((world: any, i: number) => {
            arr.push(
                <UiEntity
                    key={"world row - " + world.id}
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
                            width: '40%',
                            height: '100%',
                            display: 'flex'
                        }}
                        uiText={{
                            value: world.name,
                            fontSize: sizeFont(20, 15),
                            textAlign: 'middle-left',
                            color: Color4.Black()
                        }}
                    />

                    {/* world last updated */}
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '30%',
                            height: '100%',
                            display: 'flex'
                        }}
                        uiText={{
                            value: "" + Math.floor((Math.floor(Date.now() / 1000) - world.updated) / 86400) + " days ago",
                            fontSize: sizeFont(20, 15),
                            textAlign: 'middle-center',
                            color: Color4.Black()
                        }}
                    />

                    {/* world build counts */}
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '10%',
                            height: '100%',
                            display: 'flex'
                        }}
                        uiText={{
                            value: "" + world.builds,
                            fontSize: sizeFont(20, 15),
                            textAlign: 'middle-center',
                            color: Color4.Black()
                        }}
                    />

                    {/* go button */}
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '10%',
                            height: '100%',
                            display: 'flex'
                        }}
                    >

                        <UiEntity
                            uiTransform={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: calculateImageDimensions(2, getAspect(uiSizes.rectangleButton)).width,
                                height: calculateImageDimensions(10, getAspect(uiSizes.rectangleButton)).height,
                            }}
                            uiBackground={{
                                textureMode: 'stretch',
                                texture: {
                                    src: 'assets/atlas2.png'
                                },
                                uvs: getImageAtlasMapping(uiSizes.blueButton)
                            }}
                            uiText={{
                                value: "GO",
                                fontSize: sizeFont(20, 15),
                                textAlign: 'middle-center',
                                color: Color4.Black()
                            }}
                            onMouseDown={() => {
                                worldTravel({world: world.owner, label: world.name})
                            }}
                        />
                    </UiEntity>

                    {/* favorite button */}
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '10%',
                            height: '80%',
                            margin: {right: "1%"},
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
                        uiText={{value: "FV", color: Color4.Black(), fontSize: sizeFont(20, 15)}}
                    />


                </UiEntity>
            )
        })
    }

    return arr
}

function getButtonState(button: string) {
    if (exploreView === button) {
        return getImageAtlasMapping(uiSizes.positiveButton)
    } else {
        return getImageAtlasMapping(uiSizes.normalButton)
    }
}

function updateView(view: string) {
    exploreView = view
    //do things to get the new view data
}

//