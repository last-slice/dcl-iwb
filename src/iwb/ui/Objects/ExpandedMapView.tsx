import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import resources from '../../helpers/resources'
import { calculateImageDimensions, getAspect, dimensions, getImageAtlasMapping, sizeFont, calculateSquareImageDimensions } from '../helpers'
import { uiSizes } from '../uiConfig'
import { setUIClicked } from '../ui'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { colyseusRoom, sendServerMessage } from '../../components/Colyseus'
import { COMPONENT_TYPES, EDIT_MODIFIERS, IWBScene, NOTIFICATION_TYPES, SERVER_MESSAGE_TYPES, SOUND_TYPES } from '../../helpers/types'
import { addBoundariesForParcel, cancelParcelEdits, deleteCreationEntities, deleteParcelEntities, getParcels, greenBeam, isPositionInParcel, otherTempParcels, redBeam, tempParcels, tempPoolSceneParcelCount, tempScene, validateScene } from '../../modes/Create'
import { localUserId, localPlayer } from '../../components/Player'
import { formatDollarAmount } from '../../helpers/functions'
import { addBlankParcels, removeEmptyParcels, updateSceneParentRotation } from '../../components/Scene'
import { scene } from './SceneMainDetailPanel'
import { playSound } from '../../components/Sounds'
import { rotateUVs } from '../../../ui_components/utilities'
import { engine, Entity, GltfContainer, Transform } from '@dcl/sdk/ecs'
import { teleportToScene } from '../../modes/Play'
import { TransformInputModifiers } from './Edit/EditTransform'
import { getEntity } from '../../components/iwb'
import { getWorldPosition } from '@dcl-sdk/utils'
import { showNextNotification } from './NotificationPanel'

export let expandedMapshow = false
let navigation = false
let scenePool = false
export let editCurrentSceneParcels = false
export let editRotation = false

let xMin = -22
let xMax = 25
let yMin = -21
let yMax = 23
let sceneFactor = 1

let mapTiles:any[] = []
let currentSceneParcels:any[] = []
export let currentScenePoolParcels:any[] = []
let entities:any[] = []

let selectedScene:any

export let mainView = ""

export function displayExpandedMap(value:boolean, current?:boolean, nav?:boolean, pool?:boolean){
    expandedMapshow = value

    if(nav){
        navigation = true
    }else{
        navigation = false
    }

    if(pool){
        scenePool = true
    }else{
        scenePool = false
    }

    if(current){
        editRotation = false
        editCurrentSceneParcels = current
        currentSceneParcels = [...localPlayer.activeScene.pcls]
        createCurrentSceneBoundaries()
    }else{
        editCurrentSceneParcels = false
    }

    if(expandedMapshow){
        createMapTiles()
    }else{
        mapTiles.length = 0
        currentSceneParcels.length = 0
        selectedScene = undefined
    }

    console.log('otherparcels', otherTempParcels.size, Array.from(otherTempParcels.values()))
}

function createCurrentSceneBoundaries(){
    let guide = engine.addEntity()

    entities.push(guide)

    //left
    Transform.createOrReplace(guide, {
        position: Vector3.create(0, 0, 0),
        rotation: Quaternion.fromEulerDegrees(0, 0, 0),
        scale: Vector3.create(1, 20, 1),
        parent: scene?.parentEntity
    })
    GltfContainer.create(guide, {src: "assets/c43c3465-ce60-41b3-8400-3f5458e3b860.glb"})
    // currentSceneParcels.forEach((parcel:string, i:number)=>{

    //     let x = parseInt(parcel.split(",")[0])
    //     let y = parseInt(parcel.split(",")[1])
        
    //     let left = engine.addEntity()
    //     let right = engine.addEntity()
    //     let front = engine.addEntity()
    //     let back = engine.addEntity()
    
    //     entities.push(left)
    //     entities.push(right)
    //     entities.push(front)
    //     entities.push(back)

    //     //left
    //     Transform.createOrReplace(left, {
    //         position: Vector3.create(x * 16, 0, y * 16),
    //         rotation: Quaternion.fromEulerDegrees(0, 0, 0),
    //         scale: Vector3.create(1, 20, 1),
    //         // parent:parent
    //     })
    //     GltfContainer.create(left, {src: "assets/c43c3465-ce60-41b3-8400-3f5458e3b860.glb"})

    //         //right
    //     Transform.createOrReplace(right, {
    //         position: Vector3.create(x * 16 + 16, 0, y * 16),
    //         rotation: Quaternion.fromEulerDegrees(0, 0, 0),
    //         scale: Vector3.create(1, 20, 1),
    //         // parent:parent
    //     })
    //     GltfContainer.create(right, {src: "assets/c43c3465-ce60-41b3-8400-3f5458e3b860.glb"})

    //     // front
    //     Transform.createOrReplace(front, {
    //         position: Vector3.create(x * 16, 0, y * 16 + 16),
    //         rotation: Quaternion.fromEulerDegrees(0, 0, 0),
    //         scale: Vector3.create(1, 20, 1),
    //         // parent:parent
    //     })
    //     GltfContainer.create(front, {src: "assets/c43c3465-ce60-41b3-8400-3f5458e3b860.glb"})

    //     // back
    //     Transform.createOrReplace(back, {
    //         position: Vector3.create(x * 16 + 16, 0, y * 16 + 16),
    //         rotation: Quaternion.fromEulerDegrees(0, 0, 0),
    //         scale: Vector3.create(1, 20, 1),
    //         // parent:parent
    //     })
    //     GltfContainer.create(back, {src: "assets/c43c3465-ce60-41b3-8400-3f5458e3b860.glb"})
    // })
}

