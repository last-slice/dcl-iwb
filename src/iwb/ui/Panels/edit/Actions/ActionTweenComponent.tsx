import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../../helpers'
import { Color4, Quaternion } from '@dcl/sdk/math'
import { EDIT_MODIFIERS, TWEEN_EASE_SLUGS, TWEEN_LOOP_SLUGS, TWEEN_TYPE_SLUGS } from '../../../../helpers/types'
import { uiSizes } from '../../../uiConfig'
import { Entity, Transform } from '@dcl/sdk/ecs'
import { enableTweenPlacementEntity, selectedItem, tweenPlacementEntity } from '../../../../components/modes/build'

export let selectedTweenType:number = 0
export let selectedTweenEaseType:number = 0
export let selectedTweenLoop:number = 2
export let tweenDuration:number = 1
export let actionTweenView:string = "main"

let tweenModifier = 1

export let tweenEndValues:any = {
    x:0,
    y:0,
    z:0
}

export function updateActionTweenView(v:string){
    actionTweenView = v
}

export function updateTweenEndDefaultAssetPosition(){
    console.log('updating tween osition')
    let transform = {...Transform.get(selectedItem.entity)}

    switch(selectedTweenType){
        case EDIT_MODIFIERS.POSITION:
            tweenEndValues = transform.position
            tweenModifier = 1
            break;

        case EDIT_MODIFIERS.ROTATION:
            tweenEndValues = Quaternion.toEulerAngles(transform.rotation)
            tweenModifier = 90
            break;

        case EDIT_MODIFIERS.SCALE:
            tweenEndValues = transform.scale
            tweenModifier = 1
            break;
    }
}

