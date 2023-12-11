import ReactEcs, {UiEntity} from '@dcl/sdk/react-ecs'
import {Color4} from '@dcl/sdk/math'
import {getImageAtlasMapping, sizeFont} from '../../helpers'
import {uiSizes} from '../../uiConfig'
import {localPlayer} from '../../../components/player/player'
import {formatDollarAmount, formatSize} from '../../../helpers/functions'
import {items} from "../../../components/catalog";
import {editItem} from "../../../components/modes/build";
import {EDIT_MODES} from "../../../helpers/types";
import {entitiesFromItemIds} from "../../../components/scenes";
import {showSceneInfoPanel} from "../sceneInfoPanel";


const SceneAssetList = () => {

    {/* Assets data columns */
    }
    return (
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '52%',
                height: '55%',
                positionType: 'absolute',
                position: {left: '40%', bottom: '33%'},
                padding: {top: "5%"},
                overflow: 'scroll'
            }}
            uiBackground={{color: Color4.White()}}
        >

            {generateSceneAssetRows()}
        </UiEntity>
    )
}

export default SceneAssetList

function generateSceneAssetRows() {
    let arr: any[] = []

    // console.log("generateSceneAssetRows")

    if (!showSceneInfoPanel || !localPlayer || !localPlayer.activeScene) return null

    // console.log("generateSceneAssetRows", localPlayer, localPlayer.activeScene)

    localPlayer.activeScene.ass.forEach((asset: any, i: number) => {

        const curItem = items.get(asset.id)

        arr.push(
            <UiEntity
                key={"asset- " + asset.aid + i}
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '30px',
                    display: 'flex'
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: i % 2 === 1 ? getImageAtlasMapping(uiSizes.normalButton)

                        : //

                        getImageAtlasMapping(uiSizes.normalLightestButton)
                }}
                onMouseDown={() => {
                    console.log("clicked asset", asset.id)

                    const e = entitiesFromItemIds.get(asset.aid)
                    if (e)
                        editItem(e, EDIT_MODES.EDIT)

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
                        fontSize: sizeFont(15, 12),
                        textAlign: 'middle-left',
                        color: Color4.Black()
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
                        fontSize: sizeFont(15, 12),
                        textAlign: "middle-left",
                        color: Color4.Black()
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
                        fontSize: sizeFont(15, 12),
                        textAlign: 'middle-left',
                        color: Color4.Black()
                    }}

                />

            </UiEntity>
        )
    })

    return arr
}