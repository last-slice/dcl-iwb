// import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
// import {Color4} from '@dcl/sdk/math'
// import {calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont} from '../../helpers'
// import resources from '../../../helpers/resources'
// import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
// import { playAudioFile, stopAudioFile } from '../../../components/Sounds'
// import { COMPONENT_TYPES, EDIT_MODES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
// import { selectedItem } from '../../../modes/Build'
// import { uiSizes } from '../../uiConfig'
// import { visibleComponent } from '../EditAssetPanel'

// let url = ""
// let audioComponent:any = {}

// export function updateAudioComponent(audio:any){
//     audioComponent = audio
// }//

// export function EditAudio() {
//     return (
//         <UiEntity
//             key={resources.slug + "editaudiocomponentpanel"}
//             uiTransform={{
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'flex-start',
//                 width: '100%',
//                 height: '100%',
//                 display: visibleComponent === COMPONENT_TYPES.AUDIO_SOURCE_COMPONENT || visibleComponent === COMPONENT_TYPES.AUDIO_STREAM_COMPONENT ? 'flex' : 'none',
//             }}
//         >

//      {/* attach player row */}
//         <UiEntity
//             uiTransform={{
//                 flexDirection: 'row',
//                 justifyContent: 'center',
//                 width: '100%',
//                 height: '15%',
//                 margin:{top:"1%"}
//             }}
//         >

//                     {/* attach audio to player toggle */}
//         <UiEntity
//             uiTransform={{
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: '15%',
//                 height: '100%',
//             }}
//         uiText={{textWrap:'nowrap', value:"Attach to Player", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
//         />

//             <UiEntity
//             uiTransform={{
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: '85%',
//                 height: '100%',
//             }}
//         >

// <UiEntity
//         uiTransform={{
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             width: calculateSquareImageDimensions(4).width,
//             height: calculateSquareImageDimensions(4).height,
//             margin:{top:"1%", bottom:'1%'},
//         }}
//         uiBackground={{
//             textureMode: 'stretch',
//             texture: {
//                 src: 'assets/atlas2.png'
//             },
//             uvs: selectedItem && selectedItem.enabled && selectedItem.mode === EDIT_MODES.EDIT  ? 
//                 (hasAudio() ? 
//                     getImageAtlasMapping(uiSizes.toggleOnTrans) : 
//                     getImageAtlasMapping(uiSizes.toggleOffTrans)) : 
//                 getImageAtlasMapping(uiSizes.toggleOnTrans)
//         }}
//         onMouseDown={() => {
//             sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, {
//                 component: visibleComponent,
//                 aid: selectedItem.aid, sceneId: selectedItem.sceneId,
//                 attach: !audioComponent.attach
//             })
//         }}
//         />


//         </UiEntity>


//         </UiEntity>

//         {/* loop setting */}
//         <UiEntity
//             uiTransform={{
//                 flexDirection: 'row',
//                 justifyContent: 'center',
//                 width: '100%',
//                 height: '10%',
//                 margin:{top:"1%"}
//             }}
//         >
//                     <UiEntity
//             uiTransform={{
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: '70%',
//                 height: '100%',
//             }}
//         uiText={{value:"Loop", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
//         />


//             <UiEntity
//             uiTransform={{
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: '30%',
//                 height: '100%',
//             }}
//         >

//                         <Dropdown
//                     options={['True', 'False']}
//                     selectedIndex={getLoop()}
//                     onChange={selectLoop}
//                     uiTransform={{
//                         width: '100%',
//                         height: '120%',
//                     }}
//                     // uiBackground={{color:Color4.Purple()}}
//                     color={Color4.White()}
//                     fontSize={sizeFont(20, 15)}
//                 />

//         </UiEntity>

//             </UiEntity>

//             {/* autostart setting */}
//             <UiEntity
//             uiTransform={{
//                 flexDirection: 'row',
//                 justifyContent: 'center',//
//                 width: '100%',
//                 height: '10%',
//                 margin:{top:"1%"},
//                 display:'none'
//             }}
//         >
//                     <UiEntity
//             uiTransform={{
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: '70%',
//                 height: '100%',
//             }}
//         uiText={{value:"Autostart", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
//         />


//             <UiEntity
//             uiTransform={{
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: '30%',
//                 height: '100%',
//             }}
//         >

