import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { localUserId, players, worldTravel } from '../../../components/player/player'
import { displayInitalizeWorldPanel } from '../initaliteWorldPanel'
import { worlds } from '../../../components/scenes'
import { log, paginateArray } from '../../../helpers/functions'
import { displayRealmTravelPanel } from '../realmTravelPanel'
import { buildInfoTab, scene } from './buildsIndex'
import { exportPanel, updateExportPanelView } from './ExportPanel'
import { sendServerMessage } from '../../../components/messaging'
import { SERVER_MESSAGE_TYPES } from '../../../helpers/types'

let type = "Worlds"
let deployData:any

export function showExportConfirmPanel(t:string, data:any){
    updateExportPanelView('Confirm')
    type = t
    deployData = data
}

export function ExportConfirmPanel() {
    return (
        <UiEntity
            key={"dclworldsexportconfirmpanel"}
            uiTransform={{
                display: buildInfoTab === "Export" && exportPanel === "Confirm" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}
        >

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                alignSelf:'center'
            }}
            // uiBackground={{color:Color4.Gray()}}
            uiText={{value:"Exporting to: " + (type === "Worlds" ? "Decentraland Worlds" : "Genesis City"), color:Color4.White(), fontSize:sizeFont(30,25)}}
            />

                    <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                alignSelf:'flex-start'
            }}
            // uiBackground={{color:Color4.Gray()}}
            uiText={{value:"" + (type === "Worlds" ? deployData : ""), color:Color4.White(), fontSize:sizeFont(30,25)}}
            />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlue)).width,
                height: calculateImageDimensions(6,getAspect(uiSizes.buttonPillBlue)).height,
                margin:{top:"5%"}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
            }}
            uiText={{value: "Confirm", fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.White()}}
            onMouseDown={()=>{
                sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_DEPLOY,{
                    sceneId:scene?.id,
                    dest: type === "Worlds" ? 'worlds' : 'gc',
                    name:"" + scene?.n,
                    worldName: type === "Worlds" ? deployData : null,
                    tokenId: "",
                    parcel: type === "Worlds" ? null : ""
                })
            }}
            />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlue)).width,
                height: calculateImageDimensions(6,getAspect(uiSizes.buttonPillBlue)).height,
                margin:{top:"2%"}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
            }}
            uiText={{value: "Cancel", fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.White()}}
            onMouseDown={()=>{
                updateExportPanelView("main")
            }}
            />

        </UiEntity>
    )
}