function removeCurrentSceneBoundaries(){
    entities.forEach((entity:Entity)=>{
        engine.removeEntity(entity)
    })
    entities.length = 0
}

function createMapTiles(){
    mapTiles.length = 0

    let mapParcels:any[] = []
    for(let y = yMax; y >= yMin; y--){
        let columns:any[] = []
        for(let x = xMin; x <= xMax; x++){
            columns.push({coords: x + "," + y})
        }
        mapParcels.push(columns)
    }

    let sceneParcels:any[] = []
    colyseusRoom.state.scenes.forEach((scene:any)=>{
      scene.pcls.forEach((parcel:string)=>{
        sceneParcels.push({parcel:parcel, color:scene.color})
        console.log('scene parcels are', sceneParcels)
      })
    })

    mapParcels.forEach(subArray => {
        subArray.forEach((obj:any) => {
            if(navigation){
                if(selectedScene && selectedScene.pcls.includes(obj.coords)){
                    obj.selected = true
                }else{
                    let parcel = sceneParcels.find((parcel:any)=> parcel.parcel === obj.coords)
                    if (parcel) {
                        obj.scene = true;
                        obj.color = parcel.color
                    }else{
                      obj.scene = false
                    }
                    obj.selected = false
                }
            }
            else{
                if(editCurrentSceneParcels){
                    if(currentSceneParcels.includes(obj.coords)){///
                        obj.selected = true
                    }else{
                        obj.selected = false
                    }
                }
                else{
                    let parcel = sceneParcels.find((parcel:any)=> parcel.parcel === obj.coords)
                    if (parcel) {
                        obj.scene = true
                        obj.color = parcel.color
                    }else{
                      obj.scene = false
                    }
                    obj.selected = false
                }
            }
        });
      });
    mapTiles = mapParcels
}

