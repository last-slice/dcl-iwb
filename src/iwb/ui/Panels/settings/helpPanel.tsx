import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { displaySetting, displaySettingsPanel, showSetting } from './settingsIndex'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { iwbConfig, localUserId, players } from '../../../components/player/player'
import { newItems } from '../../../components/catalog/items'
import { statusView } from './StatusPanel'
import { HelpPanelMain } from './help/helpPanelMain'
import { TutorialsPanel } from './help/tutorialsPanel'
import { FeedbackPanel } from './help/feedbackPanel'

export function HelpPanel() {
    return (
        <UiEntity
            key={"helppanel"}
            uiTransform={{
                display: statusView === "Help" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
            }}
            >

                <HelpPanelMain/>
                <TutorialsPanel/>
                <FeedbackPanel/>

        </UiEntity>
    )
}