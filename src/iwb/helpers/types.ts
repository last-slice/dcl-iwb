import { Entity, TransformType } from "@dcl/sdk/ecs"


export enum SERVER_MESSAGE_TYPES {
    INIT = "init",
    PLAYER_LEAVE = "player_leave",

    // Parcels
    SELECT_PARCEL = "select_parcel",
    REMOVE_PARCEL = "remove_parcel",

    // Player
    PLAY_MODE_CHANGED = 'play_mode_changed',
    SELECTED_SCENE_ASSET = 'selected_scene_asset',
    EDIT_SCENE_ASSET = 'edit_scene_asset',
    EDIT_SCENE_ASSET_DONE = 'edit_scene_asset_done',
    PLACE_SELECTED_ASSET = 'place_asset',
    SELECT_CATALOG_ASSET = 'select_catalog_asset',
    PLAYER_CANCELED_CATALOG_ASSET = 'player_canceled_catalog',
    ASSET_OVER_SCENE_LIMIT = 'asset_over_scene_limit',

    // Catalog and Assets
    CATALOG_UPDATED = 'catalog_updated',
    PLAYER_ASSET_UPLOADED = 'player_asset_uploaded',
    PLAYER_ASSET_CATALOG = 'player_asset_catalog',
    PLAYER_CATALOG_DEPLOYED = 'player_catalog_deployed',
    PLAYER_RECEIVED_MESSAGE = 'player_received_message',
    PLAYER_SCENES_CATALOG = 'player_scenes_catalog',
    PLAYER_JOINED_USER_WORLD = 'player_joined_private_world',
    PLAYER_EDIT_ASSET = 'player_edit_asset',
    UPDATE_ITEM_COMPONENT = "update_component",
    UPDATE_GRAB_Y_AXIS = 'update_grab_y_axix',

    // Scene
    SCENE_SAVE_NEW = "scene_save_new",
    SCENE_ADD_ITEM = 'scene_add_item',
    SCENE_ADDED_NEW = "scene_added_new",
    SCENE_LOAD = 'scene_load',
    SCENE_UPDATE_ITEM = 'scene_update_item',
    SCENE_DELETE_ITEM = 'scene_delete_item',
    SCENE_ADD_BP = 'add_build_permissions',
    SCENE_DELETE_BP = 'delete_build_permissions',
    SCENE_DELETE = 'delete_scene',
    SCENE_UPDATE_PARCELS = 'scene_update_parcels',
    SCENE_SAVE_EDITS = 'scene_save_edits',
    SCENE_UPDATE_ENABLED = 'scene_update_enabled',
    SCENE_UPDATE_PRIVACY = 'scene_update_privacy',
    SCENE_DOWNLOAD = 'scene_download',
    SCENE_DEPLOY = 'scene_deploy',
    SCENE_DEPLOY_READY = 'scene_deploy_ready',
    SCENE_ADDED_SPAWN = "scene_added_spawn",
    SCENE_DELETE_SPAWN = "scene_delete_spawn",
    
    //World
    INIT_WORLD = "init_world",
    NEW_WORLD_CREATED = 'new_world_created',
    FORCE_DEPLOYMENT = 'force_deployment',
}

export enum IWB_MESSAGE_TYPES {
    OPEN_ASSET_UPLOAD_URL = 'open_asset_uploader_url',
    USE_SELECTED_ASSET = 'use_asset',
    PLACE_SELECTED_ASSET = 'place_asset',
    REMOVE_SELECTED_ASSET = 'remove_asset'
}

export enum SCENE_MODES {
    PLAYMODE,
    CREATE_SCENE_MODE,
    BUILD_MODE
}

export enum VIEW_MODES {
    AVATAR,
    GOD
}

export enum EDIT_MODES {
    GRAB,
    EDIT
}

export enum EDIT_MODIFIERS {
    POSITION,
    ROTATION,
    SCALE,
    TRANSFORM
}

