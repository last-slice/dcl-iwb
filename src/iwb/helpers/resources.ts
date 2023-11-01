import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math"

export default {

    DEBUG: false,
    allowNoWeb3:false,

    endpoints:{
        wsTest: "ws://localhost:2751",
        wsProd: "wss://dcl-iwb.co/toolset",

        deploymentTest: "http://localhost:3525/dcl/deployment",
        deploymentProd: "https://dcl-iwb.co/dcl/deployment",

        toolsetTest: "http://localhost:3000/toolset",
        toolsetProd: "https://dcl-iwb.co/toolset",

        assetSign: "/scene/sign",

        proxy: "https://lkdcl.co/proxy?url=",
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
