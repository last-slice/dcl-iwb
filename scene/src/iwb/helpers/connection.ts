
import { Client, Room } from "colyseus.js";
import { getRealm } from "~system/Runtime";
import resources from "./resources";
import { log } from "../functions";

export async function connect(roomName: string, userData:any) {

    const realm = await getRealm({});

    let options:any = {}
    options.realm = realm?.realmInfo?.realmName;
    options.userData = userData

    const client = new Client(DEBUG ? resources.endpoints.wsTest : resources.endpoints.wsProd);

    try {
        const room = await client.joinOrCreate<any>(roomName, options);
        return room;

    } catch (e) {
        log('error connecting colyseus', e)
        throw e;
    }
}