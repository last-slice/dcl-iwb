import { engine } from "@dcl/sdk/ecs"
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math"
import { SOUND_TYPES } from "./types"

export let colorsLabels:string[] = [
    "Black",
    "Blue",
    "Gray",
    "Green",
    "Magenta",
    "Purple",
    "Red",
    "Teal",
    "Yellow",
    "White",
]

export let colors:Color4[] = [
    Color4.Black(),
    Color4.Blue(),
    Color4.Gray(),
    Color4.Green(),
    Color4.Magenta(),
    Color4.Purple(),
    Color4.Red(),
    Color4.Teal(),
    Color4.Yellow(),
    Color4.White(),
]

export default {
    DEBUG: true,//
    allowNoWeb3:false,

    slug:"in::world::builder::",

    lobby:"0x3edfae1ce7aeb54ed6e171c4b13e343ba81669b6",

    endpoints:{
        wsTest: "ws://localhost:2751",
        wsProd: "wss://dcl-iwb.co/toolset/qa",

        deploymentTest: "http://localhost:3525",
        deploymentProd: "https://deployment.dcl-iwb.co",

        toolsetTest: "http://localhost:3000/toolset/",
        toolsetProd: "https://dcl-iwb.co/toolset/qa",

        validateTest: "http://localhost:2751",

        assetSign: "/scene/sign",
        dclNamesGraph:"https://api.thegraph.com/subgraphs/name/decentraland/marketplace",
        dclLandGraph:"https://subgraph.decentraland.org/land-manager"
    },
    colors:{
        transparent: Color4.create(0,0,0,0),
        opaqueGreen: Color4.create(0,1,0,0.4)//
    },

    textures:{
        atlas1:"assets/atlas1.png",
        atlas2:"assets/atlas2.png"
    },
    
    audioClips:[
        {key:SOUND_TYPES.ATMOS_BLESSING, name:"Blessing Stereo", loop:false, attach:true, volume:.5},
        {key:SOUND_TYPES.WOOD_3, name:"Wood 3", loop:false, attach:true, volume:.5},
        {key:SOUND_TYPES.DOORBELL, name:"Doorbell Stereo", loop:false, attach:true, volume:.5},
        {key:SOUND_TYPES.DROP_1_STEREO, name:"Drop 1 Stereo", loop:false, attach:true, volume:.5},
        {key:SOUND_TYPES.SELECT_3, name:"Select 3 Stereo", loop:false, attach:true, volume:.5},
        {key:SOUND_TYPES.ERROR_2, name:"Error 2 Stereo", loop:false, attach:true, volume:.5},
    ]
}