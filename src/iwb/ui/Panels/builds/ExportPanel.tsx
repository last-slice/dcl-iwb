import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { localPlayer, localUserId } from '../../../components/player/player'
import { realm, worlds } from '../../../components/scenes'
import { displayRealmTravelPanel } from '../realmTravelPanel'
import { formatSize, log } from '../../../helpers/functions'
import { buildInfoTab, displaySceneInfoPanel, displaySceneSetting, scene } from './buildsIndex'
import { cRoom, sendServerMessage } from '../../../components/messaging'
import { NOTIFICATION_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { showNotification } from '../notificationUI'
import { ExportGenesisCityPanel, showGenesisCityExportPane } from './ExportGenesisCityPanel'
import { ExportDCLWorldsPanel, showExportWorlds } from './ExportWorldsPanel'
import { ExportConfirmPanel } from './ExportConfirmPanel'

export let exportPanel = "main"

export function updateExportPanelView(view:string){
    exportPanel = view
    log('export panel view is now', exportPanel)
    log('builds panel is', buildInfoTab)
}

export function ExportPanel() {
    return (
        <UiEntity
            key={"buildexportpanel"}
            uiTransform={{
                display: buildInfoTab === "Export" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}
        >


            {/* main export panel */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: exportPanel === "main" ? "flex" : 'none'
            }}
            >

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                alignSelf:'flex-start',
                margin:{bottom:"10%"}
            }}
            // uiBackground={{color:Color4.Gray()}}
            uiText={{value:"Export Options", color:Color4.Black(), fontSize:sizeFont(30,25)}}
            />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(10, getAspect(uiSizes.rectangleButton)).width,
                height: calculateImageDimensions(15,getAspect(uiSizes.rectangleButton)).height,
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.blueButton)
            }}
            uiText={{value: "Download", fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.Black()}}
            onMouseDown={()=>{
                displaySceneInfoPanel(false, null)
                displaySceneSetting("Info")
                showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Your download is pending. Please wait for a popup with the download link.", animate:{enabled:true, return:true, time:10}})
                sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_DOWNLOAD, {sceneId: localPlayer.activeScene!.id})
            }}
            />

            {/* <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(10, getAspect(uiSizes.rectangleButton)).width,
                height: calculateImageDimensions(15,getAspect(uiSizes.rectangleButton)).height,
                margin:{top:"2%"}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.blueButton)
            }}
            uiText={{value: "Genesis City", fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.Black()}}
            onMouseDown={()=>{
                showGenesisCityExportPane()
            }}
            />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(10, getAspect(uiSizes.rectangleButton)).width,
                height: calculateImageDimensions(15,getAspect(uiSizes.rectangleButton)).height,
                margin:{top:"2%"}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.blueButton)
            }}
            uiText={{value: "DCL Worlds", fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.Black()}}
            onMouseDown={()=>{
                showExportWorlds()
            }}
            />
         */}

            </UiEntity>

            <ExportGenesisCityPanel/>
            <ExportDCLWorldsPanel/>
            <ExportConfirmPanel/>

        </UiEntity>
    )
}
