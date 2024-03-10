import ReactEcs, {Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps} from '@dcl/sdk/react-ecs'
import {Color4} from '@dcl/sdk/math'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import resources from '../../../helpers/resources'
import { Transform, engine } from '@dcl/sdk/ecs'
import { localPlayer } from '../../../components/player/player'
import { sendServerMessage } from '../../../components/messaging'
import { SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { displaySettingsPanel } from '../settings/settingsIndex'
import { displaySceneInfoPanel } from './buildsIndex'
import { refreshVisibleSpawns } from './buildSpawnPanel'
import { utils } from '../../../helpers/libraries'

export let showCreateScenePanel = false

let spawn:any = {x:0,y:0,z:0}
let camera:any = {x:0,y:0,z:0}

export function displayAddSpawnPointPanel(value: boolean, current?:boolean) {
    showCreateScenePanel = value
}

export function createAddSpawnPointPanel() {
    return (

        <UiEntity
            key={"createspawnpointpanel"}
            uiTransform={{
                // display:'flex',
                display: showCreateScenePanel ?'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent: 'center',
                width: calculateImageDimensions(13, getAspect(uiSizes.vertRectangleOpaque)).width,
                height: calculateImageDimensions(13,getAspect(uiSizes.vertRectangleOpaque)).height,
                positionType: 'absolute',
                position: {right: '.5%', bottom: '1%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: resources.textures.atlas1
                },
                uvs: getImageAtlasMapping(uiSizes.vertRectangleOpaque)
            }}
        >

            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin: {top: "2%"}
                }}
            >
                <Label
                    value="Add Spawn"
                    color={Color4.White()}
                    fontSize={sizeFont(30, 20)}
                    font="serif"
                    textAlign="middle-center"
                />
            </UiEntity>

            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '100%',
                    height: '90%',
                }}
            >


                {/* spawn row */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignContent:'center',
                    justifyContent: 'center',
                    width: '90%',
                    height: '10%',
                    margin:{top:"10%"}
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.rowPillDark)
                }}
            >


            {/* spawn label */}
            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '35%',
                height: '100%',
            }}

            uiText={{value:"Spawn: ", fontSize:sizeFont(25,15), color:Color4.White()}}
            />

            {/* spawn point */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '65%',
                    height: '100%',
                }}
                // uiBackground={{color:Color4.Purple()}}
                uiText={{value:"x:" + spawn.x.toFixed(0) + ", y:" + spawn.y.toFixed(0) + ", z:"  + spawn.z.toFixed(0) , fontSize:sizeFont(25,15), color:Color4.White()}}
            />
            </UiEntity>

                            {/* camera row */}
                            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '90%',
                    height: '10%',
                    margin:{top:"5%"}
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.rowPillDark)
                }}
            >


            {/* camera label */}
            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '35%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Purple()}}
            uiText={{value:"Camera:", fontSize:sizeFont(25,15), color:Color4.White()}}
            />

            {/* camera point */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '60%',
                    height: '100%',
                }}
                // uiBackground={{color:Color4.Purple()}}
                uiText={{value:"x:" + camera.x.toFixed(0) + ", y:" + camera.y.toFixed(0) + ", z:"  + camera.z.toFixed(0) , fontSize:sizeFont(25,15), color:Color4.White()}}
            />
            </UiEntity>


                {/* set buttons row */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignContent:'center',
                    justifyContent: 'center',
                    width: '90%',
                    height: '10%',
                    margin:{top:"10%"}
                }}
            >

                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlue)).width,
                        height: calculateImageDimensions(5,getAspect(uiSizes.buttonPillBlue)).height,
                        margin: {right: "1%"}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: resources.textures.atlas2
                        },
                        uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
                    }}
                    onMouseDown={() => {
                        let scene = Transform.get(localPlayer.activeScene!.parentEntity).position
                        let player = Transform.get(engine.PlayerEntity).position
                        spawn.x = player.x - scene.x
                        spawn.y = player.y - scene.y
                        spawn.z = player.z - scene.z
                    }}
                    uiText={{value: "Set Spawn", fontSize:sizeFont(20,15), color:Color4.White()}}
                />

            <UiEntity
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlue)).width,
                        height: calculateImageDimensions(5,getAspect(uiSizes.buttonPillBlue)).height,
                        margin: {left: "1%"}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: resources.textures.atlas2
                        },
                        uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
                    }}
                    onMouseDown={() => {
                        let scene = Transform.get(localPlayer.activeScene!.parentEntity).position
                        let player = Transform.get(engine.PlayerEntity).position
                        camera.x = player.x - scene.x
                        camera.y = player.y - scene.y
                        camera.z = player.z - scene.z
                    }}
                    uiText={{value: "Set Camera", fontSize:sizeFont(20,15), color:Color4.White()}}
                />
                </UiEntity>


                
                    {/* confirm/cancel row */}
                    <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignContent:'center',
                    justifyContent: 'center',
                    width: '90%',
                    height: '10%',
                    margin:{top:"10%"}
                }}
            >

                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlue)).width,
                        height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlue)).height,
                        margin: {right: "1%"}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: resources.textures.atlas2
                        },
                        uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
                    }}
                    uiText={{value: "Save Spawn", fontSize:sizeFont(20,15), color:Color4.White()}}
                    onMouseDown={() => {
                        sendServerMessage(
                            SERVER_MESSAGE_TYPES.SCENE_ADDED_SPAWN,
                            {
                                sp:spawn,
                                cp:camera,
                                sceneId: localPlayer.activeScene!.id
                             }
                        )
                        displayAddSpawnPointPanel(false)
                        displaySceneInfoPanel(true, localPlayer.activeScene)
                        utils.timers.setTimeout(()=>{
                            refreshVisibleSpawns()
                        }, 500)
                    }}
                    />

                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlue)).width,
                        height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlue)).height,
                        margin: {left: "1%"}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: resources.textures.atlas2
                        },
                        uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
                    }}
                    uiText={{value: "Cancel", fontSize:sizeFont(20,15), color:Color4.White()}}
                    onMouseDown={() => {
                        displayAddSpawnPointPanel(false)
                        displaySceneInfoPanel(true, localPlayer.activeScene)
                    }}
                    />
                    </UiEntity>

            </UiEntity>
        </UiEntity>
    )
}