export function createExpandedMapView() {
    return (
        <UiEntity
        key={"" + resources.slug + "expanded-map-ui"}
            uiTransform={{
                display: expandedMapshow? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(45, getAspect(uiSizes.horizRectangle)).width,
                height: calculateImageDimensions(45, getAspect(uiSizes.horizRectangle)).height,
                positionType: 'absolute',
                position: { left: (dimensions.width - calculateImageDimensions(45, getAspect(uiSizes.horizRectangle)).width) / 2, bottom: '15%'}
            }}
        // uiBackground={{ color: Color4.Red() }}
        >

            {/* main bg container */}
            <UiEntity
                uiTransform={{
                    display:'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    justifyContent:'center'
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.horizRectangle)
                }}
                onMouseDown={()=>{
                    setUIClicked(true)
                    // if(navigation){
                    //     displayExpandedMap(false)
                    // }
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
            >

                {/* main content container */}
                <UiEntity
                uiTransform={{
                    display:'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent:'center',
                    width: '97%',
                    height: '87%',
                    margin:{left:"1%"},
                    padding:{left:"1%", right:'2%', bottom:'2%'}
                }}
                // uiBackground={{color:Color4.Teal()}}
                >
                    <MainLeftView />
                    <MainRightView />

                </UiEntity>

            </UiEntity>


        </UiEntity>
    )
}

function MainLeftView(){
   return(<UiEntity
    key={resources.slug + "map-view-left-container"}
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '25%',
        height: '100%',
        // display: navigation ? "none" : "flex"
    }}
    >

{/* clicked map navigatyion */}
<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: '100%',
        display: navigation ? "flex" : "none"
    }}
    >
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
        }}
    uiText={{value:"" + (selectedScene ? selectedScene.metadata.n : ""), fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
    />

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlue)).width,
            height: calculateImageDimensions(5,getAspect(uiSizes.buttonPillBlue)).height,
            margin:{right:"1%"},
            display: selectedScene ? "flex" : "none"
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
        }}
        onMouseDown={() => {
            setUIClicked(true)
            teleportToScene(selectedScene)
            displayExpandedMap(false)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
        uiText={{value: "Visit", color:Color4.White(), fontSize:sizeFont(20,15)}}
        />

        </UiEntity>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: '100%',
        display: navigation ? "none" : "flex"
    }}
    >
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
        }}
    uiText={{value:"" + (scenePool ? "Select Location" : editCurrentSceneParcels ? "Edit Parcels"  : "Create New Scene"), fontSize:sizeFont(30, 20), color:Color4.White(), textAlign:'middle-center'}}
    />

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            display: scenePool ? "flex" : "none"
        }}
    uiText={{value:"Required Parcels: " + tempPoolSceneParcelCount, fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-center'}}
    />


<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
        }}
    uiText={{value:"Parcels: " + tempParcels.size, fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-center'}}
    />



<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            display: !scenePool ? "flex" : "none"
        }}
    uiText={{value:"Poly Limit: " + (formatDollarAmount(getParcels() * 10000)), fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-center'}}
    />

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            display: !scenePool ? "flex" : "none"
        }}
    uiText={{value:"File Limit: " + (getParcels() >= 20 ? "300" : getParcels() * 15) + " MB", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-center'}}
    />

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(8, getAspect(uiSizes.buttonPillBlue)).width,
            height: calculateImageDimensions(5,getAspect(uiSizes.buttonPillBlue)).height,
            margin:{top:"2%"},
            // display: editCurrentSceneParcels ? "flex" : "none"//
            display:'none'
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
        }}
        onMouseDown={() => {
            setUIClicked(true)
            playSound(SOUND_TYPES.SELECT_3)
            editRotation = !editRotation
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
        uiText={{value:"" + (!editRotation ? "Edit Rotation" : "Edit Parcels"), color:Color4.White(), fontSize:sizeFont(25,15)}}
        />

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(8, getAspect(uiSizes.buttonPillBlue)).width,
            height: calculateImageDimensions(5,getAspect(uiSizes.buttonPillBlue)).height,
            margin:{top:"2%"},
            display:scenePool && currentScenePoolParcels.length === tempPoolSceneParcelCount ? "flex" : "none"
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
        }}
        onMouseDown={() => {
            setUIClicked(true)
            playSound(SOUND_TYPES.SELECT_3)
            sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_POOL_PLACE, {sceneId:tempScene.id, parcels:[...currentScenePoolParcels]})
            displayExpandedMap(false)
            deleteCreationEntities("")
            removeCurrentSceneBoundaries()
        }}
        uiText={{value: "Place Template", color:Color4.White(), fontSize:sizeFont(25,15)}}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
        />

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(8, getAspect(uiSizes.buttonPillBlue)).width,
            height: calculateImageDimensions(5,getAspect(uiSizes.buttonPillBlue)).height,
            margin:{top:"2%"},
             display: !scenePool ? "none" : "flex"
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
        }}
        onMouseDown={() => {
            setUIClicked(true)
            playSound(SOUND_TYPES.SELECT_3)
            cancelParcelEdits()
            removeCurrentSceneBoundaries()
            setUIClicked(false)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
        uiText={{value:"Cancel", color:Color4.White(), fontSize:sizeFont(25,15)}}
        />

        {/* create button */}
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(8, getAspect(uiSizes.buttonPillBlue)).width,
            height: calculateImageDimensions(5,getAspect(uiSizes.buttonPillBlue)).height,
            margin:{top:"2%"},
            display: scenePool ? "none" : "flex"
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
        }}
        onMouseDown={() => {
            setUIClicked(true)
            playSound(SOUND_TYPES.SELECT_3)
            validateScene()
            displayExpandedMap(false)
            deleteCreationEntities("")
            removeCurrentSceneBoundaries()
        }}
        uiText={{value: "" + (editCurrentSceneParcels ? "Save Edits": "Save Scene"), color:Color4.White(), fontSize:sizeFont(25,15)}}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
        />

        {/* close button */}
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(8, getAspect(uiSizes.buttonPillBlue)).width,
            height: calculateImageDimensions(5,getAspect(uiSizes.buttonPillBlue)).height,
            margin:{top:"2%"},
             display: scenePool ? "none" : "flex"
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
        }}
        onMouseDown={() => {
            setUIClicked(true)
            playSound(SOUND_TYPES.SELECT_3)
            cancelParcelEdits()
            removeCurrentSceneBoundaries()
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
        uiText={{value:"" + (editCurrentSceneParcels ? "Cancel" : "Cancel Scene"), color:Color4.White(), fontSize:sizeFont(25,15)}}
        />


        </UiEntity>


        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            alignSelf:'flex-end',
            justifyContent: 'center',
            width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlue)).width,
            height: calculateImageDimensions(5,getAspect(uiSizes.buttonPillBlue)).height,
            margin:{right:"1%"},
            display: selectedScene ? "flex" : "none",
            positionType:'absolute',
            position:{bottom:0}
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
        }}
        onMouseDown={() => {
            setUIClicked(true)
            displayExpandedMap(false)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
        uiText={{value: "Close", color:Color4.White(), fontSize:sizeFont(20,15)}}
        />

    </UiEntity>
   )
}//

