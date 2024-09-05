import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, PositionUnit, Input } from '@dcl/sdk/react-ecs'
import resources from '../../helpers/resources'
import { calculateImageDimensions, getAspect, dimensions, getImageAtlasMapping, sizeFont, calculateSquareImageDimensions } from '../helpers'
import { uiSizes } from '../uiConfig'
import { generateButtons, setUIClicked } from '../ui'
import { IWBScene, NOTIFICATION_TYPES, SERVER_MESSAGE_TYPES, SOUND_TYPES } from '../../helpers/types'
import { Color4 } from '@dcl/sdk/math'
import { formatDollarAmount, formatSize, paginateArray } from '../../helpers/functions'
import { IWBTable, setTableConfig, updateIWBTable } from '../Reuse/IWBTable'
import { playSound } from '../../components/Sounds'
import { openExternalUrl } from '~system/RestrictedActions'
import { sendServerMessage } from '../../components/Colyseus'
import { editCurrentParcels } from '../../modes/Create'
import { showNotification } from './NotificationPanel'
import { displaySkinnyVerticalPanel } from '../Reuse/SkinnyVerticalPanel'
import { getView } from '../uiViews'
import { displayAddSpawnPointPanel } from './AddSpawnPointPanel'
import { localPlayer } from '../../components/Player'
import { utils } from '../../helpers/libraries'
import { displayExpandedMap } from './ExpandedMapView'
import { displayMainView } from './IWBView'
import { displayPendingPanel } from './PendingInfoPanel'

export let scene:IWBScene | null
export let sceneInfoDetailView = "Info"

export let showSceneDetailPanel = false
let visibleIndex = 1
let newSceneBuilderWallet:string = ""//

let selectedGenesisParcels:any[] = []
let visibleLands:any[] = []

let buttons:any[] = [
    {label:"Info", pressed:true, func:()=>{
        updateSceneDetailsView("Info")
        }
    },
    {label:"Access", pressed:false, func:()=>{
        updateSceneDetailsView("Access")
        }
    },
    {label:"Size", pressed:false, func:()=>{
        updateSceneDetailsView("Size")
        }
    },
    {label:"Parcels", pressed:false, func:()=>{
        playSound(SOUND_TYPES.SELECT_3)
        editCurrentParcels(scene!.id)
        displaySceneDetailsPanel(false)
        displayExpandedMap(true, true)
        }
    },
    {label:"Spawns", pressed:false, func:()=>{
        updateSceneDetailsView("Spawns")
        }
    },
    {label:"Export", pressed:false, func:()=>{
        visibleLands.length = 0
        visibleIndex = 1
        visibleLands = paginateArray(localPlayer.landsAvailable, visibleIndex, 6)
        updateSceneDetailsView("Export")
        console.log('visible lands are ', visibleLands)
        }
    },
    {label:"Close", pressed:false, func:()=>{
        updateIWBTable([])
        displayMainView(false)
        displaySceneDetailsPanel(false)
        },
        position:{bottom:0},
        positionType:'absolute'
    },
]

let spawns:any[] = []
let spawnTableConfig:any = {
    height:'40%', width:'100%', rowCount:6,
    headerData:[
        {spawn:"Spawn", camera:"Camera", go:"Del"},
    ],
    rowConfig:[
    { 
        key:"spawn",
        width:'40%',
        height:'100%',
        margin:{left:"1%"},
        value:"",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-left',
        color:Color4.White(),
        func:(data:any)=>{
            return "x:" + data.split(",")[0] + ", y:" + data.split(",")[1] + ", z:" + data.split(",")[2]
        }
    },
    {
        key:"camera",
        width:'40%',
        height:'100%',
        margin:{left:"1%"},
        value:"",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-center',
        color:Color4.White(),
        func:(data:any)=>{
            return "x:" + data.split(",")[0] + ", y:" + data.split(",")[1] + ", z:" + data.split(",")[2]
        }
    },
    {
        key:"go",
        width:'10%',
        height:'80%',
        margin:{left:"1%"},
        value:"Go",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-center',
        color:Color4.White(),
        image:{
            size:3,
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas1.png',
                uvs:()=>{getImageAtlasMapping(uiSizes.trashButtonTrans)}
            },
            uvs: {
                atlasHeight: 1024,
                atlasWidth: 1024,
                sourceTop: 386,
                sourceLeft: 896,
                sourceWidth: 128,
                sourceHeight: 128
            }
        },
        onClickData:'index',
        onClick:(data:any)=>{
            playSound(SOUND_TYPES.SELECT_3)
            if(localPlayer.activeScene!.sp.length > 1){
                sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_DELETE_SPAWN, {
                        sceneId:localPlayer.activeScene!.id, 
                        index: data
                    }
                )
                utils.timers.setTimeout(()=>{
                    updateSceneDetailsView("Spawns")
                }, 500)
            }
        }
    },
    ]
}

