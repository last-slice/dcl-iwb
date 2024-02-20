import {engine, GltfContainerLoadingState, VisibilityComponent} from "@dcl/sdk/ecs"
import { GLTFLoadedComponent } from "../../helpers/Components"
import { displayLoadingScreen } from "../../ui/Panels/LoadingScreen"

let time = 10

export function addLoadingScreen(){
    time = 10
    engine.addSystem(LoadingSystem)
    displayLoadingScreen(true)
}

export function removeLoadingScreen(){
    engine.removeSystem(LoadingSystem)
    displayLoadingScreen(false)
}

export function LoadingSystem(dt: number) {
    if(time >= 0){
        time -= dt
    }else{
        removeLoadingScreen()
    }
}