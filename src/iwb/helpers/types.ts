

export enum SERVER_MESSAGE_TYPES {
    INIT = "init",
    PLAYER_LEAVE = "player_leave",
    SELECT_PARCEL = "select_parcel",
    REMOVE_PARCEL = "remove_parcel",
    CATALOG_UPDATED = 'catalog_updated',
    PLAY_MODE_CHANGED = 'play_mode_changed',
    PLAYER_ASSET_UPLOADED = 'player_asset_uploaded'
}

export enum IWB_MESSAGE_TYPES {
    OPEN_ASSET_UPLOAD_URL = 'open_asset_uploader_url'
}


export enum SCENE_MODES {
    PLAYMODE,
    CREATE_SCENE_MODE,
    BUILD_MODE
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