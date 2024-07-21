import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import resources from '../../helpers/resources'
import { calculateImageDimensions, getAspect, dimensions, getImageAtlasMapping, sizeFont, calculateSquareImageDimensions } from '../helpers'
import { uiSizes } from '../uiConfig'
import { setUIClicked } from '../ui'
import { Color4 } from '@dcl/sdk/math'
import { colyseusRoom, sendServerMessage } from '../../components/Colyseus'
import { IWBScene, SERVER_MESSAGE_TYPES, SOUND_TYPES } from '../../helpers/types'
import { addBoundariesForParcel, cancelParcelEdits, deleteCreationEntities, deleteParcelEntities, getParcels, otherTempParcels, tempParcels, validateScene } from '../../modes/Create'
import { localUserId, localPlayer } from '../../components/Player'
import { formatDollarAmount } from '../../helpers/functions'
import { addBlankParcels, removeEmptyParcels } from '../../components/Scene'
import { scene } from './SceneMainDetailPanel'
import { playSound } from '../../components/Sounds'
import { rotateUVs } from '../../../ui_components/utilities'
import { engine, Transform } from '@dcl/sdk/ecs'
import { teleportToScene } from '../../modes/Play'

let show = false
let navigation = false
export let editCurrentSceneParcels = false

let xMin = -22
let xMax = 25
let yMin = -21
let yMax = 23

let mapTiles:any[] = []
let currentSceneParcels:any[] = []

let selectedScene:any

export let mainView = ""

export function displayExpandedMap(value:boolean, current?:boolean, nav?:boolean){
    show = value

    if(nav){
        navigation = true
    }else{
        navigation = false
    }

    if(current){
        editCurrentSceneParcels = current
        currentSceneParcels = [...localPlayer.activeScene.pcls]
    }else{
        editCurrentSceneParcels = false
    }

    if(show){
        createMapTiles()
    }else{
        mapTiles.length = 0
        currentSceneParcels.length = 0
        selectedScene = undefined
    }
}

function createMapTiles(){
    mapTiles.length = 0

    console.log('x tiles are ', xMax - xMin + 1)

    let mapParcels:any[] = []
    for(let y = yMax; y >= yMin; y--){
        let columns:any[] = []
        for(let x = xMin; x <= xMax; x++){
            columns.push({coords: x + "," + y})
        }
        mapParcels.push(columns)
    }

    let sceneParcels:string[] = []
    colyseusRoom.state.scenes.forEach((scene:IWBScene)=>{
      scene.pcls.forEach((parcel:string)=>{
        sceneParcels.push(parcel)
      })
    })

    mapParcels.forEach(subArray => {
        subArray.forEach((obj:any) => {
            if(navigation){
                if(selectedScene && selectedScene.pcls.includes(obj.coords)){
                    obj.selected = true
                }else{
                    if (sceneParcels.includes(obj.coords)) {
                        obj.scene = true;
                    }else{
                      obj.scene = false
                    }
                    obj.selected = false
                }
            }
            else{
                if(editCurrentSceneParcels){
                    if(currentSceneParcels.includes(obj.coords)){
                        obj.selected = true
                    }else{
                        obj.selected = false
                    }
                }
                else{
                    if (sceneParcels.includes(obj.coords)) {
                        obj.scene = true;
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
                display: show? 'flex' : 'none',
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
    uiText={{value:"" + (selectedScene ? selectedScene.n : ""), fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
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
            height: '10%',//
        }}
    uiText={{value:"" + editCurrentSceneParcels ? "Edit Parcels" : "Create New Scene", fontSize:sizeFont(30, 20), color:Color4.White(), textAlign:'middle-center'}}
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
        }}
    uiText={{value:"File Limit: " + (getParcels() >= 20 ? "300" : getParcels() * 15) + " MB", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-center'}}
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
        }}
        uiText={{value: "Save Scene", color:Color4.White(), fontSize:sizeFont(25,15)}}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
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
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
        uiText={{value: "Cancel Scene", color:Color4.White(), fontSize:sizeFont(25,15)}}
        />
        </UiEntity>





    </UiEntity>
   )
}

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
            margin:{left:  navigation ? 0 : '1%'}
        }}
        // uiBackground={{color:Color4.Blue()}}
        >

            {show && mapTiles.length > 0 && generateMapTiles()}

                {navigation && <PlayerArrow/>}

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
          position: navigation ? getPlayerPosition() : {}
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
                    if(navigation){
                        selectScene(mapColumn.coords)
                    }
                    else{
                        if(editCurrentSceneParcels){
                            //check if click is in current scene first
                            if(scene?.pcls.includes(mapColumn.coords)){
                                console.log('need to remove current scene parcel')
                                deleteParcelEntities(mapColumn.coords)
                                addBlankParcels([mapColumn.coords])
                            }else{
                                if(colyseusRoom.state.temporaryParcels.includes(mapColumn.coords)){
                                    console.log('parcel is already selected to be addred, remove from selection')
                                    deleteParcelEntities(mapColumn.coords)
                                    addBlankParcels([mapColumn.coords])
                                }else{
                                    console.log('parcel is added to temp parcel list')
                                    removeEmptyParcels([mapColumn.coords])
                                    addBoundariesForParcel(mapColumn.coords, true, false)
                                }
                            }
                        }
    
                        sendServerMessage(SERVER_MESSAGE_TYPES.SELECT_PARCEL, {
                            player: localUserId,
                            parcel: mapColumn.coords,
                            scene: 0,
                            current: editCurrentSceneParcels ? scene?.id : 0
                        })
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
            return Color4.create(.4,.5,.6,1)
        }else{
            return Color4.create(0,0,0,.2)
        }
    }
    else{
        if(mapColumn.scene){
            return Color4.create(.4,.5,.6,1)
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