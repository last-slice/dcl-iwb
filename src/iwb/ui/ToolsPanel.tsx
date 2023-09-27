import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { calculateSquareImageDimensions, dimensions, getImageAtlasMapping } from './helpers'
import { displayCatalogPanel, showCatalogPanel } from './CatalogPanel'
import { bottomTools, topTools } from './uiConfig'
import { log } from '../functions'

export let showToolsPanel = true

// export let displayControls:any = {}

export function displayToolsPanel(value: boolean) {
    showToolsPanel = value
}

export function createToolsPanel() {
    return (
        <UiEntity
            key={"toolpanel"}
            uiTransform={{
                display: showToolsPanel ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: dimensions.width * .04,
                height: '90%',
                positionType: 'absolute',
                position: { right: 0, bottom: '3%' }
            }}
            // uiBackground={{ color: Color4.Red() }}
        >
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                alignSelf:'flex-start',
                width: '100%',
                height: '50%',
                margin:{bottom:"5%"}
            }}
            // uiBackground={{ color: Color4.Green() }}
        >
            {createTopToolIcons(topTools)}
        </UiEntity>

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                width: '100%',
                height: '50%',
                margin:{top:"5%"}
            }}
            // uiBackground={{ color: Color4.Blue() }}
        >
            {createBottomToolIcons(bottomTools)}
        </UiEntity>

        </UiEntity>
    )
}

function createTopToolIcons(data:any){
    const arr = []
    if(data.length === 0){
      arr.push(<CreateEmptyRow /> ) 
    }else{
        let count = 0
        for (let i = 0; i < data.length; i++) {
            arr.push(<CreateToolIcon data={data[i]} rowNum={count} /> ) 
            count++
        }
    }
    return arr
}

function createBottomToolIcons(data:any){
    const arr = []
    if(data.length === 0){
      arr.push(<CreateEmptyRow /> ) 
    }else{
        let count = 0
        for (let i = 0; i < data.length; i++) {
            arr.push(<CreateToolIcon data={data[i]} rowNum={count} toggle={true} /> ) 
            count++
        }
    }
    return arr
}

export function CreateEmptyRow(props: {}) {
    return (<UiEntity //cell wrapper
      uiTransform={{
        width: '100%',
        height: '100%',
        display: 'flex',
      }}
    >
      <Label
        value= {'Loading...'}
        fontSize={22}
        color = {Color4.Black()}
        textAlign= {'middle-center'}
        uiTransform={{
          width: `100%`,
          height: '100%',
        }}
      />
    </UiEntity>)
  }

function CreateToolIcon(data:any){
    let config = data.data
    return ( <UiEntity
    key={config.name}//
    uiTransform={{
        display: config.visible ? 'flex' : 'none',
        width: calculateSquareImageDimensions(4).width,
        height: calculateSquareImageDimensions(4).height,
        flexDirection:'row',
        margin: { top: '5', bottom: '5'},
    }}
    uiBackground={{
        textureMode: 'stretch',
        texture: {
        src: config.atlas,
        },
        uvs:getImageAtlasMapping(config.enabled ? config.enabledUV : config.disabledUV)
    }}
    onMouseDown={()=>{
        if(data.toggle){
            log('need to toggle button state')
            config.enabled = !config.enabled
        }

        if(config.fn){
            config.fn()
        }
    }}
    >     
    </UiEntity>  
    )
}