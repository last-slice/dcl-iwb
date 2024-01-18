import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { displaySettingsPanel, showSetting } from './settingsIndex'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { displayDeleteBuildPanel } from '../deleteBuildPanel'
import { localUserId, players } from '../../../components/player/player'
import { formatDollarAmount, formatSize, log } from '../../../helpers/functions'
import { sceneBuilds } from '../../../components/scenes'
import { buildInfoTab, displaySceneInfoPanel, displaySceneSetting, scene } from '../builds/buildsIndex'
import { teleportToScene } from '../../../components/modes/play'

let visibleIndex = 0
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
    visibleIndex = 0
    visibleItems.length = 0
    refreshVisibleItems()
}

export function refreshVisibleItems(){
    log('we are here in rewfresh')
    visibleItems.length = 0

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

    // builds.sort((a, b) => a.n.localeCompare(b.n));
    console.log('refresh builds are ', builds)
  
    for(let i = (visibleIndex * 6); i < (visibleIndex * 6) + 6; i++){
      visibleItems.push(builds[i])
      }
  
      let top = (visibleIndex * 6) + 6
      if(top > builds.length){
          for(let i = 0; i < (top - builds.length); i++){
              visibleItems.pop()
          }
      }
  }
export function BuildsPanel() {
    return (
        <UiEntity
            key={"mybuildspanel"}
            uiTransform={{
                display: showSetting === "Builds" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}
        >

            <UiEntity
            uiTransform={{
                display: showSetting === "Builds" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '70%',
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
                width: '30%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Name", fontSize:sizeFont(25,15), textAlign:'middle-left',color:Color4.Black()}}
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
            uiText={{value:"Parcel Count", fontSize:sizeFont(25,15), textAlign:'middle-center', color:Color4.Black()}}
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
            uiText={{value:"Size", fontSize:sizeFont(25,15), textAlign:'middle-center',color:Color4.Black()}}
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
            uiText={{value:"Poly Count", fontSize:sizeFont(25,15), textAlign:'middle-center',color:Color4.Black()}}
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
            uiText={{value:"Visit", fontSize:sizeFont(25,15), textAlign:'middle-center', color:Color4.Black()}}
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
            uvs: selectedRow === i ? getImageAtlasMapping(uiSizes.positiveButton)

            :

            i % 2 === 0 ? getImageAtlasMapping(uiSizes.normalButton)

            : //

            getImageAtlasMapping(uiSizes.normalLightestButton)
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
            display:'flex'
        }}
        uiText={{value: scene.n, fontSize:sizeFont(20,15), textAlign:'middle-left', color:Color4.Black()}}
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
        uiText={{value: "" + scene.pcnt, fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.Black()}}
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
        uiText={{value: "" + formatSize(scene.si) + "MB", fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.Black()}}
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
        uiText={{value: "" + formatDollarAmount(scene.pc), fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.Black()}}
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
        display: visibleItems[i].n === "Realm Lobby" ? 'none' :'flex'
    }}
    uiBackground={{
        textureMode: 'stretch',
        texture: {
            src: 'assets/atlas1.png'
        },
        uvs: getImageAtlasMapping(uiSizes.infoButtonBlack)
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
    uiBackground={{
        textureMode: 'stretch',
        texture: {
            src: 'assets/atlas2.png'
        },
        uvs: getImageAtlasMapping(uiSizes.positiveButton)
    }}
    onMouseDown={() => {
        // pressed.Save = true
        teleportToScene(scene)
    }}
    onMouseUp={()=>{
        // pressed.Save = false
    }}
    uiText={{value: "Go", color:Color4.Black(), fontSize:sizeFont(20,15)}}
    />



            </UiEntity>
            )
    })

    return arr
}