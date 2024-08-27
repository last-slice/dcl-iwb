import { AvatarAnchorPointType, Entity, InputAction, TransformType, TweenLoop } from "@dcl/sdk/ecs"


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
    EDIT_SCENE_ASSET_CANCEL = 'edit_scene_asset_cancel',
    PLACE_SELECTED_ASSET = 'place_asset',
    SELECT_CATALOG_ASSET = 'select_catalog_asset',
    PLAYER_CANCELED_CATALOG_ASSET = 'player_canceled_catalog',
    ASSET_OVER_SCENE_LIMIT = 'asset_over_scene_limit',
    SUBMIT_FEEDBACK = 'submit_feedback',
    PLAYER_SETTINGS = 'player_settings',
    FIRST_TIME = 'first_time',

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
    PLAYER_ASSET_PENDING = 'player_asset_pending',
    UPDATE_ASSET_LOCKED = 'update_asset_locked',
    UPDATE_ASSET_BUILD_VIS = 'update_asset_build_visibility',
    DELETE_UGC_ASSET = 'delete_ugc_asset',
    ADD_WORLD_ASSETS = 'add_world_assets',
    DELETE_WORLD_ASSETS = 'delete_world_assets',

    // Scene
    SCENE_SAVE_NEW = "scene_save_new",
    SCENE_ADD_ITEM = 'scene_add_item',
    SCENE_DROPPED_GRABBED = 'scene_dropped_grabbed',
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
    SCENE_CLEAR_ASSETS = 'scene_clear_assets',
    SCENE_DEPLOY_FINISHED = 'scene_deploy_finished',
    SCENE_ACTION = 'scene_action',
    SCENE_DELETE_GRABBED_ITEM = 'scene_delete_grabbed_item',
    
    //World
    INIT_WORLD = "init_world",
    NEW_WORLD_CREATED = 'new_world_created',
    FORCE_DEPLOYMENT = 'force_deployment',
    SCENE_COUNT  = 'scene_count',
    ADDED_TUTORIAL = 'added_tutorial',
    REMOVED_TUTORIAL = 'removed_tutorial',
    UPDATED_TUTORIAL_CID = 'updated_tutorial_cid',
    WORLD_TRAVEL = 'world_travel',
    WORLD_ADD_BP = 'world_add_build_permissions',
    WORLD_DELETE_BP = 'world_delete_build_permissions',
    GET_MARKETPLACE = 'get_marketplace',
    START_GAME = 'start_game',
    END_GAME = 'end_game',
    FORCE_BACKUP = 'force_backup',

    CUSTOM = "custom",//
    IWB_VERSION_UPDATE ='iwb_version_update',

    //AUDIUS SPECIFIC ACTIONS
    PLAY_AUDIUS_TRACK = 'play_audius_track',

    //REMOTE SERVER ACTIONS
    CLAIM_REWARD = 'claim_reward',
    VERIFY_ACCESS = 'verify_access',

    //GAMING
    CREATE_GAME_LOBBY = 'create_game_lobby',
    HIT_OBJECT = 'hit_object',
    SHOOT = 'shoot',

    //QUESTING
    GET_QUEST_DEFINITIONS = 'get_quest_definitions',
    QUEST_EDIT = 'edit_quest'
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
    noSound?:boolean
}

export interface Player {
    dclData:any,
    mode:SCENE_MODES,
    viewMode?:VIEW_MODES,
    scenes:IWBScene[],
    worlds:any[],
    buildingAllowed?:boolean,
    previousParcel?:string,
    currentParcel?:string,
    uploadToken?:string,
    version?:number
    activeScene?: IWBScene | null,
    activeSceneId?:string,
    canBuild:boolean,
    objects:any[],
    selectedEntity?:Entity | null
    homeWorld?:boolean
    cameraParent?:Entity
    uploads?:any
    landsAvailable?:any[]
    worldsAvailable?:any[]
    deploymentLink?:string
    rotation?:number
    parent?:Entity
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
    lim:boolean
    direction:boolean
    // actions:any[]//
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
    anim:any[]
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
    trigComp:any
    actComp:any
    audComp:any
    trigArComp:any
    clickArComp:any
    npcComp:any
    animComp:any
    dialComp:any
    rComp:any
    editing:boolean
    ugc:boolean
    pending:boolean
    editor:string
    locked:boolean
    buildVis:boolean
    sceneId:string
}

