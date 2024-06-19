import { sendServerMessage } from "../components/Colyseus"
import { localPlayer, worldTravel } from "../components/Player"
import { SERVER_MESSAGE_TYPES } from "../helpers/types"
import { deleteSelectedItem, selectedAssetId } from "../modes/Build"
import { displayMainView } from "./Objects/IWBView"
import { displaySceneDetailsPanel, scene } from "./Objects/SceneMainDetailPanel"
import { customFunction, displaySkinnyVerticalPanel } from "./Reuse/SkinnyVerticalPanel"
import { UI_VIEW_TYPES } from "./uiConfig"

export function getView(view:string){
    let v = uiViews.find($=> $.view === view)
    return v ? v.props : undefined
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
                    func:()=>{
                        displaySkinnyVerticalPanel(false)
                        sendServerMessage(SERVER_MESSAGE_TYPES.FIRST_TIME, {})
                    }
                },
                {
                    label:"Tutorials",
                    func:()=>{
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
        view:"Clear Scene",
        props:{
            label:"Clear Scene",
            text:"Are you sure you want to clear this build? All assets will be removed from this scene.",
            // slug:"welcome-view",
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
]