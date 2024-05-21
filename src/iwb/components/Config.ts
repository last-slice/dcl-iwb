import { getRealm } from "~system/Runtime"
import { colyseusRoom } from "./Colyseus"
import { localPlayer, localUserId } from "./Player"
import { SCENE_MODES, VIEW_MODES } from "../helpers/types"

export let realm: string = ""
export let scenes: any[] = []
export let worlds: any[] = []
export let realmActions: any[] = []
export let iwbConfig: any = {}

export let buildModeCheckedAssets: any[] = []
export let playModeCheckedAssets: any[] = []
export let lastScene: any

export let playerMode:SCENE_MODES = SCENE_MODES.PLAYMODE
export let playerViewMode:VIEW_MODES = VIEW_MODES.AVATAR

export let playModeReset: boolean = true
export let disabledEntities: boolean = false

export let scenesLoaded: boolean = false
export let sceneCount: number = 0
export let scenesLoadedCount: number = 0
export let emptyParcels:any[] = []

export async function setRealm(){
    let realmData = await getRealm({})
    realm = realmData.realmInfo ? 
        realmData.realmInfo.realmName === "LocalPreview" ? 
        "BuilderWorld.dcl.eth" : 
        realmData.realmInfo.realmName : 
        ""
}

export function setConfig(version:any, updates:any, videos:any, tutorialCID:any){
    iwbConfig.v = version
    iwbConfig.updates = updates
    iwbConfig.tutorials = videos
    iwbConfig.CID = tutorialCID
}

export function setWorlds(config: any) {

    config.forEach((world: any) => {
        if (world.init) {
            worlds.push({
                name: world.worldName,
                v: world.v,
                owner: world.owner,
                ens: world.ens,
                builds: world.builds,
                updated: world.updated
            })
        } else {
            let w = worlds.find((wo: any) => wo.ens === world.ens)
            if (w) {
                w.updated = world.updated
                w.v = world.v
            } else {
                worlds.push({
                    name: world.worldName,
                    v: world.v,
                    owner: world.owner,
                    ens: world.ens,
                    builds: world.builds,
                    updated: world.updated
                })
            }
        }

        let playerWorld = localPlayer.worlds.find((w:any) => w.name === world.worldName)
        if (playerWorld) {
            playerWorld.v = world.v
            playerWorld.cv = world.cv
            playerWorld.updated = world.updated
            playerWorld.builds = world.builds
            playerWorld.init = true
        }
    })
}

export function addTutorial(info:any){
    iwbConfig.tutorials.push(info) 
}

export function removeTutorial(info:any){
    iwbConfig.tutorials.splice(info, 1)
}

export function updateTutorialCID(info:any){
    iwbConfig.CID = info
}