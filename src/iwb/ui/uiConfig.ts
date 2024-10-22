import players from "@dcl/sdk/players"
import { isLocalPlayer, localPlayer, localUserId } from "../components/Player"
import resources from "../helpers/resources"
import { NOTIFICATION_TYPES, VIEW_MODES } from "../helpers/types"
import { toggleFlyMode } from "../modes/Flying"
import { toggleSnapMode } from "../systems/SelectedItemSystem"
import { getImageAtlasMapping } from "./helpers"
import { playerViewMode } from "../components/Config"
import { displayMainView, mainIWBPanelShow } from "./Objects/IWBView"
import { displayCatalogPanel, showCatalogPanel } from "./Objects/CatalogPanel"
import { hideAllPanels } from "./ui"
import { displaySceneAssetInfoPanel, showSceneInfoPanel } from "./Objects/SceneInfoPanel"
import { showNotification } from "./Objects/NotificationPanel"
import { displaySkinnyVerticalPanel } from "./Reuse/SkinnyVerticalPanel"
import { getView } from "./uiViews"
import { openExternalUrl } from "~system/RestrictedActions"
import { displaySceneDetailsPanel, showSceneDetailPanel } from "./Objects/SceneMainDetailPanel"
import { items } from "../components/Catalog"

export let uiModes: any = {
    0://playmode
        {
            atlas: "assets/atlas1.png",
            uvs: {
                atlasHeight: 1024,
                atlasWidth: 1024,
                sourceTop: 128 * 6,
                sourceLeft: 128 * 6,
                sourceWidth: 128,
                sourceHeight: 128
            },
        },

    1://create scene mode
        {
            atlas: "assets/atlas1.png",
            uvs: {
                atlasHeight: 1024,
                atlasWidth: 1024,
                sourceTop: 128 * 0,
                sourceLeft: 128 * 1,
                sourceWidth: 128,
                sourceHeight: 128
            },
        },

    2://build mode
        {
            atlas: "assets/atlas1.png",
            uvs: {
                atlasHeight: 1024,
                atlasWidth: 1024,
                sourceTop: 128 * 6,
                sourceLeft: 128 * 7,
                sourceWidth: 128,
                sourceHeight: 128
            },
        },
}

