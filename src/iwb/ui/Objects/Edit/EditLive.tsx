
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import resources, { colors, colorsLabels } from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { CATALOG_IDS, COMPONENT_TYPES, EDIT_MODIFIERS, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
import { visibleComponent } from '../EditAssetPanel'
import { localPlayer } from '../../../components/Player'
import { setUIClicked } from '../../ui'
import { uiSizes } from '../../uiConfig'
import { Billboard, BillboardMode, ColliderLayer, Entity, GltfContainer, Material, MeshCollider, MeshRenderer, TextShape, Transform, engine } from '@dcl/sdk/ecs'
import { TransformInputModifiers } from './EditTransform'
import { getWorldPosition } from '@dcl-sdk/utils'
import { utils } from '../../../helpers/libraries'

let levelSpawnEntity:Entity
let levelSpawnArrowEntity:Entity

let bouncePosition:any
let bounceLook:any

let bounceName:string = ""
let adminName:string = ""

let bounceLocations:any[] = []
let bounceLocationEntities:Entity[] = []
let admins:any[] = []

export let liveView:string = "main"

function updateAdmins(){
    admins.length = 0

    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }
    
    let live = scene[COMPONENT_TYPES.LIVE_COMPONENT].get(selectedItem.aid)
    if(!live){
        return
    }
    live.admins.forEach((admin:any)=>{
        admins.push(admin)
    })

}

export function updateLiveBouncerPositions(){
    bounceLocations.length = 0

    resetCurrentBouncerSpawns()
    liveView !== "main" ? addCurrentSpawns() : null

    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }
    
    let live = scene[COMPONENT_TYPES.LIVE_COMPONENT].get(selectedItem.aid)
    if(!live){
        return
    }

    if(live && live.p.length > 0){
        live.p.forEach((position:any, i:number)=>{
            bounceLocations.push({name: live.n[i], position:position})
        })
    }
    console.log('bounce locations are', bounceLocations)
}

export function updateEditLiveView(view:string){
    liveView = view

    if(liveView === "bouncer"){
        addCurrentSpawns()
    }

    if(liveView === "admins"){
        updateAdmins()//
    }
}

export function resetLiveSpawnEntity(){
    engine.removeEntityWithChildren(levelSpawnEntity)
    engine.removeEntity(levelSpawnArrowEntity)
    bounceLook = undefined
    bouncePosition = undefined
    bounceName = ""
    adminName = ""
}

export function resetCurrentBouncerSpawns(){
    bounceLocationEntities.forEach((entity:Entity)=>{
        engine.removeEntityWithChildren(entity)
    })
    bounceLocationEntities.length = 0
}

export function addCurrentSpawns(){
    bounceLocations.forEach((location:any)=>{
        let entity = engine.addEntity()
        bounceLocationEntities.push(entity)
        MeshRenderer.setBox(entity)
        Material.setPbrMaterial(entity, {albedoColor:Color4.create(1,0,0,.5)})
        Transform.create(entity, {position: location.position, scale: Vector3.create(1,4,1)})
        let text = engine.addEntity()
        TextShape.create(text, {text:location.name, fontSize:5})
        Transform.create(text, {parent: entity, position: Vector3.create(0,.25,0), scale: Vector3.create(1,.25,1)})
    })
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
    }
    )

    TextShape.create(levelSpawnEntity, {text:"Bounce Here", fontSize:3})
    Transform.createOrReplace(footing, {parent:levelSpawnEntity, rotation:Quaternion.fromEulerDegrees(90,0,0)})

    levelSpawnArrowEntity = engine.addEntity()
    MeshRenderer.setBox(levelSpawnArrowEntity)
    MeshCollider.setBox(levelSpawnArrowEntity, ColliderLayer.CL_NONE)
    Material.setPbrMaterial(levelSpawnArrowEntity, {albedoColor: Color4.create(0,0,1,.5)})
    TextShape.create(levelSpawnArrowEntity, {text:"Bounce Look", fontSize:3})
    Transform.createOrReplace(levelSpawnArrowEntity, {
        parent:scene.parentEntity, 
        }
    )

    bounceLook = Transform.get(levelSpawnArrowEntity)
    bouncePosition = Transform.get(levelSpawnEntity)
}

