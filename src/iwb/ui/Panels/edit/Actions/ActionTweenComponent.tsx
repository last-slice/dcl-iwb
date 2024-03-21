import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../../helpers'
import { Color4 } from '@dcl/sdk/math'
import { selectedItem } from '../../../../components/modes/build'
import { TWEEN_EASE_SLUGS, TWEEN_TYPE_SLUGS } from '../../../../helpers/types'
import { uiSizes } from '../../../uiConfig'

export let selectedTweenType:number = 0
export let selectedTweenEaseType:number = 0

export let tweenDuration:number = 1

export function ActionTweenComponent(){
    return(
        <UiEntity
        key={'actiontweencomponent'}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display:'flex'
        }}
    >

        {/* select types row */}
    <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '25%',
            margin:{bottom:'2%'}
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
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            margin:{bottom:'7%'}
        }}
    uiText={{value:"Select Tween Type", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
    />

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '80%',
        }}
    >
    <Dropdown
        key={"action-tween-type-dropdown"}
        options={[...TWEEN_TYPE_SLUGS]}
        selectedIndex={selectedTweenType}
        onChange={selectTweenType}
        uiTransform={{
            width: '100%',
            height: '100%',
        }}
        // uiBackground={{color:Color4.Purple()}}
        color={Color4.White()}
        fontSize={sizeFont(20, 15)}
    />

    </UiEntity>
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
            height: '10%',
            margin:{bottom:'7%'}
        }}
    uiText={{value:"Select Ease Type", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
    />

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '80%',
        }}
    >
    <Dropdown
        key={"action-tween-ease-type-dropdown"}
        options={[...TWEEN_EASE_SLUGS]}
        selectedIndex={selectedTweenEaseType}
        onChange={selectTweenEaseType}
        uiTransform={{
            width: '100%',
            height: '100%',
        }}
        // uiBackground={{color:Color4.Purple()}}
        color={Color4.White()}
        fontSize={sizeFont(20, 15)}
    />

    </UiEntity>

        </UiEntity>




    </UiEntity>

    <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '30%',
            margin:{bottom:'2%'}
        }}
        // uiBackground={{color:Color4.Green()}}
    >

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50%',
            height: '100%',
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
            margin:{bottom:"2%"}
        }}
        uiText={{value:"Tween Duration (in seconds)", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '60%',
            }}
        >
        <Input
            onChange={(value)=>{
                tweenDuration = parseFloat(value)
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'1 seconds'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
            ></Input>

        </UiEntity>

        </UiEntity>

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50%',
            height: '100%',
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
            margin:{bottom:"2%"}
        }}
        uiText={{value:"Tween Loop", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '60%',
            }}
        >
    <Dropdown
        key={"action-tween-loop-type-dropdown"}
        options={[...TWEEN_TYPE_SLUGS]}
        selectedIndex={selectedTweenType}
        onChange={selectTweenType}
        uiTransform={{
            width: '100%',
            height: '100%',
        }}
        // uiBackground={{color:Color4.Purple()}}
        color={Color4.White()}
        fontSize={sizeFont(20, 15)}
    />

        </UiEntity>

        </UiEntity>


    </UiEntity>

    

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '35%',
        }}
        // uiBackground={{color:Color4.Teal()}}
    >

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            margin:{bottom:'4%'}
        }}
        uiText={{value:"End Position", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />


        <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '70%',
        }}
        // uiBackground={{color:Color4.Green()}}
        >

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
                height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
                margin:{left:"5%"}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            uiText={{value: "Add End Position", fontSize: sizeFont(20, 16)}}
            onMouseDown={() => {
                // updateActionView("list")
            }}
        />

        </UiEntity>



        </UiEntity>



        </UiEntity> 


                  
    )
}

function selectTweenType(index:number){
    selectedTweenType = index
}

function selectTweenEaseType(index:number){
    selectedTweenType = index
}
