import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { addLineBreak, calculateImageDimensions, calculateSquareImageDimensions, dimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'
import { Entity } from '@dcl/sdk/ecs'
import { selectedItem, sendServerDelete } from '../../components/modes/build'
import { SceneItem } from '../../helpers/types'
import { itemIdsFromEntities, sceneBuilds } from '../../components/scenes'
import { localPlayer } from '../../components/player/player'
import { items } from '../../components/catalog'

export let show = false
export let toDelete:Entity
export let toDeleteItem:SceneItem

export function displayConfirmDeletePanel(value: boolean, entity?:Entity) {
    show = value

    if(value && entity){
        toDelete = entity
        let assetId = itemIdsFromEntities.get(entity)
        if (assetId) {
            let sceneItem = localPlayer!.activeScene!.ass.find((asset) => asset.aid === assetId) 
            if(sceneItem){
                let catItem = [...items.values()].find((id:any)=> id.id === sceneItem?.id)
                console.log(catItem)
                toDeleteItem = sceneItem
                toDeleteItem.n = catItem!.n
            }
        }
    }
}

export function createConfirmDeleteItemPanel() {
    return (
        <UiEntity
            key={"confirmdeleteitempanel"}
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
        // uiBackground={{ color: Color4.Red() }}//
        >
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    display:'flex',
                    justifyContent:'flex-start'
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.vertRectangle)
                }}
            >
                
                {/* header label */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '15%',
                        display:'flex',
                        margin:{top:'10%'}
                    }}
                // uiBackground={{color:Color4.Green()}}
                uiText={{value:"Delete Item", fontSize: sizeFont(45,30), color: Color4.White()}}
                />

                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '10%',
                        display:'flex',
                        margin:{top:'2%'}
                    }}
                // uiBackground={{color:Color4.Green()}}//
                uiText={{value:"" + (toDeleteItem && toDeleteItem.n), fontSize: sizeFont(45,30), color: Color4.White()}}
                />

                    {/* popup text */}
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '25%',
                        }}
                        uiText={{fontSize:sizeFont(25,20), color:Color4.White(), value: addLineBreak("Are you sure you want to delete this item?", true, 30)}}
                    />

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
                height: calculateImageDimensions(5,getAspect(uiSizes.buttonPillBlack)).height,
                margin:{top:"1%", bottom:'1%'},
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            onMouseDown={() => {
                displayConfirmDeletePanel(false)
                sendServerDelete(toDelete)
            }}
            uiText={{value: "Delete", color:Color4.White(), fontSize:sizeFont(30,20)}}
            />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
                height: calculateImageDimensions(5,getAspect(uiSizes.buttonPillBlack)).height,
                margin:{top:"1%", bottom:'1%'},
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            onMouseDown={() => {
                displayConfirmDeletePanel(false)
            }}
            uiText={{value: "Cancel", color:Color4.White(), fontSize:sizeFont(30,20)}}
            />

        </UiEntity>

        </UiEntity>
    )
}