export let sceneBuildersConfig:any = {
    height:'30%', width:'100%', rowCount:6,
    headerData:[
        {name:"Name", go:"Del"},
    ],

    rowConfig:[
    { 
        key:"name",
        overrideKey:true,
        width:'90%',
        height:'100%',
        margin:{left:"1%"},
        value:"",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-left',
        color:Color4.White(),
    },
    {
        key:"go",
        width:'10%',
        height:'80%',
        margin:{left:"1%"},
        value:"Go",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-center',
        color:Color4.White(),
        image:{
            size:3,
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas1.png',
                uvs:()=>{getImageAtlasMapping(uiSizes.trashButtonTrans)}
            },
            uvs: {
                atlasHeight: 1024,
                atlasWidth: 1024,
                sourceTop: 386,
                sourceLeft: 896,
                sourceWidth: 128,
                sourceHeight: 128
            }
        },
        onClick:(user:any)=>{
            playSound(SOUND_TYPES.SELECT_3)
            sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_DELETE_BP, {sceneId:scene!.id, user:user.toLowerCase()})
        }
    },
    ]
}

export function refreshSpawns(){
    spawns.length = 0 
    let spawnPoints = paginateArray(scene ? [...scene.sp] : [], visibleIndex, 6)
    let cameraPoints = paginateArray(scene ? [...scene.cp] : [], visibleIndex, 6)
    spawnPoints.forEach((sp:any, i:number)=>{
        spawns.push({spawn: spawnPoints[i], camera:cameraPoints[i]})
    })
    console.log('spawn points', spawnPoints)
}

export function displaySceneDetailsPanel(value:boolean, selectedScene?:any, resetScene?:boolean){
    showSceneDetailPanel = value

    if(selectedScene){
        scene = selectedScene
    }

    if(resetScene){
        scene = null
    }

    if(value){
        updateSceneDetailsView("Info")
    }

}

export function updateSceneDetailsView(value:string){
    let button = buttons.find($=> $.label === sceneInfoDetailView)
    if(button){
        button.pressed = false
    }

    sceneInfoDetailView = value
    button = buttons.find($=> $.label === value)
    if(button){
        button.pressed = true
    }

    if(sceneInfoDetailView === "Access"){
        newSceneBuilderWallet = ""
        setTableConfig(sceneBuildersConfig)
        updateIWBTable(scene !== null ? scene.bps : [])
    }

    if(sceneInfoDetailView === "Spawns"){
        setTableConfig(spawnTableConfig)
        refreshSpawns()
        updateIWBTable(spawns)
    }
    selectedGenesisParcels.length = 0
}

export function createSceneDetailsPanel() {
    return (
        <UiEntity
        key={"" + resources.slug + "scene-details-ui"}
            uiTransform={{
                display: showSceneDetailPanel? 'flex' : 'none',
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

                 {/* header container */}
                 <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin:{left:'10%', bottom:'0%'}
                }}
                // uiBackground={{color:Color4.Green()}}
                uiText={{value:"Editing Scene: " + (scene? scene.n : ""), fontSize: sizeFont(35,25), color:Color4.White(), textAlign:'middle-left'}}
                >
                </UiEntity>

                {/* main content container */}
                <UiEntity
                uiTransform={{
                    display:'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent:'center',
                    width: '97%',
                    height: '80%',
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
    key={resources.slug + "details-view-left-container"}
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
    }}
    onMouseUp={()=>{
        setUIClicked(false)
    }}
    >
        {generateButtons({slug:"scene-details-view", buttons:buttons})}

    </UiEntity>
   )
}

