import ReactEcs, {Input, UiEntity} from '@dcl/sdk/react-ecs'
import {Color4, Quaternion, Vector3} from '@dcl/sdk/math'
import { Transform, engine } from '@dcl/sdk/ecs'
import { localPlayer, localUserId } from '../../../components/Player'
import { COMPONENT_TYPES, EDIT_MODIFIERS, EDIT_MODES } from '../../../helpers/types'
import { selectedItem, sendServerEdit, toggleModifier } from '../../../modes/Build'
import { sizeFont, calculateSquareImageDimensions, getImageAtlasMapping } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { visibleComponent } from '../EditAssetPanel'
import resources from '../../../helpers/resources'
import { setUIClicked } from '../../ui'

let pressed: any = {}

export function EditTransform() {
    return (
        <UiEntity
            key={resources.slug + "edittransformpanel"}
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '95%',
                display: visibleComponent === COMPONENT_TYPES.TRANSFORM_COMPONENT ? 'flex' : 'none',
            }}
            // uiBackground={{color:Color4.Red()}}//
        >

            {/* PRS information container */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '100%',
                    height: '100%',
                }}
                // uiBackground={{color:Color4.Teal()}}
            >

                {/* position row */}
                <TransformInputModifiers modifier={EDIT_MODIFIERS.POSITION}
                                         factor={selectedItem && selectedItem.pFactor}
                                         valueFn={getRelativePosition}/>

                {/* rotation row */}
                <TransformInputModifiers modifier={EDIT_MODIFIERS.ROTATION}
                                         factor={selectedItem && selectedItem.rFactor}
                                         valueFn={getRotationValue}/>

                {/* scale row */}
                <TransformInputModifiers modifier={EDIT_MODIFIERS.SCALE}
                                         factor={selectedItem && selectedItem.sFactor}
                                         valueFn={getScaleValue}/>
            </UiEntity>
        </UiEntity>
    )
}