export type PlayerData = {
    dclData:any | null,
    mode: SCENE_MODES,
}

export enum NOTIFICATION_TYPES {
    MESSAGE = "message",
    IMAGE = "image"
}

export type NOTIFICATION_DETAIL = {
    type:NOTIFICATION_TYPES,
    animate?:{
        enabled:boolean,
        return:boolean,
        time?:number
    }
    message:string,
    image?:string,
    imageData?:any
    button?:string,
    label?:string,
    forceShow?:boolean,
    fn?:any
}

export interface Player {
    dclData:any,
    mode:SCENE_MODES,
    viewMode:VIEW_MODES,
    scenes:IWBScene[],
    worlds:any[],
    buildingAllowed:boolean,
    currentParcel:string,
    uploadToken:string,
    version: number
    activeScene: IWBScene | null,
    activeSceneId:string,
    canBuild:boolean,
    objects:any[],
    selectedEntity:Entity | null
    homeWorld:boolean
    cameraParent:Entity
    uploads:any
    landsAvailable:any[]
    worldsAvailable:any[]
    deploymentLink:string
}

export interface IWBScene {
    parentEntity:Entity,
    id:string,
    n:string, 
    d:string,
    o:string,
    ona:string,
    cat:string,
    bpcl:string,
    ass:SceneItem[],
    bps:string[],
    rat:string[],
    rev:string[],
    pcls:string[],
    sp:string[],
    cp:string[],
    cd:number,
    upd:number,
    si:number,
    toc:number,
    pc:number,
    pcnt:number,
    isdl:boolean,
    e:boolean,
    entities:Entity[],
    im?:string,
    priv:boolean,
    // actions:any[]
}

export interface CatalogItemType {
    id: string
    aid:string
    v:  number // version
    im: string // image
    n:  string
    objName: string
    ty:string
    cat: string
    pc: number
    on: string
    si: number
    d: string
    sty:string
    tag: Array<string>
    bb:any
}

export interface SceneItem extends CatalogItemType{
    p: {x:number, y:number, z:number},
    r: {x:number, y:number, z:number, w?:number},
    s: {x:number, y:number, z:number}
    entity?:Entity
    type:string
    sty:string
    comps:any[]
    visComp:any
    colComp:any
    imgComp:any
    vidComp:any
    matComp:any
    nftComp:any
    textComp:any
    clickComp:any
    trigComp:any
    actComp:any
    audComp:any
    trigArComp:any
    editing:boolean
    ugc:boolean
    pending:boolean
    editor:string
}

export interface SelectedItem {
    mode:EDIT_MODES
    modifier: EDIT_MODIFIERS
    pFactor: number
    sFactor: number
    rFactor: number
    entity:Entity
    catalogId:string
    sceneId:string
    aid:string
    itemData:SceneItem
    enabled:boolean
    already?:boolean
    transform?:TransformType
    pointer?:Entity
    initialHeight: number
    duplicate:boolean
    ugc:boolean
    isCatalogSelect?:boolean
}

export enum COMPONENT_TYPES {
    VISBILITY_COMPONENT = "Visibility",
    IMAGE_COMPONENT = "Image",
    VIDEO_COMPONENT = 'Video',
    AUDIO_COMPONENT = 'Audio',
    MATERIAL_COMPONENT = "Material",
    COLLISION_COMPONENT = "Collision",
    TRANSFORM_COMPONENT = "Transform",
    NFT_COMPONENT = "NFT",
    TEXT_COMPONENT = "Text",
    TRIGGER_COMPONENT = "Trigger",
    ACTION_COMPONENT = 'Action',
    TRIGGER_AREA_COMPONENT = "Trigger Area",
}

export enum COLLISION_LAYERS {
    INVISIBLE = "invisible",
    VISIBLE = "visible"
}

export enum BLOCKCHAINS {
    ETH = "eth",
    POLYGON = "polygon"
}