function MainRightView(){
    return(
        <UiEntity
        key={resources.slug + "details-view-right-container"}
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
            <InfoPanel/>
            <SizePanel/>
            <SpawnPanel/>
            <EditBuildersPanel/>
            <ExportPanel/>
            <ExportGenesisCityPanel/>

        </UiEntity>
  
    )
}

function SizePanel() {
    return (
        <UiEntity
            key={resources.slug + "scene::size::panel"}
            uiTransform={{
                display: sceneInfoDetailView === "Size" ? 'flex' : 'none',
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
            }}
            // uiBackground={{color:Color4.Gray()}}
            uiText={{value:"Scene Size Limits", color:Color4.White(), fontSize:sizeFont(30,25)}}
            />

            {/* Poly count size label */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:"5%"}
            }}
            // uiBackground={{color:Color4.Gray()}}
            uiText={{value:"Scene Poly Count: " + (scene && scene !== null ? formatDollarAmount(scene.pc) + " / " + formatDollarAmount(scene.pcls.length * 10000) : "") , color:Color4.White(), fontSize:sizeFont(25,16)}}
            />

            {/* Poly count size container */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '90%',
                height: '15%',
            }}
            uiBackground={{color:Color4.Gray()}}
            >

            {/* Poly count size  */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: getPolyWidth(),
                height: '100%',
            }}
            uiBackground={{color: scene?.pc && (scene.pc / (scene.pcls.length * 10000)) > 0.75 ? Color4.Red() : Color4.Green()}}/>

            </UiEntity>


            {/* file size label */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:"5%"}
            }}
            // uiBackground={{color:Color4.Gray()}}
            uiText={{
                value: scene ? `Scene File Size: ${parseFloat(formatSize(scene.si))} MB / ${scene.pcnt > 12 ? 300 : scene.pcnt * 15} MB` : "",
                color: Color4.White(),
                fontSize: sizeFont(25,16)
            }}

            />

            {/* File count size container */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '90%',
                height: '15%',
            }}
            uiBackground={{color:Color4.Gray()}}
            >

            {/* File count size container */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: getSizeWidth(),
                height: '100%',
            }}
            uiBackground={{color:  scene && scene !== null ? (parseFloat(formatSize(scene.si)) / (scene.pcnt > 20 ? 300 : scene.pcnt * 15)) > 0.75 ? Color4.Red() : Color4.Green()  : Color4.Green()}}
            />

            </UiEntity>
        
        </UiEntity>
    )
}

function SpawnPanel(){
    return(
        <UiEntity
        key={resources.slug + "scene::spawns"}
        uiTransform={{
            display: sceneInfoDetailView === "Spawns" ? 'flex' : 'none',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
        }}
    >   
        <IWBTable/>

        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '85%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.White()}}
        >

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(7, getAspect(uiSizes.buttonPillBlue)).width,
                height: calculateImageDimensions(5,getAspect(uiSizes.buttonPillBlue)).height,
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
            }}
            uiText={{textWrap:'nowrap', value: "Add Spawn", fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.White()}}
            onMouseDown={()=>{
                displayAddSpawnPointPanel(true)
                updateIWBTable([])
                displaySceneDetailsPanel(false)
            }}
            />
        </UiEntity>
        </UiEntity>
    )
}

