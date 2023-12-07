
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { selectedItem } from '../../../components/modes/build'
import { items } from '../../../components/catalog'
import { uiSizes } from '../../uiConfig'
import { players } from '../../../components/player/player'
import { log } from '../../../helpers/functions'

export function EditObjectDetails() {
    return (
        <UiEntity
            key={"editobjectdetailsinfo"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '95%',
                height: '20%',
                margin:{top:'5%'}
            }}
        // uiBackground={{color:Color4.Teal()}}
        >


            {/* top image row */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection:'row',
                    justifyContent: 'center',
                    width: '90%',
                    height: '80%',
                }}
                // uiBackground={{color:Color4.Green()}}
            >

                {/* image column */}
                <UiEntity
                uiTransform={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection:'row',
                    justifyContent: 'center',
                    width: '40%',
                    height: '100%',
                }}
                // uiBackground={{color:Color4.Blue()}}
            >

                 <UiEntity
                uiTransform={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateSquareImageDimensions(10).width,
                    height: calculateSquareImageDimensions(10).height,
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: "" + (selectedItem && selectedItem.enabled ? items.get(selectedItem.catalogId)!.im : "")
                    },
                    uvs: getImageAtlasMapping({
                        atlasHeight: 256,
                        atlasWidth: 256,
                        sourceTop: 0,
                        sourceLeft: 0,
                        sourceWidth: 256,
                        sourceHeight: 256
                    })
                }}
                />

                </UiEntity>

                   
                {/* buttons column */}
                <UiEntity
                uiTransform={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection:'column',
                    justifyContent: 'center',
                    width: '40%',
                    height: '100%',
                }}
                // uiBackground={{color:Color4.Green()}}
            >


                </UiEntity>

                 {/* back button column */}
                 <UiEntity
                uiTransform={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection:'column',
                    justifyContent: 'flex-start',
                    width: '20%',
                    height: '100%',
                    margin:{top:"5%"}
                }}
                // uiBackground={{color:Color4.Teal()}}
            >
                 {/* <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateImageDimensions(2, getAspect(uiSizes.backButton)).width,
                    height: calculateImageDimensions(2, getAspect(uiSizes.backButton)).height,
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.backButton)
                }}
                onMouseDown={() => {
                    displayCatalogInfoPanel(false)
                    displayCatalogPanel(true)
                }}
            /> */}
                </UiEntity>

            </UiEntity>

            {/* header and description row */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection:'column',
                    justifyContent: 'center',
                    width: '90%',
                    height: '20%',
                    margin:{top:"1%"}
                }}
                // uiBackground={{color:Color4.Yellow()}}
            >

                    {/* item name */}
                    <UiEntity
                    uiTransform={{
                        display: 'flex',//
                        flexDirection: 'column',
                        width: '100%',
                        height: '100%',
                        justifyContent:'center',
                    }}
                    uiText={{ value: "" + (selectedItem && selectedItem.enabled ? items.get(selectedItem.catalogId)!.n : ""), fontSize: sizeFont(40, 30), textAlign:'middle-left'}}
                     />
                     
                     
            </UiEntity>
            
        </UiEntity>
    )
        }