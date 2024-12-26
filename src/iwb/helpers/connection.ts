import {Client} from "colyseus.js";
import resources from '../helpers/resources'
import {log} from "./functions";
import { banPlayer } from "../components/Player";

export let client:Client

export async function connect(roomName: string, userData: any, token: string, world?:any, island?:any, localConfig?:any) {
    let options: any = {token, userData}
    options.world = world ? world : "iwb"
    options.island = island ? island : "world"
    options.localConfig = localConfig
    options.gcScene = localConfig ? localConfig.gcScene : undefined


    client = new Client(resources.DEBUG ? resources.endpoints.wsTest : resources.endpoints.wsProd)
    try {
        return await client.joinOrCreate(roomName, options);
    } catch (e:any) {
        log('error connecting colyseus', e)
        if(e.code === 400){
            console.log('you are banned!')
            banPlayer()
        }
        throw e;
    }
}
