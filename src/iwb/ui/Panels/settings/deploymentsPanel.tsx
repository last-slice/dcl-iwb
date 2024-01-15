// import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
// import { Color4 } from '@dcl/sdk/math'
// import { displaySetting, displaySettingsPanel, showSetting } from './settingsIndex'
// import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
// import { uiSizes } from '../../uiConfig'
// import { iwbConfig, localPlayer, localUserId, players } from '../../../components/player/player'
// import { realm, worlds } from '../../../components/scenes'
// import { log } from '../../../helpers/functions'
// import { cRoom } from '../../../components/messaging'
// import { showNotification } from '../notificationUI'
// import { NOTIFICATION_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
// import { newItems } from '../../../components/catalog/items'
// import { statusView } from './StatusPanel'

// export function DeploymentsPanel() {
//     return (
//         <UiEntity
//             key={"deployments"}
//             uiTransform={{
//                 display: statusView === "Deployments" ? 'flex' : 'none',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'flex-start',
//                 width: '100%',
//                 height: '100%',
//             }}
//         // uiBackground={{ color: Color4.Teal() }}
//             >

//                         {/* explore creators table */}
//                         <UiEntity
//             uiTransform={{
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'flex-start',
//                 width: '100%',
//                 height: '90%',
//             }}
//             // uiBackground={{color:Color4.Gray()}}
//             >

//             {/* explore table bg */}
//             <UiEntity
//             uiTransform={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'flex-start',
//                 width: '100%',
//                 height: '85%',
//                 positionType:'absolute'
//             }}
//             uiBackground={{color:Color4.Gray()}}
//             />

//             {/* header row */}
//         <UiEntity
//             uiTransform={{
//                 display: 'flex',
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: '100%',
//                 height: '10%',
//             }}
//             // uiBackground={{color:Color4.Blue()}}
//             uiBackground={{
//                 textureMode: 'stretch',
//                 texture: {
//                     src: 'assets/atlas2.png'
//                 },
//                 uvs: getImageAtlasMapping({
//                     atlasHeight: 1024,
//                     atlasWidth: 1024,
//                     sourceTop: 801,
//                     sourceLeft: 802,
//                     sourceWidth: 223,
//                     sourceHeight: 41
//                 })
//             }}
            
//         >
//             <UiEntity
//             uiTransform={{
//                 display: 'flex',
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: '40%',
//                 height: '100%',
//             }}
//             // uiBackground={{color:Color4.Green()}}
//             uiText={{value:"Creator Name", fontSize:sizeFont(25,15), textAlign:'middle-left',color:Color4.Black()}}
//             />

//             <UiEntity
//             uiTransform={{
//                 display: 'flex',
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: '30%',
//                 height: '100%',
//             }}
//             // uiBackground={{color:Color4.Green()}}
//             uiText={{value:"Last Update", fontSize:sizeFont(25,15), textAlign:'middle-center', color:Color4.Black()}}
//             />

//             <UiEntity
//             uiTransform={{
//                 display: 'flex',
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: '10%',
//                 height: '100%',
//             }}
//             // uiBackground={{color:Color4.Green()}}
//             uiText={{value:"Builds", fontSize:sizeFont(25,15), textAlign:'middle-center',color:Color4.Black()}}
//             />

//             <UiEntity
//             uiTransform={{
//                 display: 'flex',
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: '10%',
//                 height: '100%',
//             }}

//             uiText={{value:"Go", fontSize:sizeFont(25,15), textAlign:'middle-center',color:Color4.Black()}}
//             />

//             <UiEntity
//             uiTransform={{
//                 display: 'flex',
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: '10%',
//                 height: '100%',
//             }}
//             // uiBackground={{color:Color4.Green()}}
//             uiText={{value:"<3", fontSize:sizeFont(25,15), textAlign:'middle-center', color:Color4.Black()}}
//             />



//         </UiEntity>

//             {/* builds row */}
//         <UiEntity
//             uiTransform={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'flex-start',
//                 width: '100%',
//                 height: '80%',
//             }}
//             // uiBackground={{color:Color4.Yellow()}}
//         >

//             {generateRows()}

//         </UiEntity>

//       {/* buttons row */}
//       <UiEntity
//             uiTransform={{
//                 display: 'flex',
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: '100%',
//                 height: '15%',
//             }}
//             // uiBackground={{color:Color4.Black()}}
//         >
//              <UiEntity
//             uiTransform={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'flex-start',
//                 justifyContent: 'center',
//                 width: '85%',
//                 height: '100%',
//             }}
//             // uiBackground={{color:Color4.Black()}}
//         >
//         </UiEntity>


//         <UiEntity
//             uiTransform={{
//                 display: 'flex',
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: '15%',
//                 height: '100%',
//             }}
//             // uiBackground={{color:Color4.White()}}
//         >

