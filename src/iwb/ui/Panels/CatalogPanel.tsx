import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { items } from '../../components/catalog'
import { calculateImageDimensions, getImageAtlasMapping } from '../helpers'

export let showCatalogPanel = false

export function displayCatalogPanel(value: boolean) {
    showCatalogPanel = value
}

export let itemSelect = false
export let customSelect = false
export let itemCode = 0
export let objName = ''
let currentPage = 0;
const itemsPerPage = 6;

export function createCatalogPanel() {
    const buttons = [];
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToShow = Array.from(items.entries()).slice(startIndex, endIndex);


    for (const [itemName, itemData] of itemsToShow) {
        buttons.push(
            <Button
                key={itemName}
                uiTransform={{
                    width: 100,
                    height: 50,
                    position: { top: -50, left: 20 },
                    alignSelf: 'flex-start'
                }}
                value={itemName}
                variant='primary'
                fontSize={14}
                uiBackground={{ color: Color4.create(0.063, 0.118, 0.31, .5) }}
                onMouseDown={() => {
                    itemSelect = true
                    customSelect = false
                    itemCode = itemData.code
                    objName = itemName
                }}
            />
        );
    }

    return (
        <UiEntity
            key={"catalogpanel"}
            uiTransform={{
                display: showCatalogPanel ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(25, 345 / 511).width,
                height: calculateImageDimensions(25, 345 / 511).height,
                positionType: 'absolute',
                position: { right: '3%', bottom: '3%' }
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                src: 'assets/atlas1.png',
                },
                uvs:getImageAtlasMapping({
                    atlasHeight:1024,
                    atlasWidth:1024,
                    sourceTop:514,
                    sourceLeft:384,
                    sourceWidth:345,
                    sourceHeight:511
                })
            }}
        >
            {/* {buttons}
            <Button
        uiTransform={{ width: 100, height: 50, position: { top: 50, left: 150 }, alignSelf: 'flex-start' }}
        value='Nxt Page'
        variant='primary'
        fontSize={14}
        uiBackground={{ color: Color4.create(0.063, 0.118, 0.31, .5) }}
        onMouseDown={() => {
         currentPage += 1


        }}
      />
       <Button
        uiTransform={{ width: 100, height: 50, position: { top: 0, left: 0 }, alignSelf: 'flex-start' }}
        value='Back'
        variant='primary'
        fontSize={14}
        uiBackground={{ color: Color4.create(0.063, 0.118, 0.31, .5) }}
        onMouseDown={() => {
         currentPage -= 1
        }}
      /> */}
        </UiEntity>
    )
}
