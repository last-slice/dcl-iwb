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
import { NOTIFICATION_TYPES, SERVER_MESSAGE_TYPES, SOUND_TYPES } from '../../../helpers/types'
import { newItems } from '../../../components/catalog/items'
import { statusView } from './StatusPanel'
import { playSound } from '../../../components/sounds'

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
            // uiBackground={{color:Color4.Gray()}}
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
                uvs: getImageAtlasMapping(uiSizes.rowPillDark)
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
                margin:{left:'1%'}
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Asset Name", fontSize:sizeFont(25,15), textAlign:'middle-left',color:Color4.White()}}
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
            uiText={{value:"Type", fontSize:sizeFont(25,15), textAlign:'middle-center', color:Color4.White()}}
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
            uiText={{value:"Status", fontSize:sizeFont(25,15), textAlign:'middle-center',color:Color4.White()}}
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
            // uiBackground={{color:Color4.White()}}
        >
             <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                width: '85%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.White()}}
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
                playSound(SOUND_TYPES.SELECT_3)
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
                playSound(SOUND_TYPES.SELECT_3)
                visibleIndex++
                refreshVisibleItems()
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
                uvs: i % 2 === 0 ? getImageAtlasMapping(uiSizes.rowPillLight)

                : 

                getImageAtlasMapping(uiSizes.rowPillLight)
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
                display:'flex',
                margin:{left:'1%'}
            }}
            uiText={{value: asset.name, fontSize:sizeFont(20,15), textAlign:'middle-left', color:Color4.White()}}
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
            uiText={{value: "" + asset.type, fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.White()}}
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
            uiText={{value: "" + asset.status, fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.White()}}
            />

                </UiEntity>
                )
        })
    }

    return arr
}