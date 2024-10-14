import { Color4, Quaternion } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Actions, COMPONENT_TYPES, EDIT_MODES, EDIT_MODIFIERS, ENTITY_EMOTES, ENTITY_EMOTES_SLUGS, SERVER_MESSAGE_TYPES, TWEEN_EASE_SLUGS, TWEEN_LOOP_SLUGS, TWEEN_TYPE_SLUGS } from '../../../../helpers/types'
import { calculateSquareImageDimensions, getImageAtlasMapping, sizeFont } from '../../../helpers'
import { newActionData, updateActionData } from '../EditAction'
import resources from '../../../../helpers/resources'
import { TransformInputModifiers } from '../EditTransform'
import { Animator, engine, Entity, GltfContainer, Transform } from '@dcl/sdk/ecs'
import { colyseusRoom, sendServerMessage } from '../../../../components/Colyseus'
import { findAssetParent } from '../../../../components/Parenting'
import { selectedItem } from '../../../../modes/Build'
import { uiSizes } from '../../../uiConfig'
import { setUIClicked } from '../../../ui'

let tweenTypeIndex:number = 0
let tweenEaseIndex:number = 0
let tweenLoopIndex:number = 0
let tweenDuration:number = 3
let tweenMoveRelative:boolean = true

let setPositionEntity:Entity

export let actionTweenView = "main"

export function resetTweenActionPanel(){
    tweenTypeIndex = 0
    tweenEaseIndex = 0
    tweenLoopIndex = 0
    tweenDuration = 3
    actionTweenView = "main"
    engine.removeEntity(setPositionEntity)
}

export function addTweenActionEntity(){
    setPositionEntity = engine.addEntity()
    console.log('selected item', selectedItem)

    if(GltfContainer.has(selectedItem.entity)){
        let gltf = GltfContainer.get(selectedItem.entity)
        GltfContainer.create(setPositionEntity, gltf)
        Animator.create(setPositionEntity)
    }

    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(scene){
        let transform = scene[COMPONENT_TYPES.TRANSFORM_COMPONENT].get(selectedItem.aid)
        if(transform){
            let newTransform:any = JSON.parse(JSON.stringify(transform))
                Transform.createOrReplace(setPositionEntity, {parent:findAssetParent(scene,selectedItem.aid), position:newTransform.p, scale:newTransform.s, rotation:Quaternion.fromEulerDegrees(newTransform.r.x, newTransform.r.y, transform.r.z)})

                newActionData.x = newTransform.p.x
                newActionData.y = newTransform.p.y
                newActionData.z = newTransform.p.z
        }
    }
}

export function updateTweenActionEntityPosition(direction:string, factor:number, manual?:boolean){
    let transform:any = Transform.getMutable(setPositionEntity).position
    transform[direction] = manual ? factor : transform[direction] + (factor * selectedItem.pFactor)

    newActionData.x = transform.x
    newActionData.y = transform.y
    newActionData.z = transform.z
}

export function updateTweenActionEntityRotation(direction:string, factor:number, manual?:boolean){
    let transform = Transform.getMutable(setPositionEntity)
    let rot:any = Quaternion.toEulerAngles(transform.rotation)

    rot[direction] = manual ? factor : rot[direction] + (factor * selectedItem.rFactor)
    transform.rotation = Quaternion.fromEulerDegrees(rot.x, rot.y, rot.z)

    newActionData.x = rot.x
    newActionData.y = rot.y
    newActionData.z = rot.z
}

export function updateTweenActionEntityScale(direction:string, factor:number, manual?:boolean){
    let transform:any = Transform.getMutable(setPositionEntity).scale
    transform[direction] = manual ? factor : transform[direction] + (factor * selectedItem.pFactor)

    newActionData.x = transform.x
    newActionData.y = transform.y
    newActionData.z = transform.z
}


