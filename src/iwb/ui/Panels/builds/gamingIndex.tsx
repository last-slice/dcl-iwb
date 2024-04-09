import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input } from '@dcl/sdk/react-ecs'
import { buildInfoTab, scene } from './buildsIndex'
import { localPlayer } from '../../../components/player/player'
import { NewGamePanel } from './newGamePanel'
import { GameLobbyPanel } from './gameLobbyPanel'


export function Gaming() {
    return (
        <UiEntity
            key={"iwbgamingpanel"}
            uiTransform={{
                display: buildInfoTab === "Gaming" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}
        >

            <GameLobbyPanel/>
            <NewGamePanel/>
        
        </UiEntity>
    )
}