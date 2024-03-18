import ReactEcs, {UiEntity} from '@dcl/sdk/react-ecs'
import {Color4} from '@dcl/sdk/math'
import {displaySettingsPanel, showSetting} from './settingsIndex'
import {
    calculateImageDimensions,
    calculateSquareImageDimensions,
    getAspect,
    getImageAtlasMapping,
    sizeFont
} from '../../helpers'
import {uiSizes} from '../../uiConfig'
import {localUserId} from '../../../components/player/player'
import {realm, worlds} from '../../../components/scenes'
import {displayRealmTravelPanel} from '../realmTravelPanel'
import {log, paginateArray} from '../../../helpers/functions'
import {playSound} from '../../../components/sounds'
import {SOUND_TYPES} from '../../../helpers/types'
import {BuildsPanel, showYourBuilds} from './buildsPanel'
import {showWorlds, YourWorlds} from './youWorlds'

let visibleIndex = 1
let visibleItems: any[] = []
let lobbyRealm = "BuilderWorld"

export let exploreView: string = "Current World"

export function showAllWorlds() {
    visibleIndex = 1
    visibleItems.length = 0
    refreshVisibleItems()
}

function goToEnd() {
    visibleIndex = Math.floor(worlds.length / 6) +1
    refreshVisibleItems()
}

function goToStart() {
    visibleIndex = 1
    refreshVisibleItems()
}

export function refreshVisibleItems() {
    visibleItems.length = 0

    worlds.sort((a, b) => {
        if (a.name === lobbyRealm) return -1;
        if (b.name === lobbyRealm) return 1;

        return a.name.localeCompare(b.name);
    });

    visibleItems = paginateArray([...worlds], visibleIndex, 6)
    console.log('worlds are', worlds)
}

export function updateExploreView(view: string) {
    exploreView = view
}

export function ExplorePanel() {
    return (
        <UiEntity
            key={"iwbexplorepanel"}
            uiTransform={{
                display: showSetting === "Explore" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}
        >

            {/* buttons row */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                }}
                // uiBackground={{ color: Color4.Teal() }}
            >
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(8, getAspect(uiSizes.buttonPillBlue)).width,
                        height: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlue)).height,
                        margin: {top: "1%", bottom: '1%', right: '1%'},
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getButtonState("Current World")
                    }}
                    onMouseDown={() => {
                        playSound(SOUND_TYPES.SELECT_3)
                        showYourBuilds()
                        updateExploreView("Current World")
                    }}
                    uiText={{value: "Current World", color: Color4.White(), fontSize: sizeFont(30, 12)}}
                />


                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlue)).width,
                        height: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlue)).height,
                        margin: {top: "1%", bottom: '1%', left: '1%'},
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getButtonState("My Worlds")
                    }}
                    onMouseDown={() => {
                        playSound(SOUND_TYPES.SELECT_3)
                        showWorlds()
                        updateExploreView("My Worlds")
                    }}
                    uiText={{value: "My Worlds", color: Color4.White(), fontSize: sizeFont(30, 15)}}
                />

                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlue)).width,
                        height: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlue)).height,
                        margin: {top: "1%", bottom: '1%', left: '1%'},
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getButtonState("All Worlds")
                    }}
                    onMouseDown={() => {
                        playSound(SOUND_TYPES.SELECT_3)
                        // displayStatusView("All Worlds")
                        showAllWorlds()
                        updateExploreView("All Worlds")
                    }}
                    uiText={{value: "All Worlds", color: Color4.White(), fontSize: sizeFont(30, 15)}}
                />

            </UiEntity>

            {/* realm button row */}
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
            >

                {/* current realm text */}
                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                    }}
                    uiText={{
                        value: "Current World: " + realm,
                        textAlign: 'middle-left',
                        color: Color4.White(),
                        fontSize: sizeFont(25, 15)
                    }}
                />


            </UiEntity>

            {/* explore creators table */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '100%',
                    height: '80%',
                    display: exploreView === "All Worlds" ? 'flex' : 'none',
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
                    // uiBackground={{color:Color4.Gray()}}
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
                        uvs: getImageAtlasMapping(uiSizes.rowPillDark)
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
                            margin: {left: "1%"}
                        }}
                        // uiBackground={{color:Color4.Green()}}
                        uiText={{
                            value: "World",
                            fontSize: sizeFont(25, 15),
                            textAlign: 'middle-left',
                            color: Color4.White()
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
                            color: Color4.White()
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
                            color: Color4.White()
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
                            color: Color4.White()
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
                        // uiText={{value:"<3", fontSize:sizeFont(25,15), textAlign:'middle-center', color:Color4.White()}}
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
                    // uiBackground={{color:Color4.White()}}
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
                        // uiBackground={{color:Color4.White()}}
                    >
                    </UiEntity>


                    <UiEntity
                        uiTransform={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '15%',
                            height: '100%',
                        }}
                        // uiBackground={{color:Color4.White()}}
                    >

                        <UiEntity
                            uiTransform={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                justifyContent: 'center',
                                width: calculateSquareImageDimensions(5).width,
                                height: calculateSquareImageDimensions(4).height,
                            }}
                            uiBackground={{
                                textureMode: 'stretch',
                                texture: {
                                    src: 'assets/atlas2.png'
                                },
                                uvs: getImageAtlasMapping(uiSizes.blackArrowLeft)
                            }}
                            onMouseDown={() => {
                                goToStart()
                            }}
                        />

                        <UiEntity
                            uiTransform={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                justifyContent: 'center',
                                width: calculateSquareImageDimensions(5).width,
                                height: calculateSquareImageDimensions(4).height,
                            }}
                            uiBackground={{
                                textureMode: 'stretch',
                                texture: {
                                    src: 'assets/atlas2.png'
                                },
                                uvs: getImageAtlasMapping(uiSizes.blackArrowLeft)
                            }}
                            onMouseDown={() => {
                                if (visibleIndex - 1 > 0) {
                                    visibleIndex--
                                    refreshVisibleItems()
                                }
                            }}
                        />

                        <UiEntity
                            uiTransform={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                justifyContent: 'center',
                                width: calculateSquareImageDimensions(5).width,
                                height: calculateSquareImageDimensions(4).height,
                            }}
                            uiBackground={{
                                textureMode: 'stretch',
                                texture: {
                                    src: 'assets/atlas2.png'
                                },
                                uvs: getImageAtlasMapping(uiSizes.blackArrowRight)
                            }}
                            onMouseDown={() => {
                                log('clickding right')
                                if (visibleIndex + 1 <= Math.floor(worlds.length / 6) + 1){
                                    visibleIndex++
                                    refreshVisibleItems()
                                }
                            }}
                        />
                        <UiEntity
                            uiTransform={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                justifyContent: 'center',
                                width: calculateSquareImageDimensions(5).width,
                                height: calculateSquareImageDimensions(4).height,
                            }}
                            uiBackground={{
                                textureMode: 'stretch',
                                texture: {
                                    src: 'assets/atlas2.png'
                                },
                                uvs: getImageAtlasMapping(uiSizes.blackArrowRight)
                            }}
                            onMouseDown={() => {
                                log('clickding end')
                                goToEnd()
                            }}
                        />


                    </UiEntity>

                </UiEntity>

            </UiEntity>

            <BuildsPanel/>
            <YourWorlds/>


        </UiEntity>
    )
}