export interface SelectedItem {
    n:string
    parent?:string
    mode:EDIT_MODES
    modifier: EDIT_MODIFIERS
    pFactor: number
    sFactor: number
    rFactor: number
    entity:Entity
    catalogId:string
    sceneId:string
    aid:string
    itemData?:SceneItem
    enabled:boolean
    already?:boolean
    grabbedTransform?:any
    transform?:TransformType
    pointer?:Entity
    initialHeight: number
    duplicate:boolean
    ugc:boolean
    distance:number
    rotation:number
    scale:number
}

export enum COMPONENT_TYPES {
    VISBILITY_COMPONENT = "Visibility",
    IMAGE_COMPONENT = "Image",
    VIDEO_COMPONENT = 'Video',
    MATERIAL_COMPONENT = "Material",
    TRANSFORM_COMPONENT = "Transform",
    NFT_COMPONENT = "NFT_Shape",
    TEXT_COMPONENT = "Text",
    ANIMATION_COMPONENT = "Animator",
    ADVANCED_COMPONENT = 'Advanced',
    NAMES_COMPONENT ='Name',
    GLTF_COMPONENT = 'Gltf',
    AUDIO_COMPONENT = 'Audio',
    // AUDIO_SOURCE_COMPONENT = 'Audio_Source',
    // AUDIO_STREAM_COMPONENT = 'Audio_Stream',
    IWB_COMPONENT = 'IWB',
    MESH_RENDER_COMPONENT = 'Mesh_Renderer',
    MESH_COLLIDER_COMPONENT = 'Mesh_Collider',
    TEXTURE_COMPONENT = 'Texture',
    BILLBOARD_COMPONENT = 'Billboard',
    PLAYLIST_COMPONENT ='Playlist',

    //advanced components
    PARENTING_COMPONENT = 'Parenting',
    STATE_COMPONENT ='States',
    POINTER_COMPONENT = 'Pointers',
    COUNTER_COMPONENT = 'Counters',
    UI_TEXT_COMPONENT = 'UI_Text',
    UI_IMAGE_COMPONENT ='UI_Image',
    TRIGGER_COMPONENT = "Triggers",
    ACTION_COMPONENT = 'Actions',
    // TRIGGER_AREA_COMPONENT = "Trigger_Area",
    CLICK_AREA_COMPONENT = "Click_Area",
    AVATAR_SHAPE_COMPONENT = 'Avatar_Shape',
    GAME_COMPONENT = 'Game',
    // LEVEL_COMPONENT = 'Levels',
    // BILLBOARD_COMPONENT = 'Billboard'
    LEVEL_COMPONENT = 'Levels',
    LIVE_COMPONENT = 'Live',
    GAME_ITEM_COMPONENT = 'GameItem',
    TEAM_COMPONENT = 'Team',
    NPC_COMPONENT = "NPC",
    DIALOG_COMPONENT = "Dialog",
    REWARD_COMPONENT = 'Reward',
    PATH_COMPONENT = 'Path',
    VLM_COMPONENT = 'VLM'
}

export enum BLOCKCHAINS {
    ETH = "ethereum",
    POLYGON = "matic"
}

