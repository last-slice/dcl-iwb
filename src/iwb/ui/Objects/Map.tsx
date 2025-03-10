import { Color4, Vector3 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position,UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { rotateUVs } from '../../../ui_components/utilities'
import { playerMode, realm } from '../../components/Config'
import { localPlayer } from '../../components/Player'
import { isPreview } from '../../helpers/functions'
import resources from '../../helpers/resources'
import { SCENE_MODES, IWBScene } from '../../helpers/types'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont, calculateSquareImageDimensions } from '../helpers'
import { uiSizes } from '../uiConfig'
import { colyseusRoom } from '../../components/Colyseus'
import { setUIClicked } from '../ui'
import { displayExpandedMap, expandedMapshow } from './ExpandedMapView'

let showView = false
let init = false

let size = 9

export let mapParcels:any[] = []


export function displayIWBMap(value:boolean){
    showView = value
}

function initArray(){
  let xStart = -4
  let yStart = 4

  let xCount = 0
  let yCount = 0

  for(let i = 0; i < size; i++){
    let columns:any[] = []
    for(let j = 0; j < size; j++){
      columns.push({coords: (xStart + xCount) + "," + (yStart + yCount), scene:false, cur:false})
      xCount++
    }
    yCount--
    xCount = 0
    mapParcels.push(columns)
  }
  refreshMap()
}

export function createIWBMap(){
  if(!init){
    init = true
    initArray()
  }
  return(
    <UiEntity
    key={"" + resources.slug + "custom-ui-map"}
    uiTransform={{
        width: calculateImageDimensions(12.5, getAspect(uiSizes.vertRectangle)).width,
        height: calculateImageDimensions(12.5,getAspect(uiSizes.vertRectangle)).height,
      display: localPlayer && localPlayer.canMap ? 'flex' : 'none',
      justifyContent:'flex-start',
      flexDirection:'column',
      alignContent:'center',
      alignItems:'center',
      positionType:'absolute',
      position:{top: isPreview ? '45%' : '5%', left:'-0.5%'}
    }}
    uiBackground={{
      texture:{
          src: resources.textures.atlas2
      },
      textureMode: 'stretch',
      uvs:getImageAtlasMapping(uiSizes.vertRectangle)
    }}
    onMouseDown={()=>{
      setUIClicked(true)
      if(expandedMapshow){
        displayExpandedMap(false)
      }else{
        displayExpandedMap(true, undefined, true)
      }
    }}
    onMouseUp={()=>{
      setUIClicked(false)
    }}
  >
        
          {/* map parcels container */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '84%',
                height: '76%',
                margin:{top:'4%'}
            }}
            // uiBackground={{color:Color4.Green()}}
            >

            {generateMapParcels()}

            </UiEntity>


            {/* map info container */}
          <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '86.5%',
                height: '20%',
                positionType:'absolute',
                position:{bottom:'5.5%'}
            }}
            uiBackground={{color:Color4.Black()}}
            >

            {/* top row info */}
          <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '50%',
            }}
            >

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
                height: '100%',
            }}
            uiText={{textWrap:'nowrap', value:"" + (localPlayer && realm.split(".")[0]), fontSize:sizeFont(20,15), color:Color4.White(), textAlign:'middle-left'}}            
            />

        <UiEntity
              uiTransform={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '25%',
                  height: '100%',
              }}
              uiText={{textWrap:'nowrap', value:"" + (playerMode === SCENE_MODES.PLAYMODE ? "Play" : "Build"), fontSize:sizeFont(20,15), color:Color4.White(), textAlign:'middle-center'}}            
              />

      <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '25%',
                height: '100%',
            }}
            uiText={{textWrap:'nowrap', value:"" + (localPlayer && localPlayer.currentParcel), fontSize:sizeFont(20,15), color:Color4.White(), textAlign:'middle-center'}}            
            />

         

              </UiEntity>


            {/* right column info */}
              <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '50%',
            }}
            >

