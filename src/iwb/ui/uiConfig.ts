import { NOTIFICATION_TYPES } from "../helpers/types"
import { displayBlockPanel, showBlockPanel } from "./BlockPanel"
import { displayCatalogPanel, showCatalogPanel } from "./CatalogPanel"
import { displayRectanglePanel, showRectanglePanel } from "./RectanglePanel"
import { displayAssetUploadUI } from "./assetUploadUI"
import { showNotification } from "./notificationUI"

export let uiModes:any = {
    0://playmode
    {
        atlas:"assets/atlas1.png",
        uvs:{
            atlasHeight:1024,
            atlasWidth:1024,
            sourceTop:128 * 0,
            sourceLeft:128 * 0,
            sourceWidth:128,
            sourceHeight:128
        },
    },

    1://create scene mode
    {
        atlas:"assets/atlas1.png",
        uvs:{
            atlasHeight:1024,
            atlasWidth:1024,
            sourceTop:128 * 0,
            sourceLeft:128 * 1,
            sourceWidth:128,
            sourceHeight:128
        },
    },

    2://build mode
    {
        atlas:"assets/atlas1.png",
        uvs:{
            atlasHeight:1024,
            atlasWidth:1024,
            sourceTop:128 * 3,
            sourceLeft:128 * 3,
            sourceWidth:128,
            sourceHeight:128
        },
    },
}

