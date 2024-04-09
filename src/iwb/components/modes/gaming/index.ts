import { ColliderLayer, Entity, Material, MeshCollider, MeshRenderer, TextShape, Transform, engine } from "@dcl/sdk/ecs";
import { IWBScene, NOTIFICATION_TYPES, SERVER_MESSAGE_TYPES } from "../../../helpers/types";
import { hideNotification, showNotification } from "../../../ui/Panels/notificationUI";
import { Color4, Vector3 } from "@dcl/sdk/math";
import { getWorldPosition, getWorldRotation } from "@dcl-sdk/utils";
import { findSceneByParcel, isEntityInScene } from "../../../helpers/build";
import { checkBuildPermissionsForScene, sceneBuilds } from "../../scenes";
import { addAllBuildModePointers } from "../build";
import { localPlayer } from "../../player/player";
import { newGame } from "../../../ui/Panels/builds/newGamePanel";
import { sendServerMessage } from "../../messaging";

let gameLobby:Entity = engine.addEntity()
let itemPosition = {x: 0, y: 0, z: 4}
export let placingGameLobby:boolean = false

export function addGameLobby(){
    placingGameLobby = true
    showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Every game needs a lobby. Place one in your scene. This will be the spawn point between levels and where to find your Start Game Object.", animate:{enabled:true, return:false}})

    MeshRenderer.setBox(gameLobby)
    Transform.createOrReplace(gameLobby, {position: itemPosition, parent: engine.PlayerEntity})
}

export function dropGameLobbyPoint(){
    // item was not canceled, drop it in the new position
    // get current item position
    const finalPosition: Vector3.MutableVector3 = getWorldPosition(gameLobby);

    // find scene from parcel item is in
    let parcel = "" + Math.floor(finalPosition.x / 16) + "," + Math.floor(finalPosition.z / 16);
    const curScene = findSceneByParcel(parcel);

    // check user build permissions for scene
    const bpsCurScene = checkBuildPermissionsForScene(curScene);

    // if scene found and permissions allowed, add item to scene
    if (curScene && bpsCurScene){//} && isEntityInScene(grabbed, "")) {
        // PointerEvents.deleteFrom(selectedItem.entity);
        // VisibilityComponent.createOrReplace(bbE, {visible: false});
        addAllBuildModePointers();
        createGameLobby(curScene, newGame)

        sendServerMessage(SERVER_MESSAGE_TYPES.CREATE_GAME_LOBBY, {config: newGame, t:Transform.get(gameLobby), sceneId: curScene.id})
    }
}

export function removeGameLobbyItem(){
    engine.removeEntity(gameLobby)
}

export async function loadGame(scene:any, data:any){
    createGameLobby(scene, data)
}

function createGameLobby(scene:any, data:any, curScene?:IWBScene){
    // if(!gameLobby){
    //     console.log('game lobby is false')//
    //     gameLobby = engine.addEntity()
        MeshRenderer.setBox(gameLobby)
        Transform.createOrReplace(gameLobby, {position: data.p, parent: engine.PlayerEntity})
    // }

    const finalPosition: Vector3.MutableVector3 = getWorldPosition(gameLobby);

    // localPlayer.activeScene = curScene ? ;
    let t = Transform.getMutableOrNull(gameLobby);
    if(t){
        t.rotation = getWorldRotation(gameLobby)

        // find position relative to scene parent
        const curSceneParent = curScene ? curScene.parentEntity : sceneBuilds.get(scene.id).parentEntity
        const curSceneParentPosition = Transform.get(curSceneParent).position;
        finalPosition.x = finalPosition.x - curSceneParentPosition.x;
        finalPosition.z = finalPosition.z - curSceneParentPosition.z;
        t.position = finalPosition

        t.parent = curSceneParent;
    }

    Material.setPbrMaterial(gameLobby, {
        albedoColor: Color4.create(0, 1, 0, .5)
    })
    TextShape.createOrReplace(gameLobby, {text: data.name + "\nGame Lobby & Config", fontSize: 3})
    MeshCollider.setBox(gameLobby, ColliderLayer.CL_POINTER)
}