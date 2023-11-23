import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { displaySetting, displaySettingsPanel, showSetting } from './settingsIndex'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { localUserId, players, worldTravel } from '../../../components/player/player'
import { displayInitalizeWorldPanel } from '../initaliteWorldPanel'
import { worlds } from '../../../components/scenes'
import { log } from '../../../helpers/functions'
import { displayRealmTravelPanel } from '../realmTravelPanel'

let visibleIndex = 0
let visibleItems:any[] = []

export function showWorlds(){
    visibleIndex = 0
    visibleItems.length = 0
    refreshVisibleItems()
}

export function refreshVisibleItems(){
    log('we are here in rewfresh')
    visibleItems.length = 0

    let worlds = [...players.get(localUserId)!.worlds]
    worlds.sort((a, b) => a.name.localeCompare(b.name));
    log('worlds legnth is', worlds.length)
  
    for(let i = (visibleIndex * 6); i < (visibleIndex * 6) + 6; i++){
      visibleItems.push(worlds[i])
      }
  
      let top = (visibleIndex * 6) + 6
      if(top > worlds.length){
          for(let i = 0; i < (top - worlds.length); i++){
              visibleItems.pop()
          }
      }
  }

export function YourWorlds() {
    return (
        <UiEntity
            key={"yourworldspanel"}
            uiTransform={{
                display: showSetting === "My Worlds" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}//
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
                width: '13%',
                height: '100%',
            }}

            uiText={{value:"Init", fontSize:sizeFont(25,15), textAlign:'middle-center',color:Color4.Black()}}
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
            uiText={{value:"Last Update", fontSize:sizeFont(25,15), textAlign:'middle-center', color:Color4.Black()}}
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
            uiText={{value:"Builds", fontSize:sizeFont(25,15), textAlign:'middle-center',color:Color4.Black()}}
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

            uiText={{value:"Go", fontSize:sizeFont(25,15), textAlign:'middle-center',color:Color4.Black()}}
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
            // uiBackground={{color:Color4.Black()}}
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
            // uiBackground={{color:Color4.Black()}}
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
            uvs: i % 2 === 0 ? getImageAtlasMapping(uiSizes.normalButton)

            : 

            getImageAtlasMapping(uiSizes.normalLightestButton)
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
            display:'flex'
        }}
        uiText={{value: "" + scene.name, fontSize:sizeFont(20,15), textAlign:'middle-left', color:Color4.Black()}}
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
        uiText={{value: "" + (scene.init ? "Y" : "N"), fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.Black()}}
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
        uiText={{value: "" + (scene.updated > 0 ? Math.floor((Math.floor(Date.now()/1000) - scene.updated) / 86400) + " days ago" : "Never" ), fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.Black()}}
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
        uiText={{value: "" + scene.builds, fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.Black()}}
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
        uiText={{value: "GO", fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.Black()}}
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
        />
        </UiEntity>


            </UiEntity>
            )
    })

    return arr
}