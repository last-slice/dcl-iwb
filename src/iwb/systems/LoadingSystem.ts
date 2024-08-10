import {engine} from "@dcl/sdk/ecs"
import { displayMainLoadingScreen } from "../ui/Objects/LoadingScreen"

export let loadingTime = 0


export function addLoadingScreen(){
    loadingTime = 0
    engine.addSystem(LoadingSystem)
    displayMainLoadingScreen(true)
}

export function removeLoadingScreen(){
    engine.removeSystem(LoadingSystem)
    displayMainLoadingScreen(false)
}

export function LoadingSystem(dt: number) {
    if(loadingTime <= 10){
        loadingTime += dt
    }else{
        removeLoadingScreen()
    }
}