//                         <Dropdown
//                     options={['True', 'False']}
//                     selectedIndex={getAutostart()}
//                     onChange={selectStart}
//                     uiTransform={{
//                         width: '100%',
//                         height: '120%',
//                     }}
//                     // uiBackground={{color:Color4.Purple()}}
//                     color={Color4.White()}
//                     fontSize={sizeFont(20, 15)}
//                 />

//         </UiEntity>

//             </UiEntity>

//     {/* volume setting */}
//     <UiEntity
//                 uiTransform={{
//                     flexDirection: 'row',
//                     justifyContent: 'center',
//                     width: '100%',
//                     height: '10%',
//                     margin: {top: "1%"}
//                 }}
//             >
//                 <UiEntity
//                     uiTransform={{
//                         flexDirection: 'column',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         width: '70%',
//                         height: '100%',
//                     }}
//                     uiText={{
//                         value: "Volume",
//                         fontSize: sizeFont(25, 15),
//                         color: Color4.White(),
//                         textAlign: 'middle-left'
//                     }}
//                 />


//                 <UiEntity
//                     uiTransform={{
//                         flexDirection: 'column',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         width: '30%',
//                         height: '100%',
//                     }}
//                 >

//                     <Input
//                         uiTransform={{
//                             width: '100%',
//                             height: '120%',
//                         }}
//                         // uiBackground={{color:Color4.Purple()}}//
//                         placeholderColor={Color4.White()}
//                         placeholder={"" + getVolume()}
//                         color={Color4.White()}
//                         fontSize={sizeFont(20, 15)}
//                         textAlign='middle-center'
//                         onChange={(input) => {
//                             updateVolume("volume", parseFloat(input))
//                         }}
//                         onSubmit={(input) => {
//                             updateVolume("volume", parseFloat(input))
//                         }}
//                         value={"" + getVolume()}

//                     />

//                 </UiEntity>

//             </UiEntity>



//                 {/* `url row` */}
//                 <UiEntity
//                 uiTransform={{
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     width: '100%',
//                     height: '20%',
//                     margin: {top: "2%"},
//                     display: selectedItem && selectedItem.itemData && selectedItem.itemData.id === "e6991f31-4b1e-4c17-82c2-2e484f53a124" ? 'flex' : 'none'
//                 }}
//             >

//             {/* url label */}
//             <UiEntity
//                 uiTransform={{
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     width: '100%',
//                     height: '20%',
//                 }}
//                 uiText={{value: "URL: ", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
//             />



//             {/* url input info */}
//             <UiEntity
//                 uiTransform={{
//                     flexDirection: 'row',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     width: '100%',
//                     height: '30%',
//                     margin: {top: "5%", bottom:'5%'},
//                 }}
//             >

//                 <Input
//                     onChange={(input) => {
//                         url = input
//                     }}
//                     color={Color4.White()}
//                     fontSize={sizeFont(25, 15)}
//                     placeholder={"" + (visibleComponent === COMPONENT_TYPES.AUDIO_SOURCE_COMPONENT || visibleComponent === COMPONENT_TYPES.AUDIO_STREAM_COMPONENT ? getAudioUrl() : "")}
//                     placeholderColor={Color4.White()}
//                     uiTransform={{
//                         width: '100%',
//                         height: '120%',
//                     }}
//                 ></Input>

//                 <UiEntity
//                     uiTransform={{
//                         flexDirection: 'row',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
//                         height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
//                     }}
//                     uiBackground={{
//                         textureMode: 'stretch',
//                         texture: {
//                             src: 'assets/atlas2.png'
//                         },
//                         uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
//                     }}
//                     uiText={{
//                         value: "Save",
//                         fontSize: sizeFont(25, 15),
//                         color: Color4.White(),
//                         textAlign: 'middle-center'
//                     }}
//                     onMouseDown={() => {
//                         updateAudio("url", url)//
//                     }}
//                 />
//             </UiEntity>

//             </UiEntity>

//                     {/* play button row */}
//             <UiEntity
//             uiTransform={{
//                 flexDirection: 'row',
//                 justifyContent: 'center',
//                 alignContent:'flex-start',
//                 alignItems:'flex-start',
//                 width: '100%',
//                 height: '10%',
//                 margin:{top:"1%"}
//             }}
//             >