function MainRightView(){
    return(

        <UiEntity
        key={resources.slug + "map-view-right-container"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: navigation ? '90%' : '75%',
            height: '100%',
            margin:{left:  navigation ? 0 : '1%'},
        }}
        
        >

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            display: editRotation ? "none" : 'flex'
        }}
        uiBackground={{color:Color4.create(1,1,1,.1)}}
        >

            {expandedMapshow && mapTiles.length > 0 && generateMapTiles()}

                <PlayerArrow/>

            </UiEntity>

        {/* edit rotation panel */}
            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display: editRotation ? "flex" : 'none'
        }}
        >

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
        }}
    uiText={{value:"Scene Rotation", fontSize:sizeFont(40, 30), color:Color4.White(), textAlign:'middle-center'}}
    />



<UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '70%',
            height: '15%',
        }}
    >

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '33%',
            height: '100%',
            margin:{left:'1%', right:'1%'}
        }}
    >
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(3, getAspect(uiSizes.leftArrow)).width,
            height: calculateImageDimensions(3,getAspect(uiSizes.leftArrow)).height,
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.leftArrow)
        }}
        onMouseDown={() => {
            setUIClicked(true)
            updateSceneParentRotation(scene, -90)
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
            width: '33%',
            height: '100%',
        }}
    uiText={{value:"" + (editCurrentSceneParcels ? Math.ceil(Quaternion.toEulerAngles(Transform.get(scene!.parentEntity).rotation).y).toFixed(0) : ""), fontSize:sizeFont(40, 30), color:Color4.White(), textAlign:'middle-center'}}
    />


    <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '33%',
            height: '100%',
            margin:{left:'1%', right:'1%'}
        }}
    >
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(3, getAspect(uiSizes.rightArrow)).width,
            height: calculateImageDimensions(3,getAspect(uiSizes.rightArrow)).height,
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.rightArrow)
        }}
        onMouseDown={() => {
            setUIClicked(true)
            updateSceneParentRotation(scene, 90)
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
    uiText={{value:"Scene Offset", fontSize:sizeFont(40, 25), color:Color4.White(), textAlign:'middle-center'}}
    />
    <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '70%',
            height: '30%',
        }}
    >
        {
            scene && 
        Transform.has(scene.parentEntity) &&
               <TransformInputModifiers modifier={EDIT_MODIFIERS.POSITION}
                    override={updateSceneOffset}
                    rowHeight={'100%'}
                    factor={sceneFactor}
                    entity={scene!.parentEntity}
                    noFactor={true}
                    valueFn={(type:string)=>{
                        let transform = Transform.getMutable(scene!.parentEntity)
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

        </UiEntity>
  
    )
}

function PlayerArrow(){
    return(
      <UiEntity
      key={resources.slug + "player::arrow::expanded::map"}
      uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width:calculateSquareImageDimensions(3).width,
          height: calculateSquareImageDimensions(3).height,
          positionType:'absolute',
          position: expandedMapshow ? getPlayerPosition() : {}
      }}
      uiBackground={{
        texture:{
            src: "images/map_arrow.png"
        },
        textureMode: 'stretch',
        uvs:rotateUVs(navigation && localPlayer && localPlayer.rotation ? localPlayer.rotation : 0)
      }}
      >

      </UiEntity>
    )
}

