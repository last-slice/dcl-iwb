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
import { refreshVisibleItems } from "../../ui/Panels/settings/uploadsPanel";//

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
        uploads: [],
        activeSceneId:"",
        worldsAvailable:[],
        landsAvailable:[
            {name:"Test Land", size:2, type:"own"},
            {name:"Test Land2", size:2, type:"own"},
            {name:"Test Land3", size:2, type:"deploy"},
            {name:"Test Land4", size:2, type:"deploy"},
            {name:"Test Land5", size:2, type:"own"},
            {name:"Test Land6", size:2, type:"own"},
        ]
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
        })//
    }
}

export async function getPlayerLand(){
    let res = await fetch(resources.endpoints.dclLandGraph, {
        headers: {"content-type": "application/json"},
        method: "POST",
        body: JSON.stringify({
            "operationName": "Land",
            "variables": {
              "address": "0xaabe0ecfaf9e028d63cf7ea7e772cf52d662691a",
              "tenantTokenIds": [],
              "lessorTokenIds": []
            },
            "query": "query Land($address: Bytes, $tenantTokenIds: [String!], $lessorTokenIds: [String!]) {\n  tenantParcels: parcels(\n    first: 1000\n    skip: 0\n    where: {tokenId_in: $tenantTokenIds}\n  ) {\n    ...parcelFields\n  }\n  tenantEstates: estates(first: 1000, skip: 0, where: {id_in: $tenantTokenIds}) {\n    ...estateFields\n  }\n  lessorParcels: parcels(\n    first: 1000\n    skip: 0\n    where: {tokenId_in: $lessorTokenIds}\n  ) {\n    ...parcelFields\n  }\n  lessorEstates: estates(first: 1000, skip: 0, where: {id_in: $lessorTokenIds}) {\n    ...estateFields\n  }\n  ownerParcels: parcels(\n    first: 1000\n    skip: 0\n    where: {estate: null, owner: $address}\n  ) {\n    ...parcelFields\n  }\n  ownerEstates: estates(first: 1000, skip: 0, where: {owner: $address}) {\n    ...estateFields\n  }\n  updateOperatorParcels: parcels(\n    first: 1000\n    skip: 0\n    where: {updateOperator: $address}\n  ) {\n    ...parcelFields\n  }\n  updateOperatorEstates: estates(\n    first: 1000\n    skip: 0\n    where: {updateOperator: $address}\n  ) {\n    ...estateFields\n  }\n  ownerAuthorizations: authorizations(\n    first: 1000\n    skip: 0\n    where: {owner: $address, type: \"UpdateManager\"}\n  ) {\n    operator\n    isApproved\n    tokenAddress\n  }\n  operatorAuthorizations: authorizations(\n    first: 1000\n    skip: 0\n    where: {operator: $address, type: \"UpdateManager\"}\n  ) {\n    owner {\n      address\n      parcels(first: 1000, skip: 0, where: {estate: null}) {\n        ...parcelFields\n      }\n      estates(first: 1000) {\n        ...estateFields\n      }\n    }\n    isApproved\n    tokenAddress\n  }\n}\n\nfragment parcelFields on Parcel {\n  x\n  y\n  tokenId\n  owner {\n    address\n  }\n  updateOperator\n  data {\n    name\n    description\n  }\n}\n\nfragment estateFields on Estate {\n  id\n  owner {\n    address\n  }\n  updateOperator\n  size\n  parcels(first: 1000) {\n    x\n    y\n    tokenId\n  }\n  data {\n    name\n    description\n  }\n}\n"
          })
    })

    let json = await res.json()
    console.log("player lands are ", json)

    let ownedLand:any[] = []
    json.data.ownerParcels.forEach((parcel:any)=>{
        ownedLand.push({name:parcel.data.name.substring(0,12), size:1, type:"own", x:parcel.x, y:parcel.y})
    })

    let deployLand:any[] = []
    json.data.updateOperatorParcels.forEach((parcel:any)=>{
        if(!ownedLand.find((land:any)=> land.x === parcel.x && land.y === parcel.y)){
            deployLand.push({name:"Operator Land", size:1, type:"deploy", x:parcel.x, y:parcel.y})
        }
    })

    localPlayer.landsAvailable = ownedLand.concat(deployLand)
    console.log('land ava', localPlayer.landsAvailable)
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


        players.delete(user)
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

export function addPendingAsset(info:any){
    localPlayer.uploads.push({type:info.ty, name: info.n, status:"READY"})
    refreshVisibleItems()
}