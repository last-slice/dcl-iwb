import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { getImageAtlasMapping, sizeFont, addLineBreak, calculateImageDimensions, getAspect, dimensions } from '../helpers'
import { UI_VIEW_TYPES, uiSizes } from '../uiConfig'
import resources from '../../helpers/resources'
import { generateButtons, setUIClicked } from '../ui'

let show = false
let props:any
let variableText:any
export let customFunction:()=> void | null
export let customFunction2:()=> void | null

export function displaySkinnyVerticalPanel(value:boolean, data?:any, extra?:any, f?: ()=> void, f2?: ()=> void){
    if(value){
        props = data
    }
    show = value
    variableText = extra
    if(f){
        customFunction = f
    }

    if(f2){
        customFunction2 = f2
    }
   
}

export function createSkinnyVerticalPanel(){
    return(
        <UiEntity
        key={"" + resources.slug + "skinny-panel-ui"}
        uiTransform={{
            display: show ? 'flex' : 'none',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(25, getAspect(uiSizes.vertRectangle)).width,
            height: calculateImageDimensions(25,  getAspect(uiSizes.vertRectangle)).height,
            positionType: 'absolute',
            position: { left: (dimensions.width - calculateImageDimensions(25, getAspect(uiSizes.vertRectangle)).width) / 2, top: (dimensions.height - calculateImageDimensions(25,  getAspect(uiSizes.vertRectangle)).height) / 2 }
        }}
    >
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            justifyContent:'flex-start',
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.vertRectangle)
        }}
        onMouseDown={()=>{
            setUIClicked(true)
            setUIClicked(false)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
    >            
        {/* header label */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '90%',
                height: '15%',
                display:'flex',
                margin:{top:'10%', left:'2%', right:'2%'}
            }}
        uiText={{value:"" + (props && props.label), fontSize: sizeFont(45,30), color: Color4.White()}}
        />

                {/* variabl text label */}
                <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                display: variableText !== undefined ? "flex" : "none",
            }}
        uiText={{value:"" + variableText, fontSize: sizeFont(30,25), color: Color4.Red()}}
        />

        {/* text detail */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '25%',
            }}
            uiText={{fontSize:sizeFont(25,20), color:Color4.White(), value: addLineBreak("" + (props && props.text), true, 30)}}
        />

        {generateButtons({slug:"skinny-vertical-view", buttons:props && props.buttons ? props.buttons : []})}
        </UiEntity>
    </UiEntity>
    )
}