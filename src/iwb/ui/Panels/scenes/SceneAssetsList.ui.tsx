import ReactEcs, {UiEntity} from '@dcl/sdk/react-ecs'
import {Color4} from '@dcl/sdk/math'
import {calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont} from '../../helpers'
import {uiSizes} from '../../uiConfig'
import {localPlayer} from '../../../components/player/player'
import {formatDollarAmount, formatSize, log, paginateArray} from '../../../helpers/functions'
import {items} from "../../../components/catalog";
import {editItem, selectedItem, sendServerDelete} from "../../../components/modes/build";
import {COMPONENT_TYPES, EDIT_MODES, SERVER_MESSAGE_TYPES} from "../../../helpers/types";
import {entitiesFromItemIds, sceneBuilds} from "../../../components/scenes";
import {deselectRow, localScene, sceneInfoEntitySelector, selectRow, selectedEntity, selectedRow, showSceneInfoPanel, updateRows, updateVisibleIndex, visibleIndex, visibleItems} from "../sceneInfoPanel";
import { sendServerMessage } from '../../../components/messaging'
import { Entity, VisibilityComponent } from '@dcl/sdk/ecs'

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
                width: '40%',
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
                width: '15%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{
                value: "Polys",
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
                width: '15%',
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


        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '15%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{
                value: "View",
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
                width: '15%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{
                value: "Lock",
                fontSize: sizeFont(25, 20),
                textAlign: 'middle-center',
                color: Color4.White()
            }}
        />
{/* 
        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '10%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{
                value: "Del",
                fontSize: sizeFont(25, 20),
                textAlign: 'middle-center',
                color: Color4.White()
            }}
        /> */}

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
            alignItems: 'flex-start',
            alignContent:'flex-start',
            justifyContent: 'flex-start',
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
                width: '40%',
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
                width: '15%',
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
                width: '15%',
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


            {/* paginate buttons column */}
            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'center',
                width: '30%',
                height: '100%',
            }}
            >

                                {/* scroll up button */}
                                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(2, getAspect(uiSizes.leftArrowBlack)).width,
                        height: calculateImageDimensions(2, getAspect(uiSizes.leftArrowBlack)).height,
                        margin: {left: "5%"},
                    }}
                    // uiBackground={{color:Color4.White()}}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.leftArrowBlack)
                    }}
                    onMouseDown={() => {
                        if(visibleIndex -1 >= 1){
                            deselectRow()
                            updateVisibleIndex(-1)
                            updateRows()
                        }
                    }}
                />

                {/* scroll down button */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(2, getAspect(uiSizes.rightArrowBlack)).width,
                        height: calculateImageDimensions(2, getAspect(uiSizes.rightArrowBlack)).height,
                        margin: {right: "1%"},
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.rightArrowBlack)
                    }}
                    onMouseDown={() => {
                        // pressed.Load = true
                        deselectRow()
                        updateVisibleIndex(1)
                        updateRows()
                    }}
                />


            </UiEntity>

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
        margin:{top:"1%", bottom:"1%"}
    }}
    uiBackground={{
        textureMode: 'stretch',
        texture: {
            src: 'assets/atlas2.png'
        },
        uvs:
        
        selectedRow === i ?

        getImageAtlasMapping(uiSizes.rowPillLightest)

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
                //change the background color
            }else{
                selectRow(i, true)
                //change the background color
                VisibilityComponent.getMutable(sceneInfoEntitySelector).visible = true
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
            width: '50%',
            height: '100%',
            margin: {left: "2%"}
        }}
        // uiBackground={{color:Color4.Green()}}
        uiText={{
            value: curItem ? curItem.n.length > 25 ?  curItem.n.substring(0,25) + "..." : curItem.n : "Name not found",
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
            width: '15%',
            height: '100%',
        }}
        // uiBackground={{color:Color4.Green()}}
        uiText={{
            value: curItem?.pc ? formatDollarAmount(curItem?.pc) : "0",
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
            width: '15%',
            height: '100%',
        }}
        // uiBackground={{color:Color4.Green()}}
        uiText={{
            value: curItem?.si ? formatSize(curItem?.si) + "MB" : "",
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
            width: '15%',
            height: '100%',
        }}
    >
                <UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            width: calculateSquareImageDimensions(3.5).width,
            height: calculateSquareImageDimensions(3.5).height,
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas1.png'
            },
            uvs: getVis(aid)
        }}
        onMouseDown={()=>{
            sendServerMessage(SERVER_MESSAGE_TYPES.UPDATE_ITEM_COMPONENT, {component:SERVER_MESSAGE_TYPES.UPDATE_ASSET_BUILD_VIS, action:"toggle", data:{aid:aid, sceneId:localPlayer.activeScene!.id}})
        }}
    />

    </UiEntity>

    <UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            width: '15%',
            height: '100%',
        }}
    >
                <UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            width: calculateSquareImageDimensions(3.5).width,
            height: calculateSquareImageDimensions(3.5).height,
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getLocked(aid)
        }}
        onMouseDown={()=>{
            sendServerMessage(SERVER_MESSAGE_TYPES.UPDATE_ITEM_COMPONENT, {component:SERVER_MESSAGE_TYPES.UPDATE_ASSET_LOCKED, action:"toggle", data:{aid:aid, sceneId:localPlayer.activeScene!.id}})
        }}
    />
    </UiEntity>

{/* <UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            width: '10%',
            height: '100%',
        }}
    >
        <UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            width: calculateSquareImageDimensions(3.5).width,
            height: calculateSquareImageDimensions(3.5).height,
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas1.png'
            },
            uvs: getImageAtlasMapping(uiSizes.trashButtonTrans)
        }}
        onMouseDown={()=>{
            const e = entitiesFromItemIds.get(aid)
            if (e){
                selectRow(i)
                sendServerDelete(selectedEntity as Entity)
                VisibilityComponent.getMutable(sceneInfoEntitySelector).visible = false
                deselectRow()
            }else{
                log('no item to edit', aid)
            }
        }}
    />

    </UiEntity> */}

</UiEntity>
    )
}

function getVis(aid:string){
    let scene = sceneBuilds.get(localPlayer.activeScene!.id)
    let asset = scene.ass.find((ass:any)=> ass.aid === aid)
    if(asset){
        return asset.buildVis ?  getImageAtlasMapping(uiSizes.eyeTrans) :  getImageAtlasMapping(uiSizes.eyeClosed)
    }else{
        return  getImageAtlasMapping(uiSizes.eyeTrans)
    }  
}

function getLocked(aid:string){
    let scene = sceneBuilds.get(localPlayer.activeScene!.id)
    let asset = scene.ass.find((ass:any)=> ass.aid === aid)
    if(asset){
        return asset.locked ?  getImageAtlasMapping(uiSizes.lockedIcon) :  getImageAtlasMapping(uiSizes.unlockedIcon)
    }else{
        return  getImageAtlasMapping(uiSizes.eyeTrans)
    }  
}