export let topTools:any[]= [
    {
        name:"GodMode",
        atlas:"assets/atlas1.png",
        enabledUV:{
            atlasHeight:1024,
            atlasWidth:1024,
            sourceTop:128 * 2,
            sourceLeft:128 * 3,
            sourceWidth:128,
            sourceHeight:128
        },
        disabledUV:{
            atlasHeight:1024,
            atlasWidth:1024,
            sourceTop:128 * 2,
            sourceLeft:128 * 3,
            sourceWidth:128,
            sourceHeight:128
        },
        enabled:true,
        visible:true,
        fn:()=>{
        }
    },
    {
        name:"Box",
        atlas:"assets/atlas1.png",
        enabledUV:{
            atlasHeight:1024,
            atlasWidth:1024,
            sourceTop:128 * 0,
            sourceLeft:128 * 2,
            sourceWidth:128,
            sourceHeight:128
        },
        disabledUV:{
            atlasHeight:1024,
            atlasWidth:1024,
            sourceTop:128 * 0,
            sourceLeft:128 * 2,
            sourceWidth:128,
            sourceHeight:128
        },
        enabled:true,
        visible:true,
        fn:()=>{
            if(showCatalogPanel){
                displayCatalogPanel(false)
            }
            else{
                displayCatalogPanel(true)
            }
            
        }
    },
    {
        name:"Image",
        atlas:"assets/atlas1.png",
        enabledUV:{
            atlasHeight:1024,
            atlasWidth:1024,
            sourceTop:128 * 0,
            sourceLeft:128 * 3,
            sourceWidth:128,
            sourceHeight:128
        },
        disabledUV:{
            atlasHeight:1024,
            atlasWidth:1024,
            sourceTop:128 * 0,
            sourceLeft:128 * 3,
            sourceWidth:128,
            sourceHeight:128
        },
        enabled:true,
        visible:true,
        fn:()=>{
            displayRectanglePanel(!showRectanglePanel)
        }
    },
    // {
    //     name:"Position",
    //     atlas:"assets/atlas1.png",
    //     enabledUV:{
    //         atlasHeight:1024,
    //         atlasWidth:1024,
    //         sourceTop:128 * 0,
    //         sourceLeft:128 * 4,
    //         sourceWidth:128,
    //         sourceHeight:128
    //     },
    //     disabledUV:{
    //         atlasHeight:1024,
    //         atlasWidth:1024,
    //         sourceTop:128 * 0,
    //         sourceLeft:128 * 4,
    //         sourceWidth:128,
    //         sourceHeight:128
    //     },
    //     enabled:true,
    //     visible:true,
    //     fn:()=>{
    //         displayBlockPanel(!showBlockPanel)
    //     }
    // },
    // {
    //     name:"Rotation",
    //     atlas:"assets/atlas1.png",
    //     enabledUV:{
    //         atlasHeight:1024,
    //         atlasWidth:1024,
    //         sourceTop:128 * 0,
    //         sourceLeft:128 * 5,
    //         sourceWidth:128,
    //         sourceHeight:128
    //     },
    //     disabledUV:{
    //         atlasHeight:1024,
    //         atlasWidth:1024,
    //         sourceTop:128 * 0,
    //         sourceLeft:128 * 5,
    //         sourceWidth:128,
    //         sourceHeight:128
    //     },
    //     enabled:true,
    //     visible:true
    // },
    // {
    //     name:"Scale",
    //     atlas:"assets/atlas1.png",
    //     enabledUV:{
    //         atlasHeight:1024,
    //         atlasWidth:1024,
    //         sourceTop:128 * 0,
    //         sourceLeft:128 * 6,
    //         sourceWidth:128,
    //         sourceHeight:128
    //     },
    //     disabledUV:{
    //         atlasHeight:1024,
    //         atlasWidth:1024,
    //         sourceTop:128 * 0,
    //         sourceLeft:128 * 6,
    //         sourceWidth:128,
    //         sourceHeight:128
    //     },
    //     enabled:true,
    //     visible:true
    // },
    // {
    //     name:"Orbit",
    //     atlas:"assets/atlas1.png",
    //     enabledUV:{
    //         atlasHeight:1024,
    //         atlasWidth:1024,
    //         sourceTop:128 * 0,
    //         sourceLeft:128 * 7,
    //         sourceWidth:128,
    //         sourceHeight:128
    //     },
    //     disabledUV:{
    //         atlasHeight:1024,
    //         atlasWidth:1024,
    //         sourceTop:128 * 0,
    //         sourceLeft:128 * 7,
    //         sourceWidth:128,
    //         sourceHeight:128
    //     },
    //     enabled:true,
    //     visible:true
    // },
    // {
    //     name:"Duplicate",
    //     atlas:"assets/atlas1.png",
    //     enabledUV:{
    //         atlasHeight:1024,
    //         atlasWidth:1024,
    //         sourceTop:128 * 2,
    //         sourceLeft:128 * 0,
    //         sourceWidth:128,
    //         sourceHeight:128
    //     },
    //     disabledUV:{
    //         atlasHeight:1024,
    //         atlasWidth:1024,
    //         sourceTop:128 * 2,
    //         sourceLeft:128 * 0,
    //         sourceWidth:128,
    //         sourceHeight:128
    //     },
    //     enabled:true,
    //     visible:true
    // },
    // {
    //     name:"Undo",
    //     atlas:"assets/atlas1.png",
    //     enabledUV:{
    //         atlasHeight:1024,
    //         atlasWidth:1024,
    //         sourceTop:128 * 2,
    //         sourceLeft:128 * 1,
    //         sourceWidth:128,
    //         sourceHeight:128
    //     },
    //     disabledUV:{
    //         atlasHeight:1024,
    //         atlasWidth:1024,
    //         sourceTop:128 * 2,
    //         sourceLeft:128 * 1,
    //         sourceWidth:128,
    //         sourceHeight:128
    //     },
    //     enabled:true,
    //     visible:true
    // },
]

