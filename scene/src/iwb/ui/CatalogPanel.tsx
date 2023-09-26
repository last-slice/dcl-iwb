import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { dimensions } from './ui'
import { Color4 } from '@dcl/sdk/math'
import { items } from '../components/catalog/index';

export let showCatalogPanel = true

export function displayCatalogPanel(value: boolean) {
    showCatalogPanel = value
}

export let itemSelect = false
export let customSelect = false
export let itemCode = 0
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
                width: dimensions.width * .15,
                height: '100%',
                positionType: 'absolute',
                position: { right: 0, top: 0 }
            }}
            uiBackground={{ color: Color4.Red() }}
        >
            {buttons}
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
      />
        </UiEntity>
    )
}
