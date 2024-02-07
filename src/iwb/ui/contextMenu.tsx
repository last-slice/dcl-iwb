import { Color4, Vector3 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position,UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { InputAction, PointerEventType } from '@dcl/sdk/ecs'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from './helpers'
import resources from '../helpers/resources'
import { uiSizes } from './uiConfig'

let showHover = true
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
      width: calculateImageDimensions(13, getAspect(uiSizes.smallPill)).width,
      height:calculateImageDimensions(13, getAspect(uiSizes.smallPill)).height,
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
      width: '70%',
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
      width: '70%',
      height: '20%',
      justifyContent:'center',
      flexDirection:'row',
      display: contextEvents[0] ? "flex" : "none"
    }}
      />
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
// }

function getButtonText(eventInfo:any){
  switch(eventInfo.button){
    case InputAction.IA_POINTER:
      return "Click to " + (eventInfo.hoverText ? eventInfo.hoverText : "")

     case InputAction.IA_ACTION_3:
      return "#1 to " + (eventInfo.hoverText ? eventInfo.hoverText : "")

     case InputAction.IA_ACTION_4:
      return "#2 to " + (eventInfo.hoverText ? eventInfo.hoverText : "")

     case InputAction.IA_ACTION_5:
      return "#3 to " + (eventInfo.hoverText ? eventInfo.hoverText : "")

     case InputAction.IA_ACTION_6:
      return "#4 to "  + (eventInfo.hoverText ? eventInfo.hoverText : "")

      case InputAction.IA_PRIMARY:
      return "#E to "  + (eventInfo.hoverText ? eventInfo.hoverText : "")

      case InputAction.IA_SECONDARY:
      return "#F to "  + (eventInfo.hoverText ? eventInfo.hoverText : "")
  }
}