import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { localUserId, players, worldTravel } from '../../../components/player/player'
import { displayInitalizeWorldPanel } from '../initaliteWorldPanel'
import { worlds } from '../../../components/scenes'
import { formatDollarAmount, formatSize, log, paginateArray } from '../../../helpers/functions'
import { displayRealmTravelPanel } from '../realmTravelPanel'
import { buildInfoTab } from './buildsIndex'
import { exportPanel, updateExportPanelView } from './ExportPanel'
import { showExportConfirmPanel } from './ExportConfirmPanel'

let visibleIndex = 1
let visibleItems:any[] = []
let dclNames:any[] = []
let worldExportView = "loading"
let totalSpace:any = 0
let usedSpace:any = 150

export async function showExportWorlds(){
    updateExportPanelView('Worlds')
    worldExportView = "loading"

    visibleIndex = 1
    visibleItems.length = 0
    dclNames.length = 0
    totalSpace = 0
    usedSpace = 0

    await loadDCLNameInfo()
    refreshVisibleItems()

    worldExportView = "table"
}

async function loadDCLNameInfo(){
    // await loadLandAllocation()
    await loadNamesAllocation()
}

async function loadLandAllocation(){
    try{
        let response = await fetch("https://api.thegraph.com/subgraphs/name/decentraland/land-manager", {
            "headers": {
              "content-type": "application/json",
            },
            "body": "{\"operationName\":\"Land\",\"variables\":{\"address\":\""+ localUserId +"\",\"tenantTokenIds\":[],\"lessorTokenIds\":[]},\"query\":\"query Land($address: Bytes, $tenantTokenIds: [String!], $lessorTokenIds: [String!]) {\\n  tenantParcels: parcels(\\n    first: 1000\\n    skip: 0\\n    where: {tokenId_in: $tenantTokenIds}\\n  ) {\\n    ...parcelFields\\n  }\\n  tenantEstates: estates(first: 1000, skip: 0, where: {id_in: $tenantTokenIds}) {\\n    ...estateFields\\n  }\\n  lessorParcels: parcels(\\n    first: 1000\\n    skip: 0\\n    where: {tokenId_in: $lessorTokenIds}\\n  ) {\\n    ...parcelFields\\n  }\\n  lessorEstates: estates(first: 1000, skip: 0, where: {id_in: $lessorTokenIds}) {\\n    ...estateFields\\n  }\\n  ownerParcels: parcels(\\n    first: 1000\\n    skip: 0\\n    where: {estate: null, owner: $address}\\n  ) {\\n    ...parcelFields\\n  }\\n  ownerEstates: estates(first: 1000, skip: 0, where: {owner: $address}) {\\n    ...estateFields\\n  }\\n  updateOperatorParcels: parcels(\\n    first: 1000\\n    skip: 0\\n    where: {updateOperator: $address}\\n  ) {\\n    ...parcelFields\\n  }\\n  updateOperatorEstates: estates(\\n    first: 1000\\n    skip: 0\\n    where: {updateOperator: $address}\\n  ) {\\n    ...estateFields\\n  }\\n  ownerAuthorizations: authorizations(\\n    first: 1000\\n    skip: 0\\n    where: {owner: $address, type: \\\"UpdateManager\\\"}\\n  ) {\\n    operator\\n    isApproved\\n    tokenAddress\\n  }\\n  operatorAuthorizations: authorizations(\\n    first: 1000\\n    skip: 0\\n    where: {operator: $address, type: \\\"UpdateManager\\\"}\\n  ) {\\n    owner {\\n      address\\n      parcels(first: 1000, skip: 0, where: {estate: null}) {\\n        ...parcelFields\\n      }\\n      estates(first: 1000) {\\n        ...estateFields\\n      }\\n    }\\n    isApproved\\n    tokenAddress\\n  }\\n}\\n\\nfragment parcelFields on Parcel {\\n  x\\n  y\\n  tokenId\\n  owner {\\n    address\\n  }\\n  updateOperator\\n  data {\\n    name\\n    description\\n  }\\n}\\n\\nfragment estateFields on Estate {\\n  id\\n  owner {\\n    address\\n  }\\n  updateOperator\\n  size\\n  parcels(first: 1000) {\\n    x\\n    y\\n    tokenId\\n  }\\n  data {\\n    name\\n    description\\n  }\\n}\\n\"}",
            "method": "POST",
          });
        let res = await response.json()
        if(res.data && res.data.ownerParcels){
            totalSpace += res.data.ownerParcels.length * 100
        }
    }
    catch(e){
        console.log('error fetching land allocation', e)
    }
}