export function TransformInputModifiers(props: { modifier: EDIT_MODIFIERS, factor: number, valueFn: Function, rowHeight?:any, override?:any }) {

    const modifierName =
        props.modifier === EDIT_MODIFIERS.POSITION ? "Position" :
            props.modifier === EDIT_MODIFIERS.ROTATION ? "Rotation" : "Scale"

    return (

        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: props.rowHeight ? `${props.rowHeight}` : '35%',
                margin: {top: '1%', bottom: '1%'}
            }}
            // uiBackground={{color:Color4.Black()}}
        >

            {/* left side items */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '80%',
                    height: '100%',
                }}
                // uiBackground={{color:Color4.Black()}}
            >

                {/* header */}
                <UiEntity
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

                </UiEntity>

                {/* label value row */}
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

                    {/* x label  */}
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '30%',
                            height: '100%',
                        }}
                        // uiBackground={{color:Color4.Green()}}
                        uiText={{
                            value: "X: " + (selectedItem && selectedItem.enabled ? props.valueFn("x") : ""),
                            fontSize: sizeFont(25, 12),
                            textAlign: 'middle-center'
                        }}
                    >
                    </UiEntity>

                    {/* y label  */}
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '30%',
                            height: '100%',
                        }}
                        // uiBackground={{color:Color4.Blue()}}
                        uiText={{
                            value: "Y: " + (selectedItem && selectedItem.enabled ? props.valueFn("y") : ""),
                            fontSize: sizeFont(25, 12),
                            textAlign: 'middle-center'
                        }}
                    >
                    </UiEntity>

                    {/* z label  */}
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '30%',
                            height: '100%',
                        }}
                        // uiBackground={{color:Color4.Teal()}}
                        uiText={{
                            value: "Z: " + (selectedItem && selectedItem.enabled ? props.valueFn("z") : ""),
                            fontSize: sizeFont(25, 12),
                            textAlign: 'middle-center'
                        }}
                    >
                    </UiEntity>


                </UiEntity>

                {/* value input row */}
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
                                if(props.override){
                                    props.override('x', parseFloat(value), true)
                                    // updateSetPositionEntityPosition('x', parseFloat(value), true)
                                    return
                                }
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
                                if(props.override){
                                    props.override('x', parseFloat(value), true)
                                    // updateSetPositionEntityPosition('y', parseFloat(value), true)
                                    return
                                }
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
                                if(props.override){
                                    props.override('x', parseFloat(value), true)
                                    // updateSetPositionEntityPosition('z', parseFloat(value), true)
                                    return
                                }
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
                            // value={"" + (selectedItem && selectedItem.enabled ? props.valueFn("z") : "")}
                        />

                    </UiEntity>
                </UiEntity>

                {/* button modifiers row // */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        alignContent: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        height: '30%',
                        margin: {top: '1%'}
                    }}
                    // uiBackground={{color:Color4.Green()}}
                >

                    {/* x modifier buttons  */}
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '30%',
                            height: '100%',
                        }}
                    >
                        {/* x positive */}
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
                                if(props.override){
                                    props.override('x', 1)
                                    // updateSetPositionEntityPosition('x', 1)
                                    return
                                }
                                sendServerEdit(props.modifier, 'x', 1, false)
                            }}
                        />


                        {/* x negative */}
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
                                if(props.override){
                                    props.override('x', -1)
                                    // updateSetPositionEntityPosition('x', -1)
                                    return
                                }
                                sendServerEdit(props.modifier, 'x', -1, false)

                                pressed.left = true
                            }}
                        />
                    </UiEntity>

                    {/* y modifier buttons   */}
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

                        {/* y positive */}
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
                                if(props.override){
                                    props.override('y', 1)
                                    // updateSetPositionEntityPosition('y', 1)
                                    return
                                }
                                sendServerEdit(props.modifier, 'y', 1, false)
                            }}
                        />

                        {/* y negative */}
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
                                setUIClicked(true)
                                if(props.override){
                                    props.override('y', -1)
                                    // updateSetPositionEntityPosition('y', -1)
                                    return
                                }
                                sendServerEdit(props.modifier, 'y', -1, false)

                                pressed.left = true
                            }}
                            onMouseUp={()=>{
                                setUIClicked(false)
                            }}
                        />
                    </UiEntity>

                    {/* z modifier buttons   */}
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

                        {/* z positive  */}
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
                                setUIClicked(true)
                                if(props.override){
                                    props.override('z', 1)
                                    // updateSetPositionEntityPosition('z', 1)
                                    return
                                }
                                sendServerEdit(props.modifier, 'z', 1, false)
                            }}
                            onMouseUp={()=>{
                                setUIClicked(false)
                            }}
                        />

                        {/* z negative  */}
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
                                setUIClicked(true)
                                if(props.override){
                                    props.override('z', -1)
                                    // updateSetPositionEntityPosition('z', -1)
                                    return
                                }
                                sendServerEdit(props.modifier, 'z', -1, false)

                                pressed.left = true
                            }}
                            onMouseUp={()=>{
                                setUIClicked(false)
                            }}
                        />
                    </UiEntity>
                </UiEntity>
            </UiEntity>

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '5%',
                    height: '100%',
                }}
                //uiBackground={{color:Color4.Black()}}
            >
                {/* scale group modifier  */}
                {modifierName === "Scale" && <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        //padding: {top: '25%'}
                    }}
                    //uiBackground={{color:Color4.Green()}}
                >

                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',// calculateSquareImageDimensions(3.5).width,
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
                            sendServerEdit(props.modifier, 'x', 1, false)
                            sendServerEdit(props.modifier, 'y', 1, false)
                            sendServerEdit(props.modifier, 'z', 1, false)
                        }}
                    />

                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',//calculateSquareImageDimensions(3.5).width,
                            height: calculateSquareImageDimensions(3.5).height,
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
                            sendServerEdit(props.modifier, 'y', -1, false)
                            sendServerEdit(props.modifier, 'z', -1, false)

                            pressed.left = true
                        }}
                    />
                </UiEntity>}


            </UiEntity>


            {/* Right side items */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '15%',
                    height: '100%',
                }}
                // uiBackground={{color:Color4.Black()}}
            >

                {/* precision value modifier parent */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        margin: {top: '1%', bottom: '1%'}
                    }}
                    //uiBackground={{color:Color4.Black()}}
                >

                    {/* precision value modifier header */}
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


                    {/* precision modifier main area */}
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                        }}
                        //uiBackground={{color:Color4.Red()}}
                    >


                        {/* microscope button  */}
                        <UiEntity
                            uiTransform={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '75%',// calculateSquareImageDimensions(5).width,
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
                                toggleModifier(props.modifier)
                            }}
                        />

                        {/* precision value display */}
                        <UiEntity
                            uiTransform={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '25%', //calculateSquareImageDimensions(5).width,
                                height: calculateSquareImageDimensions(4).height,
                                margin: {right: '2%'}
                            }}
                            uiText={{
                                value: "" + (props.factor ?? ""),
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
    if (localPlayer.activeScene) {

        switch (selectedItem.mode) {
            case EDIT_MODES.EDIT:
                // console.log('objec position', selectedCatalogItem)
                let transform = Transform.get(selectedItem.entity)

                switch (type) {
                    case 'x':
                        return transform.position.x.toFixed(3)
                    case 'y':
                        return transform.position.y.toFixed(3)
                    case 'z':
                        return (transform.position.z).toFixed(3)
                }
                break;

            case EDIT_MODES.GRAB:
                let scene = localPlayer.activeScene!.parentEntity
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
        return Quaternion.toEulerAngles(Transform.get(selectedItem.entity).rotation).x.toFixed(3)
    } else if (type === 'y') {
        return Quaternion.toEulerAngles(Transform.get(selectedItem.entity).rotation).y.toFixed(3)
    } else if (type === 'z') {
        return Quaternion.toEulerAngles(Transform.get(selectedItem.entity).rotation).z.toFixed(3)
    }

}

function getScaleValue(type: string) {
    if (!selectedItem || !selectedItem.enabled) {
        return ""
    }

    if (type === 'x') {
        return Transform.get(selectedItem.entity).scale.x.toFixed(3)
    } else if (type === 'y') {
        return Transform.get(selectedItem.entity).scale.y.toFixed(3)
    } else if (type === 'z') {
        return Transform.get(selectedItem.entity).scale.z.toFixed(3)
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