export enum NFT_TYPES {
    ERC721 = "erc721",
    ERC1155 = "erc1155"
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
    STOP_TWEEN = 'tween_stop',
    START_TWEEN = "tween_start",
    PLAY_SOUND = "audio_play",
    STOP_SOUND = "audio_stop",
    SET_VISIBILITY = "entity_visiblity_change",
    ATTACH_PLAYER = "player_attach",//
    DETACH_PLAYER = "player_detach",
    PLAY_VIDEO = 'video_play',
    // TOGGLE_VIDEO = 'video_toggle',
    PLAY_VIDEO_STREAM = 'video_stream_play',
    STOP_VIDEO = 'video_stop',
    STOP_VIDEO_STREAM = 'video_stream_stop',
    PLAY_AUDIO_STREAM = 'audio_stream_play',
    STOP_AUDIO_STREAM = 'audio_stream_stop',
    TELEPORT_PLAYER = 'player_teleport',
    EMOTE = 'player_emote',
    OPEN_LINK = 'open_link',
    SHOW_TEXT = 'ui_text_show',
    HIDE_TEXT = 'ui_text_hide',
    START_DELAY = 'delay_start',
    STOP_DELAY = 'delay_stop',
    START_LOOP = 'loop_start',
    STOP_LOOP = 'loop_stop',
    CLONE = 'entity_clone',
    REMOVE = 'entity_remove',
    // SHOW_IMAGE = 'show_image',
    // HIDE_IMAGE = 'hide_image',
    PLAY_ANIMATION = 'animation_start',
    STOP_ANIMATION = 'animation_stop',
    SHOW_DIALOG ='dialog_show',
    HIDE_DIALOG = 'dialog_hide',
    ENABLE_CLICK_AREA = 'click_area_enable',
    DISABLE_CLICK_AREA = 'click_area_disable',
    ENABLE_TRIGGER_AREA = 'trigger_area_enable',
    DISABLE_TRIGGER_AREA = 'trigger_area_disable',
    GIVE_REWARD = 'reward_give',
    VERIFY_ACCESS = 'access_verify',
    ADD_NUMBER = 'number_add',
    SET_NUMBER = 'number_set',
    SUBTRACT_NUMBER = 'number_subtract',
    LOAD_LEVEL = 'level_load',
    END_LEVEL = 'level_end',
    COMPLETE_LEVEL = 'level_win',
    LOSE_LEVEL = 'level_lose',
    ADVANCED_LEVEL = 'level_advance',
    // START_TIMER = 'timer_start',
    // STOP_TIMER = 'timer_stop',
    LOCK_PLAYER = 'player_lock',
    UNLOCK_PLAYER = 'player_unlock',
    SET_POSITION = 'entity_set_position',
    SET_ROTATION = 'entity_set_rotation',
    SET_SCALE = 'entity_set_scale',
    SET_STATE = 'state_set',
    MOVE_PLAYER = 'player_move',
    SHOW_NOTIFICATION = 'notification_show',
    HIDE_NOTIFICATION = 'notification_hide',
    PLACE_PLAYER_POSITION = 'entity_place_player_position',
    BATCH_ACTIONS = 'actions_batch',
    RANDOM_ACTION = 'actions_random',
    SET_TEXT = 'text_set',
    SHOW_CUSTOM_IMAGE = 'ui_image_show',
    HIDE_CUSTOM_IMAGE = 'ui_image_hide',
    ATTEMPT_GAME_START = 'game_start_attempt',
    END_GAME = 'game_end',
    PLAY_PLAYLIST = 'playlist_play',
    SEEK_PLAYLIST = 'playlist_seek',
    STOP_PLAYLIST = 'playlist_stop',
    POPUP_SHOW = 'popup_show',
    POPUP_HIDE = 'popup_hide',
    RANDOM_NUMBER ='random_number',
    OPEN_NFT_DIALOG = 'nft_dialog_popup',
    VOLUME_UP = 'volume_up',
    VOLUME_DOWN = 'volume_down',
    VOLUME_SET = 'volume_set',
    FOLLOW_PATH = 'path_follow',
    QUEST_ACTION = 'quest_action',
}

InputAction.IA_ACTION_3

export enum Triggers {
    // ON_CLICK = "on_click",
    ON_ENTER = "on_enter",
    ON_LEAVE = "on_leave",
    ON_ACCESS_VERIFIED ='on_access_verified',
    ON_ACCESS_DENIED ='on_access_denied',
    ON_INPUT_ACTION = 'on_input_action',
    ON_TWEEN_END = 'on_tween_end',
    ON_DELAY = 'on_delay',
    ON_LOOP = 'on_loop',
    ON_CLONE = 'on_clone',
    ON_CLICK_IMAGE = 'on_click_image',
    // ON_DAMAGE = 'on_damage',
    ON_GLOBAL_CLICK = 'on_global_click',
    ON_CLOCK_TICK = 'on_scene_tick',
    // ON_HEAL = 'on_heal',//
    ON_STATE_CHANGE = "on_state_change",
    ON_COUNTER_CHANGE = "on_counter_change",
    ON_RAYCAST_HIT = 'on_raycast_hit',
    ON_GAME_START = 'on_game_start',
    ON_LEVEL_LOADED = 'on_level_loaded',
    // ON_LEVEL_LOAD = 'on_level_load',
    // ON_LEVEL_COMPLETE = 'on_level_win',//
    ON_LEVEL_END = 'on_level_end',
    // ON_LEVEL_LOSE = 'on_level_lose',
    ON_ENTER_SCENE = 'on_enter_scene',
    ON_LEAVE_SCENE = 'on_leave_scene',
    ON_ATTEMPT_START_GAME = 'on_attempt_start_game',
    ON_JOIN_LOBBY = 'on_join_lobby',
    ON_GAME_START_COUNTDOWN = 'on_game_start_countdown',
    ON_PLAYLIST_CHANGE = 'on_playlist_change',
    ON_PICKUP = 'on_pickup',
    ON_LOAD_SCENE = 'on_load_scene',
    ON_UNLOAD_SCENE = 'on_unload_scene',
}

