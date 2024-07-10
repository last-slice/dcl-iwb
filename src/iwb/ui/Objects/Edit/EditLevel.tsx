
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { log } from '../../../helpers/functions'
import resources, { colors, colorsLabels } from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { CATALOG_IDS, COMPONENT_TYPES, EDIT_MODIFIERS, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
import { visibleComponent } from '../EditAssetPanel'
import { localPlayer } from '../../../components/Player'
import { setUIClicked } from '../../ui'
import { uiSizes } from '../../uiConfig'
import { Billboard, BillboardMode, ColliderLayer, Entity, GltfContainer, Material, MeshCollider, MeshRenderer, TextShape, Transform, engine } from '@dcl/sdk/ecs'
import { findAssetParent } from '../../../components/Parenting'
import { TransformInputModifiers } from './EditTransform'
import { getWorldPosition } from '@dcl-sdk/utils'

let levelStatuses:string[] = ["Live", "Edit"]
let levelName:string = ""

let levelNumber:number = 0
let levelStatusIndex:number = 0

let levelSpawnEntity:Entity
let levelSpawnArrowEntity:Entity

export let levelView:string = "main"

export function updateEditLevelView(view:string){
    levelView = view
}

export function resetLevelSpawnEntity(){
    engine.removeEntityWithChildren(levelSpawnEntity)
    engine.removeEntity(levelSpawnArrowEntity)
}

export function addLevelSpawnEntity(){
    levelSpawnEntity = engine.addEntity()

    let footing = engine.addEntity()
    MeshRenderer.setPlane(footing)
    MeshCollider.setPlane(footing)
    Material.setPbrMaterial(footing, {albedoColor: Color4.Green()})

    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    Transform.createOrReplace(levelSpawnEntity, {
        parent:findAssetParent(scene, selectedItem.aid), 
        position:scene[COMPONENT_TYPES.LEVEL_COMPONENT].get(selectedItem.aid).loadingSpawn,
    }
    )

    TextShape.create(levelSpawnEntity, {text:"Spawn Here", fontSize:3})
    Transform.createOrReplace(footing, {parent:levelSpawnEntity, rotation:Quaternion.fromEulerDegrees(90,0,0)})

    levelSpawnArrowEntity = engine.addEntity()
    MeshRenderer.setBox(levelSpawnArrowEntity)
    MeshCollider.setBox(levelSpawnArrowEntity, ColliderLayer.CL_NONE)
    Material.setPbrMaterial(levelSpawnArrowEntity, {albedoColor: Color4.create(0,0,1,.5)})
    TextShape.create(levelSpawnArrowEntity, {text:"Spawn Look", fontSize:3})
    Transform.createOrReplace(levelSpawnArrowEntity, {
        parent: findAssetParent(scene, selectedItem.aid), 
        position: Vector3.subtract(scene[COMPONENT_TYPES.LEVEL_COMPONENT].get(selectedItem.aid).loadingSpawnLook, Transform.get(scene.parentEntity).position)
        }
    )
}

export function updateLevelSpawnEntity(direction:string, factor:number, manual?:boolean){
    let transform:any = Transform.getMutable(levelSpawnEntity).position
    transform[direction] = manual ? factor : transform[direction] + (factor * selectedItem.pFactor)
    updateMetadata(COMPONENT_TYPES.LEVEL_COMPONENT, "loadingSpawn", {...transform})
}

export function updateLevelSpawnLookEntity(direction:string, factor:number, manual?:boolean){
    let transform:any = Transform.getMutable(levelSpawnArrowEntity).position
    transform[direction] = manual ? factor : transform[direction] + (factor * selectedItem.pFactor)
    let position = getWorldPosition(levelSpawnArrowEntity)
    updateMetadata(COMPONENT_TYPES.LEVEL_COMPONENT, "loadingSpawnLook", {x:parseFloat(position.x.toFixed(2)), y:parseFloat(position.y.toFixed(2)), z:parseFloat(position.z.toFixed(2))})
}

export function updateLevelInfo(){
    let scene = localPlayer.activeScene
    if(scene){
        let levelInfo = scene[COMPONENT_TYPES.LEVEL_COMPONENT].get(selectedItem.aid)
        if(levelInfo){
            levelNumber = levelInfo.number
            levelName = scene[COMPONENT_TYPES.NAMES_COMPONENT].get(selectedItem.aid).value
            levelStatusIndex = levelInfo.live ? 0 : 1
            levelView = "main"
        }
    }
}

export function EditLevel() {
    return (
        <UiEntity
            key={resources.slug + "edit::level::panel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.LEVEL_COMPONENT ? 'flex' : 'none',
            }}
        >


            {/* main level view */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: levelView === "main" ? "flex" : "none"
            }}
        >
                    <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
                margin:{bottom:"1%"}
            }}
        >
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '70%',
                    height: '100%',
                    margin:{right:'2%'}, 
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
        uiText={{value:"Level Name", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '70%',
            }}
        >

        <Input
            onChange={(value) => {
                updateMetadata(COMPONENT_TYPES.NAMES_COMPONENT, "value", value.trim())
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'' + levelName}
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
                    width: '30%',
                    height: '100%',
                    margin:{left:"2%"}
                }}
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
        uiText={{value:"Level Number", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '70%',
            }}
        >

        <Input
            onChange={(value) => {
                let number = parseInt(value.trim())
                if(!isNaN(number)){
                    updateMetadata(COMPONENT_TYPES.LEVEL_COMPONENT, "number", number)
                }
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'' + levelNumber}
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


        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
                margin:{bottom:"1%", top:"2%"}
            }}
        >
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40%',
                    height: '100%',
                    margin:{right:'2%'}, 
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
                uiText={{value:"Level Status", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
            />

                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '50%',
                    }}
            >
                <Dropdown
                    options={levelStatuses}
                    selectedIndex={levelStatusIndex}
                    onChange={selectlevelStatus}
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
                    width: '60%',
                    height: '100%',
                    margin:{left:'2%'}, 
                }}
            >
                <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
                        height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                    }}
                    uiText={{
                        value: "Update",
                        fontSize: sizeFont(25, 15),
                        color: Color4.White(),
                        textAlign: 'middle-center'
                    }}
                    onMouseDown={() => {
                        setUIClicked(true)
                        updateMetadata(COMPONENT_TYPES.LEVEL_COMPONENT, "live", levelStatusIndex === 0 ? true : false)
                    }}
                    onMouseUp={()=>{
                        setUIClicked(false)
                    }}
                />
            </UiEntity>

        </UiEntity>


        <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                }}
                uiBackground={{color: Color4.Black()}}
                uiText={{value: "Level Spawn", fontSize: sizeFont(30, 20)}}
                onMouseDown={() => {
                    setUIClicked(true)
                    addLevelSpawnEntity()
                    levelView = "spawn"
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
            />

        </UiEntity>

        {/* level spawn view */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: levelView === "spawn" ? "flex" : "none"
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
        uiText={{value:"Level Spawn Location", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

        
            {Transform.has(levelSpawnEntity) &&
               <TransformInputModifiers modifier={EDIT_MODIFIERS.POSITION}
                    override={updateLevelSpawnEntity}
                    rowHeight={'25%'}
                    factor={selectedItem && selectedItem.pFactor}
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

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{bottom:'1%'}
            }}
        uiText={{value:"Level Spawn Look", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

        
            {Transform.has(levelSpawnArrowEntity) &&
               <TransformInputModifiers modifier={EDIT_MODIFIERS.POSITION}
                    override={updateLevelSpawnLookEntity}
                    rowHeight={'25%'}
                    factor={selectedItem && selectedItem.pFactor}
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


        </UiEntity>
    )
}

function selectlevelStatus(index:number){
    levelStatusIndex = index
}

function updateMetadata(component:any, type:any, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
        {
            component:component,
            aid:selectedItem.aid, 
            sceneId:selectedItem.sceneId, 
            [type]:value
        }
    )
}