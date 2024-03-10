import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { localPlayer, localUserId } from '../../../components/player/player'
import { realm, worlds } from '../../../components/scenes'
import { displayRealmTravelPanel } from '../realmTravelPanel'
import { formatSize, log, paginateArray } from '../../../helpers/functions'
import { buildInfoTab, displaySceneInfoPanel, displaySceneSetting, scene } from './buildsIndex'
import { cRoom, sendServerMessage } from '../../../components/messaging'
import { NOTIFICATION_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { showNotification } from '../notificationUI'
import { exportPanel, updateExportPanelView } from './ExportPanel'

let visibleIndex = 1
let visibleItems:any[] = []

export function showGenesisCityExportPane(){
    updateExportPanelView('GC')
    visibleIndex = 1
    refreshLandItems()
}

export function refreshLandItems(){
    visibleItems.length = 0

    visibleItems = paginateArray([...localPlayer.landsAvailable], visibleIndex, 6)
    log('visible items are ', visibleItems)
}

export function ExportGenesisCityPanel() {
    return (
        <UiEntity
            key={"exportgenesiscitypanel"}
            uiTransform={{
                display: buildInfoTab === "Export" && exportPanel === "GC" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
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
                alignSelf:'flex-start'
            }}
            // uiBackground={{color:Color4.Gray()}}
            uiText={{value:"Export to Genesis City", color:Color4.Black(), fontSize:sizeFont(30,25)}}
            />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '80%',
            }}
        >
            {generateRows()}
            </UiEntity>


            {/* paginate buttons row */}
            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
            // uiBackground={{color:Color4.Green()}}
            />
        
        </UiEntity>
    )
}

export function generateRows(){
    let arr:any = []
  
    let count = 0
    for (let i = 0; i < 2; i++) {
        arr.push(<ItemRow rowCount={count} /> ) 
        count++
    }
    return arr
}

export function ItemRow(data:any){
    return (
  <UiEntity
        key={"land-row-" + data.rowCount}
      uiTransform={{
        width: '100%',
        height: "45%",
        display: 'flex',
        alignSelf:'center',
        flexDirection:'row',
        justifyContent:'center',
        alignContent:'center',
        margin:{bottom:'1%'}
      }}
      >
        {generateRowItems(data.rowCount)}
  
      </UiEntity>
    )
  }

  export function generateRowItems(rowcount:any){
    let arr:any = []

    let count = 0
    for (let i = 0; i < 3; i++) {
        arr.push(<LandTile rowCount={rowcount} columnCount={count}/> ) 
        count++
    }
  
    return arr
  }

function LandTile(data:any){
    let count = 0
    if(data.rowCount > 0){
        count = 3
    }
    count += data.columnCount

    return(
        <UiEntity
        key={"land-item-" + data.rowCount + count}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30%',
            height: '100%',
            margin:{left:"1%", right:'1%'},
            display: visibleItems[count] ? 'flex' : 'none',
        }}
    >

        {/* land image */}
        <UiEntity
          uiTransform={{
              width: calculateSquareImageDimensions(10).width,
              height: calculateSquareImageDimensions(10).height,
              alignSelf:'center',
              flexDirection:'row',
              justifyContent:'center',
              alignContent:'center',
              display: 'flex',
              margin:{bottom:'5%'}
            }}
            // uiBackground={{color:Color4.White()}}//
            uiBackground={{
              texture:{
                  src: visibleItems[count] ? "https://api.decentraland.org/v1/parcels/" + visibleItems[count].x + "/" + visibleItems[count].y +"/map.png?center=" + visibleItems[count].x + "," + visibleItems[count].y + "&selected=" + visibleItems[count].x + "/" + visibleItems[count].y +"/map.png?center=" + visibleItems[count].x + "," + visibleItems[count].y : ""
              },
              textureMode: 'stretch',
              uvs:getImageAtlasMapping({
                  atlasHeight:1024,
                  atlasWidth:1024,
                  sourceTop:264,
                  sourceLeft:264,
                  sourceWidth:240,
                  sourceHeight:240
                })
            }}
          />

        <UiEntity
            uiTransform={{
                width: '100%',
                height: "10%",
                alignSelf:'center',
                flexDirection:'column',
                justifyContent:'center',
                alignContent:'center',
                margin:{top:"1%", bottom:"5%"}
            }}
            uiText={{value:"" + (visibleItems[count] ? visibleItems[count].name : ""), fontSize:sizeFont(25,20), textAlign:'middle-center', color:Color4.Black()}}
            />

            {/* choose button */}
            <UiEntity
          uiTransform={{
              width: '50%',
              height: '20%',
              alignSelf:'center',
              flexDirection:'row',
              justifyContent:'center',
              alignContent:'center',
              display: 'flex',
            }}
            uiBackground={{
              texture:{
                  src: 'assets/atlas2.png'
              },
              textureMode: 'stretch',
              uvs:getImageAtlasMapping(uiSizes.blueButton)
            }}
            uiText={{value:"Deploy", fontSize:sizeFont(20,15), color:Color4.Black(), textAlign:'middle-center'}}
            onMouseDown={()=>{
                sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_DEPLOY,{
                    sceneId:scene?.id,
                    dest:'gc',
                    name:"" + visibleItems[count].name,
                    worldName:"",
                    tokenId: "",
                    parcel: "" + visibleItems[count].x + "," + visibleItems[count].y
                })
            }}
          />
        







    </UiEntity>
    )
}
