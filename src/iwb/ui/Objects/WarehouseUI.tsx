import ReactEcs, {UiEntity} from '@dcl/sdk/react-ecs'
import resources from '../../helpers/resources'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import { enteredArea, hideWarehouseDetailsPanel, selectedWarehouseItem, warehouseDetailsPanelPosition } from '../../warehouse/Warehouse'
import { uiSizes } from '../uiConfig'
let show:boolean = false

export function showWarehouseUI(value:boolean){
    show = value
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
        uiText={{value: "Location: " + (enteredArea ? enteredArea : ""), fontSize: sizeFont(35, 20), textAlign: 'middle-center'}}
    />

            </UiEntity>
    )
}