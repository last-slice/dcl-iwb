import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { statusView } from '../StatusPanel'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../../helpers'
import { uiSizes } from '../../../uiConfig'
import { iwbConfig } from '../../../../components/player/player'
import { showTutorials } from './tutorialsPanel'
import { playSound } from '../../../../components/sounds'
import { SOUND_TYPES } from '../../../../helpers/types'

export let helpView = "main"

export function updateHelpView(view:string){
    helpView = view
}

export function HelpPanelMain() {
    return (
        <UiEntity
            key={"helppanelmain"}
            uiTransform={{
                display: statusView === "Help" && helpView === "main" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
            }}
            >

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlack)).width,
                height: calculateImageDimensions(6,getAspect(uiSizes.buttonPillBlack)).height,
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
                playSound(SOUND_TYPES.SELECT_3)
                showTutorials()
                updateHelpView("tutorials")
            }}
            uiText={{value:"Tutorials", color:Color4.White(), fontSize:sizeFont(30,20)}}
            />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlack)).width,
                height: calculateImageDimensions(6,getAspect(uiSizes.buttonPillBlack)).height,
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
                playSound(SOUND_TYPES.SELECT_3)
                updateHelpView('feedback')
            }}
            uiText={{value:"Feedback", color:Color4.White(), fontSize:sizeFont(30,20)}}
            />

        </UiEntity>
    )
}