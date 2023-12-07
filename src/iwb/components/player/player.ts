import {Player, SCENE_MODES, SERVER_MESSAGE_TYPES, VIEW_MODES} from "../../helpers/types";
import {iwbEvents, sendServerMessage} from "../messaging";
import {deleteCreationEntities} from "../modes/create";
import {AvatarAnchorPointType, AvatarAttach, engine, Transform} from "@dcl/sdk/ecs";
import {displayRealmTravelPanel} from "../../ui/Panels/realmTravelPanel";
import {displaySettingsPanel} from "../../ui/Panels/settings/settingsIndex";
import {changeRealm} from "~system/RestrictedActions";
import {log} from "../../helpers/functions";
import resources from "../../helpers/resources";
import {Vector3} from "@dcl/sdk/math";

export let localUserId: string
export let localPlayer: Player
export let players: Map<string, Player> = new Map<string, Player>()
export let iwbConfig: any = {}

export async function addPlayer(userId: string, local: boolean, data?: any[]) {
    if (local) {
        localUserId = userId
    }

    let pData: any = {
        dclData: null,
        mode: SCENE_MODES.PLAYMODE,
        viewMode: VIEW_MODES.AVATAR,
        scenes: [],
        objects: [],
        buildingAllowed: false,
        selectedEntity: null,
        canBuild: false,
        homeWorld: false,
        worlds: [],
    }

    if (!local) {
        log('non local user')
        let parent = engine.addEntity()
        AvatarAttach.create(parent, {
            avatarId: userId,
            anchorPointId: AvatarAnchorPointType.AAPT_POSITION
        })
        pData.parent = parent
    } else {

        let cameraParent = engine.addEntity()
        Transform.create(cameraParent, {position: Vector3.create(0, 0, 6), parent: engine.CameraEntity})
        //MeshRenderer.setBox(cameraParent)

        pData.cameraParent = cameraParent

        localPlayer = pData
    }

    if (data) {
        data.forEach((item: any) => {
            for (let key in item) {
                pData[key] = item[key]
            }
        })
    }

    players.set(userId, pData)
    return players.get(userId)
}

export async function getPlayerNames() {
    let res = await fetch(resources.endpoints.dclNamesGraph, {
        headers: {"content-type": "application/json"},
        method: "POST",
        body: JSON.stringify({
            variables: {offset: 0, owner: localUserId},
            query: "query getUserNames($owner: String, $offset: Int) {\n  nfts(first: 1000, skip: $offset, where: {owner: $owner, category: ens}) {\n    ens {\n      subdomain\n    }\n  }\n}\n"
        })
    })

    let json = await res.json()
    console.log('player names are ', json)
    if (json.data) {
        json.data.nfts.forEach((nft: any) => {
            localPlayer.worlds.push({
                name: nft.ens.subdomain,
                owner: localUserId,
                ens: nft.ens.subdomain + ".dcl.eth",
                builds: 0,
                updated: 0,
                init: false,
                version: 0
            })
        })
    }

}


export function removePlayer(user: string) {
    /**
     * todo
     * add other garbage collection and entity clean up here
     */

    let player = players.get(user)
    if (player) {

        /**
         * maybe move to its own file and function
         */
        if (player.mode === SCENE_MODES.CREATE_SCENE_MODE) {
            deleteCreationEntities(user)
        }


        players.delete(user)//
    }
}

export function addPlayerScenes(user: string, scenes: any[]) {
    let player = players.get(user)
    if (player) {
        scenes.forEach((scene) => {
            player!.scenes.push(scene)
        })
    }
}

export function setPlayMode(user: string, mode: SCENE_MODES) {
    let player = players.get(user)
    if (player) {
        player.mode = mode
        iwbEvents.emit(SERVER_MESSAGE_TYPES.PLAY_MODE_CHANGED, {mode: mode})
        sendServerMessage(SERVER_MESSAGE_TYPES.PLAY_MODE_CHANGED, {mode: mode})
    }
}

export function worldTravel(world: any) {
    log('traveling to world', world)

    displaySettingsPanel(false)
    displayRealmTravelPanel(false, {})
    changeRealm({realm: "https://worlds.dcl-iwb.co/world/" + world.ens})
}

export function hasBuildPermissions() {
    return players.get(localUserId)!.canBuild || players.get(localUserId)!.homeWorld
}