import ReactEcs, {UiEntity} from '@dcl/sdk/react-ecs'
import { Actions, COMPONENT_TYPES, EDIT_MODIFIERS } from '../../../../helpers/types'
import { actionView, getActionList, newActionData, newActionIndex } from '../EditAction'
import resources from '../../../../helpers/resources'
import { Billboard, BillboardMode, Entity, Material, MeshRenderer, TextShape, Transform, engine } from '@dcl/sdk/ecs'
import { selectedItem } from '../../../../modes/Build'
import { TransformInputModifiers } from '../EditTransform'
// import { getEntity } from '../../../../components/IWB'
import { colyseusRoom } from '../../../../components/Colyseus'
import { Vector3 } from '@dcl/sdk/math'

let setEntity:Entity
let setLookEntity:Entity

export function resetMovePlayerEntity(){
    engine.removeEntity(setEntity)
    engine.removeEntity(setLookEntity)
}

export function addMovePlayerEntity(){
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }

    setEntity = engine.addEntity()
    MeshRenderer.setBox(setEntity)
    TextShape.createOrReplace(setEntity, {text: "Move Player Here", fontSize: 2})
    Material.setPbrMaterial(setEntity, {
        albedoColor:{r:209/255, g:177/255, b:140/255, a:.5}
    })
    Billboard.createOrReplace(setEntity, {billboardMode: BillboardMode.BM_Y})
    Transform.createOrReplace(setEntity, {position: Vector3.Zero(), parent:scene.parentEntity})

    setLookEntity = engine.addEntity()
    MeshRenderer.setBox(setLookEntity)
    TextShape.createOrReplace(setLookEntity, {text: "Player Look Here", fontSize: 2})
    Material.setPbrMaterial(setLookEntity, {
        albedoColor:{r:5/255, g:177/255, b:140/255, a:.5}
    })
    Billboard.createOrReplace(setLookEntity, {billboardMode: BillboardMode.BM_Y})
    Transform.createOrReplace(setLookEntity, {position: Vector3.Zero(), parent:scene.parentEntity})
}

export function updateMovePlayerPosition(direction:string, factor:number, manual?:boolean){
    console.log('updateing move player position')
    let transform:any = Transform.getMutable(setEntity).position
    transform[direction] = manual ? factor : transform[direction] + (factor * selectedItem.sFactor)

    newActionData.x = transform.x
    newActionData.y = transform.y
    newActionData.z = transform.z
}

export function updateMovePlayerLookPosition(direction:string, factor:number, manual?:boolean){
    console.log('updateing move player look position')
    let transform:any = Transform.getMutable(setLookEntity).position
    transform[direction] = manual ? factor : transform[direction] + (factor * selectedItem.sFactor)

    newActionData.xLook = transform.x
    newActionData.yLook = transform.y
    newActionData.zLook = transform.z
}

export function AddMovePlayerPanel(){
    return(
        <UiEntity
        key={resources.slug + "action::move::player::panel"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
        }}
        // uiBackground={{color:Color4.Green()}}//
    >

               {
            //    visibleComponent === COMPONENT_TYPES.ADVANCED_COMPONENT && 
               actionView === "add" && 
               getActionList()[newActionIndex] === Actions.MOVE_PLAYER.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()) &&

               <TransformInputModifiers modifier={EDIT_MODIFIERS.POSITION}
                    override={updateMovePlayerPosition}
                    rowHeight={'50%'}
                    factor={selectedItem && selectedItem.pFactor}
                    valueFn={(type:string)=>{
                        let transform = Transform.get(setEntity)
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

{
            //    visibleComponent === COMPONENT_TYPES.ADVANCED_COMPONENT && 
               actionView === "add" && 
               getActionList()[newActionIndex] === Actions.MOVE_PLAYER.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()) &&

               <TransformInputModifiers modifier={EDIT_MODIFIERS.POSITION}
                    override={updateMovePlayerLookPosition}
                    rowHeight={'50%'}
                    factor={selectedItem && selectedItem.pFactor}
                    valueFn={(type:string)=>{
                        let transform = Transform.get(setLookEntity)
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

//