//                  <UiEntity
//             uiTransform={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'flex-start',
//                 justifyContent: 'center',
//                 width: calculateSquareImageDimensions(5).width,
//                 height: calculateSquareImageDimensions(4).height,
//             }}
//             uiBackground={{
//                 textureMode: 'stretch',
//                 texture: {
//                     src: 'assets/atlas2.png'
//                 },
//                 uvs: getImageAtlasMapping(uiSizes.blackArrowLeft)
//             }}
//             onMouseDown={()=>{
//                 if(visibleIndex - 1 >=0){
//                     visibleIndex--
//                     refreshVisibleItems()
//                 }
//             }}
//             />

// <UiEntity
//             uiTransform={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'flex-start',
//                 justifyContent: 'center',
//                 width: calculateSquareImageDimensions(5).width,
//                 height: calculateSquareImageDimensions(4).height,
//             }}
//             uiBackground={{
//                 textureMode: 'stretch',
//                 texture: {
//                     src: 'assets/atlas2.png'
//                 },
//                 uvs: getImageAtlasMapping(uiSizes.blackArrowRight)
//             }}
//             onMouseDown={()=>{
//                 log('clickding right')
//                 visibleIndex++
//                 refreshVisibleItems()
//                 // if((visibleIndex + 1) * 6 < worlds.length){
//                     visibleIndex++
//                     refreshVisibleItems()
//                 // }
//             }}
//             />

//             </UiEntity>

//         </UiEntity>

//             </UiEntity>


//         </UiEntity>
//     )
// }


// function generateRows(){
//     let arr:any[] = []
//     if(localUserId){
//         localPlayer.uploads.forEach((world:any, i:number)=>{
//             arr.push(
//             <UiEntity
//             key={"world row - " + world.ens}
//             uiTransform={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: '100%',
//                 height: '15%',
//                 display:'flex'
//             }}
//             uiBackground={{
//                 textureMode: 'stretch',
//                 texture: {
//                     src: 'assets/atlas2.png'
//                 },
//                 uvs: i % 2 === 0 ? getImageAtlasMapping(uiSizes.normalButton)

//                 : //

//                 getImageAtlasMapping(uiSizes.normalLightestButton)
//             }}
//             >

//             {/* scene name */}
//             <UiEntity
//             uiTransform={{
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 alignContent:'flex-start',
//                 width: '40%',
//                 height: '100%',
//                 display:'flex'
//             }}
//             uiText={{value: world.name, fontSize:sizeFont(20,15), textAlign:'middle-left', color:Color4.Black()}}
//             />

//             {/* world last updated */}
//             <UiEntity
//             uiTransform={{
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: '30%',
//                 height: '100%',
//                 display:'flex'
//             }}
//             uiText={{value: "" + Math.floor((Math.floor(Date.now()/1000) - world.updated) / 86400) + " days ago", fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.Black()}}
//             />

//             {/* world build counts */}
//             <UiEntity
//             uiTransform={{
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: '10%',
//                 height: '100%',
//                 display:'flex'
//             }}
//             uiText={{value: "" + world.builds, fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.Black()}}
//             />

//             {/* go button */}
//             <UiEntity
//             uiTransform={{
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: '10%',
//                 height: '100%',
//                 display:'flex'
//             }}
//             >

//             <UiEntity
//             uiTransform={{
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: calculateImageDimensions(2, getAspect(uiSizes.rectangleButton)).width,
//                 height: calculateImageDimensions(10,getAspect(uiSizes.rectangleButton)).height,
//             }}
//             uiBackground={{
//                 textureMode: 'stretch',
//                 texture: {
//                     src: 'assets/atlas2.png'
//                 },
//                 uvs: getImageAtlasMapping(uiSizes.blueButton)
//             }}
//             uiText={{value: "GO", fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.Black()}}
//             onMouseDown={()=>{
//                displaySettingsPanel(false)
//                displayRealmTravelPanel(true, world)
//             }}
//             />
//             </UiEntity>

//             {/* favorite button */}
//             <UiEntity
//         uiTransform={{
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             width: '10%',
//             height: '80%',
//             margin:{right:"1%"},
//         }}
//         uiBackground={{
//             textureMode: 'stretch',
//             texture: {
//                 src: 'assets/atlas2.png'
//             },
//             uvs: getImageAtlasMapping(uiSizes.positiveButton)
//         }}
//         onMouseDown={() => {
//             // pressed.Save = true
//         }}
//         onMouseUp={()=>{
//             // pressed.Save = false
//         }}
//         uiText={{value: "FV", color:Color4.Black(), fontSize:sizeFont(20,15)}}
//         />



//                 </UiEntity>
//                 )
//         })
//     }

//     return arr
// }