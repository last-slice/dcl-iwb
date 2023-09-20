import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import { IWBRoom } from "./rooms/IWBRoom";

export default config({

    initializeGameServer: (gameServer) => {
        gameServer.define('iwb-world', IWBRoom);
    },

    initializeExpress: (app) => {
        app.get("/hello_world", (req, res) => {
            console.log('hello world server')
            res.send("It's time to kick ass and chew bubblegum!");
        });

        if (process.env.NODE_ENV !== "production") {
            app.use("/", playground);
        }

        app.use("/colyseus", monitor());
    },


    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});
