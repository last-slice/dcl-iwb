import ReactEcs, {UiEntity} from '@dcl/sdk/react-ecs'
import {Color4} from '@dcl/sdk/math'
import {displaySetting, displaySettingsPanel} from './settingsIndex'
import {calculateSquareImageDimensions, getImageAtlasMapping, sizeFont} from '../../helpers'
import {uiSizes} from '../../uiConfig'
import {localUserId, players} from '../../../components/player/player'
import {displayInitalizeWorldPanel} from '../initaliteWorldPanel'
import {paginateArray} from '../../../helpers/functions'
import {displayRealmTravelPanel} from '../realmTravelPanel'
import {playSound} from '../../../components/sounds'
import {SOUND_TYPES} from '../../../helpers/types'
import {exploreView} from './explorePanel'

let visibleIndex = 1
let visibleItems:any[] = []

export function showWorlds(){
    visibleIndex = 1
    visibleItems.length = 0
    refreshVisibleItems()
}

export function refreshVisibleItems(){
    visibleItems.length = 0

    let worlds = [...players.get(localUserId)!.worlds]
    worlds.sort((a, b) => a.name.localeCompare(b.name));

    visibleItems = paginateArray([...worlds], visibleIndex, 6)
    console.log('visibile worlds are ', visibleItems)
  }

export function YourWorlds() {
    return (
        <UiEntity
            key={"iwbyourworldspanel"}
            uiTransform={{
                display: exploreView === "My Worlds" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '80%',
            }}
        >

            {/* explore creators table */}
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

            {/* explore table bg */}
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
                height: '15%',
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
                width: '13%',
                height: '100%',
            }}

            uiText={{value:"Init", fontSize:sizeFont(25,15), textAlign:'middle-center',color:Color4.White()}}
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
            uiText={{value:"Last Update", fontSize:sizeFont(25,15), textAlign:'middle-center', color:Color4.White()}}
            />

           

            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '13%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Builds", fontSize:sizeFont(25,15), textAlign:'middle-center',color:Color4.White()}}
            />

            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '13%',
                height: '100%',
            }}

            uiText={{value:"Go", fontSize:sizeFont(25,15), textAlign:'middle-center',color:Color4.White()}}
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
                playSound(SOUND_TYPES.SELECT_3)
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
                playSound(SOUND_TYPES.SELECT_3)

                if (players.get(localUserId)!.worlds && (visibleIndex + 1 <= Math.floor([...players.get(localUserId)!.worlds].length / 6) + 1)){
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

function generateBuildRows(){
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
            width: '30%',
            height: '100%',
            display:'flex',
            margin:{left:'1%'}
        }}
        uiText={{value: "" + scene.name, fontSize:sizeFont(20,15), textAlign:'middle-left', color:Color4.White()}}
        />

        {/* world init */}
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30%',
            height: '100%',
            display:'flex'
        }}
        uiText={{value: "" + (scene.init ? "Y" : "N"), fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.White()}}
        />


        {/* world last updated */}
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30%',
            height: '100%',
            display:'flex'
        }}
        uiText={{value: "" + (scene.updated > 0 ? Math.floor((Math.floor(Date.now()/1000) - scene.updated) / 86400) + " days ago" : "Never" ), fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.White()}}
        />

            {/* world build counts */}
            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '13%',
            height: '100%',
            display:'flex'
        }}
        uiText={{value: "" + scene.builds, fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.White()}}
        />


        {/* go button */}
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '13%',
            height: '100%',
            display:'flex'
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
                playSound(SOUND_TYPES.SELECT_3)
                if(scene.init){
                    displaySettingsPanel(false)
                    displaySetting("Explore")
                    displayRealmTravelPanel(true, scene)
                }else{
                    displaySettingsPanel(false)
                    displayInitalizeWorldPanel(true, scene)
                }
            }}
            />
                    
        {/* <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(2, getAspect(uiSizes.rectangleButton)).width,
            height: calculateImageDimensions(10,getAspect(uiSizes.rectangleButton)).height,
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.blueButton)
        }}
        uiText={{value: "GO", fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.White()}}
        onMouseDown={()=>{
            if(scene.init){
                displaySettingsPanel(false)
                displaySetting("Explore")
                displayRealmTravelPanel(true, scene)
            }else{
                displaySettingsPanel(false)
                displayInitalizeWorldPanel(true, scene)
            }
        }}//
        /> */}

        </UiEntity>


            </UiEntity>
            )
    })

    return arr
}