import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { displaySetting, displaySettingsPanel, showSetting } from './settingsIndex'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { iwbConfig, localPlayer, localUserId, players } from '../../../components/player/player'
import { realm, worlds } from '../../../components/scenes'
import { log, paginateArray } from '../../../helpers/functions'
import { cRoom } from '../../../components/messaging'
import { showNotification } from '../notificationUI'
import { NOTIFICATION_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { newItems } from '../../../components/catalog/items'
import { statusView } from './StatusPanel'

let visibleIndex = 0
let visibleItems:any[] = []
let visibleItemsPerPage:number = 7

export function showUploads(){
    visibleIndex = 0
    visibleItems.length = 0
    refreshVisibleItems()
}

export function refreshVisibleItems(){
    visibleItems = paginateArray([...localPlayer.uploads], visibleIndex + 1, visibleItemsPerPage)
}


export function UploadsPanel() {
    return (
        <UiEntity
            key={"uploadspanel"}
            uiTransform={{
                display: statusView === "Uploads" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                margin:{top:"3%"}
            }}
        // uiBackground={{ color: Color4.Teal() }}
            >

                        {/* explore creators table */}
                        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '90%',
            }}
            // uiBackground={{color:Color4.Gray()}}
            >

            {/* asset table bg */}
            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '85%',
                positionType:'absolute'
            }}
            uiBackground={{color:Color4.Gray()}}
            />

            {/* header row */}
        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
            // uiBackground={{color:Color4.Blue()}}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping({
                    atlasHeight: 1024,
                    atlasWidth: 1024,
                    sourceTop: 801,
                    sourceLeft: 802,
                    sourceWidth: 223,
                    sourceHeight: 41
                })
            }}
            
        >
            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Asset Name", fontSize:sizeFont(25,15), textAlign:'middle-left',color:Color4.Black()}}
            />

            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Type", fontSize:sizeFont(25,15), textAlign:'middle-center', color:Color4.Black()}}
            />

            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '10%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Status", fontSize:sizeFont(25,15), textAlign:'middle-center',color:Color4.Black()}}
            />


        </UiEntity>

            {/* assets row */}
        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '80%',
            }}
            // uiBackground={{color:Color4.Yellow()}}
        >

            {generateRows()}

        </UiEntity>

      {/* buttons row */}
      <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
            }}
            // uiBackground={{color:Color4.Black()}}
        >
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

             <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                alignContent:'flex-start',
                justifyContent: 'center',
                width: '62%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Black()}}
            uiText={{value:"Total Pending Assets: " + (localPlayer ? localPlayer.uploads.length : ""), fontSize:sizeFont(20,15), color:Color4.Black()}}
        >
        </UiEntity>


        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.White()}}
        >

                 <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                width: calculateSquareImageDimensions(5).width,
                height: calculateSquareImageDimensions(4).height,
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.blackArrowLeft)
            }}
            onMouseDown={()=>{
                if(visibleIndex - 1 >=0){
                    visibleIndex--
                    refreshVisibleItems()
                }
            }}
            />

<UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                width: calculateSquareImageDimensions(5).width,
                height: calculateSquareImageDimensions(4).height,
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.blackArrowRight)
            }}
            onMouseDown={()=>{
                log('clickding right')
                visibleIndex++
                refreshVisibleItems()
                // if((visibleIndex + 1) * 6 < worlds.length){
                    visibleIndex++
                    refreshVisibleItems()
                // }
            }}
            />

            </UiEntity>

        </UiEntity>

            </UiEntity>


        </UiEntity>
    )
}


function generateRows(){
    let arr:any[] = []
    if(localUserId){
        visibleItems.forEach((asset:any, i:number)=>{
            arr.push(
            <UiEntity
            key={"upload-asset-row-" + i}
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
                display:'flex'
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: i % 2 === 0 ? getImageAtlasMapping(uiSizes.normalLightestButton)

                : 

                getImageAtlasMapping(uiSizes.normalButton)
            }}
            >

            {/* asset name */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent:'flex-start',
                width: '60%',
                height: '100%',
                display:'flex'
            }}
            uiText={{value: asset.name, fontSize:sizeFont(20,15), textAlign:'middle-left', color:Color4.Black()}}
            />

            {/* asset type */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30%',
                height: '100%',
                display:'flex'
            }}
            uiText={{value: "" + asset.type, fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.Black()}}
            />

            {/* asset status */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '10%',
                height: '100%',
                display:'flex'
            }}
            uiText={{value: "" + asset.status, fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.Black()}}
            />

                </UiEntity>
                )
        })
    }

    return arr
}