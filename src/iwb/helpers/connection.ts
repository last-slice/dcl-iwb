import {Client} from "colyseus.js";
import resources from '../helpers/resources'
import {log} from "./functions";

export let client:any

export async function connect(roomName: string, userData: any, token: string, world?:any) {

    let options: any = {token, userData}
    options.world = world ? world : "iwb"

    console.log('room name', roomName)
    console.log('options are ', options)

    client = new Client(resources.DEBUG ? resources.endpoints.wsTest : resources.endpoints.wsProd)
    
    try {
        return await client.joinOrCreate(roomName, options);

    } catch (e) {
        log('error connecting colyseus', e)
        throw e;
    }
}
//