function generateCreatorRows() {
    let arr: any[] = []
    if (localUserId) {
        visibleItems.forEach((world: any, i: number) => {
            arr.push(
                <UiEntity
                    key={"world-row-" + i}
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
                        uvs: i % 2 === 0 ? getImageAtlasMapping(uiSizes.rowPillLight)

                            : //

                            getImageAtlasMapping(uiSizes.rowPillDark)
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
                            display: 'flex',
                            margin: {left: "1%"}
                        }}
                        uiText={{
                            value: world.name,
                            fontSize: sizeFont(20, 15),
                            textAlign: 'middle-left',
                            color: Color4.White()
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
                            color: Color4.White()
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
                            color: Color4.White()
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
                                width: calculateSquareImageDimensions(3).width,
                                height: calculateSquareImageDimensions(3).height,
                            }}
                            uiBackground={{
                                textureMode: 'stretch',
                                texture: {
                                    src: 'assets/atlas2.png'
                                },
                                uvs: getImageAtlasMapping(uiSizes.goIcon)
                            }}
                            onMouseDown={() => {
                                displaySettingsPanel(false)
                                displayRealmTravelPanel(true, world)
                            }}
                        />

                        {/* <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(2, getAspect(uiSizes.rectangleButton)).width,
                height: calculateImageDimensions(10,getAspect(uiSizes.rectangleButton)).height,
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.blueButton)
            }}
            uiText={{value: "GO", fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.White()}}
            onMouseDown={()=>{
               displaySettingsPanel(false)
               displayRealmTravelPanel(true, world)
            }}
            />
             */}
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
                        // uiBackground={{
                        //     textureMode: 'stretch',
                        //     texture: {
                        //         src: 'assets/atlas2.png'
                        //     },
                        //     uvs: getImageAtlasMapping(uiSizes.positiveButton)
                        // }}
                    >
                        <UiEntity
                            uiTransform={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: calculateSquareImageDimensions(3).width,
                                height: calculateSquareImageDimensions(3).height,
                            }}
                            uiBackground={{
                                textureMode: 'stretch',
                                texture: {
                                    src: 'assets/atlas2.png'
                                },
                                uvs: getImageAtlasMapping(uiSizes.heartIconWhite)
                            }}
                        />

                    </UiEntity>


                </UiEntity>
            )
        })
    }

    return arr
}


function getButtonState(button: string) {
    if (exploreView === button) {
        return getImageAtlasMapping(uiSizes.buttonPillBlue)
    } else {
        return getImageAtlasMapping(uiSizes.buttonPillBlack)
    }
}