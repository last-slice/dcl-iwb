import { Color4, Vector3 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position,UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { InputAction, PointerEventType } from '@dcl/sdk/ecs'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from './helpers'
import resources from '../helpers/resources'
import { uiSizes } from './uiConfig'

let showHover = false
export function displayHover(value:boolean){
  showHover = value
}

let contextEvents:any[] = []

export function updateContextEvents(events:any[]){
  contextEvents.length = 0
  contextEvents = events.filter((e)=> e.eventType === PointerEventType.PET_DOWN)
}

export function createCustomContextMenu(){
  return(
    <UiEntity
    key={"iwbcustomcontextmenu"}
    uiTransform={{
      width: calculateImageDimensions(15, getAspect(uiSizes.smallPill)).width,
      height:calculateImageDimensions(15, getAspect(uiSizes.smallPill)).height,
      display: showHover ? 'flex' : 'none',
      justifyContent:'center',
      flexDirection:'column',
      alignContent:'center',
      alignItems:'center',
      positionType:'absolute',
      position:{top:'1%', right:'5%'}
    }}
    uiBackground={{
      texture:{
          src: resources.textures.atlas2
      },
      textureMode: 'stretch',
      uvs:getImageAtlasMapping(uiSizes.smallPill)
    }}
  >

    {/* context row 1 */}
        <UiEntity
    uiTransform={{
      width: '90%',
      height: '20%',
      justifyContent:'center',
      flexDirection:'row',
      margin:{top:"1%", bottom:"1%"},
      display: contextEvents[0] ? "flex" : "none"
    }}
      >

        {/* context event 1 */}
  <UiEntity
    uiTransform={{
      width: '50%',
      height: '100%',
      justifyContent:'center',
      flexDirection:'row',
      display: contextEvents[0] ? "flex" : "none"
    }}
      >

    {/* button click image */}
    <UiEntity
    uiTransform={{
      width: calculateImageDimensions(1.2, getAspect(uiSizes.oneButtonClick)).width,
      height:calculateImageDimensions(1.2, getAspect(uiSizes.oneButtonClick)).height,
      justifyContent:'center',
      flexDirection:'column',
      display: contextEvents[0] ? "flex" : "none"
    }}
    uiBackground={{
      texture:{
          src: resources.textures.atlas2
      },
      textureMode: 'stretch',
      uvs: contextEvents[0] && getButton(contextEvents[0].eventInfo)
    }}
      />

    {/* click text */}
<UiEntity
    uiTransform={{
      width: '50%',
      height: '100%',
      justifyContent:'center',
      flexDirection:'column',
      display: contextEvents[0] ? "flex" : "none"
    }}
        uiText={{value:"" + (contextEvents[0] && getButtonText(contextEvents[0].eventInfo)), fontSize:sizeFont(25,15), color:Color4.White(), textAlign:'middle-left'}}
      />

      </UiEntity>



       {/* context event 2 */}
  <UiEntity
    uiTransform={{
      width: '50%',
      height: '100%',
      justifyContent:'center',
      flexDirection:'row',
      display: contextEvents[1] ? "flex" : "none"
    }}
    >

{/* button click image */}
<UiEntity
    uiTransform={{
      width: calculateImageDimensions(1.2, getAspect(uiSizes.twoButtonClick)).width,
      height:calculateImageDimensions(1.2, getAspect(uiSizes.twoButtonClick)).height,
      justifyContent:'center',
      flexDirection:'column',
      display: contextEvents[1] ? "flex" : "none"
    }}
    uiBackground={{
      texture:{
          src: resources.textures.atlas2
      },
      textureMode: 'stretch',
      uvs: contextEvents[1] && getButton(contextEvents[1].eventInfo)
    }}
      />

    {/* click text */}
<UiEntity
    uiTransform={{
      width: '50%',
      height: '100%',
      justifyContent:'center',
      flexDirection:'column',
      display: contextEvents[1] ? "flex" : "none"
    }}
        uiText={{value:"" + (contextEvents[1] && getButtonText(contextEvents[1].eventInfo)), fontSize:sizeFont(25,15), color:Color4.White(), textAlign:'middle-left'}}
      />
      


    </UiEntity>
      </UiEntity>

         {/* context row 2 */}
         <UiEntity
    uiTransform={{
      width: '90%',
      height: '20%',
      justifyContent:'center',
      flexDirection:'row',
      margin:{top:"1%", bottom:"1%"},
      display: contextEvents[2] ? "flex" : "none"
    }}
      >

        {/* context event 3 */}
  <UiEntity
    uiTransform={{
      width: '50%',
      height: '100%',
      justifyContent:'center',
      flexDirection:'row',
      display: contextEvents[2] ? "flex" : "none"
    }}
      >

    {/* button click image */}
    <UiEntity
    uiTransform={{
      width: calculateImageDimensions(1.2, getAspect(uiSizes.threeButtonClick)).width,
      height:calculateImageDimensions(1.2, getAspect(uiSizes.threeButtonClick)).height,
      justifyContent:'center',
      flexDirection:'column',
      display: contextEvents[2] ? "flex" : "none"
    }}
    uiBackground={{
      texture:{
          src: resources.textures.atlas2
      },
      textureMode: 'stretch',
      uvs: contextEvents[2] && getButton(contextEvents[2].eventInfo)
    }}
      />

    {/* click text */}
<UiEntity
    uiTransform={{
      width: '50%',
      height: '100%',
      justifyContent:'center',
      flexDirection:'column',
      display: contextEvents[2] ? "flex" : "none"
    }}
        uiText={{value:"" + (contextEvents[2] && getButtonText(contextEvents[2].eventInfo)), fontSize:sizeFont(25,15), color:Color4.White(), textAlign:'middle-left'}}
      />

      </UiEntity>





       {/* context event 4 */}
  <UiEntity
    uiTransform={{
      width: '50%',
      height: '100%',
      justifyContent:'center',
      flexDirection:'row',
      display: contextEvents[3] ? "flex" : "none"
    }}
    >

{/* button click image */}
<UiEntity
    uiTransform={{
      width: calculateImageDimensions(1.2, getAspect(uiSizes.fourButtonClick)).width,
      height:calculateImageDimensions(1.2, getAspect(uiSizes.fourButtonClick)).height,
      justifyContent:'center',
      flexDirection:'column',
      display: contextEvents[3] ? "flex" : "none"
    }}
    uiBackground={{
      texture:{
          src: resources.textures.atlas2
      },
      textureMode: 'stretch',
      uvs: contextEvents[3] && getButton(contextEvents[3].eventInfo)
    }}
      />

    {/* click text */}
<UiEntity
    uiTransform={{
      width: '50%',
      height: '100%',
      justifyContent:'center',
      flexDirection:'column',
      display: contextEvents[3] ? "flex" : "none"
    }}
        uiText={{value:"" + (contextEvents[3] && getButtonText(contextEvents[3].eventInfo)), fontSize:sizeFont(25,15), color:Color4.White(), textAlign:'middle-left'}}
      />
      


    </UiEntity>
      </UiEntity>

               {/* context row 3 */}
               <UiEntity
    uiTransform={{
      width: '90%',
      height: '20%',
      alignContent:'flex-start',
      justifyContent:'flex-start',
      flexDirection:'row',
      margin:{top:"1%", bottom:"1%"},
      display: contextEvents[4] ? "flex" : "none"
    }}
      >

        {/* context event 1 */}
  <UiEntity
    uiTransform={{
      width: '50%',
      height: '100%',
      justifyContent:'center',
      flexDirection:'row',
      display: contextEvents[4] ? "flex" : "none"
    }}
      >

    {/* button click image */}
    <UiEntity
    uiTransform={{
      width: calculateImageDimensions(1.2, getAspect(uiSizes.threeButtonClick)).width,
      height:calculateImageDimensions(1.2, getAspect(uiSizes.threeButtonClick)).height,
      justifyContent:'center',
      flexDirection:'column',
      display: contextEvents[4] ? "flex" : "none"
    }}
    uiBackground={{
      texture:{
          src: resources.textures.atlas2
      },
      textureMode: 'stretch',
      uvs: contextEvents[4] && getButton(contextEvents[4].eventInfo)
    }}
      />

    {/* click text */}
<UiEntity
    uiTransform={{
      width: '50%',
      height: '100%',
      justifyContent:'center',
      flexDirection:'column',
      display: contextEvents[4] ? "flex" : "none"
    }}
        uiText={{value:"" + (contextEvents[4] && getButtonText(contextEvents[4].eventInfo)), fontSize:sizeFont(25,15), color:Color4.White(), textAlign:'middle-left'}}
      />

      </UiEntity>





       {/* context event 2 */}
  <UiEntity
    uiTransform={{
      width: '50%',
      height: '100%',
      justifyContent:'center',
      flexDirection:'row',
      display: contextEvents[5] ? "flex" : "none"
    }}
    >

{/* button click image */}
<UiEntity
    uiTransform={{
      width: calculateImageDimensions(1.2, getAspect(uiSizes.fourButtonClick)).width,
      height:calculateImageDimensions(1.2, getAspect(uiSizes.fourButtonClick)).height,
      justifyContent:'center',
      flexDirection:'column',
      display: contextEvents[5] ? "flex" : "none"
    }}
    uiBackground={{
      texture:{
          src: resources.textures.atlas2
      },
      textureMode: 'stretch',
      uvs: contextEvents[5] && getButton(contextEvents[5].eventInfo)
    }}
      />

    {/* click text */}
<UiEntity
    uiTransform={{
      width: '50%',
      height: '100%',
      justifyContent:'center',
      flexDirection:'column',
      display: contextEvents[5] ? "flex" : "none"
    }}
        uiText={{value:"" + (contextEvents[5] && getButtonText(contextEvents[5].eventInfo)), fontSize:sizeFont(25,15), color:Color4.White(), textAlign:'middle-left'}}
      />
      


    </UiEntity>
          </UiEntity>
  </UiEntity>

  )
}

// function generateContextRows(){
//   let arr:any[] = []
//   contextEvents.forEach((event)=>{
//     arr.push(<ContextEventRow data={event}  />)
//   })

//   let count = 0
//   for(let i = 0; i < 4; i++){
//     arr.push(<ContextEventRow rowCount={count}  />)
//     count++
//   }


  // return arr
// }

// function ContextEventRow(data:any){
//   // let event = data.data
//   return(
//     <UiEntity
//     key={"context-row-" + data.rowCount}
//     uiTransform={{
//       width: '70%',
//       height: '20%',
//       justifyContent:'center',
//       flexDirection:'column',
//       margin:{top:"1%", bottom:"1%"},
//       display:
//     }}
//     uiText={{value:"" + getButtonText(event.eventInfo), fontSize:sizeFont(20,15), color:Color4.White(), textAlign:'middle-left'}}
//   />
//   )
// }

// function ContextEventRow(data:any){
//   let event = data.data
//   return(
//     <UiEntity
//     key={"context-row-" + event.eventInfo.button}
//     uiTransform={{
//       width: '70%',
//       height: '20%',
//       justifyContent:'center',
//       flexDirection:'column',
//       margin:{top:"1%", bottom:"1%"}
//     }}
//     uiText={{value:"" + getButtonText(event.eventInfo), fontSize:sizeFont(20,15), color:Color4.White(), textAlign:'middle-left'}}
//   />
//   )
// }//

function getButtonText(eventInfo:any){
  switch(eventInfo.button){
    case InputAction.IA_POINTER:
      return (eventInfo.hoverText ? eventInfo.hoverText : "")

     case InputAction.IA_ACTION_3:
      return (eventInfo.hoverText ? eventInfo.hoverText : "")

     case InputAction.IA_ACTION_4:
      return (eventInfo.hoverText ? eventInfo.hoverText : "")

     case InputAction.IA_ACTION_5:
      return (eventInfo.hoverText ? eventInfo.hoverText : "")

     case InputAction.IA_ACTION_6:
      return (eventInfo.hoverText ? eventInfo.hoverText : "")

      case InputAction.IA_PRIMARY:
      return (eventInfo.hoverText ? eventInfo.hoverText : "")

      case InputAction.IA_SECONDARY:
      return (eventInfo.hoverText ? eventInfo.hoverText : "")
  }
}

function getButton(eventInfo:any){
  switch(eventInfo.button){
    case InputAction.IA_POINTER:
      return getImageAtlasMapping(uiSizes.wButtonClick)

     case InputAction.IA_ACTION_3:
      return getImageAtlasMapping(uiSizes.oneButtonClick)

     case InputAction.IA_ACTION_4:
      return getImageAtlasMapping(uiSizes.twoButtonClick)

     case InputAction.IA_ACTION_5:
      return getImageAtlasMapping(uiSizes.threeButtonClick)

     case InputAction.IA_ACTION_6:
      return getImageAtlasMapping(uiSizes.fourButtonClick)

      case InputAction.IA_PRIMARY:
        return getImageAtlasMapping(uiSizes.eButtonClick)

      case InputAction.IA_SECONDARY:
        return getImageAtlasMapping(uiSizes.fButtonClick)
  }
}