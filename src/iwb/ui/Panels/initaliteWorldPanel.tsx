import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { addLineBreak, calculateImageDimensions, calculateSquareImageDimensions, dimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'
import { displaySettingsPanel } from './settings/settingsIndex'
import { showNotification } from './notificationUI'
import { NOTIFICATION_TYPES, SERVER_MESSAGE_TYPES } from '../../helpers/types'
import { cRoom } from '../../components/messaging'
import { localUserId } from '../../components/player/player'
import { log } from '../../helpers/functions'

export let showInitalizeWorldPanel = false

export let selectedWorld:any = {}

export function displayInitalizeWorldPanel(value: boolean, world:any) {
    showInitalizeWorldPanel = value
    selectedWorld = world
}

export function createInitalizeWorldPanel() {
    return (
        <UiEntity
            key={"initalizeworldpanel"}
            uiTransform={{
                display: showInitalizeWorldPanel ? 'flex' : 'none',
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
                uiText={{value:"Initalize World", fontSize: sizeFont(45,30), color: Color4.White()}}
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
            uiText={{fontSize:sizeFont(25,20), color:Color4.White(), value: addLineBreak("" + selectedWorld.name, true, 30)}}
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
                        uiText={{fontSize:sizeFont(25,20), color:Color4.White(), value: addLineBreak("To begin building in this world, you must initiate it.", true, 30)}}
                    />

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(8, getAspect(uiSizes.buttonPillBlack)).width,
                height: calculateImageDimensions(15,getAspect(uiSizes.buttonPillBlack)).height,
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
                cRoom.send(SERVER_MESSAGE_TYPES.INIT_WORLD, {user:localUserId, world:selectedWorld})
                displayInitalizeWorldPanel(false, {})
                showNotification({type:NOTIFICATION_TYPES.MESSAGE, animate:{enabled:true, return:true, time:5}, message:"Your deployment is pending...please wait for confirmation"})
            }}
            uiText={{value: "Continue", color:Color4.White(), fontSize:sizeFont(30,20)}}
            />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(8, getAspect(uiSizes.buttonPillBlack)).width,
                height: calculateImageDimensions(15,getAspect(uiSizes.buttonPillBlack)).height,
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
                displayInitalizeWorldPanel(false,{})
                displaySettingsPanel(true)
            }}
            uiText={{value: "Cancel", color:Color4.White(), fontSize:sizeFont(30,20)}}
            />

        </UiEntity>

        </UiEntity>
    )
}