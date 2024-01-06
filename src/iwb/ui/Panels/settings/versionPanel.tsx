import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { displaySetting, displaySettingsPanel, showSetting } from './settingsIndex'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { iwbConfig, localUserId, players } from '../../../components/player/player'
import { realm, worlds } from '../../../components/scenes'
import { log } from '../../../helpers/functions'
import { cRoom } from '../../../components/messaging'
import { showNotification } from '../notificationUI'
import { NOTIFICATION_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { newItems } from '../../../components/catalog/items'

export function VersionPanel() {
    return (
        <UiEntity
            key={"versionpanel"}
            uiTransform={{
                display: showSetting === "Version" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}
        // uiBackground={{ color: Color4.Teal() }}
            >
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            margin:{top:'5%', bottom:"1%"}
        }}
    // uiBackground={{ color: Color4.Teal() }}
    uiText={{value:"This World Version: " + (worlds.find((w)=> w.ens === realm) ? worlds.find((w)=> w.ens === realm).v : ""), fontSize:sizeFont(35,25), textAlign:'middle-center', color:Color4.Black()}}
    />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
        }}
    // uiBackground={{ color: Color4.Teal() }}
    uiText={{value:"IWB Version: " + (iwbConfig.v ? iwbConfig.v : ""), fontSize:sizeFont(35,25), textAlign:'middle-center', color:Color4.Black()}}
    />

        {/* updates panel */}
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '40%',
        }}
    // uiBackground={{ color: Color4.Teal() }}
    >
        {generateUpdateRows()}
    </UiEntity>

    <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(8, getAspect(uiSizes.rectangleButton)).width,
            height: calculateImageDimensions(15,getAspect(uiSizes.rectangleButton)).height,
            margin:{top:"1%", bottom:'1%'},
            // display: localUserId && players.get(localUserId)!.worlds.find((w)=> w.ens === realm) ?  (players.get(localUserId)!.worlds.find((w)=> w.ens === realm).v < iwbConfig.v ? 'flex' : 'none') : "none"
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.positiveButton)
        }}
        onMouseDown={() => {
            displaySettingsPanel(false)
            displaySetting("Explore")
            showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Your deployment is processing...please wait for confirmation to refresh", animate:{enabled:true, time:7, return:true}})
            cRoom.send(SERVER_MESSAGE_TYPES.FORCE_DEPLOYMENT, worlds.find((w)=> w.ens === realm))
        }}
        uiText={{value:"Update", color:Color4.Black(), fontSize:sizeFont(30,20)}}
        />

        </UiEntity>
    )
}

//


function generateUpdateRows(){
    let arr:any[] = []
    if(iwbConfig && iwbConfig.updates){
        iwbConfig.updates.forEach((update:string)=>{
            arr.push(
            <UiEntity
            key={'version-update-row' + update}
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '70%',
                height: '10%',
                margin:{top:"1%", bottom:'1%'},
            }}
            uiText={{value:"- " + update, fontSize:sizeFont(20,15), color:Color4.Black(), textAlign:'middle-left'}}
            >
    
            </UiEntity>
            )
        })  

        if(newItems.size > 0){
            arr.push(
                <UiEntity
                key={'version-update-row-new-items'}
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '70%',
                    height: '10%',
                    margin:{top:"1%", bottom:'1%'},
                }}
                uiText={{value:"- New Catalog items - " + newItems.size, fontSize:sizeFont(20,15), color:Color4.Black(), textAlign:'middle-left'}}
                >
        
                </UiEntity>
                )
        }
    }
    return arr
}