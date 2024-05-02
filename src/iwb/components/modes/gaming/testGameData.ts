import { Vector3 } from "@dcl/sdk/math";
import { Game } from "../../../helpers/types";


export let testGameData:Game = {
    uiBorder:"",
    id: "testGame",
    name: "Test Game",
    desc: "Test Game Description",
    im: "",
    type: 0, //not sure what we should use for this; was thinking type could be a category type
    editing:false,
    // startLives:0,
    // startHealth:100,
    startScore:0,
    startLevel:1,
    p:{
        x:10,
        y:1,
        z:10
    },
    levels:[
        {
            id:"level-1",
            type:"", //again, not sure what type to use here
            number:1,
            rst:false,
            showLevel:true,
            countdown:{
                id:"level-1-countdown-timer",
                type:"",//again, not sure what type to use here
                direction:-1,
                start: 3,
                end:0
            },
            // timer:{
            //     id:"level-1-timer",
            //     type:"",//again, not sure what type to use here
            //     direction:1,
            //     start: 15,
            //     end:0
            // },
            waves:[
                {
                    id:"wave-test-1",
                    starts:[Vector3.create(0, 3, 24)],
                    ends:[Vector3.create(16, 3, 24)],
                    sTy:1,
                    spwnTy:1,
                    spwnAmt:3,
                    spwnDel:3,
                    spwnDelTy:1,
                    enmy:{
                        id:"enemy-1",
                        aid:"enemy-1-aid",
                        ty:0,
                        cid: "blue",
                        as:15,
                        she:50,
                        def:0,
                        si:Vector3.create(3,3,3),
                    }
                }
            ]
        }
    ]
}