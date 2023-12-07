import { engine } from "@dcl/sdk/ecs"
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math"

export default {

    DEBUG: true,
    allowNoWeb3:true,

    lobby:"0x3edfae1ce7aeb54ed6e171c4b13e343ba81669b6",

    endpoints:{
        wsTest: "ws://localhost:2751",
        wsProd: "wss://dcl-iwb.co/toolset",

        deploymentTest: "http://localhost:3525/dcl/deployment",
        deploymentProd: "https://dcl-iwb.co/dcl/deployment",

        toolsetTest: "http://localhost:3000/toolset",
        toolsetProd: "https://dcl-iwb.co/toolset",

        validateTest: "http://localhost:2751",

        assetSign: "/scene/sign",
        dclNamesGraph:"https://api.thegraph.com/subgraphs/name/decentraland/marketplace"
    },
    colors:{
        transparent: Color4.create(0,0,0,0),
        opaqueGreen: Color4.create(0,1,0,0.4)
    },

    textures:{
        atlas1:"assets/atlas1.png",
        atlas2:"assets/atlas2.png"
    }
}
