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
import { showSettingsPanel, displaySettingsPanel } from "./Panels/settings/settingsIndex"

export let uiModes:any = {
    0://playmode
    {
        atlas:"assets/atlas1.png",
        uvs:{
            atlasHeight:1024,
            atlasWidth:1024,
            sourceTop:128 * 6,
            sourceLeft:128 * 6,
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
            sourceTop:128 * 6,
            sourceLeft:128 * 7,
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
            if(players.has(localUserId) && players.get(localUserId)!.dclData.hasConnectedWeb3 || resources.allowNoWeb3){
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

export let settingsIconData:any =
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
}

export let uiSizes:any ={
        magnifyPressed:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 128 * 4,
        sourceLeft: 0,
        sourceWidth: 128,
        sourceHeight: 128
    },
    magnifyIcon:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 128 * 5,
        sourceLeft: 0,
        sourceWidth: 128,
        sourceHeight: 128
    },
    scaleIconPressed:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 0,
        sourceLeft: 128 * 4,
        sourceWidth: 128,
        sourceHeight: 128
    },
    scaleIcon:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 128,
        sourceLeft: 128 * 4,
        sourceWidth: 128,
        sourceHeight: 128
    },
    rotationIconPressed:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 0,
        sourceLeft: 128 * 5,
        sourceWidth: 128,
        sourceHeight: 128
    },
    rotationIcon:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 128,
        sourceLeft: 128 * 5,
        sourceWidth: 128,
        sourceHeight: 128
    },
    positionIconPressed:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 0,
        sourceLeft: 128 * 6,
        sourceWidth: 128,
        sourceHeight: 128
    },
    positionIcon:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 128,
        sourceLeft: 128 * 6,
        sourceWidth: 128,
        sourceHeight: 128
    },
    rightArrow:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 150,
        sourceLeft: 934,
        sourceWidth: 30,
        sourceHeight: 30
    },
    leftArrow:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 150,
        sourceLeft: 904,
        sourceWidth: 30,
        sourceHeight: 30
    },
    downArrow:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 150,
        sourceLeft: 874,
        sourceWidth: 30,
        sourceHeight: 30
    },
    upArrow:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 150,
        sourceLeft: 844,
        sourceWidth: 30,
        sourceHeight: 30
    },
    upCarot:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 150,
        sourceLeft: 964,
        sourceWidth: 30,
        sourceHeight: 30
    },
    downCarot:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 150,
        sourceLeft: 994,
        sourceWidth: 30,
        sourceHeight: 30
    },
    leftCarot:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 180,
        sourceLeft: 964,
        sourceWidth: 30,
        sourceHeight: 30
    },
    rightCarot:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 180,
        sourceLeft: 994,
        sourceWidth: 30,
        sourceHeight: 30
    },
    blackArrowRight:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 120,
        sourceLeft: 934,
        sourceWidth: 30,
        sourceHeight: 30
    },
    blackArrowLeft:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 120,
        sourceLeft: 904,
        sourceWidth: 30,
        sourceHeight: 30
    },
    opaqueSearchIcon:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 0,
        sourceLeft: 994,
        sourceWidth: 30,
        sourceHeight: 30
    },
    opaqueArrowRight:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 0,
        sourceLeft: 964,
        sourceWidth: 30,
        sourceHeight: 30
    },
    opaqueArrowleft:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 0,
        sourceLeft: 934,
        sourceWidth: 30,
        sourceHeight: 30
    },
    toggleOn:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 90,
        sourceLeft: 964,
        sourceWidth: 30,
        sourceHeight: 30
    },
    toggleOff:{        
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 90,
        sourceLeft: 934,
        sourceWidth: 30,
        sourceHeight: 30
    },

    dangerButton:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 841,
        sourceLeft: 579,
        sourceWidth: 223,
        sourceHeight: 41
    },

    blackButton:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 718,
        sourceLeft: 802,
        sourceWidth: 223,
        sourceHeight: 41
    },

    whiteButton:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 759,
        sourceLeft: 802,
        sourceWidth: 223,
        sourceHeight: 41
    },

    normalButton:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 801,
        sourceLeft: 802,
        sourceWidth: 223,
        sourceHeight: 41
    },

    normalLighterButton:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 841,
        sourceLeft: 802,
        sourceWidth: 223,
        sourceHeight: 41
    },

    normalLightestButton:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 841 + 41,
        sourceLeft: 802,
        sourceWidth: 223,
        sourceHeight: 41
    },

    blueLightestButton:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 718,
        sourceLeft: 579,
        sourceWidth: 223,
        sourceHeight: 41
    },

    blueButton:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 718,
        sourceLeft: 579,
        sourceWidth: 223,
        sourceHeight: 41
    },

    blueDarkestButton:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 718,
        sourceLeft: 579,
        sourceWidth: 223,
        sourceHeight: 41
    },

    positiveButton:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 923,
        sourceLeft: 579,
        sourceWidth: 223,
        sourceHeight: 41
    },

    rectangleButton:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 512,
        sourceLeft: 802,
        sourceWidth: 223,
        sourceHeight: 41
    },

    horizRectangle:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 512,
        sourceLeft: 0,
        sourceWidth: 519,
        sourceHeight: 365
    },

    vertRectangle:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 266,
        sourceLeft: 577,
        sourceWidth: 447,
        sourceHeight: 431
    },

    vertRectangleOpaque:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 514,
        sourceLeft: 384,
        sourceWidth: 345,
        sourceHeight: 511
    },

    horzRectangleOpaque:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 774,
        sourceLeft: 0,
        sourceWidth: 331,
        sourceHeight: 200
    },

    smallPill:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 263,
        sourceLeft: 0,
        sourceWidth: 578,
        sourceHeight: 232
    },

    largePill:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 0,
        sourceLeft: 0,
        sourceWidth: 824,
        sourceHeight: 263
    },

    infoButtonBlack:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 0,
        sourceLeft: 128,
        sourceWidth: 128,
        sourceHeight: 128
    },

    infoButtonOpaque:{
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 128,
        sourceLeft: 128,
        sourceWidth: 128,
        sourceHeight: 128
    }
}