export let bottomTools:any[]=[
    {
        name:"Upload",
        atlas:"assets/atlas1.png",
        enabledUV:{
            atlasHeight:1024,
            atlasWidth:1024,
            sourceTop:128 * 4,
            sourceLeft:128 * 7,
            sourceWidth:128,
            sourceHeight:128
        },
        disabledUV:{
            atlasHeight:1024,
            atlasWidth:1024,
            sourceTop:128 * 5,
            sourceLeft:128 * 7,
            sourceWidth:128,
            sourceHeight:128
        },
        enabled:true,
        visible:true,
        fn:()=>{
            displayAssetUploadUI(true)
        }
    },
    {
        name:"Save",
        atlas:"assets/atlas1.png",
        enabledUV:{
            atlasHeight:1024,
            atlasWidth:1024,
            sourceTop:128 * 2,
            sourceLeft:128 * 5,
            sourceWidth:128,
            sourceHeight:128
        },
        disabledUV:{
            atlasHeight:1024,
            atlasWidth:1024,
            sourceTop:128 * 3,
            sourceLeft:128 * 5,
            sourceWidth:128,
            sourceHeight:128
        },
        enabled:true,
        visible:true
    },
    {
        name:"Refresh",
        atlas:"assets/atlas1.png",
        enabledUV:{
            atlasHeight:1024,
            atlasWidth:1024,
            sourceTop:128 * 2,
            sourceLeft:128 * 6,
            sourceWidth:128,
            sourceHeight:128
        },
        disabledUV:{
            atlasHeight:1024,
            atlasWidth:1024,
            sourceTop:128 * 3,
            sourceLeft:128 * 6,
            sourceWidth:128,
            sourceHeight:128
        },
        enabled:true,
        visible:true
    },
    {
        name:"Trash",
        atlas:"assets/atlas1.png",
        enabledUV:{
            atlasHeight:1024,
            atlasWidth:1024,
            sourceTop:128 * 2,
            sourceLeft:128 * 7,
            sourceWidth:128,
            sourceHeight:128
        },
        disabledUV:{
            atlasHeight:1024,
            atlasWidth:1024,
            sourceTop:128 * 3,
            sourceLeft:128 * 7,
            sourceWidth:128,
            sourceHeight:128
        },
        enabled:true,
        visible:true
    },
    {
        name:"Magnify",
        atlas:"assets/atlas1.png",
        enabledUV:{
            atlasHeight:1024,
            atlasWidth:1024,
            sourceTop:128 * 4,
            sourceLeft:128 * 0,
            sourceWidth:128,
            sourceHeight:128
        },
        disabledUV:{
            atlasHeight:1024,
            atlasWidth:1024,
            sourceTop:128 * 5,
            sourceLeft:128 * 0,
            sourceWidth:128,
            sourceHeight:128
        },
        enabled:true,
        visible:true
    },
    {
        name:"Share",
        atlas:"assets/atlas1.png",
        enabledUV:{
            atlasHeight:1024,
            atlasWidth:1024,
            sourceTop:128 * 4,
            sourceLeft:128 * 1,
            sourceWidth:128,
            sourceHeight:128
        },
        disabledUV:{
            atlasHeight:1024,
            atlasWidth:1024,
            sourceTop:128 * 5,
            sourceLeft:128 * 1,
            sourceWidth:128,
            sourceHeight:128
        },
        enabled:true,
        visible:true
    },
    {
        name:"Settings",
        atlas:"assets/atlas1.png",
        enabledUV:{
            atlasHeight:1024,
            atlasWidth:1024,
            sourceTop:128 * 4,
            sourceLeft:128 * 2,
            sourceWidth:128,
            sourceHeight:128
        },
        disabledUV:{
            atlasHeight:1024,
            atlasWidth:1024,
            sourceTop:128 * 5,
            sourceLeft:128 * 2,
            sourceWidth:128,
            sourceHeight:128
        },
        enabled:true,
        visible:true
    },
    {
        name:"Info",
        atlas:"assets/atlas1.png",
        enabledUV:{
            atlasHeight:1024,
            atlasWidth:1024,
            sourceTop:128 * 0,
            sourceLeft:128 * 1,
            sourceWidth:128,
            sourceHeight:128
        },
        disabledUV:{
            atlasHeight:1024,
            atlasWidth:1024,
            sourceTop:128 * 1,
            sourceLeft:128 * 1,
            sourceWidth:128,
            sourceHeight:128
        },
        enabled:true,
        visible:true
    },
]