import ReactEcs, {UiEntity} from '@dcl/sdk/react-ecs'
import {Color4} from '@dcl/sdk/math'
import {displaySettingsPanel} from './settingsIndex'
import {calculateSquareImageDimensions, getImageAtlasMapping, sizeFont} from '../../helpers'
import {uiSizes} from '../../uiConfig'
import {localPlayer} from '../../../components/player/player'
import {formatDollarAmount, formatSize, paginateArray} from '../../../helpers/functions'
import {sceneBuilds} from '../../../components/scenes'
import {displaySceneInfoPanel} from '../builds/buildsIndex'
import {teleportToScene} from '../../../components/modes/play'
import {exploreView} from './explorePanel'

let visibleIndex = 1
let visibleItems:any[] = []
let selectedRow:number = -1

function toggleSelectedRow(index:number){
    if(selectedRow !== index){
        selectedRow = index
    }else{
        selectedRow = -1
    }
}

export function showYourBuilds(){
    visibleIndex = 1
    visibleItems.length = 0
    refreshVisibleItems()
}

export function refreshVisibleItems(){
    visibleItems.length = 1

    let builds = [...sceneBuilds.values()]

    builds.sort((a:any, b:any) => {
        // Check if either of the names is "Realm Lobby"
        if (a.name === "Realm Lobby" && b.name !== "Realm Lobby") {
          return -1; // "Realm Lobby" comes first
        } else if (a.name !== "Realm Lobby" && b.name === "Realm Lobby") {
          return 1; // "Realm Lobby" comes first
        } else {
          // Both names are not "Realm Lobby", sort by parcel size (high to low)
          return b.pcnt - a.pcnt;
        }
    })

    visibleItems = paginateArray([...builds], visibleIndex, 6)
  }

export function BuildsPanel() {
    return (
        <UiEntity
            key={"iwbmybuildspanel"}
            uiTransform={{
                display: exploreView === "Current World" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '80%',
            }}
        >

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '70%',
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
                width: '30%',
                height: '100%',
                margin:{left:"1%"}
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
                width: '20%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Parcel Count", fontSize:sizeFont(25,15), textAlign:'middle-center', color:Color4.White()}}
            />

            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
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
                width: '20%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Poly Count", fontSize:sizeFont(25,15), textAlign:'middle-center',color:Color4.White()}}
            />

            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Visit", fontSize:sizeFont(25,15), textAlign:'middle-center', color:Color4.White()}}
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
                height: '60%',
            }}
            // uiBackground={{color:Color4.Yellow()}}
        >


            {generateBuildRows()}



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
                width: calculateSquareImageDimensions(3).width,
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
                if(visibleIndex - 1 > 0){
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
                width: calculateSquareImageDimensions(3).width,
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
                if (sceneBuilds && (visibleIndex + 1 <= Math.floor([...sceneBuilds.values()].length / 6) + 1)){
                    visibleIndex++
                    refreshVisibleItems()
                }
            }}
            />

            </UiEntity>

        </UiEntity>
        
        </UiEntity>
    )
}

function generateBuildRows(){
    let arr:any[] = []
    visibleItems.forEach((scene:any, i:number)=>{
        arr.push(
        <UiEntity
        key={"your-build row - " + scene.id}
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
            uvs: selectedRow === i ? getImageAtlasMapping(uiSizes.rowPillLight)

            :

            i % 2 === 0 ? getImageAtlasMapping(uiSizes.rowPillLight)

            : //

            getImageAtlasMapping(uiSizes.rowPillDark)
        }}
        // onMouseDown={()=>{
        //     toggleSelectedRow(i)
        // }}
        >

        {/* scene name */}
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent:'flex-start',
            width: '30%',
            height: '100%',
            display:'flex',
            margin:{left:'1%'}
        }}
        uiText={{value: scene.n, fontSize:sizeFont(20,15), textAlign:'middle-left', color:Color4.White()}}
        />

        {/* scene parcel count */}
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20%',
            height: '100%',
            display:'flex'
        }}
        uiText={{value: "" + scene.pcnt, fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.White()}}
        />

        {/* scene parcel size */}
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '10%',
            height: '100%',
            display:'flex'
        }}
        uiText={{value: "" + formatSize(scene.si) + "MB", fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.White()}}
        />

        {/* scene poly count */}
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20%',
            height: '100%',
            display:'flex'
        }}
        uiText={{value: "" + formatDollarAmount(scene.pc), fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.White()}}
        />

{/* settings button */}
<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '10%',
        height: '80%',
        margin:{right:"1%"},
    }}
    >
        <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: calculateSquareImageDimensions(3.5).width,
        height: calculateSquareImageDimensions(4).height,
        display: visibleItems[i].n === "Realm Lobby" || (localPlayer && !localPlayer.homeWorld) ? 'none' :'flex'
    }}
    uiBackground={{
        textureMode: 'stretch',
        texture: {
            src: 'assets/atlas1.png'
        },
        uvs: getImageAtlasMapping(uiSizes.infoButtonTrans)
    }}
    onMouseDown={() => {
        displaySettingsPanel(false)
        displaySceneInfoPanel(true, visibleItems[i])
    }}
    />

    </UiEntity>

        {/* go button// */}
        <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '10%',
        height: '80%',
        margin:{right:"1%"},
    }}
    >
         <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateSquareImageDimensions(3).width,
                height: calculateSquareImageDimensions(3).height,
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.goIcon)
            }}
            onMouseDown={()=>{
                teleportToScene(scene)
             }}
            />

    </UiEntity>



            </UiEntity>
            )
    })

    return arr
}