export function updateTweenView(v:string){
    actionTweenView = v
}

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
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display: actionTweenView === "main" ? "flex" : "none"
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
        onChange={(index:number)=>{selectTweenType(index)}}
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
            margin:{bottom:"7%"}
        }}
        uiText={{value:"Tween Duration", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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
            margin:{bottom:"7%"}
        }}
        uiText={{value:"Tween Loop", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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
        key={"action-tween-loop-type-dropdown"}
        options={[...TWEEN_LOOP_SLUGS]}
        selectedIndex={selectedTweenLoop}
        onChange={selectTweenLoop}
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
            height: '15%',
        }}
        // uiBackground={{color:Color4.Teal()}}
    >

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50%',
            height: '100%',
        }}
        uiText={{value:"End " + getCurrentTweenType(), fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />


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
            uiText={{value: "Change", fontSize: sizeFont(20, 16)}}
            onMouseDown={() => {
                enableTweenPlacementEntity()
                updateTweenView("end")
            }}
        />

        </UiEntity>



        </UiEntity>



        </UiEntity> 


        {/* end position panel */}
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display: actionTweenView === "end" ? "flex" : "none"
        }}
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
        uiText={{value:"Set Tween End " + getCurrentTweenType(), fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

        <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '90%',
        }}
    >

          {/* position row */}
          <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '95%',
                height: '80%',
                margin: {top: '1%', bottom: '1%'}
            }}
            // uiBackground={{color:Color4.Black()}}
        >

            {/* header */}
            {/* <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '15%',
                    margin: {top: '1%', bottom: '2%'}
                }}
            >
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '50%',
                    }}

                    uiText={{value: modifierName, fontSize: sizeFont(25, 12), textAlign: 'middle-left'}}
                />


            </UiEntity> */}

            {/* positive button row */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    height: '30%',
                    margin: {top: '1%'}
                }}
                // uiBackground={{color:Color4.Blue()}}
            >

                {/* x positive  */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '30%',
                        height: '100%',
                    }}
                    // uiBackground={{color:Color4.Green()}}
                    uiText={{value: "X: " + getTweenEnd("x"), fontSize: sizeFont(25, 12), textAlign: 'middle-center'}}
                    >
                </UiEntity>

                {/* y positive  */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '30%',
                        height: '100%',
                    }}
                    // uiBackground={{color:Color4.Blue()}}
                    uiText={{value: "Y: " + getTweenEnd("y"), fontSize: sizeFont(25, 12), textAlign: 'middle-center'}}
                >
                </UiEntity>

                {/* z positive  */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '30%',
                        height: '100%',
                    }}
                    // uiBackground={{color:Color4.Teal()}}
                    uiText={{value: "Z: " +  getTweenEnd("z"), fontSize: sizeFont(25, 12), textAlign: 'middle-center'}}
                >
                </UiEntity>


            </UiEntity>

            {/* position input row */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    height: '35%',
                    margin: {top: '1%'}
                }}
                // uiBackground={{color:Color4.Red()}}
            >

                {/* x cell */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '30%',
                        height: '100%',
                        margin: {right: '2%'}
                    }}
                    uiBackground={{color: Color4.Gray()}}
                    // uiText={{value:"" + (selectedItem && selectedItem.enabled ? getRelativePosition("x") : ""), fontSize:sizeFont(20,15)}}
                >
                    <Input
                        // onChange={(value) => {
                        //     sendServerEdit(props.modifier, 'x', 1, true, props.modifier, parseFloat(value))
                        // }}

                        onSubmit={(value) => {
                            // sendServerEdit(props.modifier, 'x', 1, true, props.modifier, parseFloat(value))
                            updateTweenEnd('x', parseFloat(value), true)
                        }}
                        fontSize={sizeFont(20, 12)}
                        placeholder={'' + (selectedItem && selectedItem.enabled ? getTweenEnd("x") : "")}
                        placeholderColor={Color4.White()}
                        uiTransform={{
                            width: '100%',
                            height: '100%',
                        }}
                        color={Color4.White()}
                        // value={"" + (selectedItem && selectedItem.enabled ? props.valueFn("x") : "")}
                    />

                </UiEntity>

                {/* y cell */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '30%',
                        height: '100%',
                        margin: {right: '2%'}
                    }}
                    uiBackground={{color: Color4.Gray()}}
                    // uiText={{value:"" + (selectedItem && selectedItem.enabled ? getRelativePosition("x") : ""), fontSize:sizeFont(20,15)}}
                >
                    <Input
                        // onChange={(value) => {
                        //     sendServerEdit(props.modifier, 'y', 1, true, props.modifier, parseFloat(value))
                        // }}
                        onSubmit={(value) => {
                            // sendServerEdit(props.modifier, 'y', 1, true, props.modifier, parseFloat(value))
                            updateTweenEnd('y', parseFloat(value), true)
                        }}
                        fontSize={sizeFont(20, 12)}
                        placeholder={'' + (selectedItem && selectedItem.enabled ? getTweenEnd("y") : "")}
                        placeholderColor={Color4.White()}
                        uiTransform={{
                            width: '100%',
                            height: '100%',
                        }}
                        color={Color4.White()}
                        // value={"" + (selectedItem && selectedItem.enabled ? props.valueFn("y") : "")}
                    />

                </UiEntity>


                {/* z cell */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '30%',
                        height: '100%',
                        margin: {right: '2%'}
                    }}
                    uiBackground={{color: Color4.Gray()}}
                    // uiText={{value:"" + (selectedItem && selectedItem.enabled ? getRelativePosition("x") : ""), fontSize:sizeFont(20,15)}}
                >
                    <Input
                        // onChange={(value) => {
                        //     sendServerEdit(props.modifier, 'z', 1, true, props.modifier, parseFloat(value))
                        // }}
                        onSubmit={(value) => {
                            // sendServerEdit(props.modifier, 'z', 1, true, props.modifier, parseFloat(value))
                            updateTweenEnd('z', parseFloat(value), true)
                        }}
                        fontSize={sizeFont(20, 12)}
                        placeholder={'' + (selectedItem && selectedItem.enabled ?getTweenEnd("z") : "")}
                        placeholderColor={Color4.White()}
                        uiTransform={{
                            width: '100%',
                            height: '100%',
                        }}
                        color={Color4.White()}
                        // value={"" + (selectedItem && selectedItem.enabled ? props.valueFn("z") : "")}
                    />

                </UiEntity>
            </UiEntity>

            {/* negative button row // */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignContent:'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    height: '30%',
                    margin: {top: '1%'}
                }}
                // uiBackground={{color:Color4.Green()}}
            >

                {/* x negative  */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '30%',
                        height: '100%',
                    }}
                >

                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: calculateSquareImageDimensions(3.5).width,
                            height: calculateSquareImageDimensions(3.5).height,
                        }}
                        uiBackground={{
                            textureMode: 'stretch',
                            texture: {
                                src: 'assets/atlas2.png'
                            },
                            uvs: getImageAtlasMapping(uiSizes.upArrow)
                        }}
                        onMouseDown={() => {
                            updateTweenEnd('x', 1)
                        }}
                    />


                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: calculateSquareImageDimensions(3.5).width,
                            height: calculateSquareImageDimensions(3.5).height,
                            margin: {right: '2%'}
                        }}
                        uiBackground={{
                            textureMode: 'stretch',
                            texture: {
                                src: 'assets/atlas2.png'
                            },
                            uvs: getImageAtlasMapping(uiSizes.downArrow)
                        }}
                        onMouseDown={() => {
                            updateTweenEnd('x', -1)
                        }}
                    />
                </UiEntity>

                {/* y negative  */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '30%',
                        height: '100%',
                    }}
                    // uiBackground={{color:Color4.Green()}}
                >

                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: calculateSquareImageDimensions(3.5).width,
                            height: calculateSquareImageDimensions(3.5).height,
                        }}
                        uiBackground={{
                            textureMode: 'stretch',
                            texture: {
                                src: 'assets/atlas2.png'
                            },
                            uvs: getImageAtlasMapping(uiSizes.upArrow)
                        }}
                        onMouseDown={() => {
                            updateTweenEnd('y', 1)
                        }}
                    />

                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: calculateSquareImageDimensions(3.5).width,
                            height: calculateSquareImageDimensions(3.5).height,
                            margin: {right: '2%'}
                        }}
                        uiBackground={{
                            textureMode: 'stretch',
                            texture: {
                                src: 'assets/atlas2.png'
                            },
                            uvs: getImageAtlasMapping(uiSizes.downArrow)
                        }}
                        onMouseDown={() => {
                            updateTweenEnd('y', -1)
                        }}
                    />
                </UiEntity>

                {/* z negative  */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '30%',
                        height: '100%',
                    }}
                    // uiBackground={{color:Color4.Green()}}
                >

                <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: calculateSquareImageDimensions(3.5).width,
                            height: calculateSquareImageDimensions(3.5).height,
                        }}
                        uiBackground={{
                            textureMode: 'stretch',
                            texture: {
                                src: 'assets/atlas2.png'
                            },
                            uvs: getImageAtlasMapping(uiSizes.upArrow)
                        }}
                        onMouseDown={() => {
                            updateTweenEnd('z', 1)
                        }}
                    />

                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: calculateSquareImageDimensions(3.5).width,
                            height: calculateSquareImageDimensions(3.5).height,
                            margin: {right: '2%'}
                        }}
                        uiBackground={{
                            textureMode: 'stretch',
                            texture: {
                                src: 'assets/atlas2.png'
                            },
                            uvs: getImageAtlasMapping(uiSizes.downArrow)
                        }}
                        onMouseDown={() => {
                            updateTweenEnd('z', -1)
                        }}
                    />
                </UiEntity>

            </UiEntity>
        </UiEntity>

                      {/* modifier container */}
                      <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '20%',
                    height: '100%',
                    margin: {top: '1%', bottom: '1%'}
                }}
            >

                {/* end tween position modifier */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '90%',
                        height: '35%',
                        margin: {top: '1%', bottom: '1%'}
                    }}
                    //uiBackground={{color:Color4.Black()}}
                >

                    {/* position modifier header */}
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '15%',
                            margin: {top: '1%', bottom: '2%'}
                        }}
                    >
                        <UiEntity
                            uiTransform={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '50%',
                            }}

                            uiText={{value: "Factor", fontSize: sizeFont(25, 12), textAlign: 'middle-left'}}
                        />

                    </UiEntity>

                    <UiEntity
                        uiTransform={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '85%',
                            margin: {top: '1%', bottom: '1%'}
                        }}
                        //uiBackground={{color:Color4.Green()}}
                    >
                        <UiEntity
                            uiTransform={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: calculateSquareImageDimensions(5).width,
                                height: calculateSquareImageDimensions(4).height,
                            }}
                            uiBackground={{
                                textureMode: 'stretch',
                                texture: {
                                    src: 'assets/atlas1.png'
                                },
                                uvs: getImageAtlasMapping(uiSizes.magnifyIcon)
                            }}
                            onMouseDown={() => {
                                toggleModifier(selectedTweenType)
                            }}
                        />

                        <UiEntity
                            uiTransform={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: calculateSquareImageDimensions(5).width,
                                height: calculateSquareImageDimensions(4).height,
                                margin: {right: '2%'}
                            }}
                            uiText={{
                                value: "" + tweenModifier,
                                fontSize: sizeFont(15, 12)
                            }}
                        />


                    </UiEntity>

                </UiEntity>


                    </UiEntity>
            </UiEntity>

        </UiEntity>

            </UiEntity>
                  
    )
}