export enum Pointers {
    POINTER_UP = "on_up",
    POINTER_DOWN = "on_down",
    HOVER_ENTER = "on_enter",
    HOVER_LEAVE = "on_leave",
}

export enum TriggerConditionType {
    WHEN_STATE_IS = 'when_state_is',
    WHEN_STATE_IS_NOT = 'when_state_is_not',
    WHEN_COUNTER_EQUALS = 'when_counter_equals',
    WHEN_COUNTER_IS_GREATER_THAN = 'when_counter_is_greater_than',
    WHEN_COUNTER_IS_LESS_THAN = 'when_counter_is_less_than',
    WHEN_DISTANCE_TO_PLAYER_LESS_THAN = 'when_distance_to_player_less_than',
    WHEN_DISTANCE_TO_PLAYER_GREATER_THAN = 'when_distance_to_player_greater_than',
    WHEN_PREVIOUS_STATE_IS = 'when_previous_state_is',
    WHEN_PREVIOUS_STATE_IS_NOT = 'when_previous_state_is_not',
  }

export enum TriggerConditionOperation {
  AND = 'and',
  OR = 'or',//
}

export enum Materials {
    PBR = "PBR",
    BASIC = "Basic",
    TEXTURE = "Texture"
}

export let ENTITY_POINTER_LABELS:any[] = [
    "Pointer",
    "E Button",
    "F Button",
    "ANY Button",
    "W Button",
    "S Button",
    "D Button",
    "A Button",
    "SPACE Button",
    "SHIFT Button",
    "#1 Button",
    "#2 Button",
    "#3 Button",
    "#4 Button",
]

export enum POINTER_EVENTS {
    PET_UP = "On Up",
    PET_DOWN = "On Down",
    PET_HOVER_ENTER = "On Hover Enter",
    PET_HOVER_LEAVE = "ON Hover Leave"
}

export enum COLLIDER_LAYERS {
    /** CL_NONE - no collisions */
    CL_NONE = 0,
    /** CL_POINTER - collisions with the player's pointer ray (e.g. mouse cursor hovering) */
    CL_POINTER = 1,
    /** CL_PHYSICS - collision affecting your player's physics i.e. walls, floor, moving platfroms */
    CL_PHYSICS = 2,
    CL_RESERVED1 = 4,
    CL_RESERVED2 = 8,
    CL_RESERVED3 = 16,
    CL_RESERVED4 = 32,
    CL_RESERVED5 = 64,
    CL_RESERVED6 = 128,
    CL_CUSTOM1 = 256,
    CL_CUSTOM2 = 512,
    CL_CUSTOM3 = 1024,
    CL_CUSTOM4 = 2048,
    CL_CUSTOM5 = 4096,
    CL_CUSTOM6 = 8192,
    CL_CUSTOM7 = 16384,
    CL_CUSTOM8 = 32768
}

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

export let ENTITY_EMOTES:any[] = [
    "Wave",
    "Fist bump",
    "Robot",
    "Raise hand",
    "Clap",
    "Money",
    "Kiss",
    "Tik",
    "Hammer",
    "Tektonik",
    "Dont see",
    "Hands air",
    "Shrug",
    "Disco",
    "Dab",
    "Head explode",
]

export let ENTITY_EMOTES_SLUGS:any[] = [
    "wave",
    "fistpump",
    "robot",
    "raiseHand",
    "clap",
    "money",
    "kiss",
    "tik",
    "hammer",
    "tektonik",
    "dontsee",
    "handsair",
    "shrug",
    "disco",
    "dab",
    "headexplode",
]

export let TEXT_ALIGN:string[] = [
    "Top Left",
    "Top Center",
    "Top Right",
    
    "Middle Left",
    "Middle Center",
    "Middle Right",

    "Bottom Left",
    "Bottom Center",
    "Bottom Right",
]

