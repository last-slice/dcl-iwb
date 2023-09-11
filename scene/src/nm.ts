import { Client, Room } from "colyseus.js"
import { getCurrentRealm, isPreviewMode } from "~system/EnvironmentApi"
import { getUserData } from "~system/UserIdentity"

export class NetworkManager {
    client!: Client
    room!: Room
    roomName!: string
    roomId!: string
    options!: any
    userData!: any

    constructor(roomName: string, options: any, userData: any, roomId: string = 'id') {
        this.roomName = roomName
        this.options = options
        this.userData = userData
        this.roomId = roomId
    }

    async start() {
        console.log("GETTING ENDPOINT");
        this.client = new Client(await getEndpoint());
        console.log("GOT CLIENT");
        await this.getUserData()
        await this.connect();


    }

    async getUserData() {
        const realm = await getCurrentRealm({});
        this.options.realm = realm.currentRealm?.displayName;

        if (!this.userData) {
            this.options.userData = (await getUserData({})).data;
        } else {
            this.options.userData = this.userData
        }
    }

    async connect() {
        try {
            if (this.roomName == "lobby_room") {
                console.log("CONNECTING...")                
                const availableRooms = await this.client.getAvailableRooms(this.roomName);

                let roomExist = false
                let connectId = this.options.roomId;
                for (let room of availableRooms) {
                    if (room.roomId == this.options.roomId) {
                        roomExist = true
                    }
                }

                this.room = !roomExist ? await this.client.create<any>(this.roomName, this.options)
                    : await this.client.joinById<any>(connectId, this.options)

                await this.addLobbyListeners();

                console.log("joined successfully to lobby:", this.room);
            }

            return this.room


        } catch (e) {
            console.log("CONNECTING FAILED...")
            console.log("e", e);
        }
    }

    private async addLobbyListeners() {

        this.room.onLeave(async (code) => {
            this.client = await new Client(await getEndpoint());
            this.room = await this.client.reconnect(this.room.id, this.room.sessionId);
            await this.addLobbyListeners();

        });

        this.room.onMessage("px-message", (msg) => {
        })
        
    }
}

export async function connectionColyseus(userData: any) {
    const networkManagerLobby = new NetworkManager("angzaar_room", {roomId: userData.publicKey ? userData.publicKey : userData.userId}, userData);
    await networkManagerLobby.start();

    console.log("CONNECTED TO LOBBY", networkManagerLobby.room);
    return networkManagerLobby.room;
}

export async function getEndpoint() {
    const isPreview = await isPreviewMode({});
    let ENDPOINT

    const realm = await getCurrentRealm({})
    console.log("REALM", realm)
    console.log("PREVIEW MODE", isPreview.isPreview);

    isPreview.isPreview = false

    ENDPOINT = (isPreview.isPreview)
        ? "wss://lkdcl.co/dcl/px" // local environment
        : "wss://lkdcl.co/dcl/px"; // production environment

    // if (realm.currentRealm?.domain == "https://just-test-homework.herokuapp.com") {
    //     ENDPOINT = "wss://just-test-homework-server.herokuapp.com"
    // }
    console.log("GOT ENDPOINT", ENDPOINT);

    return ENDPOINT

}