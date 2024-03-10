import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { addLineBreak, calculateImageDimensions, calculateSquareImageDimensions, dimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'
import { displaySettingsPanel } from './settings/settingsIndex'
import { sendServerMessage } from '../../components/messaging'
import { SERVER_MESSAGE_TYPES } from '../../helpers/types'

export let show = false
let welcomeView = "main"

export function displayWelcomeScreen(value: boolean) {
    show = value
}

export function createWelcomeScreen() {
    return (
        <UiEntity
            key={"WelcomePanelIWB"}
            uiTransform={{
                display: show ? 'flex' : 'none',
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



            {/* welcome view */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    display:welcomeView === "main" ? "flex" : "none",
                    justifyContent:'flex-start'
                }}
                uiBackground={{
                    textureMode: 'stretch',//
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
                uiText={{value:"Welcome to\nIn World Builder", fontSize: sizeFont(45,30), color: Color4.White()}}
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
                        uiText={{fontSize:sizeFont(25,20), color:Color4.White(), value: addLineBreak("Begin building inside Decentraland or visit our guided tutorial section!", true, 30)}}
                    />

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(8, getAspect(uiSizes.buttonPillBlack)).width,
                height: calculateImageDimensions(8,getAspect(uiSizes.buttonPillBlack)).height,
                margin:{top:"1%", bottom:'1%'},
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            onMouseDown={() => {
                displayWelcomeScreen(false)
                sendServerMessage(SERVER_MESSAGE_TYPES.FIRST_TIME, {})
            }}
            uiText={{value: "Start Building!", color:Color4.White(), fontSize:sizeFont(30,20)}}
            />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(8, getAspect(uiSizes.buttonPillBlack)).width,
                height: calculateImageDimensions(8,getAspect(uiSizes.buttonPillBlack)).height,
                margin:{top:"1%", bottom:'1%'},
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            onMouseDown={() => {
                welcomeView = "tutorials"
            }}
            uiText={{value: "Tutorials", color:Color4.White(), fontSize:sizeFont(30,20)}}
            />

        </UiEntity>



        {/* tutorial view */}
        <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    display:welcomeView === "tutorials" ? "flex" : "none",
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
                uiText={{value:"Guided Tutorials", fontSize: sizeFont(45,30), color: Color4.White()}}
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
                        uiText={{fontSize:sizeFont(25,20), color:Color4.White(), value: addLineBreak("Visit the IWB Builder Robot for guided building tutorials!", true, 30)}}
                    />

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(8, getAspect(uiSizes.buttonPillBlack)).width,
                height: calculateImageDimensions(8,getAspect(uiSizes.buttonPillBlack)).height,
                margin:{top:"1%", bottom:'1%'},
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            onMouseDown={() => {
                displayWelcomeScreen(false)
                sendServerMessage(SERVER_MESSAGE_TYPES.FIRST_TIME, {})
            }}
            uiText={{value: "Ok", color:Color4.White(), fontSize:sizeFont(30,20)}}
            />

        </UiEntity>


        </UiEntity>
    )
}