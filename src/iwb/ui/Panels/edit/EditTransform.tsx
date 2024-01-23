import ReactEcs, {Input, UiEntity} from '@dcl/sdk/react-ecs'
import {Color4, Quaternion, Vector3} from '@dcl/sdk/math'
import {calculateSquareImageDimensions, getImageAtlasMapping, sizeFont} from '../../helpers'
import {selectedItem, sendServerEdit, toggleModifier} from '../../../components/modes/build'
import {engine, Transform} from '@dcl/sdk/ecs'
import {localUserId, players} from '../../../components/player/player'
import {COMPONENT_TYPES, EDIT_MODES, EDIT_MODIFIERS} from '../../../helpers/types'
import {uiSizes} from '../../uiConfig'
import {visibleComponent} from './EditObjectDataPanel'

let pressed: any = {}

function TransformInputModifiers(props: { modifier: EDIT_MODIFIERS, valueFn: Function }) {

    const modifierName =
        props.modifier === EDIT_MODIFIERS.POSITION ? "Position" :
            props.modifier === EDIT_MODIFIERS.ROTATION ? "Rotation" : "Scale"

    return (

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '90%',
                height: '35%',
                margin: {top: '1%', bottom: '1%'}
            }}
            // uiBackground={{color:Color4.Black()}}
        >

            {/* header */}
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

                    uiText={{value: modifierName, fontSize: sizeFont(25, 12), textAlign: 'middle-left'}}
                />

                <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '50%',
                    }}
                >

                    <UiEntity
                        uiTransform={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '30%',
                            height: '100%',
                        }}

                        uiText={{value: "X", fontSize: sizeFont(25, 12), textAlign: 'middle-center'}}
                    />

                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '30%',
                            height: '100%',
                        }}

                        uiText={{value: "Y", fontSize: sizeFont(25, 12), textAlign: 'middle-center'}}
                    />


                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '30%',
                            height: '100%',
                        }}

                        uiText={{value: "Z", fontSize: sizeFont(25, 12), textAlign: 'middle-center'}}
                    />


                </UiEntity>


            </UiEntity>

            {/* positive button row */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                >

                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: calculateSquareImageDimensions(3.5).width,
                            height: calculateSquareImageDimensions(5).height,
                            margin: {right: '2%'}
                        }}
                        uiBackground={{
                            textureMode: 'stretch',
                            texture: {
                                src: 'assets/atlas2.png'
                            },
                            uvs: getImageAtlasMapping(uiSizes.upArrow)
                        }}
                        onMouseDown={() => {
                            sendServerEdit(props.modifier, 'x', 1, false)

                            pressed.left = true
                        }}
                    />
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
                    // uiBackground={{color:Color4.Green()}}
                >

                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: calculateSquareImageDimensions(3.5).width,
                            height: calculateSquareImageDimensions(5).height,
                            margin: {right: '2%'}
                        }}
                        uiBackground={{
                            textureMode: 'stretch',
                            texture: {
                                src: 'assets/atlas2.png'
                            },
                            uvs: getImageAtlasMapping(uiSizes.upArrow)
                        }}
                        onMouseDown={() => {
                            sendServerEdit(props.modifier, 'y', 1, false)

                            pressed.left = true
                        }}
                    />
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
                    // uiBackground={{color:Color4.Green()}}
                >

                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: calculateSquareImageDimensions(3.5).width,
                            height: calculateSquareImageDimensions(5).height,
                            margin: {right: '2%'}
                        }}
                        uiBackground={{
                            textureMode: 'stretch',
                            texture: {
                                src: 'assets/atlas2.png'
                            },
                            uvs: getImageAtlasMapping(uiSizes.upArrow)
                        }}
                        onMouseDown={() => {
                            sendServerEdit(props.modifier, 'z', 1, false)

                            pressed.left = true
                        }}
                    />
                </UiEntity>


            </UiEntity>

            {/* position input row */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                        onChange={(value) => {
                            sendServerEdit(props.modifier, 'x', 1, true, props.modifier, parseFloat(value))
                        }}
                        fontSize={sizeFont(20, 12)}
                        placeholder={'' + (selectedItem && selectedItem.enabled ? props.valueFn("x") : "")}
                        placeholderColor={Color4.White()}
                        uiTransform={{
                            width: '100%',
                            height: '100%',
                        }}
                        color={Color4.White()}
                        value={"" + (selectedItem && selectedItem.enabled ? props.valueFn("x") : "")}
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
                        onChange={(value) => {
                            sendServerEdit(props.modifier, 'y', 1, true, props.modifier, parseFloat(value))
                        }}
                        fontSize={sizeFont(20, 12)}
                        placeholder={'' + (selectedItem && selectedItem.enabled ? props.valueFn("y") : "")}
                        placeholderColor={Color4.White()}
                        uiTransform={{
                            width: '100%',
                            height: '100%',
                        }}
                        color={Color4.White()}
                        value={"" + (selectedItem && selectedItem.enabled ? props.valueFn("y") : "")}
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
                        onChange={(value) => {
                            sendServerEdit(props.modifier, 'z', 1, true, props.modifier, parseFloat(value))
                        }}
                        fontSize={sizeFont(20, 12)}
                        placeholder={'' + (selectedItem && selectedItem.enabled ? props.valueFn("z") : "")}
                        placeholderColor={Color4.White()}
                        uiTransform={{
                            width: '100%',
                            height: '100%',
                        }}
                        color={Color4.White()}
                        value={"" + (selectedItem && selectedItem.enabled ? props.valueFn("z") : "")}
                    />

                </UiEntity>
            </UiEntity>

            {/* negative button row // */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '30%',
                    margin: {top: '1%'}
                }}
                // uiBackground={{color:Color4.Green()}}
            >

                {/* x negative  */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
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
                            height: calculateSquareImageDimensions(5).height,
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
                            sendServerEdit(props.modifier, 'x', -1, false)

                            pressed.left = true
                        }}
                    />
                </UiEntity>

                {/* y negative  */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
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
                            height: calculateSquareImageDimensions(5).height,
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
                            sendServerEdit(props.modifier, 'y', -1, false)

                            pressed.left = true
                        }}
                    />
                </UiEntity>

                {/* z negative  */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
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
                            height: calculateSquareImageDimensions(5).height,
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
                            sendServerEdit(props.modifier, 'z', -1, false)

                            pressed.left = true
                        }}
                    />
                </UiEntity>

            </UiEntity>
        </UiEntity>
    )

}

