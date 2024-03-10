import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { displaySetting, displaySettingsPanel, showSetting } from './settingsIndex'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { iwbConfig, localPlayer, localUserId, players } from '../../../components/player/player'
import { realm, worlds } from '../../../components/scenes'
import { formatDollarAmount, formatSize, log, paginateArray } from '../../../helpers/functions'
import { cRoom } from '../../../components/messaging'
import { showNotification } from '../notificationUI'
import { NOTIFICATION_TYPES, SERVER_MESSAGE_TYPES, SOUND_TYPES, SceneItem } from '../../../helpers/types'
import { newItems, playerItemsOriginal } from '../../../components/catalog/items'
import { statusView } from './StatusPanel'
import { playSound } from '../../../components/sounds'

let visibleIndex = 0
let visibleItems:any[] = []
let visibleItemsPerPage:number = 5
let total:number = 0

export function showUploads(){
    total = getTotalSize()
    visibleIndex = 0
    visibleItems.length = 0
    refreshVisibleItems()
}

export function refreshVisibleItems(){
    visibleItems = paginateArray([...playerItemsOriginal], visibleIndex + 1, visibleItemsPerPage)
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
                height: '60%',
            }}
            // uiBackground={{color:Color4.Teal()}}
            >

            {/* header row */}
        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '18%',
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
                width: '40%',
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
                width: '15%',
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
                width: '15%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Poly", fontSize:sizeFont(25,15), textAlign:'middle-center',color:Color4.White()}}
            />


<UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Size", fontSize:sizeFont(25,15), textAlign:'middle-center',color:Color4.White()}}
            />


<UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
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
                height: '90%',
            }}
            // uiBackground={{color:Color4.Yellow()}}
        >

            {generateRows()}

        </UiEntity>

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

                    {/* size graph row */}
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

            {/* file size label */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
            // uiBackground={{color:Color4.Gray()}}
            uiText={{value:"Custom Assets Size: " + parseFloat(formatSize(total)) + "MB" , color:Color4.White(), fontSize:sizeFont(25,16)}}
            />

            {/* File count size container */}
                        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '90%',
                height: '90%',
            }}
            uiBackground={{color:Color4.Gray()}}
            >

            {/* File count size container */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: getSizeWidth(),
                height: '100%',
            }}
            uiBackground={{color: getSizeColor()}}
            />

         {/* asset percent size text */}
                         <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                display:'flex',
                positionType:'absolute'
            }}
            uiText={{value: "" + (parseFloat(formatSize(total)) / 50 * 100).toFixed(0) + "%", fontSize:sizeFont(15,15), textAlign:'middle-center', color:Color4.White()}}
            />


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
                height: '18%',
                display:'flex',
                margin:{top:'1%'}
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
                width: '40%',
                height: '100%',
                display:'flex',
                margin:{left:'1%'}
            }}
            uiText={{value: asset.n, fontSize:sizeFont(20,15), textAlign:'middle-left', color:Color4.White()}}
            />

            {/* asset type */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
                height: '100%',
                display:'flex'
            }}
            uiText={{value: "" + asset.ty, fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.White()}}
            />

             {/* asset poly */}
             <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
                height: '100%',
                display:'flex'
            }}
            uiText={{value: "" + formatDollarAmount(asset?.pc), fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.White()}}
            />


             {/* asset size */}
             <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
                height: '100%',
                display:'flex'
            }}
            uiText={{value: "" + (asset?.si / 1024 / 1024).toFixed(2) + "MB", fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.White()}}
            />

                    {/* asset status */}
                        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
                height: '100%',
                display:'flex'
            }}
            uiText={{value: "" + asset.pending ? "Ready" : "Live", fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.White()}}
            />


                </UiEntity>
                )
        })
    }

    return arr
}

function getTotalSize(){
    let total:number = 0
    playerItemsOriginal.forEach((asset:SceneItem)=>{
        total += asset.si
    })
    return total
}

function getSizeWidth():any {
    if(parseFloat(formatSize(total)) > 50){
        return '100%'
    }
    return `${parseFloat(formatSize(total)) / 50 * 100}%`
}

function getSizeColor():any {
    return parseFloat(formatSize(total)) / 50 > 0.75 ? Color4.Red() : Color4.Green()
}