async function loadNamesAllocation(){
    try{
        let names:any[] = []

        let stats = await fetch("https://worlds-content-server.decentraland.org/wallet/"+ localUserId+"/stats");
        let statsJSON = await stats.json()
        if(statsJSON.dclNames){
            names = statsJSON.dclNames
        }

        if(statsJSON.maxAllowedSpace){
            totalSpace = formatSize(statsJSON.maxAllowedSpace)
        }

        if(statsJSON.usedSpace){
            usedSpace = formatSize(statsJSON.usedSpace)
        }


        let response = await fetch("https://api.thegraph.com/subgraphs/name/decentraland/marketplace", {
        "headers": {
            "content-type": "application/json",
        },
        "body": "{\"operationName\":\"getUserNames\",\"variables\":{\"owner\":\"" + localUserId + "\",\"offset\":0},\"query\":\"query getUserNames($owner: String, $offset: Int) {\\n  nfts(first: 1000, skip: $offset, where: {owner: $owner, category: ens}) {\\n    ens {\\n      subdomain\\n    }\\n  }\\n}\\n\"}",
        "method": "POST",
        });
        let res = await response.json()
        if(res.data && res.data.nfts){
            // totalSpace += res.data.nfts.length * 100
            let pointers = 0
            for(let i = 0; i < res.data.nfts.length; i++){
                let dclName = res.data.nfts[i].ens.subdomain +".dcl.eth"
                try{
                    let res = await fetch("https://worlds-content-server.decentraland.org/world/"+ dclName +"/about");
                    let json = await res.json()
                    console.log('dcl wrold server name ping is', json)
                    if(json.error){
                        dclNames.push({name:dclName, size:0, status:"N"})
                    }else{
                        pointers++
                        console.log('pointer found', pointers)
                        let pointerRes = await fetch("https://worlds-content-server.decentraland.org/entities/active", {
                            "headers": {
                              "content-type": "application/json",
                            },
                            "body": "{\"pointers\":[\"" + dclName +"\"]}",
                            "method": "POST",
                          });
                        let pointerJSON = await pointerRes.json()
                        console.log('pointer json is', pointerJSON)
                        dclNames.push({name:dclName, size: names.find((name:any)=> name.name === dclName.toLowerCase()) ? formatSize(names.find((name:any)=> name.name === dclName.toLowerCase()).size) : 0, status:"Y"})
                    }
                }
                catch(e){
                    dclNames.push({name:dclName, size:0, status:"E"})
                    console.log('error fetching dcl world for name', dclName)
                }
            }
        }
    }
    catch(e){
        console.log('error getting dcl names', e)
    }
}

export function refreshVisibleItems(){
    visibleItems.length = 0
    visibleItems = paginateArray([...dclNames], visibleIndex, 6)
  }

