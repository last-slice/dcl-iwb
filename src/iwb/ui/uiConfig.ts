import { localUserId, players } from "../components/player/player"
import resources from "../helpers/resources"
import { NOTIFICATION_TYPES } from "../helpers/types"
import { displayBlockPanel, showBlockPanel } from "./Panels/BlockPanel"
import { displayCatalogPanel, showCatalogPanel } from "./Panels/CatalogPanel"
import { showNotificationPanel, displayNotificationPanel } from "./Panels/NotificationPanel"
import { displayRectanglePanel, showRectanglePanel } from "./Panels/RectanglePanel"
import { displayAssetUploadUI } from "./Panels/assetUploadUI"
import { displayDeleteBuildPanel, showDeleteBuildPanel } from "./Panels/deleteBuildPanel"
import { showInfoPanel, displayInfoPanel } from "./Panels/infoPanel"
import { showLoadBuildPanel, displayLoadBuildPanel } from "./Panels/loadBuildPanel"
import { displayNoWeb3 } from "./Panels/noWeb3Panel"
import { showNotification } from "./Panels/notificationUI"
import { showPBuildConfirmPanel, displayPBuildConfirmPanel } from "./Panels/pBuildConfirmPanel"
import { showSaveBuildPanel, displaySaveBuildPanel } from "./Panels/saveBuildPanel"
import { showSettingsPanel, displaySettingsPanel } from "./Panels/settingsPanel"

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
            if(players.get(localUserId).dclData.hasConnectedWeb3 || resources.allowNoWeb3){
                displayAssetUploadUI(true)
            }else{
                displayNoWeb3(true)
            }
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
        visible:true,
        fn: ()=>{
            if(showSaveBuildPanel){
                displaySaveBuildPanel(false)
            }
            else{
                displaySaveBuildPanel(true)
            }

        }
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
        visible:true,
        fn: ()=>{
            if(showLoadBuildPanel){
                displayLoadBuildPanel(false)
            }
            else{
                displayLoadBuildPanel(true)
            }

        }
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
        visible:true,
        fn: ()=>{
            if(showDeleteBuildPanel){
                displayDeleteBuildPanel(false)
            }
            else{
                displayDeleteBuildPanel(true)
            }

        }
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
        visible:true,
        fn: ()=>{
            if(showNotificationPanel){
                displayNotificationPanel(false)
            }
            else{
                displayNotificationPanel(true)
            }

        }
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
        visible:true,
        fn: ()=>{
            if(showPBuildConfirmPanel){
                displayPBuildConfirmPanel(false)
            }
            else{
                displayPBuildConfirmPanel(true)
            }

        }
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
        visible:true,
        fn: ()=>{
            if(showSettingsPanel){
                displaySettingsPanel(false)
            }
            else{
                displaySettingsPanel(true)
            }

        }
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
        visible:true,
        fn: ()=>{
            if(showInfoPanel){
                displayInfoPanel(false)
            }
            else{
                displayInfoPanel(true)
            }

        }
    },
]