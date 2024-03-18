import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { statusView } from '../StatusPanel'
import { helpView, updateHelpView } from './helpPanelMain'
import { addLineBreak, calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../../helpers'
import { sendServerMessage } from '../../../../components/messaging'
import { SERVER_MESSAGE_TYPES, SOUND_TYPES } from '../../../../helpers/types'
import { localPlayer, localUserId } from '../../../../components/player/player'
import { uiSizes } from '../../../uiConfig'
import { playSound } from '../../../../components/sounds'

let feedback = ""

export function FeedbackPanel() {
    return (
        <UiEntity
            key={"feedbackpanel"}
            uiTransform={{
                display: statusView === "Help" && helpView === "feedback" || helpView === "feedbacksent" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}
            >

                <UiEntity
            uiTransform={{
                display: statusView === "Help" && helpView === "feedback" ? 'flex' : 'none',
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
                margin:{top:"3%", bottom:'1%'},
            }}
            uiText={{value:"Feedback", fontSize:sizeFont(25,20), color:Color4.White(), textAlign:'middle-center'}}
            />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '50%',
                margin:{top:"3%", bottom:'1%'},
            }}
            >

            <Input
            onChange={(value) => {
                feedback = value
            }}
            fontSize={sizeFont(20,15)}
            color={Color4.White()}
            placeholder={'please type your feedback for our team!'}
            placeholderColor={Color4.White()}
            uiTransform={{
                width: '90%',
                height: '100%',
            }}
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
            onMouseDown={()=>{
                playSound(SOUND_TYPES.SELECT_3)
                sendServerMessage(SERVER_MESSAGE_TYPES.SUBMIT_FEEDBACK, {user:localUserId, name: localPlayer.dclData.name, feedback:feedback})
                feedback = ""
                updateHelpView("feedbacksent")

            }}
            uiText={{value:"Submit", fontSize:sizeFont(25,15), color:Color4.White()}}
            />

                </UiEntity>
                </UiEntity>


                <UiEntity
            uiTransform={{
                display: statusView === "Help" && helpView === "feedbacksent" ? 'flex' : 'none',
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
                width: '100%',
                height: '10%',
                margin:{top:"3%", bottom:'1%'},
            }}
            uiText={{value:"Feedback submitted!", fontSize:sizeFont(25,20), color:Color4.White(), textAlign:'middle-center'}}
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
            onMouseDown={()=>{
                playSound(SOUND_TYPES.SELECT_3)
                updateHelpView("main")
            }}
            uiText={{value:"Close", fontSize:sizeFont(25,15), color:Color4.White()}}
            />

            </UiEntity>


        </UiEntity>
    )
}