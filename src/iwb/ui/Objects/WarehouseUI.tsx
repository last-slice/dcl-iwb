import ReactEcs, {UiEntity} from '@dcl/sdk/react-ecs'
import resources from '../../helpers/resources'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import { enteredArea, hideWarehouseDetailsPanel, selectedWarehouseItem, warehouseDetailsPanelPosition } from '../../warehouse/Warehouse'
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
            width: '100%',
            height: '10%',
            positionType:'absolute',
            position:{left:'15%', top:'0%'}
        }}
        uiText={{value: "Location: " + (enteredArea ? enteredArea : ""), fontSize: sizeFont(20, 20), textAlign: 'middle-left'}}
    />

            </UiEntity>
    )
}