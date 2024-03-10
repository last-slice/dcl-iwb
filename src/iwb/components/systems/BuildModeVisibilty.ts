import {engine, VisibilityComponent} from "@dcl/sdk/ecs"
import {localPlayer} from "../player/player"
import {BuildModeVisibilty} from "../modes/create"
import { editCurrentSceneParcels } from "../../ui/Panels/CreateScenePanel"

let timer = 0

export function BuildModeVisibiltyComponents(dt: number) {

    if (timer > 0) {
        timer -= dt
    } else {
        timer = .2
        for (const [entity] of engine.getEntitiesWith(BuildModeVisibilty)) {
            VisibilityComponent.createOrReplace(entity).visible = (localPlayer.mode !== 0 || editCurrentSceneParcels);
        }
    }
}