export function ExportDCLWorldsPanel() {
    return (
        <UiEntity
            key={"dclworldsexportpanel"}
            uiTransform={{
                display: buildInfoTab === "Export" && exportPanel === "Worlds" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}
        >


            {/* loading  view */}
        <UiEntity
            uiTransform={{
                display: worldExportView === "loading" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
            }}
            uiText={{value:"Loading Your Worlds Info...", color:Color4.White(), textAlign:'middle-center', fontSize: sizeFont(35,25)}}
        />

            {/* table view */}
        <UiEntity
            uiTransform={{
                display: worldExportView === "table" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}
        >

                        {/* size charts */}
                        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '20%',
            }}
            >

            {/* total size label*/}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{bottom:"3%"}
            }}
            // uiBackground={{color:Color4.Gray()}}
            uiText={{value:"Space Used: " + formatDollarAmount(usedSpace, 2) + " / " + formatDollarAmount(totalSpace, 2) + " MB" , color:Color4.White(), fontSize:sizeFont(25,16)}}
            />

            {/* total size container */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '90%',
                height: '75%',
                margin:{bottom:"2%"}
            }}
            uiBackground={{color:Color4.Gray()}}
            >

            {/* total count size  */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: `${Math.min((usedSpace/totalSpace) * 100, 100)}%`,
                height: '100%',
            }}
            uiBackground={{color: usedSpace / totalSpace > 0.75 ? Color4.Red() : Color4.Green()}}/>

            </UiEntity>


                </UiEntity>

            {/* table */}
            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '80%',
            }}
            // uiBackground={{color:Color4.Gray()}}
            >

            {/* header row */}
        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
            // uiBackground={{color:Color4.Blue()}}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.rowPillDark)
            }}
            
        >
            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Name", fontSize:sizeFont(25,15), textAlign:'middle-left',color:Color4.White()}}
            />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent:'flex-start',
            width: '20%',
            height: '100%',
            display:'flex'
        }}
        uiText={{value: "Has Scene", fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.White()}}
        />

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent:'flex-start',
            width: '20%',
            height: '100%',
            display:'flex'
        }}
        uiText={{value: "Size", fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.White()}}
        />

            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
                height: '100%',
            }}

            uiText={{value:"Deploy", fontSize:sizeFont(25,15), textAlign:'middle-center',color:Color4.White()}}
            />

        </UiEntity>

            {/* builds row */}
        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '80%',
            }}
            // uiBackground={{color:Color4.Yellow()}}
        >


            {generateRows()}



        </UiEntity>

            {/* buttons row */}
        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
            // uiBackground={{color:Color4.White()}}
        >
             <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                width: '85%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.White()}}
        >
        </UiEntity>


        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.White()}}
        >

                 <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                width: calculateSquareImageDimensions(5).width,
                height: calculateSquareImageDimensions(4).height,
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.blackArrowLeft)
            }}
            onMouseDown={()=>{
                if(visibleIndex - 1 >=0){
                    visibleIndex--
                    refreshVisibleItems()
                }
            }}
            />

            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                width: calculateSquareImageDimensions(5).width,
                height: calculateSquareImageDimensions(4).height,
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.blackArrowRight)
            }}
            onMouseDown={()=>{
                log('clickding right')
                refreshVisibleItems()
                if((visibleIndex + 1) * 6 < worlds.length){
                    visibleIndex++
                    refreshVisibleItems()
                }
            }}
            />

            </UiEntity>

        </UiEntity>

            </UiEntity>
            
        </UiEntity>





        </UiEntity>
    )
}

function generateRows(){
    let arr:any[] = []
    visibleItems.forEach((scene:any, i:number)=>{
        arr.push(
        <UiEntity
        key={"your world row - " + scene.name}
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '15%',
            display:'flex'
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: i % 2 === 0 ? getImageAtlasMapping(uiSizes.rowPillLight)

            : 

            getImageAtlasMapping(uiSizes.rowPillDark)
        }}
        >

        {/* scene name */}
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent:'flex-start',
            width: '40%',
            height: '100%',
            display:'flex'
        }}
        uiText={{value: "" + scene.name, fontSize:sizeFont(20,15), textAlign:'middle-left', color:Color4.White()}}
        />

         {/* status name */}
         <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent:'flex-start',
            width: '20%',
            height: '100%',
            display:'flex'
        }}
        uiText={{value: "" + scene.status, fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.White()}}
        />

        {/* size name */}
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent:'flex-start',
            width: '20%',
            height: '100%',
            display:'flex'
        }}
        uiText={{value: "" + scene.size, fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.White()}}
        />

        {/* deploy button */}
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '15%',
            height: '100%',
            display:'flex'
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
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
        }}
        uiText={{value: "Deploy", fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.White()}}
        onMouseDown={()=>{
            showExportConfirmPanel("Worlds", scene.name)
        }}
        />
        </UiEntity>


            </UiEntity>
            )
    })

    return arr
}