export function InfoPanel() {
    return (
        <UiEntity
            key={resources.slug + "scene::info::panel"}
            uiTransform={{
                display: sceneInfoDetailView === "Info" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}
        >

             {/* scene metadata info */}
             <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{bottom:'2%'}
            }}
            // uiBackground={{color:Color4.Green()}}
            >

<UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '33%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Parcel Count: " + (scene && scene !== null ? scene.pcls.length : ""), fontSize:sizeFont(25,15), color:Color4.White(), textAlign:'middle-left'}}
            />

                <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '33%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Size: " + (scene && scene !== null ? formatSize(scene.si) + "MB" : ""), fontSize:sizeFont(25,15), color:Color4.White(), textAlign:'middle-left'}}
            />


<UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '33%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Poly Count: "  + (scene && scene !== null ? formatDollarAmount(scene.pc) : ""), fontSize:sizeFont(25,15), color:Color4.White(), textAlign:'middle-left'}}
            />


            </UiEntity>

            {/* scene name */}
            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                alignContent:'flex-start',
                width: '100%',
                height: '10%',
                margin:{bottom:'2%'}
            }}
            // uiBackground={{color:Color4.Green()}}
            >

                <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '10%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Scene Name:", fontSize:sizeFont(25,15), color:Color4.White(), textAlign:'middle-left'}}
            />


            <Input
                onChange={(e) =>{ scene!.n = e.trim() }}
                fontSize={sizeFont(20,15)}
                placeholder={"" + (scene && scene !== null ? scene.n : "")}
                placeholderColor={Color4.White()}
                uiTransform={{
                    width: '80%',
                    height:'100%',
                }}
                color={Color4.White()}
                value={"" + (scene && scene !== null ? scene.n : "")}
            />
            </UiEntity>

             {/* scene description */}
             <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                alignContent:'flex-start',
                width: '100%',
                height: '10%',
                margin:{bottom:'2%'}
            }}
            // uiBackground={{color:Color4.Green()}}
            >

                <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '20%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Scene Desc:", fontSize:sizeFont(25,15), color:Color4.White(), textAlign:'middle-left'}}
            />


            <Input
                onChange={(e) =>{ scene!.d = e }}
                fontSize={sizeFont(20,15)}
                placeholder={"" + (scene && scene !== null ? scene.d : "")}
                placeholderColor={Color4.White()}
                uiTransform={{
                    width: '80%',
                    height:'100%',
                }}
                color={Color4.White()}
                value={"" + (scene && scene !== null ? scene.d : "")}
            />
            </UiEntity>

               {/* scene image link */}
               <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                alignContent:'flex-start',
                width: '100%',
                height: '10%',
                margin:{bottom:'2%'}
            }}
            // uiBackground={{color:Color4.Green()}}
            >

                <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '10%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Scene Image: ", fontSize:sizeFont(25,15), color:Color4.White(), textAlign:'middle-left'}}
            />


            <Input
                onChange={(e) =>{ scene!.im = e.trim() }}
                fontSize={sizeFont(20,15)}
                placeholder={"" + (scene && scene !== null && scene.im ? scene.im : "")}
                placeholderColor={Color4.White()}
                color={Color4.White()}
                uiTransform={{
                    width: '80%',
                    height:'100%',
                }}
                value={"" + (scene && scene !== null ? scene.im : "")}
            />
            </UiEntity>

             {/* scene enabled */}
             <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                alignContent:'flex-start',
                width: '100%',
                height: '10%',
                margin:{bottom:'2%'},
            }}
            // uiBackground={{color:Color4.Green()}}
            >

                <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '10%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Scene Enabled", fontSize:sizeFont(25,15), color:Color4.White(), textAlign:'middle-left'}}
            />

            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateSquareImageDimensions(4).width,
            height: calculateSquareImageDimensions(4).height,
            margin:{top:"1%", bottom:'1%', left:"3%"},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs:  getButtonState("Enabled")
        }}
        onMouseDown={() => {
            setUIClicked(true)
            scene!.e = !scene!.e
            setUIClicked(false)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
        />

        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
                height: '10%',
                margin:{left: '2%'}
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Toggle all scene assets for everyone", fontSize:sizeFont(22,15), color:Color4.White(), textAlign:'middle-left'}}
            />

            </UiEntity>

            {/* scene public */}
            <UiEntity
uiTransform={{
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'flex-start',
alignContent:'flex-start',
width: '100%',
height: '10%',
margin:{bottom:'2%'},
}}
// uiBackground={{color:Color4.Green()}}
>

<UiEntity
uiTransform={{
display: 'flex',
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
width: '20%',
height: '10%',
}}
// uiBackground={{color:Color4.Green()}}
uiText={{value:"Scene Public", fontSize:sizeFont(25,15), color:Color4.White(), textAlign:'middle-left'}}
/>

<UiEntity
uiTransform={{
flexDirection: 'column',
alignItems: 'center',
justifyContent: 'center',
width: calculateSquareImageDimensions(4).width,
height: calculateSquareImageDimensions(4).height,
margin:{top:"1%", bottom:'1%', left:"3%"},
}}
uiBackground={{
textureMode: 'stretch',
texture: {
src: 'assets/atlas2.png'
},
uvs: getButtonState("Public")
}}
onMouseDown={() => {
    scene!.priv = !scene!.priv
}}
/>

<UiEntity
uiTransform={{
display: 'flex',
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
width: '50%',
height: '10%',
margin:{left: '2%'}
}}
// uiBackground={{color:Color4.Green()}}
uiText={{value:"Toggle all scene assets for others", fontSize:sizeFont(22,15), color:Color4.White(), textAlign:'middle-left'}}
/>

        </UiEntity>

        {/* scene limitations */}
        <UiEntity
uiTransform={{
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'flex-start',
alignContent:'flex-start',
width: '100%',
height: '10%',
margin:{bottom:'2%'},
}}
// uiBackground={{color:Color4.Green()}}
>

<UiEntity
uiTransform={{
display: 'flex',
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
width: '20%',
height: '10%',
}}
// uiBackground={{color:Color4.Green()}}
uiText={{value:"Scene Limits", fontSize:sizeFont(25,15), color:Color4.White(), textAlign:'middle-left'}}
/>

<UiEntity
uiTransform={{
flexDirection: 'column',
alignItems: 'center',
justifyContent: 'center',
width: calculateSquareImageDimensions(4).width,
height: calculateSquareImageDimensions(4).height,
margin:{top:"1%", bottom:'1%', left:"3%"},
}}
uiBackground={{
textureMode: 'stretch',
texture: {
src: 'assets/atlas2.png'
},
uvs: getButtonState("Limits")
}}
onMouseDown={() => {
    scene!.lim = !scene!.lim        
    }}
/>

<UiEntity
uiTransform={{
display: 'flex',
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
width: '50%',
height: '10%',
margin:{left: '2%'}
}}
// uiBackground={{color:Color4.Green()}}
uiText={{value:"Toggle poly count and size restrictions", fontSize:sizeFont(22,15), color:Color4.White(), textAlign:'middle-left'}}
/>

        </UiEntity>


            {/* buttons row */}
        <UiEntity
            uiTransform={{
                // display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
            }}
            // uiBackground={{color:Color4.White()}}
        >        

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlue)).width,
            height: calculateImageDimensions(6,getAspect(uiSizes.buttonPillBlue)).height,
            margin:{right:"1%"},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
        }}
        onMouseDown={() => {
            displaySceneDetailsPanel(false)
            updateSceneDetailsView("Info")
            showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Scene Saved!", animate:{enabled:true, return:true, time:5}})
            sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_SAVE_EDITS,
                {
                    sceneId: scene!.id,
                    name: scene!.n,
                    desc: scene!.d,
                    image: scene!.im,
                    enabled: scene!.e,
                    priv: scene!.priv,
                    lim: scene!.lim
                })
        }}
        uiText={{value: "Save Edits", color:Color4.White(), fontSize:sizeFont(20,15)}}
        />

            {/* create button */}
            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlue)).width,
            height: calculateImageDimensions(6,getAspect(uiSizes.buttonPillBlue)).height,
            margin:{right:"1%"},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
        }}
        onMouseDown={() => {
            displaySceneDetailsPanel(false)
            updateSceneDetailsView("Info")
            displaySkinnyVerticalPanel(true, getView("Confirm Delete Scene"), scene && scene.n)
        }}
        uiText={{value: "Delete Scene", color:Color4.White(), fontSize:sizeFont(20,15)}}
        />

        </UiEntity>



        {/* view image link */}
        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '10%',
                height: '20%',
                positionType:'absolute',
                position:{right: '5%', bottom:'40%'}
            }}
            uiText={{value:"View Image", fontSize:sizeFont(15,10), color:Color4.White(), textAlign:'middle-left'}}
            onMouseDown={()=>{
                openExternalUrl({url:"" + scene!.im})
            }}
            />

        
        </UiEntity>
    )
}

