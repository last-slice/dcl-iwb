import { Schema, Context,MapSchema, type, ArraySchema } from "@colyseus/schema";
import { Player } from "../../Objects/Player";

export class IWBRoomState extends Schema {

  @type({ map: Player }) players = new MapSchema<Player>();

}
