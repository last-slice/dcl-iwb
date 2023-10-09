import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { atHQ } from '../../helpers/functions'
import { players, localUserId, setPlayMode } from '../../components/player/player'
import { SCENE_MODES } from '../../helpers/types'
import { dimensions, calculateSquareImageDimensions, getImageAtlasMapping } from '../helpers'
import { uiModes } from '../uiConfig'
export let showModePanel = true

export function displayModePanel(value: boolean) {
    showModePanel = value
}

export function createModePanel() {
    return (
        <UiEntity
            key={"modepanel"}
            uiTransform={{
                display: !atHQ() && showModePanel ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: dimensions.width * .04,
                height: dimensions.height * 0.9,
                positionType: 'absolute',
                position: { right: 0, top: '3%' }
            }}
            // uiBackground={{ color: Color4.Red() }}
        >
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf:'flex-start',
                width: '100%',
                height: '20%',
                // margin:{top:"5%"}
            }}
            // uiBackground={{ color: Color4.Green() }}//
        >
            <UiEntity
            uiTransform={{
                width: calculateSquareImageDimensions(4).width,
                height: calculateSquareImageDimensions(4).height,
                flexDirection:'row',
                margin: { top: '5', bottom: '5'},
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                src: players.has(localUserId) ? uiModes[players.get(localUserId).mode].atlas : ''
                },
                uvs: players.has(localUserId) ? getImageAtlasMapping(uiModes[players.get(localUserId).mode].uvs) : getImageAtlasMapping()
            }}
            onMouseDown={()=>{
                if(players.has(localUserId)){
                   let mode = players.get(localUserId).mode
                   if(mode == 0){
                    setPlayMode(localUserId, SCENE_MODES.BUILD_MODE)
                   }else{
                    setPlayMode(localUserId, SCENE_MODES.PLAYMODE)
                   }
                }
            }}
            />     
        </UiEntity>

        </UiEntity>
    )
}