function getPlayerPosition(){
    let position = Transform.get(engine.PlayerEntity).position
    let x = Math.round(Math.abs(position.x) / 16)
    let y = Math.round(Math.abs(position.z) / 16)
    let left:any
    let bottom:any

    if(position.x < 0){
        let fromLeft = -23 + x
        fromLeft = ((Math.abs(fromLeft) / 51.5) * 100)
        left = `${fromLeft}%`
    }
    else if(x === 0){
        let fromLeft = 23
        fromLeft = (Math.abs(fromLeft) / 51.5) * 100
        left = `${fromLeft}%`
    }
    else{
        let fromLeft = 23 + x
        fromLeft = (Math.abs(fromLeft) / 51.5) * 100
        left = `${fromLeft}%`
    }

    if(y < 0){
        let fromBottom = -22 + y
        fromBottom = (Math.abs(fromBottom) / 52) * 100
        bottom = `${fromBottom}%`
    }
    else if(y === 0){
        let fromBottom = 22
        fromBottom = (Math.abs(fromBottom) / 52) * 100
        bottom = `${fromBottom}%`
    }
    else{
        let fromBottom = 22 + y
        fromBottom = (Math.abs(fromBottom) / 52) * 100
        bottom = `${fromBottom}%`
    }


    return {
        left:left,
        bottom:bottom
    }
}

function generateMapTiles(){
    let arr:any[] = []
    mapTiles.forEach((mapRow:any, rowCount:number)=>{
        arr.push(
            <UiEntity
            key={resources.slug + "expanded-map-row-" + rowCount}//
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '5%',
                    margin:{top:'0.1%'}
                }}
                // uiBackground={{
                //     textureMode: 'stretch',
                //     texture: {
                //         src: 'assets/atlas2.png'
                //     },
                //     uvs: i % 2 === 0 ? getImageAtlasMapping(uiSizes.rowPillLight)

                //         : //

                //         getImageAtlasMapping(uiSizes.rowPillDark)
                // }}
                // uiBackground={{color:Color4.Teal()}}
            >

                {generateMapRow(mapRow)}

            </UiEntity>
        )
    })
    return arr
}

