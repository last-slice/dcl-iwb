import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import resources from '../../helpers/resources'
import { calculateImageDimensions, getAspect, dimensions, getImageAtlasMapping, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'
import { setUIClicked } from '../ui'
import { Color4 } from '@dcl/sdk/math'
import { colyseusRoom, sendServerMessage } from '../../components/Colyseus'
import { IWBScene, SERVER_MESSAGE_TYPES } from '../../helpers/types'
import { deleteCreationEntities, getParcels, tempParcels, validateScene } from '../../modes/Create'
import { localUserId, localPlayer } from '../../components/Player'
import { formatDollarAmount } from '../../helpers/functions'

let show = false
export let editCurrentSceneParcels = false

let xMin = -22
let xMax = 25
let yMin = -21
let yMax = 23

let mapTiles:any[] = []
// let selectedTiles:any[] = []

export let mainView = ""

export function displayExpandedMap(value:boolean, current?:boolean){
    show = value

    if(current){
        console.log("editing current scene parcles")
        editCurrentSceneParcels = current
    }else{
        editCurrentSceneParcels = false
    }

    if(show){
        createMapTiles()
    }else{
        mapTiles.length = 0
    }
    // resetViews()

    // setTableConfig(currentWorldTableConfig)
    // updateMainView("Worlds")
    // updateWorldView("Current World")

    // if(show && worldView === "Current World"){
    //     updateIWBTable(testData.scenes)
    // }
}

// function resetViews(){
//     mainView = "Worlds"
//     updateWorldView("Current World")
//     buttons.forEach(($:any)=>{
//         $.pressed = false
//     })
// }

// export function updateMainView(view:string){
//     let button = buttons.find($=> $.label === mainView)
//     if(button){
//         button.pressed = false
//     }

//     mainView = view
//     button = buttons.find($=> $.label === view)
//     if(button){
//         button.pressed = true
//     }
// }

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

    let sceneParcels:string[] = []
    colyseusRoom.state.scenes.forEach((scene:IWBScene)=>{
      scene.pcls.forEach((parcel:string)=>{
        sceneParcels.push(parcel)
      })
    })

    mapParcels.forEach(subArray => {
        subArray.forEach((obj:any) => {
            if (sceneParcels.includes(obj.coords)) {
                obj.scene = true;
                // selectedTiles.push(obj)
            }else{
              obj.scene = false
            }
            obj.selected = false
        });
      });
    mapTiles = mapParcels
    console.log(mapTiles)
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
    }}
    // uiBackground={{color:Color4.Red()}}
    onMouseDown={()=>{
        setUIClicked(true)
        displayExpandedMap(false)
    }}
    onMouseUp={()=>{
        setUIClicked(false)
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
    uiText={{value:"Create New Scene", fontSize:sizeFont(30, 20), color:Color4.White(), textAlign:'middle-center'}}
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
            displayExpandedMap(false)
            if(editCurrentSceneParcels){
                displayExpandedMap(false)
            }else{
                validateScene()//
            }
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
            displayExpandedMap(false)
            deleteCreationEntities(localUserId)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
        uiText={{value: "Cancel Scene", color:Color4.White(), fontSize:sizeFont(25,15)}}
        />

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
            width: '75%',
            height: '100%',
            margin:{left:'1%'}
        }}
        // uiBackground={{color:Color4.Blue()}}
        >

            {show && mapTiles.length > 0 && generateMapTiles()}

        </UiEntity>
  
    )
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
                uiBackground={{color: mapColumn.scene ? Color4.create(.4,.5,.6,1) : tempParcels.has(mapColumn.coords) ? Color4.Green() : Color4.create(0,0,0,.2)}}
                // uiBackground={{color: parcel.cur ? Color4.create(0,1,0,.2) : parcel.scene ? Color4.create(.4,.5,.6,1) :  Color4.create(0,0,0,.2)}}
                // uiBackground={{color: Color4.create(0,0,0,.2)}}//
                onMouseDown={()=>{
                    setUIClicked(true)
                    console.log(mapColumn)
                    sendServerMessage(SERVER_MESSAGE_TYPES.SELECT_PARCEL, {
                        player: localUserId,
                        parcel: mapColumn.coords,
                        scene: 0,
                        current:0
                    })
                }}
                onMouseUp={()=>setUIClicked(false)}
            >
                </UiEntity>
        )
    })
    return arr
}