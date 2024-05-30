import { getRealm } from "~system/Runtime"
import { colyseusRoom } from "./Colyseus"
import { localPlayer, localUserId } from "./Player"
import { SCENE_MODES, VIEW_MODES } from "../helpers/types"
import { Entity, GltfContainer, Material, engine } from "@dcl/sdk/ecs"
import { Color4 } from "@dcl/sdk/math"
import { utils } from "../helpers/libraries"
import { hideAllOtherPointers, addBuildModePointers, resetEntityForBuildMode } from "../modes/Build"
import { BuildModeVisibilty, ParcelFloor, redBeam, greenBeam } from "../modes/Create"
import { addInputSystem, removeInputSystem } from "../systems/InputSystem"
import { hideAllPanels } from "../ui/ui"
import { updatePlayModeReset } from "../modes/Play"
import { getEntity } from "./IWB"
import { removePlayModSystem, addPlayModeSystem } from "../systems/PlayModeSystem"
import { disableEntityForPlayMode } from "../modes/Play"

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

export function setPlayerMode(mode:SCENE_MODES){
    playerMode = mode

    console.log('setting player mode', playerMode)

    for (const [entity] of engine.getEntitiesWith(BuildModeVisibilty)) {
        if(playerMode === SCENE_MODES.CREATE_SCENE_MODE){
            if(ParcelFloor.has(entity)){
                Material.setPbrMaterial(entity, {
                    albedoColor: Color4.Red()
                })
            }else{
                GltfContainer.createOrReplace(entity, {src: redBeam})
            }
        }else{
            if(ParcelFloor.has(entity)){
                Material.setPbrMaterial(entity, {
                    albedoColor: Color4.create(0, 1, 0, .5)
                })
            }else{
                GltfContainer.createOrReplace(entity, {src: greenBeam})
            }
        }
    }

    hideAllOtherPointers()
    hideAllPanels()

    colyseusRoom.state.scenes.forEach((scene:any)=>{
        scene.parenting.forEach((item:any, i:number)=>{
            if(i > 2){
                let entityInfo = getEntity(scene, item.aid)
                if(entityInfo){
                    if(playerMode === SCENE_MODES.BUILD_MODE){
                        addBuildModePointers(entityInfo.entity)
                        resetEntityForBuildMode(scene, entityInfo)
                    }else{
                        disableEntityForPlayMode(scene, entityInfo)
                    }
                }
            }
        })
    })

    updatePlayModeReset(true)

    if(playerMode === SCENE_MODES.BUILD_MODE){
        removePlayModSystem()
        addInputSystem()
        updatePlayModeReset(false)
    }else if(playerMode === SCENE_MODES.PLAYMODE){
        removeInputSystem()
        addPlayModeSystem()
        utils.triggers.enableDebugDraw(false)
    }else{
        removeInputSystem()
        removePlayModSystem()
        utils.triggers.enableDebugDraw(false)
    }
}