export function ExportPanel(){
    return (
        <UiEntity
            key={resources.slug + "scene::export::panel"}
            uiTransform={{
                display: sceneInfoDetailView === "Export" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}
        >
{/* 
        <UiEntity//
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
            // uiBackground={{color:Color4.Gray()}}
            uiText={{value:"Export Options", color:Color4.White(), fontSize:sizeFont(30,25)}}
            /> */}

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlue)).width,
                    height: calculateImageDimensions(6,getAspect(uiSizes.buttonPillBlue)).height,
                    margin:{top:"1%"}
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
                }}
                uiText={{value: "Genesis City", fontSize:sizeFont(25,15), textAlign:'middle-center', color:Color4.White()}}
                onMouseDown={()=>{
                    setUIClicked(true)
                    playSound(SOUND_TYPES.SELECT_3)
                    sceneInfoDetailView = "Export-Genesis"
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
                />

            </UiEntity>
    )
}

export function ExportGenesisCityPanel(){
    return (
        <UiEntity
            key={resources.slug + "scene::export::genesis::panel"}
            uiTransform={{
                display: sceneInfoDetailView === "Export-Genesis" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}
        >

            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '100%',
                    height: '10%',
                }}
            >

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40%',
                    height: '100%',
                }}
                // uiBackground={{color:Color4.Gray()}}
                uiText={{value:"Required Parcels: " + (scene && scene.pcls.length), color:Color4.White(), fontSize:sizeFont(20,15)}}
                />

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40%',
                    height: '100%',
                }}
                // uiBackground={{color:Color4.Gray()}}
                uiText={{value:"Selected Parcels: " + (selectedGenesisParcels.length), color:Color4.White(), fontSize:sizeFont(20,15)}}
                />

                    <UiEntity
                        uiTransform={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '30%',
                            height: '100%',
                            margin: {left: "1%", right: "1%"},
                            display: scene && selectedGenesisParcels.length === scene.pcls.length ? "flex" :"none"
                        }}
                        uiBackground={{
                            textureMode: 'stretch',
                            texture: {
                                src: 'assets/atlas2.png'
                            },
                            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                        }}
                        uiText={{value: "Deploy", fontSize: sizeFont(20, 16)}}
                        onMouseDown={() => {
                            setUIClicked(true)
                            sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_DEPLOY,{
                                sceneId:scene?.id,
                                dest:'gc',
                                tokenId: "",
                                parcels: [...selectedGenesisParcels]
                            })
                            displaySceneDetailsPanel(false)
                            updateSceneDetailsView("Info")//
                            displayPendingPanel(true, "deployment")
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
                    justifyContent: 'flex-start',
                    width: '100%',
                    height: '90%',
                }}
                // uiBackground={{color:Color4.Gray()}}
                >
                    {sceneInfoDetailView === "Export-Genesis" && generateRows()}
                </UiEntity>

            </UiEntity>
    )
}

