import { InputAction, PointerEventType } from "@dcl/sdk/ecs"
import { buttonsPressed } from "./inputListeners"
import { log } from "../../helpers/functions"
import { localUserId, players, setPlayMode } from "../player/player"
import { SCENE_MODES, SERVER_MESSAGE_TYPES } from "../../helpers/types"
import { sendServerMessage } from "../messaging"
import { displayCatalogPanel, showCatalogPanel } from "../../ui/Panels/CatalogPanel"

export let shortCutsEnabled:Map<string,boolean> = new Map()

export function checkShortCuts(){
    shortcutDefinitions.forEach((cut)=>{
        // if(!shortCutsEnabled.has(cut.name)){

            let required = cut.buttons.length
            let count = 0

            cut.buttons.forEach((button:any) => {
                if(buttonsPressed.get(button).id === PointerEventType.PET_DOWN){
                    count++
                }
            });

            if(count === required){
                // shortCutsEnabled.set(cut.name, true)
                cut.fn()
            }
        // }
    })
}

export function clearShortcut(name:string){
    log('clearing shortcut', name)
    shortCutsEnabled.delete(name)
}

let shortcutDefinitions:any[] = [
    {
        name:"AddParcel",
        buttons:[InputAction.IA_SECONDARY],
        fn:()=>{
            if(players.has(localUserId) && players.get(localUserId)!.mode === SCENE_MODES.CREATE_SCENE_MODE){
                sendServerMessage(SERVER_MESSAGE_TYPES.SELECT_PARCEL, {player:localUserId, parcel:players.get(localUserId)!.currentParcel})
            }
            clearShortcut('AddParcel')
        }
    },
    {
        name:"TogglePlayMode",
        buttons:[InputAction.IA_SECONDARY, InputAction.IA_WALK],
        fn:()=>{
            let player = players.get(localUserId)
            if(player){
                let mode = player.mode
                if(mode === SCENE_MODES.PLAYMODE){
                    setPlayMode(localUserId, SCENE_MODES.BUILD_MODE)
                }else{
                    setPlayMode(localUserId, SCENE_MODES.PLAYMODE)
                }
            }
            clearShortcut('TogglePlayMode')
        }
    },
    {
        name:"ToggleCatalog",
        buttons:[InputAction.IA_PRIMARY, InputAction.IA_WALK],
        fn:()=>{
            displayCatalogPanel(!showCatalogPanel)
            clearShortcut('ToggleCatalog')
        }
    }
]

