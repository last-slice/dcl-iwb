import ReactEcs, {UiEntity} from '@dcl/sdk/react-ecs'
import resources from '../../helpers/resources'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import { enteredArea, hideWarehouseDetailsPanel, selectedWarehouseItem, warehouseDetailsPanelPosition, warehouseTriggers } from '../../warehouse/Warehouse'
import { uiSizes } from '../uiConfig'
import { setUIClicked } from '../ui'
import { styles } from '../../components/Catalog'
import { movePlayerTo, teleportTo } from '~system/RestrictedActions'
import { warehouseThemes } from '../../warehouse/config'
import { Transform } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

let show:boolean = false
let showLocations:boolean = false
let locations:any[] = []

export function showWarehouseUI(value:boolean){
    show = value

    if(!value){
        showLocations = false
    }else{
        const seenLabels = new Set<string>();
        let triggers = [...warehouseTriggers.values()].map((trigger:any)=> trigger.sty).filter((theme:any)=>{
            if (seenLabels.has(theme)) {
                return false;
                } else {
                seenLabels.add(theme);
                return true;
                }
        })
        console.log(triggers)
        locations = triggers.sort((a:any, b:any)=> a.localeCompare(b))
    }
}

export function createWarehouseUI() {
    return (
        <UiEntity
            key={resources.slug + "warehosue-ui"}
            uiTransform={{
                display: show ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                positionType:'absolute',
                position:{left:0, top:0}
            }}
        >

    <UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'column',
            width: '15%',
            height: '7%',
            positionType:'absolute',
            position:{left:'15%', top:'1%'}
        }}
        uiBackground={{
              texture:{
                  src: resources.textures.atlas2
              },
              textureMode: 'stretch',
              uvs:getImageAtlasMapping(uiSizes.largeHorizontalPill)
            }}
            onMouseDown={()=>{
                setUIClicked(true)
                showLocations = !showLocations
                setUIClicked(false)
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
        uiText={{value: "Location: " + (enteredArea ? enteredArea : ""), fontSize: sizeFont(35, 20), textAlign: 'middle-center'}}
    />

<UiEntity
        uiTransform={{
            display: showLocations ? 'flex' : "none",
            flexDirection: 'column',
            justifyContent:'flex-start',
            width: '15%',
            height: '70%',
            positionType:'absolute',
            position:{left:'15%', top:'7%'},
        }}
        uiBackground={{
              texture:{
                  src: resources.textures.atlas1
              },
              textureMode: 'stretch',
              uvs:getImageAtlasMapping(uiSizes.vertRectangleOpaque)
            }}
            onMouseDown={()=>{
                setUIClicked(true)
                console.log('mouse entered')
                setUIClicked(false)
            }}
            onMouseUp={()=>{
                setUIClicked(true)
                console.log('mouse leave')
                setUIClicked(false)
            }}
    >
        {
            showLocations &&
            generateRows()
        }

    </UiEntity>

            </UiEntity>
    )
}

function generateRows(){
    let arr:any[] = []
    locations.forEach((style:string, i:number)=>{
        arr.push(
            <UiEntity
            key={resources.slug + "location::dropdown::item" + i}
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                width: '90%',
                height: '4%',
                margin: i !== 0 ? undefined : {top:'5%'}
            }}
            onMouseDown={()=>{
                setUIClicked(true)
                showLocations = !showLocations
                let triggerItems = [...warehouseTriggers.values()].filter((item:any)=> item.sty === style)
                console.log(triggerItems)
                if(triggerItems.length > 0){
                    let parentTransform = Transform.getMutableOrNull(triggerItems[0].parent)
                    let triggerTransform = Transform.getMutableOrNull(triggerItems[0].entity)
                    if(parentTransform && triggerTransform){
                        let position = Vector3.add(parentTransform?.position, triggerTransform?.position)
                        movePlayerTo({newRelativePosition:Vector3.add(position, Vector3.create(0,1,0))})
                    }
                }
                setUIClicked(false)
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
            uiText={{value: "" + style, fontSize: sizeFont(25, 15), textAlign: 'middle-center'}}
        />
        )
    })
    return arr
}