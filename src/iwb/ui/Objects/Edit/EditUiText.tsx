import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
import {Color4} from '@dcl/sdk/math'
import {calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont} from '../../helpers'
import resources from '../../../helpers/resources'
import { COMPONENT_TYPES, EDIT_MODES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { visibleComponent } from '../EditAssetPanel'
import { UiTexts } from '../../../components/UIText'
import { selectedItem } from '../../../modes/Build'
import { setUIClicked } from '../../ui'
import { uiSizes } from '../../uiConfig'

export function showUIText(){
    let uiText = UiTexts.get(selectedItem.aid)
    if(uiText){
        uiText.show()
    }
}

export function hideUIText(){
    let uiText = UiTexts.get(selectedItem.aid)
    if(uiText){
        uiText.hide()
    }
}

export function EditUiText() {
    return (
        <UiEntity
            key={resources.slug + "edit::uitext::panel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.UI_TEXT_COMPONENT ? 'flex' : 'none',
            }}
            >

            {/* sprite row */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '35%',
                    }}
                    // uiBackground={{color:Color4.Green()}}
                >

                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: '50%',
                        height: '100%',
                    }}
                >

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '20%',
                }}
                uiText={{value: "Sprite Sheet", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
            />
                </UiEntity>


                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '50%',
                        height: '100%',
                    }}
                >
                    <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    margin:{top:"2%", bottom:'2%'}
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/13b63e57-a636-4cf2-8449-488a5fd6d03e.png'
                    }
                }}
            />

                </UiEntity>


                </UiEntity>

                {/* text size row */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '10%',
                    }}
                >

                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: '30%',
                        height: '100%',
                    }}
                >
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                        }}
                        uiText={{value: "Text Size", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
                    />
                    </UiEntity>

                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: '70%',
                        height: '100%',
                    }}
                >
                     <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '50%',
                    height: '100%',
                }}
            >

                <Input
                    uiTransform={{
                        width: '100%',
                        height: '120%',
                    }}
                    // uiBackground={{color:Color4.Purple()}}//
                    placeholderColor={Color4.White()}
                    placeholder={"Text Size"}
                    color={Color4.White()}
                    fontSize={sizeFont(20, 15)}
                    textAlign='middle-center'
                    onChange={(input) => {
                        let size = parseInt(input.trim())
                        let uiText = UiTexts.get(selectedItem.aid)
                        if(uiText){
                            uiText.size = size
                        }
                    }}
                />

            </UiEntity>
                    </UiEntity>
        </UiEntity>

           


                        {/* positioning row */}
                        <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '10%',
                    }}
                >
                        <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '25%',
                            height: '100%',
                        }}
                    >
                        <UiEntity
                            uiTransform={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '100%',
                            }}
                            uiText={{value: "Position (%)", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
                        />
                    </UiEntity>

                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '75%',
                        height: '100%',
                    }}
                >
                <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf:'flex-start',
                    width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
                    height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                }}
                uiText={{
                    value: "Clear",
                    fontSize: sizeFont(25, 15),
                    color: Color4.White(),
                    textAlign: 'middle-center'
                }}
                onMouseDown={() => {
                    setUIClicked(true)
                    let uiText = UiTexts.get(selectedItem.aid)
                    if(uiText){
                        delete uiText.position
                    }
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
                />
                </UiEntity>


                </UiEntity>




                        {/* positioning row */}
                        <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '15%',
                    }}
                >

                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '25%',
                        height: '100%',
                    }}
                >
                    <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin:{bottom:"7%"}
                }}
                uiText={{value: "Top", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
            />

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '50%',
                }}
                >

                <Input
                    uiTransform={{
                        width: '80%',
                        height: '120%',
                    }}
                    placeholder={"Top Position"}
                    color={Color4.White()}
                    fontSize={sizeFont(20, 15)}
                    textAlign='middle-center'
                    onChange={(input) => {
                        let uiText = UiTexts.get(selectedItem.aid)
                        if(uiText){
                            if(!uiText.position){
                                uiText.position = {}   
                            }
                            uiText.position.top = `${input.trim()}%`
                        }
                    }}
                />

                </UiEntity>

                    </UiEntity>

                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '25%',
                        height: '100%',
                    }}
                >
                    <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin:{bottom:"7%"}
                }}
                uiText={{value: "Bottom", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
            />

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '50%',
                }}
                >

                <Input
                    uiTransform={{
                        width: '80%',
                        height: '120%',
                    }}
                    placeholder={"Bottom Position"}
                    color={Color4.White()}
                    fontSize={sizeFont(20, 15)}
                    textAlign='middle-center'
                    onChange={(input) => {
                        let uiText = UiTexts.get(selectedItem.aid)
                        if(uiText){
                            if(!uiText.position){
                                uiText.position = {}   
                            }
                            uiText.position.bottom = `${input.trim()}%`
                        }
                    }}
                />

                </UiEntity>

                    </UiEntity>
                    
                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '25%',
                        height: '100%',
                    }}
                >
                    <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin:{bottom:"7%"}
                }}
                uiText={{value: "Left", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
            />

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '50%',
                }}
                >

                <Input
                    uiTransform={{
                        width: '80%',
                        height: '120%',
                    }}
                    placeholder={"Left Position"}
                    color={Color4.White()}
                    fontSize={sizeFont(20, 15)}
                    textAlign='middle-center'
                    onChange={(input) => {
                        let uiText = UiTexts.get(selectedItem.aid)
                        if(uiText){
                            if(!uiText.position){
                                uiText.position = {}   
                            }
                            uiText.position.left = `${input.trim()}%`
                        }
                    }}
                />

                </UiEntity>

                    </UiEntity>

                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '25%',
                        height: '100%',
                    }}
                >
                    <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin:{bottom:"7%"}
                }}
                uiText={{value: "Right", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
            />

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '50%',
                }}
                >

                <Input
                    uiTransform={{
                        width: '80%',
                        height: '120%',
                    }}
                    placeholder={"Right Position"}
                    color={Color4.White()}
                    fontSize={sizeFont(20, 15)}
                    textAlign='middle-center'
                    onChange={(input) => {
                        let uiText = UiTexts.get(selectedItem.aid)
                        if(uiText){
                            if(!uiText.position){
                                uiText.position = {}   
                            }
                            uiText.position.right = `${input.trim()}%`
                        }
                    }}
                />

                </UiEntity>

                    </UiEntity>
                
                </UiEntity>


        </UiEntity>
    )
}