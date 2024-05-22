import { sendServerMessage } from "../components/Colyseus"
import { SERVER_MESSAGE_TYPES } from "../helpers/types"
import { displaySkinnyVerticalPanel } from "./Reuse/SkinnyVerticalPanel"
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
    }
]