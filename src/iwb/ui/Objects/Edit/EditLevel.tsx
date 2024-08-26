
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { log } from '../../../helpers/functions'
import resources, { colors, colorsLabels } from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { CATALOG_IDS, COMPONENT_TYPES, EDIT_MODIFIERS, NOTIFICATION_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
import { visibleComponent } from '../EditAssetPanel'
import { localPlayer } from '../../../components/Player'
import { setUIClicked } from '../../ui'
import { uiSizes } from '../../uiConfig'
import { Billboard, BillboardMode, ColliderLayer, Entity, GltfContainer, Material, MeshCollider, MeshRenderer, TextShape, Transform, engine } from '@dcl/sdk/ecs'
import { findAssetParent } from '../../../components/Parenting'
import { TransformInputModifiers } from './EditTransform'
import { getWorldPosition } from '@dcl-sdk/utils'
import { showNotification } from '../NotificationPanel'

let levelStatuses:string[] = ["Live", "Edit"]

let levelStatusIndex:number = 0

let levelSpawnEntity:Entity
let levelSpawnArrowEntity:Entity

let levelInfo:any

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
        parent:scene.parentEntity, 
        position:{...scene[COMPONENT_TYPES.LEVEL_COMPONENT].get(selectedItem.aid).loadingSpawn},
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
        position: {...scene[COMPONENT_TYPES.LEVEL_COMPONENT].get(selectedItem.aid).loadingSpawn}
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
        levelInfo = scene[COMPONENT_TYPES.LEVEL_COMPONENT].get(selectedItem.aid)
        if(levelInfo){
            levelInfo.name = scene[COMPONENT_TYPES.NAMES_COMPONENT].get(selectedItem.aid).value
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
            placeholder={'' + (levelInfo && levelInfo.name)}
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
                    margin:{left:"2%"}//
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
        uiText={{textWrap:'nowrap', value:"Level Number", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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
            placeholder={'' + (levelInfo && levelInfo.number)}
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
                        showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Level status udpated!", animate:{enabled:true, return:true, time:3}})
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
                    margin:{bottom:'1%'}
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

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                }}
                uiBackground={{color: Color4.Black()}}
                uiText={{value: "Loading Screen", fontSize: sizeFont(30, 20)}}
                onMouseDown={() => {
                    setUIClicked(true)
                    levelView = "loading"
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

            {/* loading screen view */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: levelView === "loading" ? "flex" : "none",
                margin:{top:'1%'}
            }}
        >

            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{bottom:'1%'}
            }}
            >

            <UiEntity
            uiTransform={{
                flexDirection: 'row',
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
                    margin:{bottom:'1%'}
                }}
            uiText={{value:"Level Loading Screen", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
            />
            </UiEntity>

            <UiEntity
            uiTransform={{
                flexDirection: 'row',
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
                    width: calculateSquareImageDimensions(4).width,
                    height: calculateSquareImageDimensions(4).height,
                    margin:{top:"1%", bottom:'1%'},
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: levelInfo && levelInfo.loadingType >= 0 ? getImageAtlasMapping(uiSizes.toggleOnTrans) : getImageAtlasMapping(uiSizes.toggleOffTrans)
                }}
                onMouseDown={() => {
                    levelInfo.loadingType >= 0 ? levelInfo.loadingType = -1 : levelInfo.loadingType = 0
                    updateMetadata(COMPONENT_TYPES.LEVEL_COMPONENT, "loadingType", levelInfo.loadingType)
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
                    margin:{bottom:'1%'},
                    display: levelInfo && levelInfo.loadingType >= 0 ? 'flex' :'none'
                }}
            uiText={{value:"Loading Screen Type", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
            />


            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '20%',
                    margin:{bottom:'1%'},
                    display: levelInfo && levelInfo.loadingType >= 0 ? 'flex' :'none'
                }}
            >
                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
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
                    height: '50%',
                }}
            >
                <Dropdown
                options={['IWB', 'Custom']}
                selectedIndex={!levelInfo ? 0 :levelInfo.loadingType < 0 ? 0 : levelInfo.loadingType}
                onChange={selectStartScreenType}
                uiTransform={{
                    width: '100%',
                    height: '120%',
                }}
                color={Color4.White()}
                fontSize={sizeFont(20, 15)}
            />
            </UiEntity>

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '50%',
                    margin:{bottom:'1%'},
                    display: levelInfo && levelInfo.loadingType === 1 ? 'flex' : 'none'
                }}
            uiText={{value:"Enter Image URL", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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
                    <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateSquareImageDimensions(12).width,
                    height: calculateSquareImageDimensions(15).height,
                    display: !levelInfo || levelInfo.loadingType < 1 ? "none" : "flex"
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: '' + (levelInfo && levelInfo.loadingScreen)
                    },}}
                ></UiEntity>
                </UiEntity>
                
                </UiEntity>

                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin:{bottom:'1%'},
                    display: levelInfo && levelInfo.loadingType === 1 ? 'flex' : 'none'
                }}
            >
                <Input
                    onChange={(value) => {
                        levelInfo.loadingScreen = "" + value.trim()
                        updateMetadata(COMPONENT_TYPES.LEVEL_COMPONENT, "loadingScreen", levelInfo.loadingScreen)
                    }}
                    onSubmit={(value) => {
                        levelInfo.loadingScreen = "" + value.trim()
                        updateMetadata(COMPONENT_TYPES.LEVEL_COMPONENT, "loadingScreen", levelInfo.loadingScreen)
                    }}
                    fontSize={sizeFont(20,15)}
                    placeholder={'' + (levelInfo && levelInfo.loadingScreen)}
                    placeholderColor={Color4.White()}
                    color={Color4.White()}
                    uiTransform={{
                        width: '100%',
                        height: '100%',
                    }}
                />
            </UiEntity>






                    <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin:{bottom:'1%'},
                    display: levelInfo && levelInfo.loadingType >= 0 ? 'flex' :'none'
                }}
            uiText={{value:"Minimum Display Time (seconds)", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
            />

                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin:{bottom:'1%'},
                    display: levelInfo && levelInfo.loadingType >= 0 ? 'flex' :'none'
                }}
            >
                <Input
                    onChange={(value) => {
                        levelInfo.loadingMin = parseFloat(value.trim())
                        updateMetadata(COMPONENT_TYPES.LEVEL_COMPONENT, "loadingMin", levelInfo.loadingMin)
                    }}
                    onSubmit={(value) => {
                        updateMetadata(COMPONENT_TYPES.LEVEL_COMPONENT, "loadingMin", levelInfo.loadingMin)
                    }}
                    fontSize={sizeFont(20,15)}
                    placeholder={'' + (levelInfo && levelInfo.loadingMin)}
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

function selectStartScreenType(index:number){
    levelInfo.loadingType = index
    levelInfo.loadingScreen = ""
    updateMetadata(COMPONENT_TYPES.LEVEL_COMPONENT, "loadingType", index)
}