export function updateLevelSpawnEntity(direction:string, factor:number, manual?:boolean){
    let transform:any = Transform.getMutable(levelSpawnEntity).position
    transform[direction] = manual ? factor : transform[direction] + (factor * selectedItem.pFactor)
    let position = getWorldPosition(levelSpawnEntity)
    bouncePosition = {...position}
}

export function updateLevelSpawnLookEntity(direction:string, factor:number, manual?:boolean){
    let transform:any = Transform.getMutable(levelSpawnArrowEntity).position
    transform[direction] = manual ? factor : transform[direction] + (factor * selectedItem.pFactor)
    let position = getWorldPosition(levelSpawnArrowEntity)
    bounceLook = {...position}
}

export function EditLive() {
    return (
        <UiEntity
            key={resources.slug + "edit::live::panel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.LIVE_COMPONENT ? 'flex' : 'none',
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
                display: liveView === "main" ? "flex" : "none"
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
            uiText={{value:"Live Panel Options", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
            />

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
            uiText={{value: "Admins", fontSize: sizeFont(30, 20)}}
            onMouseDown={() => {
                setUIClicked(true)
                updateEditLiveView("admins")
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
                margin:{bottom:'1%'}
            }}
            uiBackground={{color: Color4.Black()}}
            uiText={{value: "Bouncer", fontSize: sizeFont(30, 20)}}
            onMouseDown={() => {
                setUIClicked(true)
                updateEditLiveView("bouncer")
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
        />

        </UiEntity>

        {/* bouncer view */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: liveView === "bouncer" ? "flex" : "none"
            }}
        >

            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                }}
            >
                 <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '70%',
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
        uiText={{value:"Bouncer Locations", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />
            </UiEntity>

            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '30%',
                    height: '100%',
                    margin: {left: "1%", right: "1%"}
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                }}
                uiText={{value: "Add New", fontSize: sizeFont(20, 16)}}
                onMouseDown={() => {
                    setUIClicked(true)
                    liveView = "add-bounce-spawn"
                    addLevelSpawnEntity()
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
            />

            </UiEntity>

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent:'center',
                width: '100%',
                height: '10%',
            }}
                uiText={{value:"Current Locations", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
            />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                alignContent:'center',
                width: '100%',
                height: '45%',
            }}
            >

                {selectedItem && 
                selectedItem.enabled && 
                liveView === "bouncer" && 
                
                getLocations()
                }
                
            </UiEntity>


        </UiEntity>

                {/* bouncer add location view */}
                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '100%',
                    height: '100%',
                    display: liveView === "add-bounce-spawn" ? "flex" : "none"
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
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '50%',
                        height: '100%',
                        margin:{bottom:'1%'}
                    }}
                    uiText={{value:"Add Bouncer Name", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
                    />

            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '45%',
                    height: '90%',
                    margin: {left: "1%", right: "1%", top:'2%'}
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'//
                    },
                    uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                }}
                uiText={{value: "Add Location", fontSize: sizeFont(20, 16)}}
                onMouseDown={() => {
                    setUIClicked(true)
                    updateMetadata(COMPONENT_TYPES.LIVE_COMPONENT, "addBounce", {p:bouncePosition, l:bounceLook, n:bounceName})
                    updateEditLiveView('bouncer')
                    utils.timers.setTimeout(()=>{
                        resetLiveSpawnEntity()
                        updateLiveBouncerPositions()
                    }, 200)
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
            />

            </UiEntity>



        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignContent: 'center',
                width: '100%',
                height: '10%',
            }}
            >
            <Input
                onSubmit={(value) => {
                    bounceName = value.trim()
                }}
                onChange={(value) => {
                    bounceName = value.trim()
                }}
                fontSize={sizeFont(20, 15)}
                placeholder={'Enter Name'}
                placeholderColor={Color4.White()}
                uiTransform={{
                    width: '100%',
                    height: '100%',
                }}
                color={Color4.White()}
            />
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
        uiText={{value:"Add Bouncer Location", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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
        uiText={{value:"Add Bouncer Look", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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

            <AdminView/>

        </UiEntity>
    )
}

function AdminView(){
    return(
        <UiEntity
            key={resources.slug + "edit::live::panel::admin"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.LIVE_COMPONENT && liveView === "admins" ? 'flex' : 'none',
            }}
        >


    <UiEntity
    uiTransform={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        width: '100%',
        height: '10%',
    }}
    uiText={{value:"Add Admin", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
    />

<UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'center',
                width: '100%',
                height: '10%',
            }}
            >
                <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignContent: 'center',
                width: '80%',
                height: '100%',
            }}
            >
            <Input
                onSubmit={(value) => {
                    adminName = value.trim()
                }}
                onChange={(value) => {
                    adminName = value.trim()
                }}
                fontSize={sizeFont(20, 15)}
                placeholder={'Enter wallet'}
                placeholderColor={Color4.White()}
                uiTransform={{
                    width: '100%',
                    height: '100%',
                }}
                color={Color4.White()}
            />
        </UiEntity>

        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignContent: 'center',
                width: '20%',
                height: '100%',
            }}
            >

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(4, getAspect(uiSizes.buttonPillBlue)).width,
            height: calculateImageDimensions(4,getAspect(uiSizes.buttonPillBlue)).height,
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
        }}
        onMouseDown={() => {
            setUIClicked(true)
            updateMetadata(COMPONENT_TYPES.LIVE_COMPONENT, "addadmin", adminName)
            utils.timers.setTimeout(()=>{
                updateAdmins()
            }, 200)
            setUIClicked(false)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
        uiText={{value: "Add", color:Color4.White(), fontSize:sizeFont(20,15)}}
        />
            </UiEntity>

            </UiEntity>


            <UiEntity
    uiTransform={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        width: '100%',
        height: '10%',
    }}
    uiText={{value:"Current Admins", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
    />

    {
        visibleComponent === COMPONENT_TYPES.LIVE_COMPONENT &&
        liveView === "admins" &&
        generateAdminRows()
    }


        </UiEntity>
    )
}

function updateMetadata(component:any, action:string, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
        {
            component:component,
            aid:selectedItem.aid, 
            sceneId:selectedItem.sceneId,
            action:action, 
            data:value
        }
    )
}

