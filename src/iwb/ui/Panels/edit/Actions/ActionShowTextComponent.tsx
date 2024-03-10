import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { sizeFont } from '../../../helpers'
import { Color4 } from '@dcl/sdk/math'
import { selectedItem } from '../../../../components/modes/build'
import { TEXT_ALIGN, TEXT_ALIGN_SLUGS } from '../../../../helpers/types'

export let textAlignIndex:number = 0
export let showText:any = {
    text:"",
    timer:0,
    size:20,
    pos:TEXT_ALIGN_SLUGS[textAlignIndex]
}

export function ActionShowTextComponent(){
    return(
        <UiEntity
        key={'actionshowtextcomponent'}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display:'flex'
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
            margin:{bottom:'2%'}
        }}
    uiText={{value:"Text", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
    />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '25%',
        }}
    >

        <Input
            onChange={(value) => {
                showText.text = value
            }}
            fontSize={sizeFont(20,15)}
            placeholder={''}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
            />

    </UiEntity>


            {/* first row */}
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
                    height: '15%',
                    display:'flex',
                    margin:{bottom:'5%'}
                }}
                uiText={{value:"Font Size", fontSize:sizeFont(20,15), color:Color4.White()}}
            />

                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '60%',
                    display:'flex'
                }}
            >


            <Input  
            onChange={(value) => {
                showText.size = parseInt(value)
            }}
            fontSize={sizeFont(18,12)}
            placeholder={''}
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
                    width: '33%',
                    height: '15%',
                    display:'flex',
                    margin:{bottom:'5%'}
                }}
                uiText={{value:"Hide After Seconds", fontSize:sizeFont(20,15), color:Color4.White()}}
            />

                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '60%',
                    display:'flex'
                }}
            >


            <Input  
            onChange={(value) => {
                showText.timer = parseFloat(value)
            }}
            fontSize={sizeFont(18,12)}
            placeholder={''}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
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
                    display:'flex'
                }}
            >
                 <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '15%',
                    display:'flex',
                    margin:{bottom:'5%'}
                }}
                uiText={{value:"Font Type", fontSize:sizeFont(20,15), color:Color4.White()}}
            />

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '85%',
                    display:'flex'
                }}
            >

                    <Dropdown
                    key={"action-show-text-font-dropdown"}
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
                    height: '15%',
                    display:'flex',
                    margin:{bottom:'5%'}
                }}
                uiText={{value:"Text Position", fontSize:sizeFont(20,15), color:Color4.White()}}
            />

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '85%',
                    display:'flex'
                }}
            >

                    <Dropdown
                    key={"action-show-text-position-dropdown"}
                    options={TEXT_ALIGN}
                    selectedIndex={textAlignIndex}
                    onChange={(index)=>{showText.pos = TEXT_ALIGN_SLUGS[index]}}
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