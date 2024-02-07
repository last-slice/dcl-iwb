import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { displaySetting, showSetting } from './settingsIndex'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { log } from '../../../helpers/functions'
import { VersionPanel } from './versionPanel'
import { UploadsPanel, showUploads } from './uploadsPanel'
import { localUserId, players } from '../../../components/player/player'

export let statusView = "Version"

export function displayStatusView(view:string){
    statusView = view
}

export function StatusPanel() {
    return (
        <UiEntity
            key={"statuspanel"}
            uiTransform={{
                display: showSetting === "Info" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}
        // uiBackground={{ color: Color4.Teal() }}
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
                width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlue)).width,
                height: calculateImageDimensions(6,getAspect(uiSizes.buttonPillBlue)).height,
                margin:{top:"1%", bottom:'1%'},
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getButtonState("Version")
            }}
            onMouseDown={() => {
                displayStatusView("Version")
            }}
            uiText={{value:"Version", color:Color4.Black(), fontSize:sizeFont(30,20)}}
            />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlue)).width,
            height: calculateImageDimensions(6,getAspect(uiSizes.buttonPillBlue)).height,
                margin:{top:"1%", bottom:'1%', left:'1%'},
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getButtonState("Help")
            }}
            onMouseDown={() => {
                displayStatusView("Help")
            }}
            uiText={{value:"Help", color:Color4.Black(), fontSize:sizeFont(30,20)}}
            />

{/* <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(8, getAspect(uiSizes.rectangleButton)).width,
                height: calculateImageDimensions(15,getAspect(uiSizes.rectangleButton)).height,
                margin:{top:"1%", bottom:'1%', left:'1%'},
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getButtonState("Uploads")
            }}
            onMouseDown={() => {
                displayStatusView("Uploads")
                showUploads()
            }}
            uiText={{value:"Uploads", color:Color4.Black(), fontSize:sizeFont(30,20)}}
            /> */}

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlue)).width,
            height: calculateImageDimensions(6,getAspect(uiSizes.buttonPillBlue)).height,
                margin:{top:"1%", bottom:'1%', left:'1%'},
                display:localUserId && players.get(localUserId) && players.get(localUserId)?.homeWorld ? 'flex' : 'none',
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getButtonState("Uploads")
            }}
            onMouseDown={() => {
                displayStatusView("Uploads")
                showUploads()
            }}
            uiText={{value:"Assets", color:Color4.Black(), fontSize:sizeFont(30,20)}}
            />


            {/* <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(8, getAspect(uiSizes.rectangleButton)).width,
                height: calculateImageDimensions(15,getAspect(uiSizes.rectangleButton)).height,
                margin:{top:"1%", bottom:'1%', left:'1%'},
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getButtonState("Deployments")
            }}
            onMouseDown={() => {
                displayStatusView("Deployments")
            }}
            uiText={{value:"Deployments", color:Color4.Black(), fontSize:sizeFont(30,20)}}
            /> */}

        </UiEntity>

            {/* status data panel */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '90%',
            }}
        // uiBackground={{ color: Color4.Red() }}
        >
            <VersionPanel/>
            <UploadsPanel/>

        </UiEntity>

        </UiEntity>
    )
}

function getButtonState(button:string){
    if(statusView === button){
        return getImageAtlasMapping(uiSizes.buttonPillBlue)
    }else{
        return getImageAtlasMapping(uiSizes.buttonPillBlack)
    }
}