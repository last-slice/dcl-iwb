import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { localUserId } from '../../../components/player/player'
import { realm, worlds } from '../../../components/scenes'
import { displayRealmTravelPanel } from '../realmTravelPanel'
import { formatSize, log } from '../../../helpers/functions'
import { buildInfoTab, scene } from './buildsIndex'
import { cRoom, sendServerMessage } from '../../../components/messaging'
import { SERVER_MESSAGE_TYPES } from '../../../helpers/types'

let visibleIndex = 0
let visibleItems:any[] = []
let addWallet:string = ""

export function showAllAccess(){
    visibleIndex = 0
    visibleItems.length = 0
    refreshVisibleItems()
}

export function refreshVisibleItems(){
    visibleItems.length = 0

    worlds.sort((a, b) => a.name.localeCompare(b.name));
  
    for(let i = (visibleIndex * 6); i < (worlds.length < 6 ? worlds.length : (visibleIndex * 6) + 6); i++){
      visibleItems.push(worlds[i])
      }
  
      let top = (visibleIndex * 6) + 6
      if(top > visibleItems.length && visibleItems.length === 6){
          for(let i = 0; i < (top - visibleItems.length); i++){
              visibleItems.pop()
          }
      }
  }

export function SizePanel() {
    return (
        <UiEntity
            key={"buildsizepanel"}
            uiTransform={{
                display: buildInfoTab === "Size" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}
        >

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
            // uiBackground={{color:Color4.Gray()}}
            uiText={{value:"Scene Size Limits", color:Color4.Black(), fontSize:sizeFont(30,25)}}
            />

            {/* Poly count size label */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:"5%"}
            }}
            // uiBackground={{color:Color4.Gray()}}
            uiText={{value:"Scene Poly Count", color:Color4.Black(), fontSize:sizeFont(20,16)}}
            />

            {/* Poly count size container */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '90%',
                height: '15%',
            }}
            uiBackground={{color:Color4.Gray()}}
            >

            {/* Poly count size container */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: scene && scene !== null ? (scene.pc / (scene.pcls.length * 10000)) : 0,
                height: '100%',
            }}
            uiBackground={{color:Color4.Green()}}
            />

            </UiEntity>


            {/* file size label */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:"5%"}
            }}
            // uiBackground={{color:Color4.Gray()}}
            uiText={{value:"Scene File Size", color:Color4.Black(), fontSize:sizeFont(20,16)}}
            />

            {/* File count size container */}
                        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '90%',
                height: '15%',
            }}
            uiBackground={{color:Color4.Gray()}}
            >

            {/* File count size container */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: scene && scene !== null ? (parseFloat(formatSize(scene.si)) / (scene.pcnt > 20 ? 300 : scene.pcnt * 15)) : 0,
                height: '100%',
            }}
            uiBackground={{color:Color4.Green()}}
            />

            </UiEntity>




        
        </UiEntity>
    )
}

function InputDisplay(data:any){
    return(             
    <Input
        onChange={(value)=>{
            addWallet = value
        }}
        fontSize={sizeFont(20,13)}
        placeholder={'Enter Wallet'}
        placeholderColor={Color4.White()}
        uiTransform={{
            width: '85%',
            height: '80%',
            margin:{right:"2%"}
        }}
        color={Color4.White()}
        value={addWallet}
        ></Input>)
}

function generateCreatorRows(){
    let arr:any[] = []
    if(localUserId && scene && scene !== null){
        scene.bps.forEach((user:any, i:number)=>{
            arr.push(
            <UiEntity
            key={"world row - " + user}
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

                : //

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
                width: '70%',
                height: '100%',
                display:'flex'
            }}
            uiText={{value: user, fontSize:sizeFont(20,15), textAlign:'middle-left', color:Color4.Black()}}
            />

            {/* world build counts */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
                height: '100%',
                display:'flex'
            }}
            uiText={{value: "", fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.Black()}}
            />

            {/* go button */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
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
            uiText={{value: "Del", fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.Black()}}
            onMouseDown={()=>{
                sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_DELETE_BP, {sceneId:scene!.id, user:user.toLowerCase()})
            }}//
            />
            </UiEntity>
                </UiEntity>
                )
        })
    }

    return arr
}
