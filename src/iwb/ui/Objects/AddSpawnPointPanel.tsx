import ReactEcs, {Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps} from '@dcl/sdk/react-ecs'
import {Color4, Quaternion, Vector3} from '@dcl/sdk/math'
import resources from '../../helpers/resources'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'
import { ColliderLayer, Entity, Material, MeshCollider, MeshRenderer, TextShape, Transform, engine } from '@dcl/sdk/ecs'
import { localPlayer } from '../../components/Player'
import { colyseusRoom, sendServerMessage } from '../../components/Colyseus'
import { EDIT_MODIFIERS, SERVER_MESSAGE_TYPES } from '../../helpers/types'
import { displaySceneDetailsPanel, refreshSpawns, scene, updateSceneDetailsView } from './SceneMainDetailPanel'
import { utils } from '../../helpers/libraries'
import { getWorldPosition } from '@dcl-sdk/utils'
import { TransformInputModifiers } from './Edit/EditTransform'
import { addBlankSelectedItem, selectedItem } from '../../modes/Build'

export let showCreateScenePanel = false

let levelSpawnEntity:Entity
let levelSpawnArrowEntity:Entity

let bouncePosition:any
let bounceLook:any

export function displayAddSpawnPointPanel(value: boolean, current?:boolean) {
    showCreateScenePanel = value

    if(value){
        addLevelSpawnEntity()
    }else{
        resetSpawnLocationEntities()
    }
}

export function resetSpawnLocationEntities(){
    engine.removeEntityWithChildren(levelSpawnEntity)
    engine.removeEntity(levelSpawnArrowEntity)
}

export function addLevelSpawnEntity(){
    if(scene){
        addBlankSelectedItem()

        levelSpawnEntity = engine.addEntity()

        let footing = engine.addEntity()
        MeshRenderer.setPlane(footing)
        MeshCollider.setPlane(footing)
        Material.setPbrMaterial(footing, {albedoColor: Color4.Green()})


        Transform.createOrReplace(levelSpawnEntity, {
            parent:scene.parentEntity,
        })

        TextShape.create(levelSpawnEntity, {text:"Spawn Here", fontSize:3})
        Transform.createOrReplace(footing, {parent:levelSpawnEntity, rotation:Quaternion.fromEulerDegrees(90,0,0)})

        levelSpawnArrowEntity = engine.addEntity()
        MeshRenderer.setBox(levelSpawnArrowEntity)
        MeshCollider.setBox(levelSpawnArrowEntity, ColliderLayer.CL_NONE)
        Material.setPbrMaterial(levelSpawnArrowEntity, {albedoColor: Color4.create(0,0,1,.5)})
        TextShape.create(levelSpawnArrowEntity, {text:"Spawn Look", fontSize:3})
        Transform.createOrReplace(levelSpawnArrowEntity, {
            parent:scene.parentEntity, 
            }
        )

        bounceLook = Transform.get(levelSpawnArrowEntity).position
        bouncePosition = Transform.get(levelSpawnEntity).position//
    }
}

export function updateLevelSpawnEntity(direction:string, factor:number, manual?:boolean){
    let transform:any = Transform.getMutable(levelSpawnEntity).position
    transform[direction] = manual ? factor : transform[direction] + (factor * selectedItem.pFactor)
    // let position = getWorldPosition(levelSpawnEntity)
    // bouncePosition = {...position}
    bouncePosition = {...transform}
}

export function updateLevelSpawnLookEntity(direction:string, factor:number, manual?:boolean){
    let transform:any = Transform.getMutable(levelSpawnArrowEntity).position
    transform[direction] = manual ? factor : transform[direction] + (factor * selectedItem.pFactor)
    // let position = getWorldPosition(levelSpawnArrowEntity)
    // bounceLook = {...position}
    bounceLook = {...transform}
}

export function createAddSpawnPointPanel() {
    return (

        <UiEntity
            key={resources.slug + "add::spawn::point:ui"}
            uiTransform={{
                // display:'flex',
                display: showCreateScenePanel ?'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent: 'center',
                width: calculateImageDimensions(25, getAspect(uiSizes.vertRectangleOpaque)).width,
                height: calculateImageDimensions(20,getAspect(uiSizes.vertRectangleOpaque)).height,
                positionType: 'absolute',
                position: {right: '3%', bottom: '1%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: resources.textures.atlas1
                },
                uvs: getImageAtlasMapping(uiSizes.vertRectangleOpaque)
            }}
        >

<UiEntity
    uiTransform={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '90%',
        height: '90%',
    }}
>
<UiEntity
uiTransform={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '10%',
    margin: {top: "2%"}
}}
uiText={{value:"Add Scene Spawn", textWrap:'nowrap', textAlign:'middle-center', fontSize:sizeFont(25,20)}}
/>


<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '95%',
                height: '35%',
                margin:{bottom:'1%'}
            }}
        >


            {Transform.has(levelSpawnEntity) &&
               <TransformInputModifiers modifier={EDIT_MODIFIERS.POSITION}
                    override={updateLevelSpawnEntity}
                    rowHeight={'100%'}
                    factor={selectedItem && selectedItem.pFactor}
                    entity={levelSpawnEntity}
                    valueFn={(type:string)=>{
                        let transform = Transform.get(levelSpawnEntity)
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


<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '95%',
                height: '35%',
                margin:{bottom:'1%'}
            }}
        >

            {Transform.has(levelSpawnArrowEntity) &&
                <TransformInputModifiers modifier={EDIT_MODIFIERS.POSITION}
                        override={updateLevelSpawnLookEntity}
                        rowHeight={'100%'}
                        factor={selectedItem && selectedItem.pFactor}
                        entity={levelSpawnArrowEntity}
                        valueFn={(type:string)=>{
                            let transform = Transform.get(levelSpawnArrowEntity)
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

{/* confirm/cancel row */}
<UiEntity
uiTransform={{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent:'center',
    justifyContent: 'center',
    width: '90%',
    height: '10%',
    margin:{top:"1%"}
}}
>

<UiEntity
    uiTransform={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: calculateImageDimensions(7, getAspect(uiSizes.buttonPillBlue)).width,
        height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlue)).height,
        margin: {right: "1%"}
    }}
    uiBackground={{
        textureMode: 'stretch',
        texture: {
            src: resources.textures.atlas2
        },
        uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
    }}
    uiText={{textWrap:'nowrap', value: "Save Spawn", fontSize:sizeFont(20,15), color:Color4.White()}}
    onMouseDown={() => {
        if(scene){
            sendServerMessage(
                SERVER_MESSAGE_TYPES.SCENE_ADDED_SPAWN,
                {
                    sp:bouncePosition,
                    cp:bounceLook,
                    sceneId: scene.id
                 }
            )
            displayAddSpawnPointPanel(false)
            utils.timers.setTimeout(()=>{
                displaySceneDetailsPanel(true)
                updateSceneDetailsView("Spawns")
            }, 500)
        }

    }}
    />

<UiEntity
    uiTransform={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: calculateImageDimensions(7, getAspect(uiSizes.buttonPillBlue)).width,
        height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlue)).height,
        margin: {left: "1%"}
    }}
    uiBackground={{
        textureMode: 'stretch',
        texture: {
            src: resources.textures.atlas2
        },
        uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
    }}
    uiText={{value: "Cancel", fontSize:sizeFont(20,15), color:Color4.White()}}
    onMouseDown={() => {
        displayAddSpawnPointPanel(false)
        displaySceneDetailsPanel(true)
        updateSceneDetailsView("Spawns")
    }}
    />
    </UiEntity>

</UiEntity>

        </UiEntity>
    )
}