function getCurrentTweenType(){
    switch(selectedTweenType){
        case EDIT_MODIFIERS.POSITION:
            return "Position"
        
        case EDIT_MODIFIERS.ROTATION:
            return "Rotation"

        case EDIT_MODIFIERS.SCALE:
            return "Scale"
    }
}

function selectTweenType(index:number){
    if(index !== selectedTweenType){
        selectedTweenType = index
        // updateTweenEndDefaultAssetPosition()
        updateTweenEndDefaultAssetPosition()
    }
}

function selectTweenLoop(index:number){
    selectedTweenLoop = index
}

function selectTweenEaseType(index:number){
    selectedTweenEaseType = index
}

export function getTweenEnd(type:string){
    return tweenEndValues[type].toFixed(3)
}

export function updateTweenEnd(type:string, value:number, set?:boolean){
    // console.log('updating end tween values', type, value, selectedTweenType, tweenModifier)
    if(set){
        console.log('setting tween value', type, value)
        tweenEndValues[type] = value
    }
    else{
        tweenEndValues[type] += (value * tweenModifier)
    }
    

    switch(selectedTweenType){
        case EDIT_MODIFIERS.POSITION:
            let pos = Transform.getMutable(tweenPlacementEntity as Entity).position
            pos.x = tweenEndValues.x
            pos.y = tweenEndValues.y
            pos.z = tweenEndValues.z
        break;

        case EDIT_MODIFIERS.ROTATION:
            let rot = Quaternion.fromEulerDegrees(tweenEndValues.x, tweenEndValues.y, tweenEndValues.z)
            Transform.getMutable(tweenPlacementEntity as Entity).rotation = rot

        break;

        case EDIT_MODIFIERS.SCALE:
            let scl = Transform.getMutable(tweenPlacementEntity as Entity).scale
            scl.x = tweenEndValues.x
            scl.y = tweenEndValues.y
            scl.z = tweenEndValues.z
        break;
    }

    console.log('tween end values are now', tweenEndValues)
}

export function toggleModifier(mod: EDIT_MODIFIERS) {
    switch (mod) {
        case EDIT_MODIFIERS.POSITION:
            case EDIT_MODIFIERS.SCALE:
            if (tweenModifier === 1) {
                tweenModifier = 0.1
            } else if (tweenModifier === 0.1) {
                tweenModifier = 0.01
            } else if (tweenModifier === 0.01) {
                tweenModifier = 0.001
            } else if (selectedItem.pFactor === 0.001) {
                tweenModifier = 1
            }
            break;

        case EDIT_MODIFIERS.ROTATION:
            console.log('tween modifier is', tweenModifier)
            if (tweenModifier === 90) {
                tweenModifier = 45
            } else if (tweenModifier === 45) {
                tweenModifier = 15
            } else if (tweenModifier === 15) {
                tweenModifier = 5
            } else if (tweenModifier=== 5) {
                tweenModifier = 1
            } else if (tweenModifier === 1) {
                tweenModifier = 90
            }
            
            break;
    }
}