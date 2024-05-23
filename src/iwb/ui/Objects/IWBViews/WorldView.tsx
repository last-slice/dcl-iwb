import { Color4 } from '@dcl/sdk/math';
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { formatSize, formatDollarAmount } from '../../../helpers/functions';
import { calculateSquareImageDimensions, getImageAtlasMapping, sizeFont } from '../../helpers';
import { realm } from '../../../components/Config';
import resources from '../../../helpers/resources';
import { HoriztonalButtons } from '../../Reuse/HoriztonalButtons';
import { IWBTable, setTableConfig, updateIWBTable } from '../../Reuse/IWBTable';
import { mainView } from '../IWBView';
import { testData } from '../../../tests/testData';
import { uiSizes } from '../../uiConfig';
import { playSound } from '../../../components/Sounds';
import { SOUND_TYPES } from '../../../helpers/types';

export let worldView = "Current World"

export function updateWorldView(view:string){
    let button = horiztonalButtons.find($=> $.label === worldView)
    if(button){
        button.pressed = false
    }

    worldView = view
    button = horiztonalButtons.find($=> $.label === view)
    if(button){
        button.pressed = true
    }
}

export let horiztonalButtons:any[] = [
    {label:"Current World", pressed:false, func:()=>{
        updateWorldView("Current World")
        setTableConfig(currentWorldTableConfig)
        updateIWBTable(testData.scenes)
        // playSound(SOUND_TYPES.SELECT_3)
        // showYourBuilds()
        // updateExploreView("Current World")
        },
        height:6,
        width:8,
        fontBigScreen:30,
        fontSmallScreen:12
    },
    {label:"My Worlds", pressed:false, func:()=>{
        updateWorldView("My Worlds")
        setTableConfig(myWorldConfig)
        updateIWBTable(testData.myworlds)
        // playSound(SOUND_TYPES.SELECT_3)
        // showWorlds()
        // updateExploreView("My Worlds")
        },
        height:6,
        width:8,
        fontBigScreen:30,
        fontSmallScreen:15
    },
    {label:"All Worlds", pressed:false, func:()=>{
        updateWorldView("All Worlds")
        setTableConfig(allWorldsConfig)
        updateIWBTable(testData.allworlds)
        // playSound(SOUND_TYPES.SELECT_3)
        // // displayStatusView("All Worlds")
        // showAllWorlds()
        // updateExploreView("All Worlds")
        },
        height:6,
        width:8,
        fontBigScreen:30,
        fontSmallScreen:15
    },
]

export let currentWorldTableConfig:any = {
    height:'10%', width:'100%', rowCount:6,
    headerData:[
        {name:"Name", pcnt:"Parcel Count", si:"Size", pc:"Poly Count", go:"Visit"},
    ],
    tableSortFn:(a:any, b:any)=>{
        // Check if either of the names is "Realm Lobby"
        if (a.name === "Realm Lobby" && b.name !== "Realm Lobby") {
          return -1; // "Realm Lobby" comes first
        } else if (a.name !== "Realm Lobby" && b.name === "Realm Lobby") {
          return 1; // "Realm Lobby" comes first
        } else {
          // Both names are not "Realm Lobby", sort by parcel size (high to low)
        //   return b.pcnt - a.pcnt;
        return a.name.localeCompare(b.name)
        }
    },

    rowConfig:[
    { 
        key:"name",
        width:'30%',
        height:'100%',
        margin:{left:"1%"},
        value:"",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-left',
        color:Color4.White()
    },
    {
        key:"pcnt",
        width:'20%',
        height:'100%',
        margin:{left:"1%"},
        value:"",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-center',
        color:Color4.White(),
        func:(data:any)=>{
            return "" + formatSize(data) + "MB"
        }
    },
    {
        key:"si",
        width:'10%',
        height:'100%',
        margin:{left:"1%"},
        value:"Builds",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-center',
        color:Color4.White(),
        func:(data:any)=>{
            return "" + formatDollarAmount(data)
        }
    },
    {
        key:"pc",
        width:'20%',
        height:'100%',
        margin:{left:"1%"},
        value:"Builds",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-center',
        color:Color4.White()
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
                src: 'assets/atlas2.png',
                uvs:()=>{getImageAtlasMapping(uiSizes.goIcon)}
            },
            uvs: {
                atlasHeight: 1024,
                atlasWidth: 1024,
                sourceTop: 90,
                sourceLeft: 844,
                sourceWidth: 30,
                sourceHeight: 30
            }
        },
        onClick:()=>{
            console.log('ok')
            playSound(SOUND_TYPES.SELECT_3)

            // if(scene.init){
            //     displaySettingsPanel(false)
            //     displaySetting("Explore")
            //     displayRealmTravelPanel(true, scene)
            // }else{
            //     displaySettingsPanel(false)
            //     displayInitalizeWorldPanel(true, scene)
            // }
        }
    },
    ]
}

