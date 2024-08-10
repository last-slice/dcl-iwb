import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import resources from '../../helpers/resources'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'
import { setUIClicked } from '../ui'
import { stopTutorialVideo } from '../../components/Player'

let showLiveControl = false

export function displayTutorialVideoButton(value:boolean){
    showLiveControl = value
}

export function createTutorialVideoButton() {
    return (
        <UiEntity
        key={"" + resources.slug + "tutorial::button"}
            uiTransform={{
                display: showLiveControl? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                positionType: 'absolute',
                position: { left: 0, top:0}
            }}
        >

        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(7, getAspect(uiSizes.buttonPillBlack)).width,
                height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
                positionType:'absolute',
                position:{left:'1%', top:"35%"}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            uiText={{textWrap:'nowrap', value: "Stop Video", fontSize: sizeFont(20, 16)}}
            onMouseDown={() => {
                setUIClicked(true)
                displayTutorialVideoButton(false)
                stopTutorialVideo()
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
        />

    </UiEntity>
    )
}
