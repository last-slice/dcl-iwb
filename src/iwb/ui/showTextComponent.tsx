import { Color4, Vector3 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position,UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { sizeFont } from './helpers'
import { utils } from '../helpers/libraries'

let showHover = false
let timers:Map<string, any> = new Map()
export let showTexts:any[] = []

export function displayShowText(value:boolean){
  showHover = value
}

export function addShowText(text:any){
    showTexts.push(text)

    if(!showHover){
        displayShowText(true)
    }

    let timer = utils.timers.setTimeout(()=>{
        removeShowText(text.id)
    }, 1000 * text.showTimer)
    timers.set(text.id, timer)
}

export function removeShowText(id:string){
    let timer = timers.get(id)
    if(timer){
        utils.timers.clearTimeout(timer)
    }
    showTexts = showTexts.filter((texts:any)=> texts.id !== id)

    showTexts.length === 0 ? displayShowText(false) : null
}

export function clearShowTexts(){
  showTexts.forEach((text)=>{
    removeShowText(text.id)
  })
}

export function createShowTextComponent(){
  return(
    <UiEntity
    key={"iwbshowtextcomponent"}
    uiTransform={{
      width: '100%',
      height:'100%',
      display: showHover ? 'flex' : 'none',
      justifyContent:'center',
      flexDirection:'column',
      alignContent:'center',
      alignItems:'center',
      positionType:'absolute',
      position:{top:0, right:0}
    }}
  >

{generateShowTexts()}

  </UiEntity>

  )
}

function generateShowTexts(){
    let arr:any[] = []
    let count = 0
    showTexts.forEach((text:any, i:number)=>{
        arr.push(<ShowText data={text} rowCount={count}/>)
        count++
    })
    
    return arr
}

function ShowText(data:any){
    return(<UiEntity
    key={"show-text-id" + data.data.id}
    uiTransform={{
      width: '100%',
      height:'100%',
      display: showHover ? 'flex' : 'none',
      justifyContent:'center',
      flexDirection:'column',
      alignContent:'center',
      alignItems:'center',
      positionType:'absolute',
      position:{top:0, right:0},
      margin: {}//getMargins(data.data.textAlign)
    }}
    uiText={{value:"" + data.data.showText, fontSize:sizeFont(data.data.showSize,data.data.showSize * 0.6), textAlign:data.data.showPos}}
  />
    )
}

function getMargins(align:string){
    switch(align){
        case 'middle-left':
            return {left:'5%'}

        case 'middle-center':
            break;

        default:
            return {}
    }

}