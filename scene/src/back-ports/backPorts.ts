import { TransformTypeWithOptionals } from "@dcl/sdk/ecs"
import {openExternalUrl} from "~system/RestrictedActions"

/**
 * back port logging
 * @param msg 
 */
export function log(...msg:any[]){
  console.log("MYSCENE",msg)
}

export type TranformConstructorArgs = TransformTypeWithOptionals  & {}

//export type GLTFShape = PBGltfContainer & {}

/**
 * place holder as does not exist in current SDK version
 * 
 * not working
 * https://github.com/decentraland/sdk/issues/665
 */
export function  _openExternalURL(url:string){
  log("_openExternalURL IMPLEMENT ME!!!!",url)
  log("_openExternalURL IMPLEMENT ME2!!!!")
  log("_openExternalURL IMPLEMENT ME3!!!!")
  openExternalUrl({url:url})
} 