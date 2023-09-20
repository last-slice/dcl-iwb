import { Room, Client } from "@colyseus/core";
import { IWBRoomState } from "./schema/IWBRoomState";

export class IWBRoom extends Room<IWBRoomState> {

  async onAuth (client:Client, options:any, request:any) {
  }

  onCreate (options: any) {
    this.setState(new IWBRoomState());
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
