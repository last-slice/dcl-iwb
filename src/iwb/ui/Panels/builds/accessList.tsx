import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { localUserId } from '../../../components/player/player'
import { realm, worlds } from '../../../components/scenes'
import { displayRealmTravelPanel } from '../realmTravelPanel'
import { log } from '../../../helpers/functions'
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

export function AccessList() {
    return (
        <UiEntity
            key={"buildaccesslist"}
            uiTransform={{
                display: buildInfoTab === "Access" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}
        >

            {/* access list table */}
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

            {/* access table bg */}
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
                width: '70%',
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
                width: '15%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Access", fontSize:sizeFont(25,15), textAlign:'middle-center',color:Color4.Black()}}
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

            uiText={{value:"Remove", fontSize:sizeFont(25,15), textAlign:'middle-center',color:Color4.Black()}}
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


            {generateCreatorRows()}



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
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '85%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Black()}}
        >

            {/* {InputDisplay(addWallet)} */}

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
        ></Input>


            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(6, getAspect(uiSizes.rectangleButton)).width,
                height: calculateImageDimensions(10,getAspect(uiSizes.rectangleButton)).height,
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.positiveButton)
            }}
            uiText={{value: "Add", fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.Black()}}
            onMouseDown={()=>{
                log('add wallet is', addWallet)
                if(addWallet.length > 0){
                    cRoom.send(SERVER_MESSAGE_TYPES.SCENE_ADD_BP, {user:addWallet.toLowerCase(), sceneId:scene!.id})
                    addWallet = ""
                }
            }}
            />
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
