import { engine } from "@dcl/sdk/ecs"
import { log } from "../helpers/functions"

export let added = false

export function addPlayModeSystem(){
    if(!added){
        added = true
        engine.addSystem(PlayModeInputSystem)
    }
}

export function removePlayModSystem(){
    engine.removeSystem(PlayModeInputSystem)
    added = false
}

export function PlayModeInputSystem(dt: number) {
}