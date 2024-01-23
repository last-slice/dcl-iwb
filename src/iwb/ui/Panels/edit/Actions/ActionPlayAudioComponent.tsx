import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { sizeFont } from '../../../helpers'
import { Color4 } from '@dcl/sdk/math'
import { selectedItem } from '../../../../components/modes/build'
import { localPlayer } from '../../../../components/player/player'
import { log } from '../../../../helpers/functions'
import { items } from '../../../../components/catalog'

export let selectedAudioIndex:number = 0
let audioAssets:any[] = []
export let audioAssetIds:any[] = []

export function ActionPlayAudioComponent(){
    return(
        <UiEntity
        key={"action-play-audio-component"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display:'flex'
        }}
    >
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '15%',
            margin:{bottom:'5%'}
        }}
    uiText={{value:"Select Audio", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
    />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '70%',
        }}
    >

    <Dropdown
        key={"action-play-audio-dropdown"}
        options={selectedItem && selectedItem.enabled ? audioAssets : []}
        selectedIndex={selectedAudioIndex}
        onChange={selectAction}
        uiTransform={{
            width: '100%',
            height: '120%',
        }}
        // uiBackground={{color:Color4.Purple()}}
        color={Color4.White()}
        fontSize={sizeFont(20, 15)}
    />
    </UiEntity>
</UiEntity>
                  
    )
}

function selectAction(index:number){
    selectedAudioIndex = index
}


export function getSceneAudioComponents(){
    audioAssetIds.length = 0
    audioAssets.length = 0
    localPlayer.activeScene?.ass.forEach((asset, i)=>{
        if(asset.audComp){
            audioAssetIds.push(asset.aid)
            audioAssets.push(items.get(asset.id) ? items.get(asset.id)!.n : "")
        }
    })
    log('audio assets are ', audioAssets)
}