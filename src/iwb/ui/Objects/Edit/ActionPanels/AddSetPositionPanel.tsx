import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Actions, EDIT_MODIFIERS, ENTITY_EMOTES, ENTITY_EMOTES_SLUGS } from '../../../../helpers/types'
import { newActionData, updateActionData } from '../EditAction'
import resources from '../../../../helpers/resources'
import { Entity, GltfContainer, Transform, engine } from '@dcl/sdk/ecs'
import { selectedItem } from '../../../../modes/Build'
import { TransformInputModifiers } from '../EditTransform'
import { colyseusRoom } from '../../../../components/Colyseus'
import { findAssetParent } from '../../../../components/Parenting'

let setPositionEntity:Entity

export function resetSetPositionEntity(){
    engine.removeEntity(setPositionEntity)
}

export function addSetPositionEntity(){
    setPositionEntity = engine.addEntity()

    if(GltfContainer.has(selectedItem.entity)){
        let gltf = GltfContainer.get(selectedItem.entity)
        GltfContainer.create(setPositionEntity, gltf)
    }

    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(scene){
        let transform = scene.transforms.get(selectedItem.aid)
        if(transform){
            let newTransform:any = JSON.parse(JSON.stringify(transform))
                Transform.createOrReplace(setPositionEntity, {parent:findAssetParent(scene,selectedItem.aid), position:newTransform.p, scale:newTransform.s, rotation:Quaternion.fromEulerDegrees(newTransform.r.x, newTransform.r.y, transform.r.z)})

                newActionData.x = newTransform.p.x
                newActionData.y = newTransform.p.y
                newActionData.z = newTransform.p.z
        }
    }
}

export function updateSetPositionEntity(direction:string, factor:number, manual?:boolean){
    let transform:any = Transform.getMutable(setPositionEntity).position
    transform[direction] = manual ? factor : transform[direction] + (factor * selectedItem.pFactor)

    newActionData.x = transform.x
    newActionData.y = transform.y
    newActionData.z = transform.z
}

export function AddSetPositionPanel(){
    return(
        <UiEntity
        key={resources.slug + "action::set::position::panel"}
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

               {Transform.has(setPositionEntity) &&
               <TransformInputModifiers modifier={EDIT_MODIFIERS.POSITION}
                    override={updateSetPositionEntity}
                    rowHeight={'50%'}
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
    )
}