import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Actions, ENTITY_EMOTES, ENTITY_EMOTES_SLUGS, TEXT_ALIGN, TEXT_ALIGN_MODES } from '../../../../helpers/types'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../../helpers'
import { newActionData, updateActionData, updateActionView } from '../EditAction'
import resources from '../../../../helpers/resources'
import { selectedItem } from '../../../../modes/Build'
import { colyseusRoom } from '../../../../components/Colyseus'
import { items } from '../../../../components/Catalog'
import { TextAlignMode } from '@dcl/sdk/ecs'
import { setUIClicked } from '../../../ui'
import { uiSizes } from '../../../uiConfig'
import { handleShowText } from '../../../../components/Actions'

let animations:any[] = []
let loop:number = 0
let animation:string = ""

export function updateAssetAnimations(){
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }

    let catalogItem = items.get(selectedItem.catalogId)
    if(catalogItem && catalogItem.anim){
        console.log('item has animations')
        animations = [...catalogItem.anim.map($=> $.name)]
        updateActionData({loop:0, anim:animations[0], name:newActionData.name, type:newActionData.type}, true)
    }
    return
}

export function AddShowTextPanel(){
    return(
        <UiEntity
        key={resources.slug + "action::showtext::panel"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display:'none'//
        }}
        // uiBackground={{color:Color4.Green()}}
    >

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            margin:{bottom:'1%'}
        }}
        uiText={{value:"Enter Text", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
        />

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '15%',
        }}
    >

        <Input
            onChange={(value) => {
                setTextData("text", value.trim())
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'text to show'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
            />

    </UiEntity>

    {/* font row */}
    <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: '35%',
            display:'flex',
        }}
    >


        <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '45%',
                    height: '100%',
                    display:'flex'
                }}
            >
                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    display:'flex',
                    margin:{bottom:'7%'}
                }}
                uiText={{value:"Font Size", fontSize:sizeFont(20,15), color:Color4.White()}}
            />

                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '40%',
                    display:'flex'
                }}
            >


            <Input  
            onChange={(value) => {
                setTextData('size', parseInt(value.trim()))
            }}
            fontSize={sizeFont(18,12)}
            placeholder={'15'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
            />
            </UiEntity>

         </UiEntity>

         <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '45%',
                    height: '100%',
                    display:'flex'
                }}
            >


<UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    display:'flex',
                    margin:{bottom:'7%'}
                }}
                uiText={{value:"Font Type", fontSize:sizeFont(20,15), color:Color4.White()}}
            />

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '40%',
                    display:'flex'
                }}
            >

                    <Dropdown
                    options={['Serif']}
                    selectedIndex={0}
                    onChange={()=>{}}
                    uiTransform={{
                        width: '100%',
                        height: '100%',
                    }}
                    // uiBackground={{color:Color4.Purple()}}
                    color={Color4.White()}
                    fontSize={sizeFont(18, 12)}
                />
                </UiEntity>

         </UiEntity>



        </UiEntity>

 {/* second row */}
 <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: '35%',
            display:'flex'
        }}
        // uiBackground={{color:Color4.Blue()}}//
    >
                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '45%',
                    height: '100%',
                }}
            >

        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf:'flex-start',
                width: calculateImageDimensions(7, getAspect(uiSizes.buttonPillBlack)).width,
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
                value: "Preview Text",
                fontSize: sizeFont(25, 15),
                color: Color4.White(),
                textAlign: 'middle-center'
            }}
            onMouseDown={() => {
                setUIClicked(true)
                handleShowText(colyseusRoom.state.scenes.get(selectedItem.sceneId), selectedItem.entity, newActionData, 3)
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
        />

            {/* <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '33%',
                    height: '10%',
                    display:'flex',
                    margin:{bottom:'7%'}
                }}
                uiText={{value:"Hide After Seconds", fontSize:sizeFont(20,15), color:Color4.White()}}
            />

                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '40%',
                    display:'flex'
                }}
            >


            <Input  
            onChange={(value) => {
                setTextData("timer", parseFloat(value.trim()))
            }}
            fontSize={sizeFont(18,12)}
            placeholder={'3'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
            />
            </UiEntity> */}

        </UiEntity>


        <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '45%',
                    height: '100%',
                    display:'flex'
                }}
            >
                 <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    display:'flex',
                    margin:{bottom:'7%'}
                }}
                uiText={{value:"Text Position", fontSize:sizeFont(20,15), color:Color4.White()}}
            />

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '40%',
                    display:'flex'
                }}
            >

                    <Dropdown
                    options={TEXT_ALIGN}
                    selectedIndex={4}
                    onChange={(index)=>{
                        setTextData("textAlign",  Object.values(TEXT_ALIGN_MODES)[index])
                    }}
                    uiTransform={{
                        width: '100%',
                        height: '100%',
                    }}
                    // uiBackground={{color:Color4.Purple()}}
                    color={Color4.White()}
                    fontSize={sizeFont(18, 12)}
                />
                </UiEntity>

        </UiEntity>
        </UiEntity>

    </UiEntity>
    )
}

function setTextData(key:string, value:any){
    let data = newActionData
    data[key] = value
    updateActionData(data,true)
}

TextAlignMode.TAM_BOTTOM_CENTER