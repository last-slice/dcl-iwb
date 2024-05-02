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
            restricted:false,
            showLevel:true,
            countdown:{
                id:"level-1-countdown-timer",
                type:"",//again, not sure what type to use here
                direction:-1,
                start: 3,
                end:0
            },
            timer:{
                id:"level-1-timer",
                type:"",//again, not sure what type to use here
                direction:1,
                start: 15,
                end:0
            }
        }
    ],
    currentLevel:0
}