export enum TEXT_ALIGN_MODES {
    TAM_TOP_LEFT = 0,
    TAM_TOP_CENTER = 1,
    TAM_TOP_RIGHT = 2,
    TAM_MIDDLE_LEFT = 3,
    TAM_MIDDLE_CENTER = 4,
    TAM_MIDDLE_RIGHT = 5,
    TAM_BOTTOM_LEFT = 6,
    TAM_BOTTOM_CENTER = 7,
    TAM_BOTTOM_RIGHT = 8
}

export let TWEEN_TYPE_SLUGS:string[] = [
    "MOVE",
    "ROTATION",
    "SCALE"
]

export enum TWEEN_TYPES {
    MOVE,
    ROTATION,
    SCALE
}

export let TWEEN_EASE_SLUGS:string[] = [
    "LINEAR"
]

export enum TWEEN_EASE_TYPES {
    LINEAR
}

export let TWEEN_LOOP_SLUGS:string[] = [
    "NONE",
    "RESTART",
    "YOYO",
]

export enum REWARD_TYPES {
    DCL_ITEM = 'dcl_item'
}

export enum ACCESS_TYPES {
    NFT_OWNERSHP = 'nft_ownership'
}

export enum ACCESS_CATEGORIES {
    HAS_OWNERSHIP = 'has_ownership',
    HAS_ON = 'has_on'
}

export enum ACCESS_FILTERS {
    HAS_ALL = 'has_all',
    HAS_ANY = 'has_any'
}

export enum COUNTER_VALUE {
    CURRENT,
    PREVIOUS
}

export enum AUDIO_TYPES {
    SOUND,
    STREAM
}

export enum AVATAR_ANCHOR_POINTS {
    AAPT_POSITION = 0,
    AAPT_NAME_TAG = 1,
    AAPT_HEAD = 4,
    AAPT_NECK = 5,
    AAPT_SPINE = 6,
    AAPT_SPINE1 = 7,
    AAPT_SPINE2 = 8,
    AAPT_HIP = 9,
    AAPT_LEFT_SHOULDER = 10,
    AAPT_LEFT_ARM = 11,
    AAPT_LEFT_FOREARM = 12,
    AAPT_LEFT_HAND = 2,
    AAPT_LEFT_HAND_INDEX = 13,
    AAPT_RIGHT_SHOULDER = 14,
    AAPT_RIGHT_ARM = 15,
    AAPT_RIGHT_FOREARM = 16,
    AAPT_RIGHT_HAND = 3,
    AAPT_RIGHT_HAND_INDEX = 17,
    AAPT_LEFT_UP_LEG = 18,
    AAPT_LEFT_LEG = 19,
    AAPT_LEFT_FOOT = 20,
    AAPT_LEFT_TOE_BASE = 21,
    AAPT_RIGHT_UP_LEG = 22,
    AAPT_RIGHT_LEG = 23,
    AAPT_RIGHT_FOOT = 24,
    AAPT_RIGHT_TOE_BASE = 25
}

export enum SCENE_CATEGORIES {
    ART = "art",
    GAME = "game",
    CASINO = 'casino',
    SOCIAL = 'social',
    MUSIC = 'music',
    FASHION = 'fashion',
    CRYPTO = 'crypto',
    EDUCATION = 'education',
    SHOP = 'shop',
    BUSINESS = 'business',
    SPORTS = 'sports',   
}

export enum CATALOG_IDS {
    WHITE_ARROW = "cb3a9e83-4b2d-4b3b-b9c1-2b636a94b36c",
    BLANK_GRASS = 'assets/a20e1fbd-9d55-4536-8a06-db8173c1325e.glb',
    AUDIO_STREAM = "e6991f31-4b1e-4c17-82c2-2e484f53a124"
}

export enum GAME_TYPES {
    SOLO = "SOLO",
    MULTIPLAYER = "MULTIPLAYER",
}

export enum PLAYER_GAME_STATUSES {
    NONE = 'none',
    PLAYING = 'playing',
    LOBBY = 'lobby',
    WAITING = 'waiting',
    ELIMINATED = 'eliminated'
}

export enum GAME_WEAPON_TYPES {
    GUN = 'gun',
    SWORD = 'sword'
}