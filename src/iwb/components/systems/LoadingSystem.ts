import {engine, GltfContainerLoadingState, VisibilityComponent} from "@dcl/sdk/ecs"
import { GLTFLoadedComponent } from "../../helpers/Components"
import { displayLoadingScreen } from "../../ui/Panels/LoadingScreen"

export let loadingTime = 0

export function addLoadingScreen(){
    loadingTime = 0
    engine.addSystem(LoadingSystem)
    displayLoadingScreen(true)
}

export function removeLoadingScreen(){
    engine.removeSystem(LoadingSystem)
    displayLoadingScreen(false)
}

export function LoadingSystem(dt: number) {
    if(loadingTime <= 10){
        loadingTime += dt
    }else{
        removeLoadingScreen()
    }
}