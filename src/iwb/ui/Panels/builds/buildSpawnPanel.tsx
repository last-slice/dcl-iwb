import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { localPlayer, localUserId } from '../../../components/player/player'
import { realm, worlds } from '../../../components/scenes'
import { displayRealmTravelPanel } from '../realmTravelPanel'
import { log, paginateArray } from '../../../helpers/functions'
import { buildInfoTab, displaySceneInfoPanel, scene } from './buildsIndex'
import { cRoom, sendServerMessage } from '../../../components/messaging'
import { SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { displayAddSpawnPointPanel } from './addSpawnPointPanel'
import { displaySettingsPanel } from '../settings/settingsIndex'
import { utils } from '../../../helpers/libraries'

let visibleIndex = 1
let visibleSpawns:any[] = []
let visibleCameras:any[] = []
let addWallet:string = ""

export function showSpawnPanel(){
    visibleIndex = 1
    visibleSpawns.length = 0
    visibleCameras.length = 0
    refreshVisibleSpawns()
}

export function refreshVisibleSpawns(){
    visibleSpawns.length = 0
    visibleCameras.length = 0
    if(scene){
        visibleSpawns = paginateArray([...scene.sp], visibleIndex, 6)
        visibleCameras = paginateArray([...scene.cp], visibleIndex, 6)
    }
  }

export function SpawnPanel() {
    return (
        <UiEntity
            key={"buildspawnpnel"}
            uiTransform={{
                display: buildInfoTab === "Spawns" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}
        >

            {/*  list table */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '90%',
            }}
            // uiBackground={{color:Color4.Gray()}}
            >

            {/* table bg */}
            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '85%',
                positionType:'absolute'
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
                width: '30%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Spawn", fontSize:sizeFont(25,15), textAlign:'middle-left',color:Color4.White()}}
            />

            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Camera", fontSize:sizeFont(25,15), textAlign:'middle-left',color:Color4.White()}}
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

            uiText={{value:"Remove", fontSize:sizeFont(25,15), textAlign:'middle-center',color:Color4.White()}}
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
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '85%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.White()}}
        >

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlue)).width,
                height: calculateImageDimensions(5,getAspect(uiSizes.buttonPillBlue)).height,
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
            }}
            uiText={{value: "Add Spawn", fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.White()}}
            onMouseDown={()=>{
                displayAddSpawnPointPanel(true)
                displaySceneInfoPanel(false, localPlayer.activeScene)
            }}
            />
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
            onMouseDown={()=>{
                if(visibleIndex - 1 >=0){
                    visibleIndex--
                    refreshVisibleSpawns()
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
            onMouseDown={()=>{
                log('clickding right')
                visibleIndex++
                refreshVisibleSpawns()
            }}
            />

            </UiEntity>

        </UiEntity>

            </UiEntity>

        
        </UiEntity>
    )
}

function generateCreatorRows(){
    let arr:any[] = []
        visibleSpawns.forEach((spawn:any, i:number)=>{
            arr.push(
            <UiEntity
            key={"spawn-point-row-" + i}
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
                display:'flex'
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
                alignContent:'flex-start',
                width: '30%',
                height: '100%',
                display:'flex'
            }}
            uiText={{value: "x:" + spawn.split(",")[0] + ", y:" + spawn.split(",")[1] + ", z:" + spawn.split(",")[2], fontSize:sizeFont(25,15), textAlign:'middle-left', color:Color4.White()}}
            />

            {/* world build counts */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
                height: '100%',
                display:'flex'
            }}
            // uiBackground={{color:Color4.Teal()}}
            uiText={{value: "x:" + visibleCameras[i].split(",")[0] + ", y:" + visibleCameras[i].split(",")[1] + ", z:" + visibleCameras[i].split(",")[2], fontSize:sizeFont(25,15), textAlign:'middle-left', color:Color4.White()}}
            />

            {/* go button */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '10%',
                height: '100%',
                display:'flex'
            }}
            >

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).width,
                height: calculateImageDimensions(1.5,getAspect(uiSizes.trashButton)).height,
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas1.png'
                },
                uvs: getImageAtlasMapping(uiSizes.trashButton)
            }}
            onMouseDown={()=>{
                if(localPlayer.activeScene!.sp.length > 1){
                    sendServerMessage(
                        SERVER_MESSAGE_TYPES.SCENE_DELETE_SPAWN, 
                        {
                            sceneId:localPlayer.activeScene!.id, 
                            index: ((visibleIndex - 1) * 6) + i
                        }
                    )
                    utils.timers.setTimeout(()=>{
                        refreshVisibleSpawns()
                    }, 500)
                }
            }}
            />
            </UiEntity>
                </UiEntity>
                )
        })
    return arr
}
