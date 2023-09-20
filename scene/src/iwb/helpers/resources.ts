import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math"

export default {

    DEBUG: true,

    endpoints:{
        validateTest:"http://localhost:2751",
        validateProd: "https://lkdcl.co/dcl/angzaar/test",

        wsTest: "ws://localhost:2751",
        wsProd: "wss://dcl-iwb.co",
    },
    colors:{
        transparent: Color4.create(0,0,0,0),
    },
}

