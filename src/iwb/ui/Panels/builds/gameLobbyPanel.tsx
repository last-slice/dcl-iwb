import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input } from '@dcl/sdk/react-ecs'
import { buildInfoTab, scene } from './buildsIndex'
import { localPlayer } from '../../../components/player/player'


export function GameLobbyPanel() {
    return (
        <UiEntity
            key={"iwbgamingpanellobby"}
            uiTransform={{
                display:'none',
                // display: localPlayer && localPlayer.activeScene && localPlayer.activeScene.game ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}
            
        >
        
        </UiEntity>
    )
}