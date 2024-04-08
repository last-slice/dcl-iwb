import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { localUserId, players, worldTravel } from '../../../components/player/player'
import { displayInitalizeWorldPanel } from '../initaliteWorldPanel'
import { worlds } from '../../../components/scenes'
import { log, paginateArray } from '../../../helpers/functions'
import { displayRealmTravelPanel } from '../realmTravelPanel'
import { buildInfoTab } from './buildsIndex'
import { exportPanel, updateExportPanelView } from './ExportPanel'
import { showExportConfirmPanel } from './ExportConfirmPanel'

let visibleIndex = 1
let visibleItems:any[] = []

export function showExportWorlds(){
    updateExportPanelView('Worlds')
    visibleIndex = 1
    visibleItems.length = 0
    refreshVisibleItems()
}

export function refreshVisibleItems(){
    log('we are here in rewfresh')
    visibleItems.length = 0

    visibleItems = paginateArray([...players.get(localUserId)!.worlds], visibleIndex, 6)
  }

export function ExportDCLWorldsPanel() {
    return (
        <UiEntity
            key={"dclworldsexportpanel"}
            uiTransform={{
                display: buildInfoTab === "Export" && exportPanel === "Worlds" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}
        >

            {/* table */}
            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '90%',
            }}
            // uiBackground={{color:Color4.Gray()}}
            >

            {/* table bg */}
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
                width: '70%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Name", fontSize:sizeFont(25,15), textAlign:'middle-left',color:Color4.White()}}
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

            uiText={{value:"Deploy", fontSize:sizeFont(25,15), textAlign:'middle-center',color:Color4.White()}}
            />

        </UiEntity>

            {/* builds row */}
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
                if((visibleIndex + 1) * 6 < worlds.length){
                    visibleIndex++
                    refreshVisibleItems()
                }
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
    visibleItems.forEach((scene:any, i:number)=>{
        arr.push(
        <UiEntity
        key={"your world row - " + scene.name}
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

            getImageAtlasMapping(uiSizes.rowPillDark)
        }}
        >

        {/* scene name */}
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent:'flex-start',
            width: '70%',
            height: '100%',
            display:'flex'
        }}
        uiText={{value: "" + scene.name, fontSize:sizeFont(20,15), textAlign:'middle-left', color:Color4.White()}}
        />

        {/* deploy button */}
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30%',
            height: '100%',
            display:'flex'
        }}
        >
                    
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(4, getAspect(uiSizes.buttonPillBlue)).width,
                height: calculateImageDimensions(4,getAspect(uiSizes.buttonPillBlue)).height,
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
        }}
        uiText={{value: "Deploy", fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.White()}}
        onMouseDown={()=>{
            showExportConfirmPanel("Worlds", scene.name + ".dcl.eth")
        }}
        />
        </UiEntity>


            </UiEntity>
            )
    })

    return arr
}