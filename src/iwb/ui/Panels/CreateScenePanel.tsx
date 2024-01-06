import ReactEcs, {Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps} from '@dcl/sdk/react-ecs'
import {Color4} from '@dcl/sdk/math'
import {calculateImageDimensions, dimensions, getAspect, getImageAtlasMapping, sizeFont} from '../helpers'
import {sendServerMessage} from '../../components/messaging'
import {SCENE_MODES, SERVER_MESSAGE_TYPES} from '../../helpers/types'
import {localPlayer, localUserId, players, setPlayMode} from '../../components/player/player'
import resources from '../../helpers/resources'
import {deleteCreationEntities, tempParcels, validateScene} from '../../components/modes/create'
import {formatDollarAmount, log} from '../../helpers/functions'
import { uiSizes } from '../uiConfig'
import { sceneBuilds } from '../../components/scenes'
import { scene } from './builds/buildsIndex'

export let showCreateScenePanel = false
export let editCurrentSceneParcels = false

export function displayCreateScenePanel(value: boolean, current?:boolean) {
    showCreateScenePanel = value

    if(current){
        console.log("editing current scene parcles")
        editCurrentSceneParcels = current
    }else{
        editCurrentSceneParcels = false
    }
}

export function createNewScenePanel() {
    return (

        <UiEntity
            key={"createscenepanel"}
            uiTransform={{
                // display:'flex',
                display: players.has(localUserId) && players.get(localUserId)!.mode === SCENE_MODES.CREATE_SCENE_MODE || editCurrentSceneParcels ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent: 'center',
                width: calculateImageDimensions(15, getAspect(uiSizes.vertRectangleOpaque)).width,
                height: calculateImageDimensions(15,getAspect(uiSizes.vertRectangleOpaque)).height,
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
                    height: '15%',
                    margin: {top: "10%"}
                }}
            >
                <Label
                    value="Create New Scene"
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
                    height: '85%',
                }}
                // uiBackground={{color:Color4.Green()}}
            >


                {/* parcel row */}
                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '90%',
                        height: '15%',
                    }}
                >


                    {/* scene label column */}
                    <UiEntity
                        uiTransform={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '50%',
                            height: '100%',
                        }}
                        // uiBackground={{color:Color4.Purple()}}
                    >
                        <Label
                            value="Parcels"
                            color={Color4.White()}
                            fontSize={sizeFont(30, 20)}
                            font="serif"
                            textAlign="middle-center"
                        />

                    </UiEntity>

                    {/* scene data column */}
                    <UiEntity
                        uiTransform={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '50%',
                            height: '100%',
                        }}
                        // uiBackground={{color:Color4.Teal()}}
                    >
                        <Label
                            value={"" + getParcels()}
                            color={Color4.White()}
                            fontSize={sizeFont(30, 20)}
                            font="serif"
                            textAlign="middle-center"
                        />

                    </UiEntity>

                </UiEntity>


                {/* polycount row */}
                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '90%',
                        height: '15%',
                    }}
                >


                    {/* scene label column */}
                    <UiEntity
                        uiTransform={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '50%',
                            height: '100%',
                        }}
                        // uiBackground={{color:Color4.Purple()}}
                    >
                        <Label
                            value="Polycount"
                            color={Color4.White()}
                            fontSize={sizeFont(30, 20)}
                            font="serif"
                            textAlign="middle-center"
                        />

                    </UiEntity>

                    {/* scene data column */}
                    <UiEntity
                        uiTransform={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '50%',
                            height: '100%',
                        }}
                        // uiBackground={{color:Color4.Teal()}}
                    >
                        <Label
                            value={"" + (formatDollarAmount(getParcels() * 10000))}
                            color={Color4.White()}
                            fontSize={sizeFont(30, 20)}
                            font="serif"
                            textAlign="middle-center"
                        />

                    </UiEntity>

                </UiEntity>


                {/* megabyte row */}
                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '90%',
                        height: '15%',
                    }}
                >

                    {/* scene label column */}
                    <UiEntity
                        uiTransform={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '50%',
                            height: '100%',
                        }}
                        // uiBackground={{color:Color4.Purple()}}
                    >
                        <Label
                            value="Scene Size"
                            color={Color4.White()}
                            fontSize={sizeFont(30, 20)}
                            font="serif"
                            textAlign="middle-center"
                        />

                    </UiEntity>

                    {/* scene data column */}
                    <UiEntity
                        uiTransform={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '50%',
                            height: '100%',
                        }}
                        // uiBackground={{color:Color4.Teal()}}
                    >
                        <Label
                            value={"" + (getParcels() >= 20 ? "300" : getParcels() * 15) + " MB"}
                            color={Color4.White()}
                            fontSize={sizeFont(30, 20)}
                            font="serif"
                            textAlign="middle-center"
                        />

                    </UiEntity>

                </UiEntity>


                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(13, getAspect(uiSizes.positiveButton)).width,
                        height: calculateImageDimensions(13,getAspect(uiSizes.positiveButton)).height,
                        margin: {top: "5%"}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: resources.textures.atlas2
                        },
                        uvs: getImageAtlasMapping(uiSizes.positiveButton)
                    }}
                    onMouseDown={() => {
                        sendServerMessage(SERVER_MESSAGE_TYPES.SELECT_PARCEL, {
                            player: localUserId,
                            parcel: players.get(localUserId)!.currentParcel,
                            scene: localPlayer.activeScene ? localPlayer.activeScene.id : 0,
                            current: editCurrentSceneParcels ? scene!.id : 0
                        })
                    }}
                    uiText={{value: "Toggle Parcel", fontSize:sizeFont(30,20), color:Color4.White()}}
                >
                </UiEntity>


                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(13, getAspect(uiSizes.positiveButton)).width,
                        height: calculateImageDimensions(13, getAspect(uiSizes.positiveButton)).height,
                        margin: {top: "2%"}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: resources.textures.atlas2
                        },
                        uvs: getImageAtlasMapping(uiSizes.blackButton)
                    }}
                    uiText={{value: "Save Scene", fontSize:sizeFont(30,20), color:Color4.White()}}
                    onMouseDown={() => {
                        if(editCurrentSceneParcels){
                            displayCreateScenePanel(false)
                        }else{
                            validateScene()
                        }
                    }}
                >
                </UiEntity>
            </UiEntity>
        </UiEntity>
    )
}

function getParcels() {
    // if (localUserId && players.has(localUserId) &&
    //     players.get(localUserId)!.mode === SCENE_MODES.CREATE_SCENE_MODE &&
    //     scenesToCreate.has(localUserId) &&
    //     scenesToCreate.get(localUserId).parcels
    // ) {
    //     return scenesToCreate.get(localUserId).parcels.length
    // } else {
    //     return 0
    // }//
    return editCurrentSceneParcels ? sceneBuilds.get(scene!.id).pcls.length : tempParcels.size
}