<UiEntity
      uiTransform={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
      }}
      uiText={{textWrap:'nowrap', value:"" + (localPlayer && localPlayer.activeScene ? localPlayer.activeScene.metadata.n : "No Scene"), fontSize:sizeFont(20,15), color:Color4.White(), textAlign:'middle-left'}}            
      />


              </UiEntity>



            </UiEntity>


      {/* player arrow */}
      <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '84%',
                height: '76%',
                positionType:'absolute',
                margin:{top:"4%"}
            }}
            >

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width:calculateSquareImageDimensions(3).width,
                height: calculateSquareImageDimensions(3).height,
                positionType:'absolute',
            }}
            uiBackground={{
              texture:{
                  src: "images/map_arrow.png"
              },
              textureMode: 'stretch',
              uvs:rotateUVs(localPlayer && localPlayer.rotation ? localPlayer.rotation : 0)
            }}
            />

            </UiEntity>

  </UiEntity>
  )
}

function generateMapParcels(){
  let count = 0
  let arr:any[] = []
  for(let i = 0; i < mapParcels.length; i++){
    arr.push(<MapRow row={mapParcels[i]} rowCount={count} />)
    count++
  }
  return arr
}

function MapRow(data:any){
  return(
    <UiEntity
    key={"map-row-" + data.rowCount}
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
        margin:{bottom:'1%'}
    }}
    >
      {generateMapColumns(data)}
      </UiEntity>
  )
}

function generateMapColumns(data:any){
  let row = data.row
  let count = 0
  let arr:any[] = []
  for(let i = 0; i < row.length; i++){
    arr.push(<MapParcel data={row[i]} rowCount={data.rowCount} columnCount={count} />)
    count++
  }
  return arr
}

function MapParcel(data:any){
  let parcel = data.data
  return(
    <UiEntity
    key={"map-parcel-" + data.rowCount + "-" + data.columnCount}
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '10%',
        height: '100%',
        margin:{left:'0.5%', right:"0.5%"}
    }}
    uiBackground={{color: parcel.cur ? Color4.create(0,1,0,.2) : parcel.scene ? parcel.color :  Color4.create(0,0,0,.2)}}
    >
      </UiEntity>
  )
}

export function refreshMap(){
  if(localPlayer && localPlayer.currentParcel){
    let xStart = parseInt(localPlayer.currentParcel.split(",")[0]) - 4
    let yStart = parseInt(localPlayer.currentParcel.split(",")[1]) + 4
  
    let xCount = 0
    let yCount = 0
  
    let sceneParcels:any[] = []
    colyseusRoom.state.scenes.forEach((scene:any)=>{
      scene.pcls.forEach((parcel:string)=>{
        // sceneParcels.push(parcel)
        sceneParcels.push({parcel:parcel, color:scene.color})
      })
    })
  
    for(let i = 0; i < size; i++){
      for(let j = 0; j < size; j++){
        let coord = (xStart + xCount) + "," + (yStart + yCount)
        mapParcels[i][j].coords = coord
        xCount++
      }
      yCount--
      xCount = 0
    }
  
    xCount = 0
    yCount = 0
  
    mapParcels.forEach(subArray => {
      subArray.forEach((obj:any) => {
          // if (sceneParcels.includes(obj.coords)) {
          //     obj.scene = true;
          // }else{
          //   obj.scene = false
          // }'
          let parcel = sceneParcels.find((parcel:any)=> parcel.parcel === obj.coords)
          if(parcel){
            obj.scene = true
            obj.color = parcel.color
          }else{
            obj.scene = false
          }
      });
    });

    mapParcels.forEach(subArray => {
      subArray.forEach((obj:any) => {
          if (localPlayer.activeScene?.pcls.includes(obj.coords)) {
              obj.cur = true;
          }else{
            obj.cur = false
          }
      });
    });
  }
}