export let myWorldConfig:any = {
    height:'10%', width:'100%',
    headerData:[
        {name:"Name", init:"Created", updated:"Last Update", builds:"Builds", go:"Go"},
    ],
    tableSortFn:(a:any, b:any) => a.name.localeCompare(b.name),
    rowConfig:[
    {   key:"name",
        width:'30%',
        height:'100%',
        margin:{left:"1%"},
        value:"World",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-left',
        color:Color4.White()
    },
    {
        key:"init",
        width:'13%',
        height:'100%',
        margin:{left:"1%"},
        value:"Last Update",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-center',
        color:Color4.White(),
        func:(data:any)=>{
            return "" + (data ? "Yes" : "No")
        }
    },
    {
        key:"updated",
        width:'30%',
        height:'100%',
        margin:{left:"1%"},
        value:"Go",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-center',
        color:Color4.White(),
        func:(data:any)=>{
            return "" + (data > 0 ? Math.floor((Math.floor(Date.now()/1000) - data) / 86400) + " days ago" : "Never" )
        }
    },
    {
        key:"builds",
        width:'13%',
        height:'100%',
        margin:{left:"1%"},
        value:"Builds",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-center',
        color:Color4.White()
    },
    {
        key:"go",
        width:'13%',
        height:'100%',
        margin:{left:"1%"},
        value:"Go",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-center',
        color:Color4.White(),
        image:true
    },
    ]
}

export let allWorldsConfig:any = {
    height:'10%', width:'100%',
    headerData:[
        {worldName:"World", updated:"Last Update", builds:"Builds", go:"Go"},
    ],
    tableSortFn:(a:any, b:any) => {
        if (a.worldName === "BuilderWorld") return -1;
        if (b.worldName === "BuilderWorld") return 1;

        return a.worldName.localeCompare(b.worldName);
    },
    rowConfig:[
    {   key:"worldName",
        width:'40%',
        height:'100%',
        margin:{left:"1%"},
        value:"World",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-left',
        color:Color4.White()
    },
    {
        key:"updated",
        width:'30%',
        height:'100%',
        margin:{left:"1%"},
        value:"Last Update",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-center',
        color:Color4.White(),
        func:(data:any)=>{
            return "" + Math.floor((Math.floor(Date.now() / 1000) - data) / 86400) + " days ago"
        }
    },
    {
        key:"builds",
        width:'10%',
        height:'100%',
        margin:{left:"1%"},
        value:"Builds",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-center',
        color:Color4.White()
    },
    {
        key:"go",
        width:'20%',
        height:'100%',
        margin:{left:"1%"},
        value:"Go",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-center',
        color:Color4.White(),
        image:true
    },
    ]
}

export function WorldsView(){
    return(
        <UiEntity
        key={resources.slug + "-main-view-right-worlds"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            display:mainView === "Worlds" ? 'flex' : 'none'
        }}
        // uiBackground={{color:Color4.Blue()}}
        >
            <HoriztonalButtons buttons={horiztonalButtons} slug={"main-view"} />

            {/* realm button row */}
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
            >

            {/* current realm text */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                }}
                uiText={{
                    value: "Current World: " + realm,
                    textAlign: 'middle-left',
                    color: Color4.White(),
                    fontSize: sizeFont(25, 15)
                }}
            />

            </UiEntity>

            <IWBTable />

            </UiEntity>
    )
}