export enum NFT_FRAMES {
    NFT_CLASSIC = "classic",
    NFT_BAROQUE_ORNAMENT = "baroque",
    NFT_DIAMOND_ORNAMENT = "diamond",
    NFT_MINIMAL_WIDE = "minimal wide",
    NFT_MINIMAL_GREY = 'minimal grey',
    NFT_BLOCKY = 'blocky',
    NFT_GOLD_EDGES = 'gold edges',
    NFT_GOLD_CARVED = 'gold carved',
    NFT_GOLD_WIDE = 'gold wide',
    NFT_GOLD_ROUNDED = 'gold rounded',
    NFT_METAL_MEDIUM = 'metal medium',
    NFT_METAL_WIDE = 'metal wide',
    NFT_METAL_SLIM = 'metal slim',
    NFT_METAL_ROUNDED = 'metal rounded',
    NFT_PINS = 'pins',
    NFT_MINIMAL_BLACK = 'minimal black',
    NFT_MINIMAL_WHITE = 'minimal white',
    NFT_TAPE = 'tape',
    NFT_WOOD_SLIM = 'slim',
    NFT_WOOD_WIDE = 'wood wide',
    NFT_WOOD_TWIGS = 'wood twigs',
    NFT_CANVAS = 'canvas',
    NFT_NONE = "none",
}

export enum Actions {
    START_TWEEN = "start_tween",
    PLAY_SOUND = "play_sound",
    STOP_SOUND = "stop_sound",
    SET_VISIBILITY = "set_vis",
    ATTACH_PLAYER = "attach_player",
    DETACH_PLAYER = "detach_player",
    PLAY_VIDEO = 'play_video',
    TOGGLE_VIDEO = 'toggle_video',
    PLAYER_VIDEO_STREAM = 'play_video_stream',
    STOP_VIDEO = 'stop_video',
    STOP_VIDEO_STREAM = 'stop_video_stream',
    PLAY_AUDIO = 'play_audio',
    PLAY_AUDIO_STREAM = 'play_audio_stream',
    STOP_AUDIO = 'stop_audio',
    STOP_AUDIO_STREAM = 'stop_audio_stream',
    TELEPORT_PLAYER = 'telport',
    EMOTE = 'emote',
    OPEN_LINK = 'open_link',
    SHOW_TOAST = 'show_toast',
    HIDE_TOAS = 'hide_toast',
    START_DELAY = 'start_delay',
    STOP_DELAY = 'stop_delay',
    START_LOOP = 'start_loop',
    STOP_LOOP = 'stop_loop',
    CLONE = 'clone',
    REMOVE = 'remove',
    SHOW_IMAGE = 'show_image',
    HIDE_IMAGE = 'hide_image'
}

export enum Triggers {
    ON_CLICK = "on_click",
    ON_SPAWN = "on_spawn"
}

export enum Materials {
    PBR = "PBR",
    BASIC = "Basic",
    TEXTURE = "Texture"
}

export let ENTITY_ACTIONS_LABELS:any[] = [
    "Open Link",
    "Play Audio",
    "Play Video",
    "Toggle Video"
]

export let ENTITY_ACTIONS_SLUGS:any[] = [
    Actions.OPEN_LINK,
    Actions.PLAY_AUDIO,
    Actions.PLAY_VIDEO,
    Actions.TOGGLE_VIDEO
]

export let ENTITY_TRIGGER_LABELS:any[] = [
    "On Click"
]

export let ENTITY_TRIGGER_SLUGS:any[] = [
    Triggers.ON_CLICK
]

export let MATERIAL_TYPES:Materials[] =[
    Materials.PBR, 
    Materials.BASIC,
    Materials.TEXTURE,
]


export enum SOUND_TYPES {
    ATMOS_BLESSING = "atmos_blessing",
    WOOD_3 = "wood_3",
    DOORBELL = "doorbell",
    DROP_1_STEREO = "drop_1",
    SELECT_3 = "select_3",
    ERROR_2 = "error_2",
}