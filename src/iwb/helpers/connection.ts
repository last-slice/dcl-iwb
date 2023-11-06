import {Client} from "colyseus.js";
//import {getRealm} from "~system/Runtime";
import resources from "./resources";
import {log} from "./functions";

export async function connect(roomName: string, userData: any, token: string) {

    let options: any = {token, userData}

    // realm info is in token, we can probably remove it here
    //const realm = await getRealm({});
    // options.realm = realm?.realmInfo?.realmName;
    // options.userData = userData

    const client = new Client(resources.DEBUG ? resources.endpoints.wsTest : resources.endpoints.wsProd);

    try {
        return await client.joinOrCreate<any>(roomName, options);

    } catch (e) {
        log('error connecting colyseus', e)
        throw e;
    }
}