import { Schema, Context,MapSchema,ArraySchema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("string") id:string;
  @type("string") address:string
  @type("string") name:string 
  @type('string') grabbedByte:string
}