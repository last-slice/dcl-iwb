import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Actions, COMPONENT_TYPES, EDIT_MODIFIERS, ENTITY_EMOTES, ENTITY_EMOTES_SLUGS } from '../../../../helpers/types'
import { newActionData, updateActionData } from '../EditAction'
import resources from '../../../../helpers/resources'
import { Entity, GltfContainer, Transform, engine } from '@dcl/sdk/ecs'
import { selectedItem } from '../../../../modes/Build'
import { TransformInputModifiers } from '../EditTransform'
import { colyseusRoom } from '../../../../components/Colyseus'
import { findAssetParent } from '../../../../components/Parenting'

let setTransformEntity:Entity

export function resetSetRotationEntity(){
    engine.removeEntity(setTransformEntity)
}

export function addsetRotationEntity(){
    setTransformEntity = engine.addEntity()

    if(GltfContainer.has(selectedItem.entity)){
        let gltf = GltfContainer.get(selectedItem.entity)
        GltfContainer.create(setTransformEntity, gltf)
    }

    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(scene){
        let transform = scene[COMPONENT_TYPES.TRANSFORM_COMPONENT].get(selectedItem.aid)
        if(transform){
            let newTransform:any = JSON.parse(JSON.stringify(transform))
                Transform.createOrReplace(setTransformEntity, {parent:findAssetParent(scene,selectedItem.aid), position:newTransform.p, scale:newTransform.s, rotation:Quaternion.fromEulerDegrees(newTransform.r.x, newTransform.r.y, transform.r.z)})

                newActionData.x = newTransform.r.x
                newActionData.y = newTransform.r.y
                newActionData.z = newTransform.r.z
        }
    }
}

export function updateSetPositionEntityRotation(direction:string, factor:number, manual?:boolean){
    let transform:any = Transform.getMutable(setTransformEntity)
    let eulerRotation:any = Quaternion.toEulerAngles(transform.rotation)

    eulerRotation[direction] = manual ? factor : transform[direction] + (factor * selectedItem.rFactor)

    transform.rotation = Quaternion.fromEulerDegrees(eulerRotation.x, eulerRotation.y, eulerRotation.z)

    newActionData.x = transform.x
    newActionData.y = transform.y
    newActionData.z = transform.z
}

export function AddSetRotationPanel(){
    return(
        <UiEntity
        key={resources.slug + "action::set::rotation::panel"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
        }}
        // uiBackground={{color:Color4.Green()}}
    >

               {/* position row */}

               {Transform.has(setTransformEntity) &&
               <TransformInputModifiers modifier={EDIT_MODIFIERS.ROTATION}
                    override={true}
                    rowHeight={'50%'}
                    factor={selectedItem && selectedItem.rFactor}
                    valueFn={(type:string)=>{
                        let transform = Transform.get(setTransformEntity)
                        let eulerRotation = Quaternion.toEulerAngles(transform.rotation)
                        switch (type) {
                            case 'x':
                                return eulerRotation.x.toFixed(3)
                            case 'y':
                                return eulerRotation.y.toFixed(3)
                            case 'z':
                                return eulerRotation.z.toFixed(3)
                        }
                    }}
                />
                }

    </UiEntity>
    )
}