export function EditTransform() {
    return (
        <UiEntity
            key={"edittransformpanel"}
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '95%',
                display: visibleComponent === COMPONENT_TYPES.TRANSFORM_COMPONENT ? 'flex' : 'none',
            }}
            // uiBackground={{color:Color4.Red()}}
        >


            {/* PRS information container */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '80%',
                    height: '100%',
                }}
                // uiBackground={{color:Color4.Teal()}}
            >

                {/* position row */}
                <TransformInputModifiers modifier={EDIT_MODIFIERS.POSITION} valueFn={getRelativePosition}/>

                {/* rotation row */}
                <TransformInputModifiers modifier={EDIT_MODIFIERS.ROTATION} valueFn={getRotationValue}/>

                {/* scale row */}
                <TransformInputModifiers modifier={EDIT_MODIFIERS.SCALE} valueFn={getScaleValue}/>
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

                {/* position modifier */}
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
                                toggleModifier(EDIT_MODIFIERS.POSITION)
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
                                value: "" + (selectedItem && selectedItem.enabled ? selectedItem.pFactor : ""),
                                fontSize: sizeFont(15, 12)
                            }}
                        />


                    </UiEntity>

                </UiEntity>


                {/* rotation modifier */}
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
                                toggleModifier(EDIT_MODIFIERS.ROTATION)
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
                                value: "" + (selectedItem && selectedItem.enabled ? selectedItem.rFactor : ""),
                                fontSize: sizeFont(15, 12)
                            }}
                        />


                    </UiEntity>

                </UiEntity>


                {/* scale modifier */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '90%',
                        height: '35%',
                        margin: {top: '1%', bottom: '1%'}
                    }}
                    // uiBackground={{color:Color4.Black()}}
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
                        // uiBackground={{color:Color4.Green()}}
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
                                toggleModifier(EDIT_MODIFIERS.SCALE)
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
                                value: "" + (selectedItem && selectedItem.enabled ? selectedItem.sFactor : ""),
                                fontSize: sizeFont(15, 12)
                            }}
                        />


                    </UiEntity>

                </UiEntity>


            </UiEntity>


        </UiEntity>
    )
}