function EditBuildersPanel() {
    return (
        <UiEntity
            key={resources.slug + "scene::edit::builders::panel"}
            uiTransform={{
                display: sceneInfoDetailView === "Access" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}
        >

            <IWBTable/>

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
                width: '50%',
                height: '100%',
            }}
        >

        <Input
            onChange={(value) => {
                newSceneBuilderWallet = value.trim()
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'enter wallet address'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100',
            }}
            ></Input>
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

            {generateButtons({slug:"add-scene-access", buttons:[
                {label:"Add Builder", pressed:false, width:12, height:8, func:()=>{
                    if(newSceneBuilderWallet !== ""){
                        sendServerMessage(
                            SERVER_MESSAGE_TYPES.SCENE_ADD_BP, {
                                user:newSceneBuilderWallet.toLowerCase(), 
                                sceneId:scene!.id
                            }
                        )
                        utils.timers.setTimeout(()=>{
                            updateSceneDetailsView("Access")
                        }, 200)
                    }
                    },
                }
            ]})}
            </UiEntity>

            </UiEntity>
        
        </UiEntity>
    )
}

function getButtonState(button:string){
    if(scene){
        switch(button){
            case 'Enabled':
                return scene.e ? getImageAtlasMapping(uiSizes.toggleOnTrans) : getImageAtlasMapping(uiSizes.toggleOffTrans)
        
            case 'Public':
                return scene.priv ? getImageAtlasMapping(uiSizes.toggleOffTrans) : getImageAtlasMapping(uiSizes.toggleOnTrans)

            case 'Limits':
                return scene.lim ? getImageAtlasMapping(uiSizes.toggleOnTrans) : getImageAtlasMapping(uiSizes.toggleOffTrans)
    
            default:
                return getImageAtlasMapping(uiSizes.toggleOnTrans)
        }
    }else{
        return getImageAtlasMapping(uiSizes.toggleOffTrans)
    }
}