export let topTools: any[] = [
    {
        name: "GodMode",
        atlas: "assets/atlas1.png",
        enabledUV: {
            atlasHeight: 1024,
            atlasWidth: 1024,
            sourceTop: 128 * 2,
            sourceLeft: 128 * 3,
            sourceWidth: 128,
            sourceHeight: 128
        },
        disabledUV: {
            atlasHeight: 1024,
            atlasWidth: 1024,
            sourceTop: 128 * 3,
            sourceLeft: 128 * 3,
            sourceWidth: 128,
            sourceHeight: 128
        },
        enabled: true,
        visible: true,
        fn: () => {
            toggleFlyMode()
        },
        uvOverride: () => {
            return isLocalPlayer(localUserId) ? 
                playerViewMode === VIEW_MODES.GOD ? 
                getImageAtlasMapping(uiSizes.godModeButton) : 
                getImageAtlasMapping(uiSizes.carpenterButton) : 
            getImageAtlasMapping()
        }
    },
    {
        name: "Box",
        atlas: "assets/atlas1.png",
        enabledUV: {
            atlasHeight: 1024,
            atlasWidth: 1024,
            sourceTop: 128 * 0,
            sourceLeft: 128 * 2,
            sourceWidth: 128,
            sourceHeight: 128
        },
        disabledUV: {
            atlasHeight: 1024,
            atlasWidth: 1024,
            sourceTop: 128 * 0,
            sourceLeft: 128 * 2,
            sourceWidth: 128,
            sourceHeight: 128
        },
        enabled: true,
        visible: true,
        fn: () => {
            if(localPlayer.activeScene && !localPlayer.activeScene.e){
                showNotification({type:NOTIFICATION_TYPES.MESSAGE, message: "Please enable this scene before adding assets.", animate:{enabled:true, return:true, time:5}})
                return
            }

            console.log(items)

            if (showCatalogPanel) {
                displayCatalogPanel(false)
            } else {
                hideAllPanels()
                displayCatalogPanel(true)
            }
        }
    },
    {
        name: "Snap",
        atlas: "assets/atlas1.png",
        enabledUV: {
            atlasHeight: 1024,
            atlasWidth: 1024,
            sourceTop: 128 * 2,
            sourceLeft: 128 * 4,
            sourceWidth: 128,
            sourceHeight: 128
        },
        disabledUV: {
            atlasHeight: 1024,
            atlasWidth: 1024,
            sourceTop: 128 * 3,
            sourceLeft: 128 * 4,
            sourceWidth: 128,
            sourceHeight: 128
        },
        enabled: false,
        visible: true,
        toggle: true,
        fn: () => {
            toggleSnapMode()
        },
        always:true
    },
    {
        name: "Upload",
        atlas: "assets/atlas1.png",
        enabledUV: {
            atlasHeight: 1024,
            atlasWidth: 1024,
            sourceTop: 128 * 4,
            sourceLeft: 128 * 7,
            sourceWidth: 128,
            sourceHeight: 128
        },
        disabledUV: {
            atlasHeight: 1024,
            atlasWidth: 1024,
            sourceTop: 128 * 5,
            sourceLeft: 128 * 7,
            sourceWidth: 128,
            sourceHeight: 128
        },
        enabled: true,
        visible: true,
        fn: () => {
            if(localPlayer && (localPlayer.homeWorld || localPlayer.worldPermissions)){
                displaySkinnyVerticalPanel(true, getView("Upload_Assets"), undefined, ()=>{
                    openExternalUrl({url:(resources.DEBUG ? resources.endpoints.toolsetTest : resources.endpoints.deploymentProd) + "/upload/" + localUserId + "/" + localPlayer.uploadToken})
                })
            }
        }
    },
    {
        name: "SceneInfo",
        atlas: "assets/atlas1.png",
        enabledUV: {
            atlasHeight: 1024,
            atlasWidth: 1024,
            sourceTop: 128 * 0,
            sourceLeft: 128 * 1,
            sourceWidth: 128,
            sourceHeight: 128
        },
        disabledUV: {
            atlasHeight: 1024,
            atlasWidth: 1024,
            sourceTop: 128 * 1,
            sourceLeft: 128 * 1,
            sourceWidth: 128,
            sourceHeight: 128
        },
        enabled: true,
        visible: true,
        fn: () => {
            if(mainIWBPanelShow){
                return
            }

            if (showSceneInfoPanel) {
                displaySceneAssetInfoPanel(false)
            } else {
                hideAllPanels()
                displaySceneAssetInfoPanel(true)
            }
        },
    },
    // {//
    //     name: "Image",
    //     atlas: "assets/atlas1.png",
    //     enabledUV: {
    //         atlasHeight: 1024,
    //         atlasWidth: 1024,
    //         sourceTop: 128 * 0,
    //         sourceLeft: 128 * 3,
    //         sourceWidth: 128,
    //         sourceHeight: 128
    //     },
    //     disabledUV: {
    //         atlasHeight: 1024,
    //         atlasWidth: 1024,
    //         sourceTop: 128 * 0,
    //         sourceLeft: 128 * 3,
    //         sourceWidth: 128,
    //         sourceHeight: 128
    //     },
    //     enabled: true,
    //     visible: true,
    //     fn: () => {
    //         displayRectanglePanel(!showRectanglePanel)
    //     }
    // },
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

export let bottomTools: any[] = [
    {
        name: "Upload",
        atlas: "assets/atlas1.png",
        enabledUV: {
            atlasHeight: 1024,
            atlasWidth: 1024,
            sourceTop: 128 * 4,
            sourceLeft: 128 * 7,
            sourceWidth: 128,
            sourceHeight: 128
        },
        disabledUV: {
            atlasHeight: 1024,
            atlasWidth: 1024,
            sourceTop: 128 * 5,
            sourceLeft: 128 * 7,
            sourceWidth: 128,
            sourceHeight: 128
        },
        enabled: true,
        visible: true,
        fn: () => {
            // if (isLocalPlayer(localUserId) && !localPlayer.dclData.isGuest || resources.allowNoWeb3) {
            //     displayAssetUploadUI(true)
            // } else {
            //     displayNoWeb3(true)
            // }
        }
    },
    {
        name: "Save",
        atlas: "assets/atlas1.png",
        enabledUV: {
            atlasHeight: 1024,
            atlasWidth: 1024,
            sourceTop: 128 * 2,
            sourceLeft: 128 * 5,
            sourceWidth: 128,
            sourceHeight: 128
        },
        disabledUV: {
            atlasHeight: 1024,
            atlasWidth: 1024,
            sourceTop: 128 * 3,
            sourceLeft: 128 * 5,
            sourceWidth: 128,
            sourceHeight: 128
        },
        enabled: true,
        visible: true,
        fn: () => {
            // if (showSaveBuildPanel) {
            //     displaySaveBuildPanel(false)
            // } else {
            //     displaySaveBuildPanel(true)
            // }
        }
    },
    // {
    //     name: "Refresh",
    //     atlas: "assets/atlas1.png",
    //     enabledUV: {
    //         atlasHeight: 1024,
    //         atlasWidth: 1024,
    //         sourceTop: 128 * 2,
    //         sourceLeft: 128 * 6,
    //         sourceWidth: 128,
    //         sourceHeight: 128
    //     },
    //     disabledUV: {
    //         atlasHeight: 1024,
    //         atlasWidth: 1024,
    //         sourceTop: 128 * 3,
    //         sourceLeft: 128 * 6,
    //         sourceWidth: 128,
    //         sourceHeight: 128
    //     },
    //     enabled: true,
    //     visible: true,
    //     fn: () => {
    //         if (showLoadBuildPanel) {
    //             displayLoadBuildPanel(false)
    //         } else {
    //             displayLoadBuildPanel(true)
    //         }

    //     }
    // },
    // {
    //     name: "Trash",
    //     atlas: "assets/atlas1.png",
    //     enabledUV: {
    //         atlasHeight: 1024,
    //         atlasWidth: 1024,
    //         sourceTop: 128 * 2,
    //         sourceLeft: 128 * 7,
    //         sourceWidth: 128,
    //         sourceHeight: 128
    //     },
    //     disabledUV: {
    //         atlasHeight: 1024,
    //         atlasWidth: 1024,
    //         sourceTop: 128 * 3,
    //         sourceLeft: 128 * 7,
    //         sourceWidth: 128,
    //         sourceHeight: 128
    //     },
    //     enabled: true,
    //     visible: true,
    //     fn: () => {
    //         if (showDeleteBuildPanel) {
    //             displayDeleteBuildPanel(false)
    //         } else {
    //             displayDeleteBuildPanel(true)
    //         }

    //     }
    // },
    // {
    //     name: "Magnify",
    //     atlas: "assets/atlas1.png",
    //     enabledUV: {
    //         atlasHeight: 1024,
    //         atlasWidth: 1024,
    //         sourceTop: 128 * 4,
    //         sourceLeft: 128 * 0,
    //         sourceWidth: 128,
    //         sourceHeight: 128
    //     },
    //     disabledUV: {
    //         atlasHeight: 1024,
    //         atlasWidth: 1024,
    //         sourceTop: 128 * 5,
    //         sourceLeft: 128 * 0,
    //         sourceWidth: 128,
    //         sourceHeight: 128
    //     },
    //     enabled: true,
    //     visible: true,
    //     fn: () => {
    //         if (showNotificationPanel) {
    //             displayNotificationPanel(false)
    //         } else {
    //             displayNotificationPanel(true)
    //         }

    //     }
    // },
    // {
    //     name: "Share",
    //     atlas: "assets/atlas1.png",
    //     enabledUV: {
    //         atlasHeight: 1024,
    //         atlasWidth: 1024,
    //         sourceTop: 128 * 4,
    //         sourceLeft: 128 * 1,
    //         sourceWidth: 128,
    //         sourceHeight: 128
    //     },
    //     disabledUV: {
    //         atlasHeight: 1024,
    //         atlasWidth: 1024,
    //         sourceTop: 128 * 5,
    //         sourceLeft: 128 * 1,
    //         sourceWidth: 128,
    //         sourceHeight: 128
    //     },
    //     enabled: true,
    //     visible: true,
    //     fn: () => {
    //         if (showPBuildConfirmPanel) {
    //             displayPBuildConfirmPanel(false)
    //         } else {
    //             displayPBuildConfirmPanel(true)
    //         }

    //     }
    // },
    {
        name: "Info",
        atlas: "assets/atlas1.png",
        enabledUV: {
            atlasHeight: 1024,
            atlasWidth: 1024,
            sourceTop: 128 * 0,
            sourceLeft: 128 * 1,
            sourceWidth: 128,
            sourceHeight: 128
        },
        disabledUV: {
            atlasHeight: 1024,
            atlasWidth: 1024,
            sourceTop: 128 * 1,
            sourceLeft: 128 * 1,
            sourceWidth: 128,
            sourceHeight: 128
        },
        enabled: true,
        visible: true,
        fn: () => {
            // if (showInfoPanel) {
            //     displayInfoPanel(false)
            // } else {
            //     displayInfoPanel(true)
            // }
        }
    },
]

export let settingsIconData: any =
    {
        name: "Settings",
        atlas: "assets/atlas1.png",
        enabledUV: {
            atlasHeight: 1024,
            atlasWidth: 1024,
            sourceTop: 128 * 4,
            sourceLeft: 128 * 6,
            sourceWidth: 128,
            sourceHeight: 128
        },
        disabledUV: {
            atlasHeight: 1024,
            atlasWidth: 1024,
            sourceTop: 128 * 5,
            sourceLeft: 128 * 6,
            sourceWidth: 128,
            sourceHeight: 128
        },
        enabled: true,
        visible: true,
        fn: () => {
            if(showSceneInfoPanel){
                displaySceneAssetInfoPanel(false)
            }

            if(showSceneDetailPanel){
                displaySceneDetailsPanel(false)
            }

            displayMainView(true, true)
        }
    }

export let uiSizes: any = {
    emptyCheckWhite: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 240,
        sourceLeft: 873,
        sourceWidth: 30,
        sourceHeight: 30
    },
    checkWhite: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 240,
        sourceLeft: 843,
        sourceWidth: 30,
        sourceHeight: 30
    },
    checkWithBoxWhite: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 240,
        sourceLeft: 903,
        sourceWidth: 30,
        sourceHeight: 30
    },
    trophyIcon: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 90,
        sourceLeft: 995,
        sourceWidth: 30,
        sourceHeight: 30
    },
    trophyIconGray: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 120,
        sourceLeft: 965,
        sourceWidth: 30,
        sourceHeight: 30
    },
    trophyIconWhite: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 120,
        sourceLeft: 996,
        sourceWidth: 30,
        sourceHeight: 30
    },
    plusButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 718,
        sourceLeft: 880,
        sourceWidth: 128,
        sourceHeight: 128
    },
    minusButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 718,
        sourceLeft: 752,
        sourceWidth: 128,
        sourceHeight: 128
    },
    shiftButtonClick: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 907,
        sourceLeft: 961,
        sourceWidth: 60,
        sourceHeight: 60
    },
    heartIconRed: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 90,
        sourceLeft: 844 + 30,
        sourceWidth: 30,
        sourceHeight: 30
    },
    heartIconWhite: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 90,
        sourceLeft: 844 + 30 + 30,
        sourceWidth: 30,
        sourceHeight: 30
    },
    goIcon: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 90,
        sourceLeft: 844,
        sourceWidth: 30,
        sourceHeight: 30
    },
    rowPillDark: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 924,
        sourceLeft: 142,
        sourceWidth: 540,
        sourceHeight: 50
    },
    rowPillLight: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 974,
        sourceLeft: 142,
        sourceWidth: 540,
        sourceHeight: 50
    },
    rowPillLightest: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 897,
        sourceLeft: 142,
        sourceWidth: 292,
        sourceHeight: 27
    },
    buttonPillBlack: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 974,
        sourceLeft: 0,
        sourceWidth: 117.65,
        sourceHeight: 50
    },
    buttonPillBlue: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 924,
        sourceLeft: 0,
        sourceWidth: 117.65,
        sourceHeight: 50
    },
    magnifyPressed: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 128 * 4,
        sourceLeft: 0,
        sourceWidth: 128,
        sourceHeight: 128
    },
    magnifyIcon: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 128 * 5,
        sourceLeft: 0,
        sourceWidth: 128,
        sourceHeight: 128
    },
    scaleIconPressed: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 0,
        sourceLeft: 128 * 4,
        sourceWidth: 128,
        sourceHeight: 128
    },
    scaleIcon: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 128,
        sourceLeft: 128 * 4,
        sourceWidth: 128,
        sourceHeight: 128
    },
    rotationIconPressed: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 0,
        sourceLeft: 128 * 5,
        sourceWidth: 128,
        sourceHeight: 128
    },
    rotationIcon: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 128,
        sourceLeft: 128 * 5,
        sourceWidth: 128,
        sourceHeight: 128
    },
    positionIconPressed: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 0,
        sourceLeft: 128 * 6,
        sourceWidth: 128,
        sourceHeight: 128
    },
    positionIcon: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 128,
        sourceLeft: 128 * 6,
        sourceWidth: 128,
        sourceHeight: 128
    },
    rightArrow: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 150,
        sourceLeft: 934,
        sourceWidth: 30,
        sourceHeight: 30
    },
    leftArrow: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 150,
        sourceLeft: 904,
        sourceWidth: 30,
        sourceHeight: 30
    },
    downArrow: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 150,
        sourceLeft: 874,
        sourceWidth: 30,
        sourceHeight: 30
    },
    upArrow: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 150,
        sourceLeft: 844,
        sourceWidth: 30,
        sourceHeight: 30
    },
    upCarot: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 150,
        sourceLeft: 964,
        sourceWidth: 30,
        sourceHeight: 30
    },
    downCarot: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 150,
        sourceLeft: 994,
        sourceWidth: 30,
        sourceHeight: 30
    },
    leftCarot: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 180,
        sourceLeft: 964,
        sourceWidth: 30,
        sourceHeight: 30
    },
    rightCarot: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 180,
        sourceLeft: 994,
        sourceWidth: 30,
        sourceHeight: 30
    },
    blackArrowRight: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 120,
        sourceLeft: 934,
        sourceWidth: 30,
        sourceHeight: 30
    },
    blackArrowLeft: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 120,
        sourceLeft: 904,
        sourceWidth: 30,
        sourceHeight: 30
    },
    opaqueSearchBG: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 898,
        sourceLeft: 47,
        sourceWidth: 30,
        sourceHeight: 30
    },
    opaqueSearchTransparent: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 898,
        sourceLeft: 288,
        sourceWidth: 30,
        sourceHeight: 30
    },
    opaqueSearchIcon: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 0,
        sourceLeft: 994,
        sourceWidth: 30,
        sourceHeight: 30
    },
    opaqueArrowRight: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 0,
        sourceLeft: 964,
        sourceWidth: 30,
        sourceHeight: 30
    },
    opaqueArrowleft: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 0,
        sourceLeft: 934,
        sourceWidth: 30,
        sourceHeight: 30
    },

    toggleOn: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 90,
        sourceLeft: 964,
        sourceWidth: 30,
        sourceHeight: 30
    },
    toggleOff: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 90,
        sourceLeft: 934,
        sourceWidth: 30,
        sourceHeight: 30
    },

    dangerButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 841,
        sourceLeft: 579,
        sourceWidth: 223,
        sourceHeight: 41
    },

    blackButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 718,
        sourceLeft: 802,
        sourceWidth: 223,
        sourceHeight: 41
    },

    whiteButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 759,
        sourceLeft: 802,
        sourceWidth: 223,
        sourceHeight: 41
    },

    normalButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 801,
        sourceLeft: 802,
        sourceWidth: 223,
        sourceHeight: 41
    },

    normalLighterButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 841,
        sourceLeft: 802,
        sourceWidth: 223,
        sourceHeight: 41
    },

    normalLightestButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 841 + 41,
        sourceLeft: 802,
        sourceWidth: 223,
        sourceHeight: 41
    },

    blueLightestButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 718,
        sourceLeft: 579,
        sourceWidth: 223,
        sourceHeight: 41
    },

    blueButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 718,
        sourceLeft: 579,
        sourceWidth: 223,
        sourceHeight: 41
    },

    blueDarkestButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 718,
        sourceLeft: 579,
        sourceWidth: 223,
        sourceHeight: 41
    },

    positiveButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 923,
        sourceLeft: 579,
        sourceWidth: 223,
        sourceHeight: 41
    },

    rectangleButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 512,
        sourceLeft: 802,
        sourceWidth: 223,
        sourceHeight: 41
    },

    largeHorizontalPill:{
        atlasHeight:1024,
        atlasWidth:1024,
        sourceTop:0,
        sourceLeft:0,
        sourceWidth:824,
        sourceHeight:263
    },

    horizRectangle: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 512,
        sourceLeft: 0,
        sourceWidth: 519,
        sourceHeight: 365
    },

    vertRectangle: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 266,
        sourceLeft: 579,
        sourceWidth: 446,
        sourceHeight: 431
    },

    vertRectangleOpaque: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 646,
        sourceLeft: 510,
        sourceWidth: 258,
        sourceHeight: 383
    },

    horzRectangleOpaque: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 774,
        sourceLeft: 0,
        sourceWidth: 331,
        sourceHeight: 200
    },

    smallPill: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 263,
        sourceLeft: 0,
        sourceWidth: 578,
        sourceHeight: 232
    },

    largePill: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 0,
        sourceLeft: 0,
        sourceWidth: 824,
        sourceHeight: 263
    },

    infoButtonBlack: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 0,
        sourceLeft: 128,
        sourceWidth: 128,
        sourceHeight: 128
    },

    backButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 180,
        sourceLeft: 874,
        sourceWidth: 30,
        sourceHeight: 30
    },
    backButtonTrans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 368,
        sourceLeft: 874,
        sourceWidth: 30,
        sourceHeight: 30
    },
    eyeTrans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 2,
        sourceLeft: 0,
        sourceWidth: 128,
        sourceHeight: 128
    },
    eyeClosed: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 130,
        sourceLeft: 0,
        sourceWidth: 128,
        sourceHeight: 128
    },
    info1Button: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 2,
        sourceLeft: 128,
        sourceWidth: 128,
        sourceHeight: 128
    },

    infoButtonOpaque: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 128,
        sourceLeft: 128,
        sourceWidth: 128,
        sourceHeight: 128
    },

    infoButtonTrans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 130,
        sourceLeft: 128,
        sourceWidth: 128,
        sourceHeight: 128
    },
    assest3DButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 2,
        sourceLeft: 256,
        sourceWidth: 128,
        sourceHeight: 128
    },
    assestButton3DTrans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 130,
        sourceLeft: 256,
        sourceWidth: 128,
        sourceHeight: 128
    },
    image1Button: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 2,
        sourceLeft: 384,
        sourceWidth: 128,
        sourceHeight: 128
    },
    image1ButtonTrans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 130,
        sourceLeft: 384,
        sourceWidth: 128,
        sourceHeight: 128
    },
    locationButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 2,
        sourceLeft: 512,
        sourceWidth: 128,
        sourceHeight: 128
    },
    locationButtonTrans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 130,
        sourceLeft: 512,
        sourceWidth: 128,
        sourceHeight: 128
    },
    rotateButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 2,
        sourceLeft: 640,
        sourceWidth: 128,
        sourceHeight: 128
    },
    rotateButtonTrans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 130,
        sourceLeft: 640,
        sourceWidth: 128,
        sourceHeight: 128
    },
    scaleButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 2,
        sourceLeft: 768,
        sourceWidth: 128,
        sourceHeight: 128
    },
    scaleButtonTrans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 130,
        sourceLeft: 768,
        sourceWidth: 128,
        sourceHeight: 128
    },
    transformButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 2,
        sourceLeft: 896,
        sourceWidth: 128,
        sourceHeight: 128
    },
    transformButtonTrans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 130,
        sourceLeft: 896,
        sourceWidth: 128,
        sourceHeight: 128
    },
    duplicateButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 258,
        sourceLeft: 0,
        sourceWidth: 128,
        sourceHeight: 128
    },
    duplicateButtonTrans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 386,
        sourceLeft: 0,
        sourceWidth: 128,
        sourceHeight: 128
    },
    undoButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 258,
        sourceLeft: 128,
        sourceWidth: 128,
        sourceHeight: 128
    },
    undoButtonTrans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 386,
        sourceLeft: 128,
        sourceWidth: 128,
        sourceHeight: 128
    },
    gridButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 258,
        sourceLeft: 256,
        sourceWidth: 128,
        sourceHeight: 128
    },
    gridButtonTrans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 386,
        sourceLeft: 256,
        sourceWidth: 128,
        sourceHeight: 128
    },
    godModeButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 258,
        sourceLeft: 384,
        sourceWidth: 128,
        sourceHeight: 128
    },
    snapButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 258,
        sourceLeft: 512,
        sourceWidth: 128,
        sourceHeight: 128
    },
    noSnapButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 386,
        sourceLeft: 512,
        sourceWidth: 128,
        sourceHeight: 128
    },
    carpenterButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 384,
        sourceLeft: 384,
        sourceWidth: 128,
        sourceHeight: 128
    },
    saveButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 258,
        sourceLeft: 640,
        sourceWidth: 128,
        sourceHeight: 128
    },
    saveButtonTrans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 386,
        sourceLeft: 640,
        sourceWidth: 128,
        sourceHeight: 128
    },
    refreshButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 258,
        sourceLeft: 768,
        sourceWidth: 128,
        sourceHeight: 128
    },
    refreshButtonTrans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 386,
        sourceLeft: 768,
        sourceWidth: 128,
        sourceHeight: 128
    },
    trashButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 258,
        sourceLeft: 896,
        sourceWidth: 128,
        sourceHeight: 128
    },
    trashButtonTrans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 386,
        sourceLeft: 896,
        sourceWidth: 128,
        sourceHeight: 128
    },
    inspectorButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 516,
        sourceLeft: 0,
        sourceWidth: 128,
        sourceHeight: 128
    },
    inspectorButtonTrans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 646,
        sourceLeft: 0,
        sourceWidth: 128,
        sourceHeight: 128
    },
    shareButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 516,
        sourceLeft: 128,
        sourceWidth: 128,
        sourceHeight: 128
    },
    shareButtonTrans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 646,
        sourceLeft: 128,
        sourceWidth: 128,
        sourceHeight: 128
    },
    settingsButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 516,
        sourceLeft: 256,
        sourceWidth: 128,
        sourceHeight: 128
    },
    settingsButtonTrans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 646,
        sourceLeft: 256,
        sourceWidth: 128,
        sourceHeight: 128
    },
    loadButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 514,
        sourceLeft: 896,
        sourceWidth: 128,
        sourceHeight: 128
    },
    loadButtonTrans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 642,
        sourceLeft: 896,
        sourceWidth: 128,
        sourceHeight: 128
    },
    playButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 768,
        sourceLeft: 768,
        sourceWidth: 128,
        sourceHeight: 128
    },
    playButtonTrans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 896,
        sourceLeft: 768,
        sourceWidth: 128,
        sourceHeight: 128
    },
    buildButton: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 768,
        sourceLeft: 896,
        sourceWidth: 128,
        sourceHeight: 128
    },
    buildButtonTrans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 896,
        sourceLeft: 896,
        sourceWidth: 128,
        sourceHeight: 128
    },
    pencilEditIcon: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 516,
        sourceLeft: 384,
        sourceWidth: 128,
        sourceHeight: 128
    },
    menuBox1: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 514,
        sourceLeft: 384,
        sourceWidth: 345,
        sourceHeight: 511
    },
    menuBox3: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 774,
        sourceLeft: 0,
        sourceWidth: 331,
        sourceHeight: 200
    },
    xButtonTrans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 0,
        sourceLeft: 844,
        sourceWidth: 30,
        sourceHeight: 30
    },
    upArrowTrans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 0,
        sourceLeft: 874,
        sourceWidth: 30,
        sourceHeight: 30
    },
    downArrowTrans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 0,
        sourceLeft: 904,
        sourceWidth: 30,
        sourceHeight: 30
    },
    leftArrowTrans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 0,
        sourceLeft: 934,
        sourceWidth: 30,
        sourceHeight: 30
    },
    rightArrowTrans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 0,
        sourceLeft: 964,
        sourceWidth: 30,
        sourceHeight: 30
    },
    magnifyGlassTrans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 0,
        sourceLeft: 994,
        sourceWidth: 30,
        sourceHeight: 30
    },
    xButtonNoBlack: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 30,
        sourceLeft: 844,
        sourceWidth: 30,
        sourceHeight: 30
    },
    upArrowNoBlack: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 30,
        sourceLeft: 874,
        sourceWidth: 30,
        sourceHeight: 30
    },
    downArrowNoBlack: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 30,
        sourceLeft: 904,
        sourceWidth: 30,
        sourceHeight: 30
    },
    leftArrowNoBlack: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 30,
        sourceLeft: 934,
        sourceWidth: 30,
        sourceHeight: 30
    },
    rightArrowNoBlack: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 30,
        sourceLeft: 964,
        sourceWidth: 30,
        sourceHeight: 30
    },
    magnifyGlassNoBlack: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 30,
        sourceLeft: 994,
        sourceWidth: 30,
        sourceHeight: 30
    },
    xButtonBlack: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 60,
        sourceLeft: 844,
        sourceWidth: 30,
        sourceHeight: 30
    },
    toggleOnNoBlack: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 60,
        sourceLeft: 874,
        sourceWidth: 30,
        sourceHeight: 30
    },
    toggleOffNoBlack: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 60,
        sourceLeft: 904,
        sourceWidth: 30,
        sourceHeight: 30
    },
    toggleOffTrans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 60,
        sourceLeft: 934,
        sourceWidth: 30,
        sourceHeight: 30
    },
    toggleOnTrans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 60,
        sourceLeft: 964,
        sourceWidth: 30,
        sourceHeight: 30
    },
    magnifyGlassBlack: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 60,
        sourceLeft: 994,
        sourceWidth: 30,
        sourceHeight: 30
    },
    toggleOffBlack: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 90,
        sourceLeft: 934,
        sourceWidth: 30,
        sourceHeight: 30
    },
    toggleOnBlack: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 90,
        sourceLeft: 964,
        sourceWidth: 30,
        sourceHeight: 30
    },
    upArrowBlack: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 120,
        sourceLeft: 844,
        sourceWidth: 30,
        sourceHeight: 30
    },
    downArrowBlack: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 120,
        sourceLeft: 874,
        sourceWidth: 30,
        sourceHeight: 30
    },
    leftArrowBlack: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 120,
        sourceLeft: 904,
        sourceWidth: 30,
        sourceHeight: 30
    },
    rightArrowBlack: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 120,
        sourceLeft: 934,
        sourceWidth: 30,
        sourceHeight: 30
    },
    upArrow2Trans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 150,
        sourceLeft: 844,
        sourceWidth: 30,
        sourceHeight: 30
    },
    downArrow2Trans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 150,
        sourceLeft: 874,
        sourceWidth: 30,
        sourceHeight: 30
    },
    leftArrow2Trans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 150,
        sourceLeft: 904,
        sourceWidth: 30,
        sourceHeight: 30
    },
    rightArrow2Trans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 150,
        sourceLeft: 934,
        sourceWidth: 30,
        sourceHeight: 30
    },
    upArrow3Trans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 150,
        sourceLeft: 964,
        sourceWidth: 30,
        sourceHeight: 30
    },
    downArrow3Trans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 150,
        sourceLeft: 994,
        sourceWidth: 30,
        sourceHeight: 30
    },
    rotateRightArrowTrans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 180,
        sourceLeft: 844,
        sourceWidth: 30,
        sourceHeight: 30
    },
    rotateLeftArrowTrans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 180,
        sourceLeft: 874,
        sourceWidth: 30,
        sourceHeight: 30
    },
    rotateRightArrow2Trans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 180,
        sourceLeft: 904,
        sourceWidth: 30,
        sourceHeight: 30
    },
    rotateLeftArrow2Trans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 180,
        sourceLeft: 904,
        sourceWidth: 30,
        sourceHeight: 30
    },
    leftArrow3Trans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 180,
        sourceLeft: 964,
        sourceWidth: 30,
        sourceHeight: 30
    },
    rightArrow3Trans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 180,
        sourceLeft: 994,
        sourceWidth: 30,
        sourceHeight: 30
    },
    rotateXArrowTrans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 210,
        sourceLeft: 844,
        sourceWidth: 30,
        sourceHeight: 30
    },
    rotateXArrow2Trans: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 210,
        sourceLeft: 874,
        sourceWidth: 30,
        sourceHeight: 30
    },
    oneButtonClick: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 877,
        sourceLeft: 899,
        sourceWidth: 30,
        sourceHeight: 30
    },
    twoButtonClick: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 877,
        sourceLeft: 929,
        sourceWidth: 30,
        sourceHeight: 30
    },
    threeButtonClick: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 877,
        sourceLeft: 959,
        sourceWidth: 30,
        sourceHeight: 30
    },
    fourButtonClick: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 877,
        sourceLeft: 989,
        sourceWidth: 30,
        sourceHeight: 30
    },

    eButtonClick: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 210,
        sourceLeft: 964,
        sourceWidth: 30,
        sourceHeight: 30
    },
    fButtonClick: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 210,
        sourceLeft: 994,
        sourceWidth: 30,
        sourceHeight: 30
    },
    wButtonClick: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 210,
        sourceLeft: 843,
        sourceWidth: 30,
        sourceHeight: 30
    },

    lockedIcon: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 847,
        sourceLeft: 899,
        sourceWidth: 30,
        sourceHeight: 30
    },

    unlockedIcon: {
        atlasHeight: 1024,
        atlasWidth: 1024,
        sourceTop: 847,
        sourceLeft: 929,
        sourceWidth: 30,
        sourceHeight: 30
    },


}


export enum UI_VIEW_TYPES {
    MAIN_VIEW = 'Main',
    SKINNY_VERTICAL_PANEL = 'Skinny'
}