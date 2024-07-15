import {Client} from "colyseus.js";
import resources from '../helpers/resources'
import {log} from "./functions";

export let client:Client

export async function connect(roomName: string, userData: any, token: string, world?:any, island?:any) {
    let options: any = {token, userData}
    options.world = world ? world : "iwb"
    options.island = island ? island : "world"

    client = new Client(resources.DEBUG ? resources.endpoints.wsTest : resources.endpoints.wsProd)
    try {
        return await client.joinOrCreate(roomName, options);
    } catch (e) {
        log('error connecting colyseus', e)
        throw e;
    }
}