export function AddTweenActionPanel(){
    return(
        <UiEntity
        key={resources.slug + "action::tween::panel"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display: actionTweenView === "main" ? 'flex' : 'none'
        }}
        // uiBackground={{color:Color4.Green()}}
    >

        {/* select types row */}
        <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '12%',
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
        <Dropdown
        options={[...["Select Tween Type"], ...TWEEN_TYPE_SLUGS]}
        selectedIndex={tweenTypeIndex}
        onChange={(index:number)=>{
            tweenTypeIndex = index
            newActionData.ttype = index - 1
        }}
        uiTransform={{
            width: '90%',
            height: '100%',
        }}
        // uiBackground={{color:Color4.Purple()}}
        color={Color4.White()}
        fontSize={sizeFont(20, 15)}
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
         <Dropdown
        options={[...["Select Ease Type"],...TWEEN_EASE_SLUGS]}
        selectedIndex={tweenEaseIndex}
        onChange={(index:number)=>{
            tweenEaseIndex = index
            newActionData.ip = index - 1
        }}
        uiTransform={{
            width: '90%',
            height: '100%',
        }}
        // uiBackground={{color:Color4.Purple()}}
        color={Color4.White()}
        fontSize={sizeFont(20, 15)}
    />
        </UiEntity>
        </UiEntity>

        {/* tween duration and loop row */}
        <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '12%',
            margin:{top:'2%'}
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
            onChange={(value)=>{
                newActionData.timer = parseFloat(value)
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'Enter Duration (seconds)'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '90%',
                height: '100%',
            }}
            ></Input>
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
         <Dropdown
        options={getLoopOptions()}
        selectedIndex={tweenLoopIndex}
        onChange={(index:number)=>{
            tweenLoopIndex = index
            newActionData.tloop = index - 1
        }}
        uiTransform={{
            width: '90%',
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
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
                margin:{top:'2%'},
                display: tweenLoopIndex === 4 ? "flex" : "none"
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
    >
         <Dropdown
        options={["CHOOSE AXIS", "X AXIS", "Y AXIS", "Z AXIS"]}
        selectedIndex={0}
        onChange={(index:number)=>{
            updateActionData({value:index})
        }}
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
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
                margin:{top:'1%'},
                display: tweenLoopIndex !== 4 ? "flex" : "none"
            }}
        >

                    {/* url label// */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
                height: '100%',
            }}
        uiText={{textWrap:'nowrap',value:"From Current Position", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '85%',
                height: '100%',
            }}
        >

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateSquareImageDimensions(4).width,
            height: calculateSquareImageDimensions(4).height,
            margin:{top:"1%", bottom:'1%'},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: tweenMoveRelative ? getImageAtlasMapping(uiSizes.toggleOnTrans) : getImageAtlasMapping(uiSizes.toggleOffTrans)
        }}
        onMouseDown={() => {
            setUIClicked(true)
            tweenMoveRelative = !tweenMoveRelative
            updateActionData({moveRel:tweenMoveRelative})
            setUIClicked(false)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
        />


        </UiEntity>


        </UiEntity>

        {/* change position panel */}
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '50%',
            margin:{top:"2%"},
            display: tweenTypeIndex === EDIT_MODIFIERS.POSITION + 1 ? 'flex' : 'none'
        }}
    >
         <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent:'center',
                width: '100%',
                height: '10%',
            }}
                uiText={{value:"Change End Position", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
            />

            {/* position row */}
            {Transform.has(setPositionEntity) &&
               <TransformInputModifiers modifier={EDIT_MODIFIERS.POSITION}
                    override={updateTweenActionEntityPosition}
                    rowHeight={'90%'}
                    factor={selectedItem && selectedItem.pFactor}
                    valueFn={(type:string)=>{
                        let transform = Transform.get(setPositionEntity)
                        switch (type) {
                            case 'x':
                                return transform.position.x.toFixed(3)
                            case 'y':
                                return transform.position.y.toFixed(3)
                            case 'z':
                                return (transform.position.z).toFixed(3)
                        }
                    }}
                />
                }

        </UiEntity>

        {/* change rotation panel */}
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '50%',
            margin:{top:"2%"},
            display: tweenTypeIndex === EDIT_MODIFIERS.POSITION + 2 && tweenLoopIndex !== 4 ? 'flex' : 'none'
        }}
    >
         <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent:'center',
                width: '100%',
                height: '10%',
            }}
                uiText={{value:"Change End Rotation", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
            />

            {/* position row */}
            {Transform.has(setPositionEntity) &&
               <TransformInputModifiers modifier={EDIT_MODIFIERS.ROTATION}
                    override={updateTweenActionEntityRotation}
                    rowHeight={'90%'}
                    factor={selectedItem && selectedItem.rFactor}
                    valueFn={(type:string)=>{
                        let transform = Transform.get(setPositionEntity)
                        let rot = Quaternion.toEulerAngles(transform.rotation)
                        switch (type) {
                            case 'x':
                                return rot.x.toFixed(3)
                            case 'y':
                                return rot.y.toFixed(3)
                            case 'z':
                                return rot.z.toFixed(3)
                        }
                    }}
                />
                }

        </UiEntity>

        {/* change scale panel */}
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '50%',
            margin:{top:"5%"},
            display: tweenTypeIndex === EDIT_MODIFIERS.POSITION + 3 ? 'flex' : 'none'
        }}
    >
         <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent:'center',
                width: '100%',
                height: '10%',
            }}
                uiText={{value:"Change End Scale", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
            />

            {/* scale row */}
            {Transform.has(setPositionEntity) &&
               <TransformInputModifiers modifier={EDIT_MODIFIERS.SCALE}
                    override={updateTweenActionEntityScale}
                    rowHeight={'90%'}
                    factor={selectedItem && selectedItem.sFactor}
                    valueFn={(type:string)=>{
                        let transform = Transform.get(setPositionEntity)
                        switch (type) {
                            case 'x':
                                return transform.scale.x.toFixed(3)
                            case 'y':
                                return transform.scale.y.toFixed(3)
                            case 'z':
                                return (transform.scale.z).toFixed(3)
                        }
                    }}
                />
                }

        </UiEntity>


    </UiEntity>
    )
}

function getLoopOptions(){
    if(tweenTypeIndex === EDIT_MODIFIERS.ROTATION + 1){
        return [...["Select Loop Type"],...TWEEN_LOOP_SLUGS, "KEEP ROTATING"]
    }else{
        return[...["Select Loop Type"],...TWEEN_LOOP_SLUGS]
    }
}