function getLocations(){
    let arr:any[] = []
    let count = 0
    bounceLocations.forEach((bouncer:any, i:number)=>{
        arr.push(<Row data={{name:bouncer.name, position:bouncer.position}} rowCount={count} />)
        count++
    })
    return arr
}

function Row(info:any){
    let data:any = info.data
    return(
        <UiEntity
        key={resources.slug + "bouncer-posiiton-row-"+ info.rowCount}
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
                margin:{top:"1%", bottom:'1%', left:"2%", right:'2%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.rowPillDark)}}
                >

            {/* action name column */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40%',
                height: '100%',
                margin:{left:'2%'}
            }}
            uiText={{value:"" + data.name, textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
            />

             <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40%', 
                height: '100%',
            }}
            uiText={{value:"{x:" + data.position.x + ", y:" + data.position.y + ", z:" + data.position.z + "}", fontSize:sizeFont(20,15), color:Color4.White()}}
            />

            {/* action edit buttons column */}
            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '100%',
            }}
            >

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).width,
                    height: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).height,
                    margin:{left:"1%"}
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas1.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.trashButton)
                }}
                onMouseDown={() => {
                    updateMetadata(COMPONENT_TYPES.LIVE_COMPONENT, "deletebounce", info.rowCount)
                    utils.timers.setTimeout(()=>{
                        updateLiveBouncerPositions()
                    }, 200)
                }}
            />
                </UiEntity>

            </UiEntity>
    )
}

function generateAdminRows(){
    let arr:any[] = []
    let count = 0
    admins.forEach((admin:any, i:number)=>{
        arr.push(<AdminRow admin={admin} rowCount={count} />)
        count++
    })
    return arr
}

function AdminRow(info:any){
    return(
        <UiEntity
        key={resources.slug + "live-admin-row-"+ info.rowCount}
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '12%',
                margin:{top:"1%", bottom:'1%', left:"2%", right:'2%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.rowPillDark)}}
                >

            {/* action name column */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80%',
                height: '100%',
                margin:{left:'2%'}
            }}
            uiText={{value:"" + info.admin, textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
            />

            {/* action edit buttons column */}
            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '100%',
            }}
            >

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).width,
                    height: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).height,
                    margin:{left:"1%"}
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas1.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.trashButton)
                }}
                onMouseDown={() => {
                    updateMetadata(COMPONENT_TYPES.LIVE_COMPONENT, "deleteadmin", info.admin)
                    utils.timers.setTimeout(()=>{
                        updateAdmins()
                    }, 200)
                }}
            />
                </UiEntity>

            </UiEntity>
    )
}