function getRelativePosition(type: string) {
    if (players.get(localUserId)!.activeScene) {

        switch (selectedItem.mode) {
            case EDIT_MODES.EDIT:
                // console.log('objec position', selectedCatalogItem)
                let transform = Transform.get(selectedItem.entity)

                switch (type) {
                    case 'x':
                        return transform.position.x.toFixed(2)
                    case 'y':
                        return transform.position.y.toFixed(2)
                    case 'z':
                        return (transform.position.z).toFixed(2)
                }
                break;

            case EDIT_MODES.GRAB:
                let scene = players.get(localUserId)!.activeScene!.parentEntity
                let sceneTransform = Transform.get(scene).position
                const {position, rotation} = Transform.get(engine.PlayerEntity)

                const forwardVector = Vector3.rotate(Vector3.scale(Vector3.Forward(), 4), rotation)
                const finalPosition = Vector3.add(position, forwardVector)

                finalPosition.x = finalPosition.x - sceneTransform.x
                // finalPosition.y = finalPosition.y - sceneTransform.y
                finalPosition.z = finalPosition.z - sceneTransform.z

                // console.log('scene position', sceneTransform)
                // console.log('objec position', finalPosition)

                switch (type) {
                    case 'x':
                        return finalPosition.x.toFixed(2)
                    case 'y':
                        return finalPosition.y.toFixed(2)
                    case 'z':
                        return (finalPosition.z + 4).toFixed(2)
                }
                break;
        }

    } else {
        return ""
    }


}

function getRotationValue(type: string) {
    if (!selectedItem || !selectedItem.enabled) {
        return ""
    }


    if (type === 'x') {
        return Quaternion.toEulerAngles(Transform.get(selectedItem.entity).rotation).x.toFixed(2)
    } else if (type === 'y') {
        return Quaternion.toEulerAngles(Transform.get(selectedItem.entity).rotation).y.toFixed(2)
    } else if (type === 'z') {
        return Quaternion.toEulerAngles(Transform.get(selectedItem.entity).rotation).z.toFixed(2)
    }

}

function getScaleValue(type: string) {
    if (!selectedItem || !selectedItem.enabled) {
        return ""
    }

    if (type === 'x') {
        return Transform.get(selectedItem.entity).scale.x
    } else if (type === 'y') {
        return Transform.get(selectedItem.entity).scale.y
    } else if (type === 'z') {
        return Transform.get(selectedItem.entity).scale.z
    }
}


function getIcon(type: string) {
    switch (type) {
        case 'left':
            if (pressed.type) {
                return uiSizes.leftCarotPressed
            } else {
                return uiSizes.leftCarot
            }
    }
}

function getModifierIcon() {
    if (selectedItem && selectedItem.enabled) {
        switch (selectedItem.modifier) {
            case EDIT_MODIFIERS.POSITION:
                if (pressed.modifer) {
                    return uiSizes.scaleIconPressed
                } else {
                    return uiSizes.scaleIcon
                }

            case EDIT_MODIFIERS.ROTATION:
                if (pressed.modifer) {
                    return uiSizes.rotationIconPressed
                } else {
                    return uiSizes.rotationIcon
                }

            case EDIT_MODIFIERS.SCALE:
                if (pressed.modifer) {
                    return uiSizes.positionIconPressed
                } else {
                    return uiSizes.positionIcon
                }
        }
    } else {
        return ""
    }
}