function getPolyWidth(): PositionUnit | undefined {
    return scene ? `${Math.min((scene.pc / (scene.pcls.length * 10000)) * 100, 100)}%` : '0%';
}
function getSizeWidth():  PositionUnit | undefined {
    if (!scene) return '0%';
    const sizeRatio = parseFloat(formatSize(scene.si)) / (scene.pcnt > 20 ? 300 : scene.pcnt * 15) * 100;
    return `${Math.min(sizeRatio, 100)}%`;
}

function generateRows(){
    let arr: any[] = []
    let start = 0
    let end = 3

    for (let i = 0; i < Math.ceil(localPlayer.landsAvailable.length / 3); i++) {
        arr.push(<Row row={start} land={[...localPlayer.landsAvailable.slice(start, end)]}/>)
        start += 3
        end += 3
    }
    return arr
}

function Row({row, land}: { row: number, land:any }){
    return(
        <UiEntity
        key={resources.slug + "store::row::" + row}
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '33%',
            margin:'1%'
        }}
        >
            {generateItems(row, land)}
        </UiEntity>
    )
}


function generateItems(row: number, land:any){
    return land.map((item:any, index:number) => {
        return <Item row={row + "-" + index} item={item}/>
    })
}

function Item({row, item}: { row: string, item:any }){
    return(
        <UiEntity
        key={resources.slug + "land::item::" + item.x + item.y}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '33%',
            height: '100%',
            margin:'1%'
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: isSelected(item.x, item.y) ? getImageAtlasMapping(uiSizes.buttonPillBlue) : getImageAtlasMapping(uiSizes.horizRectangle)
        }}
        onMouseDown={()=>{
            setUIClicked(true)
            // if(localPlayer && localPlayer.homeWorld){
                toggleSelectItem(item)
            // }
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
        >

             <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '80%',
        }}
        >
            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
        }}
        // uiBackground={{color:Color4.Blue()}}
        >
         <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateSquareImageDimensions(11).width,
            height: calculateSquareImageDimensions(11).height,
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: '' + resources.endpoints.dclApi + "parcels/" + item.x + "/" + item.y + "/map.png?width=200&height=200&size=10"
            },
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
            height: '15%',
            margin:{bottom:'3%'}
        }}
        // uiBackground={{color:Color4.Green()}}
        uiText={{value:item.name.length > 20 ? item.name.substring(0, 20) + "..." : item.name, fontSize:sizeFont(25,15)}}
        />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '15%',
            margin:{bottom:'3%'}
        }}
        // uiBackground={{color:Color4.Green()}}
        uiText={{value:"" +(item.x + "," + item.y), fontSize:sizeFont(25,15)}}
        />


        </UiEntity>
    )
}

function isSelected(x:string, y:string){
    if(selectedGenesisParcels.find(($:any)=> $.x === x && $.y === y)){
        return true
    }else{
        return false
    }
}

function toggleSelectItem(item:any){
    if(isSelected(item.x, item.y)){
        let itemIndex = selectedGenesisParcels.findIndex(($:any)=> $.id === item.id)
        if(itemIndex >= 0){
            selectedGenesisParcels.splice(itemIndex, 1)
        }
    }else{
        selectedGenesisParcels.push(item)
    }
}