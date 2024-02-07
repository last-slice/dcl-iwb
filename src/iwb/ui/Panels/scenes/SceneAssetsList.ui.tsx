import ReactEcs, {UiEntity} from '@dcl/sdk/react-ecs'
import {Color4} from '@dcl/sdk/math'
import {getImageAtlasMapping, sizeFont} from '../../helpers'
import {uiSizes} from '../../uiConfig'
import {localPlayer} from '../../../components/player/player'
import {formatDollarAmount, formatSize, log} from '../../../helpers/functions'
import {items} from "../../../components/catalog";
import {editItem} from "../../../components/modes/build";
import {EDIT_MODES} from "../../../helpers/types";
import {entitiesFromItemIds} from "../../../components/scenes";
import {deselectRow, localScene, selectRow, selectedRow, showSceneInfoPanel, visibleIndex, visibleItems} from "../sceneInfoPanel";

const SceneAssetList = () => {

    {/* Assets data columns */
    }
    return (
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '80%',
                height: '90%',
            }}
        >

    {/* labels row */}
    <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '7%',
            display: 'flex'
        }}
    >
        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '50%',
                height: '100%',
                margin: {left: "2%"}
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{
                value: "Asset Name",
                fontSize: sizeFont(25, 20),
                textAlign: 'middle-left',
                color: Color4.White()
            }}

        />

        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '30%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{
                value: "Poly Count",
                fontSize: sizeFont(25, 20),
                textAlign: 'middle-center',
                color: Color4.White()
            }}

        />

        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '20%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{
                value: "Size",
                fontSize: sizeFont(25, 20),
                textAlign: 'middle-center',
                color: Color4.White()
            }}
        />

    </UiEntity>

    <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '86%',
            display: 'flex'
        }}
    >

        {generateSceneAssetRows()}
        </UiEntity>

       

    {/* totals row */}
    <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '7%',
            display: 'flex',
            margin:{top:'5%'}
        }}
    >
        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '50%',
                height: '100%',
                margin: {left: "2%"}
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{
                value: "Totals: " + (localScene ? localPlayer.activeScene?.ass.length : ""),
                fontSize: sizeFont(25, 15),
                textAlign: 'middle-left',
                color: Color4.White()
            }}

        />

        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '30%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{
                value: "" + (localScene ? formatDollarAmount(localPlayer.activeScene!.pc)  : ""),
                fontSize: sizeFont(25, 15),
                textAlign: 'middle-center',
                color: Color4.White()
            }}

        />

        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '20%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{
                value: "" + (localScene ? formatSize(localPlayer.activeScene?.si) + "MB" : ""),
                fontSize: sizeFont(25, 15),
                textAlign: 'middle-center',
                color: Color4.White()
            }}
        />

    </UiEntity>

        </UiEntity>
    )
}

export default SceneAssetList

function generateSceneAssetRows() {
    let arr: any[] = []
    if (!showSceneInfoPanel || !localPlayer || !localPlayer.activeScene) return null

    let count = 0
    visibleItems.forEach((asset: any, i: number) => {
        const curItem = items.get(asset.id)
        arr.push(<SceneAssetRow curItem={curItem} aid={asset.aid} rowCount={count}/>)
        count++
    })
    return arr
}

function SceneAssetRow(data:any){
    let curItem = data.curItem
    let i = data.rowCount
    let aid = data.aid
    return(
    <UiEntity
    key={"scene-asset-row- " + i}
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
        display: 'flex',
    }}
    uiBackground={{
        textureMode: 'stretch',
        texture: {
            src: 'assets/atlas2.png'
        },
        uvs:
        
        selectedRow === i ?

        getImageAtlasMapping(uiSizes.rowPillLight)

        :
        
        i % 2 === 1 ? getImageAtlasMapping(uiSizes.rowPillLight)

            : 

            getImageAtlasMapping(uiSizes.rowPillDark)
    }}
    onMouseDown={() => {
        const e = entitiesFromItemIds.get(aid)
        if (e){
            // editItem(e, EDIT_MODES.EDIT)
          
            if(selectedRow === i){
                deselectRow()
            }else{
                selectRow(i)
            }
        }else{
            log('no item to edit', aid)
        }

    }}
>
    <UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            width: '60%',
            height: '100%',
            margin: {left: "2%"}
        }}
        // uiBackground={{color:Color4.Green()}}
        uiText={{
            value: curItem ? curItem.n : "Name not found",
            fontSize: sizeFont(20, 15),
            textAlign: 'middle-left',
            color: Color4.White()
        }}

    />

    <UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            width: '20%',
            height: '100%',
        }}
        // uiBackground={{color:Color4.Green()}}
        uiText={{
            value: curItem?.pc ? formatDollarAmount(curItem?.pc) : "",
            fontSize: sizeFont(20, 15),
            textAlign: "middle-left",
            color: Color4.White()
        }}

    />

    <UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            width: '20%',
            height: '100%',
        }}
        // uiBackground={{color:Color4.Green()}}
        uiText={{
            value: formatSize(curItem?.si) + "MB",
            fontSize: sizeFont(20, 15),
            textAlign: 'middle-left',
            color: Color4.White()
        }}

    />

</UiEntity>
    )
}