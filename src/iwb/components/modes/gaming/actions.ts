import { CustomCounter } from "../../../../ui_components/UICounter";


export function changeNumber(variable:any, value:number, ui:CustomCounter){
    console.log('changeNumber', variable, value, ui)
    variable += value
    ui.increaseNumberBy(value)
}