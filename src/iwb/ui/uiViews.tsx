import { deleteRealmAsset } from "../components/Catalog"
import { sendServerMessage } from "../components/Colyseus"
import { localPlayer, worldTravel } from "../components/Player"
import { SERVER_MESSAGE_TYPES } from "../helpers/types"
import { deleteSelectedItem, selectedAssetId } from "../modes/Build"
import { displayMainView, updateMainView } from "./Objects/IWBView"
import { showTutorials, updateInfoView } from "./Objects/IWBViews/InfoView"
import { displaySceneDetailsPanel, scene } from "./Objects/SceneMainDetailPanel"
import { customFunction, customFunction2, displaySkinnyVerticalPanel, updateShowOverride } from "./Reuse/SkinnyVerticalPanel"
import { UI_VIEW_TYPES } from "./uiConfig"

export function getView(view:string){
    let v = uiViews.find($=> $.view === view)
    return v ? v.props : undefined
}

export function buildPopupActionView(actionData:any){
    let data:any = {
        view:"Popup"
    }

    return data
}

export let uiViews:any[] = [
    {
        view:"Main",
        props:{
            display:UI_VIEW_TYPES.MAIN_VIEW,
        }
    },
    {
        view:"Welcome",
        props:{
            label:"Welcome to\nIn World Builder",
            text:"Begin building inside Decentraland or visit our guided tutorial section!",
            // slug:"welcome-view",//
            // view:"welcome",
            display:UI_VIEW_TYPES.SKINNY_VERTICAL_PANEL,
            buttons:[
                {
                    label:"Start Building",
                    func:async ()=>{
                        await updateShowOverride(false)
                        displaySkinnyVerticalPanel(false)
                        sendServerMessage(SERVER_MESSAGE_TYPES.FIRST_TIME, {})
                    }
                },
                {
                    label:"Tutorials",
                    func:async ()=>{
                        await updateShowOverride(false)
                        displaySkinnyVerticalPanel(true, getView("Tutorials"))
                    }
                }
            ]
        }
    },
    {
        view:"Tutorials",
        props:{
            label:"IWB Tutorials",
            text:"IWB Tutorials",
            // slug:"tutorial-view",
            // view:"tutorials",
            display:UI_VIEW_TYPES.SKINNY_VERTICAL_PANEL,
            buttons:[
                {
                    label:"Start Tutorials",
                    func:()=>{
                        displaySkinnyVerticalPanel(false)
                        // sendServerMessage(SERVER_MESSAGE_TYPES.FIRST_TIME, {})
                    }
                },
                {
                    label:"Close",
                    func:()=>{
                        displaySkinnyVerticalPanel(false)
                    }
                }
            ]
        }
    },
    {
        view:"Confirm Delete Entity",
        props:{
            label:"Delete Item",
            text:"Are you sure you want to delete this item?",
            // slug:"welcome-view",//
            // view:"welcome",
            display:UI_VIEW_TYPES.SKINNY_VERTICAL_PANEL,
            buttons:[
                {
                    label:"Delete",
                    func:(aid:string)=>{
                        displaySkinnyVerticalPanel(false)
                        deleteSelectedItem(selectedAssetId)
                    }
                },
                {
                    label:"Cancel",
                    func:()=>{
                        displaySkinnyVerticalPanel(false)
                    }
                }
            ]
        }
    },
    {
        view:"Confirm_Delete_Grabbed",
        props:{
            label:"Delete Item",
            text:"Are you sure you want to delete this item?",
            // slug:"welcome-view",//
            // view:"welcome",
            display:UI_VIEW_TYPES.SKINNY_VERTICAL_PANEL,
            buttons:[
                {
                    label:"Delete",
                    func:()=>{
                        customFunction()
                    }
                },
                {
                    label:"Cancel",
                    func:()=>{
                        displaySkinnyVerticalPanel(false)
                    }
                }
            ]
        }
    },
    {
        view:"Clear Scene",
        props:{
            label:"Clear Scene",
            text:"Are you sure you want to clear this build? All assets will be removed from this scene.",
            // slug:"welcome-view",//
            // view:"welcome",
            display:UI_VIEW_TYPES.SKINNY_VERTICAL_PANEL,
            buttons:[
                {
                    label:"Delete",
                    func:()=>{
                        displaySkinnyVerticalPanel(false)
                        sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_CLEAR_ASSETS, {sceneId: localPlayer.activeScene!.id})
                    }
                },
                {
                    label:"Cancel",
                    func:()=>{
                        displaySkinnyVerticalPanel(false)
                    }
                }
            ]
        }
    },
    {
        view:"Confirm Delete Scene",
        props:{
            label:"Delete Scene",
            text:"Are you sure you want to delete this build? Any builders who have not saved will lose ALL progress!",
            // slug:"welcome-view",//
            // view:"welcome",
            display:UI_VIEW_TYPES.SKINNY_VERTICAL_PANEL,
            buttons:[
                {
                    label:"Delete",
                    func:()=>{
                        displaySkinnyVerticalPanel(false)
                        sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_DELETE, {sceneId: scene && scene.id})
                    }
                },
                {
                    label:"Cancel",
                    func:()=>{
                        displaySkinnyVerticalPanel(false)
                        displaySceneDetailsPanel(true, scene)
                    }
                }
            ]
        }
    },
    {
        view:"World Travel",
        props:{
            label:"World Travel",
            text:"Would you like to visit this creator world?",
            // slug:"welcome-view",//
            // view:"welcome",
            display:UI_VIEW_TYPES.SKINNY_VERTICAL_PANEL,
            buttons:[
                {
                    label:"Continue",
                    func:(data:any)=>{
                        displaySkinnyVerticalPanel(false)
                        customFunction()
                    }
                },
                {
                    label:"Cancel",
                    func:()=>{
                        displaySkinnyVerticalPanel(false)
                    }
                }
            ]
        }
    },
    {
        view:"Deployment_Ready",
        props:{
            label:"Deployment Ready!",
            text:"Your deployment is ready! Please click the button to sign your deployment.",
            // slug:"welcome-view",//
            // view:"welcome",
            display:UI_VIEW_TYPES.SKINNY_VERTICAL_PANEL,
            buttons:[
                {
                    label:"Sign",
                    func:(data:any)=>{
                        displaySkinnyVerticalPanel(false)
                        customFunction()
                    }
                },
                {
                    label:"Cancel",
                    func:()=>{
                        displaySkinnyVerticalPanel(false)
                    }
                }
            ]
        }
    },
    {
        view:"Deployment_Ready_Teleport",
        props:{
            label:"Deployment Finished!",
            text:"Your deployment is live! Would you like to teleport now?",
            // slug:"welcome-view",//
            // view:"welcome",
            display:UI_VIEW_TYPES.SKINNY_VERTICAL_PANEL,
            buttons:[
                {
                    label:"Go",
                    func:(data:any)=>{
                        displaySkinnyVerticalPanel(false)
                        customFunction()
                    }
                },
                {
                    label:"Cancel",
                    func:()=>{
                        displaySkinnyVerticalPanel(false)
                        customFunction2()
                    }
                }
            ]
        }
    },
    {
        view:"Init_World",
        props:{
            label:"Initialize World",
            text:"To begin building in this world, you must initiate it.",
            // slug:"welcome-view",//
            // view:"welcome",
            display:UI_VIEW_TYPES.SKINNY_VERTICAL_PANEL,
            buttons:[
                {
                    label:"Continue",
                    func:(data:any)=>{
                        displaySkinnyVerticalPanel(false)
                        customFunction()
                    }
                },
                {
                    label:"Cancel",
                    func:()=>{
                        displaySkinnyVerticalPanel(false)
                    }
                }
            ]
        }
    },
    {
        view:"Init_World_Ready",
        props:{
            label:"World Ready!",
            text:"Your world is deployed. Join now to start building!",
            // slug:"welcome-view",//
            // view:"welcome",
            display:UI_VIEW_TYPES.SKINNY_VERTICAL_PANEL,
            buttons:[
                {
                    label:"Join",
                    func:(data:any)=>{
                        displaySkinnyVerticalPanel(false)
                        customFunction()
                    }
                },
                {
                    label:"Cancel",
                    func:()=>{
                        displaySkinnyVerticalPanel(false)
                    }
                }
            ]
        },
    },
    {
        view:"Delete_Realm_Asset",
        props:{
            label:"Delete Asset",
            text:"Are you sure you want to delete this asset?",
            // slug:"welcome-view",//
            // view:"welcome",
            display:UI_VIEW_TYPES.SKINNY_VERTICAL_PANEL,
            buttons:[
                {
                    label:"Delete",
                    func:()=>{
                        displaySkinnyVerticalPanel(false)
                        customFunction()
                    }
                },
                {
                    label:"Cancel",
                    func:()=>{
                        customFunction2()
                    }
                }
            ]
        }
    },
    {
        view:"Upload_Assets",
        props:{
            label:"Upload Asset",
            text:"To upload assets, please click on the link below to launch the Asset Uploader,",
            // slug:"welcome-view",//
            // view:"welcome",
            display:UI_VIEW_TYPES.SKINNY_VERTICAL_PANEL,
            buttons:[
                {
                    label:"Upload",
                    func:(data:any)=>{
                        displaySkinnyVerticalPanel(false)
                        customFunction()
                    }
                },
                {
                    label:"Cancel",
                    func:()=>{
                        displaySkinnyVerticalPanel(false)
                    }
                }
            ]
        }
    },
    {
        view:"Delete_Game",
        props:{
            label:"Delete Game",
            text:"This will remove all levels and entities attached to your game.",
            // slug:"welcome-view",//
            // view:"welcome",
            display:UI_VIEW_TYPES.SKINNY_VERTICAL_PANEL,
            buttons:[
                {
                    label:"Delete",
                    func:(data:any)=>{
                        displaySkinnyVerticalPanel(false)
                        customFunction()
                    }
                },
                {
                    label:"Cancel",
                    func:()=>{
                        displaySkinnyVerticalPanel(false)
                    }
                }
            ]
        }
    },
    {
        view:"Welcome_Screen",
        props:{
            label:"Welcome to In World Builder",
            text:"Begin building inside Decentraland or visit our guided tutorial section!",
            // slug:"welcome-view",//
            // view:"welcome",
            display:UI_VIEW_TYPES.SKINNY_VERTICAL_PANEL,
            buttons:[
                {
                    label:"Tutorials",
                    func:()=>{
                        updateShowOverride(false)
                        displaySkinnyVerticalPanel(false)
                        displayMainView(true)
                        updateMainView("Info")
                        updateInfoView("Help")
                        updateInfoView("Tutorials")
                        showTutorials()
                    }
                },
                {
                    label:"Build!",
                    func:()=>{
                        updateShowOverride(false)
                        displaySkinnyVerticalPanel(false)
                    }
                }
            ]
        }
    },
    {
        view:"Popup_Action",
        props:{
            label:"",
            text:"",
            display:UI_VIEW_TYPES.SKINNY_VERTICAL_PANEL,
            buttons:[
                {
                    label:"",
                    func:(data:any)=>{
                        displaySkinnyVerticalPanel(false)
                        try{
                            customFunction()
                        }
                        catch(e){
                            console.log('custom function button error',e)
                        }
                    }
                },
                {
                    label:"",
                    func:()=>{
                        displaySkinnyVerticalPanel(false)
                        try{
                            customFunction2()
                        }
                        catch(e){
                            console.log('custom function2 button error',e)
                        }
                    }
                }
            ]
        }
    },
    {
        view:"End_Game",
        props:{
            label:"Are you sure you want to end game play?",
            text:"",
            display:UI_VIEW_TYPES.SKINNY_VERTICAL_PANEL,
            buttons:[
                {
                    label:"End Game",
                    func:(data:any)=>{
                        displaySkinnyVerticalPanel(false)
                        try{
                            customFunction()
                        }
                        catch(e){
                            console.log('custom function button error',e)
                        }
                    }
                },
                {
                    label:"Cancel",
                    func:()=>{
                        displaySkinnyVerticalPanel(false)
                        try{
                            customFunction2()
                        }
                        catch(e){
                            console.log('custom function2 button error',e)
                        }
                    }
                }
            ]
        }
    },
    {
        view:"Confirm_World_Export",
        props:{
            label:"Confirm Export",
            text:"Are you sure you want to export this world to this DCL Name?",
            // slug:"welcome-view",//
            // view:"welcome",
            display:UI_VIEW_TYPES.SKINNY_VERTICAL_PANEL,
            buttons:[
                {
                    label:"Export",
                    func:(data:any)=>{
                        displaySkinnyVerticalPanel(false)
                        customFunction()
                    }
                },
                {
                    label:"Cancel",
                    func:()=>{
                        displaySkinnyVerticalPanel(false)
                        customFunction2()
                    }
                }
            ]
        }
    },
    {
        view:"Scene_Download_Ready",
        props:{
            label:"Download Ready",
            text:"Your download is ready! Please click the button to download your scene zip file.",
            // slug:"welcome-view",//
            // view:"welcome",
            display:UI_VIEW_TYPES.SKINNY_VERTICAL_PANEL,
            buttons:[
                {
                    label:"Download",
                    func:(data:any)=>{
                        displaySkinnyVerticalPanel(false)
                        customFunction()
                    }
                },
                {
                    label:"Cancel",
                    func:()=>{
                        displaySkinnyVerticalPanel(false)
                    }
                }
            ]
        }
    },
    {
        view:"Word_Export_Ready",
        props:{
            label:"Deployment Ready",
            text:"Your deployment is ready! Please click the button to sign your deployment.",
            // slug:"welcome-view",//
            // view:"welcome",
            display:UI_VIEW_TYPES.SKINNY_VERTICAL_PANEL,
            buttons:[
                {
                    label:"Sign",
                    func:(data:any)=>{
                        displaySkinnyVerticalPanel(false)
                        customFunction()
                    }
                },
                {
                    label:"Cancel",
                    func:()=>{
                        displaySkinnyVerticalPanel(false)
                    }
                }
            ]
        }
    },
]