function generateMapRow(data:any){
    let arr:any[] = []
    data.forEach((mapColumn:any, columnCount:number)=>{
        arr.push(
            <UiEntity
            key={resources.slug + "expanded-map-column-" + columnCount}
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2%',
                    height: '100%',
                    margin:{left: '0.1%', right:'0.1%'}
                }}
                uiBackground={{color: getBackground(mapColumn)}}
                // uiBackground={{color: parcel.cur ? Color4.create(0,1,0,.2) : parcel.scene ? Color4.create(.4,.5,.6,1) :  Color4.create(0,0,0,.2)}}
                // uiBackground={{color: Color4.create(0,0,0,.2)}}//
                onMouseDown={()=>{
                    setUIClicked(true)
                    playSound(SOUND_TYPES.SELECT_3)
                    if(scenePool){
                        if(currentScenePoolParcels.includes(mapColumn.coords)){
                            deleteParcelEntities(mapColumn.coords)
                            addBlankParcels([mapColumn.coords])
                            let index = currentScenePoolParcels.findIndex((i:any)=> i === mapColumn.coords)
                            if(index >=0){
                                currentScenePoolParcels.splice(index,1)
                            }
                        }else{
                            removeEmptyParcels([mapColumn.coords])
                            addBoundariesForParcel(mapColumn.coords, true, false)
                            currentScenePoolParcels.push(mapColumn.coords)
                        }
                        sendServerMessage(SERVER_MESSAGE_TYPES.SELECT_PARCEL, {
                            player: localUserId,
                            parcel: mapColumn.coords,
                            scene: 0,
                            current: editCurrentSceneParcels ? scene?.id : 0
                        })
                    }
                    else if(navigation){
                        selectScene(mapColumn.coords)
                        sendServerMessage(SERVER_MESSAGE_TYPES.SELECT_PARCEL, {
                            player: localUserId,
                            parcel: mapColumn.coords,
                            scene: 0,
                            current: editCurrentSceneParcels ? scene?.id : 0
                        })
                    }
                    else if(editCurrentSceneParcels){
                        console.log('editing current scene parcels')
                            //check if click is in current scene first
                        if(scene?.pcls.includes(mapColumn.coords)){
                            console.log('need to remove current scene parcel')

                            let isEmptyParcel = true
                            let calculatingParcelEntities = true
                            let serverScene = colyseusRoom.state.scenes.get(scene.id)

                            while(calculatingParcelEntities){
                                serverScene[COMPONENT_TYPES.TRANSFORM_COMPONENT].forEach((t:any, aid:string)=>{
                                    let entityInfo = getEntity(serverScene, aid)
                                    let position = getWorldPosition(entityInfo.entity) 
                                    // Check if this entity's position is within the parcel to delete
                                    if (isPositionInParcel(position, mapColumn.coords)) {
                                        console.log('Entties are still on parcel')
                                        isEmptyParcel = false
                                    }
                                })
                                calculatingParcelEntities = false
                            }

                            if(isEmptyParcel){
                                deleteParcelEntities(mapColumn.coords)
                                addBlankParcels([mapColumn.coords])
                                sendServerMessage(SERVER_MESSAGE_TYPES.SELECT_PARCEL, {
                                    player: localUserId,
                                    parcel: mapColumn.coords,
                                    scene: 0,
                                    current: editCurrentSceneParcels ? scene?.id : 0
                                })
                            }else{
                                showNextNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Remove parcel entities before deleting parcel.", animate:{enabled:true, return:true, time:3}})
                            }

                            
                        }else{
                            if(colyseusRoom.state.temporaryParcels.includes(mapColumn.coords)){
                                console.log('parcel is already selected to be added, remove from selection')
                                deleteParcelEntities(mapColumn.coords)
                                addBlankParcels([mapColumn.coords])
                            }else{
                                console.log('parcel is added to temp parcel list')
                                removeEmptyParcels([mapColumn.coords])
                                addBoundariesForParcel(mapColumn.coords, true, false)
                            }

                            sendServerMessage(SERVER_MESSAGE_TYPES.SELECT_PARCEL, {
                                player: localUserId,
                                parcel: mapColumn.coords,
                                scene: 0,
                                current: editCurrentSceneParcels ? scene?.id : 0
                            })
                        }
                    }else{
                        console.log('clicked on parcel to be added to new scene')
                        if(mapColumn.scene){
                            console.log('parcel is part of another scene, dont do anything')
                        }else{
                            console.log('parcel is not part of another scene, add to new scene')
                            if(colyseusRoom.state.temporaryParcels.includes(mapColumn.coords)){
                                console.log('parcel is already selected to be added, remove from selection')
                                deleteParcelEntities(mapColumn.coords)
                                addBlankParcels([mapColumn.coords])
                            }else{
                                console.log('parcel is added to temp parcel list')
                                removeEmptyParcels([mapColumn.coords])
                                addBoundariesForParcel(mapColumn.coords, true, false)
                            }

                            sendServerMessage(SERVER_MESSAGE_TYPES.SELECT_PARCEL, {
                                player: localUserId,
                                parcel: mapColumn.coords,
                                scene: 0,
                                current: editCurrentSceneParcels ? scene?.id : 0
                            })
                        }
                    }
                    
                }}
                onMouseUp={()=>setUIClicked(false)}
            >
                </UiEntity>
        )
    })
    return arr
}

function getBackground(mapColumn:any){
    if(navigation){
        if(mapColumn.selected){
            return Color4.Green()
        }else if(mapColumn.scene){
            return mapColumn.color
        }else{
            return Color4.create(0,0,0,.2)
        }
    }
    else{
        if(mapColumn.scene){
            return mapColumn.color
        }else if(editCurrentSceneParcels){
            if(tempParcels.has(mapColumn.coords)){
                return Color4.Green()
            }
    
            if(otherTempParcels.has(mapColumn.coords)){
                return Color4.Red()
            }
    
            return Color4.create(0,0,0,.2)
        }
        else if(tempParcels.has(mapColumn.coords)){
            return Color4.Green()
        }else{
            return Color4.create(0,0,0,.2)
        }
    }
}

function selectScene(parcel:string){
    selectedScene = undefined
    colyseusRoom.state.scenes.forEach((s:any)=>{
        if(s.pcls.includes(parcel)){
            selectedScene = s
        }
    })

    createMapTiles()
}

function updateSceneOffset(direction:string, factor:number, manual?:boolean){
    let transform:any = Transform.getMutable(scene!.parentEntity).position
    transform[direction] = manual ? factor : transform[direction] + (factor * sceneFactor)

    // newActionData.x = transform.x
    // newActionData.y = transform.y
    // newActionData.z = transform.z//
}