//              <UiEntity
//                 uiTransform={{
//                     flexDirection: 'row',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
//                 height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
//                     margin: {left: "1%", right: "1%"}
//                 }}
//                 uiBackground={{
//                     textureMode: 'stretch',
//                     texture: {
//                         src: 'assets/atlas2.png'
//                     },
//                     uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
//                 }}
//                 uiText={{value: "Play", fontSize: sizeFont(20, 16)}}
//                 onMouseDown={() => {
//                     playAudioFile()
//                 }}
//             />

// <UiEntity
//                 uiTransform={{
//                     flexDirection: 'row',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
//                 height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
//                     margin: {left: "1%", right: "1%"}
//                 }}
//                 uiBackground={{
//                     textureMode: 'stretch',
//                     texture: {
//                         src: 'assets/atlas2.png'
//                     },
//                     uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
//                 }}
//                 uiText={{value: "Stop", fontSize: sizeFont(20, 16)}}
//                 onMouseDown={() => {
//                     stopAudioFile()
//                 }}
//             />

//             </UiEntity>

//         </UiEntity>
//     )
// }

// function hasAudio(){
//     let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
//     if(scene && visibleComponent === COMPONENT_TYPES.AUDIO_SOURCE_COMPONENT || visibleComponent === COMPONENT_TYPES.AUDIO_STREAM_COMPONENT){
//         let itemInfo = scene[visibleComponent].get(selectedItem.aid)
//         if(itemInfo){
//             return itemInfo.attach
//         }
//         return false
//     }
//     return false
// }

// function getAudioUrl() {
//     if(selectedItem && selectedItem.enabled){
//         let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
//         if(scene && visibleComponent === COMPONENT_TYPES.AUDIO_SOURCE_COMPONENT || visibleComponent === COMPONENT_TYPES.AUDIO_STREAM_COMPONENT){
//             let itemInfo = scene[visibleComponent].get(selectedItem.aid)
//             if(itemInfo){
//                 return itemInfo.url
//             }
//             return ""
//         }
//         return ""
//     }
//     return ""
// }

// function getLoop(){
//     if(selectedItem && selectedItem.enabled){
//         let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
//         if(scene && visibleComponent === COMPONENT_TYPES.AUDIO_SOURCE_COMPONENT || visibleComponent === COMPONENT_TYPES.AUDIO_STREAM_COMPONENT){
//             let itemInfo = scene[visibleComponent].get(selectedItem.aid)
//             if(itemInfo){
//                 return itemInfo.loop ? 0 : 1
//             }
//             return 0
//         }
//         return 0
//     }
//     return 0
// }

// function selectLoop(index:number){
//     if(index !== getLoop()){
//         updateAudio("loop", index === 0 ? true : false)
//     }    
// }

// function getAutostart(){
//     if(selectedItem && selectedItem.enabled){
//         let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
//         if(scene && visibleComponent === COMPONENT_TYPES.AUDIO_SOURCE_COMPONENT || visibleComponent === COMPONENT_TYPES.AUDIO_STREAM_COMPONENT){
//             let itemInfo = scene[visibleComponent].get(selectedItem.aid)
//             if(itemInfo){
//                 return itemInfo.autostart ? 0 : 1
//             }
//             return 0
//         }
//         return 0
//     }
//     return 0
// }

// function selectStart(index:number){
//     if(index !== getAutostart()){
//         updateAudio("autostart", index === 0 ? true : false)
//     }
// }

// function updateAudio(type:string, value:any){
//     sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
//         {
//             component:visibleComponent, 
//             aid:selectedItem.aid, 
//             sceneId:selectedItem.sceneId,
//             [type]:value
//         }
//     )
// }

// function getVolume(){
//     if(selectedItem && selectedItem.enabled){
//         let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
//         if(scene && visibleComponent === COMPONENT_TYPES.AUDIO_SOURCE_COMPONENT || visibleComponent === COMPONENT_TYPES.AUDIO_STREAM_COMPONENT){
//             let itemInfo = scene[visibleComponent].get(selectedItem.aid)
//             if(itemInfo){
//                 return itemInfo.volume
//             }
//             return 1
//         }
//         return 1
//     }
//     return 1
// }

// function updateVolume(type:string, value:any){
//     sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET,
//         {
//             component:visibleComponent,
//             aid:selectedItem.aid,
//             sceneId:selectedItem.sceneId,
//             [type]:value
//         }
//     )
// }