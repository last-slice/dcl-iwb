import { InputAction, PointerEventType } from "@dcl/sdk/ecs"
import { buttonsPressed } from "./inputListeners"
import { log } from "../../helpers/functions"
import { localUserId, players } from "../player/player"
import { SCENE_MODES, SERVER_MESSAGE_TYPES } from "../../helpers/types"
import { sendServerMessage } from "../messaging"

export let shortCutsEnabled:Map<string,boolean> = new Map()

export function checkShortCuts(){
    shortcutDefinitions.forEach((cut)=>{
        if(!shortCutsEnabled.has(cut.name)){
            shortCutsEnabled.set(cut.name, true)

            let required = cut.buttons.length
            let count = 0

            cut.buttons.forEach((button:any) => {
                if(buttonsPressed.get(button).id === PointerEventType.PET_DOWN){
                    count++
                }
            });

            if(count === required){
                cut.fn()
            }else{
                clearShortcut(cut.name)
            }
        }
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
    }
]

